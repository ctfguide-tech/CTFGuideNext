import Head from 'next/head';
import { useState, useEffect } from 'react';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { ChallengeCard } from '@/components/create/ChallengeCard';
import { CreatorDashboard } from '@/components/create/CreatorDashboard';
import Link from 'next/link';
import { InformationCircleIcon } from '@heroicons/react/20/solid'
import { Card } from '@/components/create/Card';
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';

export default function Create() {
  const [activeTab, setActiveTab] = useState('unverified');
  const [challenges, setChallenges] = useState([]);
  const [hasChallenges, setHasChallenges] = useState(false);
  const [username, setUsername] = useState('');
  const [date, setDate] = useState('');
  const [title, setTitle] = useState("Unverified");
  const [infoText, setInfoText] = useState("You cannot edit unverified challenges. Please wait for admins to approve these!");
  const [isOpen, setIsOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/account`, {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + localStorage.getItem("idToken"),
          },
      })
          .then((res) => res.json())
          .then((data) => {
              setUsername(data.username)
              setDate(data.createdAt)
          })
          .catch((err) => {
              console.log(err);
          });

    fetchChallenges();
  }, [activeTab]);

  const fetchChallenges = async (selection) => {
    let response;

    switch (selection) {
      case 'unverified':
        setTitle("Unverified");
        setInfoText("Please wait for admins to approve unverified challenges!");
        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/account/challenges?state=unverified`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("idToken"),
          }
        });
        break;
      case 'pending':
        setTitle("Pending Changes");
        setInfoText("These challenges are awaiting changes!");
        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/account/challenges?state=pending`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("idToken"),
          }
        });
        break;
      case 'published':
        setTitle("Published");
        setInfoText("These challenges are live! Share them with your friends!");
        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/account/challenges?state=verified`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("idToken"),
          }
        });
        break;
      default:
        setTitle("Unverified");
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

  function handleTabClick(tab) {
    setActiveTab(tab);
  }

  function InfoPopup({activeTab}) {
    return (
      <PopupState variant="popover" popupId="demo-popup-popover">
  {(popupState) => (
    <div>
      <Button
        variant="contained"
        sx={{
          '&:hover': {
            backgroundColor: 'grey',
          },
        }}
        {...bindTrigger(popupState)}
      >
        <div className="flex">
          <FontAwesomeIcon className="text-white h-4" icon={faInfoCircle} />
        </div>
      </Button>
      <Popover
        {...bindPopover(popupState)}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: '#323232',
            border: '1px solid #363636',
          },
        }}
      >
        <Typography className="text-white text-xs bg-[#212121]" sx={{ p: 1, fontFamily: 'Poppins, sans-serif' }}>
          {infoText}
        </Typography>
      </Popover>
    </div>
  )}
