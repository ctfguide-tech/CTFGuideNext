import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { MarkdownViewer } from '@/components/MarkdownViewer';
import { useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClassroomNav from '@/components/groups/classroomNav';
import { useRouter } from 'next/router';
import { getAuth } from 'firebase/auth';
import Loader from '@/components/Loader';
import api from '@/utils/terminal-api';

const auth = getAuth();

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
export default function id() {

  // assignment stuff
  const [assignment, setAssignment] = useState(null);
  const [flagInput, setFlagInput] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [solved, setSolved] = useState(null);

  const [terminalPopup, setTerminalPopup] = useState(false);

  // challenge stuff
  const [hints, setHints] = useState([
    { message: '', penalty: '' },
    { message: '', penalty: '' },
    { message: '', penalty: '' },
  ]);

  function getColorForTime(minutes) {
    if (minutes >= 40) return 'text-green-400';
    if (minutes >= 10) return 'text-yellow-400';
    return 'text-red-400';
  }


  const [challenge, setChallenge] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingTerminal, setFetchingTerminal] = useState(false);

  // terminal stuff
  const [useDiffTerminal, setUseDiffTerminal] = useState(false);
  const [terminalUrl, setTerminalUrl] = useState('');
  const [password, setPassword] = useState('...');
  const [userName, setUserName] = useState('...');
  const [serviceName, setServiceName] = useState('');
  const [minutesRemaining, setMinutesRemaining] = useState(-1);
  const [foundTerminal, setFoundTerminal] = useState(false);
  const [code, setCode] = useState(0);

  const router = useRouter();

  const parseDate = (dateString) => {
    let dateObject = new Date(dateString);
    let month = dateObject.getMonth() + 1;
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

  const makePostRequest = async (url, body) => {
    try {
      let requestOptions = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      };
      const response = await fetch(url, requestOptions);
      const data = await response.json();
      return data;
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  const makeGetRequest = async (url,) => {
    try {
      let requestOptions = { method: 'GET', credentials: 'include' };
      const response = await fetch(url, requestOptions);
      const data = await response.json();
      return data;
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  const getAssignment = async () => {
    const params = window.location.href.split('/');
    if (params.length < 5) {
      return;
    }
    const url = `${baseUrl}/classroom-assignments/fetch-assignment/${params[5]}`;
    const data = await makeGetRequest(url);
    if (data && data.success) {
      const isAuth = await authenticate(data.body);
      if (isAuth) {
        setAssignment(data.body);
        getChallenge(data.body);
        await getSubmissions(data.body);
      } else {
        console.log('You are not apart of this class');
        window.location.href = '/groups';
      }
    }
  };

  const getSubmissions = async (assignment) => {
    const url = `${baseUrl}/submission/getSubmissionsForTeachers/${assignment.classroom.id}/${assignment.id}`;
    const data = await makeGetRequest(url);
    if (data && data.success) {
      setSubmissions(data.body);
      console.log('Submissions:', data.body);
    } else {
      console.log('Unable to get submissions');
    }
  };

  const authenticate = async (assignment) => {
    const url = `${baseUrl}/classroom/inClass/${assignment.classroom.id}`;
    const data = await makeGetRequest(url);
    return data.success;
  };

  const getChallenge = async (assignment) => {
    try {
      const url = `${baseUrl}/challenges/${assignment.challenge.id}?assignmentId=${assignment.id}`;
      const requestOptions = {
        method: 'GET',
        credentials: 'include'
      };
      const response = await fetch(url, requestOptions);
      const data = await response.json();
      if (data.success) {
        setChallenge(data.body);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const createTerminal = async () => {
    if(!challenge) return;
    setFetchingTerminal(true);
    const token = auth.currentUser.accessToken;
    const data = await api.buildTerminal(challenge, token);
    if(data) {
      setPassword(data.password);
      setServiceName(data.serviceName);
      setTerminalUrl(data.url);
      setUserName(data.userName);
      setMinutesRemaining(data.minutesRemaining);
      await getTerminalStatus(data.id);
    } else {
      toast.error("Unable to create the terminal, please try again");
      setFetchingTerminal(false);
    }
  };

  const fetchTerminal = async () => {
    if(!challenge) return;
    const token = auth.currentUser.accessToken;
    setFetchingTerminal(true);
    const data = await api.checkUserTerminal(token, challenge.id);
    if(data !== null) {
      setPassword(data.password);
      setServiceName(data.serviceName);
      setTerminalUrl(data.url);
      setUserName(data.userName);
      setMinutesRemaining(data.minutesRemaining);
      console.log('Terminal data ID:', data.id);
      console.log('Terminal url:', data.url);
      await getTerminalStatus(data.id);
    } else {
      await createTerminal();
    }
  };

  const getTerminalStatus = async (id) => {
    setFetchingTerminal(true);
    if(!foundTerminal) {
      const isActive = await api.getStatus(id);
      if(isActive) {
        setFoundTerminal(true);
        setFetchingTerminal(false);
      } else {
        setTimeout(async () => {
          await getTerminalStatus(id);
        }, 3000);
      }
    }
  };

  useEffect(() => {
    if (assignment === null) {
      getAssignment();
    }
  }, []);

  const checkFlag = () => {
    if (assignment && flagInput === assignment.solution.keyword) {
      setSolved(true);
      toast.success('Flag is Correct, Good Job!');
    } else {
      toast.error('Flag is incorrct');
      setSolved(false);
    }
  };

  const showHint = async (i) => {
    const url = `${baseUrl}/challenges/hints-update`;
    const body = {
      hintsUsed: i,
      challengeId: assignment.challenge.id,
    };
    const data = await makePostRequest(url, body);
    if (data && data.success) {
      let tmp = [...hints];
      tmp[i].message = assignment.challenge.hints[i].message;
      tmp[i].penalty =
        '(-' + assignment.challenge.hints[i].penalty + ') points';
      setHints(tmp);
    } else {
      console.log('problem when feching hints');
    }
  };

  const submitAssignment = async () => {
    setLoading(true);
    const params = window.location.href.split('/');
    const url = `${baseUrl}/submission/create`;

    const body = {
      solved: flagInput === assignment.solution.keyword,
      classroomId: assignment.classroomId,
      assignmentId: parseInt(params[5]),
      keyword: flagInput,
      challengeId: assignment.challengeId,
      totalPoints: assignment.totalPoints,
      hints: assignment.challenge.hints,
    };

    const data = await makePostRequest(url, body);
    if (data && data.success) {
      toast.success('Assignment has been submitted');
      setSubmitted(true);
    }

    setLoading(false);
  };

  const routeToSubmission = (id) => {
    router.replace(`/assignments/${assignment.id}/submissions/${id}`);
  };

  const checkIfTerminalExists = async () => {
    const token = auth.currentUser.accessToken;
    if(!challenge || !token) return;
    const data = await api.checkUserTerminal(token, challenge.id);
    if (data !== null) {
      setCode(data.id);
      if(data.challengeID !== challenge.id) {
        setUseDiffTerminal(true);
        setTerminalPopup(true);
      } else {
        setPassword(data.password);
        setTerminalUrl(data.url);
        setServiceName(data.serviceName);
        setUserName(data.userName);
        setMinutesRemaining(data.minutesRemaining);
        await getTerminalStatus(data.id);
      }
    } else {
      await createTerminal();
    }
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

      {assignment && (
      <div className='w-full mx-auto bg-neutral-800 px-4  animate__animated animate__fadeIn'>
        <div className='max-w-7xl mx-auto p-1'>
       
                  <ClassroomNav classCode={assignment.classroom.classCode} />
             
                
                </div>  
                </div>
   )}
                
      <div className=" min-h-screen max-w-7xl mx-auto animate__animated animate__fadeIn ">
        <div className="mx-auto">
          <a
            href="/groups/122ctfguide"
            className="hidden text-neutral-200 hover:text-neutral-500"
          >
            <i className="fas fa-long-arrow-alt-left"></i> Return Home
          </a>

          <div className="w-full  px-10 py-4 ">
            <div className="mx-auto ">
            <div className="flex items-center justify-center text-white">
              <div>
                <h1 className="text-3xl font-semibold text-white">
                  {assignment && assignment.name}{' '}
                </h1>
                Due Date: {assignment && parseDate(assignment.dueDate)}{' '}
              </div>
              <div className="ml-auto cursor-pointer">
                <a
                  onClick={() =>
                    router.push(`/assignments/student/${assignment.id}?former=teacher`)
                  }
                  className="cursor-pointer rounded-lg bg-white hover:bg-slate-100 px-4 py-1 font-semibold text-neutral-600"
                >
                 <i className="far fa-eye"></i> View as Student
                </a>

                <a
                  onClick={() => {
                      if(assignment && assignment.classroom) {
                        router.push(`/groups/${assignment.classroom.classCode}/edit-assignment/${assignment.id}`)
                      }
                    }
                  }
                  className="ml-2 cursor-pointer rounded-lg border border-white  hover:bg-neutral-800 px-4  py-1 font-semibold text-white"
                >
               <i className="far fa-edit"></i>   Edit Assignment
                </a>
              </div>
            </div>
            </div>
          </div>
          

          <div className="mx-auto mt-4  px-10 ">

          <p className=" font-semibold text-white">
                  STUDENT SUBMISSIONS
                </p>
                <hr className="rounded-lg border border-blue-600 bg-neutral-900" />
                <div className="mt-4 grid w-full grid-cols-1  gap-x-2">
                  {submissions.length === 0 && (
                    <div style={{ color: 'white' }}>
                      No students have completed this assignment yet.
                    </div>
                  )}
                  {submissions.map((submission, idx) => (
                    <div
                      key={idx}
                      className="cursor-pointer rounded-lg bg-neutral-800 px-4 py-3 text-white hover:bg-neutral-800/40"
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

       

            <div className="grid h-full grid-cols-6 gap-x-8 mt-10">
              <div className="col-span-2">
                <p className="mt-2 font-semibold text-white">FLAG SUBMISSION</p>
                <hr className="rounded-lg border border-blue-600 bg-neutral-900" />

                <input
                  placeholder="Think you got the flag? Enter it here!"
                  className="mt-4 w-full cursor-pointer rounded-lg border border-neutral-800/50 bg-neutral-800/50 px-4 py-1 text-white hover:bg-neutral-700/10"
                  onChange={(e) => setFlagInput(e.target.value)}
                  value={flagInput}
                ></input>
                <button
                  onClick={checkFlag}
                  className="mt-3 rounded-lg bg-green-800 px-2 py-1 text-white hover:bg-green-700"
                >
                  Check Flag
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
                      }}
                    >
                      <div>
                        <p className="text-white">
                          <span className="text-sm">
                            Hint {idx + 1}: {hint.message}
                          </span>
                        </p>
                      </div>
                      <span className="mt-1 text-sm text-white">
                        {assignment && assignment.challenge.hints[idx].penalty}{' '}
                        points
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="col-span-4   ">

                <div className="mx-auto h-full bg-black px-4 pb-60 ">
                  {userName && (
                    <div className="hint mb-2 text-gray-400 py-4">
                      <span className="font-semibold text-white">
                        Login as <span  id="uname"  onClick={() => {
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


                        } className="text-yellow-400 cursor-pointer">{userName}</span> using the password <span className="text-yellow-400 cursor-pointer" id="upass"  onClick={() => {
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
                        <div className="float-right ml-auto flex cursor-pointer ">
                          <span style={{ cursor: 'pointer' }} className="text-gray-300 hover:bg-black">
                            Container will stop in: &nbsp;
                            <span className={`font-semibold ${getColorForTime(minutesRemaining)}`}>
                              {minutesRemaining} minutes
                            </span>
                          </span>


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
                      { fetchingTerminal && <span><i className="fas fa-spinner fa-pulse"
                        style={{color: "gray", fontSize: "25px"}}>
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


                <div>
                <p className="mt-12 font-semibold text-white">ASSIGNMENT DESCRIPTION</p>
                <hr className="rounded-lg border border-blue-600 bg-neutral-900 " />
            <MarkdownViewer
              className="text-white"
              content={assignment && assignment.description}
            />
            
            </div>
            
              </div>

            </div>
          </div>
        </div>
      </div>
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
                          :"Would you like to use your existing terminal or create a new one?"
                        }
                        </h1>

                      <div className='mx-auto text-center mt-10'>
                      {
                        !useDiffTerminal && 
                        <button onClick={() => {
                          setTerminalPopup(false);
                          fetchTerminal();
                        }} style={{marginRight: "10px"}} className='bg-blue-600 text-xl text-white px-2 py-1 rounded-lg text-center mx-auto'>
                          Use Existing Terminal</button>
                      }

                        <button style={{marginLeft: "10px"}} onClick={() => {
                          setTerminalPopup(false);
                          createTerminal();
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
