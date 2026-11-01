import { useEffect, useState } from 'react';
import useSpooky from './useSpooky';

// Purely cosmetic Halloween layer, mounted once in _app.
// Everything except the toggle pill uses pointer-events: none, so it never
// blocks the page underneath. Animations stop under prefers-reduced-motion
// (see .spooky-* rules in tailwind.css).

const BATS = [
  { top: '12%', delay: '0s', duration: '18s', scale: 1 },
  { top: '22%', delay: '6s', duration: '23s', scale: 0.7 },
  { top: '8%', delay: '11s', duration: '20s', scale: 0.55 },
  { top: '30%', delay: '15s', duration: '26s', scale: 0.85 },
];

function Bat({ style }) {
  return (
    <div className="spooky-bat" style={style}>
      <svg viewBox="0 0 64 32" width="56" height="28" aria-hidden="true">
        <g className="spooky-bat-wings" fill="#3b0764" stroke="#f97316" strokeOpacity="0.55" strokeWidth="0.9">
          <path d="M32 14c-2-4-6-6-10-5 1-3 0-5-2-6-1 4-5 6-9 5 1 2 0 4-3 5 5 0 9 3 11 7 2-2 5-3 8-2 2-1 4-2 5-4z" />
          <path d="M32 14c2-4 6-6 10-5-1-3 0-5 2-6 1 4 5 6 9 5-1 2 0 4 3 5-5 0-9 3-11 7-2-2-5-3-8-2-2-1-4-2-5-4z" />
        </g>
        <ellipse cx="32" cy="15" rx="3" ry="4" fill="#2e1065" />
        <circle cx="30.8" cy="13.6" r="0.7" fill="#fb923c" />
        <circle cx="33.2" cy="13.6" r="0.7" fill="#fb923c" />
      </svg>
    </div>
  );
}

function Spider() {
  return (
    <div className="spooky-spider" aria-hidden="true">
      <div className="spooky-thread" />
      <svg viewBox="0 0 40 40" width="28" height="28">
        <g stroke="#525252" strokeWidth="1.6" fill="none" strokeLinecap="round">
          <path d="M14 18 6 12 2 16M14 21 5 21 1 25M15 24 7 30 5 36M26 18l8-6 4 4M26 21h9l4 4M25 24l8 6 2 6" />
        </g>
        <ellipse cx="20" cy="22" rx="7" ry="8" fill="#3f3f46" stroke="#f97316" strokeOpacity="0.4" />
        <circle cx="20" cy="13" r="4.5" fill="#3f3f46" />
        <circle cx="18.3" cy="12.4" r="1" fill="#f97316" />
        <circle cx="21.7" cy="12.4" r="1" fill="#f97316" />
      </svg>
    </div>
  );
}

function Cobweb({ className }) {
  return (
    <svg className={className} viewBox="0 0 120 120" width="120" height="120" aria-hidden="true">
      <g stroke="#a3a3a3" strokeOpacity="0.18" strokeWidth="0.8" fill="none">
        <path d="M0 0 120 120M0 0 60 120M0 0 120 60M0 0 0 120M0 0 120 0" />
        <path d="M0 22q12-2 16 4 4-8 6-26" />
        <path d="M0 44q24-4 32 8 8-16 12-52" />
        <path d="M0 68q36-6 48 12 12-24 20-80" />
        <path d="M0 94q48-8 64 16 16-32 28-110" />
      </g>
    </svg>
  );
}

export default function SpookyOverlay() {
  const { inSeason, enabled, setEnabled } = useSpooky();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    document.documentElement.classList.toggle('spooky', enabled);
    return () => document.documentElement.classList.remove('spooky');
  }, [enabled]);

  if (!mounted || !inSeason) return null;

  return (
    <>
      {enabled && (
        <div className="spooky-layer" aria-hidden="true">
          <div className="spooky-vignette" />
          <div className="spooky-fog spooky-fog-a" />
          <div className="spooky-fog spooky-fog-b" />
          <Cobweb className="spooky-web spooky-web-left" />
          <Cobweb className="spooky-web spooky-web-right" />
          <Spider />
          {BATS.map((b, i) => (
            <Bat
              key={i}
              style={{
                top: b.top,
                animationDelay: b.delay,
                animationDuration: b.duration,
                '--bat-scale': b.scale,
              }}
            />
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => setEnabled(!enabled)}
        className="spooky-toggle"
        title={enabled ? 'Turn off Halloween effects' : 'Turn on Halloween effects'}
        aria-pressed={enabled}
      >
        <span className={enabled ? 'spooky-toggle-icon' : 'spooky-toggle-icon opacity-50 grayscale'}>🎃</span>
        <span className="hidden sm:inline">{enabled ? 'Happy Halloween!' : 'Spooky mode off'}</span>
      </button>
    </>
  );
}
