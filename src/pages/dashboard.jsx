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

export default function Dashboard() {
  const router = useRouter();

  const [likes, setLikes] = useState([]);
  const [badges, setbadges] = useState([]);
  const [challenges, setchallenges] = useState([]);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const response = await fetch(
          `${localStorage.getItem('userBadgesUrl')}`
        );
        const data = await response.json();
        console.log(data);
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
        console.log(data);
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
        likes.map((like) => console.log(like.challenge.slug));
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
      <main className="animate__animated animate__fadeIn">
        <DashboardHeader />
        <div className="mx-auto  flex max-w-7xl ">
          {/* Sidebar */}
          <SideNavContent />

          {/* Main content area */}
          <div className="flex-1">
            {router.pathname === '/dashboard' ? (
              <div>
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
