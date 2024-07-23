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
import request from "@/utils/request";
import Menu from '@/components/editor/Menu';
import Skeleton from 'react-loading-skeleton';
export default function Create() {
  const [activeTab, setActiveTab] = useState('unverified');
  const [challenges, setChallenges] = useState([]);
  const [hasChallenges, setHasChallenges] = useState(false);
  const [username, setUsername] = useState('');
  const [date, setDate] = useState('');
  const [title, setTitle] = useState('Unverified Challenges');
  const [infoText, setInfoText] = useState(
    'You cannot edit unverified challenges. Please wait for admins to approve these!'
  );

  const [isCreating, setIsCreating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  // check if url has success=true
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    if (success === 'true') {
      document.getElementById('saved').classList.remove('hidden');
    }
  }, [])

  const [writeups, setWriteups] = useState([]);



  useEffect(() => {
    try {
      request(`${process.env.NEXT_PUBLIC_API_URL}/stats/creator`, "GET", null)
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
    } catch { }
  }, []);

  const [stats, setStats] = useState([
    { id: 1, name: 'Challenges Created', value: '0' },
    { id: 2, name: 'Challenge Views', value: '0' },
    { id: 3, name: 'Challenge Attempts', value: '0' },
    { id: 4, name: 'Challenge Solves', value: '0' },
  ]);

  const [solvedChallenges, setSolvedChallenges] = useState([]);
  useEffect(() => {
    try {
      request(`${process.env.NEXT_PUBLIC_API_URL}/account`, "GET", null)
        .then((data) => {
          setUsername(data.username);
          fetchWriteups(data.username);
          setDate(data.createdAt);
          request(`${process.env.NEXT_PUBLIC_API_URL}/users/${data.username}/solvedChallenges`, "GET", null).then(challenges => {
            console.log("cow")
            console.log(challenges)
            challenges.forEach((challenge) => (
              console.log(challenge.slug)
            ))
            setSolvedChallenges(challenges)

          })
        })
        .catch((err) => {
          console.log(err);
        });

      fetchChallenges("unverified");

    } catch (error) { }
  }, [activeTab]);

  const fetchWriteups = async (username) => {
    try {
      const response = await request(`${process.env.NEXT_PUBLIC_API_URL}/users/${username}/writeups`, "GET", null);
      if (Array.isArray(response) && response.length > 0) {
        setWriteups(response);
        console.log(response)
      } else {
        setWriteups([]);
      }
    } catch (error) { }
  };

  const fetchChallenges = async (selection) => {
    let response = [];
    try {
      switch (selection) {
        case 'unverified':
          setTitle('Your Challenges');
          setInfoText(
            'Please wait for admins to approve unverified challenges!'
          );
          response = await request(`${process.env.NEXT_PUBLIC_API_URL}/account/challenges?state=unverified`, "GET", null);
          break;
        case 'pending':
          setTitle('Your Challenges');
          setInfoText('These challenges are awaiting changes!');
          response = await request(`${process.env.NEXT_PUBLIC_API_URL}/account/challenges?state=pending`, "GET", null);
          break;
        case 'published':
          setTitle('Your Challenges');
          setInfoText(
            'These challenges are live! Share them with your friends!'
          );
          response = await request(`${process.env.NEXT_PUBLIC_API_URL}/account/challenges?state=published`, "GET", null);
          break;
        default:
          setTitle('Unverified');
          response = await request(`${process.env.NEXT_PUBLIC_API_URL}/account/challenges?state=verified`, "GET", null);
      }
    } catch (error) { }

    if (Array.isArray(response) && response.length > 0) {
      setChallenges(response);
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
                className="bg-[#212121] text-xs text-white hidden"
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
        <Menu open={isCreating} setOpen={setIsCreating} solvedChallenges={solvedChallenges} />

        <div
          className="fixed top-0 left-0 mt-10 h-full w-1/2 "
          aria-hidden="true"
        ></div>

        <div className="  top-0 right-0 h-full w-1/2 " aria-hidden="true"></div>

        <div className="relative flex min-h-full flex-col">
          <div className="mx-auto w-full max-w-7xl flex-grow lg:flex xl:px-8">

            <div className="min-w-0 flex-1 xl:flex">


              <div className=" lg:min-w-0 lg:flex-1 mt-6 rounded-lg ">


                <div id="saved" className='hidden mb-10 text-white text-center text-xl border  px-2 py-1 rounded-lg bg-green-900 border-green-700 '>
                  <h1><i class="fas fa-check mr-2 "></i>  Your challenge has been created and submitted for approval.</h1>
                </div>





                <div className='mx-auto max-w-7xl'>
                  <div className="hidden  bg-black/10 shadow-2xl ring-1  ring-white/10 relative isolate overflow-hidden bg-neutral-900 py-14 sm:py-12 rounded-lg">
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



                <div className="  pb-4 xl:border-t-0 ">
                  <div className="flex items-center">
                    <h1 className="flex-1 text-2xl font-medium  text-white">
                      <div className="">
                        {title} <br></br>
                        <div className='text-sm flex-none w-2/3 hidden'>
                          <p>
                            {infoText}
                          </p>
                        </div>
                      </div>
                    </h1>

                    <a href="/create/new" className='bg-blue-700 text-sm shadow-sm hover:bg-blue-700/90 px-2 py-1 text-white rounded-sm mr-3'>New Challenge</a>
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
                        className={`absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md  border border-neutral-600 bg-neutral-800  shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${isOpen ? 'block' : 'hidden'
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
                      <div className="mx-auto mt-2 flex rounded-sm bg-neutral-800/40 w-full py-2.5 ">
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

                <hr className='mt-4 border-neutral-700'></hr>
                <div className=" mt-4  pb-4  ">
                  <div className="flex items-center">
                    <h1 className="flex-1 text-2xl font-medium  text-white">
                      <div className="flex">
                        Your Writeups
                        <div className='ml-auto'>
                          <button onClick={() => { setIsCreating(true) }} className='bg-blue-700 text-sm shadow-sm hover:bg-blue-700/90 px-2 py-1 text-white rounded-sm mr-3'>New Draft</button>

                        </div>



                      </div>



                      <div className="mt-4 flow-root">
                        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <table className="min-w-full divide-y divide-neutral-800 border border-neutral-800">
                              <thead>
                                <tr>
                                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text--white">
                                    Writeup Name
                                  </th>
                                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-3">
                                    Challenge Name
                                  </th>

                                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text--white">
                                    Last Updated
                                  </th>
                                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-3">
                                    <span className="sr-only">Edit</span>
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-neutral-800">
                                {writeups.map((writeup) => (
                                  <tr key={writeup.title} className="even:bg-neutral-900">

                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-white">
                                      {writeup.draft &&
                                        <span className='text-yellow-400 bg-yellow-900 px-2 rounded-full mr-2'>draft</span>
                                      }

                                      {!writeup.draft &&
                                        <span className='text-green-400 bg-green-900 px-2 rounded-full mr-2'>published</span>
                                      }

                                      {writeup.title} </td>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-3">
                                      {writeup.challenge.title}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-white">{new Date(writeup.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>

                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                                      <a href={`/create/editor?cid=${writeup.id}`} className="text-blue-600 hover:text-blue-900">
                                        Edit<span className="sr-only">, {writeup.title}</span>
                                      </a>
                                    </td>
                                  </tr>
                                )) || <Skeleton containerClassName='tbody' className='mb-4' baseColor='#999' count={2} />
                                }
                              </tbody>
                            </table>
                          </div>

                        </div>
                      </div>
                    </h1>


                  </div>
                </div>



              </div>
            </div>

            <div className="  pr-4 sm:pr-6 lg:flex-shrink-0 lg:border-neutral-700 lg:pr-8 xl:pr-0 hidden">
              <div className="pl-6 lg:w-80">
                <div className="pt-6 pb-2">
                  <h2 className="text-2xl text-white ">Notifications</h2>
                </div>
                <div>
                  <ul role="list" className=" divide-y divide-neutral-800">
                    <li className="py-4">
                      <div className="flex space-x-3">
                        <i className="fas fa-check-circle text-green-500 mt-4"></i>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-blue-500">CTFGuide Admin</h3>
                            <p className="text-xs text-white">01/12/24 1:45 PM EST</p>
                          </div>
                          <p className="text-sm text-white">
                            Approved your challenge "FUNSIZE 2". Congrats!
                          </p>
                        </div>
                      </div>
                    </li>


                    <li className="py-4">
                      <div className="flex space-x-3">
                        <i className="fas fa-exclamation-circle text-yellow-500 mt-4"></i>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-blue-500">CTFGuide Admin</h3>
                            <p className="text-xs text-white">01/12/24 1:45 PM EST</p>
                          </div>
                          <p className="text-sm text-white">
                            Your challenge "Eggnog 12" requires changes.
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
                      View all notifications
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
