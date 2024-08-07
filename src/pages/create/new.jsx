import Head from 'next/head';
import { useState, useEffect, Fragment } from 'react';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { MarkdownViewer } from '@/components/MarkdownViewer';
import fileApi from '@/utils/file-api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import request, { getCookie } from '@/utils/request';
import { jwtDecode } from 'jwt-decode';
import { Context } from '@/context';
import { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faServer, faPenFancy, faEye, faChevronUp, faChevronDown, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/solid';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { Dialog } from '@headlessui/react';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const pages = [
  { name: 'Creator Dashboard', href: '../create', current: false },
  { name: 'Challenge Creation', href: './', current: true },
];

const styles = {
  h1: { fontSize: '2.4rem' },
  h2: { fontSize: '2rem' },
  h3: { fontSize: '1.8rem' },
  h4: { fontSize: '1.6rem' },
  h5: { fontSize: '1.4rem' },
  h6: { fontSize: '1.2rem' },
};

function getCategoryIcon(category) {
  switch (category.toLowerCase()) {
    case 'forensics':
      return 'fas fa-binoculars';
    case 'cryptography':
      return 'fas fa-lock';
    case 'other':
      return 'fas fa-question';
    case 'web':
      return 'fas fa-globe';
    case 'reverse engineering':
      return 'fas fa-tools';
    case 'programming':
      return 'fas fa-code';
    case 'pwn':
      return 'fas fa-skull-crossbones';
    case 'steganography':
      return 'fas fa-image';
    case 'basic':
      return 'fas fa-graduation-cap';
    case 'easy':
      return 'fas fa-star';
    case 'medium':
      return 'fas fa-star-half';
    case 'hard':
      return 'fas fa-star';
    default:
      return 'fas fa-question';
  }
}

