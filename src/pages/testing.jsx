import Link from 'next/link';
import Head from 'next/head';
import { Logo } from '@/components/Logo';

const NotFound = () => {
  return (
    <>
      <Head>
        <title>Testing Page</title>
        <meta
          name="description"
          content="Cybersecurity made easy for everyone"
        />
        <style>
          @import
          url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
        </style>
      </Head>
      <div className="grid h-screen place-items-center place-items-center hidden">
        <div className='text-white'>   
                <h1 className='text-6xl mb-3 text-center mx-auto'> <i class="fas fa-circle-notch fa-spin"></i></h1>
                <h1 className='text-3xl'>Setting up your container...</h1>
              
        </div>

     


      </div>


      <div className='bg-black text-white w-full flex px-4'> 
        <h1>Username: <span id="username"><i class="fas fa-circle-notch fa-spin"></i></span> Password: <span id="password"><i class="fas fa-circle-notch fa-spin"></i></span></h1>
    
        <div className='ml-auto text-white'>
          CTFGuide Container
        </div>
    
      </div>


      <iframe className="bg-white w-full h-full" src="https://fonty.ctfguide.com/ctfterminal/abhi-3005/">

</iframe>
    </>
  );
};

export default NotFound;
