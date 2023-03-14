import Head from 'next/head';
import { useState, useEffect } from 'react';
import { StandardNav } from '@/components/StandardNav';
import CreatorNavTab from '@/components/challenge/CreatorDashboardTab';
import { DocumentCheckIcon, DocumentChartBarIcon, DocumentMagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { Footer } from '@/components/Footer';
import { ChallengeCard } from '@/components/create/ChallengeCard';
import { CreatorDashboard } from '@/components/create/CreatorDashboard';

export default function Create() {
  const [activeTab, setActiveTab] = useState('unverified');
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    const fetchChallenges = async () => {
      let response;

      switch (activeTab) {
        case 'unverified':
          response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/challenges`);
          break;
        case 'pending changes':
          response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/challenges`);
          break;
        case 'published':
          response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/challenges`);
          break;
        default:
          response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/challenges`);
      }

      const data = await response.json();
      if (typeof(data) == 'array') {
        setChallenges(data);
      } else {
        setChallenges([])
      }
    };

    fetchChallenges();
  }, [activeTab]);

  function handleTabClick(tab) {
    setActiveTab(tab);
  }

  return (
    <>
      <Head>
        <title>Create  - CTFGuide</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
        </style>
      </Head>
      <StandardNav />
      <main>
        <CreatorDashboard />
        <div className='flex grid grid-cols-3 gap-x-4 mt-4 mx-auto text-center mt-10 w-2/3'>
          <div className="rounded-md">
            <img className='w-full h-4 rounded-t-lg object-cover' src={"https://camo.githubusercontent.com/f38cb60cf74f6e673504cbde590a1481018dd3bcb83d4307b3f20bb2a4a992f7/687474703a2f2f6a61736f6e6c6f6e672e6769746875622e696f2f67656f5f7061747465726e2f6578616d706c65732f636f6e63656e747269635f636972636c65732e706e67"}></img>
            <div
              className={`px-6 py-2.5 mx-auto text-center mt-1 pb-4 mt-4 bg-[#212121] hover:bg-[#2c2c2c] ${
                activeTab === 'unverified' ? 'bg-neutral-900 text-white outline outline-[#3e3e3e] text-white' : 'bg-[#212121] text-white'
              }`}
              onClick={() => handleTabClick('unverified')}
            >
              <div className='text-2xl'>Unverified</div>
            </div>
          </div>
          <div className="rounded-md">
            <img className='w-full h-4 rounded-t-lg object-cover' src={"https://camo.githubusercontent.com/f38cb60cf74f6e673504cbde590a1481018dd3bcb83d4307b3f20bb2a4a992f7/687474703a2f2f6a61736f6e6c6f6e672e6769746875622e696f2f67656f5f7061747465726e2f6578616d706c65732f636f6e63656e747269635f636972636c65732e706e67"}></img>
            <div
              className={`px-6 py-2.5 mx-auto text-center mt-1 pb-4 mt-4 bg-[#212121] hover:bg-[#2c2c2c] ${
                activeTab === 'pending changes' ? 'bg-neutral-900 text-white outline outline-[#3e3e3e] text-white' : 'bg-[#212121] text-white'
              }`}
              onClick={() => handleTabClick('pending changes')}
            >
              <div className='text-2xl'>Pending Changes</div>
            </div>
          </div>
          <div className="rounded-md">
            <img className='w-full h-4 rounded-t-lg object-cover' src={"https://camo.githubusercontent.com/f38cb60cf74f6e673504cbde590a1481018dd3bcb83d4307b3f20bb2a4a992f7/687474703a2f2f6a61736f6e6c6f6e672e6769746875622e696f2f67656f5f7061747465726e2f6578616d706c65732f636f6e63656e747269635f636972636c65732e706e67"}></img>
            <div
              className={`px-6 py-2.5 mx-auto text-center mt-1 pb-4 mt-4 bg-[#212121] hover:bg-[#2c2c2c] ${
                activeTab === 'published' ? 'bg-neutral-900 text-white outline outline-[#3e3e3e] text-white' : 'bg-[#212121] text-white'
              }`}
              onClick={() => handleTabClick('published')}
            >
              <div className='text-2xl'>Published</div>
            </div>
          </div>
        </div>
        <hr className="w-2/3 mx-auto mt-6 mb-6 m-2 border-[#313131]" />
        {challenges.length != 0 ? challenges.map((challenge) => (
          <ChallengeCard key={challenge.id} challenge={challenge} />
        )) : <div className='w-2/3 mx-auto'>
        <div className="px-6 py-2.5 mx-auto rounded-md bg-neutral-800 flex">
            <div className="text-white text-2xl my-auto mx-auto pt-4 pb-4">Nothing to display!</div>
        </div>
        </div>}
      </main>
      <Footer />
    </>
  );
}
