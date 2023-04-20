import Head from 'next/head';
import { useState, useEffect } from 'react';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { ChallengeCard } from '@/components/create/ChallengeCard';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import Typography from '@mui/material/Typography';
import Popover from '@mui/material/Popover';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import { ArrowRightIcon } from '@heroicons/react/20/solid';

export default function Create() {
  const [activeTab, setActiveTab] = useState('unverified');
  const [challenges, setChallenges] = useState([]);
  const [hasChallenges, setHasChallenges] = useState(false);
  const [username, setUsername] = useState('');
  const [date, setDate] = useState('');
  const [title, setTitle] = useState('Unverified');
  const [infoText, setInfoText] = useState(
    'You cannot edit unverified challenges. Please wait for admins to approve these!'
  );
  const [isOpen, setIsOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    try {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/stats/creator`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('idToken'),
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setStats([
            {
              id: 1,
              name: 'Challenges Created',
              value: data.challengesCreated,
            },
            {
              id: 2,
              name: 'Challenge Views',
              value: data.challengeViews,
            },
            {
              id: 3,
              name: 'Challenge Attempts',
              value: data.challengeAttempts,
            },
            {
              id: 4,
              name: 'Challenge Solves',
              value: data.challengeSolves,
            }
          ]);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch {}
  }, []);

  const [stats, setStats] = useState([
    { id: 1, name: 'Challenges Created', value: '0' },
    { id: 2, name: 'Challenge Views', value: '0' },
    { id: 3, name: 'Challenge Attempts', value: '0' },
    { id: 4, name: 'Challenge Solves', value: '0' },
  ]);

  useEffect(() => {
    try {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/account`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('idToken'),
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setUsername(data.username);
          setDate(data.createdAt);
        })
        .catch((err) => {
          console.log(err);
        });

      fetchChallenges("unverified");
    } catch (error) {}
  }, [activeTab]);

  const fetchChallenges = async (selection) => {
    let response = [];
    try {
      switch (selection) {
        case 'unverified':
          setTitle('Unverified');
          setInfoText(
            'Please wait for admins to approve unverified challenges!'
          );
          response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/account/challenges?state=unverified`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('idToken'),
              },
            }
          );
          break;
        case 'pending':
          setTitle('Pending Changes');
          setInfoText('These challenges are awaiting changes!');
          response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/account/challenges?state=pending`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('idToken'),
              },
            }
          );
          break;
        case 'published':
          setTitle('Published');
          setInfoText(
            'These challenges are live! Share them with your friends!'
          );
          response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/account/challenges?state=verified`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('idToken'),
              },
            }
          );
          break;
        default:
          setTitle('Unverified');
          response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/account/challenges?state=verified`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('idToken'),
              },
            }
          );
      }
    } catch (error) {}

    let data = [];
    try {
      data = await response.json();
    } catch {}
    if (Array.isArray(data) && data.length > 0) {
      setChallenges(data);
      setHasChallenges(true);
    } else {
      setChallenges([]);
      setHasChallenges(false);
    }
  };

  function InfoPopup({ activeTab }) {
    return (
      <PopupState variant="popover" popupId="demo-popup-popover">
        {(popupState) => (
          <div>
            <div
              variant=""
              className='mt-3'
              {...bindTrigger(popupState)}
            >
              <div className="flex ml-3 mr-1">
                <FontAwesomeIcon
                  className="h-4 text-white"
                  icon={faInfoCircle}
                  
                />
              </div>
            </div>
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
              <Typography
                className="bg-[#212121] text-xs text-white"
                sx={{ p: 1, fontFamily: 'Poppins, sans-serif' }}
              >
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
          @import
          url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
        </style>
      </Head>
      <StandardNav />
      <main>
        {/*<CreatorDashboard />*/}
        <br></br>
        <div
          className="fixed top-0 left-0 mt-10 h-full w-1/2 "
          aria-hidden="true"
        ></div>
        <div className="  top-0 right-0 h-full w-1/2 " aria-hidden="true"></div>
        <div className="relative flex min-h-full flex-col">
          <div className="mx-auto w-full max-w-7xl flex-grow lg:flex xl:px-8">
            <div className="min-w-0 flex-1 xl:flex">
              <div className="hidden  xl:w-64 xl:flex-shrink-0 xl:border-neutral-700">
                <div className="py-6 pl-4 pr-6 sm:pl-6 lg:pl-8 xl:pl-0">
                  <div className="flex items-center justify-between ">
                    <div className="flex-1 space-y-8">
                      <div className="space-y-8 sm:flex sm:items-center sm:justify-between sm:space-y-0 xl:block xl:space-y-8">
                        <div className='border rounded-lg py-8 border-[#1f2940] bg-[#1f2940]'>
                          <div class="w-24 h-24 mx-auto border-2 border-white rounded-full bg-gradient-to-tr from-blue-500 to-blue-600">
                              <img
                                className="h-24 w-24 rounded-full"
                                src={
                                  'https://robohash.org/' +
                                  username +
                                  '.png?set=set1&size=150x150'
                                }
                                alt=""
                              />
                          </div>
                          <div className="flex flex-col sm:flex-row xl:flex-col">
                            <div className="space-y-1 mx-auto">
                              <div className="mt-6 text-2xl font-bold text-white">
                                {username ? (
                                  username
                                ) : (
                                  <h1 className="rounded-md border border-neutral-700 bg-[#323232] px-3 py-2 text-xs hover:bg-neutral-700">
                                    <a href="/login">You are not logged in!</a>
                                  </h1>
                                )}
                              </div>
                            </div>
                            <div className="space-y-1 mx-auto">
                              <div className="mb-4 text-sm text-gray-300">
                                Joined:{' '}
                                {date ? date.toString().substring(0, 10) : '-'}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row xl:flex-col">
                            <Link href="/create/new" className="text-center">
                              <button
                                type="button"
                                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 xl:w-3/4"
                              >
                                Create New
                              </button>
                            </Link>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row xl:flex-col">
                          <a href="/guides/approve">
                            <div class="max-w-sm rounded-lg rounded-md px-4 py-4 shadow hover:bg-[#303030]">
                              <hr className='mb-8 border border-neutral-700 hidden'></hr>
                              <h5 class="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                                The Creation Process
                              </h5>
                              <p class="mb-3 font-normal text-gray-500 dark:text-gray-400">
                                Everything to know about the challenge creation,
                                approval, and management process.
                              </p>
                              <p class="inline-flex items-center text-blue-600 hover:underline">
                                Read More
                                <svg
                                  class="ml-2 h-5 w-5"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
                                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path>
                                </svg>
                              </p>
                            </div>
                          </a>

                          <a href="/guides/create">
                            <div class="mt-6 max-w-sm rounded-lg rounded-md px-4 py-4 shadow hover:bg-[#303030]">
                              <i class="fas fa-book-open mb-2 h-10 w-10 text-2xl text-blue-500 dark:text-blue-500"></i>
                              <h5 class="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                                Not sure where to start?
                              </h5>
                              <p class="mb-3 font-normal text-gray-500 dark:text-gray-400">
                                All you need to know to make an awesome CTF!
                              </p>
                              <p class="inline-flex items-center text-blue-600 hover:underline">
                                Learn How
                                <svg
                                  class="ml-2 h-5 w-5"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  axmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
                                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path>
                                </svg>
                              </p>
                            </div>
                          </a>
                        </div>
                      </div>

                      <div className="flex hidden flex-col space-y-6 sm:flex-row sm:space-y-0 sm:space-x-8 xl:flex-col xl:space-x-0 xl:space-y-6">
                        <div className="flex hidden items-center space-x-2">
                          <svg
                            className="h-5 w-5 text-white"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                              clip-rule="evenodd"
                            />
                          </svg>
                          <span className="text-sm font-medium text-white">
                            Pro Member
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <svg
                            className="h-5 w-5 text-white"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path d="M5.127 3.502L5.25 3.5h9.5c.041 0 .082 0 .123.002A2.251 2.251 0 0012.75 2h-5.5a2.25 2.25 0 00-2.123 1.502zM1 10.25A2.25 2.25 0 013.25 8h13.5A2.25 2.25 0 0119 10.25v5.5A2.25 2.25 0 0116.75 18H3.25A2.25 2.25 0 011 15.75v-5.5zM3.25 6.5c-.04 0-.082 0-.123.002A2.25 2.25 0 015.25 5h9.5c.98 0 1.814.627 2.123 1.502a3.819 3.819 0 00-.123-.002H3.25z" />
                          </svg>
                          <span className="text-sm font-medium text-white">
                            8 Projects
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className=" lg:min-w-0 lg:flex-1 mt-6 rounded-lg ">
          

          <div className='mx-auto max-w-7xl'>
          <div className="  bg-black/10 shadow-2xl ring-1  ring-white/10 relative isolate overflow-hidden bg-neutral-900 py-14 sm:py-12 rounded-lg">
     
     <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
       <div
         className="absolute -bottom-8 -left-96 -z-10 transform-gpu blur-3xl sm:-bottom-64 sm:-left-40 lg:-bottom-32 lg:left-8 xl:-left-10"
         aria-hidden="true"
       >
         <div
           className="aspect-[1266/975] w-[79.125rem] bg-gradient-to-tr from-[#081e75] to-[#0737f2] opacity-30"
           style={{
             clipPath:
               'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
           }}
         />
       </div>
       <div className="mx-auto max-w-6xl lg:mx-0 lg:max-w-3xl">
         <h2 className="text-base font-semibold leading-8 text-blue-600">IMPACT AT A GLANCE</h2>
         <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
         Your impact on cybersecurity education
         </p>
         <p className="mt-4 text-lg leading-8 text-gray-300">
           It's contributions from people like you that is creating a generation of cybersecurity professionals.
         </p>
       </div>
       <dl className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-10 text-white sm:grid-cols-2 sm:gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-4">
         {stats.map((stat) => (
           <div key={stat.id} className="flex flex-col gap-y-3 border-l border-white/10 pl-6">
             <dt className="text-sm leading-6">{stat.name}</dt>
             <dd className="order-first text-3xl font-semibold tracking-tight">{stat.value}</dd>
           </div>
         ))}
       </dl>
     </div>
   </div></div>
       
                <div className="mt-10  pb-4 xl:border-t-0 ">
                  <div className="flex items-center">
                    <h1 className="flex-1 text-2xl font-medium  text-white">
                      <div className="">
                        {title} <br></br>
                     <div className='text-sm flex-none w-2/3'>
                      <p>
                          {infoText}
                      </p>
                      </div>
                      </div>
                    </h1>

                    <a href="/create/new" className='bg-blue-700 shadow-sm hover:bg-blue-700/90 px-2 py-1 text-white rounded-sm mr-3'>New Challenge</a>
                    <div className="relative">
                      <button
                        type="button"
                        className="inline-flex w-full justify-center gap-x-1.5 rounded-md   px-3 py-2 text-sm font-semibold text-white shadow-sm  hover:bg-neutral-800"
                        id="sort-menu-button"
                        aria-expanded={isOpen}
                        aria-haspopup="true"
                        onClick={toggleDropdown}
                      >
                        <i class="fas fa-filter -ml-0.5 mt-1.5 h-5 w-5 text-white"></i>
                        {title}
                        <svg
                          className="-mr-1 h-5 w-5 text-white"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </button>

                

                      <div
                        className={`absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md  border border-neutral-600 bg-neutral-800  shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${
                          isOpen ? 'block' : 'hidden'
                        }`}
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="sort-menu-button"
                        tabIndex="-1"
                      >
                        <div className="py-1" role="none">
                          <a
                            href="#"
                            className="block px-4 py-2 text-sm text-white"
                            role="menuitem"
                            tabIndex="-1"
                            onClick={async () => fetchChallenges('unverified')}
                            id="sort-menu-item-0"
                          >
                            Unverified
                          </a>
                          <a
                            href="#"
                            className="block px-4 py-2 text-sm text-white"
                            role="menuitem"
                            tabIndex="-1"
                            onClick={async () => fetchChallenges('pending')}
                            id="sort-menu-item-1"
                          >
                            Pending Changes
                          </a>
                          <a
                            href="#"
                            className="block px-4 py-2 text-sm text-white"
                            role="menuitem"
                            tabIndex="-1"
                            onClick={async () => fetchChallenges('published')}
                            id="sort-menu-item-2"
                          >
                            Published
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <AnimatePresence className="w-full">
                  {hasChallenges && (
                    <motion.div
                      className="  lg:min-w-0 lg:flex-1"
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: 0.2 }}
                    >
                      {challenges.map((challenge) => (
                        <motion.div
                          key={challenge.id}
                          initial={{ opacity: 0, x: 100 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.4 }}
                        >
                          <ChallengeCard challenge={challenge} />
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {!hasChallenges && (
                    <motion.div
                      className="mx-auto w-full rounded-md"
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="mx-auto mt-6 flex rounded-sm bg-neutral-800/40 w-full py-2.5 ">
                        <div className="my-auto mx-auto text-center pt-4 pb-4 text-xl text-white">
                        <i className="text-4xl fas fa-folder-open mx-auto text-center text-neutral-700/80"></i>
                          <p>Looks like you have no {title.toLowerCase().split(" ")[0]} challenges yet.</p>
                          <a href="/guides/create" className='mx-auto'>
                            <p className='mx-auto text-center text-sm text-blue-600 underline'>Want to create CTF's? Learn more here<ArrowRightIcon className='ml-1 mt-0.5 h-5 hidden' /></p>
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className=" hidden pr-4 sm:pr-6 lg:flex-shrink-0 lg:border-neutral-700 lg:pr-8 xl:pr-0">
              <div className="pl-6 lg:w-80">
                <div className="pt-6 pb-2">
                  <h2 className="text-sm font-semibold">Activity</h2>
                </div>
                <div>
                  <ul role="list" className="hidden divide-y divide-gray-200">
                    <li className="py-4">
                      <div className="flex space-x-3">
                        <img
                          className="h-6 w-6 rounded-full"
                          src="https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&h=256&q=80"
                          alt=""
                        ></img>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium">You</h3>
                            <p className="text-sm text-white">1h</p>
                          </div>
                          <p className="text-sm text-white">
                            Deployed Workcation (2d89f0c8 in master) to
                            production
                          </p>
                        </div>
                      </div>
                    </li>
                  </ul>
                  <div className="border-t border-neutral-800 py-4 text-sm">
                    <a
                      href="#"
                      className="font-semibold text-blue-600 hover:text-blue-900"
                    >
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
