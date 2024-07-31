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
  const [selectedId, setSelectedId] = useState(null);
  const [pendingChallenges, setPendingChallenges] = useState([]);
  const [challengeIsOpen, setChallengeIsOpen] = useState(false);


  const [reports, setReports] = useState([]);
  
  
  const [bonusPoints, setBonusPoints] = useState(0);

  
  // get reports
  useEffect(() => {
    const fetchReports = async () => {
      const response = await request(process.env.NEXT_PUBLIC_API_URL + '/reports', "GET");
      setReports(response);
    };
    fetchReports();
  }, []);
  
  const handleSelectChallenge = (id) => {
    setSelectedChallenges(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const fetchPendingChallenges = async () => {
    try {
      const response = await request(process.env.NEXT_PUBLIC_API_URL + '/pending', "GET");
      console.log(response)
      setPendingChallenges(response);
    } catch (error) {
      console.error(error);
    }
  };

  const handleApproveChallenge = async () => {
    try {
      const response = await request(`${process.env.NEXT_PUBLIC_API_URL}/admin/challenges/${selectedId}/approve`, "POST", { bonusPoints });
      console.log(response);
      // Handle success or error response
      fetchPendingChallenges(); // Refresh pending challenges
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPendingChallenges();
  }, []);

  const handleResetPFP = async () => {
    const username = document.getElementById('usernameInput').value;
    const reason = ""; // Set reason as blank for now

    if (!username) {
      alert("Please enter a username.");
      return;
    }

    try {
      const response = await request(`${process.env.NEXT_PUBLIC_API_URL}/admin/${username}/resetPFP`, "POST", { reason });
      if (response.success) {
        alert("Profile picture reset successfully!");
      } else {
        alert("Failed to reset profile picture.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while resetting the profile picture.");
    }
  };

  const handleResetBanner = async () => {
    const username = document.getElementById('usernameInput').value;
    const reason = ""; // Set reason as blank for now

    if(!username) {
      alert("Please enter a username.");
      return;
    }
    try{
      const response = await request(`${process.env.NEXT_PUBLIC_API_URL}/admin/${username}/resetBanner`, "POST", {reason});
      if(response.success){
        alert("Banner reset successfully!");
      }else {
        alert("Failed to reset banner.");
      }
    }catch(err){
      console.log(err);
      alert("An error occurred while resetting the banner.");
    }
  };

  return (
    <>
      <Head>
        <title>Leaderboards - CTFGuide</title>
        <meta name="description" content="Practice Problems" />
        <style>
          @import url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
        </style>
      </Head>
      <div className="flex min-h-screen flex-col">
        <StandardNav />
        <main>
          <div className='max-w-6xl mx-auto'>
            <div className='flex mt-10'>
              <div>
                <h1 className='text-white text-3xl  font-semibold'>ADMIN CENTER</h1>
                <p className='text-white text-xl'>ΥΠΕΡΑΣΠΙΣΗ ΤΟΥ CTFGUIDE ΑΠΟ ΤΟ OPS</p>
              </div>
              <div className='ml-auto '>
                <i className='text-4xl fa fa-shield-alt text-white '></i>
                <button className='hidden px-2 py-1  bg-green-600 text-white ml-4' onClick={handleApproveChallenge}>Quick Approve</button>
                <button className='hidden  ml-4  px-2 py-1 bg-red-600 text-white'>Quick Deny</button>
              </div>
            </div> 
    

            <br></br>
            <div className='grid grid-cols-2 gap-x-5 border border-neutral-700 px-4 py-4'>

<div>
<h1 className='text-xl  text-white mb-2'>USER ACTIONS</h1>
    <input type="text" placeholder='Enter USERNAME' className='mb-2 text-white bg-neutral-800 border-none w-full' id="usernameInput"></input>
   <textarea placeholder='Reason' className='mb-2 text-white bg-neutral-800 border-none w-full' id="reasonInput"></textarea>
    <button className='ml-auto px-2 py-1 bg-red-600 text-white mt-2'>Disable Account</button>
    <button className='ml-2 px-2 py-1 bg-yellow-600 text-white mt-2'>Warn User</button>
    <button className='ml-2 px-2 py-1 bg-blue-600 text-white mt-2' onClick={handleResetPFP}>Reset PFP</button>
    <button className='ml-2 px-2 py-1 bg-blue-600 text-white mt-2' onClick={handleResetBanner}>Reset Banner</button>

</div>


<div>
    <h1 className='text-xl  text-white mb-2'>CHALLENGE ACTIONS</h1>
    <input type="text" placeholder='Enter CHALLENGE ID' className='mb-2 text-white bg-neutral-800 border-none w-full'></input>
   <textarea placeholder='Reason' className='mb-2 text-white bg-neutral-800 border-none w-full'></textarea>
    <button className='ml-auto px-2 py-1 bg-red-600 text-white mt-2'>Delete Challenge</button>
    <button className='ml-2 px-2 py-1 bg-yellow-600 text-white mt-2'>Unapprove Challenge</button>
    </div>
  </div>
            <div className='grid grid-cols-2 mt-4 gap-x-5 border border-neutral-700 px-4 py-4'>
              <div className='text-white text-xl'>
                <h1>Challenges Pending Approval</h1>
                <div className='mt-2'>
                  {pendingChallenges.length > 0 ? (
                    pendingChallenges.map((challenge) => (
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
                          <p className='text-sm'>{new Date(challenge.createdAt).toLocaleString([], { hour: 'numeric', minute: 'numeric', hour12: true, month: 'short', day: 'numeric' })}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className='text-red-500'>Nothing to show</p>
                  )}
                </div>
              </div>
              <div className='text-white text-xl'>
                <h1>Submitted Reports</h1>

              <div className='mt-2'>
                {reports.length > 0 ? (
                  reports.map((report) => (
                    <div key={report.id} className='bg-neutral-800 w-full mb-2 border focus:bg-blue-900 focus:border-blue-500 border-neutral-700 hover:bg-neutral-700/50 cursor-pointer px-2 py-1 flex items-center text-sm'>
                      <div className='flex-grow'>
                        <h1 className='text-sm text-left ml-4'>{report.type} REPORT</h1>
                      </div>  
                      <div className='ml-auto text-right'>
                        <p className='text-sm'>Reported by <span className='font-bold'>{report.userId}</span></p>
                        <p className='text-sm'>{new Date(report.createdAt).toLocaleString([], { hour: 'numeric', minute: 'numeric', hour12: true, month: 'short', day: 'numeric' })}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className='text-red-500'>No reports to show</p>
                )}
              </div>
              </div>
            </div>

            <h1 className='mt-20 text-white hidden'>Selected Content ID's</h1>
            <textarea value={selectedChallenges.join(", ") || "N/A"} className='hidden text-white bg-neutral-800 border-none w-full'>
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