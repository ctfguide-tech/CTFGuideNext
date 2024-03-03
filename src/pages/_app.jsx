import 'focus-visible';
import '@/styles/tailwind.css';
import '@tremor/react/dist/esm/tremor.css';
import '@/config/jwt';

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
