import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { useEffect, Fragment, useState } from 'react';
import { Transition, Dialog } from '@headlessui/react';
import StudentNav from '@/components/groups/studentNav';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import request from '@/utils/request';

const actions = ["Are you sure you want to leave this class?", "Are you suer you want to cancel your free trial?", "Are you sure you want to pay for free trial now?"];

export default function StudentSettings() {

  const [showOverlay, setShowOverlay] = useState(false);
  const [messageOfConfirm, setMessageOfConfirm] = useState('');
  const [index, setIndex] = useState(0);

  const router = useRouter();
  const classCode = router.query.group;
  const { id } = router.query;

  const cancelFreeTrial = async () => {
    try {
      const classroomId = classroom.id;
      const url = `${baseUrl}/payments/stripe/cancel-payment-intent`;
      const body = { classroomId, operation: "joinClass" };
      const data = await request(url, 'POST', body);
      if (data && data.success) {
        toast.success("Free trial cancelled");
      } else {
        console.log(data.message);
        toast.error("Unable to cancel free trial");
      }
    } catch (err) {
      console.log(err);
      toast.error("Unable to cancel free trial");
    }
  };

  const payForFreeTrialNow = async () => {
    try {
      const url = `${baseUrl}/payments/stripe/pay-payment-intent`;
      const body = { classroomId: classroom.id, operation: "joinClass" }
      const data = await request(url, 'PUT', body);
      if (data && data.success) {
        toast.success("Free trial successfully activated");
        document.getElementById("trialMsg").classList.add("hidden");
      } else {
        console.log(data.message);
        toast.error("Unable to activate free trial");
      }
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };
  const leaveClass = async () => {
    try {
      const classroomId = classroom.id;
      const url = `${baseUrl}/classroom/leave`;
      const body = { classroomId, isTeacher: false };
      const data = await request(url, 'POST', body);
      if (data && data.success) {
        router.push('/groups');
      } else {
        console.log(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleConfirmClick = async () => {
    if(index === 0) {
      handleDelete();
    } else {
      handleSave();
    }
  }

  return (
    <>
      <Head>
        <title>Student Settings- CTFGuide</title>
        <style>
          @import
          url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
        </style>
      </Head>
      <StandardNav />
      <StudentNav classCode={classCode} />
      <div id="general" className="">
        <div className="mx-auto flex max-w-6xl">
          <div className="flex-1 xl:overflow-y-auto">
            <div className="max-w-4.5xl mx-auto px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
              <div className="flex">
                <h1 className="text-3xl font-bold tracking-tight text-white">
                  Student Settings (Nothing works in here)
                </h1>

                <div className="ml-auto">
                  <button
                    onClick={() =>
                      router.push(`/groups/${classCode}/home`)
                    }
                    className=" rounded-lg bg-blue-600 px-2 py-1 text-white hover:bg-blue-600/50"
                    style={{
                      fontSize: '15px',
                    }}
                  >
                    <i
                      className="fa fa-arrow-left"
                      style={{ color: 'white' }}
                    ></i>{' '}
                    Back
                  </button>
                </div>
              </div>

              <div className="mt-6 space-y-8 ">
                <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
                  <div className="sm:col-span-6">
                    <p className="mt-1 text-sm text-white">
                      All changes will be applied after clicking the save button
                    </p>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="number-of-seats"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Total Points
                    </label>
                    <input
                      type="number"
                      autoComplete="off"
                      value={""}
                      onChange={(e) => setTotalPoints(e.target.value)}
                      className="mt-2 block w-full rounded-md border-none bg-neutral-800 py-1.5 text-white shadow-sm sm:text-sm sm:leading-6"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="number-of-seats"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Due Date
                    </label>
                    <input
                      type="date"
                      autoComplete="off"
                      value={""}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="mt-2 block w-full rounded-md border-none bg-neutral-800 py-1.5 text-white shadow-sm sm:text-sm sm:leading-6"
                    />
                  </div>

                </div>
                <Transition.Root show={showOverlay} as={Fragment}>
                  <Dialog
                    as="div"
                    className="fixed inset-0 z-10 overflow-y-auto"
                    onClose={setShowOverlay}
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
                        onClick={() => setShowOverlay(false)}
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
                            <div
                              className="mx-auto mt-3 text-center sm:mt-5"
                              style={{ width: '350px' }}
                            >
                              <h2 className="text-center text-xl text-white">
                                {messageOfConfirm}
                              </h2>
                              <br></br>
                              <div className="mx-auto mt-4 w-full pb-5 text-center">
                                <button
                                  onClick={handleConfirmClick}
                                  className="rounded-lg bg-neutral-800 px-4 py-2 text-white hover:bg-neutral-600/50"
                                >
                                  {' '}
                                  Confirm{' '}
                                </button>
                                <button
                                  onClick={() => {
                                    setShowOverlay(false);
                                  }}
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

                <button
                  onClick={() => {
                    setShowOverlay(true);
                    setMessageOfConfirm(actions[1]);
                    setIndex(1);
                  }}
                  className="inline-flex justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  Save
                </button>

                <button
                  onClick={() => {
                    setShowOverlay(true);
                    setMessageOfConfirm(actions[0]);
                    setIndex(0);
                  }}
                  className="ml-4 rounded-lg bg-red-600 px-2 py-1 text-white hover:bg-red-600/50"
                >
                  Leave Class
                </button>
              </div>
            </div>
          </div>
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
