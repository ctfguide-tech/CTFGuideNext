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
import { MyTable } from '@/components/Table';
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import ViewChallenge from '@/components/moderation/ViewChallenge';

export default function Competitions() {
  const [selectedChallenges, setSelectedChallenges] = useState([]);
  const [selectedId, setSelectedId] = useState(null); // [1, 2, 3, 4, 5
  const [pendingChallenges, setPendingChallenges] = useState([]);
  const [challengeIsOpen, setChallengeIsOpen] = useState(false);


  const handleSelectChallenge = (id) => {
    setSelectedChallenges(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  useEffect(() => {
    const fetchPendingChallenges = async () => {
      try {
        const response = await request(process.env.NEXT_PUBLIC_API_URL + '/pending', "GET");
        console.log(response)
        setPendingChallenges(response);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPendingChallenges();
  }, []);

  return (
    <>
      <Head>
        <title>Leaderboards - CTFGuide</title>
        <meta name="description" content="Practice Problems" />
        <style>
          @import
          url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
        </style>
      </Head>
      <div className="flex min-h-screen flex-col">
        <StandardNav />
        <main>
          <div className='max-w-6xl mx-auto'>
            <div className='flex mt-10'>
              <div>
                <h1 className='text-white text-3xl  font-semibold'>Moderation Panel</h1>
              </div>
              <div className='ml-auto'>
             

                <button className='px-2 py-1 rounded-lg bg-green-600 text-white ml-4'>Quick Approve</button>
                <button className='ml-4 rounded-lg px-2 py-1 bg-red-600 text-white'>Quick Deny</button>
              </div>
            </div> 
            <hr className='border-blue-600 border-2'></hr>

            <div className='grid grid-cols-2 mt-4 gap-x-5'>
              <div className='text-white text-xl'>
                <h1>Challenges Pending Approval</h1>
                <div className='mt-2'>
  {pendingChallenges && pendingChallenges.map((challenge) => (
    <div key={challenge.id} onClick={() => {setSelectedId(challenge.id); setChallengeIsOpen(true);}} className='bg-neutral-800 w-full mb-2 border focus:bg-blue-900 focus:border-blue-500 border-neutral-700 hover:bg-neutral-700/50 cursor-pointer px-2 py-1 flex items-center text-sm'>
      <input
        type="checkbox"
        checked={selectedChallenges.includes(challenge.id)}
        onChange={() => handleSelectChallenge(challenge.id)}
        className=""
      />
      <div className='flex-grow'>
        <h1 className='text-lg text-left ml-4'>{challenge.title}</h1>
      </div>  
      <div className='ml-auto text-right'>
        <p className='text-sm'>Submitted by <span className='font-bold'>{challenge.creator}</span></p>
        <p className='text-sm'>{new Date(challenge.createdAt).toLocaleString([], { hour: 'numeric', minute: 'numeric', hour12: true, month: 'short', day: 'numeric' })}</p>      </div>
    </div>
  ))}



</div>
              </div>
              <div className='text-white text-xl'>
                <h1>Submitted Reports</h1>
              </div>


            </div>

            <h1 className='mt-20 text-white'>Selected Content ID's</h1>
            <textarea value={selectedChallenges.join(", ") || "N/A"} className='text-white bg-neutral-800 border-none w-full ='>
 
 </textarea>

          </div>
        </main>
        <div className='flex w-full h-full grow basis-0'></div>
        <ViewChallenge open={challengeIsOpen} setOpen={setChallengeIsOpen} selected={selectedId} />

        <Footer />
      </div>
    </>
  );
}