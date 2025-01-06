import Head from 'next/head';
import dynamic from 'next/dynamic';
import Image from 'next/image';
const JoyRideNoSSR = dynamic(() => import('react-joyride'), { ssr: false });
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Transition, Dialog } from '@headlessui/react';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, Fragment, useState } from 'react';
import request from '../utils/request';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import router from 'next/router';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import {
  CloudArrowUpIcon,
  LockClosedIcon,
  ServerIcon,
} from '@heroicons/react/20/solid';
import { SecondaryFeatures } from '@/components/home/SecondaryFeatures';

const STRIPE_KEY = process.env.NEXT_PUBLIC_APP_STRIPE_KEY;
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Groups() {
  const features = [
    {
      name: 'Push to deploy.',
      description:
        'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.',
      icon: CloudArrowUpIcon,
    },
    {
      name: 'SSL certificates.',
      description:
        'Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.',
      icon: LockClosedIcon,
    },
    {
      name: 'Database backups.',
      description:
        'Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et magna sit morbi lobortis.',
      icon: ServerIcon,
    },
  ];

  const steps = [
    {
      target: '.first',
      content: 'This is the main home for accessing all your classrooms.',
      disableBeacon: true,
    },
    {
      target: '.second',
      content: 'Lets create a classroom by clicking this button here.',
    },
  ];
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [color, setColor] = useState('');
  const [teacherClassrooms, setTeacherClassrooms] = useState([]);
  const [studentClassrooms, setStudentClassrooms] = useState([]);
  const [showTour, setShowTour] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const d = localStorage.getItem('showTour');
    if (!d) {
      setShowTour(true);
      localStorage.setItem('showTour', 'true');
    } else {
      setShowTour(false);
    }
  }, []);

  useEffect(() => {
    const getAllClassrooms = async () => {
      const url = `${baseUrl}/classroom/all-classrooms`;
      const data = await request(url, 'GET', null);
      if (data && data.success) {
        setTeacherClassrooms(data.teacher);
        setStudentClassrooms(data.student);

        setIsLoading(false);
      } else {
        console.log(data);
      }
    };
    getAllClassrooms();
  }, []);

  const joinClass = async () => {
    setMessage('loading...');
    setColor('gray');
    let code = document.getElementById('joinCode').value;
    try {
      const url = `${baseUrl}/classroom/join`;
      const body = { classCode: code, isTeacher: false };
      const res = await request(url, 'POST', body);
      if (res && res.success) {
        if (res.sessionId) {
          const stripe = await loadStripe(STRIPE_KEY);
          const result = await stripe.redirectToCheckout({
            sessionId: res.sessionId,
          });
          console.log(result);
        } else {
          setColor('green');
          setMessage('successfuly joined the class');
          console.log('successfuly joined the class');
        }
        window.location.href = '';
      } else {
        setColor('#FF7276');
        setMessage(res.message);
        console.log(res.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  function copy(idx) {
    var copyText = document.getElementById('copyBox' + idx);
    copyText.type = 'text';
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyText.value);
    copyText.type = 'hidden';

    toast.success('Copied to clipboard!', {
      position: 'bottom-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
    });
  }

  return (
    <>
      <Head>
        <title>Groups - CTFGuide</title>
        <style>
          @import
          url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
        </style>
      </Head>
      {showTour && (
        <JoyRideNoSSR
          steps={steps}
          continuous={true}
          disableBeacon={true}
          showProgress={true}
          showSkipButton={true}
          styles={{
            options: {
              arrowColor: '#074bf5',
              backgroundColor: '#1c1c1c',
              overlayColor: '#1c1c1c',
              primaryColor: '#224ed4',
              textColor: 'white',
              width: 500,
              zIndex: 1000,
            },
          }}
        />
      )}
      <StandardNav />

      <div className="  min-h-screen">
       

        <div className="first mx-auto mt-10 max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-3xl font-bold text-white mb-2">Classrooms</h1>
                <p className="text-neutral-400 text-sm">
                  Manage your learning spaces and teaching environments
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                <button 
                  onClick={() => setOpen(true)}
                  className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-neutral-800 text-white hover:bg-neutral-700 transition-all duration-200 border border-neutral-700/50 hover:border-neutral-600"
                >
                  <i className="fas fa-sign-in-alt mr-2"></i>
                  Join Class
                </button>
                
                <a href="./groups/create" 
                   className="second inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 group"
                >
                  <i className="fas fa-plus mr-2 group-hover:rotate-90 transition-transform duration-200"></i>
                  Create Class
                </a>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-neutral-800/30 rounded-lg p-4 border border-neutral-700/50">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mr-3">
                    <i className="fas fa-chalkboard-teacher text-blue-500"></i>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-400">Teaching</p>
                    <p className="text-xl font-semibold text-white">{teacherClassrooms.length} Classes</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-neutral-800/30 rounded-lg p-4 border border-neutral-700/50">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center mr-3">
                    <i className="fas fa-user-graduate text-green-500"></i>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-400">Learning</p>
                    <p className="text-xl font-semibold text-white">{studentClassrooms.length} Classes</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-neutral-800/30 rounded-lg p-4 border border-neutral-700/50">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center mr-3">
                    <i className="fas fa-users text-purple-500"></i>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-400">Total Students</p>
                    <p className="text-xl font-semibold text-white">
                      {teacherClassrooms.reduce((acc, classroom) => acc + classroom.students.length, 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Teacher's Classes section */}
          <div className="mt-12 mb-6">
            <h2 className="text-2xl font-semibold text-white mb-4">
              {isLoading ? null : 'Classes you own'}
            </h2>
            {!isLoading && teacherClassrooms.length === 0 ? (
              <div className="flex items-center space-x-3 text-neutral-400 bg-neutral-800/30 rounded-lg p-6 border border-neutral-700/50">
                <div className="w-12 h-12 bg-neutral-700/50 rounded-full flex items-center justify-center">
                  <i className="fas fa-chalkboard-teacher text-xl text-neutral-400"></i>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">No classes created yet</p>
                  <p className="text-sm text-neutral-400">Create your first classroom to start teaching</p>
                </div>
                <Link href="./groups/create"
                  className="inline-flex items-center px-4 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-600/10 transition-colors"
                >
                  <i className="fas fa-plus mr-2"></i>
                  Create Now
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teacherClassrooms.map((classroom, idx) => (
                  <div
                    key={idx}
                    className="animate__fadeIn animate__animated cursor-pointer rounded-lg bg-neutral-800/90 p-6 hover:bg-neutral-800 transition-all duration-200 border border-neutral-700/50"
                    onClick={() => classroom.isPayedFor ? router.push(`/groups/${classroom.classCode}/home`) : null}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="truncate text-xl font-semibold text-white">
                        {classroom.name}
                      </h3>
                      {!classroom.isPayedFor && (
                        <span className="inline-flex items-center rounded-full bg-red-400/10 px-3 py-1 text-xs font-medium text-red-400">
                          <i className="fas fa-times-circle mr-1"></i>
                          Unpaid
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-6 text-neutral-400">
                      <div className="flex items-center">
                        <i className="fas fa-user-shield mr-2"></i>
                        <span>{classroom.teachers.length} Teachers</span>
                      </div>
                      <div className="flex items-center">
                        <i className="fas fa-users mr-2"></i>
                        <span>{classroom.students.length} Students</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Student's Classes section */}
          <div className="mt-12 mb-6">
            <h2 className="text-2xl font-semibold text-white mb-4">
              {isLoading ? null : 'Joined Classes'}
            </h2>
            {!isLoading && studentClassrooms.length === 0 ? (
              <div className="flex items-center space-x-3 text-neutral-400 bg-neutral-800/30 rounded-lg p-6 border border-neutral-700/50">
                <div className="w-12 h-12 bg-neutral-700/50 rounded-full flex items-center justify-center">
                  <i className="fas fa-user-graduate text-xl text-neutral-400"></i>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">No classes joined yet</p>
                  <p className="text-sm text-neutral-400">Join a class using a class code to start learning</p>
                </div>
                <button 
                  onClick={() => setOpen(true)}
                  className="inline-flex items-center px-4 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-600/10 transition-colors"
                >
                  <i className="fas fa-sign-in-alt mr-2"></i>
                  Join Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {studentClassrooms.map((classroom, idx) => (
                  <div
                    key={idx}
                    className="animate__fadeIn animate__animated cursor-pointer rounded-lg bg-neutral-800/90 p-6 hover:bg-neutral-800 transition-all duration-200 border border-neutral-700/50"
                    onClick={() => router.push(`/groups/${classroom.classCode}/home`)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="truncate text-xl font-semibold text-white">
                        {classroom.name}
                      </h3>
                    </div>
                    <div className="flex items-center space-x-6 text-neutral-400">
                      <div className="flex items-center">
                        <i className="fas fa-user-shield mr-2"></i>
                        <span>{classroom.teachers.length} Teachers</span>
                      </div>
                      <div className="flex items-center">
                        <i className="fas fa-users mr-2"></i>
                        <span>{classroom.students.length} Students</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Transition.Root show={open} as={Fragment}>
            <Dialog
              as="div"
              className="fixed inset-0 z-10 overflow-y-auto"
              onClose={setOpen}
            >
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div
                  onClick={() => setOpen(false)}
                  className="z-2 fixed inset-0 bg-black bg-opacity-75 transition-opacity"
                />
              </Transition.Child>
              <div className="flex min-h-screen items-center justify-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="transform overflow-hidden rounded-lg bg-neutral-800/90 border border-neutral-700/50 px-8 pb-6 pt-5 text-left shadow-xl transition-all sm:my-8 sm:align-middle max-w-md w-full backdrop-blur-xl">
                    <div className="w-full">
                      <div className="mx-auto mt-3">
                        {/* Close button */}
                        <button
                          onClick={() => setOpen(false)}
                          className="absolute right-4 top-4 text-neutral-400 hover:text-white transition-colors"
                        >
                          <i className="fas fa-times text-lg"></i>
                        </button>

                        {/* Header */}
                        <div className="text-center mb-6">
                          <div className="mx-auto w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
                            <i className="fas fa-sign-in-alt text-blue-500 text-xl"></i>
                          </div>
                          <h3 className="text-2xl font-semibold text-white">Join a Class</h3>
                          <p className="text-neutral-400 text-sm mt-2">Enter the class code provided by your teacher</p>
                        </div>

                        {/* Input field */}
                        <div className="space-y-4">
                          <input
                            id="joinCode"
                            placeholder="Enter class code"
                            className="w-full px-4 py-3 rounded-lg bg-neutral-900/50 text-white placeholder-neutral-400 border border-neutral-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                          />
                          {message && (
                            <p className={`text-sm ${color === 'green' ? 'text-green-400' : 'text-red-400'}`}>
                              {message}
                            </p>
                          )}
                        </div>

                        {/* Buttons */}
                        <div className="mt-6 flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
                          <button 
                            onClick={() => {setOpen(false); setMessage('');}}
                            className="w-full sm:w-1/2 px-4 py-2.5 rounded-lg bg-neutral-700/50 text-white hover:bg-neutral-700 transition-all border border-neutral-600"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={() => joinClass()}
                            className="w-full sm:w-1/2 px-4 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                          >
                            <i className="fas fa-sign-in-alt"></i>
                            Join Class
                          </button>
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition.Root>
        </div>
      </div>

      <ToastContainer />
      <Footer />
    </>
  );
}

