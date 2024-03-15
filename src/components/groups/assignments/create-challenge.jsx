import Head from 'next/head';
import { useState, useEffect } from 'react';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { MarkdownViewer } from '@/components/MarkdownViewer';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import  fileApi  from '@/utils/file-api';
import { getAuth } from 'firebase/auth';
import request from '@/utils/request';

const styles = {
  h1: { fontSize: '2.4rem' },
  h2: { fontSize: '2rem' },
  h3: { fontSize: '1.8rem' },
  h4: { fontSize: '1.6rem' },
  h5: { fontSize: '1.4rem' },
  h6: { fontSize: '1.2rem' },
};

const auth = getAuth();

export default function Createchall(props) {
  const pages = [
    {
      name: 'Create Assignment',
      click: () => props.setDisplay(false),
      href: '../create',
      current: false,
    },
    {
      name: 'Challenge Creation',
      href: './',
      current: true,
      click: () => {},
    },
  ];
  const [contentPreview, setContentPreview] = useState('');
  const [penalty, setPenalty] = useState([0, 0, 0]);
  const [hints, setHints] = useState([
    'No hints set',
    'No hints set',
    'No hints set',
  ]);
  const [solution, setSolution] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [category, setCategory] = useState('forensics');
  const [newChallengeName, setNewChallengeName] = useState('');
  const [errMessage, setErrMessage] = useState('');
  const [penaltyErr, setPenaltyErr] = useState('');
  const [username, setUsername] = useState('anonymous');

  const [newConfig, setNewConfig] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const validateNewChallege = async () => {
    for (const p of penalty) {
      if (p > 0) {
        toast.warn('Please enter negative values for points', {
          position: 'bottom-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
        setPenaltyErr("Can't have a positive value for penalties");
        return false;
      }
    }
    setPenaltyErr('');
    return true;
  };

  const sendToFileApi = async () => {
    const isValid = await validateNewChallege();
    if (isValid) {
      setIsCreating(true);
      if (!selectedFile) {
        await uploadChallenge('');
        return;
      } else {
        const token = await auth.currentUser.accessToken;
        const fileId = await fileApi(token, selectedFile);
        if(fileId !== null) {
          await uploadChallenge(fileId);
        } else {
          toast.error('Something went wrong with the file upload');
        }
      }
    } else {
      console.warn('Either the file, toke, or challenge is invalid');
    }
  };

  const uploadChallenge = async (fileId) => {
    try {
      const nConfig = newConfig.replace('\n', ' && ');
      const challengeInfo = {
        name: newChallengeName,
        category: [category],
        hints,
        penalty,
        content: contentPreview,
        solution,
        difficulty,
        category,
        commands: nConfig,
        fileId: fileId,
      };

      const classCode = window.location.pathname.split('/')[2];
      const assignmentInfo = props.assignmentInfo;
      const url = `${process.env.NEXT_PUBLIC_API_URL}/classroom-assignments/create-new-assignment/${classCode}`;
      const data = await request(url, 'POST', { challengeInfo, assignmentInfo, username: localStorage.getItem('username') });
      if (data && data.success) {
        toast.success('Assignment Created', {
          position: 'bottom-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
        });
        window.location.reload();
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setUsername(localStorage.getItem('username'));
  }, []);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    console.log(event.target.files[0]);
    toast.success(`Successfully uploaded ${event.target.files[0].name}`, {
      position: 'bottom-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
    });
  };

  return (
    <>
      <Head>
        <title>Create - CTFGuide</title>
        <style>
          @import
          url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
        </style>
      </Head>
      <StandardNav />

      <main style={styles}>
        <nav
          className="mx-auto mt-10 flex max-w-7xl text-center"
          aria-label="Breadcrumb"
        >
          <ol role="list" className="flex items-center space-x-4">
            <li>
              <div>
                <a href="#" className=" text-white hover:text-gray-200">
                  <i className="fas fa-home"></i>

                  <span className="sr-only">Home</span>
                </a>
              </div>
            </li>
            {pages.map((page) => (
              <li key={page.name}>
                <div className="flex items-center">
                  <svg
                    className="h-5 w-5 flex-shrink-0 text-gray-200"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                  </svg>
                  <span
                    style={{ cursor: 'pointer' }}
                    onClick={page.click}
                    className="ml-4 text-sm font-medium text-gray-100 hover:text-gray-200"
                  >
                    {page.name}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </nav>

        <div
          id="createChallenges"
          className="mx-auto mt-10 max-w-7xl text-white"
        >
          {/*/ Create a new challenge */}

          <input
            value={newChallengeName}
            id="challengeName"
            onChange={(event) => {
              setNewChallengeName(event.target.value);
            }}
            className={
              errMessage !== ''
                ? 'w-3/4 rounded-lg border border-red-600 bg-neutral-900/90 px-4 py-2 text-3xl font-semibold text-white shadow-lg'
                : 'w-3/4 rounded-lg border border-neutral-600 bg-neutral-900/90 px-4 py-2 text-3xl font-semibold text-white shadow-lg'
            }
            placeholder="Untitled Challenge"
          />
          <div style={{ color: '#ff4c4c', fontWeight: 'bold' }}>
            {errMessage}
          </div>

          <div
            id="error"
            className="mt-4 hidden rounded-md bg-red-500 px-4 py-1"
          >
            Something went wrong on our end. Your changes have not been saved.
            You can try again now or later.
          </div>

          <div className=" mt-4 flex flex-shrink-0">
            <div className="w-full">
              <h1>Difficulty</h1>
              <select
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                name="difficulty"
                className="mb-4 mt-1  w-1/3 rounded-md border-neutral-600 bg-neutral-900/90 py-2 pl-3 pr-20 text-base  text-white  focus:outline-none sm:text-sm"
                defaultValue="easy"
              >
                <option value="beginner">Beginner</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="insane">Insane</option>
              </select>
            </div>
            <div className="w-full">
              <h1>Category</h1>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                id="category"
                name="category"
                className="mb-4 ml-4 mt-1  w-1/3 rounded-md border-neutral-600  bg-neutral-900/90 py-2 pl-3 pr-20  text-base  text-white  focus:outline-none sm:text-sm"
                defaultValue="forensics"
              >
                <option value="forensics">forensics</option>
                <option value="cryptography">cryptography</option>
                <option value="web">web</option>
                <option value="reverse engineering">reverse engineering</option>
                <option value="programming">programming</option>
                <option value="pwn">pwn</option>
                <option value="basic">basic</option>

                <option value="other">other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-4">
            <div className="mt-5 rounded-sm border border-gray-900 bg-neutral-800/40 shadow-lg  shadow-lg ring-1 ring-black ring-opacity-5">
              <h3 className=" rounded-t-lg bg-blue-800 px-4 py-1.5 text-xl font-medium leading-6 text-white">
                Challenge Content
              </h3>
              <div className="px-5 py-5 ">
                <dt className="truncate text-xl font-medium text-white">
                  Challenge Instructions
                </dt>
                <textarea
                  value={contentPreview}
                  id="content"
                  placeholder="You can use Markdown here! "
                  className="mt-2 h-40 w-full rounded-lg border-neutral-800 bg-neutral-900 px-5 py-4 text-white shadow-lg"
                  onChange={(event) => {
                    let str = event.target.value;
                    setContentPreview(str);
                  }}
                ></textarea>

                <div className=" py-5">
                  {hints.map((hint, idx) => {
                    return (
                      <div key={idx}>
                        <dt className="mt-4 truncate text-xl font-medium text-white">
                          Hint {idx + 1}
                        </dt>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          <textarea
                            onChange={(e) => {
                              setHints((prevState) => {
                                const newState = [...prevState];
                                newState[idx] = e.target.value;
                                return newState;
                              });
                            }}
                            value={hint}
                            placeholder="No hint set"
                            className="mt-1 w-full rounded-lg border-neutral-800 bg-neutral-900 text-white shadow-lg"
                            style={{ flexBasis: '85%' }}
                          ></textarea>
                          <input
                            value={penalty[idx]}
                            onChange={(e) => {
                              setPenalty((prevState) => {
                                let newState = [...prevState];
                                newState[idx] = parseInt(e.target.value);
                                return newState;
                              });
                            }}
                            max={0}
                            placeholder={-idx * 5}
                            type="number"
                            className={
                              penaltyErr === ''
                                ? 'mt-1 w-full rounded-lg border-neutral-800 bg-neutral-900 text-white shadow-lg'
                                : 'mt-1 w-full rounded-lg border-red-800 bg-neutral-900 text-white shadow-lg'
                            }
                            style={{ flexBasis: '15%' }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-sm border border-gray-900 bg-neutral-800/40 shadow-lg  shadow-lg ring-1 ring-black ring-opacity-5">
              <h3 className=" rounded-t-lg bg-blue-800 px-4 py-1.5 text-xl font-medium leading-6 text-white">
                Challenge Content Preview
              </h3>
              <div
                className=" w-full py-10 "
                style={{
                  backgroundSize: 'cover',
                  backgroundImage:
                    'url("https://images.unsplash.com/photo-1633259584604-afdc243122ea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80")',
                }}
              >
                <div className="mx-auto my-auto flex  text-center">
                  <h1
                    className="mx-auto my-auto text-4xl font-semibold text-white"
                    id="challengeName2"
                  >
                    {' '}
                    {newChallengeName}{' '}
                  </h1>
                </div>
                <div className="mx-auto my-auto  text-center text-lg text-white">
                  <div className="my-auto flex place-items-center justify-center">
                    <p className="my-auto mr-2 text-sm">Created by</p>
                    <img
                      className="my-auto my-auto mr-2 h-6   w-6  rounded-full bg-neutral-900"
                      src={
                        `https://robohash.org/` +
                        username +
                        `.png?set=set1&size=150x150`
                      }
                      alt=""
                    />
                    <p className="my-auto text-sm">{username}</p>
                  </div>
                </div>
              </div>
              <div className="px-5 py-5 ">
                <div contentEditable={false}>
                  <MarkdownViewer content={contentPreview} />
                </div>
              </div>
            </div>
          </div>

          <div className="900 mt-5 rounded-sm   bg-neutral-800/40 shadow-lg">
            <h3 className="mt-6 rounded-t-lg bg-blue-800 px-4 py-1.5 text-xl font-medium leading-6 text-white">
              Challenge Solution
            </h3>
            <div className="px-5 py-5">
              <textarea
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                id="solution"
                placeholder="Not having a solution, is a different kinda evil."
                className="mt-1 w-full rounded-lg border-neutral-800 bg-neutral-900 text-white shadow-lg"
              ></textarea>
            </div>
          </div>

          <div className="900 mt-5 rounded-sm   bg-neutral-800/40 shadow-lg">
            <h3 className="mt-6 rounded-t-lg bg-blue-800 px-4 py-1.5 text-xl font-medium leading-6 text-white">
              Environment Container Configuration
            </h3>
            <div className="grid w-full grid-cols-1 gap-x-8 px-5 py-5">
              <div className="text-lg">
                <h1>Add your own configurations</h1>
                <textarea
                  value={newConfig}
                  onChange={(e) => setNewConfig(e.target.value)}
                  className="mt-4 w-full border-none bg-black text-white"
                ></textarea>
              </div>
            </div>
            <div className="px-4">
              <div className="bg-neutral-850 mt-2 rounded-lg border border-neutral-500 px-4 py-2 text-white">
                <b>✨ What is this?</b>
                <h1>
                  When we spin up your container, we will run the commands in
                  this configuration file. If you are modifying a fork, you
                  should assume their configuration file will be run first, then
                  yours is run afterwards.
                </h1>
              </div>

              <br></br>
            </div>

            <div className="px-5 py-1">
              <h1>Import files from your computer</h1>

              <label className="mt-4 flex h-32 w-full cursor-pointer appearance-none justify-center rounded-md border-2 border-dashed border-neutral-600 bg-neutral-800 px-4 transition hover:border-neutral-500 focus:outline-none">
                <span className="flex items-center space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                <span className="font-medium text-gray-300">
                  Drop files to Attach, or
                  <span className="ml-1 text-blue-600 underline">browse</span>
                  <br></br>
                  {
                    selectedFile? <>Selected File: <span style={{color: "lightgreen"}}>
                      {selectedFile.name}</span> </> : "No file selected"
                  }
                </span>
              </span>
                <input
                  style={{
                    position: 'absolute',
                    width: '57%',
                    backgroundColor: 'yellow',
                    height: '13%',
                  }}
                  onChange={(e) => handleFileChange(e)}
                  type="file"
                  name="file_upload"
                  class="hidden"
                />
              </label>

              <div className="bg-neutral-850 mb-10 mt-10 rounded-lg border border-neutral-500 px-4 py-2 text-white">
                <b>🗒️ A note about file uploads</b>
                <h1>
                  Please assume that files are placed in the home directory.
                </h1>
              </div>
            </div>
          </div>

          <button
            onClick={sendToFileApi}
            disabled={isCreating}
            className="mr-2 mt-6 rounded-lg border-green-600 bg-green-900 px-4 py-2 text-2xl text-white shadow-lg hover:bg-green-800"
          >
            <i class="fas fa-send"></i> {isCreating ? "Creating Challenge..." : "Create Challenge"} 
          </button>

          <button className="mr-2 mt-6 hidden rounded-sm border-blue-600 bg-blue-700 px-4 py-2 text-2xl text-white shadow-lg hover:bg-blue-800">
            <i class="fas fa-save"></i> Save as draft
          </button>
        </div>

        <div
          id="saved"
          aria-live="assertive"
          className="pointer-events-none fixed inset-0 flex hidden items-end px-4 py-6 sm:items-start sm:p-6"
        >
          <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
            <div className="pointer-events-auto w-full  max-w-sm overflow-hidden rounded-sm border border-gray-700 shadow-lg shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-6 w-6 text-green-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-medium text-white">
                      All changes saved
                    </p>
                    <p className="mt-1 text-sm text-gray-300">
                      It may take a few minutes for your changes to be visible.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
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
