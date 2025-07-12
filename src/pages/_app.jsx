import 'focus-visible';
import '@/styles/tailwind.css';
import '@tremor/react/dist/esm/tremor.css';
import '@/styles/markdown.css'; 
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Context } from '../context';
import { useEffect, useState } from 'react';
import request from '@/utils/request';
import { Analytics } from "@vercel/analytics/react"
import { usePathname, useRouter } from 'next/navigation';


export default function App({ Component, pageProps }) {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [accountType, setAccountType] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [points, setPoints] = useState(0);
  const path = usePathname();
  const router = useRouter();

  const appState = {
    role, setRole,
    accountType, setAccountType,
    username, setUsername,
    profilePic, setProfilePic,
    points, setPoints
  };

  const fetchUser = async () => {
    // Check if user has a token before making the request
    const getCookie = () => {
      try {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; idToken=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
      } catch (error) {
        return "";
      }
      return "";
    };

    const token = getCookie();
    if (!token) {
      // No token, user is not authenticated - don't make the API call
      return;
    }

    const url = process.env.NEXT_PUBLIC_API_URL + "/account";
    const user = await request(url, "GET", null);

    if (user && user.username) {
      setRole(user.role);
      setUsername(user.username);
      setProfilePic(user.profileImage);
      setAccountType(user.accountType);
      setPoints(user.points);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID} scope="email profile openid">
    <Context.Provider value={appState}>
      <Component {...pageProps} />
      <Analytics />

    </Context.Provider>
  </GoogleOAuthProvider>
}
