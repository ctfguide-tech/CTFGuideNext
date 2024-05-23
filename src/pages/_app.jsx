import 'focus-visible';
import '@/styles/tailwind.css';
import '@tremor/react/dist/esm/tremor.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function App({ Component, pageProps }) {
  return <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID} scope="email profile openid">
    <Component {...pageProps} />;
  </GoogleOAuthProvider>
}
