import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';

export default function ComingSoon() {
  return (
    <>
      <Head>
        <title>Coming Soon - CTFGuide</title>
        <style>
          @import
          url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
        </style>
      </Head>
      <StandardNav /> 

      <div>

    <div className='container'>

      <h1 className='text-white text-2xl  text-center font-semibold'>

        You are not enrolled in a university.

      </h1>
    </div>
    </div>
      <Footer />
    </>
  );
}
