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

  const resetFields = () => {
    document.getElementById('usernameInput').value = "";
    document.getElementById('reasonInput').value = "";
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

  const handleDeleteChallenge = async () => {
    const challengeId = document.getElementById('challengeIdInput').value;
    const reason = document.getElementById('challengeReasonInput').value;

    try{
      const response = await request(`${process.env.NEXT_PUBLIC_API_URL}/admin/${challengeId}/deleteChallenge`, "POST", {reason});
      if(response.success){
        alert("Challenge deleted successfully!");
      }else {
        alert("Failed to delete challenge.");
      }

      document.getElementById('challengeIdInput').value = "";
      document.getElementById('challengeReasonInput').value = "";


    }catch(err){
      console.log(err);
      alert("An error occurred while deleting the challenge.");
    }

  };

  const handleUnapproveChallenge = async () => {
    const challengeId = document.getElementById('challengeIdInput').value;
    const reason = document.getElementById('challengeReasonInput').value;

    try{
      const response = await request(`${process.env.NEXT_PUBLIC_API_URL}/admin/${challengeId}/unapproveChallenge`, "POST", {reason});
      if(response.success){
        alert("Challenge unapproved successfully!");
      }else {
        alert("Failed to unapprove challenge.");
      }

      document.getElementById('challengeIdInput').value = "";
      document.getElementById('challengeReasonInput').value = "";


    }catch(err){
      console.log(err);
      alert("An error occurred while unapproving the challenge.");
    }

  };

  const handleResyncLeaderboard = async () => {
    try{
      const response = await request(`${process.env.NEXT_PUBLIC_API_URL}/admin/syncLeaderboard`, "POST");
      if(response.success){
        alert("Leaderboard resynced successfully!");
      }else {
        alert("Failed to resync leaderboard.");
      }
    }catch(err){
      console.log(err);
      alert("An error occurred while resyncing the leaderboard.");
    }
  };

  useEffect(() => {
    fetchPendingChallenges();
  }, []);

  const handleResetPFP = async () => {
    const username = document.getElementById('usernameInput').value;
    const reason = document.getElementById('reasonInput').value;
    console.log('REASON: ', reason);

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

      resetFields();

    } catch (error) {
      console.error(error);
      alert("An error occurred while resetting the profile picture.");
    }
  };

  const deleteBulk = async () => {
    if (selectedChallenges.length === 0) {
      alert("No challenges selected.");
      return;
    }
  
    if (!confirm("Are you sure you want to delete the selected challenges?")) {
      return;
    }
    try {
      const response = await request(`${process.env.NEXT_PUBLIC_API_URL}/admin/deleteChallenges`, "POST", { challengeIds: selectedChallenges });
      if (response.success) {
        alert("Selected challenges deleted successfully!");
        setSelectedChallenges([]); // Clear selected challenges
        fetchPendingChallenges(); // Refresh pending challenges
      } else {
        alert("Failed to delete selected challenges.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while deleting the selected challenges.");
    }
  };
  

  const handleResetBanner = async () => {
    const username = document.getElementById('usernameInput').value;
    const reason = document.getElementById('reasonInput').value;

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

      resetFields();

    }catch(err){
      console.log(err);
      alert("An error occurred while resetting the banner.");
    }
  };

  const handleDisableAccount = async () => {
    const username = document.getElementById('usernameInput').value;
    const reason = document.getElementById('reasonInput').value;

    if (!username) {
      alert("Please enter a username.");
      return;
    }

    try {
      const response = await request(`${process.env.NEXT_PUBLIC_API_URL}/admin/${username}/disableAccount`, "POST", { reason });
      if (response.success) {
        alert("Account disabled successfully!");
      } else {
        alert("Failed to disable account.");
      }

      resetFields();

    }catch(err){
      console.log(err);
      alert("An error occurred while disabling the account.");
    }
  };
  const handleResetBio = async () => {

    const username = document.getElementById('usernameInput').value;
    const reason = document.getElementById('reasonInput').value;

    if (!username) {
      alert("Please enter a username.");
      return;
    }
    try{
      const response = await request(`${process.env.NEXT_PUBLIC_API_URL}/admin/${username}/resetBio`, "POST", {reason});
      if(response.success){
        alert("Bio reset successfully!");
      }else{
        alert("Failed to reset bio.");
      }

      resetFields();
    }catch(err){
      console.log(err);
      alert("An error occurred while resetting the bio.");
    }
  };

  const handleEnableAccount = async () => {
    const username = document.getElementById('usernameInput').value;
    const reason = document.getElementById('reasonInput').value;

    if (!username) {
      alert("Please enter a username.");
      return;
    }
    try{
      const response = await request(`${process.env.NEXT_PUBLIC_API_URL}/admin/${username}/enableAccount`, "POST", {reason});
      if(response.success){
        alert("Account enabled successfully!");
      }else {
        alert("Failed to enable account.");
      }

      resetFields();
    }catch(err){
      console.log(err);
      alert("An error occurred while enabling the account.");
    }
  };

  const handleWarnUser = async () => {
    const username = document.getElementById('usernameInput').value;
    const reason = document.getElementById('reasonInput').value;

    if (!username) {
      alert("Please enter a username.");
      return;
    }
    try{
      const response = await request(`${process.env.NEXT_PUBLIC_API_URL}/admin/${username}/warnUser`, "POST", {reason});
      if(response.success){
        alert("User warned successfully!");
      }else {
        alert("Failed to warn user.");
      }

      resetFields();
    }catch(err){
      console.log(err);
      alert("An error occurred while warning the user.");
    }
  };

  // Fetch platform stats
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await request(`${process.env.NEXT_PUBLIC_API_URL}/admin/stats`, "GET");
        setStats(response);
      } catch (error) {
        console.error("Failed to fetch platform stats", error);
      }
    };
    fetchStats();
  }, []);

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
 <div className='grid grid-cols-3  gap-x-2'>
 <button className=' px-2 py-1 bg-red-600 hover:bg-red-500 duration-300 text-white mt-2'onClick={handleDisableAccount}>
   <i className='fa fa-ban mr-2'></i>Disable Account
 </button>
    <button className=' px-2 py-1 bg-green-600 hover:bg-green-500 duration-300 text-white mt-2'onClick={handleEnableAccount}>
      <i className='fa fa-check mr-2'></i>Enable Account
    </button>
    <button className=' px-2 py-1 bg-yellow-600 hover:bg-yellow-500 duration-300 text-white mt-2' onClick={handleWarnUser}>
      <i className='fa fa-exclamation-triangle mr-2'></i>Warn User
    </button>
    <button className=' px-2 py-1 bg-blue-600 hover:bg-blue-500 duration-300 text-white mt-2' onClick={handleResetPFP}>
      <i className='fa fa-user-circle mr-2'></i>Reset PFP
    </button>
    <button className='px-2 py-1 bg-blue-600 hover:bg-blue-500 duration-300 text-white mt-2' onClick={handleResetBanner}>
      <i className='fa fa-image mr-2'></i>Reset Banner
    </button>
    <button className=' px-2 py-1 bg-blue-600 hover:bg-blue-500 duration-300 text-white mt-2' onClick={handleResetBio}>
      <i className='fa fa-info-circle mr-2'></i>Reset Bio
    </button>

 </div>

