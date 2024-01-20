import 'focus-visible';
import '@/styles/tailwind.css';
import '@tremor/react/dist/esm/tremor.css';
import { useEffect } from 'react';
import { getAuth } from 'firebase/auth';

export default function App({ Component, pageProps }) {
  const auth = getAuth();

  const updateAuthToken = async () => {
    try {
      console.log("Updating auth token");
      const idToken = await auth.currentUser.getIdToken(true);
      document.cookie = `idToken=${idToken}; path=/; SameSite=None; Secure`;
    } catch(err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if(auth.currentUser) {
      updateAuthToken();
      const intervalId = setInterval(() => {
        updateAuthToken();
      }, 14 * 60 * 1000);
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [auth]);

  return <Component {...pageProps} />;
}
