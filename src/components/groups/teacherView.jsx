import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { useEffect, Fragment, useState } from 'react';
import { Transition, Dialog } from '@headlessui/react';
import CreateAssignment from '@/components/groups/assignments/createAssignment';
import { Tooltip } from 'react-tooltip';

import Announcements from '@/components/groups/announcements';
import ClassroomNav from '@/components/groups/classroomNav';
import LoadingBar from 'react-top-loading-bar';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const baseClientUrl = `localhost:3000`;

const defaultImages = [
  'https://robohash.org/pranavramesh',
  'https://robohash.org/laphatize',
  'https://robohash.org/stevewilkers',
  'https://robohash.org/rickast',
  'https://robohash.org/picoarc',
  'https://robohash.org/jasoncalcanis',
];

export default function TeacherView({ group }) {
  const [classroom, setClassroom] = useState({});
  const [inviteEmail, setInviteEmail] = useState('');
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [color, setColor] = useState('gray');
  const [inviteLink, setInviteLink] = useState('');

  const [viewCreateAssignment, setViewCreateAssignment] = useState(false);
  const [progress, setProgress] = useState(0); // for the loader

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const getClassroom = async () => {
      const classroomCode = group;
      const url = `${baseUrl}/classroom/classroom-by-classcode?classCode=${classroomCode}`;
      const requestOptions = {
        method: 'GET',
      };
      const response = await fetch(url, requestOptions);
      const data = await response.json();
      if (data.success) {
        setClassroom(data.body);
      } else {
        console.log('Error when getting classroom info');
      }
    };
    getClassroom();

    setProgress(progress + 100);
  }, []);

  const handleInvite = async () => {
    setColor('gray');
    setMessage('Invite link: ');
    setInviteLink('generating...');
    const email = inviteEmail;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
      setColor('lightgreen');
      setMessage('Your invite link: ');
      const url = `${baseUrl}/classroom/getAccessToken?classCode=${classroom.classCode}&email=${email}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setColor('lightgreen');
        setInviteLink(
          `${baseClientUrl}/groups/invites/${classroom.classCode}/${data.body}`
        );
      } else {
        setMessage(data.message);
        setColor('red');
        setInviteLink('');
      }
    } else {
      setColor('red');
      setMessage('Invalid email');
      setInviteLink('');
    }
  };

  const parseDate = (dateString) => {
    let dateObject = new Date(dateString);
    let month = dateObject.getMonth() + 1; // getMonth() returns a zero-based value (where zero indicates the first month of the year)
    let day = dateObject.getDate();
    let year = dateObject.getFullYear();
    let hours = dateObject.getHours();
    let minutes = dateObject.getMinutes();
    let ampm = hours >= 12 ? ' PM' : ' AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let strTime = hours + ':' + minutes + ampm;
    let formattedDate = `${month}/${day}/${year} ${strTime}`;
    return formattedDate;
  };

  if (viewCreateAssignment) {
    return <CreateAssignment classroomId={classroom.id} />;
  }

  return (
    <>
      <Head>
        <title>Coming Soon - CTFGuide</title>
        <style>
          @import
          url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
          /* bold */
        </style>
      </Head>
      <StandardNav />
      <LoadingBar
        color="#0062ff"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      {/* second nav bar */}
      <div className="bg-neutral-800">
        <div className=" mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-10 justify-between">
            {classroom && <ClassroomNav classCode={classroom.classCode} />}
            <div className="flex items-center">
              <button
                onClick={() => {
                  setViewCreateAssignment(true);
                  // (window.location.href = `/groups/${classroom.classCode}/${uid}/create-assignment`)
                }}
                className="rounded-lg bg-neutral-800/80 px-4 py-0.5 text-white "
              >
                <i className="fas fa-plus-circle pe-2"></i> New Assignment
              </button>

              <button
                onClick={() => {
                  setIsModalOpen(true);
                }}
                className="rounded-lg bg-neutral-800/80 px-4 py-0.5 text-white "
              >
                <i className="fas fa-bullhorn pe-2"></i> New Post
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className=" mx-auto grid min-h-screen max-w-6xl  ">
        <div className="mt-10 ">
          <div className="flex">
            <h1 className="text-3xl font-semibold text-white">
              {classroom.name}
            </h1>
          </div>

          <hr className="mt-2 border-neutral-800 text-neutral-800 "></hr>
          <div className="mt-4 grid grid-cols-6 gap-x-8">
            <div className="col-span-4 rounded-lg    py-3 ">
              <h1 className="text-xl font-semibold text-white">
                {' '}
                Course Description{' '}
              </h1>
              <div
                style={{ color: 'white', cursor: 'default' }}
                className="mb-4 cursor-pointer rounded-sm  "
              >
                {classroom.description}
              </div>

              {/* LOOPING THROUGH MEMBERS */}

              <h1 className="mb-2 text-xl font-semibold text-white">
                {' '}
                Members
              </h1>
              <div className="grid grid-cols-4 gap-x-4 gap-y-2">
                {classroom.teachers && classroom.teachers.length === 0 ? (
                  <div style={{ color: 'white' }}>No teachers yet...</div>
                ) : (
                  classroom.teachers &&
                  classroom.teachers.map((teacher, idx) => {
                    const i =
                      defaultImages.length - 1 - (idx % defaultImages.length);
                    return (
                      <div
                        key={idx}
                        className="flex items-center space-x-2 rounded-lg "
                      >
                        <img
                          src={defaultImages[i]}
                          className="h-10 w-10 rounded-full border border-neutral-800 bg-neutral-700" // Make image circular
                          alt={`Teacher ${teacher.username}`}
                        />
                        <h1 className="truncate text-white">
                          <i className="fas fa-user-shield"></i>{' '}
                          {teacher.username}
                        </h1>
                      </div>
                    );
                  })
                )}
                {classroom.students &&
                  classroom.students.map((student, idx) => {
                    const i = idx % defaultImages.length;
                    return (
                      <div
                        key={idx}
                        className="flex items-center space-x-2 rounded-lg  "
                      >
                        <img
                          src={defaultImages[i]}
                          className="h-10 w-10 rounded-full border border-neutral-800 bg-neutral-700" // Make image circular
                          alt={`Student ${student.username}`}
                        />
                        <h1 className="text-white">{student.username}</h1>
                      </div>
                    );
                  })}
              </div>

              {classroom && classroom.announcements && (
                <Announcements
                  isTeacher={true}
                  classCode={classroom.classCode}
                  announcementsProp={classroom.announcements}
                  isModalOpen={isModalOpen}
                  setIsModalOpen={setIsModalOpen}
                />
              )}
            </div>
            <div className="col-span-2   px-4 py-3">
              <h1 className="text-xl font-semibold text-white">
                Upcoming Assignments
              </h1>
              <div className="mt-1 ">
                {classroom &&
                classroom.assignments &&
                classroom.assignments.length > 0 ? (
                  classroom.assignments
                    .filter(
                      (assignment) => new Date(assignment.dueDate) > new Date()
                    )
                    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                    .slice(0, 5)
                    .map((assignment) => (
                      <div
                        key={assignment.id}
                        onClick={() => {
                          window.location.href =
                            '/assignments/teacher/' + assignment.id + '';
                        }}
                        className={`mb-2 cursor-pointer rounded-sm border-l-4 ${
                          new Date(assignment.dueDate) < new Date()
                            ? 'border-red-600'
                            : 'border-green-600'
                        } bg-neutral-800/50 px-3 py-3  hover:bg-neutral-800`}
                      >
                        <h2 className="text-md text-white">
                          <Tooltip id="quiz-tooltip" place="left" />
                          <Tooltip id="test-tooltip" place="left" />
                          <Tooltip id="homework-tooltip" place="left" />
                          <Tooltip id="assessment-tooltip" place="left" />

                          {assignment.category === 'quiz' && (
                            <i
                              title="quiz"
                              className="fas fa-question-circle"
                              data-tooltip-id="quiz-tooltip"
                              data-tooltip-content="Quiz"
                            ></i>
                          )}
                          {assignment.category === 'test' && (
                            <i
                              title="test"
                              className="fas fa-clipboard-check"
                              data-tooltip-id="test-tooltip"
                              data-tooltip-content="Test"
                            ></i>
                          )}
                          {assignment.category === 'homework' && (
                            <i
                              title="homework"
                              className="fas fa-book"
                              data-tooltip-id="homework-tooltip"
                              data-tooltip-content="Homework"
                            ></i>
                          )}
                          {assignment.category === 'assessment' && (
                            <i
                              title="assessment"
                              className="fas fa-file-alt"
                              data-tooltip-id="assessment-tooltip"
                              data-tooltip-content="Assessment"
                            ></i>
                          )}

                          <span className="ml-0.5"> {assignment.name} </span>
                        </h2>
                        <p className="text-white">
                          Due: {parseDate(assignment.dueDate)}{' '}
                        </p>
                      </div>
                    ))
                ) : (
                  <div className="mb-2 cursor-pointer rounded-sm border-l-4 border-red-600 bg-neutral-800/50 px-3 py-3 text-white hover:bg-neutral-800">
                    <h1 className="pe-6 text-lg">No assignments here yet</h1>
                    <h2 className="pe-6 text-sm">
                      Create an assignment with the button above!
                    </h2>
                  </div>
                )}
                <button
                  className="float-right rounded-sm bg-neutral-900 py-1  text-sm text-white"
                  onClick={() => {
                    window.location.href = `../${classroom.classCode}/view-all-assignments`;
                  }}
                >
                  <i className="fas fa-external-link-alt"></i> View All
                </button>
              </div>

              <h1 className="mt-10 text-xl font-semibold text-white">
                Platform Updates
              </h1>
              <div className="text-md mt-2 rounded-t-lg bg-neutral-800 px-4 py-2 text-white">
                <b>Expected Downtime </b>{' '}
                <span className="rounded-lg bg-yellow-800 px-4 text-sm ">
                  alerts
                </span>
              </div>
              <div className="rounded-b-lg bg-neutral-700/50 px-4 py-2 text-sm text-white">
                <p>
                  Our terminal platform will be recieving some updates meaning
                  that students will not be able to complete any virtual labs
                  during this time.
                  <br></br> <br></br>
                  <i>
                    Affected services: EDU, Terminals, Create a VM, and Virtual
                    Labs
                  </i>
                </p>
              </div>
            </div>

            <br></br>
          </div>
        </div>
      </div>

      <input
        type="hidden"
        id="copyBox"
        value={classroom.classCode || ''}
      ></input>

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
                      Invite by Email
                    </h1>
                    <input
                      id="email"
                      style={{ width: '250px' }}
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="cursor-outline-none mt-2 rounded-lg  border-transparent bg-neutral-800 py-0.5  text-sm  text-white outline-none focus:border-transparent  focus:outline-none  focus:ring-0  "
                      placeholder="example@ctfguide.com"
                    ></input>
                    <br></br>
                    <div className="mx-auto mt-4 w-full pb-5 text-center">
                      <button
                        onClick={handleInvite}
                        className="rounded-lg bg-neutral-800 px-4 py-2 text-white hover:bg-neutral-600/50"
                      >
                        {' '}
                        invite{' '}
                      </button>
                      <button
                        onClick={() => {
                          setOpen(false);
                        }}
                        className="ml-4 rounded-lg bg-neutral-800 px-4 py-2 text-white hover:bg-neutral-600/50"
                      >
                        Cancel
                      </button>
                      <div style={{ color: color, marginTop: '10px' }}>
                        {message}
                      </div>
                      <div style={{ color: 'white', marginTop: '10px' }}>
                        {inviteLink}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <Footer />
    </>
  );
}
