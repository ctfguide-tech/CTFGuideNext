import Head from 'next/head';
import { Footer } from '@/components/Footer';
import { StandardNav } from '@/components/StandardNav';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect } from 'react';
import { useState } from 'react';
import { ArrowLeftIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import request from '@/utils/request';
import ChallengeCard from '@/components/profile/ChallengeCard';
import { BoltIcon, RocketLaunchIcon, TrophyIcon } from '@heroicons/react/20/solid';
import Skeleton from 'react-loading-skeleton';

export default function Dashboard() {

  const [likes, setLikes] = useState(null);
  const [badges, setbadges] = useState([]);
  const [challenges, setchallenges] = useState([]);
  const [objectives, setObjectives] = useState(null);

  const exampleObjectives = [
    {
      completed: false,
      description: "Touch grass",
    },
    {
      completed: true,
      description: "Eat McDonalds",
    },
  ]

  useEffect(() => {
    const user = localStorage.getItem('username');
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
        const pinnedChallengeEndPoint = process.env.NEXT_PUBLIC_API_URL + '/users/' + user + '/likes';
        const pinnedChallengeResult = await request(pinnedChallengeEndPoint, "GET", null);
        setchallenges(pinnedChallengeResult);
      } catch (error) { }
    };
    fetchChallenges();
    setchallenges([]);

    const fetchData = async () => {
      try {
        const pinnedChallengeEndPoint = process.env.NEXT_PUBLIC_API_URL + '/users/' + user + '/likes';
        const pinnedChallengeResult = await request(pinnedChallengeEndPoint, "GET", null);
        setLikes(pinnedChallengeResult);
      } catch (error) {
        console.error("Failed to fetch pinnedChallengeResults: ", error)
      }
    };
    fetchData();

    const fetchObjectives = async () => {
      try {
        setTimeout(() => setObjectives(exampleObjectives), 500);
      } catch (error) {
        console.error('Failed to fetch objectives: ', error);
      }
    }
    fetchObjectives();
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
          <div className="flex flex-col lg:flex-row mt-8 items-start p-4 mx-auto gap-4 max-w-7xl text-neutral-50">
            <div className='w-full'>
              <div className='w-full mb-12 rounded-sm'>
                <div className='w-full p-4'>
                  <h1 className='text-3xl mb-6 font-semibold'>Learning Path</h1>
                </div>
              </div>
              <div className='w-full rounded-sm'>
                <div className='w-full p-4'>
                  <h1 className='text-3xl mb-3 font-semibold'>Popular Challenges</h1>
                  <div className='flex flex-col md:flex-row lg:flex-col xl:flex-row justify-between gap-4 w-full'>

                    {likes?.length > 0 &&
                      likes.map((challenge) => <ChallengeCard challenge={challenge.challenge} key={challenge.challenge.challengeId} />)
                      || <><ChallengeCard /><ChallengeCard /></>}
                  </div>
                </div>
              </div>
            </div>
            <div className='relative flex flex-col lg:w-[400px] bg-neutral-800 rounded-md shrink-0 gap-6'>
              <div className='flex flex-col p-6 rounded-sm w-full'>
                <h1 className='text-2xl font-semibold mb-4'>
                  <RocketLaunchIcon className='w-10 my-auto mr-4 inline-flex' />
                  Start here
                </h1>
                <div className='border-b border-neutral-700 mb-4'></div>
                <p className='text-left rounded-sm leading-[1.6rem]'>If you want to begin your <span className='font-bold text-blue-100'>cybersecurity</span> journey, but don't know where to begin,
                  take the learning assessment. We will give you a <b>custom</b> learning path tailored to your specific needs.</p>
                <button className='mt-8 bg-blue-600 mx-auto w-full hover:bg-blue-500 hover:shadow-md active:shadow-sm active:bg-blue-700 transition-colors py-3 px-8 text-lg font-semibold tracking-wide rounded-sm text-blue-50'>Begin Assessment</button>
              </div>
              <div className='w-full p-4 relative'>
                <h1 className='text-2xl text-neutral-100 tracking-wide font-semibold mb-4'>
                  <TrophyIcon className='w-10 my-auto mr-4 inline-flex' />
                  Daily Objectives
                </h1>
                <div className='border-b border-neutral-700 mb-4'></div>
                <ul className='list-none grid grid-cols-[2.5rem,1fr] gap-y-2'>
                  {objectives &&
                    objectives.map((objective) =>
                      <>
                        {objective.completed && <CheckCircleIcon className='w-8 text-blue-300'></CheckCircleIcon>
                          || <XCircleIcon className='w-8 text-neutral-300'></XCircleIcon>}
                        <li className={`inline-flex ${objective.completed && 'line-through'} w-full my-auto`}>{objective.description}</li>
                      </>
                    )
                    || <>
                      <Skeleton containerClassName='col-span-2' className='mb-4' baseColor='#999' count={2} />
                    </>}
                </ul>
              </div>
              <div className='w-full p-4 h-fit relative'>
                <h1 className='text-2xl text-neutral-100 tracking-wide font-semibold mb-4'>
                  <BoltIcon className='w-10 my-auto mr-4 inline-flex' />
                  Activity
                </h1>
                <div className='border-b border-neutral-700 mb-4'></div>
                <ul className='flex flex-col gap-4 [&>*]:line-clamp-2'>
                  <li className=''><b>Pranav</b> completed some challenge idk</li>
                  <li className=''><b>Pranav</b> completed some really long challenge name for absolutely no reason</li>
                  <li className=''><b>Pranav</b> completed a challenge with an even longer name this one has no right to be this long</li>
                </ul>
              </div>
            </div>
          </div >
        </main >
        <div className='flex w-full h-full grow basis-0'></div>
        <Footer />
      </div >
    </>
  );
}
