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
        `https://file-system-run-qi6ms4rtoa-ue.a.run.app/files/get/log?password=${password}&slug=test_101z`,
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
      console.log(id);
      const token = localStorage.getItem('idToken');
      const url = `${baseUrl}/submission/submission/${id}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: 'Bearer ' + token },
      });
      const data = await response.json();
      if (data.success) {
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
                  <div className="rounded-md bg-white px-3 py-2">
                    <h1 className="text-4xl font-bold text-blue-600">
                      {submission &&
                        assignment &&
                        (submission.grade / assignment.totalPoints) * 100}
                      %
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
                  <ol className="relative border-s border-gray-200 dark:border-gray-700">
                    <li
                      id="seek0"
                      onclick="seekToTime(0)"
                      className="clickable mb-10 ms-4 p-4 hover:bg-neutral-800"
                    >
                      <div className="absolute -start-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-gray-200 dark:border-gray-900 dark:bg-gray-700"></div>
                      <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                        00:00
                      </time>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Initial Terminal Access
                      </h3>
                      <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                        The student accessed the terminal and executed a 'clear'
                        command, resetting the terminal view.
                      </p>
                    </li>

                    <li
                      id="seek1"
                      onclick="seekToTime(1)"
                      className="clickable mb-10 ms-4 p-4 hover:bg-neutral-800"
                    >
                      <div className="absolute -start-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-gray-200 dark:border-gray-900 dark:bg-gray-700"></div>
                      <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                        00:01
                      </time>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Executing 'ls' Command
                      </h3>
                      <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                        Student executed 'ls' to list files in the current
                        directory.
                      </p>
                    </li>

                    <li
                      id="seek9"
                      onclick="seekToTime(9)"
                      className="clickable mb-10 ms-4 p-4 hover:bg-neutral-800"
                    >
                      <div className="absolute -start-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-gray-200 dark:border-gray-900 dark:bg-gray-700"></div>
                      <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                        00:09
                      </time>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Directory Navigation Error
                      </h3>
                      <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                        Attempted to navigate to a 'secret' directory, resulting
                        in an error: 'No such file or directory'.
                      </p>
                    </li>

                    <li
                      id="seek47"
                      onclick="seekToTime(47)"
                      className="clickable mb-10 ms-4 p-4 hover:bg-neutral-800"
                    >
                      <div className="absolute -start-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-gray-200 dark:border-gray-900 dark:bg-gray-700"></div>
                      <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                        00:47
                      </time>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Discovery of '.secret' Directory
                      </h3>
                      <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                        Successfully navigated to the '.secret' directory and
                        listed its contents, revealing 'flag.txt'.
                      </p>
                    </li>

                    <li
                      id="seek51"
                      onclick="seekToTime(51)"
                      className="clickable mb-10 ms-4 p-4 hover:bg-neutral-800"
                    >
                      <div className="absolute -start-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-gray-200 dark:border-gray-900 dark:bg-gray-700"></div>
                      <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                        00:51
                      </time>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Opening 'flag.txt'
                      </h3>
                      <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                        Student opened 'flag.txt' in a text editor, revealing
                        the message "Nice job! You found me!" along with the
                        text "flag_waves".
                      </p>
                    </li>
                  </ol>
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
