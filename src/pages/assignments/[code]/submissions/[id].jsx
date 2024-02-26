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
  const [player, setPlayer] = useState(null);
  const [kanaLog, setKanaLog] = useState([]);

  // fetch kana log
  const fetchKanaLog = async (password, challengeId) => {
    try {
      const AsciinemaPlayer = await import('asciinema-player');

      var requestOptions = {
        method: 'GET',
        redirect: 'follow',
      };
      fetch(
        `${process.env.NEXT_PUBLIC_TERM_URL}/files/get/log?password=${password}&id=${challengeId}`,
        requestOptions
      )
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
    } catch(err) {
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
      if(!jwt) {
        console.log("User is not authenticated");
        return;
      }
      const uid = user.uid;
      let url = `${process.env.NEXT_PUBLIC_TERM_URL}get/json?jwtToken=${jwt}&assignmentID=${assignment.id}&uid=${uid}`;
      let requestOptions = { method: 'GET' };
      let response = await fetch(url, requestOptions);
      if(!response.ok) {
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

      if(!data) {
        console.log('Error parsing kana log');
        return;
      }

      let events = data.events;

      for(let i = 0; i < events.length; i++) {
        events[i].seconds = convert(events[i].timestamp);
      }

      setKanaLog(events); // []
    } catch(err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if(!loading) {
      getJson(submission.terminalIdentifier);
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
        let adjustedGrade = calculateAdjustedGrade(data.body);
        data.body.grade = adjustedGrade;
        data.body.grade = Math.round(data.body.grade * 100) / 100;
        setSubmission(data.body);
        const date = new Date(data.body.createdAt);
        setFormattedDate(date.toLocaleString());
        await fetchKanaLog(data.body.terminalIdentifier, data.body.assignment.challengeId);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const calculateAdjustedGrade = (dataBody) => {
    if (dataBody.isLate) {
      return dataBody.grade - (dataBody.grade * dataBody.assignment.latePenalty / 100);
    }
    return dataBody.grade;
  }

  useEffect(() => {
    fetchSubmission();
  }, []);


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
          <a
            href="/groups/122ctfguide"
            className="hidden text-neutral-200 hover:text-neutral-500"
          >
            <i className="fas fa-long-arrow-alt-left"></i> Return Home
          </a>

          <div className="w-full bg-gradient-to-r from-blue-800 via-blue-900 to-blue-800 px-4 py-4 ">
            <div className="mx-auto max-w-6xl">
              <div className="flex">
                <div>
                  <h1 className="text-3xl font-semibold text-white">
                    {
                      submission && assignment ? <span>{submission.user.username}'s Submission</span>
                      : <span>... Submission</span>
                    }
                  </h1>

                  <h1 className="text-white">Submitted at {formattedDate}</h1>
                </div>

                <div className="ml-auto">
                  <div className="rounded-md bg-white px-3 py-1 text-center gap-y-0">
                    <h1 className="text-4xl font-bold text-blue-600 text-center mb-0 pb-0 ">
                      { submission ? submission.grade : '00' }%
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mx-auto mt-4 max-w-6xl">
            <div className="">
              <div className="grid grid-cols-4 gap-x-8">
                <div className="col-span-3">
                  <div
                    className="h-1/2 w-full border  border-neutral-800"
                    id="demo"
                  ></div>
                </div>
                <div>
                  <ol className="relative border-s border-neutral-200 dark:border-neutral-700">

                    {
                      kanaLog && kanaLog.map((item, index) => {
                        return (
                          <li
                            id={`seek${item.seconds}`}
                            key={index}
                            onClick={() => seekToTime(item.seconds)}
                            className="clickable cursor-pointer mb-10 ms-4 p-4 hover:bg-neutral-800"
                          >
                            <div className="absolute -start-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-neutral-200 dark:border-neutral-900 dark:bg-neutral-700"></div>
                            <time className="mb-1 text-sm font-normal leading-none text-neutral-400 dark:text-neutral-500">
                              {item.timestamp} 
                            </time>
                            <h3 className="text-md font-semibold text-neutral-900 dark:text-white">
                              {item.header}
                            </h3>
                            <p className="text-base font-normal text-neutral-500 dark:text-neutral-400">
                              {item.event}
                            </p>
                          </li>
                        )
                      })
                    }

                  </ol>
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
