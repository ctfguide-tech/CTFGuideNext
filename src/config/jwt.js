import '@/config/firebaseConfig';

import { getAuth } from 'firebase/auth';
const auth = getAuth();

const checkAuthToken = () => {
 const cookies = document.cookie.split(';').map(cookie => cookie.trim().split('=')[0]);
 return cookies.includes('idToken');
}

const updateAuthToken = async (auth) => {
  try {

    if(auth.currentUser && checkAuthToken()) {
      console.log("Generating new token");
      const idToken = await auth.currentUser.getIdToken(true);
      document.cookie = `idToken=${idToken}; SameSite=None; Secure; Path=/`;
    }

  } catch(err) {
    console.log(err);
  }
}


// I changed 1000 to 10000 temp
const updateAuthTokenInterval = (auth) => {
  const intervalId = setInterval(() => {
    updateAuthToken(auth);
  }, 10 * 60 * 100000);
  return () => {
    clearInterval(intervalId);
  };
}

updateAuthTokenInterval(auth);
