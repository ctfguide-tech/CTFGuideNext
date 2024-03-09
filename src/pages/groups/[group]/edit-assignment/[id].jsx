import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { useEffect, Fragment, useState } from 'react';
import { Transition, Dialog } from '@headlessui/react';
import ClassroomNav from '@/components/groups/classroomNav';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import Loader from '@/components/Loader';
import CreateAssignment from '@/components/groups/assignments/createAssignment';
import EditChallenge from "@/components/groups/assignments/updateChallengeInfo";

import 'react-toastify/dist/ReactToastify.css';
import request from '@/utils/request';

const actions = ["Are you sure you want to delete this assignment?", "Are you sure you want to save this assignment?"];

export default function EditingAssignment() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [dueTime, setDueTime] = useState('');

  const [aiObjectives, setAiObjectives] = useState('');
  const [aiPenalties, setAiPenalties] = useState('');
  const [totalPoints, setTotalPoints] = useState('');
  const [category, setCategory] = useState('');

  const [latePenalty, setLatePenalty] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [messageOfConfirm, setMessageOfConfirm] = useState('');
  const [index, setIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [viewCreateAssignment, setViewCreateAssignment] = useState(false);

  const [isEditingChallenge, setIsEditingChallenge] = useState(false);
  const [challenge, setChallenge] = useState(null);

  const router = useRouter();
  const classCode = router.query.group;
  const { id } = router.query;

  const getAssignment = async () => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/classroom-assignments/fetch-assignment-teacher/${id}`;
    const data = await request(url, 'GET', null);
    if (data && data.success) {
      console.log(data);

      setChallenge(data.body.challenge);
      setName(data.body.name);
      setDescription(data.body.description);

      const dueDateObj = new Date(data.body.dueDate);
      const formattedDueDate = dueDateObj.toISOString().slice(0, 10);
      setDueDate(formattedDueDate);

      let time = dueDateObj.toISOString().slice(11, 16);
      setDueTime(time);

      setCategory(data.body.category);
      setAiObjectives(data.body.aiObjectives);
      setAiPenalties(data.body.aiPenalties);
      setTotalPoints(data.body.totalPoints);
      setLatePenalty(data.body.latePenalty);
      setIsOpen(data.body.isOpen);
      setIsLoading(false);
    } else {
      if(data && data.status === 401) {
        router.push(`/groups/${classCode}/home`);
        return;
      }
      console.log('Error when getting assignment info');
      toast.error('Error loading assignment, Please refresh the page');
    }
  }

  useEffect(() => {
    if(id) {
      getAssignment();
    }
  }, [id]);

  const handleConfirmClick = async () => {
    if(index === 0) {
      handleDelete();
    } else {
      handleSave();
    }
  }

  const handleDelete = async () => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/classroom-assignments/delete-assignment/${id}/${classCode}`;
    const data = await request(url, 'DELETE', null);
    if (data && data.success) {
      toast.success('Assignment deleted successfully');
      setShowOverlay(false);
      router.push(`/groups/${classCode}/home`);
    } else {
      toast.error('Error deleting assignment');
    }
  }


  const handleSave = async () => {
    if(latePenalty < 0 || latePenalty > 100) {
      toast.error('Late penalty must be between 0 and 100');
      return;
    }
    const classCode = router.query.group;
    const url = `${process.env.NEXT_PUBLIC_API_URL}/classroom-assignments/update-assignment/${id}/${classCode}`;
    let datetimeString = `${dueDate}T${dueTime}:00`;
    const body = {
      name,
      description,
      dueDate: datetimeString,
      category,
      aiObjectives,
      aiPenalties,
      totalPoints,
      latePenalty,
      isOpen
    }

    const data = await request(url, 'PUT', body);
    if (data && data.success) {
      toast.success('Assignment updated successfully');
      setShowOverlay(false);
    } else {
      toast.error('Error updating assignment');
    }
  }

  if(viewCreateAssignment) {
    return <CreateAssignment classCode={classCode} />;
  }

  if(isEditingChallenge) {
    if(!challenge) return;
    return <EditChallenge assignmentName={name} classCode={classCode} challenge={challenge} />
  }


  return (
    <>
      <Head>
        <title>Edit Assignment - CTFGuide</title>
        <style>
          @import
          url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
        </style>
      </Head>
      <StandardNav />
      <div className="bg-neutral-800">
        <div className=" mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-10 justify-between">
            {<ClassroomNav classCode={classCode} /> }
            <div className="flex items-center">
              <button
                onClick={() => {
                  setViewCreateAssignment(true);
                }}
                className="rounded-lg bg-neutral-800/80 px-4 py-0.5 text-white "
              >
                <i className="fas fa-plus-circle pe-2"></i> New Assignment
              </button>
            </div>
          </div>
        </div>
      </div>
      {
        isLoading ? <Loader isLoad={true} /> : 
        <>
      <div id="general" className="">
        <div className="mx-auto flex max-w-6xl">
          <div className="flex-1 xl:overflow-y-auto">
            <div className="max-w-4.5xl mx-auto px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
              <div className="flex">
                <h1 className="text-3xl font-bold tracking-tight text-white">
                  Editing Assignment "{name}"
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
                      value={totalPoints}
                      onChange={(e) => setTotalPoints(e.target.value)}
                      className="mt-2 block w-full rounded-md border-none bg-neutral-800 py-1.5 text-white shadow-sm sm:text-sm sm:leading-6"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="number-of-seats"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Assignment Title
                    </label>
                    <input
                      autoComplete="off"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
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
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="mt-2 block w-full rounded-md border-none bg-neutral-800 py-1.5 text-white shadow-sm sm:text-sm sm:leading-6"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="number-of-seats"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                            Time
                    </label>
                    <input
                      type="time"
                      autoComplete="off"
                      value={dueTime}
                      onChange={(e) => setDueTime(e.target.value)}
                      className="mt-2 block w-full rounded-md border-none bg-neutral-800 py-1.5 text-white shadow-sm sm:text-sm sm:leading-6"
                    />
                  </div>


                  <div className="sm:col-span-6">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      AI Objectives
                    </label>
                    <div className="mt-2">
                      <textarea
                        value={aiObjectives}
                        onChange={(e) => setAiObjectives(e.target.value)}
                        id="bio"
                        name="bio"
                        rows={3}
                        className="block w-full rounded-md border-0 border-none bg-neutral-800 text-white shadow-sm  placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:py-1.5 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="classroom-status"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Assignment Status
                    </label>
                    <select
                      value={isOpen ? 'open' : 'close'}
                      onChange={(e) => setIsOpen(e.target.value === 'open')}
                      id="classroom-status"
                      className="mt-2 block w-full rounded-md border-none bg-neutral-800 py-1.5 text-white shadow-sm sm:text-sm sm:leading-6"
                    >
                      <option value="open">Open</option>
                      <option value="close">Closed</option>
                    </select>
                  </div>
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="classroom-status"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Assignment Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      id="classroom-status"
                      className="mt-2 block w-full rounded-md border-none bg-neutral-800 py-1.5 text-white shadow-sm sm:text-sm sm:leading-6"
                    >
                      <option value="test">Test</option>
                      <option value="quiz">Quiz</option>
                      <option value="homework">Homework</option>
                      <option value="assessment">Assessment</option>
                    </select>
                  </div>

                  <div className="sm:col-span-6">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Assignment Description
                    </label>
                    <div className="mt-2">
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        id="bio"
                        name="bio"
                        rows={3}
                        className="block w-full rounded-md border-0 border-none bg-neutral-800 text-white shadow-sm  placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:py-1.5 sm:text-sm sm:leading-6"
                      />
                    </div>
                  <div className="sm:col-span-3 p-1">
                    <label
                      htmlFor="classroom-status"
                      className="block text-sm font-medium leading-6 text-white"
                    >
                      Late Penalty (%)
                    </label>

                    <input
                      type="number"
                      autoComplete="off"
                      value={latePenalty}
                      onChange={(e) => setLatePenalty(e.target.value)}
                      className="mt-2 block w-full rounded-md border-none bg-neutral-800 py-1.5 text-white shadow-sm sm:text-sm sm:leading-6"
                    />
                  </div>
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
                  className="ml-4 rounded-lg bg-blue-600 px-2 py-1 text-white hover:bg-blue-700"
                >
                  Save
                </button>
                <button  className="ml-4 rounded-lg bg-blue-600 px-2 py-1 text-white hover:bg-blue-700" onClick={() => setIsEditingChallenge(true)}>Edit Challenge</button>

                <button
                  onClick={() => {
                    setShowOverlay(true);
                    setMessageOfConfirm(actions[0]);
                    setIndex(0);
                  }}
                  className="ml-4 rounded-lg bg-red-600 px-2 py-1 text-white hover:bg-red-600/50"
                >
                  Delete Assignment
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
      }
    </>
  );
}
