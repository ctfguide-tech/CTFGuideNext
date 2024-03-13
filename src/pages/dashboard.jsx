import Head from 'next/head';
import { Footer } from '@/components/Footer';
import { StandardNav } from '@/components/StandardNav';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Stats } from '@/components/dashboard/Stats';
import { Performance } from '@/components/dashboard/Performance';
import { useEffect } from 'react';
import { useState } from 'react';
import { SideNavContent } from '@/components/dashboard/SideNavContents';
import { QuickSettings } from '@/components/dashboard/QuickSetttings';
import { Suggest } from '@/components/dashboard/Suggest';
import { YourChallenges } from '@/components/dashboard/YourChallenges';
import { Likes } from '@/components/dashboard/Likes';
import { Badges } from '@/components/dashboard/Badges';
import { useRouter } from 'next/router';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { onAuthStateChanged, getAuth, verifyIdToken } from 'firebase/auth';

export default function Dashboard() {


  const router = useRouter();
  const auth = getAuth();

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
      } catch {}
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
      } catch (error) {}
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
      } catch (error) {}
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
      <StandardNav />

      <div class=" hidden fixed z-50 inset-0 overflow-y-auto">
  <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">

    <div class="fixed inset-0 transition-opacity">
      <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
    </div>

    <span class="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;

    <div class="inline-block align-bottom bg-neutral-900 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
      <div>
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
          <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <div class="mt-3 text-center sm:mt-5">
          <h3 class="text-lg leading-6 font-medium text-white">
            Mobile Device Warning
          </h3>
          <div class="mt-2">
            <p class="text-sm text-white">
              We regret to inform you that CTFGuide is not optimized for use on mobile devices. While you can still access our website on your phone or tablet, we strongly recommend using a desktop or laptop computer for the best experience.
            </p>
          </div>
        </div>
      </div>
      <div class="mt-5 sm:mt-6">
        <button type="button" class="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-900 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm">
          Okay
        </button>
      </div>
    </div>
  </div>
</div>

      <main className="animate__animated animate__fadeIn">
        
        <DashboardHeader />
        <div className="mx-auto  flex max-w-7xl ">
          {/* Sidebar */}

          <SideNavContent />

          {/* Main content area */}
          <div className="flex-1">
            {router.pathname === '/dashboard' ? (
              <div className='sm:px-10 px-10 md:px-0 lg:px-0'>
                <QuickSettings />
                <Stats />
                <Suggest />
                <Performance></Performance>
              </div>
            ) : null}
            {router.pathname === '/dashboard/challenges' ? (
              <YourChallenges challenges={challenges} />
            ) : null}
            {router.pathname === '/dashboard/badges' ? (
              <Badges badges={badges} />
            ) : null}

            {router.pathname === '/dashboard/likes' ? (
              <Likes likes={likes} />
            ) : null}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
