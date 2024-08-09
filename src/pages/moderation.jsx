import React, { useEffect, useRef, useState } from 'react';
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
import { MarkdownViewer } from '@/components/MarkdownViewer';



export default function Competitions() {
  const [selectedChallenges, setSelectedChallenges] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [pendingChallenges, setPendingChallenges] = useState([]);
  const [challengeIsOpen, setChallengeIsOpen] = useState(false);
  const [contentPreview, setContentPreview] = useState('');
  const textRef = useRef(null);

  const [reports, setReports] = useState([]);
  
  
  const [bonusPoints, setBonusPoints] = useState(0);

  const insertText = (text) => {
    const textarea = textRef.current;
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const newValue =
      textarea.value.substring(0, startPos) +
      text +
      textarea.value.substring(endPos, textarea.value.length);
    setContentPreview(newValue);
    textarea.focus();
    textarea.selectionEnd = startPos + text.length;
  };
  const magicSnippet = () => {
    const id = Math.random().toString(36).substring(7);
    insertText(`[Click to run: ${id}](https://ctfguide.com/magic/)`);
  };

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

  const handleDisableAccount = async () => {
    const username = document.getElementById('usernameInput').value;
    const reason = "";

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
    }catch(err){
      console.log(err);
      alert("An error occurred while disabling the account.");
    }
  };

  const handleEnableAccount = async () => {
    const username = document.getElementById('usernameInput').value;
    const reason = "";

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
    }catch(err){
      console.log(err);
      alert("An error occurred while enabling the account.");
    }
  };

  const handleUploadPatchnote = async () => {
    const title = document.getElementById('titleInput').value;
    const version = document.getElementById('versionInput').value;
    const content = document.getElementById('content').value;
    const author = "CTFGuide";

    if (!title || !version || !content) {
      alert("Please fill in all fields.");
      return;
    }
  
    try{
      const response = await request(`${process.env.NEXT_PUBLIC_API_URL}/admin/createPatchNote`, "POST", {title, version, content});
      if(response.success){
        alert("Patchnote uploaded successfully!");
      }else {
        alert("Failed to upload the patchnote.");
      }

    }catch(err){
      console.log(err);
      alert("An error occurred while uploading the patchnote.");
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
    <button className='ml-auto px-2 py-1 bg-red-600 text-white mt-2'onClick={handleDisableAccount}>Disable Account</button>
    <button className='ml-2 px-2 py-1 bg-green-600 text-white mt-2'onClick={handleEnableAccount}>Enable Account</button>
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

            <div className='border border-neutral-700 px-4 py-4 mt-3'>
          
          <div className='grid grid-cols-2 gap-x-4'>
            <div className='pr-2'>
            <h1 className='text-white text-xl mb-2'>
                Create a Patchnote
          </h1>
          
          <input type="text" placeholder='Title' id="titleInput" className='mb-2 text-white bg-neutral-800 border-none w-full'></input>
          <input type="text" placeholder='Version' id="versionInput" className='mb-2 text-white bg-neutral-800 border-none w-full'></input>
          
          <div
                      className="mb-2 flex w-full justify-between "
                    >
                      <div className="flex space-x-2 rounded-md bg-neutral-900">
                        <button
                          onClick={() => insertText('**Enter bold here**')}
                          className="toolbar-button ml-2 mr-1 pr-2 text-white"
                        >
                          <i className="fas fa-bold text-sm"></i>
                        </button>

                        <button
                          onClick={() => insertText('*Enter italic here*')}
                          className="toolbar-button mr-1 px-2 text-white"
                        >
                          <i className="fas fa-italic text-sm"></i>
                        </button>

                        <button
                          onClick={() => insertText('# Enter Heading here')}
                          className="toolbar-button mr-1 px-2 text-white"
                        >
                          <i className="fas fa-heading text-sm"></i>
                        </button>

                        <button
                          onClick={() => insertText('[Name](url)')}
                          className="toolbar-button mr-1 px-2 text-white"
                        >
                          <i className="fas fa-link text-sm"></i>
                        </button>

                        <button
                          onClick={() => insertText('```Enter Code here```')}
                          className="toolbar-button mr-1 px-2 text-white"
                        >
                          <i className="fas fa-code text-sm"></i>
                        </button>

                        <button
                          onClick={() => magicSnippet()}
                          className="toolbar-button mr-1 px-2 text-white"
                        >
                          <i className="fas fa-terminal text-sm"></i>
                        </button>
                      </div>
                     
          </div>

          <textarea value={contentPreview} ref={textRef} className='mb-2 text-white bg-neutral-800 border-none w-full h-36'
          id="content"
          placeholder="Enter your description here..."
          onChange={(event) => {
            setContentPreview(event.target.value);
          }}
          ></textarea>
          
          <button className='px-2 py-1 bg-blue-600 text-white' onClick={handleUploadPatchnote}>Upload Patchnote</button>
          </div>
          
          <div>
          <h1 className="text-xl font-medium text-white mb-2">
              Patchnote Content Preview
              </h1>
              <div className='bg-neutral-800 rounded-lg py-2 px-2' style={{height:'272px',  overflowY: 'auto' }}>
              <MarkdownViewer className="text-white"content={contentPreview}/>
              </div>
              </div>
          </div>

          </div>
          </div>
          
        </main>
        <div className='flex w-full h-full grow basis-0'></div>
        <ViewChallenge open={challengeIsOpen} setOpen={setChallengeIsOpen} selected={selectedId} />
        <Footer />
      </div>
    </>
  );
}