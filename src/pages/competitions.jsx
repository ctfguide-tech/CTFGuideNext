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

export default function Competitions() {


  return (
    <>
      <Head>
        <title>Competitions - CTFGuide</title>
        <meta name="description" content="Practice Problems" />
        <style>
          @import
          url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
        </style>
      </Head>
      <div className="flex min-h-screen flex-col">
        <StandardNav />
        <main>
          <div className="mx-auto mt-10  max-w-7xl">
            <div className="  relative isolate overflow-hidden  rounded-lg bg-black/10 bg-neutral-900 shadow-2xl ring-1 ring-white/10 py-4">
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
                   Competitions <span className='text-sm text-white'>BETA</span>
                  </p>
                  <p className='text-lg text-white'>
                    Your one stop destination for all the upcoming CTF Competitions. 
                  </p>
                  </div>

                <img src="../newflag.svg" alt="flag" className="w-1/8   text-white ml-auto absolute bottom-0 right-10 mb-[-50px]" />

                 
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
