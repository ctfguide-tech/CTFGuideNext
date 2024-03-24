import { Fragment, useEffect, useState } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
  Cog6ToothIcon,
  PencilSquareIcon,
  ShieldExclamationIcon,
  UserCircleIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { Logo } from '@/components/Logo';
import Link from 'next/link';
import request from "@/utils/request";

// Do not remove, even if detected as unused by vscode!
import { app } from '../config/firebaseConfig';

import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import 'reactjs-popup/dist/index.css';
import { useRouter } from 'next/router';
import { LogoAdmin } from './LogoAdmin';

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

export function StandardNav(props) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [points, setPoints] = useState('0');
  const [notifications, setNotifications] = useState([]);
  const [showBanner, setShowBanner] = useState(false);
  const { guestAllowed } = props;
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
      if(data.success) {
        setNotifications(data.body);
        console.log(data);
      } else {
        setNotifications(["Unable to get notification, try again"]);
      }

    } catch(err) {
      console.log(err);
    }
  }

  return (
    <>
      <Disclosure as="nav" className=" shadow">
        {({ open }) => (
          <>
            <div className="mx-auto sm:max-w-7xl md:max-w-7xl lg:max-w px-4 sm:px-6 lg:px-8">
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
                    <Link href={`${baseUrl}/dashboard`} aria-label="Dashboard">
                      {isAdmin ? <LogoAdmin /> : <Logo />}
                    </Link>
                  </div>
                  <div className="hidden md:ml-6 md:flex ">
                    {/* Current: "border-blue-500 text-white", Default: "border-transparent text-gray-300 hover:font-bold" */}
                    <Link
                      href={`${baseUrl}/dashboard`}
                      className="ml-2 inline-flex items-center border-b-2 border-transparent px-4 pt-1 text-sm font-medium text-gray-300 hover:font-bold hover:text-gray-200 "
                    >
                      Dashboard
                    </Link>
                    <Link
                      href={`${baseUrl}/learn`}
                      className=" inline-flex items-center border-b-2 border-transparent px-4 pt-1 text-sm font-medium text-gray-300 hover:font-bold hover:text-gray-200"
                    >
                      Learn
                    </Link>
                    <Link
                      href={`${baseUrl}/groups`}
                      className=" inline-flex items-center border-b-2 border-transparent px-4 pt-1 text-sm font-medium text-gray-300 hover:font-bold hover:text-gray-200"
                    >
                      Classes
                    </Link>
                    <Link
                      href={`${baseUrl}/practice`}
                      className="inline-flex items-center border-b-2 border-transparent px-4 pt-1 text-sm font-medium text-gray-300 hover:font-bold hover:text-gray-200"
                    >
                      Practice
                    </Link>
                    <Link
                      href={`${baseUrl}/create`}
                      className="inline-flex items-center border-b-2 border-transparent px-4 pt-1 text-sm font-medium text-gray-300 hover:font-bold hover:text-gray-200"
                    >
                      Create
                    </Link>

                    <Link
                      href={`${baseUrl}/live`}
                      className="hidden inline-flex items-center border-b-2 border-transparent px-4 pt-1 text-sm font-medium text-gray-300 hover:font-bold hover:text-gray-200"
                    >
                      Live
                    </Link>

                    <a
                      href={`${baseUrl}/edu`}
                      className="inline-flex hidden items-center border-b-2 border-transparent px-4 pt-1 text-sm font-medium text-gray-300 hover:font-bold hover:text-gray-200"
                    >
                      EDU
                    </a>
                    {isAdmin && (
                      <p
                        href={`${baseUrl}/live`}
                        className="inline-flex items-center border-b-2 border-transparent px-4 pt-1 text-sm text-xl font-medium font-semibold text-neutral-800  "
                      >
                        CTFGUIDE INTERNAL
                      </p>
                    )}
                  </div>
                </div>
                { !guestAllowed && 
                  <div className="flex items-center ">
                  <div
                    className="mb-0 flex items-center space-x-2 rounded-lg px-4 py-1"
                    style={{ backgroundColor: '#212121', borderWidth: '0px' }}
                  >
                    <h1 className="mx-auto mb-0 mt-0 text-center font-semibold  text-blue-500">
                      <i class="far fa-check-circle"></i> {points}
                    </h1>
                  </div>
                  <div
                    className="mb-0 ml-4 flex items-center space-x-2 rounded-lg px-4 py-1"
                    style={{ backgroundColor: '#212121', borderWidth: '0px' }}
                  >
                    <h1 className="mx-auto mb-0 mt-0 text-center font-semibold text-orange-400">
                      <i class="fas fa-fire"></i> 0
                    </h1>
                  </div>
                  <div className="hidden md:ml-4 md:flex md:flex-shrink-0 md:items-center">
                    {/* Profile dropdown */}
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                          <span className="sr-only">Open user menu</span>
                          <img
                            className="h-8 w-8 rounded-full border bg-neutral-900 "
                            src={pfp}
                            loading="lazy"
                            alt=""
                          />
                        </Menu.Button>
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
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-neutral-900 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/users/${username}`}
                                className={classNames(
                                  active ? '-100' : '',
                                  'block flex px-4 py-2 text-sm text-white hover:bg-neutral-800'
                                )}
                              >
                                Your Profile{' '}
                                <UserCircleIcon
                                  className="ml-auto mt-1 block h-4 w-4"
                                  aria-hidden="true"
                                />
                              </a>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="../../settings"
                                className={classNames(
                                  active ? '-100' : '',
                                  'block flex px-4 py-2 text-sm text-white hover:bg-neutral-800'
                                )}
                              >
                                Settings{' '}
                                <Cog6ToothIcon
                                  className="ml-auto mt-1 block h-4 w-4"
                                  aria-hidden="true"
                                />
                              </a>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="https://ctfguide.hellonext.co/b/feedback"
                                className={classNames(
                                  active ? '-100' : '',
                                  'block flex px-4 py-2 text-sm text-white hover:bg-neutral-800'
                                )}
                              >
                                Feedback{' '}
                                <PencilSquareIcon
                                  className="ml-auto mt-1 block h-4 w-4"
                                  aria-hidden="true"
                                />
                              </a>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href="../../report"
                                className={classNames(
                                  active ? '-100' : '',
                                  'block flex px-4 py-2 text-sm text-white hover:bg-neutral-800'
                                )}
                              >
                                Report{' '}
                                <ShieldExclamationIcon
                                  className="ml-auto mt-1 block h-4 w-4"
                                  aria-hidden="true"
                                />
                              </a>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <span
                                onClick={logout}
                                className={classNames(
                                  active ? '-100' : '',
                                  'block flex cursor-pointer px-4 py-2 text-sm text-white hover:bg-neutral-800'
                                )}
                              >
                                Sign out{' '}
                                <ArrowRightIcon
                                  className="ml-auto mt-1 block h-4 w-4"
                                  aria-hidden="true"
                                />
                              </span>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </div>
                }
              
              </div>
            </div>

            <Disclosure.Panel className="md:hidden">
              <div className="space-y-1 bg-neutral-800/50 pb-3 pt-2">
                {/* Current: "bg-blue-50 border-blue-500 text-blue-700", Default: "border-transparent text-gray-300  hover:font-bold" */}
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
                    Your Profile
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
                    href="#"
                    onClick={{ logout }}
                    className="hover-bg-neutral-900 block px-4 py-2 text-base font-medium text-gray-300 hover:text-gray-800 sm:px-6"
                  >
                    Sign out
                  </Disclosure.Button>
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      {isAdmin && (
        <div className="bg-neutral-800 py-1 text-center text-sm text-white ">
          <h1>CTFGuide is running in development mode. </h1>
        </div>
      )}

      {!['/groups', '/assignments', '/submissions'].some(path => router.pathname.includes(path) || !showBanner) && (
        <div className="bg-neutral-800 py-1 text-center text-sm text-white  mx-auto ">
          <h1 className='max-w-6xl mx-auto text-left'>Limited feature availability for GP. View entire site status <a className='text-blue-500 font-semibold' href="https://status.ctfguide.com">here</a>.  <i onClick={dismissStatus} className='text-right float-right text-neutral-500 hover:text-neutral-300 cursor-pointer'>Dismiss</i></h1>
        </div>
      )}
    </>
  );
}
