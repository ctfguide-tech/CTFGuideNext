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
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export default function id() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

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

  const [submission, setSubmission] = useState(null);
  const [user, setUser] = useState(null);
  const [formattedDate, setFormattedDate] = useState(null);

  // fetch kana log
  useEffect(() => {
    (async function () {
      const AsciinemaPlayer = await import('asciinema-player');
      let player;
      var requestOptions = {
        method: 'GET',
        redirect: 'follow',
      };
      var password = 'bS<P5>vh';
      fetch(
        `https://gist.githubusercontent.com/Laphatize/67b0d1ace949a8f64d05f187d6d26d35/raw/50e8d97cebf3f33e0ff73b4ec315f4d81263ad83/kana.cast`,
        requestOptions
      )
        .then(async (response) => {
          // set file variable to the response
          //    AsciinemaPlayer.create('', document.getElementById('demo'));
          player = AsciinemaPlayer.create(
            { data: response },
            document.getElementById('demo'),
            {
              fit: false,
              terminalFontSize: 30,
            }
          );
        })
        .then((result) => console.log(result))
        .catch((error) => console.log('error', error));

      function seekToTime(seconds) {
        player.seek(seconds).then(() => {
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
    })();

    //    AsciinemaPlayerLibrary.create(src, ref.current, asciinemaOptions)
  }, []);

  const fetchSubmission = async () => {
    try {
      const id = window.location.href.split('/')[6];
      const url = `${baseUrl}/submission/submission/${id}`;
      const data = await request(url, 'GET', null);
      if (data && data.success) {
        setAssignment(data.body.assignment);
        setUser(data.body.user);
        setSubmission(data.body);
        const date = new Date(data.body.createdAt);
        setFormattedDate(date.toLocaleString());
      }
      console.log(data.body);
    } catch (err) {
      console.log(err);
    }
  };

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
                    {(assignment && assignment.name) || "Pranav's Submission"}{' '}
                  </h1>

                  <h1 className="text-white">Submitted at {formattedDate}</h1>
                </div>

                <div className="ml-auto">
                  <div className="rounded-md bg-white px-3 py-1 text-center gap-y-0">
                    <h1 className="text-4xl font-bold text-blue-600 text-center mb-0 pb-0 ">
               { submission && assignment && (submission.grade / assignment.totalPoints * 100)}%</h1>
                    
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
                    <li
                      id="seek0"
                      onclick="seekToTime(0)"
                      className="clickable cursor-pointer mb-10 ms-4 p-4 hover:bg-neutral-800"
                    >
                      <div className="absolute -start-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-neutral-200 dark:border-neutral-900 dark:bg-neutral-700"></div>
                      <time className="mb-1 text-sm font-normal leading-none text-neutral-400 dark:text-neutral-500">
                        00:00
                      </time>
                      <h3 className="text-md font-semibold text-neutral-900 dark:text-white">
                        Initial Terminal Access
                      </h3>
                      <p className="text-base font-normal text-neutral-500 dark:text-neutral-400">
                        The student accessed the terminal and executed a 'clear'
                        command, resetting the terminal view.
                      </p>
                    </li>

                    <li
                      id="seek1"
                      onclick="seekToTime(1)"
                      className="clickable cursor-pointer mb-10 ms-4 p-4 hover:bg-neutral-800"
                    >
                      <div className="absolute -start-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-neutral-200 dark:border-neutral-900 dark:bg-neutral-700"></div>
                      <time className="mb-1 text-sm font-normal leading-none text-neutral-400 dark:text-neutral-500">
                        00:01
                      </time>
                      <h3 className="text-md font-semibold text-green-500 ">
                        Executing 'ls' Command
                      </h3>
                      <p className="text-base font-normal text-neutral-500 dark:text-neutral-400">
                        Student executed 'ls' to list files in the current
                        directory.
                      </p>
                    </li>

                    <li
                      id="seek9"
                      onclick="seekToTime(9)"
                      className="clickable cursor-pointer mb-10 ms-4 p-4 hover:bg-neutral-800"
                    >
                      <div className="absolute -start-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-neutral-200 dark:border-neutral-900 dark:bg-neutral-700"></div>
                      <time className="mb-1 text-sm font-normal leading-none text-neutral-400 dark:text-neutral-500">
                        00:09
                      </time>
                      <h3 className="text-md font-semibold text-yellow-500 ">
                        Directory Navigation Error
                      </h3>
                      <p className="text-base font-normal text-neutral-500 dark:text-neutral-400">
                        Attempted to navigate to a 'secret' directory, resulting
                        in an error: 'No such file or directory'.
                      </p>

                      <button onClick={() => {
                        setOpen(true)
                      }} className='bg-blue-600 text-white rounded-lg px-2 mt-2'>Explain</button>  <button className='ml-2 bg-blue-600 text-white rounded-lg px-2 mt-2'>Disagree?</button>
                      <hr className='mt-4 border-neutral-600 mb-2'></hr>
                      <span className='text-red-500'>-5 points</span> 
                    </li>

                    <li
                      id="seek47"
                      onclick="seekToTime(47)"
                      className="clickable cursor-pointer mb-10 ms-4 p-4 hover:bg-neutral-800"
                    >
                      <div className="absolute -start-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-neutral-200 dark:border-neutral-900 dark:bg-neutral-700"></div>
                      <time className="mb-1 text-sm font-normal leading-none text-neutral-400 dark:text-neutral-500">
                        00:47
                      </time>
                      <h3 className="text-md font-semibold text-green-500 ">
                        Discovery of '.secret' folder
                      </h3>
                      <p className="text-base font-normal text-neutral-500 dark:text-neutral-400">
                        Successfully navigated to the '.secret' directory.
                      </p>
                    </li>

                    <li
                      id="seek51"
                      onclick="seekToTime(51)"
                      className="cursor-pointer clickable mb-10 ms-4 p-4 hover:bg-neutral-800"
                    >
                      <div className="absolute -start-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-neutral-200 dark:border-neutral-900 dark:bg-neutral-700"></div>
                      <time className="mb-1 text-sm font-normal leading-none text-neutral-400 dark:text-neutral-500">
                        00:51
                      </time>
                      <h3 className="text-md font-semibold text-green-500">
                        Opening 'flag.txt'
                      </h3>
                      <p className="text-base font-normal text-neutral-500 dark:text-neutral-400">
                        Student opened 'flag.txt' in a text editor, revealing
                        the message "Nice job! You found me!" along with the
                        text "flag_waves".
                      </p>
                    </li>
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
              enterTo="opacity-100 translate-y-0 sm:scale-100"
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
