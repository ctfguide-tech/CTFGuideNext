import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { MarkdownViewer } from '@/components/MarkdownViewer';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { getAuth } from 'firebase/auth';
import api from '@/utils/terminal-api';
const auth = getAuth();
import io from 'socket.io-client';
import request from '@/utils/request';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Slug() {
  // assignment stuff
  const [assignment, setAssignment] = useState(null);
  const [flagInput, setFlagInput] = useState('');
  const [solved, setSolved] = useState(null);

  const router = useRouter();

  // challenge stuff
  const [hints, setHints] = useState([
    { message: '', penalty: '' },
    { message: '', penalty: '' },
    { message: '', penalty: '' },
  ]);

  const [useDiffTerminal, setUseDiffTerminal] = useState(false);
  const [challenge, setChallenge] = useState(null);
  const [challengeHints, setChallengeHints] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingTerminal, setFetchingTerminal] = useState(false);

  // terminal stuff
  const [terminalUrl, setTerminalUrl] = useState('');
  const [password, setPassword] = useState('...');
  const [userName, setUserName] = useState('...');
  const [serviceName, setServiceName] = useState('');
  const [minutesRemaining, setMinutesRemaining] = useState(-1);
  const [foundTerminal, setFoundTerminal] = useState(false);
  const [code, setCode] = useState(0);
  const [open, setOpen] = useState(true);
  const [terminalPopup, setTerminalPopup] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [isStudent, setIsStudent] = useState(true);

  const [submissionId, setSubmissionId] = useState(null);

  function copy(tags) {
    var copyText = document.getElementById(tags);
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

  const parseDate = (dateString) => {
    const date = new Date(dateString);
    const offsetInMinutes = date.getTimezoneOffset();
    date.setMinutes(date.getMinutes() + offsetInMinutes);
    function to12HourFormat(hour, minute) {
      let period = hour >= 12 ? "PM" : "AM";
      hour = hour % 12;
      hour = hour ? hour : 12; // the hour '0' should be '12'
      return hour + ":" + minute.toString().padStart(2, '0') + " " + period;
    }
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are  0-based in JavaScript
    const year = date.getFullYear().toString().slice(-2);
    const hour = date.getHours();
    const minute = date.getMinutes();
    const time = to12HourFormat(hour, minute);
    const formattedDate = `${month}/${day}/${year} ${time}`;
    return formattedDate;
  };

  const getChallenge = async (assignment) => {
    try {
      const url = `${baseUrl}/challenges/${assignment.challenge.id}?assignmentId=${assignment.id}`;
      const data = await request(url, "GET", null);
      if (data.success) {
        setChallenge(data.body);
      }
    } catch (err) {
      console.log(err);
    }
  };
  

  const getAssignment = async () => {
    const params = window.location.href.split('/');
    if (params.length < 5) {
      return;
    }
    const url = `${baseUrl}/classroom-assignments/fetch-assignment-student/${params[5]}`;
    const data = await request(url, "GET", null);
    if (data && data.success) {
      const isAuth = await authenticate(data.body);
      if (isAuth) {
        setAssignment(data.body);
        setSubmissionId(data.submissionId);
        setChallengeHints(data.body.challenge.hints);
        await getChallenge(data.body);
      } else {
        console.log('You are not apart of this class');
        router.push('/groups');
      }
    }
  };

  const authenticate = async (assignment) => {
    const url = `${baseUrl}/classroom/inClass/${assignment.classroom.id}`;
    const data = await request(url, "GET", null);
    if(!data) return false;
    setIsStudent(data.body.isStudent);
    return (data.body.isStudent || data.body.isTeacher);
  };

  const createTerminal = async (skipToCheckStatus) => {
    if (!challenge) return;
    setLoadingMessage('Creating terminal ');
    setFetchingTerminal(true);
    const token = auth.currentUser.accessToken;
    const [created, termId] = await api.buildTerminal(challenge, token);
    console.log('Pengiouns here:', created, termId);
    if (created) {
      if (skipToCheckStatus) {
        console.log('Skipping to check status', termId);
        await getTerminalStatus(termId, token);
        return;
      } else {
        await fetchTerminal();
      }
    } else {
      toast.error("Unable to create the terminal, please try again");
      setFetchingTerminal(false);
    }
    return;
  };

  const fetchTerminal = async () => {
    setFetchingTerminal(true);
    if (!challenge) return;
    setLoadingMessage('Fetching terminal ');
    const token = auth.currentUser.accessToken;
    setFetchingTerminal(true);
    const data = await api.checkUserTerminal(token, challenge.id);
    if (data !== null) {
      setPassword(data.password);
      setServiceName(data.serviceName);
      setTerminalUrl(data.url);
      setUserName(data.userName);
      setMinutesRemaining(data.minutesRemaining);
      console.log('Terminal data ID:', data.id);
      console.log('Terminal url:', data.url);
      await getTerminalStatus(data.id, token);
    } else {
      await createTerminal(false);
    }
  };

  const getTerminalStatus = async (id, token) => {
    setLoadingMessage('Terminal is pending ');
    setFetchingTerminal(true);
    if (!foundTerminal) {
      const [data, isActive] = await api.getStatus(id, token);
      if (isActive) {
        setPassword(data.password);
        setServiceName(data.serviceName);
        setTerminalUrl(data.url);
        setUserName(data.userName);
        setMinutesRemaining(data.minutesRemaining);
        console.log('Terminal data ID:', data.id);
        console.log('Terminal url:', data.url);

        setFoundTerminal(true);
        setFetchingTerminal(false);
      } else {
        if (data) {
          setPassword(data.password);
          setServiceName(data.serviceName);
          setMinutesRemaining(data.minutesRemaining);
          setUserName(data.userName);
        }
        setTimeout(async () => {
          await getTerminalStatus(id, token);
        }, 5000);
      }
    }
  };

  useEffect(() => {
    if (assignment === null) {
      getAssignment();
    }
  }, []);

  const checkFlag = async () => {
    const url = `${baseUrl}/classroom-assignments/check-flag`;
    const body = { flag: flagInput, challengeId: challenge.id};
    setLoading(true);
    const response = await request(url, "POST", body);
    setLoading(false);
    if(response && response.success) {
      if(response.body.solved) {
        setSolved(true);
        toast.success('Flag is Correct, Good Job!');
      } else {
        toast.error('Flag is incorrect. Try again!');
        setSolved(false);
      }
    }
  };

  const showHint = async (i) => {
    const url = `${baseUrl}/challenges/hints-update`;
    const body = {
      hintsUsed: i,
      challengeId: challenge.id,
    };
    const data = await request(url, "POST", body);
    if (data && data.success) {
      let tmp = [...hints];
      tmp[i].message = challengeHints[i].message;
      tmp[i].penalty =
        '(-' + challengeHints[i].penalty + ') points';
      setHints(tmp);
    } else {
      console.log('problem when feching hints');
    }
  };

  function termDebug(info) {
    document.getElementById('spinny').classList.remove('hidden');
    document.getElementById('termDebug').innerHTML = info;
  }

  const submitAssignment = async () => {

    if (password === "...") {
      toast.error('You cannot submit the assignment when you havent used the terminal.');
      return;
    }

    if(!isStudent) {
      toast.error('Teachers cannot submit assignments.');
      return;
    }

    handleDataAsk();

    setLoading(true);
    const params = window.location.href.split('/');
    const url = `${baseUrl}/submission/create/${assignment.classroom.classCode}`;

    const body = {
      solved: solved,
      classroomId: assignment.classroomId,
      assignmentId: params[5],
      keyword: flagInput,
      challengeId: assignment.challengeId,
      totalPoints: assignment.totalPoints,
      hints: assignment.challenge.hints,
      latePenalty: assignment.latePenalty,
      dueDate: assignment.dueDate,
      terminalIdentifier: password,
      timezone: new Intl.DateTimeFormat().resolvedOptions().timeZone
    };

    const data = await request(url, "POST", body);
    if (data && data.success) {
      toast.success('Assignment has been submitted');
      setSubmitted(true);
    } else {
      toast.error('Failed to submit the assignment');
    }

    setLoading(false);
  };

  const routeToSubmission = (id) => {
    window.location.replace(`/assignments/${assignment.id}/submissions/${id}`);
  };

  function getColorForTime(minutes) {
    if (minutes >= 40) return 'text-green-400';
    if (minutes >= 10) return 'text-yellow-400';
    return 'text-red-400';
  }

  const checkIfTerminalExists = async () => {
    setFetchingTerminal(true);
    const token = auth.currentUser.accessToken;
    if (!challenge || !token) return;
    const data = await api.checkUserTerminal(token, challenge.id);
    if (data !== null) {
      console.log('Found a terminal for the user');
      if (data.challengeID !== challenge.id) {
        console.log('User has a terminal but it is not for this challenge');
        setUseDiffTerminal(true);
        setTerminalPopup(true);
      } else {
        console.log('User has a terminal for this challenge');
        setPassword(data.password);
        setTerminalUrl(data.url);
        setServiceName(data.serviceName);
        setUserName(data.userName);
        setMinutesRemaining(data.minutesRemaining);
        await getTerminalStatus(data.id, token);
      }
    } else {
      console.log("Didnt find a terminal for the user");
      await createTerminal(false);
    }
  }
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io('https://kana-server.ctfguide.com');

    socketRef.current.on('connect', () => {
      console.log('Connected to server');
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  function handleDataAsk() {
    socketRef.current.emit('data_ask', { whoami: password });
  }

  return (
    <>
      <Head>
        <title>Assignment View - CTFGuide</title>
        <style>
          @import
          url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
        </style>
      </Head>
      <StandardNav />

      <div style={{}} className="mx-auto h-full overflow-hidden border-b border-neutral-600">
        {router.query.former === 'teacher' && (
          <div className='bg-yellow-900 py-1 text-center text-lg text-white flex items-center justify-center'>
            You are viewing this page as a student. <button onClick={() => { router.push(`/assignments/teacher/${assignment.id}/`) }} className='ml-4 text-sm bg-white rounded-lg px-2 text-yellow-900'>Exit Student View</button>
          </div>
        )}
        <div className="grid h-screen max-h-screen resize-x grid-cols-2 gap-0 md:grid-cols-2 lg:grid-cols-2">
          <div
            id="1"

            className="h-100 resize-x px-8 py-4 overflow-scroll"
          >
            <div className='flex'>

              <div>

                <h1 className="text-2xl font-bold text-white">
                  {assignment && assignment.name}{' '}
                </h1>

                <h1 className="text-white ">
                  Due Date: {assignment && parseDate(assignment.dueDate)}{' '}
                </h1>
              </div>

              <div className='ml-auto'>
                <span
                  onClick={() => router.back()}
                  className="cursor-pointer text-neutral-200 hover:text-neutral-100 mr-4" >
                  <i className="fas fa-long-arrow-alt-left"></i> Return Home
                </span>
                {
                  (assignment && assignment.isOpen) && (
                    <button
                      onClick={submitAssignment}
                      className="mt-3 rounded-lg   bg-blue-700 text-white px-3 py-2 hover:bg-blue-800"
                      disabled={loading}
                    >
                      {submitted || submissionId !== null ? 'Resubmit' : 'Submit Assignment'}
                    </button>
                  )
                }

              </div>
            </div>
            <h1 className="mt-4 text-xl font-semibold text-white">
              Assignment Description
            </h1>
            <hr className="rounded-lg border border-blue-600 bg-neutral-900 mb-3" />
            <MarkdownViewer
              className="text-white"
              content={assignment && assignment.description}
            />

            <h1 className="mt-4 text-xl font-semibold text-white">
              Challenge Description

            </h1>
            <hr className="rounded-lg border border-blue-600 bg-neutral-900 mb-3" />

            <MarkdownViewer
              className="text-white"
              content={challenge && challenge.content}
            />


            <h1 className="mt-4 text-xl font-semibold text-white">
              Submission Area

            </h1>
            <div className="w-1/2 bg-neutral-800 px-4 rounded-lg py-3">
              <p className="mt-2 font-semibold text-white">FLAG SUBMISSION</p>
              <hr className="rounded-lg border border-blue-600 bg-neutral-900" />

              <input
                placeholder="Think you got the flag? Enter it here!"
                className="mt-4 w-full cursor-pointer rounded-lg border border-neutral-700/50 bg-neutral-900 px-4 py-1 text-white hover:bg-neutral-700/10"
                onChange={(e) => setFlagInput(e.target.value)}
                value={flagInput}
              ></input>
              <button
                disabled={loading}
                onClick={checkFlag}
                style={{ width: '40%' }}
                className="mt-3 rounded-lg bg-green-800 px-2 py-1 text-white hover:bg-green-700"
              >
                {loading ? <><i className="fas fa-spinner fa-pulse"></i></>: 'Check Flag'}
              </button>

              {solved === true ? (
                <i
                  className="fa fa-check-circle"
                  style={{
                    color: 'lightgreen',
                    position: 'relative',
                    left: '5px',
                  }}
                  aria-hidden="true"
                ></i>
              ) : (
                solved === false && (
                  <i
                    class="fa fa-times"
                    style={{
                      color: '#D8504D',
                      position: 'relative',
                      left: '5px',
                    }}
                    aria-hidden="true"
                  ></i>
                )
              )}

              <p className="mt-6 font-semibold text-white">HINTS</p>
              <hr className="rounded-lg border border-blue-600 bg-neutral-900 " />
              {hints.map((hint, idx) => {
                return (
                  <div
                    className="mb-2 mt-3 w-full border-l-2 border-yellow-600 bg-[#212121] px-4 text-lg opacity-75 transition-opacity transition-opacity duration-150 duration-75 hover:opacity-100"
                    onClick={() => showHint(idx)}
                    style={{
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      width: '100%',
                      wordWrap: 'break-word',
                    }}
                  >
                    <div style={{ maxWidth: '90%' }}>
                      <p className="text-white">
                        <span className="text-sm ">
                          Hint {idx + 1}: {hint.message}
                        </span>
                      </p>
                    </div>
                    <span className="mt-1 text-sm text-white">
                      {assignment && assignment.challenge.hints[idx].penalty} points
                    </span>
                  </div>
                );
              })}
            </div>
              {
                submissionId && <button className="mt-3 rounded-lg bg-blue-700 text-white px-3 py-2 hover:bg-blue-800" onClick={() => routeToSubmission(submissionId)}>View My Submission</button>
              }
          </div>


          <div className="max-h-screen resize-x overflow-hidden bg-black">
            <div className="mx-auto h-full bg-black px-4 pb-60 ">
              {userName && (
                <div className="hint mb-2 text-gray-400 py-4">
                  <span className="font-semibold text-white">
                    Login as <span id="uname" onClick={() => {
                      navigator.clipboard.writeText(document.getElementById('uname').innerText)
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


                    } className="text-yellow-400 cursor-pointer">{userName}</span> using the password <span className="text-yellow-400 cursor-pointer" id="upass" onClick={() => {
                      navigator.clipboard.writeText(document.getElementById('upass').innerText)
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
                    }}

                    >{password}</span>
                  </span>

                  {minutesRemaining !== -1 && (
                    <div className="float-right ml-auto flex cursor-pointer">
                      <span style={{ cursor: 'pointer' }} className="text-gray-300 hover:bg-black">
                        Container will stop in: &nbsp;
                        <span className={`font-semibold ${getColorForTime(minutesRemaining)}`}>
                          {minutesRemaining} minutes
                        </span>
                      </span>
                      &nbsp;&nbsp;•
                      <span className='ml-2 '><i className="fas fa-broadcast-tower text-red-500 fab-beat"></i> Streaming is active.</span>
                    </div>
                  )}


                </div>
              )}




              {!foundTerminal && (
                <div>
                  <br />
                  <br />
                </div>
              )}


              <div className='hidden bg-red-900 text-center text-white py-4 pb-10'>
                <i class="fas fa-handshake-slash text-5xl "></i>
                <h1 className='text-2xl font-bold '>Client Disconnection</h1>
                <p className='text-2xl px-4'>CTFGuide isn't able to communicate with your terminal correctly. Your session has been reset, please reload the page.</p>
              </div>
              {!foundTerminal && (
                <div className=" mx-auto text-center ">
                  {
                    challenge && !fetchingTerminal && !foundTerminal &&
                    <button
                      className="cursor-pointer rounded-lg bg-green-800 px-2 py-1 text-white hover:bg-green-700"
                      disabled={fetchingTerminal}
                      onClick={checkIfTerminalExists}
                    >
                      Launch Terminal
                    </button>
                  }
                  {fetchingTerminal && <span style={{ color: "white", fontSize: "25px" }}>{loadingMessage}<i className="fas fa-spinner fa-pulse"
                    style={{ color: "gray", fontSize: "25px" }}>
                  </i></span>
                  }
                  <p className='mt-4 text-white hidden' id="spinny"><i class="fas fa-spinner fa-spin"></i> <span id="termDebug"></span></p>
                </div>
              )}


              {foundTerminal ? (
                <embed
                  id="myembed"
                  className="h-1/2 w-full"
                  src={terminalUrl}
                ></embed>
              ) : (
                <p>Loading...</p>
              )}
            </div>

          </div>


        </div>
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
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0" >

              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >

                <Dialog.Panel className="border w-full max-w-6xl relative transform overflow-hidden rounded-lg shadow-lg shadow-neutral-800  bg-gradient-to-r from-neutral-900 to-black  px-4  text-left  transition-all ">
                  <div>


                    <div className="mt-3  sm:mt-5 w-full pb-14 px-10">
                      <h1 className='text-2xl mb-2 text-white text-center mt-12'>Welcome to your CTFGuide Lab enviroment!  </h1>
                      <p className='text-white'>
                        <b className='text-xl '> Introduction</b>
                        <br></br>

                        CTFGuide Labs are a safe enviroment for you to practice your skills in a real world enviroment.  When you're ready to start working on your assignment, click the green "Launch Terminal" button.  This will boot up a computer for you in the cloud. This can take around 30 seconds to a minute depending on the configuration.
                        <br></br>
                        <br></br>
                        <b className='text-xl '> Environment Rules</b>
                        <ul className='ml-10'>
                          <li>Modifying the .disregard directory will rest your session. This directory holds important files for your session to run.</li>
                          <li>Attempting to modify with any of our recording/streaming mechanisms will cause your session to reset.</li>
                          <li>Interfering with background tasks will result in a session reset.</li>
                          <li>Do not attempt to brute force or DOS any of the machines.</li>
                          <li>Do not attempt to attack CTFGuide infrastructure.</li>
                          <li>Long intensive jobs that aren't related to the challenge are prohibited.</li>
                          <li>Doing things that are obviously unrelated to the challenge will result in a warning and if it occurs again will result in a session reset.</li>
                        </ul>
                        <br></br>
                        We realize these rules may sound intimidating, but ideally if you just normally work on the problem you will not experience any issues.

                        <br></br>    <br></br>
                        <b className='text-xl text-white'> Transparency Notice</b>
                        <br></br>
                        CTFGuide will use AI to automatically grade your assignment. Your teacher has specified parameters for us to grade you on. We will only use footage from your terminal when making a decision. Your terminal is constantly talking with our servers.
                      </p>


                      <div className='mx-auto text-center mt-10'>
                        <button onClick={() => { setOpen(false) }} className='bg-blue-600 text-xl text-white px-2 py-1 rounded-lg text-center mx-auto'>Start Hacking!</button>
                      </div>
                    </div>


                  </div>

                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      <Transition.Root show={terminalPopup} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setTerminalPopup}>
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
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0" >

              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >

                <Dialog.Panel className="border w-full max-w-6xl relative transform overflow-hidden rounded-lg shadow-lg shadow-neutral-800  bg-gradient-to-r from-neutral-900 to-black  px-4  text-left  transition-all ">
                  <div>


                    <div className="mt-3  sm:mt-5 w-full pb-14 px-10">
                      <h1 className='text-2xl mb-2 text-white text-center mt-12'>
                        {
                          useDiffTerminal ? "Continuing with this challenge will delete your previous terminal."
                            : "Would you like to use your existing terminal or create a new one?"
                        }
                      </h1>

                      <div className='mx-auto text-center mt-10'>
                        {
                          !useDiffTerminal &&
                          <button onClick={() => {
                            setTerminalPopup(false);
                            fetchTerminal();
                          }} style={{ marginRight: "10px" }} className='bg-blue-600 text-xl text-white px-2 py-1 rounded-lg text-center mx-auto'>
                            Use Existing Terminal</button>
                        }

                        <button style={{ marginLeft: "10px" }} onClick={() => {
                          setTerminalPopup(false);
                          createTerminal(true);
                        }} className='bg-blue-600 text-xl text-white px-2 py-1 rounded-lg text-center mx-auto'>
                          {
                            useDiffTerminal ? "Continue" : "Create New Terminal"
                          }
                        </button>
                      </div>
                    </div>


                  </div>

                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>


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
