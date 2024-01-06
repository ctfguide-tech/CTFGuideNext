import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Button } from '@/components/Button';
import { MarkdownViewer } from '@/components/MarkdownViewer';
import { useEffect, useState } from 'react';

export default function ComingSoon() {
    const [assignment, setAssignment] = useState(null);
    const [flagInput, setFlagInput] = useState('');
    const [submissions, setSubmissions] = useState([]);
    const [solved, setSolved] = useState(null);
    const [hints, setHints] = useState([
      { message: '', penalty: '' },
      { message: '', penalty: '' },
      { message: '', penalty: '' },
    ]);
  
    const [challenge, setChallenge] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
  
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
  
    const getAssignment = async () => {
      try {
        console.log('Getting the assignments');
        const params = window.location.href.split('/');
        if (params.length < 5) {
          return;
        }
        const url = `${baseUrl}/classroom-assignments/fetch-assignment/${params[4]}`;
        const requestOptions = { method: 'GET' };
        const response = await fetch(url, requestOptions);
        const data = await response.json();
        if (data.success) {
          const isAuth = await authenticate(data.body);
          if (isAuth) {
            setAssignment(data.body);
            await getSubmissions(data.body);
          } else {
            console.log('You are not apart of this class');
            window.location.href = '/groups';
          }
        } else {
          console.log(data.message);
        }
      } catch (err) {
        console.log(err);
      }
    };
  
    const getSubmissions = async (assignment) => {
      try {
        console.log('getting the who submitted what for teacher view');
        const url = `${baseUrl}/submission/getSubmissionsForTeachers/${assignment.classroom.id}/${assignment.id}`;
        const requestOptions = { method: 'GET' };
        const response = await fetch(url, requestOptions);
        const data = await response.json();
        if (data.success) {
          setSubmissions(data.body);
        } else {
          console.log(data.message);
        }
      } catch (err) {
        console.log(err);
      }
    };
  
    const authenticate = async (assignment) => {
      try {
        console.log('authenticating user');
        const uid = localStorage.getItem('uid');
        const url = `${baseUrl}/classroom/inClass/${uid}/${assignment.classroom.id}`;
        const response = await fetch(url, { method: 'GET' });
        const data = await response.json();
        console.log(data);
        if (data.success) {
          return true;
        }
      } catch (err) {
        console.log(err);
      }
      return false;
    };
  
    const getChallenge = async () => {
      try {
        console.log('getting the challenge');
        const token = localStorage.getItem('idToken');
        const url = `${baseUrl}/challenges/${assignment.challenge.slug}?assignmentId=${assignment.id}`;
        const requestOptions = {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + token,
          },
        };
        const response = await fetch(url, requestOptions);
        const data = await response.json();
        console.log(data);
        if (data.success) {
          setChallenge(data.body);
        }
      } catch (err) {
        console.log(err);
      }
    };
  
    useEffect(() => {
      if (assignment === null) {
        getAssignment();
      } else if (!challenge) {
        getChallenge();
      }
      // spin up the terminal
      // first we get the assignment
      // then we auth
      // then fetch submissions if this is teacherview
      // we need to fetch the file name for "associated files"
      // on hints pressed make a call to the database to update the analytic that got created when user view challenge
    }, [assignment]);
  
    const checkFlag = () => {
      if (assignment && flagInput === assignment.solution.keyword) {
        setSolved(true);
      } else {
        setSolved(false);
      }
    };
  
    const showHint = async (i) => {
      try {
        const url = `${baseUrl}/challenges/hints-update`;
        const userId = localStorage.getItem('uid');
  
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            hintsUsed: i,
            uid: userId,
            challengeId: assignment.challenge.id,
          }),
        };
  
        const response = await fetch(url, requestOptions);
        const data = await response.json();
        console.log(data);
        if (data.success) {
          let tmp = [...hints];
          tmp[i].message = assignment.challenge.hints[i].message;
          tmp[i].penalty =
            '(-' + assignment.challenge.hints[i].penalty + ') points';
          setHints(tmp);
        }
      } catch (err) {
        console.log(err);
      }
    };
  
    const submitAssignment = async () => {
      try {
        setLoading(true);
        const params = window.location.href.split('/');
        const userId = localStorage.getItem('uid');
        const token = localStorage.getItem('idToken');
        const url = `${baseUrl}/submission/create`;
  
        const body = {
          solved: flagInput === assignment.solution.keyword,
          userId: userId,
          classroomId: assignment.classroomId,
          assignmentId: parseInt(params[4]),
          keyword: flagInput,
          challengeId: assignment.challengeId,
          totalPoints: assignment.totalPoints,
          hints: assignment.challenge.hints,
        };
  
        const requestOptions = {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
        };
        const response = await fetch(url, requestOptions);
        const data = await response.json();
        setSubmitted(true);
        console.log(data);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
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
      <div style={{}} className="mx-auto h-full overflow-hidden">
      <div className="my-auto ml-4 flex px-4 py-1 bg-neutral-900 pb-4">
        <h1 className="my-auto my-auto mt-3 flex text-md text-white">
          Your Assignment
         
        </h1>

        <div className="my-auto ml-auto mt-3 flex">
        
          <a
            href="../"
            className="my-auto my-auto ml-4 text-md rounded-sm  bg-red-600 px-4  text-white"
          >
            Exit Lab
          </a>

          <a
            href="../"
            className="my-auto my-auto ml-4 rounded-sm text-md bg-yellow-600 px-4  text-white"
          >
            Restart Container
          </a>
        </div>
      </div>
      <div className="grid h-screen max-h-screen resize-x grid-cols-2 gap-0 md:grid-cols-2 lg:grid-cols-2">
        <div
          id="1"
          style={{ backgroundColor: '#212121' }}
          className="h-100 resize-x px-8 py-4 overflow-scroll"
        >  <div className="mx-auto mt-4 max-w-6xl">
        <div className="">
          <div className="">
            <h1 className="text-xl font-semibold text-white">
              Assignment Description
            </h1>
            <MarkdownViewer
              className="text-white"
              content={assignment && assignment.description}
            />

            <b className="text-white">ASSOCIATED FILES</b>
            <hr className="rounded-lg border border-blue-600 bg-neutral-900" />
            <div className="mt-4 cursor-pointer rounded-lg border border-neutral-800/50 bg-neutral-800/50 px-4 py-1 text-white hover:bg-neutral-700/10">
              <h1 className="text-md">
                <i className="fas fa-file-archive mr-2 text-white"></i>{' '}
                this_is_flag.zip
              </h1>
            </div>

            <p className="mt-6 font-semibold text-white">FLAG SUBMISSION</p>
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
            <hr className="rounded-lg border border-blue-600 bg-neutral-900" />
            {hints.map((hint, idx) => {
              return (
                <div
                  className="mb-2 mt-3 w-full border-l-2 border-yellow-600 bg-[#212121] px-4 text-lg"
                  enter="transition-opacity duration-75"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition-opacity duration-150"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
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
                  <span style={{ color: 'white' }}>
                    {assignment && assignment.challenge.hints[idx].penalty}{' '}
                    points
                  </span>
                </div>
              );
            })}
          </div>

   
          <button
            onClick={submitAssignment}
            className="mt-3 rounded-lg bg-green-800 px-2 py-1 text-white hover:bg-green-700"
            disabled={loading}
          >
            {submitted ? 'Resubmit' : 'Submit'}
          </button>
        </div>
      </div>
      </div>

        </div>
          </div>
          <div className="fixed bottom-0 left-0 right-0 mb-5">
            <div className="mt-4 flex">
              <div className="mx-auto flex grid  grid-cols-2  rounded-lg bg-neutral-900 text-center">
                <div className="w-full rounded-l-lg py-4 px-10 hover:bg-neutral-700">
                  <a className="∂ text-white">
                    <i class="fas fa-chevron-left"></i>
                  </a>
                </div>
                <div
                  onClick={() => {
                    document.getElementById('2').classList.remove('hidden');
                    document.getElementById('1').classList.add('hidden');
                  }}
                  className="w-full rounded-r-lg  py-4 px-10 hover:bg-neutral-700"
                >
                  <p className="ml-4 text-white">
                    <i class="fas fa-chevron-right"></i>
                  </p>
                </div>
              </div>
            </div>
          </div>


        <div
          id="2"
          style={{ backgroundColor: '#212121' }}
          className="hidden h-screen max-h-screen overflow-y-auto px-8 py-4  "
        >
          <h1 className="text-2xl font-bold text-white">
            I spy with my little eyes
          </h1>
          <p className="text-white text-blue-500">@pranavramesh @ray</p>
          <h1 className="mt-4 text-xl font-semibold text-white">
            Understanding the payload{' '}
          </h1>
          <p className="text-white">
            It looks like this payload is just a malicious node.js file.
            Strange. Usually, payloads are super hidden - but in this case we
            have access to the actual payload file.
          </p>
          <br></br>Let's go ahead and take a look at the code of the payload.
          <div
            className="mt-4 bg-black p-4 text-white"
            style={{ fontFamily: 'Arial' }}
          >
            <p>
              {'no'}@ctfguide:~${' '}
              <span className="text-yellow-400">nano hackerman.js</span>
            </p>
          </div>
          <br></br>
          <p className="text-white">
            The code for this payload seems relatively simple.
          </p>
          <div
            className="mt-4 bg-black p-4 text-white"
            style={{ fontFamily: 'Arial' }}
          >
            <p>
              var colors = ["red", "blue", "green", "yellow", "orange",
              "purple"];<br></br>
              var color = colors[Math.floor(Math.random() * colors.length)];
              <br></br>
              console.log("I spy something " + color);<br></br>
              var key = colors[1] + colors[2] + 21;<br></br>
              // console.log(key)
            </p>
          </div>
          <br></br>
          <p className="text-white">Are you seeing what I'm seeing?!</p>
          <div
            className="mt-4 bg-black p-4 text-white"
            style={{ fontFamily: 'Arial' }}
          >
            <p>
              var key = colors[1] + colors[2] + 21;<br></br>
              // console.log(key)
            </p>
          </div>
          <p className="mt-4 text-white">
            It looks like the decryption key is just the second color + the
            third color + "21". Looking at the array of colors it seems like the
            key is bluegreen21.
          </p>
          {/* boottom footer */}
          <div className="fixed bottom-0 left-0 right-0 mb-5">
            <div className="mt-4 flex">
              <div className="mx-auto flex grid  grid-cols-2  rounded-lg bg-neutral-900 text-center">
                <div
                  className="h-full w-full rounded-l-lg py-4 px-10 hover:bg-neutral-700"
                  onClick={() => {
                    document.getElementById('1').classList.remove('hidden');
                    document.getElementById('2').classList.add('hidden');
                  }}
                >
                  <a className="∂ text-white">
                    <i class="fas fa-chevron-left"></i>
                  </a>
                </div>
                <div
                  className="w-full rounded-r-lg  py-4 px-10 hover:bg-neutral-700"
                  onClick={() => {
                    document.getElementById('3').classList.remove('hidden');
                    document.getElementById('2').classList.add('hidden');
                  }}
                >
                  <p className="ml-4 text-white">
                    <i class="fas fa-chevron-right"></i>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          id="3"
          style={{ backgroundColor: '#212121' }}
          className=" h-100 hidden resize-x px-4 py-4"
        >
          <h1 className="mx-auto mt-4 mt-20 text-center text-6xl font-semibold text-white">
            Nice work!
          </h1>
          <h1 className="mx-auto mt-4 text-center text-xl font-semibold text-white ">
            You've finished this lesson.
          </h1>
  
          <div></div>
        </div>
        <div className="max-h-screen resize-x overflow-hidden bg-black">
          <div className="flex bg-black text-sm text-white">
            <p className="px-2 py-1">
              <span className="text-green-400">◉</span> Connected to
              terminal.ctfguide.com
            </p>
            <div className="ml-auto flex px-2 py-1">
              <p>No time limit!</p>
            </div>
          </div>
          <iframe
            id="terminal"
            className="w-full px-2"
            height="500"
            src="https://terminal.ctfguide.com/wetty/ssh/root?"
          ></iframe>
        </div>

        <div
          style={{ backgroundColor: '#212121' }}
          className="hidden px-4 py-4"
        >
          <h1 className="text-2xl font-bold text-white">Developer Tools</h1>

          <p className="text-white">Terminal Keylogger</p>
          <textarea id="logger" className="mt-4 w-full bg-black text-blue-500">
            ctfguide login:
          </textarea>

          <p className="text-white">External Testing Client</p>
          <textarea id="logger" className="mt-4 w-full bg-black text-blue-500">
            ctfguide login:
          </textarea>
        </div>
   

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">

        </div>
    </>
  );
}
