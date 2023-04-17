import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import Report from '../components/dashboard/Report';

export default function ComingSoon() {
  return (
    <>
      <Head>
        <title>Report a bug</title>
        <style>
          @import
          url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
        </style>
      </Head>
      <StandardNav />
      <Report />
    </>
  );
}
