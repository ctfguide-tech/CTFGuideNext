import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Transition, Fragment, Dialog } from '@headlessui/react';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CreateGroup() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL; // change this in deployment

  const [selectedOption, setSelectedOption] = useState(null);
  const [open, setOpen] = useState(false);
  const [domain, setDomain] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [seats, setSeats] = useState(0);
  const [usingPaymentLink, setUsingPaymentLink] = useState(false);

  const createClass = async () => {
    try {
      if (seats <= 0) {
        toast.error('Invalid number of seats');
        return;
      } else if (name.trim().length === 0) {
        toast.error('Please enter a course title');
        return;
      } else if (!selectedOption) {
        toast.error('Please select a payment method');
        return;
      }

      const dataObj = {
        org: domain,
        name,
        description,
        numberOfSeats: seats,
        isPayedFor: true,
        pricingPlan: selectedOption,
        open: true,
      };

      if (usingPaymentLink && selectedOption === 'institution') {
        dataObj['isPayedFor'] = false;
        const res = await fetch(`${baseUrl}/classroom/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ ...dataObj }),
        });
        const resJson = await res.json();
        if (resJson.success) {
          window.location.href = '/groups';
        } else console.log('There was an error when creating the class');

        return;
      }

      const url =
        selectedOption === 'student'
          ? `${baseUrl}/classroom/create`
          : `${baseUrl}/payments/stripe/create-checkout-session`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(
          selectedOption === 'student'
            ? { ...dataObj }
            : {
                subType: selectedOption,
                quantity: seats,
                data: { ...dataObj },
                operation: 'createClass',
              }
        ),
      });

      if (selectedOption === 'student') {
        window.location.href = '/groups';
        console.log(await response.json());
      } else {
        const STRIPE_KEY = process.env.NEXT_PUBLIC_APP_STRIPE_KEY;
        const stripe = await loadStripe(STRIPE_KEY);

        const session = await response.json();
        if (session.error)
          return console.log('Creating the stripe session failed');

        const result = await stripe.redirectToCheckout({
          sessionId: session.sessionId,
        });
        if (result.error) console.log(result.error.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

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
        <div className="mx-auto mt-10 max-w-6xl">
          <div className="flex">
            <h1 className="text-3xl text-white">Create a Group</h1>
            <div className="ml-auto hidden">
              <button className="ml-4 rounded-lg bg-blue-600 px-2 py-1 text-white">
                Create Group
              </button>
              <button
                onClick={() => setOpen(true)}
                className="ml-4 rounded-lg bg-neutral-800/50  px-2 py-1 text-white hover:bg-neutral-700/50"
              >
                Join a Group
              </button>
            </div>
          </div>

          <div className="container mt-4 bg-neutral-800/40 px-4 py-3">
            <div className="space-y-12">
              <div className="border-b border-neutral-900/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-white">
                  General Settings
                </h2>
                <p className="mt-1 text-sm leading-6 text-white">
                  CTFGuide needs some information in order to deploy your group.
                </p>

                <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-4">
                    <div className="grid grid-cols-1">
                      <div>
                        <label
                          for="username"
                          className="block text-sm font-medium leading-6 text-white"
                        >
                          Email Domain
                        </label>
                        <div className="mt-2">
                          <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-neutral-700 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600 sm:max-w-md">
                            <span className="flex select-none items-center pl-3 text-neutral-500 sm:text-sm">
                              johndoe@
                            </span>
                            <input
                              type="text"
                              name="username"
                              id="email_domain"
                              value={domain}
                              onChange={(e) => setDomain(e.target.value)}
                              className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-white placeholder:text-neutral-400 focus:ring-0 sm:text-sm sm:leading-6"
                              placeholder="coolschool.edu"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="bg-neutral-850 mt-4 rounded-lg border border-neutral-500 px-4 py-2 text-white">
                          <b>✨ What is this?</b>
                          <h1>
                            To invite students into your group, they must enter
                            a group code. If the code is shared to another
                            student who isn't in your organization, CTFGuide
                            will prevent them for joining by verifying if their
                            email contains the domain.
                          </h1>

                          <br></br>

                          <h1>
                            That being said, your organization may not have
                            custom email domains. In that case, we suggest going
                            through the invite process in class and disable
                            joining afterwards.
                          </h1>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label
                      for="about"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Course Description
                    </label>
                    <div className="mt-2">
                      <textarea
                        id="course_description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        name="about"
                        rows="3"
                        className="block  w-full rounded-md border-0 bg-transparent py-1.5 text-white shadow-sm ring-1 ring-inset ring-neutral-700 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                      ></textarea>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-white">
                      Write a short, brief description about your course.
                      CTFGuide will use AI to suggest lesson content, labs, and
                      more. This field is optional.
                    </p>
                  </div>

                  <div className="sm:col-span-4">
                    <label
                      for="username"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Course Name
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-neutral-700 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600 sm:max-w-md">
                        <input
                          type="text"
                          name="Course Name"
                          id="course_name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="block flex-1 border-0 bg-transparent py-1.5 text-white placeholder:text-neutral-400 focus:ring-0 sm:text-sm sm:leading-6"
                          placeholder="Silly Hacking 101"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <h1 className="mt-4 text-sm text-white">Pricing Model</h1>
                <div className="grid-row-1 mt-2 grid grid-cols-2 gap-4 gap-x-4 text-white ">
                  <div
                    className={`hover:bg-neutral-750 bg-neutral-800 px-2 py-2 text-center ${
                      selectedOption === 'student' && !usingPaymentLink
                        ? 'border-2 border-blue-600'
                        : 'border-2 border-neutral-800'
                    }`}
                    onClick={() => {
                      setSelectedOption('student');
                      setUsingPaymentLink(false);
                    }}
                  >
                    <h1>
                      Paid for by Student{' '}
                      <b className="text-sm italic text-yellow-500">
                        Most Popular!
                      </b>
                    </h1>
                    <h1 className="text-2xl font-semibold">$58</h1>
                    <h1 className="text-sm">per semester</h1>
                  </div>
                  <div
                    className={`hover:bg-neutral-750 bg-neutral-800 px-2 py-2 text-center ${
                      selectedOption === 'institution'
                        ? 'border-2 border-blue-600'
                        : 'border-2 border-neutral-800'
                    }`}
                    onClick={() => {
                      setSelectedOption('institution');
                      setUsingPaymentLink(true);
                    }}
                  >
                    <h1>Paid for by Institution</h1>
                    <h1 className="text-2xl font-semibold">$40</h1>
                    <h1 className="text-sm">per student, per semester</h1>
                  </div>
                </div>

                <h1 className="mt-4 text-sm text-white">
                  Expected amount of students
                </h1>

                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-neutral-700 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600 sm:max-w-md">
                  <input
                    type="number"
                    name="username"
                    id="username"
                    value={seats}
                    onChange={(e) => setSeats(e.target.value)}
                    className="block flex-1 border-0 bg-transparent py-1.5 text-white placeholder:text-neutral-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Just needs to be an estimate."
                  />
                </div>

                <div className="bg-neutral-850 mt-4 rounded-lg border border-neutral-500 px-4 py-2 text-white">
                  <b>✨ Why do we ask for this information?</b>
                  <h1>
                    CTFGuide boasts a swift terminal boot time, but
                    pre-deploying terminals can enhance this speed even further.
                    By obtaining these estimates, we aim to optimize our
                    terminal pools and schedule maintenance more effectively.
                    Rest assured, even if the pool sizes aren't precise, we've
                    allocated a generous buffer. In the rare event of a delay, a
                    student might experience a brief 5-second wait for their
                    terminal to deploy.
                  </h1>
                </div>

                <button
                  onClick={createClass}
                  id="submitButton"
                  className="mt-4  rounded-lg bg-blue-700 px-5 py-1 text-xl text-white hover:bg-blue-600/50"
                >
                  {' '}
                  Submit
                </button>
              </div>
            </div>
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
                            onClick={() => joinGroup()}
                            className="rounded-lg bg-neutral-800 px-4 py-2 text-white hover:bg-neutral-600/50"
                          >
                            {' '}
                            Join{' '}
                          </button>
                          <button
                            onClick={() => setOpen(false)}
                            className="ml-4 rounded-lg bg-neutral-800 px-4 py-2 text-white hover:bg-neutral-600/50"
                          >
                            Cancel
                          </button>
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

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Footer />
    </>
  );
}
