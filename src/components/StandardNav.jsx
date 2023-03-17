import { Fragment, useEffect, useState, useRef, useContext } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon, Cog6ToothIcon, PencilSquareIcon, ShieldExclamationIcon, UserCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { Logo } from '@/components/Logo'
import { app } from '../config/firebaseConfig';
import { getAuth, onAuthStateChanged, signOut, getIdToken} from "firebase/auth";
import { redirect } from 'next/navigation';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const auth = getAuth();
const user = auth.currentUser;

const DEFAULT_NOTIFICATION = {
  image:
    "https://cutshort-data.s3.amazonaws.com/cloudfront/public/companies/5809d1d8af3059ed5b346ed1/logo-1615367026425-logo-v6.png",
  message: "Notification one.",
  detailPage: "/events",
  receivedTime: "12h ago"
};

export function StandardNav() {

  function logout() { 
    signOut(auth).then(() => {
      window.location.replace("/login")
    }).catch((error) => {
      console.log(error)
    });
  }


  const [notification, showNotifications] = useState(false)
  const [notificationData, setNotificationData] = useState([DEFAULT_NOTIFICATION]);

  useEffect(() => {
    const fetchNotification = async () => {
      const endPoint = process.env.NEXT_PUBLIC_API_URL + '/account/notifications';
      const requestOptions = {
          method: 'GET',
          headers: { 
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + localStorage.getItem('idToken'),
          },
      };
      const response = await fetch(endPoint, requestOptions);
      const result = await response.json();
      if(!result || !result.length) return;

      setNotificationData(result.map(notification => {
        const currentDate = new Date();
        const createdAt = new Date(notification.createdAt)
        const timedelta = currentDate - createdAt;
        console.log(notification)
        let noti = "";

        let seconds = Math.floor(timedelta / 1000);
        let minutes = Math.floor(seconds / 60);
        seconds = seconds % 60;
        let hours = Math.floor(minutes / 60);
        minutes = minutes % 60;
        let days = Math.floor(hours / 24);
        hours = hours % 24;

        if(days) noti = days + ' days';
        else if(hours) noti = hours + ' hours';
        else if (minutes) noti = minutes + ' minutes';
        else noti = seconds = ' seconds';

        return {
          message: notification.message,
          receivedTime: noti + " ago",
          detailPage: '/events',
          image: "https://cutshort-data.s3.amazonaws.com/cloudfront/public/companies/5809d1d8af3059ed5b346ed1/logo-1615367026425-logo-v6.png",
        }
      }));
    };
    fetchNotification();
  }, []);

  return (
    
    <Disclosure as="nav" className=" shadow">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="-ml-2 mr-2 flex items-center md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex flex-shrink-0 items-center">
               
                  <Logo className=" w-4 lg:hidden"/>
               
                </div>
                <div className="hidden md:ml-6 md:flex md:space-x-8">
                  {/* Current: "border-blue-500 text-white", Default: "border-transparent text-gray-300 hover:border-gray-300 hover:text-gray-700" */}
                  <a
                    href="../../dashboard"
                    className="ml-2 inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-300 hover:border-gray-300 hover:text-gray-700 hover:text-gray-200"
                  >
                    Dashboard
                  </a>
                  <a
                    href="../../learn"
                    className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-300 hover:border-gray-300 hover:text-gray-700 hover:text-gray-200"
                  >
                    Learn
                  </a>
                  <a
                    href="../../groups"
                    className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-300 hover:border-gray-300 hover:text-gray-700 hover:text-gray-200"
                  >
                    Groups
                  </a>
                  <a
                    href="../../practice"
                    className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-300 hover:border-gray-300 hover:text-gray-700 hover:text-gray-200"
                  >
                    Practice
                  </a>
                  <a
                    href="../../create"
                    className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-300 hover:border-gray-300 hover:text-gray-700 hover:text-gray-200"
                  >
                    Create
                  </a>
                  <a
                    href="../../live"
                    className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-300 hover:border-gray-300 hover:text-gray-700 hover:text-gray-200"
                  >
                    Live
                  </a>

                  
                </div>
              </div>
              <div className="flex items-center">

                <div className="hidden md:ml-4 md:flex md:flex-shrink-0 md:items-center">
                <Popup trigger={
                  <button
                    id="bell-button"
                    type="button"
                    class="rounded-full mr-3 p-1 text-gray-200 hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <span class="sr-only">View notifications</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                  </svg>

                  </button>
                } position="bottom right" contentStyle={{width: '400px', fontSize: '13px', maxHeight: '400px', overflowY: "scroll"}}>
                  <a href="#" className='block text-right pt-2'>Clear All</a>
                  {notificationData.map(notification => (
                    <div className="flex items-center p-2 py-3 border-b">
                      <img className='mx-2' src={notification.image} alt="Icon" width="45" height="45"/>
                      <div className='ml-2'>
                        <p className='truncate text-sm'>{notification.message.substring(0, 45)}</p>
                        <p>{notification.receivedTime}</p>
                      </div>
                    </div>
                  ))}
                </Popup>

{ notification && 
<div id="dropdown" class="relative mt-20 bg-white rounded-md shadow-lg mt-2 py-2">
  
</div>

}




                  {/* Profile dropdown */}
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="h-8 w-8 rounded-full border "
                          src="../../default.png"
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
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-100 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 flex'
                              )}
                            >
                              Your Profile <UserCircleIcon className="block h-4 w-4 ml-auto mt-1" aria-hidden="true" />
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="../../settings"
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 flex'
                              )}
                            >
                              Settings <Cog6ToothIcon className="block h-4 w-4 ml-auto mt-1" aria-hidden="true" />
                            </a> 
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="https://feedback.ctfguide.com/"
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 flex'
                              )}
                            >
                              Feedback <PencilSquareIcon className="block h-4 w-4 ml-auto mt-1" aria-hidden="true" />
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="../../report"
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 flex'
                              )}
                            >
                              Report <ShieldExclamationIcon className="block h-4 w-4 ml-auto mt-1" aria-hidden="true" />
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <span
                              onClick={logout}
                              className={classNames(
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-200 flex'
                              )}
                            >
                              Sign out <ArrowRightIcon className="block h-4 w-4 ml-auto mt-1" aria-hidden="true" />
                            </span>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden">
            <div className="space-y-1 pt-2 pb-3">
              {/* Current: "bg-blue-50 border-blue-500 text-blue-700", Default: "border-transparent text-gray-300 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700" */}
              <Disclosure.Button
                as="a"
                href="#"
                className="block border-l-4 border-blue-500 bg-blue-50 py-2 pl-3 pr-4 text-base font-medium text-blue-700 sm:pl-5 sm:pr-6"
              >
                Dashboard
              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                href="#"
                className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-300 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 sm:pl-5 sm:pr-6"
              >
              Groups
              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                href="#"
                className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-300 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 sm:pl-5 sm:pr-6"
              >
                Practice
              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                href="live.ctfguide.com"
                className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-300 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 sm:pl-5 sm:pr-6"
              >
                Live
              </Disclosure.Button>
            </div>
            <div className="border-t border-gray-200 pt-4 pb-3">
              <div className="flex items-center px-4 sm:px-6">
                <div className="flex-shrink-0">
                  <img
                    className="h-10 w-10 rounded-full"
                    src="../../default.png"
                    alt=""
                  />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">Anonymous</div>
                  <div className="text-sm font-medium text-gray-300">anon@ctfguide.com</div>
                </div>
                <button
                  type="button"
                  className="ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-3 space-y-1">
                <Disclosure.Button
                  as="a"
                  href="#"
                  className="block px-4 py-2 text-base font-medium text-gray-300 hover:bg-gray-100 hover:text-gray-800 sm:px-6"
                >
                  Your Profile
                </Disclosure.Button>
                <Disclosure.Button
                  as="a"
                  href="#"
                  className="block px-4 py-2 text-base font-medium text-gray-300 hover:bg-gray-100 hover:text-gray-800 sm:px-6"
                >
                  Settings
                </Disclosure.Button>
                <Disclosure.Button
                  as="a"
                  href="#"
                  onClick={{logout}}
                  className="block px-4 py-2 text-base font-medium text-gray-300 hover:bg-gray-100 hover:text-gray-800 sm:px-6"
                >
                  Sign out
                </Disclosure.Button>
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
