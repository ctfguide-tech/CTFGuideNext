import React, { useEffect, useState } from 'react';
import {
  ArrowRightIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/20/solid';

import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { PracticeNav } from '@/components/practice/PracticeNav';
import { Community } from '@/components/practice/community';

export default function Pratice() {
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await fetch('https://api.ctfguide.com/challenges/type/all');
        // const data = await response.json();
        // setChallenges([...data]);
        const response = await fetch(
          process.env.NEXT_PUBLIC_API_URL + '/challenges'
        );
        const { result } = await response.json();

        setChallenges([...result]);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Head>
        <title>Practice - CTFGuide</title>
        <meta name="description" content="Practice Problems" />
        <style>
          @import
          url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
        </style>
      </Head>
      <StandardNav />
      <main>
 
        <div className="flex flex-col sm:flex-row">
          <div className="flex w-full max-w-7xl px-8 md:mx-auto md:h-screen md:w-1/5 md:justify-center md:px-16">
            <PracticeNav />
          </div>
          <div className="w-full border-l border-neutral-800 px-8 md:w-4/5 xl:px-16">
            <div className="flex hidden">
              <div className="mt-6 flex w-1/2 rounded-lg bg-[#212121] px-4 py-2">
                <div className="flex px-0 py-0">
                  <div className="my-auto ml-auto mr-6 px-2">
                    <QuestionMarkCircleIcon className="h-10 text-blue-600" />
                  </div>
                  <div>
                    <h1 className="md:text-md mx-auto text-white lg:text-lg">
                      All of these practice problems are community created!
                    </h1>
                    <h1 className="text-sm italic text-white">
                      As of March 2023, we are still migrating the data from our
                      old site! Some challenges won't show below.
                    </h1>
                  </div>
                </div>
              </div>
              <div className="mt-6 ml-6 flex w-1/2 rounded-lg bg-[#212121] px-4 py-2 hover:bg-[#2c2c2c]">
                <div className="flex px-0 py-0">
                  <div>
                    <h1 className="text-2xl font-medium text-white">
                      Did you know?
                    </h1>
                    <h1 className="text-md italic text-white">
                      You can contribute challenges too!
                    </h1>
                  </div>
                </div>
                <div className="my-auto ml-auto px-2">
                  <a
                    href="../create"
                    className="flex rounded-lg bg-blue-700 px-2 text-lg text-white hover:bg-blue-600"
                  >
                    Check it out
                    <ArrowRightIcon className="mt-1 ml-1 h-6" />
                  </a>
                </div>
              </div>
            </div>


          <div className='mx-auto max-w-7xl mt-10'>
          <div className="  bg-black/10 shadow-2xl ring-1  ring-white/10 relative isolate overflow-hidden bg-neutral-900 py-10 sm:py-12 rounded-lg">
     
     <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
       <div
         className="absolute -bottom-8 -left-96 -z-10 transform-gpu blur-3xl sm:-bottom-64 sm:-left-40 lg:-bottom-32 lg:left-8 xl:-left-10"
         aria-hidden="true"
       >
         <div
           className="aspect-[1266/975] w-[79.125rem] bg-gradient-to-tr from-[#081e75] to-[#0737f2] opacity-30"
           style={{
             clipPath:
               'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
           }}
         />
       </div>
       <div className="mx-auto max-w-6xl lg:mx-0 lg:max-w-3xl">
         <p className="mt-2 text-xl font-semibold tracking-tight text-white">
         All of these practice problems are community created!

         </p>
         <p className="mt-4 text-lg leading-8 text-gray-300">
          As of March 2023, we are still migrating the data from our old site. Some challenges won't show below.
          <br>
          </br>
          <br>
          </br>

          Want to create your own challenges? Check out our <a href="../create" className="font-semibold">creator dashboard</a>.
         </p>
       </div>
    
     </div>
   </div></div>
            <Community challenges={challenges} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
