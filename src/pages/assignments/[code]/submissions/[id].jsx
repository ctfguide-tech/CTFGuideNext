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


  // fetch kana log
  useEffect(() => {
    ;(async function () {

        
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
            };
              
            fetch(`https://file-system-run-qi6ms4rtoa-ue.a.run.app/files/get/log?jwtToken=${localStorage.getItem('idToken')}&slug=fork_of_challenge_232`, requestOptions)
                .then(async response => {
                    // set file variable to the response
                    
                //    AsciinemaPlayer.create('', document.getElementById('demo'));
                
                     const AsciinemaPlayer = await import('asciinema-player')
                    AsciinemaPlayer.create({ data: response }, document.getElementById('demo'), {
                        // smaller font
                        fontSize: 12,

                    });


                })
                .then(result => console.log(result))
                .catch(error => console.log('error', error));
            })()

  //    AsciinemaPlayerLibrary.create(src, ref.current, asciinemaOptions)

    

  

  }, [])


  return (
    <>
      <Head>
        <title>Coming Soon - CTFGuide</title>
        <style>
          @import
          url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');

        </style>

        <link rel="stylesheet" type="text/css" href="../../../../asciinema-player.css" />

       
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



            <div className="">
     

                <div className='grid grid-cols-2 gap-x-8'>
                    <div>
                    <h1 className='text-white text-xl mb-2'>Session Recording</h1>
                <div className="border border-neutral-800" id="demo"> 

                        </div>
                
                    </div>
                    <div>
                    <h1 className='text-white text-xl mb-2'>Kana AI</h1>

               
                    </div>

    </div>
   
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
