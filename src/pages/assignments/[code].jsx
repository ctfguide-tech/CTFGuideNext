import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { ProgressCircle } from '@tremor/react';
import { MarkdownViewer } from '@/components/MarkdownViewer';
import { useEffect, useState } from 'react';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
export default function Slug() {
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
            <div className="grid h-full grid-cols-6 gap-x-8">
              <div className="col-span-2">
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

              <div className="col-span-4 h-60 bg-black px-4">
                <iframe
                  className="h-full w-full"
                  src="https://terminal.ctfguide.com/wetty/ssh/root"
                ></iframe>

                <p className="mt-6 font-semibold text-white">
                  STUDENT SUBMISSIONS
                </p>
                <hr className="rounded-lg border border-blue-600 bg-neutral-900" />
                <div className="mt-4 grid grid-cols-3 gap-x-2">
                  {submissions.length === 0 && 'No students in class...'}
                  {submissions.map((submission, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg bg-neutral-800 px-2 py-1 text-white"
                    >
                      <h1>
                        {submission.name}{' '}
                        {submission.submitted ? (
                          <i className="fas fa-check ml-2 text-green-500"></i>
                        ) : (
                          <i className="fas fa-clock  ml-2 text-red-400"></i>
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
