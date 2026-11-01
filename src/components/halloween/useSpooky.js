import { useEffect, useState } from 'react';

// Halloween theme: cosmetic only. It switches on automatically from
// Oct 15 through Nov 1, and each user can turn it off or back on.
//   ?spooky=1  forces it on (handy for previews outside the season)
//   ?spooky=0  forces it off
const STORAGE_KEY = 'ctfguide:spooky';
const EVENT = 'ctfguide:spooky-change';

export function isHalloweenSeason(date = new Date()) {
  const month = date.getMonth(); // 0-indexed
  const day = date.getDate();
  return (month === 9 && day >= 15) || (month === 10 && day <= 1);
}

function readPreference() {
  try {
    const param = new URLSearchParams(window.location.search).get('spooky');
    if (param === '1' || param === '0') {
      window.localStorage.setItem(STORAGE_KEY, param === '1' ? 'on' : 'off');
    }
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

/**
 * Returns { inSeason, enabled, setEnabled }.
 * `inSeason` is true when the date is in range or the user forced it on with ?spooky=1.
 * `enabled` is false during SSR and the first render, so nothing changes hydration.
 */
export default function useSpooky() {
  const [state, setState] = useState({ inSeason: false, enabled: false });

  useEffect(() => {
    const sync = () => {
      const pref = readPreference();
      const inSeason = isHalloweenSeason() || pref === 'on';
      setState({ inSeason, enabled: inSeason && pref !== 'off' });
    };
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const setEnabled = (on) => {
    try {
      // During the season "on" is the default, so clear the key rather than
      // store "on". A stored "on" would keep the theme past Nov 1.
      if (on && isHalloweenSeason()) window.localStorage.removeItem(STORAGE_KEY);
      else window.localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off');
    } catch {}
    // Keep the season open after a preview so the toggle can still turn it back on.
    setState((s) => ({ inSeason: s.inSeason || on, enabled: on }));
    window.dispatchEvent(new Event(EVENT));
  };

  return { ...state, setEnabled };
}
