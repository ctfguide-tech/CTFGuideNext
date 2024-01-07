import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { ProgressCircle } from '@tremor/react';
import { MarkdownViewer } from '@/components/MarkdownViewer';
import { useEffect, useState } from 'react';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
export default function Slug() {
  // assignment stuff
  const [assignment, setAssignment] = useState(null);
  const [flagInput, setFlagInput] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [solved, setSolved] = useState(null);

  // challenge stuff
  const [hints, setHints] = useState([
    { message: '', penalty: '' },
    { message: '', penalty: '' },
    { message: '', penalty: '' },
  ]);
  const [challenge, setChallenge] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // terminal stuff
  const [terminalUrl, setTerminalUrl] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [minutesRemaining, setMinutesRemaining] = useState(-1);
  const [foundTerminal, setFoundTerminal] = useState(false);

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

  const makePostRequest = async (url, auth, body) => {
    try {
      let requestOptions = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      };
      if (auth) {
        const token = localStorage.getItem('idToken');
        requestOptions.headers.Authorization = 'Bearer ' + token;
      }
      const response = await fetch(url, requestOptions);
      const data = await response.json();
      return data;
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  const makeGetRequest = async (url, auth) => {
    try {
      let requestOptions = { method: 'GET' };
      if (auth) {
        const token = localStorage.getItem('idToken');
        requestOptions.headers = { Authorization: 'Bearer ' + token };
      }
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
    const url = `${baseUrl}/classroom-assignments/fetch-assignment/${params[4]}`;
    const data = await makeGetRequest(url, false);
    if (data && data.success) {
      const isAuth = await authenticate(data.body);
      if (isAuth) {
        setAssignment(data.body);
        await getSubmissions(data.body);
      } else {
        console.log('You are not apart of this class');
        window.location.href = '/groups';
      }
    }
  };

  const getSubmissions = async (assignment) => {
    const url = `${baseUrl}/submission/getSubmissionsForTeachers/${assignment.classroom.id}/${assignment.id}`;
    const data = await makeGetRequest(url, false);
    if (data && data.success) {
      setSubmissions(data.body);
    } else {
      console.log('Unable to get submissions');
    }
  };

  const authenticate = async (assignment) => {
    const uid = localStorage.getItem('uid');
    const url = `${baseUrl}/classroom/inClass/${uid}/${assignment.classroom.id}`;
    const data = await makeGetRequest(url, false);
    return data.success;
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
      if (data.success) {
        setChallenge(data.body);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const createTerminal = async () => {
    try {
      let min = 10000;
      let max = 99999;

      const code = Math.floor(Math.random() * (max - min + 1)) + min;
      const url = process.env.NEXT_PUBLIC_TERM_URL + 'Terminal/createTerminal';

      const body = {
        jwtToken: localStorage.getItem('idToken'),
        TerminalGroupName: 'schell-class-session',
        TerminalID: code,
        classID: 'psu101',
        organizationName: 'PSU',
        userID: localStorage.getItem('username'),
        slug: challenge.slug,
      };

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      };

      const response = await fetch(url, requestOptions);
      const data = await response.json();

      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchTerminal = async () => {
    try {
      const token = localStorage.getItem('idToken');
      const url = `${process.env.NEXT_PUBLIC_TERM_URL}Terminal/getAllUserTerminals?jwtToken=${token}`;
      const requestOptions = {
        method: 'GET',
        redirect: 'follow',
      };

      const response = await fetch(url, requestOptions);
      const data = await response.json();

      console.log(data);

      if (data.length > 0) {
        const { password, serviceName, url, userName, minutesRemaining, id } =
          data[0];

        setPassword(password);
        setServiceName(serviceName);
        setTerminalUrl(url);
        setUserName(userName);
        setMinutesRemaining(minutesRemaining);

        await getTerminalStatus(id);
      } else {
        console.log('No termainl... creating a new one');
        await createTerminal();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getTerminalStatus = async (id) => {
    if (!foundTerminal) {
      const username = localStorage.getItem('username');
      const url = `${process.env.NEXT_PUBLIC_TERM_URL}Terminal/getTerminalStatus?userID=${username}&terminalID=${id}`;
      const response = await fetch(url, { method: 'GET' });
      if (response.ok) {
        setFoundTerminal(true);
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
    } else if (!challenge) {
      getChallenge();
    }

    fetchTerminal();
  }, [assignment]);

  const checkFlag = () => {
    if (assignment && flagInput === assignment.solution.keyword) {
      setSolved(true);
    } else {
      setSolved(false);
    }
  };

  const showHint = async (i) => {
    const url = `${baseUrl}/challenges/hints-update`;
    const userId = localStorage.getItem('uid');
    const body = {
      hintsUsed: i,
      uid: userId,
      challengeId: assignment.challenge.id,
    };
    const data = await makePostRequest(url, false, body);
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
    const userId = localStorage.getItem('uid');
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

    const data = await makePostRequest(url, true, body);
    if (data && data.success) {
      setSubmitted(true);
    }

    setLoading(false);
  };

  const routeToSubmission = (id) => {
    window.location.replace(`/assignments/${assignment.id}/submissions/${id}`);
  };

  console.log(submissions);

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
        <div className="mx-auto mt-4">
          <a
            href="/groups/122ctfguide"
            className="hidden text-neutral-200 hover:text-neutral-500"
          >
            <i className="fas fa-long-arrow-alt-left"></i> Return Home
          </a>

          <div className="w-full bg-gradient-to-r from-blue-800 via-blue-900 to-blue-800 px-4 py-4 ">
            <div className="mx-auto max-w-6xl">
              <h1 className="text-3xl font-semibold text-white">
                {assignment && assignment.name}{' '}
              </h1>

              <h1 className="text-white">
                Due Date: {assignment && parseDate(assignment.dueDate)}{' '}
              </h1>
            </div>
          </div>

          <div className="mx-auto mt-4 max-w-6xl">
            <h1 className="text-xl font-semibold text-white">
              Assignment Description
            </h1>
            <MarkdownViewer
              className="text-white"
              content={assignment && assignment.description}
            />

            <div className="grid h-full grid-cols-6 gap-x-8">
              <div className="col-span-2">
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
                      className="mb-2 mt-3 w-full border-l-2 border-yellow-600 bg-[#212121] px-4 text-lg opacity-0 transition-opacity transition-opacity duration-150 duration-75 hover:opacity-100"
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

              <div className="col-span-4 h-60 bg-black px-4">
                <div className="hint mb-2 text-gray-400">
                  <span className="font-semibold text-white   ">
                    {' '}
                    <span className="text-blue-500"></span>
                  </span>{' '}
                  Login as <span className="text-yellow-400">{userName}</span>{' '}
                  using the password{' '}
                  <span className="text-yellow-400">{password}</span>
                  <div className="float-right ml-auto flex  cursor-pointer">
                    <span
                      style={{ cursor: 'pointer' }}
                      className=" text-gray-300 hover:bg-black"
                    >
                      Container will stop in: {minutesRemaining} minutes
                    </span>
                  </div>
                </div>
                <iframe
                  className="h-full w-full"
                  src={
                    (foundTerminal && terminalUrl) ||
                    'https://terminal.ctfguide.com/wetty/ssh/root'
                  }
                ></iframe>

                <p className="font-semibold text-white">STUDENT SUBMISSIONS</p>
                <hr className="rounded-lg border border-blue-600 bg-neutral-900" />
                <div className="mt-4 grid w-full grid-cols-1  gap-x-2">
                  {submissions.length === 0 && (
                    <div style={{ color: 'white' }}>
                      No Students in class...
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

      <Footer />
    </>
  );
}
