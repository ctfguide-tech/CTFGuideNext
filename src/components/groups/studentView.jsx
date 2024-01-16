import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { useEffect, useState } from 'react';
import Announcements from '@/components/groups/announcements';
import { Tooltip } from 'react-tooltip';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function StudentView({ group }) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL; // switch to deployment api url

  const [classroom, setClassroom] = useState({});
  const [freeTrialDaysLeft, setFreeTrialDaysLeft] = useState(0);

  const defaultImages = [
    'https://robohash.org/pranavramesh',
    'https://robohash.org/laphatize',
    'https://robohash.org/stevewilkers',
    'https://robohash.org/rickast',
    'https://robohash.org/picoarc',
    'https://robohash.org/jasoncalcanis',
  ];

  const getFreeTrialStatus = async (classroomId) => {
    try {
      console.log('Getting free trial status');
      const userId = localStorage.getItem('uid');
      const url = `${baseUrl}/classroom/getFreeTrialStatus/${userId}/${classroomId}`;
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      if (data.success) {
        setFreeTrialDaysLeft(data.body.daysLeft);
        toast.info(
          `You have ${data.body.daysLeft} days until the free trial expires`
        );
      } else {
        console.log(data.message);
      }
    } catch (err) {
      console.log(err);
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

  useEffect(() => {
    const classroomCode = group;
    const getClassroom = async () => {
      const url = `${baseUrl}/classroom/classroom-by-classcode?classCode=${classroomCode}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setClassroom(data.body);
        await getFreeTrialStatus(data.body.id);
      } else {
        console.log(data.message);
      }
    };
    getClassroom();
  }, []);

  const viewProfile = (student) => {
    console.log('Link to a page to view this students profile');
  };

  const leaveClass = async () => {
    try {
      const classroomId = classroom.id;
      const uid = localStorage.getItem('uid');
      const url = `${baseUrl}/classroom/leave`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isTeacher: false, classroomId, userId: uid }),
      });
      const data = await response.json();
      if (data.success) {
        window.location.href = `/groups`;
      } else {
        console.log(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const cancelFreeTrial = async () => {
    try {
      const classroomId = classroom.id;
      const uid = localStorage.getItem('uid');
      const url = `${baseUrl}/payments/stripe/cancel-payment-intent`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation: 'joinClass', classroomId, uid }),
      });
      const data = await response.json();
      if (data.success) {
        console.log(data);
      } else {
        console.log(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const viewGrades = () => {
    // see the students grades
  };

  return (
    <>
      <Head>
        <title>Coming Soon - CTFGuide</title>
        <style>
          @import
          url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
        </style>
      </Head>
      <StandardNav />
      <div className="bg-neutral-800">
        <div className=" mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-10 justify-between"></div>
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
                  isTeacher={false}
                  classCode={classroom.classCode}
                  announcementsProp={classroom.announcements}
                />
              )}
            </div>
            <div className="col-span-2   px-4 py-3">
              <h1 className="text-xl font-semibold text-white">Assignments</h1>
              <div className="mt-1 ">
                {classroom &&
                classroom.assignments &&
                classroom.assignments.length > 0 ? (
                  classroom.assignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      onClick={() => {
                        window.location.href = '/assignments/' + assignment.id;
                      }}
                      className="mb-2 cursor-pointer rounded-sm border-l-4 border-green-600  bg-neutral-800/50 px-3 py-3  hover:bg-neutral-800"
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
