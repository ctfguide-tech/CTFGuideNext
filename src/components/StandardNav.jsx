import { Fragment, useEffect, useState } from 'react';
import { Disclosure, Menu, Popover, Transition } from '@headlessui/react';
import { Dialog } from '@headlessui/react'

import {
  Bars3Icon,
  XMarkIcon,
  Cog6ToothIcon,
  PencilSquareIcon,
  ShieldExclamationIcon,
  UserCircleIcon,
  ArrowRightIcon,
  EllipsisVerticalIcon,
} from '@heroicons/react/24/outline';
import { Logo } from '@/components/Logo';
import Link from 'next/link';
import request from "@/utils/request";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faSearch } from '@fortawesome/free-solid-svg-icons';
import { faBug, faLock, faUserSecret, faNetworkWired, faBrain, faTerminal } from '@fortawesome/free-solid-svg-icons';
// Do not remove, even if detected as unused by vscode!
import { app } from '../config/firebaseConfig';

import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import 'reactjs-popup/dist/index.css';
import { useRouter } from 'next/router';
import { LogoAdmin } from './LogoAdmin';
import { CSSTransition } from 'react-transition-group';


function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const auth = getAuth();
const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;

const adminList = ['pranav'];

const DEFAULT_NOTIFICATION = {
  image:
    'https://cutshort-data.s3.amazonaws.com/cloudfront/public/companies/5809d1d8af3059ed5b346ed1/logo-1615367026425-logo-v6.png',
  message: 'Notification one.',
  detailPage: '/events',
  receivedTime: '12h ago',
};

