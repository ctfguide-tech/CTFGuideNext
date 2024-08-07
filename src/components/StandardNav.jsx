import { Fragment, useEffect, useState, useRef } from 'react';
import { Disclosure, Menu, Popover, Transition } from '@headlessui/react';
import { Dialog } from '@headlessui/react';

import {
  Bars3Icon,
  XMarkIcon,
  Cog6ToothIcon,
  PencilSquareIcon,
  ShieldExclamationIcon,
  UserCircleIcon,
  ArrowRightIcon,
  EllipsisVerticalIcon,
  ShieldCheckIcon,
  BellIcon,
} from '@heroicons/react/24/outline';
import { Logo } from '@/components/Logo';
import Link from 'next/link';
import request from '@/utils/request';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis, faSearch } from '@fortawesome/free-solid-svg-icons';
import {
  faBug,
  faLock,
  faUserSecret,
  faNetworkWired,
  faBrain,
  faTerminal,
} from '@fortawesome/free-solid-svg-icons';

import 'reactjs-popup/dist/index.css';
import Upgrade from './nav/Upgrade';

import { useRouter } from 'next/router';
import { LogoAdmin } from './LogoAdmin';
import { CSSTransition } from 'react-transition-group';
import SearchModal from './nav/SearchModal';
import SpawnTerminal from './nav/SpawnTerminal';
import { Context } from '@/context';
import { useContext } from 'react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;
const adminList = ['pranav'];

const DEFAULT_NOTIFICATION = {
  image:
    'https://cutshort-data.s3.amazonaws.com/cloudfront/public/companies/5809d1d8af3059ed5b346ed1/logo-1615367026425-logo-v6.png',
  message: 'You have no notifications.',
  detailPage: '/events',
  receivedTime: '',
};

