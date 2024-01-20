import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Transition, Dialog } from '@headlessui/react';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, Fragment, useState } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const STRIPE_KEY = process.env.NEXT_PUBLIC_APP_STRIPE_KEY;
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Groups() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [color, setColor] = useState('');
  const [teacherClassrooms, setTeacherClassrooms] = useState([]);
  const [studentClassrooms, setStudentClassrooms] = useState([]);

  useEffect(() => {
    const getAllClassrooms = async () => {
      const url = `${baseUrl}/classroom/all-classrooms`;
      const response = await fetch(url, {credentials: 'include'});
      const data = await response.json();
      if (data.success) {
        setTeacherClassrooms(data.teacher);
        setStudentClassrooms(data.student);
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
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          classCode: code,
          isTeacher: false,
        }),
      });
      const res = await response.json();
      if (res.success) {
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
      <StandardNav />
      <div className=" min-h-screen  ">
        <div className="mx-auto mt-64 hidden max-w-6xl">
          <div className="grid grid-cols-2 gap-x-24">
            <div>
              <img src="./groups.png"></img>
            </div>
            <div>
              <h1 className="mt-10 text-6xl font-semibold text-white ">
                CTFGuide Groups
              </h1>
              <h1 className="mt-1 text-2xl text-white">
                A powerful solution for institutions teaching IT and
                cybersecurity.
              </h1>

              <h1 className=" mt-4 text-2xl text-neutral-400">Launching on</h1>

              <h1 className=" text-6xl text-neutral-400">1.12.2024</h1>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-6xl ">
          <div className="flex">
            <h1 className="text-3xl text-white">Groups</h1>
            <div className="ml-auto">
              <a
                href="./groups/create"
                className="ml-4 rounded-lg bg-blue-600 px-2 py-1 text-white"
              >
                Create Group
              </a>
              <button
                onClick={() => setOpen(true)}
                className="ml-4 rounded-lg bg-neutral-800/50  px-2 py-1 text-white hover:bg-neutral-700/50"
              >
                Join a Group
              </button>
            </div>
          </div>

          <div className=" mt-  hidden rounded-lg ">
            <motion.div
              className="mx-auto w-full rounded-md"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mx-auto mt-6 flex w-full rounded-sm bg-neutral-800/40 py-2.5 ">
                <div className="mx-auto my-auto pb-4 pt-4 text-center text-xl text-white">
                  <i className="fas fa-users-slash mx-auto text-center text-4xl text-neutral-700/80"></i>
                  <p>Looks like you have are not enrolled in any groups.</p>
                  <a className="mx-auto cursor-pointer">
                    <p
                      className="mx-auto text-center text-lg text-blue-600 hover:text-blue-500 "
                      onClick={() => setOpen(true)}
                    >
                      {' '}
                      Do you have a join code?
                      <ArrowRightIcon className="ml-1 mt-0.5 hidden h-5" />
                    </p>
                  </a>
                </div>
              </div>
            </motion.div>

    
          </div>
          <h1 className="mt-10 text-2xl text-white">
            {teacherClassrooms.length === 0
              ? 'You do not own any classrooms yet... '
              : 'Classes you own'}
          </h1>
          <div className="mt-4 grid grid-cols-3 gap-x-4 gap-y-4">
            {teacherClassrooms.map((classroom, idx) => {
              return (
                <div
                  key={idx}
                  className=" cursor-pointer rounded-lg bg-neutral-800 px-4 py-2 hover:bg-neutral-800/50"
                  onClick={() => {
                    classroom.isPayedFor
                      ? (window.location.href = `/groups/${classroom.classCode}/home`)
                      : '';
                  }}
                >
                  <h1 className="text-3xl truncate font-semibold text-neutral-300">
                    {classroom.name}
                  </h1>
                  {!classroom.isPayedFor ? (
                    <p className="text-neutral-400">
                      <i
                        className="fas fa-times"
                        style={{ color: '#D8504D' }}
                      ></i>{' '}
                      Class Not Paid{' '}
                      <span className="text-neutral-400">
                        <i className="fas fa-users"></i>{' '}
                        {classroom.numberOfSeats}{' '}
                      </span>
                      <span
                        style={{
                          fontSize: '12px',
                          color: 'lightblue',
                          textDecoration: 'underline',
                        }}
                      >
                        <br></br>
                        <button
                          style={{ marginTop: '10px' }}
                          className="rounded-lg bg-blue-600 px-2 py-1 text-white hover:bg-blue-600/50"
                          onClick={() => {
                            window.location.href = classroom.paymentLink;
                          }}
                        >
                          Pay Now
                        </button>
                        <i
                          style={{ fontSize: '15px', padding: '10px' }}
                          onClick={() => copy(idx)}
                          className="far fa-copy cursor-pointer text-white hover:text-neutral-400"
                        ></i>
                      </span>
                      <input
                        type="hidden"
                        id={'copyBox' + idx}
                        value={classroom.paymentLink || ''}
                      ></input>
                    </p>
                  ) : (
                    <p className="text-neutral-400">
                      <i className="fas fa-users"></i> {classroom.numberOfSeats}{' '}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
          <h1 className="mt-10 text-2xl text-white">
            {studentClassrooms.length === 0
              ? "You haven't joined any classes yet..."
              : 'Joined Classes'}
          </h1>
          <div className="mt-4 grid grid-cols-3 gap-x-4">
            {studentClassrooms.map((classroom, idx) => {
              return (
                <div
                  key={idx}
                  className=" cursor-pointer rounded-lg bg-neutral-800 px-4 py-2 hover:bg-neutral-800/50"
                  onClick={() => {
                    window.location.href = `/groups/${classroom.classCode}/home`;
                  }}
                >
                  <h1 className="text-3xl font-semibold text-neutral-300">
                    {classroom.name}
                  </h1>
                  <p className="text-neutral-400">
                    <i className="fas fa-users"></i> {classroom.numberOfSeats}
                  </p>
                </div>
              );
            })}
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
                  <div
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      backgroundColor: '#161716',
                    }}
                    className="  transform  overflow-hidden rounded-lg bg-neutral-700 px-40 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:align-middle "
                  >
                    <div className="w-full">
                      <div className="mx-auto mt-3 text-center sm:mt-5">
                        <h1 className="text-center text-xl text-white">
                          {' '}
                          Enter a join code
                        </h1>
                        <input
                          id="joinCode"
                          className="cursor-outline-none mt-2 rounded-lg  border-transparent bg-neutral-800 py-0.5  text-sm  text-white outline-none focus:border-transparent  focus:outline-none  focus:ring-0  "
                        ></input>
                        <br></br>
                        <div className="mx-auto mt-4 w-full pb-5 text-center">
                          <button
                            onClick={() => joinClass()}
                            className="rounded-lg bg-neutral-800 px-4 py-2 text-white hover:bg-neutral-600/50"
                          >
                            {' '}
                            Join{' '}
                          </button>
                          <button
                            onClick={() => {
                              setOpen(false);
                              setMessage('');
                            }}
                            className="ml-4 rounded-lg bg-neutral-800 px-4 py-2 text-white hover:bg-neutral-600/50"
                          >
                            Cancel
                          </button>
                          <div style={{ color: color, marginTop: '10px' }}>
                            {message}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
