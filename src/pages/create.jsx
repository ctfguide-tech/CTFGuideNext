import Head from 'next/head';
import { useState, useEffect } from 'react';
import { StandardNav } from '@/components/StandardNav';
import CreatorNavTab from '@/components/challenge/CreatorDashboardTab';
import { Footer } from '@/components/Footer';
import { ChallengeCard } from '@/components/create/ChallengeCard';
import { CreatorDashboard } from '@/components/create/CreatorDashboard';
import Link from 'next/link';
import { InformationCircleIcon } from '@heroicons/react/20/solid'

export default function Create() {
  const [activeTab, setActiveTab] = useState('unverified');
  const [challenges, setChallenges] = useState([]);
  const [hasChallenges, setHasChallenges] = useState(false);

  useEffect(() => {
    const fetchChallenges = async () => {
      let response;

      switch (activeTab) {
        case 'unverified':
          response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/account/challenges?state=unverified`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + localStorage.getItem("idToken"),
            }
          });
          break;
        case 'pending changes':
          response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/account/challenges?state=pending`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + localStorage.getItem("idToken"),
            }
          });
          break;
        case 'published':
          response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/account/challenges?state=verified`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + localStorage.getItem("idToken"),
            }
          });
          break;
        default:
          response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/account/challenges?state=verified`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + localStorage.getItem("idToken"),
            }
          });
      }

      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setChallenges(data);
        setHasChallenges(true);
      } else {
        setChallenges([]);
        setHasChallenges(false);
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
      <br></br>


  



        <div className='flex grid grid-cols-3 gap-x-4 mt-4 mx-auto text-center mt-2 max-w-7xl mb-10 shadow-lg'>
          <div className="rounded-md">
            <div
              className={`cursor-pointer rounded-lg px-6 py-3 mx-auto text-center mt-1  mt-4 bg-[#212121] hover:bg-[#2c2c2c] ${
                activeTab === 'unverified' ? 'bg-neutral-900 text-white bg-neutral-700 text-white' : 'bg-[#212121] text-white'
              }`}
              onClick={() => handleTabClick('unverified')}
            >
              <div className='text-2xl'>Unverified</div>
            </div>
          </div>
          <div className="rounded-md">
            <div
              className={`cursor-pointer rounded-lg px-6 py-2.5 mx-auto text-center mt-1 mt-4 bg-[#212121] hover:bg-[#2c2c2c] ${
                activeTab === 'pending changes' ? 'bg-neutral-900 text-white bg-neutral-700] text-white' : 'bg-[#212121] text-white'
              }`}
              onClick={() => handleTabClick('pending changes')}
            >
              <div className='text-2xl'>Pending Changes</div>
            </div>
          </div>
          <div className="rounded-md">
            <div
              className={`cursor-pointer rounded-lg px-6 py-2.5 mx-auto text-center mt-1  mt-4 bg-[#212121] hover:bg-[#2c2c2c] ${
                activeTab === 'published' ? 'bg-neutral-900 text-white bg-neutral-700 text-white' : 'bg-[#212121] text-white'
              }`}
              onClick={() => handleTabClick('published')}
            >
              <div className='text-2xl'>Published</div>
            </div>
          </div>
        </div>

        {hasChallenges ? challenges.map(challenge => <ChallengeCard challenge={challenge} />) : <div className='w-2/3 mx-auto'>

        <div className="px-6 py-2.5 mx-auto rounded-md bg-neutral-800 flex">
            <div className="text-white text-2xl my-auto mx-auto pt-4 pb-4">Nothing to display!</div>
        </div>
        
        </div>} 

      
        <div onClick={() => { window.location.replace("../create/new")}}  className="shadow-lg  cursor-pointer max-w-4xl mx-auto text-center mt-10 px-6 py-5 mx-auto rounded-lg hover:outline-neutral-700 bg-[#212121] hover:bg-[#2c2c2c] ">
        <i className="mx-auto text-center text-white text-5xl text-neutral-600 far fa-plus-square"></i>
              <h1 className='text-white text-xl text-center mx-auto text-neutral-400'>Create a new challenge </h1>
</div>

<p className='mx-auto text-center mt-4 text-white italic'>Not sure how to make a CTF? Read this <a href="https://ctf.guide" className='text-blue-500 hover:underline'>guide</a>.</p>
      
        
      </main>
      <Footer />
    </>
  );
}
