import Head from 'next/head';

import { Footer } from '@/components/Footer';
import { useEffect } from 'react';
import { Header } from '@/components/Header';
import PersonCard from '@/components/PersonCard';
// lazy load
import dynamic from 'next/dynamic';

export default function Careers() {
  /*
        Code to check if onboarding has been complete
      */

  {
    /* Each person will be an object in an array team */
  }


  const listings = [
    {
      team: 'Web Team',
      position: 'Full-Time',
      roleName: 'UI/UX Team Lead',
      listingPosted: 'Feb 8th',
      type: 'Remote',
    },
    {
      team: 'Engineering Back-End',
      position: 'Full-Time',
      roleName: 'Data Analyst/Engineer',
      listingPosted: 'Feb 11th',
      type: 'Remote',
    },
  ];

  useEffect(() => {
    try {
     // fetch('api.ctfguide.com/dashboard')
      
     fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard`)

     .then((res) => res.json())

        .then((data) => {
          if (data.onboardingComplete == false) {
          }
        });
    } catch (error) {}
  });

  return (
    <>
      <Head>
        <title>Careers - CTFGuide</title>
        <meta
          name="description"
          content="Cybersecurity made easy for everyone"
        />
        <style>
          @import
          url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
        </style>
      </Head>

      <Header />
      <main>


        <div className="mx-auto mt-20 mb-20 w-full max-w-6xl text-center">

          <div className='bg-neutral-800 py-10 rounded-lg'>

          <p className="mt-2 text-5xl font-bold text-white ">
                CTFGuide for Universities
          </p>
          <p className="mt-2 text-2xl font-bold  text-white ">
                Realtime AI powered insight into your students&apos; cybersecurity skills.
          </p>

            </div>
          <div className='grid grid-cols-2 mt-10'>
                <div className='text-center mx-auto'>
                    <img src="../group6.png"></img>
                </div>
                <div>
                    <h1 className='text-white text-6xl text-right '>Create.</h1>
                    <h1 className='text-white text-6xl text-right '>Assign.</h1>
                    <h1 className='text-white text-6xl text-right '>Analyze.</h1>

                    <br></br>
                    <br></br>           <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <img className="mt-30" src="../group9.png"></img>



                </div>
          </div>

        </div>

      </main>

      <Footer />
    </>
  );
  {
    /* End of return */
  }
}