export function StandardNav({ guestAllowed, alignCenter = true }) {
  const { role, points } = useContext(Context);

  const [terminaIsOpen, setTerminalIsOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  const [isAdmin, setIsAdmin] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [showBanner, setShowBanner] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);

  const [open, setOpen] = useState(true);

  const router = useRouter();

  function logout() {
    document.cookie =
      'idToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/login');
  }

  useEffect(() => {
    if (!localStorage.getItem('dismissStatus')) {
      setShowBanner(true);
    }
  }, []);
  // Function to close the modal
  const closeModal = () => {
    setShowSearchModal(false);
  };

  // Effect to add and remove the event listener
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.keyCode === 27) {
        // 27 is the key code for ESC key
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
    setShowSearchModal((prev) => !prev); // Toggle the state
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

    if (localStorage.getItem('pfp')) {
      setPfp(localStorage.getItem('pfp'));
    }

    const fetchData = async () => {
      try {
        const endPoint =
          process.env.NEXT_PUBLIC_API_URL + '/users/' + username + '/pfp';
        const result = await request(endPoint, 'GET', null);
        if (result) {
          setPfp(result);
        } else {
          setPfp(`https://robohash.org/${username}.png?set=set1&size=150x150`);
        }
      } catch (err) {
        console.log('failed to get profile picture');
      }
    };
    fetchData();
  }, [username]);

  useEffect(() => {
    const fetchNotification = async () => {
      console.log('fetching notifications');
      const endPoint =
        process.env.NEXT_PUBLIC_API_URL + '/account/notifications';
      const result = await request(endPoint, 'GET', null);
      if (!result || !result.length) return;

      console.log('Here is the result');
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
    setUsername(localStorage.getItem('username') || null);
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
        setNotifications(['Unable to get notification, try again']);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const linkClass = (path) =>
    `inline-flex items-center border-b-2 px-4 pt-1 text-md transition-all ${
      router.pathname === path
        ? 'text-blue-500 border-blue-500'
        : 'text-gray-300 hover:text-gray-50 border-transparent'
    }`;

  const panelRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [panelRef]);

  return (
    <>
      {isPopoverOpen && (
        <div
          className="fastanimate animate__animated  animate__faster animate__fadeIn fixed inset-0 z-10 flex hidden items-center justify-center bg-black bg-opacity-70"
          style={{
            backdropFilter: 'blur(2px)',
          }}
          onClick={() => setShowSearchModal(false)}
        >
          <h1>test</h1>

          <br></br>
        </div>
      )}

      <Disclosure as="nav" className=" border-b border-neutral-800 shadow">
        {({ open }) => (
          <>
            <div className={`px-2 ${alignCenter ? 'mx-auto' : ''}`}>
              <div className="flex h-16 justify-between">
                <div className="flex">
                  <div className="-ml-2 mr-2 flex items-center md:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="transition-transform duration-300 hover-bg-neutral-900 inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon
                          className={`block h-6 w-6 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
                          aria-hidden="true"
                        />
                      ) : (
                        <Bars3Icon
                          className={`block h-6 w-6 transition-opacity duration-300 ${open ? 'opacity-0' : 'opacity-100'}`}
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                  <div className="flex flex-shrink-0 items-center">
                    <Link href="/dashboard" aria-label="Dashboard">
                      <Logo />
                    </Link>
                  </div>
                  <div className=" vertical-align md:ml-6 md:flex  ">
                    <Link
                      href="/practice"
                      className={
                        linkClass('/practice') + ' hidden lg:inline-flex'
                      }
                    >
                      Practice
                    </Link>
                    <Link
                      href="/leaderboards"
                      className={
                        linkClass('/leaderboards') + ' hidden lg:inline-flex'
                      }
                    >
                      Leaderboards
                    </Link>
                    <Link
                      href="/create"
                      className={
                        linkClass('/create') +
                        ' hidden md:hidden lg:hidden xl:hidden 2xl:inline-flex'
                      }
                    >
                      Create
                    </Link>

                    <Link
                      href="/groups"
                      className={
                        linkClass('/groups') +
                        ' hidden md:hidden lg:hidden xl:hidden 2xl:inline-flex'
                      }
                    >
                      Classrooms
                    </Link>

                    {/* Ellipsis dropdown */}
                    <Popover className="relative  hidden md:block lg:block lg:inline-flex  xl:block 2xl:hidden">
                      {({ open }) => (
                        <>
                          <Popover.Button className="ring-none inline-flex items-center p-2 text-gray-400 outline-none hover:text-white ">
                            <EllipsisVerticalIcon
                              className="mt-3 h-6 w-6"
                              aria-hidden="true"
                            />
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
                                <div className="relative grid gap-6 border border-neutral-800 bg-neutral-900  sm:gap-8 sm:p-8">
                                  <Link
                                    href="/create"
                                    className="flex w-full items-start rounded-lg "
                                  >
                                    <p className="text-base font-medium text-gray-400 hover:text-white">
                                      Create
                                    </p>
                                  </Link>
                                  <Link
                                    href="/groups"
                                    className=" s flex items-start rounded-lg"
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
                    <div className="ml-4 mt-3 flex-grow ">
                      <div
                        type="text"
                        className="flex hidden w-full items-center rounded-lg border border-transparent bg-neutral-800 px-16 py-2 text-sm font-semibold text-neutral-500 placeholder-gray-300 hover:cursor-pointer hover:text-neutral-50 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 lg:inline-flex"
                        onClick={() => setShowSearchModal(true)}
                      >
                        <FontAwesomeIcon
                          icon={faSearch}
                          className="mr-1 h-3  w-3"
                        />
                        <span className="hidden md:inline">
                          Search for anything
                        </span>
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
                  </div>
                </div>
                {!guestAllowed && (
                  <div className="flex hidden items-center lg:inline-flex ">
                    <button
                      className="hidden rounded-md bg-blue-600 px-2 py-1 text-sm text-white hover:bg-blue-500"
                      onClick={() => setTerminalIsOpen(true)}
                    >
                      <i className="fas fa-terminal"></i> Launch a machine
                    </button>

                    {role !== 'PRO' && (
                      <button
                        className="ml-4 rounded-md bg-gradient-to-br from-amber-600 via-yellow-400 via-75% to-amber-600 px-2 py-1 text-sm text-white hover:from-yellow-600 hover:to-yellow-600"
                        onClick={() => router.push('/settings/billing')}
                      >
                        <i className="fas fa-crown"></i> Upgrade to Pro
                      </button>
                    )}

                    <div
                      className="tooltip mb-0 ml-4 flex cursor-pointer items-center space-x-2 rounded-lg px-4 py-1"
                      style={{ backgroundColor: '#212121', borderWidth: '0px' }}
                    >
                      <h1 className="mx-auto mb-0 mt-0 text-center font-semibold text-blue-500">
                        <i className="far fa-check-circle"></i> {points}
                      </h1>
                    </div>

                    {/* Notification Bell Icon */}
                    <Popover className="relative ml-4">
                      {({ open }) => (
                        <>
                          <Popover.Button className="p-1 rounded-full text-gray-400 hover:text-white focus:outline-none">
                            <BellIcon className="h-6 w-6" aria-hidden="true" />
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
                            <Popover.Panel className="absolute right-0 mt-2 w-80 bg-neutral-800 rounded-md shadow-lg overflow-hidden z-20">
                              <div className="py-2">
                                {notificationData.length > 0 ? (
                                  notificationData.slice(0, 6).map((notification, index) => (
                                    <div key={index} className="flex items-center px-4 py-3 ">
                                    
                                      <div className="ml-3 text-white">
                                        <p className="text-sm font-medium">{notification.message}</p>
                                        <p className="text-xs">{notification.receivedTime}</p>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-center text-gray-500 py-4">No notifications</p>
                                )}
                              </div>
                            </Popover.Panel>
                          </Transition>
                        </>
                      )}
                    </Popover>
                    {/* <div */}
                    {/*   className="mb-0 ml-4 flex items-center space-x-2 rounded-lg px-4 py-1" */}
                    {/*   style={{ backgroundColor: '#212121', borderWidth: '0px' }} */}
                    {/* > */}
                    {/*   <h1 className="mx-auto mb-0 mt-0 text-center font-semibold text-orange-400"> */}
                    {/*     <i class="fas fa-fire"></i> 0 */}
                    {/*   </h1> */}
                    {/* </div> */}
                    <div className="hidden  px-2 md:flex md:flex-shrink-0 md:items-center">
                      {/* Profile dropdown */}
                      <Popover as="div" className="relative ml-3">
                        <div>
                          <Popover.Button
                            onClick={() => setIsPopoverOpen(true)}
                            className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          >
                            <span className="sr-only">Open user menu</span>
                            <img
                              className="h-10 w-10 rounded-full border border-white bg-neutral-900"
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
                          <Popover.Panel className="absolute right-0 z-10 z-40 mt-2 w-48 origin-top-right overflow-hidden rounded-md bg-neutral-800 text-sm shadow-md shadow-black/30 ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="flex w-full items-center">
                              <Link
                                href={`/users/${username}`}
                                className={classNames(
                                  'flex w-full px-4 py-3 font-semibold text-neutral-50 hover:bg-neutral-700'
                                )}
                              >
                                <UserCircleIcon
                                  className="mr-4 block h-6 w-6"
                                  aria-hidden="true"
                                />
                                Profile
                              </Link>
                            </div>
                            <div className="flex w-full items-center">
                              <Link
                                href="/settings"
                                className={classNames(
                                  'flex w-full px-4 py-3 font-semibold text-neutral-50 hover:bg-neutral-700'
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
                                'hidden flex w-full px-4 py-3 font-semibold text-neutral-50 hover:bg-neutral-700'
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
                                'hidden flex w-full px-4 py-3 font-semibold text-neutral-50 hover:bg-neutral-700'
                              )}
                            >
                              <ShieldExclamationIcon
                                className="mr-4 block h-6 w-6"
                                aria-hidden="true"
                              />
                              Report
                            </Link>

                            {role === 'ADMIN' && (
                              <Link
                                href="/moderation"
                                className={classNames(
                                  'flex w-full px-4 py-3 font-semibold text-neutral-50 hover:bg-neutral-700'
                                )}
                              >
                                <ShieldCheckIcon
                                  className="mr-4 block h-6 w-6"
                                  aria-hidden="true"
                                />
                                Moderation
                              </Link>
                            )}

                            <button
                              onClick={logout}
                              className={classNames(
                                'flex w-full cursor-pointer px-4 py-3 font-semibold text-neutral-50 hover:bg-neutral-700'
                              )}
                            >
                              <ArrowRightIcon
                                className="mr-4 block h-6 w-6"
                                aria-hidden="true"
                              />
                              Sign out
                            </button>
                          </Popover.Panel>
                        </Transition>
                      </Popover>
                    </div>
              
                  </div>
                )}
              </div>
            </div>

            <Transition
              show={open}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 transform -translate-y-1"
              enterTo="opacity-100 transform translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 transform translate-y-0"
              leaveTo="opacity-0 transform -translate-y-1"
            >
              <Disclosure.Panel ref={panelRef} className="md:hidden">
                <div className="space-y-1 bg-neutral-800/50 pb-3 pt-2">
                  {/* Current: "bg-blue-50 border-blue-500 text-blue-700", Default: "border-transparent text-gray-300  hover:text-white" */}
                  <Disclosure.Button
                    as="a"
                    href="../dashboard"
                    className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-300 hover:border-gray-300  hover:text-gray-100 sm:pl-5 sm:pr-6"
                  >
                    Dashboard
                  </Disclosure.Button>
                  <Disclosure.Button
                    as="a"
                    href="../practice"
                    className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-300 hover:border-gray-300  hover:text-gray-100 sm:pl-5 sm:pr-6"
                  >
                    Practice
                  </Disclosure.Button>
                  <Disclosure.Button
                    as="a"
                    href="../leaderboards"
                    className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-300 hover:border-gray-300  hover:text-gray-100 sm:pl-5 sm:pr-6"
                  >
                    Leaderboards
                  </Disclosure.Button>
                  <Disclosure.Button
                    as="a"
                    href="../groups"
                    className="block  border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-300 hover:border-gray-300  hover:text-gray-100 sm:pl-5 sm:pr-6"
                  >
                    Classes
                  </Disclosure.Button>
                </div>
                <div className="border-t border-neutral-800 bg-neutral-800/50 pb-3 pt-4">
                  <div className="space-y-1">
                    <Disclosure.Button
                      as="a"
                      href={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/users/${username}`}
                      className="flex hover-bg-neutral-900 block px-4 py-2 text-base font-medium text-gray-300 hover:text-gray-100 sm:px-6"
                    >
                      <UserCircleIcon className="mr-4 block h-6 w-6" aria-hidden="true" />
                      Profile
                    </Disclosure.Button>
                    <Disclosure.Button
                      as="a"
                      href="/settings"
                      className="flex hover-bg-neutral-900 block px-4 py-2 text-base font-medium text-gray-300 hover:text-gray-100 sm:px-6"
                    >
                      <Cog6ToothIcon className="mr-4 block h-6 w-6" aria-hidden="true" />
                      Settings
                    </Disclosure.Button>

                    <Disclosure.Button
                      as="a"
                      onClick={logout}
                      className="flex cursor-pointer block px-4 py-2 text-base font-medium text-red-500 hover:text-red-400 sm:px-6"
                    >
                      <ArrowRightIcon className="mr-4 block h-6 w-6" aria-hidden="true" />
                      Sign out
                    </Disclosure.Button>
                  </div>
                </div>
                <div className="border-t border-neutral-800 bg-neutral-800/50 pb-3 pt-4">
                  <div className="px-4">
                    <div
                      type="text"
                      className="flex w-full items-center rounded-lg border border-transparent bg-neutral-800 px-4 py-2 text-sm font-semibold text-neutral-500 placeholder-gray-300 hover:cursor-pointer hover:text-neutral-50 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onClick={() => setShowSearchModal(true)}
                    >
                      <FontAwesomeIcon
                        icon={faSearch}
                        className="mr-1 h-3 w-3"
                      />
                      <span>Search for anything</span>
                    </div>
                  </div>
                </div>
              </Disclosure.Panel>
            </Transition>
          </>
        )}
      </Disclosure>

      <SearchModal
        showSearchModal={showSearchModal}
        setShowSearchModal={setShowSearchModal}
      />
      <Upgrade open={upgradeModalOpen} setOpen={setUpgradeModalOpen} />

        <div className="mx-auto hidden w-full bg-yellow-800 py-1 text-center  text-sm text-white ">
          <h1 className="mx-auto  px-4 text-left">
              Our terminal infrastructure is experiencing issues due to hardware faults. We are taking steps to resolve this and get things working again as possible.
          </h1>
        </div>
     

      <SpawnTerminal open={terminaIsOpen} setOpen={setTerminalIsOpen} />
    </>
  );
}