</div>


<div>
    <h1 className='text-xl  text-white mb-2'>CHALLENGE ACTIONS</h1>
    <input type="text" placeholder='Enter CHALLENGE ID' className='mb-2 text-white bg-neutral-800 border-none w-full' id = "challengeIdInput"></input>
   <textarea placeholder='Reason' className='mb-2 text-white bg-neutral-800 border-none w-full' id ="challengeReasonInput"></textarea>
    <button className='ml-auto px-2 py-1 bg-red-600 text-white mt-2' onClick={handleDeleteChallenge}>Delete Challenge</button>
    <button className='ml-2 px-2 py-1 bg-yellow-600 text-white mt-2' onClick={handleUnapproveChallenge}>Unapprove Challenge</button>
    <button className='ml-2 px-2 py-1 bg-red-600 text-white mt-2' onClick={handleResyncLeaderboard}>Resync Leaderboard</button>
    </div>
  </div>
            <div className='grid grid-cols-2 mt-4 gap-x-5 border border-neutral-700 px-4 py-4'>
              <div className='text-white text-xl'>
                <h1>Challenges Pending Approval</h1>
                {selectedChallenges.length > 0 && <button className='ml-auto px-2 py-1 bg-red-600 text-sm text-white mt-2' onClick={deleteBulk}><i className='fa fa-trash mr-2'></i>Delete Selected</button>}
                <div className='mt-2'>
                  {pendingChallenges.length > 0 ? (
                    pendingChallenges.map((challenge) => (
                      <div key={challenge.id} onClick={() => {setSelectedId(challenge.id); setChallengeIsOpen(true);}} className='bg-neutral-800 w-full mb-2 border focus:bg-blue-900 focus:border-blue-500 border-neutral-700 hover:bg-neutral-700/50 cursor-pointer px-2 py-1 flex items-center text-sm'>
                        <input
                          onClick={(e) => e.stopPropagation()} // Prevent click event propagation
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

            <div className='mt-4 grid  gap-x-5 border border-neutral-700 px-4 py-4'>
                <h1 className='text-xl  text-white mb-2'>Platform Stats</h1>
                {stats ? (
                  <div className='text-white'>
                    <div className='grid grid-cols-3 gap-4'>
                      <div className='bg-neutral-800 p-4 rounded-lg text-center'>
                        <p className='text-white text-xl font-bold'>{stats.userCount}</p>
                        <p className='text-gray-400'>Total Users</p>
                      </div>
                      <div className='bg-neutral-800 p-4 rounded-lg text-center'>
                        <p className='text-white text-xl font-bold'>{stats.challengeCount}</p>
                        <p className='text-gray-400'>Total Challenges</p>
                      </div>
                      <div className='bg-neutral-800 p-4 rounded-lg text-center'>
                        <p className='text-white text-xl font-bold'>{stats.verifiedChallengeCount}</p>
                        <p className='text-gray-400'>Verified Challenges</p>
                      </div>
                     
                    </div>
                    
                    <h2 className='mt-4 text-white text-lg '>Recent Sign-Ups</h2>
                    <div className='mt-2 grid grid-cols-3 gap-4'>
                      {stats.recentSignUps.map((user) => (
                        <div key={user.id} className='hover:bg-neutral-700 duration-100 bg-neutral-800  cursor-pointer p-4 rounded-lg flex items-center' onClick={() => window.open(`/users/${user.username}`, '_blank')}>
                          <img src={user.profileImage || 'https://robohash.org/' + user.username} alt={`${user.username}'s profile`} className='w-12 h-12 rounded-full mr-4' />
                          <div>
                            <p className='text-white font-bold'>{user.username}</p>
                            <p className='text-gray-400 text-sm'>{new Date(user.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className='text-red-500'>Failed to load stats</p>
                )}
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