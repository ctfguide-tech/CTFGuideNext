import '@/config/firebaseConfig';

import { getAuth } from 'firebase/auth';
const auth = getAuth();

let cookie;
if(process.env.NEXT_PUBLIC_API_URL.includes('localhost')) {
  cookie = ` SameSite=Lax; Domain=.localhost; Path=/`;
} else {
  let url = process.env.NEXT_PUBLIC_API_URL.replace('https://', '').replace('/','');
  cookie = ` SameSite=None; Secure; Domain=.${url}; Path=/`;
}

const checkAuthToken = () => {
 const cookies = document.cookie.split(';').map(cookie => cookie.trim().split('=')[0]);
 return cookies.includes('idToken');
}

const updateAuthToken = async (auth) => {
  try {

    if(auth.currentUser && checkAuthToken()) {
      console.log("Generating new token");
      const idToken = await auth.currentUser.getIdToken(true);
      document.cookie = `idToken=${idToken};` + cookie;
    }

  } catch(err) {
    console.log(err);
  }
}

const updateAuthTokenInterval = (auth) => {
  const intervalId = setInterval(() => {
    updateAuthToken(auth);
  }, 10 * 60 * 1000);
  return () => {
    clearInterval(intervalId);
  };
}

updateAuthTokenInterval(auth);
