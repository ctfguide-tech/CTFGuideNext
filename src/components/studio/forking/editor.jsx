import React from 'react';
import { MarkdownViewer } from '@/components/MarkdownViewer';
import { useState, useEffect } from 'react';
import request from '@/utils/request';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useRouter } from 'next/router';
import { getAuth } from 'firebase/auth';
import fileApi, {getNewFileIds, getFileName, getFile } from '@/utils/file-api';

const auth = getAuth();

const Editor = (props) => {
  const router = useRouter();
  const [contentPreview, setContentPreview] = useState('');
  const [penalty, setPenalty] = useState([0, 0, 0]);
  const [hints, setHints] = useState([
    'No hints set',
    'No hints set',
    'No hints set',
  ]);
  const [solution, setSolution] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [category, setCategory] = useState([]);
  const [newChallengeName, setNewChallengeName] = useState(props.title);
  const [errMessage, setErrMessage] = useState('');
  const [penaltyErr, setPenaltyErr] = useState('');
  const [username, setUsername] = useState('anonymous');
  const [existingFiles, setExistingFiles] = useState([]);

  const [existingConfig, setExistingConfig] = useState('');
  const [newConfig, setNewConfig] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const validateNewChallege = async () => {
    for (const p of penalty) {
      if (p > 0) {
        toast.error('Please enter negative values for the points');
        return false;
      }
    }
    setPenaltyErr('');
    return true;
  };

  const submitChallenge = async () => {
    if(!validateNewChallege()) {
      return;
    }
    const token = await auth.currentUser.accessToken;
    setIsCreating(true);
    let fileIds = [];
    const originalFileIds = existingFiles.filter((file) => file.using).map((file) => file.fileId);

    if(originalFileIds.length > 0) { // if og challenge has existing files
      const res = await getNewFileIds(originalFileIds, token); // copy them
      if(res !== null) { // if the copy was successful
        fileIds = res; // set the fileIds to the new ones
      } else {
        toast.error('Something went wrong with the file upload');
        return;
      }
    }
    if (selectedFile) { // if they added a file
      const fileId = await fileApi(token, selectedFile);
      if (fileId !== null) { // if the upload was successful
        fileIds.push(fileId); // add it to the list
      } else {
        toast.error('Something went wrong with the file upload');
        return;
      }
    }
    await uploadChallenge(fileIds);
  };

  const uploadChallenge = async (fileIds) => {
    const classCode = window.location.href.split('/')[4];
    const exConfig = existingConfig.replace('\n', ' && ');
    const nConfig = newConfig.replace('\n', ' && ');
    let finalConfig = '';
    if (exConfig && nConfig) {
      finalConfig = exConfig + ' && ' + nConfig;
    } else {
      finalConfig = exConfig || nConfig;
    }

    const challengeInfo = {
      name: newChallengeName,
      hints,
      penalty,
      content: contentPreview,
      solution,
      difficulty,
      category,
      commands: finalConfig,
      fileIds: fileIds,
    };

    const body = {
      id: props.id,
      challengeInfo,
      assignmentInfo: props.assignmentInfo.assignmentInfo,
      username: localStorage.getItem('username'),
    };

    const url = 
      `${process.env.NEXT_PUBLIC_API_URL}/classroom-assignments/create-fork-assignment/${classCode}`;
    const data = await request(url, 'POST', body);

    if (data && data.success) {
      window.location.href = ``; 
    } else {
      toast.error('Something went wrong with the challenge creation, try again');
    }
  };

  const downloadFile = async (fileId, filename) => {
    await getFile(fileId, filename);
  }

  const getChallenge = async (isDefault, idName) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/challenges/basicInfo/${idName}`;
      const data = await request(url, 'GET', null);
      if (!isDefault) {
        return data.success;
      }
      if (data && data.success) {
        setHints(data.body.hints);
        setContentPreview(data.body.content);
        setSolution(data.body.solution);
        setDifficulty(data.body.difficulty);
        setCategory(data.body.category);
        setExistingConfig(data.body.commands.replace(' && ', '\n'));
        setPenalty(data.body.hintsPenalty);

        let tmp = [];
        for (let i = 0; i < data.body.fileIds.length; i++) {
          const name = await getFileName(data.body.fileIds[i]);
          tmp.push({ name: name || "File " + i, 
            using: true, fileId: data.body.fileIds[i] });
        }
        setExistingFiles(tmp);
      }

      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  useEffect(() => {
    setUsername(localStorage.getItem('username'));
    getChallenge(true, props.id);
  }, []);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    toast.success('File uploaded successfully');
  };

  return (
    <div>
      <div id="createChallenges" className="mx-auto mt-10 max-w-7xl text-white">
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
        <div style={{ color: '#ff4c4c', fontWeight: 'bold' }}>{errMessage}</div>

        <div className="mt-4">
          <i className="fas fa-code-branch"></i> You are forking{' '}
          <span className="mt-4 font-semibold text-blue-500">{props.title}</span>
        </div>

        <div id="error" className="mt-4 hidden rounded-md bg-red-500 px-4 py-1">
          Something went wrong on our end. Your changes have not been saved. You
          can try again now or later.
        </div>

        <div className=" mt-4 flex hidden flex-shrink-0">
          <div className="w-full">
            <h1>Difficulty</h1>
            <select
              id="difficulty"
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
                  setContentPreview(event.target.value);
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
                      props.creator +
                      `.png?set=set1&size=150x150`
                    }
                    alt=""
                  />
                  <p className="my-auto text-sm">{props.creator}</p>
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
          <div className="grid w-full grid-cols-2 gap-x-8 px-5 py-5">
            <div className=" ">
              <h1 className="text-lg">Existing Configuration</h1>

              <textarea
                value={existingConfig}
                onChange={(e) => setExistingConfig(e.target.value)}
                className="mt-4 w-full border-none bg-black text-white"
              ></textarea>
            </div>
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
                When we spin up your container, we will run the commands in this
                configuration file. If you are modifying a fork, you should
                assume their configuration file will be run first, then yours is
                run afterwards.
              </h1>
            </div>

            <br></br>
          </div>

          <div className="px-5 py-1">


















            <div className="flex">
            <h1>Existing Challenge Files </h1>
            <h1 style={{marginLeft:"35%"}}>Import files from your computer</h1>
            </div>
          <div className="flex">
              <label 
                style={{padding: "10px", width: "50%", overflowY: "auto"}}

                className="mt-4 grid grid-cols-2 grid-flow-row h-32 gap-4 appearance-none justify-center rounded-md border-2 border-dashed border-neutral-600 bg-neutral-800 px-4 transition hover:border-neutral-500 focus:outline-none">
                {existingFiles && existingFiles.length === 0 && (
                    <h1 className="text-white">No files attached</h1>
                )}
                {existingFiles && existingFiles.map((file, idx) => {
                  if(file.name.length > 24) {
                    file.name = file.name.substring(0, 24) + "...";
                  }
                  return(
                  <div
                    key={idx}
                    style={{maxHeight: "35px", fontSize: "13px"}}
                    className="rounded-lg bg-neutral-700 px-4 py-2 mb-2 text-white hover:bg-neutral-500/40">
                    <h1 className="flex">
                      <span
                          className="cursor-pointer hover:text-white-500"
                          onClick={() => {
                            let tmp = [...existingFiles];
                            tmp[idx].using = !tmp[idx].using;
                            setExistingFiles(tmp);
                          }}
                        >{file.name}{' '}</span>
                        <div className="py px-2">
                        {
                          file.using ? (
                            <i
                              style={{fontSize: "15px"}}
                              title="Completed!"
                              className="fas fa-check text-green-500"
                            ></i>
                          ) : (
                            <i
                              style={{fontSize: "15px"}}
                              title="Incomplete!"
                              className="fas fa-times text-red-500"
                            ></i>
                          )
                        }
                        </div>
                        <div className="ml-auto">
                          <i 
                            style={{fontSize: "15px"}}
                            onClick={() => downloadFile(file.fileId, file.name)} 
                            className="cursor-pointer fas fa-download text-green-500 px-3">
                          </i>
                        </div>
                      </h1>
                  </div>
                  )})}
              </label>


            <label className="mt-4 flex h-32 w-1/2 cursor-pointer appearance-none justify-center rounded-md border-2 border-dashed border-neutral-600 bg-neutral-800 px-4 transition hover:border-neutral-500 focus:outline-none">
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
                  width: '40%',
                  backgroundColor: 'yellow',
                  height: '13%',
                }}
                onChange={(e) => handleFileChange(e)}
                type="file"
                name="file_upload"
                  className="hidden"
              />
            </label>
          </div>




















            <div className="bg-neutral-850 mb-10 mt-10 rounded-lg border border-neutral-500 px-4 py-2 text-white">
              <b>🗒️ A note about file uploads</b>
              <h1>
                Please assume that files are places in the home directory.
              </h1>
            </div>
          </div>
        </div>

        <button
          onClick={submitChallenge}
          disabled={isCreating}
          className="mr-2 mt-6 rounded-lg border-green-600 bg-green-900 px-4 py-2 text-2xl text-white shadow-lg hover:bg-green-800"
        >
          <i class="fas fa-send"></i> { isCreating? "Creating..." : "Create Challenge" }
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
    </div>
  );
};

export default Editor;
