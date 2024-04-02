import Head from 'next/head';
import { Footer } from '@/components/Footer';
import { StandardNav } from '@/components/StandardNav';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { CardDecorator } from '@/components/design/CardDecorator'
import { useEffect } from 'react';
import { useState } from 'react';
import { Card } from '@/components/create/Card';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { ArrowRightIcon } from '@heroicons/react/20/solid';

export default function Dashboard() {

  const [likes, setLikes] = useState([]);
  const [badges, setbadges] = useState([]);
  const [challenges, setchallenges] = useState([]);

  useEffect(() => {
    // verify id token if not logout
    const fetchBadges = async () => {
      try {
        const response = await fetch(
          `${localStorage.getItem('userBadgesUrl')}`
        );
        const data = await response.json();
        setbadges(data);
      } catch { }
    };
    fetchBadges();
    setbadges([]);

    const fetchChallenges = async () => {
      try {
        const response = await fetch(
          `${localStorage.getItem('userChallengesUrl')}`
        );
        const data = await response.json();
        setchallenges(data);
      } catch (error) { }
    };
    fetchChallenges();
    setchallenges([]);

    const fetchData = async () => {
      try {
        const response = await fetch(`${localStorage.getItem('userLikesUrl')}`);
        const data = await response.json();
        console.log(data);
        setLikes(data);
        likes.map((like) => console.log(like.challenge.id));
      } catch (error) { }
    };
    fetchData();
    setLikes([]);
  }, []);

  return (
    <>
      <Head>
        <title>Dashboard - CTFGuide</title>
        <meta
          name="description"
          content="Cybersecurity made easy for everyone"
        />
        <style>
          @import
          url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
        </style>
      </Head>

      <div className="hidden fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">

          <div className="fixed inset-0 transition-opacity">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>

          <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;

          <div className="inline-block align-bottom bg-neutral-900 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
            <div>
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-5">
                <h3 className="text-lg leading-6 font-medium text-white">
                  Mobile Device Warning
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-white">
                    We regret to inform you that CTFGuide is not optimized for use on mobile devices. While you can still access our website on your phone or tablet, we strongly recommend using a desktop or laptop computer for the best experience.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-6">
              <button type="button" className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-900 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm">
                Okay
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className='flex flex-col min-h-screen'>
        <StandardNav />
        <DashboardHeader />
        <main className="animate__animated animate__fadeIn">
          <div className="flex mt-8 items-start p-4 mx-auto gap-4 max-w-7xl text-neutral-50">
            <div className='w-full bg-neutral-800 rounded-sm'>
              <div className='w-full p-8 h-64'>
                <h1 className='text-3xl tracking-tight'>Suggested Challenges</h1>
                <button className='w-14 h-14 p-2 rounded-full bg-black'>
                  <ArrowLeftIcon></ArrowLeftIcon>
                </button>
                <button className='w-14 h-14 p-2 rounded-full bg-black'>
                  <ArrowLeftIcon className='rotate-180'></ArrowLeftIcon>
                </button>
              </div>
            </div>
            <div className='hidden relative lg:flex flex-col w-[400px] card-container shrink-0 gap-4'>
              <CardDecorator></CardDecorator>
              <div className='flex flex-col bg-neutral-800 p-6 rounded-sm w-full'>
                <h1 className='text-3xl mb-2 text-left tracking-tight'>Start here</h1>
                <p className='text-justify bg-neutral-700/50 p-4 rounded-sm border border-white/10 leading-[1.6rem]'>If you want to begin your <span className='font-bold text-blue-100'>cybersecurity</span> journey, but don't know where to begin,
                  take the learning assessment. We will give you a <b>custom</b> learning path tailored to your specific needs.</p>
                <button className='mt-8 bg-blue-600 mx-auto w-full hover:bg-blue-500 hover:shadow-md active:shadow-sm active:bg-blue-700 transition-colors py-3 px-8 text-lg font-medium rounded-sm text-blue-50'>Begin Assessment</button>
              </div>
              <div className='w-full bg-neutral-800 pt-8 p-4 card-container shadow relative'>
                <CardDecorator></CardDecorator>
                <h1 className='text-2xl mb-4'>Daily Objectives</h1>
                <ul className='list-disc list-inside [&>li]:mt-4 [&>li]:marker:text-slate-300'>
                  <li>Complete one challenge.</li>
                  <li>One</li>
                  <li>One</li>
                </ul>
              </div>
              <div className='w-full bg-neutral-800 pt-8 p-4 h-fit relative card-container'>
                <CardDecorator></CardDecorator>
                <h1 className='text-2xl mb-4'>Activity</h1>
                <ul className='flex flex-col gap-4 [&>*]:line-clamp-2'>
                  <li className=''><b>Pranav</b> just completed some challenge idk</li>
                  <li className=''><b>Pranav</b> just completed some really long challenge name for absolutely no reason</li>
                  <li className=''><b>Pranav</b> just completed a challenge with an even longer name this one has no right to be this long</li>
                </ul>
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
