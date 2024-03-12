import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { ProgressCircle } from '@tremor/react';
import { MarkdownViewer } from '@/components/MarkdownViewer';
import { useEffect, useState } from 'react';
import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/24/outline'
import request from '@/utils/request';
import { useRouter } from 'next/router';
import ClassroomNav from '@/components/groups/classroomNav';
import { getCookie } from '@/utils/request';
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export default function id() {
  const [open, setOpen] = useState(false);
  
  const router = useRouter();
  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);

  const [user, setUser] = useState(null);

  const [formattedDate, setFormattedDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [player, setPlayer] = useState(null);
  const [kanaLog, setKanaLog] = useState([]);

  const [role, setRole] = useState(null);

  const [kanaError, setKanaError] = useState(false);
  const [submissions, setSubmissions] = useState([]);

  //const [challenge, setChallenge] = useState(null);

  // fetch kana log
  const fetchKanaLog = async (password, challengeId, uid, assignmentID) => {
    try {
      const AsciinemaPlayer = await import('asciinema-player');

      var requestOptions = {
        method: 'GET',
        redirect: 'follow',
      };

      let url = `${process.env.NEXT_PUBLIC_TERM_URL}/files/get/log?jwtToken=&uid=${uid}&assignmentID=${assignmentID}`;
      fetch(url, requestOptions)
        .then(async (response) => {
          // set file variable to the response
          //    AsciinemaPlayer.create('', document.getElementById('demo'));
          let player = AsciinemaPlayer.create(
            { data: response },
            document.getElementById('demo'),
            {
              fit: false,
              terminalFontSize: 30,
            }
          );
          setPlayer(player);
        })
        .then((result) => console.log(result))
        .catch((error) => console.log('error', error));

      function seekToTime(seconds) {
        player.seek(seconds).then(() => {
          console.log(seconds);
          console.log(`Current time: ${player.getCurrentTime()}`);
        });
      }

      // Add click event listeners to list items
      document.querySelectorAll('.clickable').forEach((item) => {
        item.addEventListener('click', function () {
          const time = parseInt(this.id.replace('seek', ''));
          seekToTime(time);
        });
      });

      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  }

  const seekToTime = (seconds) => {
    player.seek(seconds).then(() => {
      console.log(seconds);
      console.log(`Current time: ${player.getCurrentTime()}`);
    });
  };

  const convert = (timestamp) => {
    const min = timestamp.split(':')[0];
    const sec = timestamp.split(':')[1];
    return parseInt(min) * 60 + parseInt(sec);
  };


  async function getJson() {
    try {
      let jwt = getCookie();
      if (!jwt) {
        console.log("User is not authenticated");
        return;
      }
      const uid = user.uid;
      let url = `${process.env.NEXT_PUBLIC_TERM_URL}get/json?jwtToken=${jwt}&assignmentID=${assignment.id}&uid=${uid}`;
      let requestOptions = { method: 'GET' };
      let response = await fetch(url, requestOptions);
      if (!response.ok) {
        console.log('Error fetching kana log');
        return;
      }
      console.log(response);
      const readableStream = response.body;
      const textDecoder = new TextDecoder();
      const reader = readableStream.getReader();
      let result = await reader.read();
      let data = null;
      while (!result.done) {
        let info = textDecoder.decode(result.value);
        console.log(info);
        data = JSON.parse(info);
        result = await reader.read();
      }

      if (!data) {
        console.log('Error parsing kana log');
        return;
      }

      let events = data.events;

      for (let i = 0; i < events.length; i++) {
        events[i].seconds = convert(events[i].timestamp);
      }

      setKanaError(true);

      setKanaLog(events); // []
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (!loading) {
      getJson();
    }
  }, [loading]);

  const fetchSubmission = async () => {
    try {
      const id = window.location.href.split('/')[6];
      const url = `${baseUrl}/submission/submission/${id}`;
      const data = await request(url, 'GET', null);
      console.log(data);
      if (data && data.success) {
        setAssignment(data.body.assignment);
        setUser(data.body.user);
        console.log("Name is: ", data.body.user.firstName + " " + data.body.user.lastName);
        let adjustedGrade = calculateAdjustedGrade(data.body);
        data.body.grade = adjustedGrade;
        data.body.grade = Math.round(data.body.grade * 100) / 100;
        setSubmission(data.body);
        const date = new Date(data.body.createdAt);
        setFormattedDate(date.toLocaleString());
        await fetchKanaLog(data.body.terminalIdentifier, data.body.assignment.challengeId, data.body.user.uid, data.body.assignment.id);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const calculateAdjustedGrade = (dataBody) => {
    if (dataBody.isLate) {
      return dataBody.grade - dataBody.assignment.latePenalty;// (dataBody.grade * dataBody.assignment.latePenalty / 100);
    }
    return dataBody.grade;
  }

  useEffect(() => {
    fetchSubmission();
  }, []);

  useEffect(() => {
    if (assignment === null) {
      getAssignment();
    }
  }, []);

  const authenticate = async (assignment) => {
    const url = `${baseUrl}/classroom/inClass/${assignment.classroom.id}`;
    const data = await request(url, 'GET', null);
    console.log(data);
    if (data.body.isTeacher) {
      setRole('t');
      return true;
    }
    setRole('');
    return data.body.isStudent;
  };

  // NEW SUBMISSION LOGIC
  const getAssignment = async () => {
    const params = window.location.href.split('/');
    if (params.length < 5) {
      return;
    }
    const r = router.query.key == "t" ? "teacher" : "student";
    const url = `${baseUrl}/classroom-assignments/fetch-assignment-${r}/${params[4]}`;
    const data = await request(url, 'GET', null);
    if (data && data.success) {
      const isAuth = await authenticate(data.body);
      if (isAuth) {
        setAssignment(data.body);
        //getChallenge(data.body);
        await getSubmissions(data.body);
      } else {
        console.log('You are not apart of this class');
        window.location.href = '/groups';
      }
    }
  };

  const routeToSubmission = (id) => {
    console.log("going to submission" + id);
    window.location.href = `/assignments/${assignment.id}/submissions/${id}?key=t`;
  };

  const getSubmissions = async (assignment) => {
    const url = `${baseUrl}/submission/getSubmissionsForTeachers/${assignment.classroom.id}/${assignment.id}`;
    const data = await request(url, 'GET', null);
    if (data && data.success) {
      setSubmissions(data.body);
      setIsLoading(false);
      console.log('Submissions:', data.body);
    } else {
      console.log('Unable to get submissions');
    }
  };

  /*
  const getChallenge = async (assignment) => {
    try {
      const url = `${baseUrl}/challenges/${assignment.challenge.id}?assignmentId=${assignment.id}`;
      const data = await request(url, 'GET', null);
      if (data.success) {
        setChallenge(data.body);
      }
    } catch (err) {
      console.log(err);
    }
  };
  */

  return (
    <>
      <Head>
        <title>Coming Soon - CTFGuide</title>
        <style>
          @import
          url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
        </style>

        <link
          rel="stylesheet"
          type="text/css"
          href="../../../../asciinema-player.css"
        />
      </Head>
      <StandardNav />
      <div className=" min-h-screen  ">
        <div className="mx-auto mt-4">
          <div className="w-full bg-gradient-to-r from-blue-800 via-blue-900 to-blue-800 px-4 py-4 ">
            <div className="mx-auto px-2">
              <div className="flex">
                <div>
                  <h1 className="text-3xl font-semibold text-white">
                    {
                      submission && assignment ? <span>{submission.user.firstName} {submission.user.lastName}'s Submission</span>
                        : <span>... Submission</span>
                    }
                  </h1>

                  <h1 className="text-white mb-4">Submitted at {formattedDate}</h1>

                  {/* go back */}
                  {assignment && (
                    <a
                      href={`/assignments/${role ? "teacher" : "student"}/${assignment.id}`}
                      className="text-blue-600 mt-4 px-3  font-semibold bg-white  text-center rounded-lg hover:text-blue-600 hover:bg-gray-100 cursor-pointer"
                    >
                      Back to Assignment View
                    </a>
                  )}

                </div>
                
                <div className="ml-auto">
                  <div className="rounded-md bg-white px-3 py-1 text-center gap-y-0">
                    <h1 className="text-4xl font-bold text-blue-600 text-center mb-0 pb-0 ">
                      {submission ? submission.grade : '00'}%
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mx-auto mt-4  px-4">
            <div className="">
              <div className="grid  grid-cols-4 gap-x-8">
       
                {role === 't' && (
                  <div className='col-span-1 mx-auto w-full'>
                    {isLoading ? (
<div>
<i class="fas fa-spinner fa-spin text-white text-3xl mx-auto text-center w-full mt-20"></i>
                   <p className='text-white text-lg text-center mx-auto'>Fetching submissions...</p>
                   </div>
                    ) : (
                      submissions.length === 0 && (
                        <div style={{ color: 'white' }}>
                          No students have completed this assignment yet.
                        </div>
                      )
                    )}
                    {submissions.map((submission, idx) => (
                      <div
                        key={idx}
                        className="cursor-pointer rounded-lg bg-neutral-800 px-4 py-3 mb-2 text-white hover:bg-neutral-800/40"
                        onClick={() => routeToSubmission(submission.subId)}
                      >
                        <h1 className="flex">
                          {submission.name}{' '}
                          {submission.submitted ? (
                            <div className="ml-auto">
                              <i
                                title="Completed!"
                                className="fas fa-check  text-green-500"
                              ></i>
                            </div>
                          ) : (
                            <div className="ml-auto">
                              <i
                                title="Incomplete!"
                                className=" fas fa-clock  text-red-400 "
                              ></i>
                            </div>
                          )}
                        </h1>
                      </div>
                    ))}
                  </div>
                )}
                <div className={role !== 't' ? "col-span-3" : "col-span-2"}>
                  <div
                    className="h-1/2 w-full border  border-neutral-800"
                    id="demo"
                  ></div>
                </div>
                <div>
                  <ol className="relative border-s border-neutral-200 ">

                    {
                      kanaLog && kanaLog.map((item, index) => {
                        return (
                          <li
                            id={`seek${item.seconds}`}
                            key={index}
                            onClick={() => seekToTime(item.seconds)}
                            className="clickable cursor-pointer mb-10 ms-4 p-4 hover:bg-neutral-800"
                          >
                            <div className="absolute -start-1.5 mt-1.5 h-3 w-3 rounded-full border border-neutral-800 bg-blue-500 "></div>
                            <time className="mb-1 text-sm font-normal leading-none text-neutral-400 ">
                              {item.timestamp}
                            </time>
                            <h3 className="text-md font-semibold text-blue-400 ">
                              {item.header}
                            </h3>
                            <p className="text-base font-normal text-slate-100 ">
                              {item.event}
                            </p>
                          </li>
                        )
                      })
                    }

                  </ol>



                  {
                    (kanaLog && kanaLog.length === 0) && (
                      <div className='text-white text-lg text-center mx-auto bg-neutral-800 rounded-lg px-2 py-4'>
                      <i class="fas fa-spinner text-2xl fa-spin"></i>
                        <h1>We're still processing this session.</h1>
                        <p className='text-sm'>You can still view the session recording.</p>
                      </div>
                    )
                  }

                  
                </div>


                <Transition.Root show={open} as={Fragment}>
                  <Dialog as="div" className="relative z-10" onClose={setOpen}>
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                          as={Fragment}
                          enter="ease-out duration-300"
                          enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                          enteredo="opacity-100 translate-y-0 sm:scale-100"
                          leave="ease-in duration-200"
                          leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                          leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                          <Dialog.Panel className="max-w-6xl relative transform overflow-hidden rounded-lg bg-neutral-900 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:p-6">
                            <div>
                              <div className="mt-3  sm:mt-5">
                                <Dialog.Title as="h3" className=" font-semibold leading-6 text-xl text-white">
                                  Penalty Explanation
                                </Dialog.Title>
                                <div className="mt-2 mb-5">
                                  <p className="text-md text-white">
                                    When configuring this assignment, you requested that attempting to guess locations was prohibited.
                                    Typically, the student wouldn't have been penalized for changing to a directory that doesn't exist. But, because they attempted to cd into a folder that they knew wasn't there after running <span className='bg-black px-4'>ls</span>, it can be assumed that they were attempting to guess the location. As a result I gave a 5 point penalty.
                                  </p>


                                  <h1 className='text-md font-semibold text-white mt-4'>Was my penalty appropriate?</h1>
                                  <button className='mt-3 text-white bg-green-700 px-4 py-1 rounded-lg'>Yes</button>
                                  <button className='ml-2 text-white bg-red-700 px-4 py-1 rounded-lg'>No</button>

                                  <h1 className='text-md font-semibold text-white mt-4'>Do you have any feedback? The AI will try to improve its grading strategy.</h1>
                                  <textarea className='bg-neutral-800 text-white w-full rounded-lg px-4 py-2 mt-2 border-none' placeholder='Enter feedback here...'></textarea>
                                  <button className='mt-3 text-white bg-blue-700 px-4 py-1 rounded-lg'>Submit Feedback</button>

                                </div>
                              </div>
                            </div>

                          </Dialog.Panel>
                        </Transition.Child>
                      </div>
                    </div>
                  </Dialog>
                </Transition.Root>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