export function StandardNav({ guestAllowed, alignCenter = true }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [points, setPoints] = useState('0');
  const [notifications, setNotifications] = useState([]);
  const [showBanner, setShowBanner] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [open, setOpen] = useState(true)
  


  const router = useRouter();

  function logout() {
    signOut(auth)
      .then(() => {
        window.location.replace('/login');
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // if user signed out redirect
  // if env is NEXT_PUBLIC_APP_AUTH_DOMAIN=ctfguide-dev.firebaseapp.com the logo should say CTFGuide Developer not CTFGuide Beta

  useEffect(() => {
    if (!localStorage.getItem('dismissStatus')) {
      setShowBanner(true);
    }

    if (
      process.env.NEXT_PUBLIC_APP_AUTH_DOMAIN === 'ctfguide-dev.firebaseapp.com'
    ) {
      //  setIsAdmin(true)
    }
  }, []);
    // Function to close the modal
    const closeModal = () => {
      setShowSearchModal(false);
    };
  
    // Effect to add and remove the event listener
    useEffect(() => {
      const handleKeyDown = (event) => {
        if (event.keyCode === 27) { // 27 is the key code for ESC key
          closeModal();
        }
      };
  
      // Add event listener
      document.addEventListener('keydown', handleKeyDown);
  
      // Remove event listener on cleanup
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, []); 

  const toggleSearchModal = () => {
    setShowSearchModal(prev => !prev); // Toggle the state
  };

  const [notification, showNotifications] = useState(false);
  const [notificationData, setNotificationData] = useState([
    DEFAULT_NOTIFICATION,
  ]);

  const [username, setUsername] = useState(null);
  const [pfp, setPfp] = useState(null);

  // get user's profile picture
  useEffect(() => {
    if (!username) {
      return;
    }

    if (localStorage.getItem("pfp")) {
      setPfp(localStorage.getItem("pfp"));
    }

    const fetchData = async () => {
      try {
        const endPoint = process.env.NEXT_PUBLIC_API_URL + '/users/' + username + '/pfp';
        const result = await request(endPoint, "GET", null);
        if (result) {
          setPfp(result)
        } else {
          setPfp(`https://robohash.org/${username}.png?set=set1&size=150x150`)
        }

      } catch (err) {
        console.log('failed to get profile picture')
      }
    };
    fetchData();
  }, [username]);

  useEffect(() => {
    const fetchNotification = async () => {
      const endPoint = process.env.NEXT_PUBLIC_API_URL + '/account/notifications';
      const result = await request(endPoint, 'GET', null);
      if (!result || !result.length) return;

      console.log("Here is the result");
      console.log(result);

      setNotificationData(
        result.map((notification) => {
          const currentDate = new Date();
          const createdAt = new Date(notification.createdAt);
          const timedelta = currentDate - createdAt;
          console.log(notification);
          let noti = '';

          let seconds = Math.floor(timedelta / 1000);
          let minutes = Math.floor(seconds / 60);
          seconds = seconds % 60;
          let hours = Math.floor(minutes / 60);
          minutes = minutes % 60;
          let days = Math.floor(hours / 24);
          hours = hours % 24;

          if (days) noti = days + ' days';
          else if (hours) noti = hours + ' hours';
          else if (minutes) noti = minutes + ' minutes';
          else noti = seconds = ' seconds';

          return {
            message: notification.message,
            receivedTime: noti + ' ago',
            detailPage: '/events',
            image:
              'https://cutshort-data.s3.amazonaws.com/cloudfront/public/companies/5809d1d8af3059ed5b346ed1/logo-1615367026425-logo-v6.png',
          };
        })
      );
    };
    setUsername(localStorage.getItem("username") || null);
    fetchNotification();
  }, []);

  function dismissStatus() {
    localStorage.setItem('dismissStatus', true);
    setShowBanner(false);
  }

  const fetchNotifications = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/notification`;
      const data = await request(url, 'GET', null);
      console.log(data);
      if (data.success) {
        setNotifications(data.body);
        console.log(data);
      } else {
        setNotifications(["Unable to get notification, try again"]);
      }

    } catch (err) {
      console.log(err);
    }
  }

  const linkClass = (path) => `inline-flex items-center border-b-2 px-4 pt-1 text-md font-semibold transition-all ${
    router.pathname === path ? 'text-blue-500 border-blue-500' : 'text-gray-300 hover:text-gray-50 border-transparent'
  }`;

  return (
    <>
        {isPopoverOpen && (
            <div 
            className="fastanimate hidden  fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-70 animate__animated animate__faster animate__fadeIn"
            style={{ 
              backdropFilter: 'blur(2px)',
             }}
            onClick={() => setShowSearchModal(false)}
          >
            <h1>test</h1>

            <br></br>
            </div>
    )}

<Transition.Root show={open} as={Fragment}>
      <Dialog className="relative z-10" onClose={setOpen}>
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col divide-y divide-neutral-800 bg-neutral-900 border-l-2 border-neutral-800 shadow-xl">
                    <div className="flex min-h-0 flex-1 flex-col overflow-y-scroll py-6">
                      <div className="px-4 sm:px-6">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="text-base font-semibold leading-6 text-xl text-white">
                          <i className="fas fa-terminal"></i> Spawn a terminal
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="relative rounded-md bg-red-900 text-red-400 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                              onClick={() => setOpen()}
                            >
                              <span className="absolute -inset-2.5" />
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="relative mt-6 flex-1 px-4 sm:px-6 text-white">

                      <h1>Choose an operating system</h1>
                      <div>

      <select
        id="os"
        name="os"
        className="mt-2 block w-full bg-neutral-800 rounded-md py-1.5 pl-3 pr-10 text-white  border-neutral-800 sm:text-sm sm:leading-6"
        defaultValue="Ubuntu 22.10 LTS"
      >
        <option>Ubuntu 22.10 LTS</option>
        <option>Alpine Linux</option>
        <option>Kali Linux (CTFGuide Pro)</option>
      </select>
    </div>

    <div className='border-l-4  border-blue-600 px-4 py-3 bg-neutral-800 mt-4'>
              <h1>You need CTFGuide Pro to use this operating system.</h1>
              <button className='text-sm bg-blue-600 hover:bg-blue-500 px-2 py-1 mt-2 rounded-lg '>Upgrade now for $5/month</button>
    </div>

    <h1 className="mt-6">Container Interaction</h1>

    <div className="mt-2 flex w-full mx-auto text-center gap-x-4">
      <div className='border rounded-lg w-full py-4 cursor-pointer hover:bg-neutral-600/50'>
              <h1>WebVNC</h1>
      </div>
           <div className='border rounded-lg w-full py-4 cursor-pointer hover:bg-neutral-600/50'>
              <h1>ShellInABox</h1>
      </div>
    </div>

    <h1 className="mt-6">Import Files</h1>
    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-white/25 px-6 py-10">
                <div className="text-center">
                <i className="text-4xl text-neutral-200 fas fa-file-archive"></i>
                  <div className="mt-4 flex text-sm leading-6 text-gray-400">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-gray-900 font-semibold text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 hover:text-blue-500"
                    >
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-400">.zip</p>
                </div>
              </div>
     
      


                      </div>
                    </div>
                    <div className="flex flex-shrink-0 justify-end px-4 py-4">
                      <button
                        type="button"
                        className="rounded-md  px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
                        onClick={() => {
                          setOpen(true);
                        
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="ml-4 inline-flex justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                      >
                        Deploy machine
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
      <Disclosure as="nav" className=" shadow border-b border-neutral-800">
        {({ open }) => (
          <>
            <div className={`px-2 ${alignCenter ? 'mx-auto' : ''}`}>
              <div className="flex h-16 justify-between">
                <div className="flex">
                  <div className="-ml-2 mr-2 flex items-center md:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="hover-bg-neutral-900 inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <Bars3Icon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                  <div className="flex flex-shrink-0 items-center">
                    <Link href='/dashboard' aria-label="Dashboard">
                      {isAdmin ? <LogoAdmin /> : <Logo />}
                    </Link>
                  </div>
                  <div className=" md:ml-6 md:flex vertical-align  ">
             
                    <Link
                      href='/practice'
                      className={linkClass('/practice')}
                    >
                      Practice
                    </Link>
                    <Link
                      href='/competitions'
                      className={linkClass('/competitions')}
                    >
                      Competitions
                    </Link>
                    <Link
                      href='/leaderboards'
                      className={linkClass('/leaderboards') + " hidden lg:inline-flex"}
                    >
                      Leaderboards
                    </Link>
                    <Link
                      href='/create'
                      className={linkClass('/create') + " lg:hidden"}
                    >
                      Create
                                         </Link>

                    <Link
                      href='/groups'
                      className={linkClass('/groups')}
                    >
                      Classrooms
                    </Link>

                    {/* Ellipsis dropdown */}
                    <Popover className="relative lg:hidden ">
                      {({ open }) => (
                        <>
                          <Popover.Button className="inline-flex items-center p-2 text-gray-400 hover:text-white ring-none outline-none " >
                            <EllipsisVerticalIcon className="h-6 w-6 mt-3" aria-hidden="true" />
                          </Popover.Button>
                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0 translate-y-1"
                            enterTo="opacity-100 translate-y-0"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100 translate-y-0"
                            leaveTo="opacity-0 translate-y-1"
                          >
                            <Popover.Panel className="absolute z-10 w-48 max-w-sm transform px-4 sm:px-0 lg:max-w-3xl">
                              <div className="overflow-hidden  shadow-lg ">
                                <div className="relative grid gap-6 bg-neutral-900 border border-neutral-800  sm:gap-8 sm:p-8">
                                  <Link
                                    href="/create"
                                    className="w-full flex items-start rounded-lg "
                                  >
                                    <p className="text-base font-medium text-gray-400 hover:text-white">
                                      Create
                                    </p>
                                  </Link>
                                  <Link
                                    href="/groups"
                                    className=" flex items-start rounded-lg s"
                                  >
                                    <p className="text-base font-medium text-gray-400 hover:text-white">
                                      Classrooms
                                    </p>
                                  </Link>
                                </div>
                              </div>
                            </Popover.Panel>
                          </Transition>
                        </>
                      )}
                    </Popover>

                      {/*search bar*/}
                      <div className="mt-3 ml-4 flex-grow ">
                      
                          <div
                          type="text" 
                          className="w-full px-16 vertical-align flex  py-2 text-sm font-semibold text-neutral-500 hover:text-neutral-50 placeholder-gray-300 bg-neutral-800   hover:cursor-pointer border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          onClick={() => setShowSearchModal(true)}
                        >
                          <FontAwesomeIcon icon={faSearch} className="w-3 h-3 mt-1.5 mr-1" /> Search for anything
                          </div>
                        
                        </div>
                    {/* <Link */}
                    {/*   href={`${baseUrl}/live`} */}
                    {/*   className="inline-flex items-center border-b-2 border-transparent px-4 pt-1 text-sm font-semibold text-gray-300 hover:text-gray-50 transition-all" */}
                    {/* > */}
                    {/*   Live */}
                    {/* </Link> */}
                    {/**/}
                    {/* <Link */}
                    {/*   href='/edu' */}
                    {/*   className="inline-flex items-center border-b-2 border-transparent px-4 pt-1 text-sm font-semibold text-gray-300 hover:text-gray-50 transition-all" */}
                    {/* > */}
                    {/*   EDU */}
                    {/* </Link> */}
                    {isAdmin && (
                      <p
                        href={`${baseUrl}/live`}
                        className="inline-flex items-center border-b-2 border-transparent px-4 pt-1 text-sm font-semibold text-gray-300 hover:text-gray-50 transition-all"
                      >
                        CTFGUIDE INTERNAL
                      </p>
                    )}
                  </div>
                </div>
                {!guestAllowed &&
                  <div className="flex items-center ">
                    <button className='bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 text-sm rounded-md' onClick={setOpen(true)}>Open Terminal</button>
                   <div  className="ml-2 mb-0 flex items-center space-x-2 rounded-lg px-4 py-1" 
                     style={{ backgroundColor: '#212121', borderWidth: '0px' }} 
                     > 
                     <h1 className="mx-auto mb-0 mt-0 text-center font-semibold  text-blue-500"> 
                   <i class="far fa-check-circle"></i> {points} 
                  </h1> 
                   </div> 
                    {/* <div */}
                    {/*   className="mb-0 ml-4 flex items-center space-x-2 rounded-lg px-4 py-1" */}
                    {/*   style={{ backgroundColor: '#212121', borderWidth: '0px' }} */}
                    {/* > */}
                    {/*   <h1 className="mx-auto mb-0 mt-0 text-center font-semibold text-orange-400"> */}
                    {/*     <i class="fas fa-fire"></i> 0 */}
                    {/*   </h1> */}
                    {/* </div> */}
                    <div className="hidden md:ml-4 md:flex md:flex-shrink-0 md:items-center">
                      {/* Profile dropdown */}
                      <Popover as="div" className="relative ml-3" >
                        <div>
                          <Popover.Button onClick={() => setIsPopoverOpen(true)} className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                            <span className="sr-only">Open user menu</span>
                            <img
                              className="h-10 w-10 rounded-full border bg-neutral-900 border-white"
                              src={pfp}
                              loading="lazy"
                              alt=""
                            />
                          </Popover.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-200"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Popover.Panel className="z-40 absolute text-sm right-0 z-10 mt-2 w-48 overflow-hidden origin-top-right rounded-md bg-neutral-800 shadow-md shadow-black/30 ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="flex items-center w-full">
                              <Link
                                href={`/users/${username}`}
                                className={classNames(
                                  'flex px-4 py-3 font-semibold w-full text-neutral-50 hover:bg-neutral-700'
                                )}
                              >
                                <UserCircleIcon
                                  className="mr-4 block h-6 w-6"
                                  aria-hidden="true"
                                />
                                Profile
                              </Link>
                            </div>
                            <div className="flex items-center w-full">
                              <Link
                                href="/settings"
                                className={classNames(
                                  'flex px-4 py-3 font-semibold w-full text-neutral-50 hover:bg-neutral-700'
                                )}
                              >
                                <Cog6ToothIcon
                                  className="mr-4 block h-6 w-6"
                                  aria-hidden="true"
                                />
                                Settings
                              </Link>
                            </div>
                            <a
                              href="https://ctfguide.hellonext.co/b/feedback"
                              className={classNames(
                                'flex px-4 py-3 font-semibold w-full text-neutral-50 hover:bg-neutral-700'
                              )}
                            >
                              <PencilSquareIcon
                                className="mr-4 block h-6 w-6"
                                aria-hidden="true"
                              />
                              Feedback
                            </a>
                            <Link
                              href="/report"
                              className={classNames(
                                'flex px-4 py-3 font-semibold w-full text-neutral-50 hover:bg-neutral-700'
                              )}
                            >
                              <ShieldExclamationIcon
                                className="block mr-4 h-6 w-6"
                                aria-hidden="true"
                              />
                              Report
                            </Link>
                            <button
                              onClick={logout}
                              className={classNames(
                                'flex px-4 py-3 font-semibold w-full text-neutral-50 hover:bg-neutral-700 cursor-pointer'
                              )}
                            >
                              <ArrowRightIcon
                                className="block mr-4 h-6 w-6"
                                aria-hidden="true"
                              />
                              Sign out
                            </button>
                          </Popover.Panel>
                        </Transition>
                      </Popover>
                    </div>
                  </div>
                }

              </div>
            </div>

            <Disclosure.Panel className="md:hidden">
              <div className="space-y-1 bg-neutral-800/50 pb-3 pt-2">
                {/* Current: "bg-blue-50 border-blue-500 text-blue-700", Default: "border-transparent text-gray-300  hover:text-white" */}
                <Disclosure.Button
                  as="a"
                  href="../dashboard"
                  className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-300 hover:border-gray-300  hover:text-gray-700 sm:pl-5 sm:pr-6"
                >
                  Dashboard
                </Disclosure.Button>
                <Disclosure.Button
                  as="a"
                  href="../learn"
                  className=" block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-300 hover:border-gray-300  hover:text-gray-700 sm:pl-5 sm:pr-6"
                >
                  Learn
                </Disclosure.Button>
                <Disclosure.Button
                  as="a"
                  href="../groups"
                  className="block hidden border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-300 hover:border-gray-300  hover:text-gray-700 sm:pl-5 sm:pr-6"
                >
                  Classes
                </Disclosure.Button>
                <Disclosure.Button
                  as="a"
                  href="../practice"
                  className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-300 hover:border-gray-300  hover:text-gray-700 sm:pl-5 sm:pr-6"
                >
                  Practice
                </Disclosure.Button>
                <Disclosure.Button
                  as="a"
                  href="../live"
                  className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-300 hover:border-gray-300  hover:text-gray-700 sm:pl-5 sm:pr-6"
                >
                  Live
                </Disclosure.Button>
              </div>
              <div className="border-t border-neutral-800 bg-neutral-800/50 pb-3 pt-4">
                <div className="space-y-1">
                  <Disclosure.Button
                    as="a"
                    href={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/users/${username}`}
                    className="hover-bg-neutral-900 block px-4 py-2 text-base font-medium text-gray-300 hover:text-gray-800 sm:px-6"
                  >
                    Profile
                  </Disclosure.Button>
                  <Disclosure.Button
                    as="a"
                    href="#"
                    className="hover-bg-neutral-900 block px-4 py-2 text-base font-medium text-gray-300 hover:text-gray-800 sm:px-6"
                  >
                    Settings
                  </Disclosure.Button>
                  <Disclosure.Button
                    as="a"
                    onClick={logout}
                    className="hover-bg-neutral-900 block px-4 py-2 text-base font-medium text-gray-300 hover:text-gray-800 sm:px-6"
                  >
                    Sign out
                  </Disclosure.Button>
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure >

      {showSearchModal && (
          <div
          onEnter={() => setShowSearchModal(true)}
      
        >
        <div 
      className="fastanimate  fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 animate__animated animate__faster animate__fadeIn"
      style={{ 
        backdropFilter: 'blur(2px)',
       }}
      onClick={() => setShowSearchModal(false)}
    >
         <div 
        className="relative transform overflow-hidden rounded-lg bg-neutral-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:p-6 sm:max-w-3xl sm:mx-auto sm:rounded-xl sm:shadow-2xl sm:ring-1 sm:ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
            <div className="px-4 py-5 sm:px-6 mx-auto">
              <div className='flex items-center mx-auto'>
                <FontAwesomeIcon icon={faSearch} className="w-5 h-5  mr-1 text-white" />
                <input placeholder="Search for challenges, users, or competitions" className='w-full border-0 text-xl focus:ring-0 bg-transparent text-white' autoFocus></input>
              </div>
              <h1 className='mt-10 text-xl text-white font-semibold mb-4'>Search by Category</h1>
              <div className="flex flex-wrap gap-2">
                <button className="px-4 py-2 rounded bg-blue-500 bg-opacity-50 border border-blue-800 hover:brightness-110 text-white flex items-center gap-2">
                  <FontAwesomeIcon icon={faBug} className='w-4 h-4' />
                  <span>Web Exploitation</span>
                </button>
                <button className="px-4 py-2 rounded bg-green-500 bg-opacity-50 border border-green-800 hover:brightness-110 text-white flex items-center gap-2">
                  <FontAwesomeIcon icon={faLock} className='w-4 h-4' />
                  <span>Cryptography</span>
                </button>
                <button className="px-4 py-2 rounded bg-red-500 bg-opacity-50 border border-red-800 hover:brightness-110 text-white flex items-center gap-2">
                  <FontAwesomeIcon icon={faUserSecret} className='w-4 h-4' />
                  <span>Reverse Engineering</span>
                </button>
                <button className="px-4 py-2 rounded bg-yellow-500 bg-opacity-50 border border-yellow-800  hover:brightness-110 text-white flex items-center gap-2">
                  <FontAwesomeIcon icon={faNetworkWired} className='w-4 h-4' />
                  <span>Networking</span>
                </button>
                <button className="px-4 py-2 rounded bg-purple-500 bg-opacity-50 border border-purple-800 hover:brightness-110  text-white flex items-center gap-2">
                  <FontAwesomeIcon icon={faBrain} className='w-4 h-4' />
                  <span>Forensics</span>
                </button>
                <button className="px-4 py-2 rounded bg-pink-500 bg-opacity-50 border border-pink-800 hover:brightness-110  text-white flex items-center gap-2">
                  <FontAwesomeIcon icon={faTerminal} className='w-4 h-4' />
                  <span>Binary Exploitation</span>
                </button>
              </div>
            </div>
            <div className="px-4 py-5 sm:p-6">{/* Content goes here */}</div>
          </div>
        </div>
        </div>
      )}

      {isAdmin && (
        <div className="bg-neutral-800 py-1 text-center text-sm text-white ">
          <h1>CTFGuide is running in development mode. </h1>
        </div>
      )
      }

      {
        !['/groups', '/assignments', '/submissions'].some(path => router.pathname.includes(path) || !showBanner) && (
          <div className="bg-neutral-800 py-1 text-center text-sm text-white  mx-auto ">
            <h1 className='max-w-6xl mx-auto text-left'>Limited feature availability for GP. View entire site status <a className='text-blue-500 font-semibold' href="https://status.ctfguide.com">here</a>.  <i onClick={dismissStatus} className='text-right float-right text-neutral-500 hover:text-neutral-300 cursor-pointer'>Dismiss</i></h1>
          </div>
        )
      }
    </>
  );
}
