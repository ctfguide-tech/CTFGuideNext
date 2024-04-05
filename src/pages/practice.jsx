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

        let result = []
        const res = await request(`${process.env.NEXT_PUBLIC_API_URL}/challenges`, 'GET', null);
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
      <div className='flex flex-col min-h-screen'>
        <StandardNav />
        <main>
          <div className="mx-auto mt-10 hidden max-w-7xl">
            <div className="  relative isolate overflow-hidden  rounded-lg bg-black/10 bg-neutral-900 py-10 shadow-2xl ring-1 ring-white/10 sm:py-12">
              <div className="relative mx-auto hidden max-w-7xl px-6 lg:px-8">
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
                <div className="mx-auto hidden max-w-6xl lg:mx-0 lg:max-w-3xl">
                  <p className="mt-2 text-xl font-semibold tracking-tight text-white">
                    All of these practice problems are community created!
                  </p>
                  <p className="mt-4 text-lg leading-8 text-gray-300">
                    As of March 2023, we are still migrating the data from our old
                    site. Some challenges won't show below.
                    <br></br>
                    <br></br>
                    Want to create your own challenges? Check out our{' '}
                    <a href="../create" className="font-semibold">
                      creator dashboard
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mx-auto max-w-7xl">
            {/* <div> */}
            {/* <PracticeNav /> */}
            {/* </div> */}
            <div>
              <div className="w-full p-4 pt-8">
                <Community challenges={challenges} />
              </div>
            </div>
          </div>
        </main>
        <div className='flex w-full h-full grow basis-0'></div>
        <Footer />
      </div>
    </>
  );
}