</PopupState>
    );
  }

  return (
    <>
      <Head>
        <title>Create - CTFGuide</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
        </style>
      </Head>
      <StandardNav />
      <main> 
      <CreatorDashboard />
<br>
</br>
<div className="fixed top-0 left-0 h-full w-1/2 mt-10 " aria-hidden="true"></div>
<div className=" top-0 right-0 h-full w-1/2 " aria-hidden="true"></div>
<div className="relative flex min-h-full flex-col">
  <div className="mx-auto w-full max-w-7xl flex-grow lg:flex xl:px-8">

    <div className="min-w-0 flex-1 xl:flex">
    
      <div className=" xl:w-64 xl:flex-shrink-0 xl:border-r xl:border-neutral-700">
        <div className="py-6 pl-4 pr-6 sm:pl-6 lg:pl-8 xl:pl-0">
          <div className="flex items-center justify-between ">
            <div className="flex-1 space-y-8">
              
              <div className="space-y-8 sm:flex sm:items-center sm:justify-between sm:space-y-0 xl:block xl:space-y-8">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 flex-shrink-0">
                    <img className="h-12 w-12 rounded-full" src={"https://robohash.org/" + username + ".png?set=set1&size=150x150"} alt=""/>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xl font-medium text-white">{username ? username : <h1 className='bg-[#323232] hover:bg-neutral-700 px-3 py-2 text-xs rounded-md border border-neutral-700'><a href="/login">You are not logged in!</a></h1>}</div>
                    <div className="text-sm text-white">Joined: {date ? date.toString().substring(0, 10) : "-"}</div>
                    <a href="#" className="group flex items-center hidden space-x-2.5">
                      <svg className="h-5 w-5 text-white group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fill-rule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clip-rule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium text-white group-hover:text-white">debbielewis</span>
                    </a>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row xl:flex-col">
                  <Link href="/create/new" className='text-center'>
                    <button type="button" className="inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 xl:w-3/4">Create New</button>
                  </Link>
                  <button type="button" className="hidden mt-3 inline-flex items-center justify-center rounded-md  px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-neutral-800 sm:mt-0 sm:ml-3 xl:ml-0 xl:mt-3 xl:w-full">Invite Team</button>
             
                <a href="/guides/approve">
                  <div class="max-w-sm mt-8 rounded-lg shadow bg-[#212121] hover:bg-[#303030] px-4 py-4 rounded-md">
                      <h5 class="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">The Creation Process</h5>
                    <p class="mb-3 font-normal text-gray-500 dark:text-gray-400">Everything to know about the challenge creation, approval, and management process.</p>
                    <p class="inline-flex items-center text-blue-600 hover:underline">
                      Read More
                      <svg class="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path></svg>
                    </p>
                  </div>
                </a> 

                <a href="/guides/create">
                  <div class="max-w-sm mt-6 rounded-lg shadow bg-[#212121] hover:bg-[#303030] px-4 py-4 rounded-md">
                    <i class="w-10 h-10 mb-2 text-blue-500 dark:text-blue-500 text-2xl fas fa-book-open"></i>
                      <h5 class="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">Not sure where to start?</h5>
                    <p class="mb-3 font-normal text-gray-500 dark:text-gray-400">All you need to know to make an awesome CTF!</p>
                    <p class="inline-flex items-center text-blue-600 hover:underline">
                      Learn How
                      <svg class="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path></svg>
                    </p>
                  </div>
                </a> 

                </div>
              </div>

              <div className="flex flex-col space-y-6 sm:flex-row sm:space-y-0 sm:space-x-8 xl:flex-col xl:space-x-0 xl:space-y-6 hidden">
                <div className="flex items-center space-x-2 hidden">
                  <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-white">Pro Member</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M5.127 3.502L5.25 3.5h9.5c.041 0 .082 0 .123.002A2.251 2.251 0 0012.75 2h-5.5a2.25 2.25 0 00-2.123 1.502zM1 10.25A2.25 2.25 0 013.25 8h13.5A2.25 2.25 0 0119 10.25v5.5A2.25 2.25 0 0116.75 18H3.25A2.25 2.25 0 011 15.75v-5.5zM3.25 6.5c-.04 0-.082 0-.123.002A2.25 2.25 0 015.25 5h9.5c.98 0 1.814.627 2.123 1.502a3.819 3.819 0 00-.123-.002H3.25z" />
                  </svg>
                  <span className="text-sm font-medium text-white">8 Projects</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
                      <div className=" lg:min-w-0 lg:flex-1">
                      <div className='mx-auto text-center grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-1 mb-4   gap-4 rounded-lg  pl-4 pr-6 pt-4 pb-4 sm:pl-6 lg:pl-8 xl:border-t-0 xl:pl-6 xl:pt-6'>
                        <div style={{ backgroundColor: "#212121", borderColor: "#3b3a3a" }} className=' px-4 py-2 mx-auto w-full stext-center text-white rounded-lg  '>

                            <h1 className='text-3xl text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-blue-200'>-</h1>
                            <h1 className='text-xl'>Total Views</h1>
                        </div>

                        <div style={{ backgroundColor: "#212121", borderColor: "#3b3a3a" }} className=' px-4 py-2 mx-auto w-full text-center text-white rounded-lg '>
                            <h1 className='text-3xl text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-yellow-500'>-</h1>
                            <h1 className='text-xl '>Total Attempts</h1>
                        </div>

                        <div style={{ backgroundColor: "#212121", borderColor: "#3b3a3a" }} className=' px-4 py-2 mx-auto w-full text-center text-white rounded-lg '>
                            <h1 className='text-3xl text-transparent bg-clip-text bg-gradient-to-br from-green-200 to-green-400'>-</h1>
                            <h1 className='text-xl'>Total Valid Attempts</h1>
                        </div>
                    </div>

                    <div className="border-b border-t border-neutral-700 pl-4 pr-6 pt-4 pb-4 sm:pl-6 lg:pl-8 xl:border-t-0 xl:pl-6 xl:pt-6">
                      <div className="flex items-center">
                        <h1 className="flex-1 text-3xl font-medium text-white font-semibold"><div className="flex">{title}<InfoPopup /></div></h1>
                        <div className="relative">
                          <button
                            type="button"
                            className="inline-flex w-full justify-center gap-x-1.5 rounded-md  px-3 py-2 text-sm font-semibold text-white shadow-sm border border-neutral-600  hover:bg-neutral-800"
                            id="sort-menu-button"
                            aria-expanded={isOpen}
                            aria-haspopup="true"
                            onClick={toggleDropdown}
                          >
                            <i class="fas fa-filter -ml-0.5 mt-1.5 h-5 w-5 text-white"></i>
                            {title}
                            <svg className="-mr-1 h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
                            </svg>
                          </button>

                          <div
                            className={`absolute right-0 z-10 mt-2 w-56 origin-top-right bg-neutral-800  border border-neutral-600 rounded-md  shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${isOpen ? 'block' : 'hidden'}`}
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby="sort-menu-button"
                            tabIndex="-1"
                          >
                            <div className="py-1" role="none">
                              <a href="#" className="text-white block px-4 py-2 text-sm" role="menuitem" tabIndex="-1" onClick={async () => fetchChallenges("unverified")} id="sort-menu-item-0">
                                Unverified
                              </a>
                              <a href="#" className="text-white block px-4 py-2 text-sm" role="menuitem" tabIndex="-1" onClick={async () => fetchChallenges("pending")} id="sort-menu-item-1">
                                Pending Changes
                              </a>
                              <a href="#" className="text-white block px-4 py-2 text-sm" role="menuitem" tabIndex="-1" onClick={async () => fetchChallenges("published")} id="sort-menu-item-2">
                                Published
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {hasChallenges && (
                        <motion.div
                          className="flex flex-wrap justify-center"
                          initial={{ opacity: 0, x: 100 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: 0.2 }}
                        >
                          {challenges.map(challenge => (
                            <motion.div
                              key={challenge.id}
                              initial={{ opacity: 0, x: 100 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.4, delay: 0.4 }}
                            >
                              <ChallengeCard challenge={challenge}/>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}

                      {!hasChallenges && (
                        <motion.div
                          className="w-4/5 rounded-md mx-auto"
                          initial={{ opacity: 0, x: 100 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="mt-6 px-6 py-2.5 mx-auto rounded-md bg-neutral-800 hover:bg-neutral-700 flex">
                            <div className="text-white text-2xl my-auto mx-auto pt-4 pb-4">
                              Nothing to display!
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
      </div>
    </div>

    <div className=" pr-4 sm:pr-6 lg:flex-shrink-0 lg:border-neutral-700 lg:pr-8 xl:pr-0 hidden">
      <div className="pl-6 lg:w-80">
        <div className="pt-6 pb-2">
          <h2 className="text-sm font-semibold">Activity</h2>
        </div>
        <div>
          <ul role="list" className="divide-y divide-gray-200 hidden">
            <li className="py-4">
              <div className="flex space-x-3">
                <img className="h-6 w-6 rounded-full" src="https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&h=256&q=80" alt="">
                </img>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">You</h3>
                    <p className="text-sm text-white">1h</p>
                  </div>
                  <p className="text-sm text-white">Deployed Workcation (2d89f0c8 in master) to production</p>
                </div>
              </div>
            </li>

          </ul>
          <div className="border-t border-neutral-800 py-4 text-sm">
            <a href="#" className="font-semibold text-blue-600 hover:text-blue-900">
              View all activity
              <span aria-hidden="true"> &rarr;</span>
            </a>
          </div>
          </div>
        </div>
        </div>
      </div>
      </div>
      <br></br>     
      </main>
      <Footer />
    </>
  );
}