function CategorySelect({ category, setCategory }) {
  const categories = [
    { name: 'Forensics', value: 'forensics' },
    { name: 'Cryptography', value: 'cryptography' },
    { name: 'Steganography', value: 'steganography' },
    { name: 'Web', value: 'web' },
    { name: 'Reverse Engineering', value: 'reverse engineering' },
    { name: 'Programming', value: 'programming' },
    { name: 'Pwn', value: 'pwn' },
    { name: 'Basic', value: 'basic' },
    { name: 'Other', value: 'other' },
  ];

  return (
    <Listbox value={category} onChange={setCategory}>
      {({ open }) => (
        <>
          <div className="relative mt-1">
            <Listbox.Button
              style={{ backgroundColor: '#212121' }}
              className="py-2 px-2 border border-neutral-700 block w-full rounded text-base leading-6 text-white focus:outline-none sm:text-sm sm:leading-5"
            >
              <span className="flex items-center">
                <i className={`${getCategoryIcon(category)} fa-fw`} />
                <span className="ml-3 block truncate">{categories.find(c => c.value === category).name}</span>
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>
            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-neutral-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {categories.map((category) => (
                  <Listbox.Option
                    key={category.value}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-3 pr-9 ${active ? 'bg-blue-600 text-white' : 'text-white'}`
                    }
                    value={category.value}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex items-center">
                          <i className={`${getCategoryIcon(category.value)} fa-fw`} />
                          <span className={`ml-3 block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                            {category.name}
                          </span>
                        </div>
                        {selected ? (
                          <span className={`absolute inset-y-0 right-0 flex items-center pr-4 ${active ? 'text-white' : 'text-blue-600'}`}>
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}

function DifficultySelect({ difficulty, setDifficulty }) {
  const difficulties = [
    { name: 'Beginner', value: 'beginner' },
    { name: 'Easy', value: 'easy' },
    { name: 'Medium', value: 'medium' },
    { name: 'Hard', value: 'hard' },
    { name: 'Insane', value: 'insane' },
  ];

  const badgeColor = {
    beginner: 'bg-blue-500',
    easy: 'bg-green-500',
    medium: 'bg-yellow-500',
    hard: 'bg-red-500',
    insane: 'bg-purple-500',
  };

  return (
    <Listbox value={difficulty} onChange={setDifficulty}>
      {({ open }) => (
        <>
          <div className="relative mt-1">
            <Listbox.Button
              style={{ backgroundColor: '#212121' }}
              className="py-2 px-2 border border-neutral-700 block w-full rounded text-base leading-6 text-white focus:outline-none sm:text-sm sm:leading-5"
            >
              <span className="flex items-center">
                <span className="ml-3 block truncate">{difficulties.find(d => d.value === difficulty).name}</span>
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>
            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-neutral-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {difficulties.map((difficulty) => (
                  <Listbox.Option
                    key={difficulty.value}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-3 pr-9 ${active ? `${badgeColor[difficulty.value]} text-white` : 'text-white'}`
                    }
                    value={difficulty.value}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex items-center">
                          <span className={`ml-3 block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                            {difficulty.name}
                          </span>
                        </div>
                        {selected ? (
                          <span className={`absolute inset-y-0 right-0 flex items-center pr-4 ${active ? 'text-white' : 'text-blue-600'}`}>
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}

export default function Createchall() {
  const { role } = useContext(Context);
  const [contentPreview, setContentPreview] = useState('');
  const [penalty, setPenalty] = useState([0, 0, 0]);
  const [sending, setSending] = useState(false);
  const [hints, setHints] = useState(['No hints set', 'No hints set', 'No hints set']);
  const [solution, setSolution] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [category, setCategory] = useState('forensics');
  const [newChallengeName, setNewChallengeName] = useState('');
  const [errMessage, setErrMessage] = useState('');
  const [penaltyErr, setPenaltyErr] = useState('');
  const [username, setUsername] = useState('anonymous');
  const [newConfig, setNewConfig] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openConfirmModal = () => setIsConfirmModalOpen(true);
  const closeConfirmModal = () => setIsConfirmModalOpen(false);

  const handleConfirmSubmit = () => {
    closeConfirmModal();
    sendToFileApi();
  };

  const validateNewChallege = async () => {
    let sum = 0;
    for (const p of penalty) {
      if(p != 0 && !p) {
        toast.error('Enter in all penalty fields');
        return false;
      }
      sum += p;
      if (p < 0 || p > 100) {
        toast.error('Please enter positive values from 0 - 100');
        return false;
      }
    }
    if(sum > 100) {
      toast.error('The sum of all penalties must be between 0 - 100');
      return false;
    }
    return true;
  };

  const sendToFileApi = async () => {
    const isValid = await validateNewChallege();
    if (isValid) {
      if (!selectedFile) {
        await uploadChallenge('');
        return;
      } else {
        try {
          const cookie = getCookie('idToken');
          const data = jwtDecode(cookie);
          console.log(data)
          toast.info('Uploading file...');
          toast.info(data)
          const token = cookie;
          console.log('Uploading file with token:', token);
          const fileId = await fileApi(token, selectedFile);
          if (fileId !== null) {
            await uploadChallenge(fileId);
          } else {
            toast.error('Something went wrong with the file upload');
          }
        } catch (error) {
          console.error('Error during file upload:', error);
          toast.error('An error occurred during file upload');
        }
      }
    } else {
      console.warn('Either the file, token, or challenge is invalid');
    }
  };

  const uploadChallenge = async (fileId) => {
    setSending(true);
    try {
      const nConfig = newConfig.replace('\n', ' && ');

      console.log('Uploading challenge with category:', category);

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
        isRoot: document.getElementById('root').checked,
      };

      const url = `${process.env.NEXT_PUBLIC_API_URL}/challenges/create`;
      const body = {
        challengeInfo,
        username: localStorage.getItem('username'),
      };
      console.log('Sending request to:', url, 'with body:', body);
      const data = await request(url, "POST", body);

      if (data && data.success) {
        toast.success(data.message);
        window.location.href = '/create';
      } else {
        //toast.error(data.message);
      }
    } catch (err) {
      console.error('Error during challenge upload:', err);
      toast.error('An error occurred during challenge upload');
    }
    setSending(false);
  };

  useEffect(() => {
    setUsername(localStorage.getItem('username'));
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (uploadedFiles.length > 0) {
      toast.error('Only one file can be uploaded at a time. Please zip multiple files.');
      return;
    }


    setSelectedFile(file);
    setUploadedFiles([file]);
  };

  const handleFileDelete = (index) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    if (newFiles.length === 0) {
      setSelectedFile(null);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    if (uploadedFiles.length > 0) {
      toast.error('Only one file can be uploaded at a time. Please zip multiple files.');
      return;
    }



    const file = event.dataTransfer.files[0];

    console.log(file.size)


    // handle large files 
    if (role !== "PRO") {
      if (file.size > 30 * 1024 * 1024) {
        toast.error('File size is too large. Please upload a file less than 30MB or upgrade to PRO to upload larger files.');
        return;
      } 
    } else {
      if (file.size > 100 * 1024 * 1024) {
        toast.error('File size is too large. Please upload a file less than 100MB.');
        return;
      }
    }



    setSelectedFile(file);
    setUploadedFiles([file]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <Head>
        <title>Create - CTFGuide</title>
        <style>
          @import url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
        </style>
      </Head>
      <StandardNav />
      <main style={styles}>
        <nav className="mx-auto px-20 mt-10 flex text-center" aria-label="Breadcrumb">
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
                  <svg className="h-5 w-5 flex-shrink-0 text-gray-200" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                  </svg>
                  <span style={{ cursor: 'pointer' }} onClick={page.click} className="ml-4 text-sm font-medium text-gray-100 hover:text-gray-200">
                    {page.name}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </nav>
        <div id="createChallenges" className="mx-auto mt-10  px-20 text-white">

          <div className='flex justify-center'>
         <div className='w-3/4 '>
         <input
            value={newChallengeName}
            id="challengeName"
            onChange={(event) => setNewChallengeName(event.target.value)}
            className={errMessage !== '' ? 'w-full rounded-lg border border-red-600 bg-neutral-900/90  py-2 text-3xl font-semibold text-white ' : 'hover:bg-neutral-800 cursor-pointer w-full placeholder:text-neutral-600 rounded-lg border-none bg-neutral-900/90  py-2 text-3xl font-semibold text-white'}
            placeholder="Untitled Challenge"
          />
         </div>
        
          <div className="w-full flex justify-end gap-4">
            <div className="w-1/4">
              <h1 className="text-lg font-medium text-white">Difficulty</h1>
              <DifficultySelect difficulty={difficulty} setDifficulty={setDifficulty} />
            </div>
            <div className="w-1/4">
              <h1 className="text-lg font-medium text-white">Category</h1>
              <CategorySelect category={category} setCategory={setCategory} />
            </div>
          </div>
            </div>

            <div style={{ color: '#ff4c4c', fontWeight: 'bold' }}>{errMessage}</div>
          <div id="error" className="mt-4 hidden rounded-md bg-red-500 px-4 py-1">
            Something went wrong on our end. Your changes have not been saved. You can try again now or later.
          </div>

          <div className="grid grid-cols-6 gap-x-1 mt-6">
            <div className={`rounded-sm bg-neutral-800/40 ${isExpanded ? 'col-span-4' : 'col-span-2'}`}>
              <h3 className="flex items-center text-xl bg-blue-800 px-4 py-4 text-xl font-medium leading-6 text-white">
                <FontAwesomeIcon icon={faPenFancy} className='mr-2 text-sm w-4 h-4' />
                Challenge Content Editor
                <button onClick={toggleExpand} className="ml-auto text-white">
                  <FontAwesomeIcon icon={isExpanded ? faArrowLeft : faArrowRight} className='text-sm w-4 h-4'/>
                </button>
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
                            max={100}
                            min={0}
                            placeholder={idx * 5}
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

            <div className={`rounded-sm bg-neutral-800/40  transition ${isExpanded ? 'duration-400 col-span-2' : 'duration-400 col-span-4'}`}>
              <h3 className="flex items-center bg-blue-800 px-4 py-4 text-xl font-medium leading-6 text-white">
                <FontAwesomeIcon icon={faEye} className='mr-2 text-sm w-4 h-4' />
                Challenge Content Preview
                <button onClick={toggleExpand} className="ml-auto text-white">
                  <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} />
                </button>
              </h3>
              <div className='px-4'>
              <div className="mt-5 ">
                <h1 className='text-xl font-medium text-white mb-1'>Challenge Instructions</h1>
                  <hr className='mb-3 border-neutral-700'></hr>
                <div contentEditable={false}>
                  <MarkdownViewer content={contentPreview || '#### Using the editor\n\nStart writing and this preview will update automatically. Descriptions support Markdown, you can learn more about it [here](https://www.markdownguide.org/).\n\n ##### A note about files and links... \n\nPlease upload files into the terminal, do not reference non-approved links in the challenge description itself.'} />
                </div>
              </div>


              <div className='mt-10'>
                <h1 className='text-xl font-medium text-white'>Hints</h1>
                <div
                  className="mb-2 w-full hover:cursor-pointer bg-[#212121] px-4 py-2 text-md opacity-75 transition-opacity transition-opacity duration-150 duration-75 hover:opacity-100"
                  onClick={() => toast.info(`Psst, you're in preview mode.`)}
                >
                  <div className='flex place-items-center w-full'>
                    <h1 className='text-blue-500 px-2 mr-2 text-xl'>Hint 1</h1>
                    <div className='ml-auto'>
                      <span className="mt-1 text-sm text-white bg-neutral-700 px-2 py-1 rounded-sm">
                        {penalty[0]}% penalty
                      </span>
                    </div>
                  </div>
                  <div className='px-2'>
                      {hints[0]}
                  </div>
                </div>
                <div
                  className="mb-2 w-full hover:cursor-pointer bg-[#212121] px-4 py-2 text-md opacity-75 transition-opacity transition-opacity duration-150 duration-75 hover:opacity-100"
                  onClick={() => toast.info(`Psst, you're in preview mode.`)}
                >
                  <div className='flex place-items-center w-full'>
                    <h1 className='text-blue-500 px-2 mr-2 text-xl'>Hint 2</h1>
                    <div className='ml-auto'>
                      <span className="mt-1 text-sm text-white bg-neutral-700 px-2 py-1 rounded-sm">
                        {penalty[1]}% penalty
                      </span>
                    </div>
                  </div>
                  <div className='px-2'>
                      {hints[1]}
                  </div>
                </div>
                <div
                  className="mb-2 w-full hover:cursor-pointer bg-[#212121] px-4 py-2 text-md opacity-75 transition-opacity transition-opacity duration-150 duration-75 hover:opacity-100"
                  onClick={() => toast.info(`Psst, you're in preview mode.`)}
                >
                  <div className='flex place-items-center w-full'>
                    <h1 className='text-blue-500 px-2 mr-2 text-xl'>Hint 3</h1>
                    <div className='ml-auto'>
                      <span className="mt-1 text-sm text-white bg-neutral-700 px-2 py-1 rounded-sm">
                        {penalty[2]}% penalty
                      </span>
                    </div>
                  </div>
                  <div className='px-2'>
                      {hints[2]}
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>

          <div className="900 mt-5 rounded-sm   bg-neutral-800/40 shadow-lg">
            <h3 className="mt-6 flex items-center bg-green-700 px-4 py-4 text-xl font-medium leading-6 text-white">
            <FontAwesomeIcon icon={faCheckCircle} className='mr-2 text-sm w-4 h-4' />
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

<div className='grid grid-cols-1 mt-5 gap-x-1'>
          <div className="900 rounded-sm   bg-neutral-800/40 shadow-lg ">
            <h3 className="m flex items-center bg-blue-800 px-4 py-4 text-xl font-medium leading-6 text-white flex">
            <FontAwesomeIcon icon={faServer} className='mr-2 text-sm w-4 h-4' />
 Environment Container Configuration

 <button onClick={openModal} className='ml-auto bg-white hover:bg-neutral-200 text-blue-600 px-2 py-1.5 rounded-sm flex items-center'><FontAwesomeIcon icon={faQuestionCircle} className='mr-2 text-sm w-6 h-6' />What is this?</button>
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

              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => document.getElementById('fileInput').click()} // Added onClick event
                className="mt-4 flex h-32 w-full cursor-pointer appearance-none justify-center rounded-md border-2 border-dashed border-neutral-600 bg-neutral-800 px-4 transition hover:border-neutral-500 focus:outline-none"
              >
                <span className="flex items-center space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <span className="font-medium text-gray-300">
                    Drop files to Attach, or
                    <span className="ml-1 text-blue-600 underline">browse</span>
                  </span>
                </span>
                <input
                  id="fileInput" // Added id to the input
                  style={{
                    position: 'absolute',
                    width: '57%',
                    backgroundColor: 'yellow',
                    height: '13%',
                  }}
                  onChange={(e) => handleFileChange(e)}
                  type="file"
                  name="file_upload"
                  className="hidden"
                />
              </div>

              <div className="mt-4">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border-b border-neutral-600">
                    <span className="text-white">{file.name}</span>
                    <button
                      onClick={() => handleFileDelete(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>

              <div className="bg-neutral-850 mb-10 mt-10 rounded-lg border border-neutral-500 px-4 py-2 text-white">
                <b>🗒️ A note about file uploads</b>
                <h1>
                  Please assume that files are placed in the home directory.
                </h1>
              </div>

              <div>
               <input id='root' type='checkbox' defaultChecked={true} />
               <label className='ml-2 '>Make user login have root access. By default, we suggest giving users root.</label>
              </div>

              <br></br>
            </div>
          </div>
          <div className="900 rounded-sm   bg-neutral-800/40 shadow-lg hidden ">
          <h3 className="m flex items-center bg-blue-800 px-4 py-4 text-xl font-medium leading-6 text-white flex">
            <FontAwesomeIcon icon={faGlobe} className='mr-2 text-sm w-4 h-4' />
 Hosted Web Challenges

            </h3>

            <div className='text-left px-4 mt-4 relative'>
              <h1 className='text-white text-lg '>
                Hosted web challenges allow you to host CTF's related to web exploitation. Upload a zip file containing your website, and we will host it 24/7 for you.
              </h1>

              <div className='blur-xl'>
                <div
                  className="mt-4 flex h-32 w-full cursor-pointer appearance-none justify-center rounded-md border-2 border-dashed border-neutral-600 bg-neutral-800 px-4 transition hover:border-neutral-500 focus:outline-none"
                >
                  <span className="flex items-center space-x-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-gray-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <span className="font-medium text-gray-300">
                      Drop files to Attach, or
                      <span className="ml-1 text-blue-600 underline">browse</span>
                    </span>
                  </span>
                </div>

                   <textarea
                  className="mt-10 w-full h-40 border-none bg-black text-white"
                ></textarea>

                <button className='mt-10 bg-blue-800 hover:bg-blue-700 text-white px-4 py-2 rounded-lg'>Test Deployment</button>
              </div>

              <div className="absolute inset-0 flex items-center justify-center mt-10">
                <div className='flex flex-col items-center justify-center'>
                <FontAwesomeIcon icon={faExclamationTriangle} className='text-yellow-500 mr-2 text-sm w-10 h-10 ' />
                  <h1 className='text-white text-2xl font-bold mt-2'>This feature isn't ready just yet.</h1>
                <p className='text-white text-lg'>We may still be able to host your challenge. Reach out to us on our Discord.</p>
                </div>
              </div>
            </div>

            </div>
</div>



          <button className="mr-2 mt-6 hidden  rounded-lg border-blue-800 bg-blue-800 px-4 py-2 text-lg text-white shadow-lg hover:bg-blue-800">
            <i class="fas fa-save"></i> Save
          </button>


          <button
            onClick={openConfirmModal}
            disabled={sending}
            className="mr-2 mt-6 rounded-lg border-green-600 bg-green-900 px-4 py-2 text-lg text-white shadow-lg hover:bg-green-800"
          >
            <i class="fas fa-send"></i> Save & Submit for Review
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

      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-neutral-800 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-bold leading-6 text-white"
                  >
                    Environment Container Configuration
                  </Dialog.Title>
                  <div className="mt-4">
                  <img src='/cycle.png' className='w-2/3 mx-auto'></img>
                    <p className="text-lg text-white mt-4">
                     
                      When we spin up your container, we will run the commands in
                      this configuration file. If you are modifying a fork, you
                      should assume their configuration file will be run first, then
                      yours is run afterwards.

                      <br></br><br></br>
                      If you still have questions, please join our <a href='https://discord.gg/bH6gu3HCFF' className='text-blue-500 hover:text-blue-700'>Discord</a> server.
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Got it, thanks!
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={isConfirmModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeConfirmModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-neutral-800 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-white"
                  >
                    Confirm Submission
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-300">
                      Are you sure you want to save and submit this challenge for review?
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={handleConfirmSubmit}
                    >
                      Yes, Submit
                    </button>
                    <button
                      type="button"
                      className="ml-2 inline-flex justify-center rounded-md border border-transparent bg-red-900 px-4 py-2 text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={closeConfirmModal}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
