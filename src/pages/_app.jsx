import 'focus-visible';
import '@/styles/tailwind.css';
import '@tremor/react/dist/esm/tremor.css';
import '@/styles/markdown.css'; 
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Context } from '../context';
import { useEffect, useState } from 'react';
import request from '@/utils/request';

export default function App({ Component, pageProps }) {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [profilePic, setProfilePic] = useState('');

  const appState = {
    role, setRole,
    username, setUsername,
    profilePic, setProfilePic,
  };

  const fetchUser = async () => {
    const url = process.env.NEXT_PUBLIC_API_URL + "/account";
    const user = await request(url, "GET", null);
    if (user && user.username) {
      setRole(user.role);
      setUsername(user.username);
      setProfilePic(user.profileImage);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID} scope="email profile openid">
    <Context.Provider value={appState}>
      <Component {...pageProps} />;
    </Context.Provider>
  </GoogleOAuthProvider>
}
