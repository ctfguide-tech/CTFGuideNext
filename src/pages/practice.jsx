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
import request from '@/utils/request';

export default function Pratice() {
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await fetch('https://api.ctfguide.com/challenges/type/all');
        // const data = await response.json();
        // setChallenges([...data]);

        let result = [];
        const res = await request(
          `${process.env.NEXT_PUBLIC_API_URL}/challenges`,
          'GET',
          null
        );
        if (res) result = res.result;

        let publicChallenges = [];
        for (let i = 0; i < result.length; i++) {
          if (!result[i].private) {
            publicChallenges.push(result[i]);
          }
        }
        console.log(publicChallenges);
        setChallenges(publicChallenges);
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
      <div className="flex min-h-screen flex-col">
        <StandardNav />
        <main>
      
          <div className="mx-auto max-w-7xl">
          <div className="mx-auto mt-10  max-w-7xl">
            <div className="  relative isolate overflow-hidden  bg-black/10 bg-neutral-900 shadow-2xl ring-1 ring-white/10 py-4">
              <div className="relative mx-auto  max-w-7xl px-6 lg:px-8">
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
                <div className="  flex">
                  <div className=''>
                  <p className="text-3xl font-semibold tracking-tight text-white flex">
                      Are your preparing for a CTF competition?
                  </p>
                  <p className='text-lg text-white max-w-4xl'>
                      CTFGuide stores challenges from past competitions. We're updating our collection on a daily basis.
                  </p>

          
                  </div>

                <img src="../icons8-leaderboard.svg" alt="flag" width="150" className="   text-white ml-auto absolute bottom-0 right-10 mb-[-50px]" />

                 
                </div>
              </div>
            </div>
          </div>
            <div>
              <div className="w-full p-4 pt-8">
                  <div className='mb-10'>
                  <h1 className="text-3xl font-semibold text-white mb-2"> Featured Sets </h1>

                      <div >
                  <h1 className="text-lg uppercase  mb-1 text-neutral-400"> Competition Sets </h1>

                        <div className='grid grid-cols-4 gap-x-4'>
                    

                        <div className='bg-neutral-800 px-2 py-3 w-full text-white flex mx-auto border border-neutral-600'>
                            <img width="50" className="ml-4" src="https://avatars.githubusercontent.com/u/5315773?s=280&v=4"></img> 
                     <div className='ml-4'>
                  <p>PicoCTF 2023</p>
                            52 challenges available
                     </div>
                          </div>


                          <div className='bg-neutral-800 px-2 py-3 w-full text-white flex mx-auto border border-neutral-600'>
                            <img width="50" className="ml-4 rounded-full" src="https://imaginaryctf.org/img/logo.png"></img> 
                     <div className='ml-4'>
                  <p>imaginaryCTF</p>
                           <p>153 challenges available</p>
                     </div>
                          </div>


                          <div className='bg-neutral-800 px-2 py-3 w-full text-white flex mx-auto border border-neutral-600'>
                            <img width="50" className="ml-4" src="https://avatars.githubusercontent.com/u/5315773?s=280&v=4"></img> 
                     <div className='ml-4'>
                  <p>PicoCTF 2024</p>
                            40 challenges available
                     </div>
                          </div>
                        </div>


                        <h1 className="text-lg uppercase  mb-1 text-neutral-400 mt-4"> Category Sets </h1>

<div className='grid grid-cols-4 gap-x-4'>


<div className='bg-neutral-800 px-2 py-3 w-full text-white flex mx-auto border border-neutral-600'>
    <img width="50" className="ml-4" src="https://avatars.githubusercontent.com/u/5315773?s=280&v=4"></img> 
<div className='ml-4'>
<p>PicoCTF 2023</p>
    52 challenges available
</div>
  </div>


  <div className='bg-neutral-800 px-2 py-3 w-full text-white flex mx-auto border border-neutral-600'>
    <img width="50" className="ml-4 rounded-full" src="https://imaginaryctf.org/img/logo.png"></img> 
<div className='ml-4'>
<p>imaginaryCTF</p>
   <p>153 challenges available</p>
</div>
  </div>


  <div className='bg-neutral-800 px-2 py-3 w-full text-white flex mx-auto border border-neutral-600'>
    <img width="50" className="ml-4" src="https://avatars.githubusercontent.com/u/5315773?s=280&v=4"></img> 
<div className='ml-4'>
<p>PicoCTF 2024</p>
    40 challenges available
</div>
  </div>

  <div className='bg-neutral-800 px-2 py-3 w-full text-white flex mx-auto border border-neutral-600'>
    <img width="50" className="ml-4" src="https://avatars.githubusercontent.com/u/5315773?s=280&v=4"></img> 
<div className='ml-4'>
<p>PicoCTF 2024</p>
    40 challenges available
</div>
  </div>
</div>

                        </div>

                    </div>
                <Community challenges={challenges} />
              </div>
            </div>
          </div>
        </main>
        <div className="flex h-full w-full grow basis-0"></div>
        <Footer />
      </div>
    </>
  );
}
