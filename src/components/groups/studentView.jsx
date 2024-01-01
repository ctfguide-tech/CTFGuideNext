import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { useEffect, useState } from 'react';
// import { loadStripe } from '@stripe/stripe-js';
// const STRIPE_KEY = process.env.NEXT_PUBLIC_APP_STRIPE_KEY;

export default function StudentView({ uid, group }) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL; // switch to deployment api url

  const [classroom, setClassroom] = useState({});
  const [freeTrialDaysLeft, setFreeTrialDaysLeft] = useState(0);
  const [displayDueDate, setDisplayDueDate] = useState('');

  const defaultImages = [
    'https://robohash.org/pranavramesh',
    'https://robohash.org/laphatize',
    'https://robohash.org/stevewilkers',
    'https://robohash.org/rickast',
    'https://robohash.org/picoarc',
    'https://robohash.org/jasoncalcanis',
  ];

  console.log(classroom);
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
      <div className=" min-h-screen  ">
        <div className="mx-auto mt-10 max-w-6xl">
          <div className="flex">
            <h1 className="text-3xl font-semibold text-white">
              {classroom.name}{' '}
            </h1>
            <div className="ml-auto">
              <button
                onClick={leaveClass}
                className="rounded-lg bg-blue-600 px-2 py-1 text-white hover:bg-blue-600/50"
              >
                Leave
              </button>{' '}
              {freeTrialDaysLeft > 0 && (
                <button
                  onClick={cancelFreeTrial}
                  className="rounded-lg bg-blue-600 px-2 py-1 text-white hover:bg-blue-600/50"
                >
                  Cancel Free Trial
                </button>
              )}
            </div>
          </div>
          <div className="mt-4 grid grid-cols-6 gap-x-4">
            <div className="col-span-4 rounded-lg border-t-8 border-blue-600 bg-neutral-800/50 px-4 py-3 ">
              {/* LOOPING THROUGH MEMBERS */}
              <h1 className="text-xl font-semibold text-white">
                {' '}
                Members{' '}
                {freeTrialDaysLeft !== 0
                  ? '| Free Trial Ends in ' + freeTrialDaysLeft + ' days'
                  : ''}
              </h1>
              <div className="grid grid-cols-3 gap-x-2 gap-y-2">
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
                        className="flex items-center rounded-lg bg-neutral-900"
                      >
                        <img
                          src={defaultImages[i]}
                          className="ml-1 h-10 w-10 "
                        ></img>{' '}
                        <h1 className="ml-6 mt-2 pl-1 text-white">
                          {' '}
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
                        className="flex items-center rounded-lg bg-neutral-900"
                      >
                        <img
                          src={defaultImages[i]}
                          className="ml-1 h-10 w-10 "
                        ></img>{' '}
                        <h1 className="ml-6 mt-2 pl-1 text-white">
                          {student.username}
                        </h1>
                      </div>
                    );
                  })}
              </div>
              <br></br>
              <br></br>
              <h1 className="text-xl font-semibold text-white">
                {' '}
                Course Description{' '}
              </h1>
              <div
                style={{ color: 'white', cursor: 'default' }}
                className="mb-4 cursor-pointer rounded-sm  bg-neutral-900 p-3 hover:bg-neutral-900/50"
              >
                {classroom.description}
              </div>
            </div>
            <div className="col-span-2 rounded-lg  border-t-8  border-blue-600 bg-neutral-800/50 px-4 py-3">
              <h1 className="text-xl font-semibold text-white">Assignments</h1>
              <div className="mt-1 ">
                {classroom &&
                  classroom.assignments &&
                  classroom.assignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      onClick={() => {
                        window.location.href = '/assignments/' + assignment.id;
                      }}
                      className="mb-4 cursor-pointer rounded-sm  bg-neutral-900 p-3  hover:bg-neutral-900/50"
                    >
                      <h2 className="text-lg text-white">
                        {assignment.category}: {assignment.name}
                      </h2>
                      <p className="text-white">
                        Due: {parseDate(assignment.dueDate)}{' '}
                      </p>
                    </div>
                  ))}

                <button className="w-full rounded-sm bg-neutral-900 px-2 py-1 text-white">
                  View All
                </button>
              </div>
            </div>
            <br></br>
            <div className="col-span-6 rounded-lg border-l border-neutral-800 bg-neutral-800/50 px-4 py-3">
              <div className="flex items-center">
                <h1 className="text-xl text-white">Announcements</h1>
              </div>
              <ul
                style={{
                  color: 'white',
                  padding: '0',
                  margin: '0',
                  height: '300px',
                  overflowY: 'auto',
                }}
              >
                {classroom.announcements &&
                  classroom.announcements
                    .slice()
                    .reverse()
                    .map((announcementObj, idx) => {
                      return (
                        <div style={{ position: 'relative' }} key={idx}>
                          <li
                            className="mb-4 cursor-pointer rounded-lg bg-neutral-900 p-3 hover:bg-neutral-900/50"
                            style={{
                              marginLeft: '10px',
                              marginTop: '10px',
                              cursor: 'default',
                            }}
                          >
                            <span style={{ fontSize: '13px' }}>
                              {new Date(
                                announcementObj.createdAt
                              ).toLocaleDateString()}
                            </span>{' '}
                            <br></br>{' '}
                            <span style={{ fontSize: '17px' }}>
                              {announcementObj.message}
                            </span>
                          </li>
                          <span
                            onClick={() =>
                              deleteAnnouncement(announcementObj.id)
                            }
                            style={{
                              fontSize: '15px',
                              position: 'absolute',
                              right: '0',
                              paddingRight: '10px',
                              bottom: '0',
                              cursor: 'pointer',
                            }}
                          ></span>
                        </div>
                      );
                    })}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
