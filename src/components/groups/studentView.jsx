import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { useEffect, useState } from 'react';
import Announcements from '@/components/groups/announcements';
import { Tooltip } from 'react-tooltip';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import request from '@/utils/request';
import StudentNav from '@/components/groups/studentNav';

const defaultImages = [
  'https://robohash.org/pranavramesh',
  'https://robohash.org/laphatize',
  'https://robohash.org/stevewilkers',
  'https://robohash.org/rickast',
  'https://robohash.org/picoarc',
  'https://robohash.org/jasoncalcanis',
];

export default function StudentView({ group }) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL; // switch to deployment api url
  const [classroom, setClassroom] = useState({});

  const parseDate = (dateString) => {
    const date = new Date(dateString);
    const offsetInMinutes = date.getTimezoneOffset();
    date.setMinutes(date.getMinutes() + offsetInMinutes);
    function to12HourFormat(hour, minute) {
      let period = hour >=  12 ? "PM" : "AM";
      hour = hour %  12;
      hour = hour ? hour :  12; // the hour '0' should be '12'
      return hour + ":" + minute.toString().padStart(2, '0') + " " + period;
    }
    const day = date.getDate();
    const month = date.getMonth() +  1; // Months are  0-based in JavaScript
    const year = date.getFullYear().toString().slice(-2);
    const hour = date.getHours();
    const minute = date.getMinutes();
    const time = to12HourFormat(hour, minute);
    const formattedDate = `${month}/${day}/${year} ${time}`;
    return formattedDate;
  };

  useEffect(() => {
    const classroomCode = group;
    const getClassroom = async () => {
      const url = `${baseUrl}/classroom/classroom-by-classcode/${classroomCode}`;
      const data = await request(url, 'GET', null);
      if (data && data.success) {
        setClassroom(data.body);
      } else {
        console.log(data.message);
      }
    };
    getClassroom();
  }, []);

  return (
    <>
      <Head>
        <title>Classroom - CTFGuide</title>
        <style>
          @import
          url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
        </style>
      </Head>
      <StandardNav />
      <StudentNav classCode={classroom.classCode} />
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
                className="mb-4 cursor-pointer rounded-sm"
              >
                <textarea
                  value={classroom.description}
                  id="bio"
                  name="bio"
                  rows={8}
                  className="resize-none block w-full rounded-md border-0 border-none bg-transparent text-white shadow-none placeholder:text-slate-400 focus:ring-0 sm:py-1.5 sm:text-base sm:leading-6 p-0" // Remove padding
                  readOnly
                />
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
              <br></br>
              {classroom && classroom.announcements && (
                <Announcements
                  isTeacher={false}
                  classCode={classroom.classCode}
                  announcementsProp={classroom.announcements}
                />
              )}
            </div>
            <div className="col-span-2   px-4 py-3">
              <h1 className="text-xl font-semibold text-white">Upcoming Assignments</h1>
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
                            '/assignments/student/' + assignment.id + '';
                        }}
                        className={`mb-2 cursor-pointer rounded-sm border-l-4 ${new Date(assignment.dueDate) < new Date()
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

                        <span className="ml-0.5"> {assignment.name} {!assignment.isOpen && 
                              <span style={{color: "#C41E3A"}}>(closed)</span>} </span>
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
                <Link
                  className="float-right rounded-sm bg-neutral-900 py-1  text-sm text-white"
                  href={`/groups/${classroom.classCode}/view-all-assignments`}
                >
                  <i className="fas fa-external-link-alt"></i> View All
                </Link>
              </div>

              <h1 className="mt-10 text-xl font-semibold text-white">
                Platform Updates
              </h1>
              <div className="text-md mt-2 rounded-t-lg bg-neutral-800 px-4 py-2 text-white">
                <b>Developer Notice </b>{' '}
                <span className="rounded-lg float-right bg-blue-800 px-4 text-sm ">
                  updates
                </span>
              </div>
              <div className="rounded-b-lg bg-neutral-700/50 px-4 py-2 text-sm text-white">
                <p>
                 Thank you for signing up for CTFGuide Groups! We are excited to get your feedback on our platform. Give us a follow on our Twitter/X <a className="text-blue-500" href="https://twitter.com/@ctfguideapp">@ctfguideapp </a>for updates on our platform. <br></br> <br></br>
                  <br></br> <br></br>
                
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
  <div id="trialMsg" className="hidden fixed inset-x-0 bottom-0">
    <div className="flex items-center gap-x-6 bg-black px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
      <p className="text-xl leading-6 text-white">
        <a href="#">
          <strong className="font-semibold">Free Trial</strong>
          <svg viewBox="0 0 2 2" className="mx-2 inline h-0.5 w-0.5 fill-current" aria-hidden="true">
            <circle cx={1} cy={1} r={1} />
          </svg>
        </a>

      <span id="trialStatus"></span>
      </p>
      <div className="flex flex-1 justify-end">

      </div>
    </div>
  </div>

      <Footer />
    </>
  );
}
