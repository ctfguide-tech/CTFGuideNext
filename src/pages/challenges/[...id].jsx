import { MarkdownViewer } from "@/components/MarkdownViewer";
import { StandardNav } from "@/components/StandardNav";
import request from "@/utils/request";
import { Dialog } from "@headlessui/react";
import { DocumentTextIcon } from "@heroicons/react/20/solid";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
import ReactMarkdown from "react-markdown";
import Menu from '@/components/editor/Menu';
import { comment } from "postcss";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { getCookie } from '@/utils/request';
import { jwtDecode } from 'jwt-decode';
import api from '@/utils/terminal-api';
import Confetti from 'react-confetti';
import { Context } from '@/context';
import { useRef } from 'react';
import WriteupModal from '@/components/WriteupModal';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';


export default function Challenge() {
  const router = useRouter();
  const [selectedWriteup, setSelectedWriteup] = useState(null);
  const [isTerminalFullscreen, setIsTerminalFullscreen] = useState(false);
  const [isChallengeFullscreen, setIsChallengeFullscreen] = useState(true);

  // I hate this
  const [urlChallengeId, urlSelectedTab, urlWriteupId] = (router ?? {})?.query?.id ?? [undefined, undefined, undefined];

  const [fileIDName, setFileIDName] = useState("");
  const [fileIDLink, setFileIDLink] = useState("");

  // Very primitive cache system
  const [cache, _setCache] = useState({});
  const setCache = (name, value) => {
    const newCache = { ...cache };
    newCache[name] = value;
    _setCache(newCache);
  }

  // Tab system is designed to keep browser state in url,
  // while mainting persistence of the terminal.
  const tabs = {
    'description': { text: 'Description', element: DescriptionPage, },
    'hints': { text: 'Hints', element: HintsPage, },

    'comments': { text: 'Comments', element: CommentsPage, },

    'write-up': { text: 'Writeups', element: WriteUpPage, },
    'leaderboard': { text: 'Leaderboard', element: LeaderboardPage, },
    'AI': { text: 'AI', element: AIPage, },

  }
  const selectedTab = tabs[urlSelectedTab] ?? tabs.description;

  useEffect(() => {
    if (!urlChallengeId) {
      return;
    }
    (async () => {
      if (cache.challenge) {
        return;
      }
      try {
        const getChallengeByIdEndPoint = `${process.env.NEXT_PUBLIC_API_URL}/challenges/${urlChallengeId}`;
        const getChallengeResult = await request(getChallengeByIdEndPoint, "GET", null);
        if (getChallengeResult.success) {
          setCache("challenge", getChallengeResult.body);
        }
      } catch (error) { throw "Failed to fetch challenge: " + error; }
    })();
  }, [urlChallengeId]);

  const [loadingFlagSubmit, setLoadingFlagSubmit] = useState(false);
  const [isPointsModalOpen, setIsPointsModalOpen] = useState(false);
  const [awardedPoints, setAwardedPoints] = useState(0);

  const showPointsModal = (points) => {
    setAwardedPoints(points);
    setIsPointsModalOpen(true);
  };

  const onSubmitFlag = (e) => {
    e.preventDefault();
    if (loadingFlagSubmit) {
      return;
    }
    const formElements = e.target.elements;
    const flag = formElements.flag.value;
    setLoadingFlagSubmit(true);
    (async () => {
      try {
        const submitChallengeEndpoint = `${process.env.NEXT_PUBLIC_API_URL}/challenges/${urlChallengeId}/submissions`;
        const submitChallengeResult = await request(submitChallengeEndpoint, 'POST', { keyword: flag });
        console.log(submitChallengeResult);

        const { success, incorrect, error, points } = submitChallengeResult ?? {};
        if (error || !submitChallengeResult) {
          // An error occurred >:(
          toast.error(error);
          return;
        }
        if (incorrect) {
          // Incorrect
          toast.error(incorrect);
          return;
        }
        // Success
        showPointsModal(points); // Show points modal
      } catch (error) {
        console.error(error);
        toast.error("An unexpected error occurred.");
      } finally {
        setLoadingFlagSubmit(false);
      }
    })();
  }

  // ========================================= STEVES TERMINAL STUFF NO TOUCHING ====================================== 
  const [password, setPassword] = useState("N/A");
  const [containerId, setContainerId] = useState("");
  const [userName, setUserName] = useState("");
  const [minutesRemaining, setMinutesRemaining] = useState(60);
  const [fetchingTerminal, setFetchingTerminal] = useState(false);
  const [foundTerminal, setFoundTerminal] = useState(false);
  const [terminalUrl, setTerminalUrl] = useState("");
  const [loadingMessage, setLoadingMessage] = useState('Connecting to terminal service...');


  const createTerminal = async (skipToCheckStatus) => {
    const challenge = cache.challenge;
    const cookie = getCookie('idToken');

    const data = await api.buildDocketTerminal(challenge.id, cookie);
    //console.log(data)
    if (data) {
      if (!data.url) {
        toast.error("Unable to create the terminal, please try again");
        setFetchingTerminal(false);
        return;
      }

      setPassword(data.terminalUserPassword);
      setUserName(data.terminalUserName);
      if (data.fileIDs) {

        // CLEAN UP FILE IDS AS IT IS STRING AND CONVERT TO ARRAY
        

        setFileIDName(data.fileIDs.split('#')[0]);
        setFileIDLink(data.fileIDs.split('#')[1]);
      } else {
        setFileIDName("This challenge does not have any associated files.");
        setFileIDLink("https://ctfguide.com");
      }
      setContainerId(data.containerId);
      setFoundTerminal(true);
      setMinutesRemaining(60);

      // Wait for 5 seconds before setting the terminal URL
      setTimeout(() => {
        setTerminalUrl(data.url);
        setFetchingTerminal(false);
        setIsTerminalBooted(true);
        setShowMessage(true);

      }, 5000);
    } else {
      toast.error("Unable to create the terminal, please try again");
      setFetchingTerminal(false);
    }

    return;
  };

  const checkIfTerminalExists = async () => {
    const challenge = cache.challenge;
    //console.log(challenge);

    const cookie = getCookie('idToken');
    if (!challenge) return;
    const data = await api.checkUserTerminal(cookie, challenge.id, 1); // 1 if using docket 2 if not
    if (data !== null) {
      console.log('Found a terminal for the user');
      if (data.challengeID !== challenge.id) {
        // await createTerminal(false);
      } else {
        console.log('User has a terminal for this challenge');
        setTerminalUrl(data.url);
        setMinutesRemaining(data.minutesRemaining);
        setPassword(data.password);
        setUserName(data.userName);
        setFoundTerminal(true);
        setFetchingTerminal(false);

      }
    } else {
      console.log("Didnt find a terminal for the user, creating a new one");
    //  await createTerminal(false);
    }
  }

  useEffect(() => {
    if (cache.challenge) {
      checkIfTerminalExists();
    }
  }, [cache])

  useEffect(() => {
    const interval = setInterval(() => {
      setMinutesRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 60000); // 60000 ms = 1 minute

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Copied to clipboard!");
    }).catch(err => {
      toast.error("Failed to copy!");
    });
  };

  function formatTime(minutes) {
    const mins = Math.floor(minutes);
    const secs = Math.floor((minutes - mins) * 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  useEffect(() => {
    const { id } = router.query;
    if (id && id.length === 3 && id[1] === 'writeups') {
      const writeupID = id[2];
      // Fetch the writeup by ID and set it as the selected writeup
      (async () => {
        try {
          const response = await request(`${process.env.NEXT_PUBLIC_API_URL}/writeups/${writeupID}`, "GET", null);
          if (response.success) {
            setSelectedWriteup(response.writeup);
            // Update the URL to set the selected tab to "write-up"
            router.push(`/challenges/${urlChallengeId}/write-up/${writeupID}`, undefined, { shallow: true });
          } else {
            console.error('Failed to fetch writeup:', response.message);
          }
        } catch (error) {
          console.error('Error fetching writeup:', error);
        }
      })();
    }
  }, [router.query]);

  const handleWriteupSelect = (writeup) => {
    setSelectedWriteup(writeup);
    router.push(`/challenges/${urlChallengeId}/write-up/${writeup.id}`);
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  const openDeleteModal = (commentId) => {
    setCommentToDelete(commentId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCommentToDelete(null);
  };

  const deleteComment = async (commentId) => {
    try {
      const response = await request(`${process.env.NEXT_PUBLIC_API_URL}/challenges/comments/${commentId}`, "DELETE", {});
      if (response.success) {
        setComments(comments.filter(comment => comment.id !== commentId));
        toast.success("Comment deleted successfully.");
      } else {
        toast.error("Failed to delete comment.");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      closeDeleteModal();
    }
  };

  const [expandedComments, setExpandedComments] = useState({});

  const toggleReplies = (commentId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  useEffect(() => {
    if (selectedWriteup) {
      setSelectedWriteup(null);
    }
  }, [urlSelectedTab]);

  const [isTerminalBooted, setIsTerminalBooted] = useState(false);

  const handleBootTerminal = async () => {
    setFetchingTerminal(true);
    await createTerminal(false);
  };

  const [showMessage, setShowMessage] = useState(false);

  return (
    <>
      <Head>
        <title>Challenge - CTFGuide</title>
        <meta
          name="description"
          content="Cybersecurity made easy for everyone"
        />
        <style>
          @import
          url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
        </style>
      </Head>
      <FlagDialog />
      <PointsModal isOpen={isPointsModalOpen} setIsOpen={setIsPointsModalOpen} points={awardedPoints} />
      <div className='flex flex-col text-white overflow-x-auto overflow-y-hidden min-h-0 h-screen md:min-w-[64rem]'>
        <StandardNav alignCenter={false} />
        <main className="flex flex-grow p-2 gap-2 overflow-y-hidden flex-col md:flex-row">
          {isChallengeFullscreen && (
            <div className={`flex flex-col flex-1 bg-neutral-800 overflow-y-hidden rounded-md`}>
              <div className="flex shrink-0 p-1 items-center gap-1 bg-neutral-700 h-12 w-full overflow-x-auto">
                {Object.entries(tabs).map(([url, tab]) => (
                  <TabLink 
                    tabName={tab.text} 
                    selected={selectedTab === tab} 
                    url={`/challenges/${urlChallengeId}/${url}`} 
                    key={url} 
                    className="text-sm md:text-base px-2 md:px-4"
                  />
                ))}
              </div>
              {selectedWriteup ? (
                <WriteupModal isOpen={true} onClose={() => setSelectedWriteup(null)} writeup={selectedWriteup} />
              ) : (
                <selectedTab.element 
                  cache={cache} 
                  setCache={setCache} 
                  onWriteupSelect={handleWriteupSelect} 
                  fileIDName={fileIDName} // Pass fileIDName as prop
                  fileIDLink={fileIDLink} // Pass fileIDLink as prop
                />
              )}
              <div className='flex w-full h-full grow basis-0'></div>
              <div className="shrink-0 bg-neutral-800 h-12 w-full">
                <form action="" method="get" onSubmit={onSubmitFlag} className="flex p-1 gap-2 h-full">
                  <input 
                    name="flag" 
                    type="text" 
                    required 
                    placeholder="Enter flag submission here" 
                    className="text-white bg-neutral-900 border-neutral-600 h-full p-0 rounded-sm grow px-2 w-1/2 text-sm md:text-base" 
                  />
                  <input 
                    name="submitFlag" 
                    type="submit" 
                    value="Submit Flag" 
                    disabled={loadingFlagSubmit} 
                    className="h-full border border-green-500/50 hover:border-green-200/50 bg-green-600 hover:bg-green-500 disabled:bg-neutral-800 disabled:text-neutral-400 disabled:border-neutral-500/50 transition-all text-green-50 cursor-pointer disabled:cursor-default px-2 rounded-sm text-sm md:text-base" 
                  />
                </form>
              </div>
              <button
                onClick={() => {
                  setIsChallengeFullscreen(false);
                }}
                className="bg-neutral-700/50 hover:bg-neutral-700 text-white px-4 py-1 rounded mt-2 md:hidden"
              >
                <i className="fas fa-exchange-alt"></i> Switch to Terminal
              </button>
            </div>
          )}
          {!isChallengeFullscreen && (
            <div className={`flex md:hidden flex-col flex-1 bg-neutral-800 overflow-hidden rounded-md`}>
              <div className="grow bg-neutral-950 w-full overflow-hidden">
                <div className="h-full">
                  {foundTerminal && (
                    <div className="flex py-1  mb-4 text-xs">
                      <h1 className="text-xs font-semibold py-2  pl-2">
                        Username: {userName}
                        <button onClick={() => copyToClipboard(userName)} className="ml-2 text-blue-500 hover:text-blue-300">
                          <i className="fas fa-copy"></i>
                        </button>
                      </h1>
                      <h1 className="text-xs font-semibold py-2  pl-2">
                        Password: {password}
                        <button onClick={() => copyToClipboard(password)} className="ml-2 text-blue-500 hover:text-blue-300">
                          <i className="fas fa-copy"></i>
                        </button>
                      </h1>
                      <h1 className="text-xs ml-auto px-4 text-sm font-semibold py-2 line-clamp-1 pl-2">
                        Remaining Time: {formatTime(minutesRemaining)}
                        <i onClick={() => window.open(terminalUrl, '_blank')} className="cursor-pointer hover:text-yellow-500 ml-2 fas fa-expand text-white"></i>
                        {showMessage && (
                          <span className="bg-neutral-800 px-2 py-1 absolute right-5 top-32 max-w-[20rem] text-sm text-yellow-500">
                            Sometimes browsers block iframes, try opening the terminal in full screen if it the terminal is empty.
                            <button onClick={() => setShowMessage(false)} className="ml-2 text-red-500 hover:text-red-300">
                              Dismiss
                            </button>
                          </span>
                        )}
                      </h1>
                    </div>
                  )}
                  {fetchingTerminal ? (
                    <div className="flex mx-auto text-center justify-center items-center h-full">
                      <div>
                        <h1 className="text-white text-4xl"><i className="fas fa-spinner fa-spin"></i></h1>
                        <span className="text-white text-xl">{loadingMessage}</span>
                        <p className="text-white text-lg">If you see a black screen, please wait a few seconds and refresh the page.</p>
                      </div>
                    </div>
                  ) : (
                    isTerminalBooted ? (
                      <iframe src={terminalUrl} className="pl-2 pb-10 w-full h-full overflow-hidden " />
                    ) : (
                      <div className="flex mx-auto text-center justify-center items-center h-full">
                        <button
                          onClick={handleBootTerminal}
                          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
                        >
                          Boot Terminal
                        </button>
                      </div>
                    )
                  )}
                </div>
              </div>
              <button
                onClick={() => {
                  setIsChallengeFullscreen(true);
                }}
                className="bg-neutral-700/50 hover:bg-neutral-700 text-white px-4 py-1 rounded mt-2 md:hidden"
              >
                <i className="fas fa-exchange-alt"></i> Switch to Challenge
              </button>
            </div>
          )}
          <div className="hidden md:flex flex-col flex-1 bg-neutral-800 overflow-hidden rounded-md">
            <div className="grow bg-neutral-950 w-full overflow-hidden">
              <div className="h-full">
                {foundTerminal && (
                  <div className="flex">
                    <h1 className="text-sm font-semibold py-2 line-clamp-1 pl-2">
                      Username: {userName}
                      <button onClick={() => copyToClipboard(userName)} className="ml-2 text-blue-500 hover:text-blue-300">
                        <i className="fas fa-copy"></i>
                      </button>
                    </h1>
                    <h1 className="text-sm font-semibold py-2 line-clamp-1 pl-2">
                      Password: {password}
                      <button onClick={() => copyToClipboard(password)} className="ml-2 text-blue-500 hover:text-blue-300">
                        <i className="fas fa-copy"></i>
                      </button>
                    </h1>
                    <h1 className="text-sm ml-auto px-4 text-sm font-semibold py-2 line-clamp-1 pl-2">
                      Remaining Time: {formatTime(minutesRemaining)}
                      <i onClick={() => window.open(terminalUrl, '_blank')} className="cursor-pointer hover:text-yellow-500 ml-2 fas fa-expand text-white"></i>
                      {showMessage && (
                        <span className="bg-neutral-800 px-2 py-1 absolute right-5 top-32 max-w-[20rem] text-sm text-yellow-500">
                          Sometimes browsers block iframes, try opening the terminal in full screen if it the terminal is empty.
                          <button onClick={() => setShowMessage(false)} className="ml-2 text-red-500 hover:text-red-300">
                            Dismiss
                          </button>
                        </span>
                      )}
                    </h1>
                  </div>
                )}
                {fetchingTerminal ? (
                  <div className="flex mx-auto text-center justify-center items-center h-full">
                    <div>
                      <h1 className="text-white text-4xl"><i className="fas fa-spinner fa-spin"></i></h1>
                      <span className="text-white text-xl">{loadingMessage}</span>
                      <p className="text-white text-lg">If you see a black screen, please wait a few seconds and refresh the page.</p>
                    </div>
                  </div>
                ) : (
                  isTerminalBooted ? (
                    <iframe src={terminalUrl} className="pl-2 pb-10 w-full h-full overflow-hidden " />
                  ) : (
                    <div className="flex mx-auto text-center justify-center items-center h-full">
                      <button
                        onClick={handleBootTerminal}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
                      >
                        Boot Terminal
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      <ToastContainer
        position="top-right"
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
      <DeleteCommentModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={() => deleteComment(commentToDelete)}
      />
    </>
  )
}

function FlagDialog({ color, title, message }) {
  let [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog
      open={isOpen}
      onClose={() => undefined}
      className="relative z-50"
    >
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

      {/* Full-screen scrollable container */}
      <div className="fixed inset-0 w-screen overflow-y-auto">
        {/* Container to center the panel */}
        <div className="flex min-h-full items-center justify-center p-4">
          {/* The actual dialog panel  */}
          <Dialog.Panel className="mx-auto p-8 max-w-sm rounded bg-neutral-900 text-white">
            <Dialog.Title>{title}</Dialog.Title>
            <p>{message}</p>
            <button onClick={() => setIsOpen(false)}>Close</button>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog >
  )
}

function PointsModal({ isOpen, setIsOpen, points }) {
  const [visible, setVisible] = useState(false);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setTimeout(() => setFade(true), 10); // Small delay to trigger the transition
    } else {
      setFade(false);
      // setTimeout(() => setVisible(false), 500); // Match the duration of the transition
    }
  }, [isOpen]);

  return (
    <>
      {visible && (
        <>

          <Dialog open={isOpen} onClose={() => setIsOpen(false)} className={`relative z-50 transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}>
            <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
            <div className="fixed inset-0 w-screen overflow-y-auto">
              <Confetti
                width={window.innerWidth}
                height={window.innerHeight}
                recycle={false}
                numberOfPieces={800}
              />
              <div className="flex min-h-full items-center justify-center p-4">
                <Dialog.Panel className="mx-auto px-20 py-14 max-w-6xl rounded bg-neutral-900 text-white">
                  <div className="flex flex-col md:flex-row gap-x-10">
                    <div className="mb-4 md:mb-0">
                      <Dialog.Title className="text-3xl font-semibold">Nice work!</Dialog.Title>
                      <p className="text-xl">You have been awarded {points} points.</p>
                      <button onClick={() => setIsOpen(false)} className="mt-4 bg-blue-600 hover:bg-blue-400 text-white px-4 py-2 rounded">
                        Close
                      </button>
                    </div>
                    <div className="border-t md:border-t-0 md:border-l border-neutral-700 px-4">
                      <h1 className="mt-4 md:mt-0 text-xl font-semibold">BADGES</h1>
                      <p className="text-lg">You did not receive any new badges.</p>
                      <h1 className="text-xl mt-2 font-semibold">REWARD SUMMARY</h1>
                      <p className="text-lg"><span className="text-green-500">+{points}</span> points</p>
                    </div>
                  </div>
                </Dialog.Panel>
              </div>
            </div>
          </Dialog>
        </>
      )}
    </>
  );
}

function TabLink({ tabName, selected, url, className }) {
  const selectedStyle = selected ? 'text-white bg-neutral-600' : 'text-neutral-400';
  const icon = {
    'Comments': 'fas fa-comments text-green-500',
    'Leaderboard': 'fas fa-trophy text-yellow-500',
    'Writeups': 'fas fa-book text-indigo-500',
    'Hints': 'fas fa-question text-red-500',
    'Description': 'fas fa-info-circle text-blue-500',
    'AI': 'fas fa-robot text-orange-500',
  }[tabName] || 'fas fa-file-alt text-blue-500';

  return (
    <Link href={url} className={`flex justify-center items-center ${selectedStyle} hover:text-white transition-all duration-400 px-2 hover:bg-neutral-600 rounded-sm h-full ${className}`}>
      <i className={`${icon} w-6 mr-1 inline-flex`}></i>
      {tabName ?? 'This is a test button'}
    </Link>
  )
}

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
function HintsPage({ cache }) {
  const { challenge } = cache;
  const [hints, setHints] = useState([]);

  async function fetchHints() {
    const url = `${baseUrl}/challenges/${challenge.id}/getHints`;
    const data = await request(url, "GET", null);
    //console.log(data)
    if (data && data.success) {
      setHints(data.hintArray);
    }
  }

  useEffect(() => {
    if (challenge) fetchHints()
  }, [challenge])

  const showHint = async (i) => {
    // Check if the previous hint has been unlocked
    if (i > 0 && hints[i - 1].message === `Hint ${i}`) {
      toast.error("Please unlock the previous hint first.");
      return;
    }

    const url = `${baseUrl}/challenges/hints-update`;

    const body = {
      hintsUsed: i,
      challengeId: challenge.id,
    };

    const data = await request(url, "POST", body);
    //console.log(data);
    if (data && data.success) {
      let tmp = [...hints];
      tmp[i].message = data.hintMessage;
      setHints(tmp);
    } else {
      console.log('problem when fetching hints');
    }
  };

  return (
    <>
      <div className="grow bg-neutral-800 text-gray-50 p-3 overflow-y-auto">
        <h1 className="text-2xl font-semibold py-2 line-clamp-1">
          Hints
        </h1>
        <div >
          {hints.map((hint, idx) => {
            return (
              <div
                className="mb-2 w-full hover:cursor-pointer bg-[#212121] px-4 py-2 text-md opacity-75 transition-opacity transition-opacity duration-150 duration-75 hover:opacity-100"
                onClick={() => showHint(idx)}
              >
                <div className='flex place-items-center w-full'>
                  <h1 className='text-blue-500 px-2 mr-2 text-xl'>Hint {idx + 1}</h1>
                  <div className='ml-auto'>
                    <span className="mt-1 text-sm text-white bg-neutral-700 px-2 py-1 rounded-sm">
                      {Math.abs(hint.penalty)}% penalty
                    </span>
                  </div>
                </div>
                <div className='px-2'>
                  {hint.message === `Hint ${idx + 1}` ? 'Click to unlock' : hint.message}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="shrink-0 bg-neutral-800 h-10 w-full"></div>
    </>
  )
}


function DescriptionPage({ cache, fileIDName, fileIDLink }) {


  const { challenge } = cache;

  const [solvesData, setSolvesData] = useState([]);
  const [creatorMode, setCreatorMode] = useState(false); // Add state for creator mode

  const [insights, setInsights] = useState({
    solves: 0,
    attempts: 0,
    solvesLast30Days: 0,
    attemptsLast30Days: 0,
  });

  useEffect(() => {
    const fetchSolvesData = async () => {
      try {
        const response = await request(`${process.env.NEXT_PUBLIC_API_URL}/${challenge.id}/insights/solvesLast10Days`, 'GET', null);
        setSolvesData(response);
        console.log(response);
      } catch (error) {
        console.error('Failed to fetch solves data: ', error);
      }
    };

    const fetchCreatorMode = async () => {
      try {
        const response = await request(`${process.env.NEXT_PUBLIC_API_URL}/account`, 'GET', null);
        setCreatorMode(response.creatorMode);
        console.log(response.creatorMode);
      } catch (error) { 
        console.error('Failed to fetch creator mode: ', error);
      }
    };

    const fetchInsights = async () => {
      try {
        const response = await request(`${process.env.NEXT_PUBLIC_API_URL}/${challenge.id}/insights`, 'GET', null);
        setInsights(response);
        console.log(response);
      } catch (error) {
        console.error('Failed to fetch solves data: ', error);
      }
    };

    fetchSolvesData();
    fetchInsights();
    fetchCreatorMode();
  }, [challenge]);

  const [challengeData, setChallengeData] = useState(null);
  const [authorPfp, setAuthorPfp] = useState(null);
  const { username } = useContext(Context);
  const colorText = {
    'BEGINNER': 'bg-blue-500 text-blue-50',
    'EASY': 'bg-green-500 text-green-50',
    'MEDIUM': 'bg-orange-500 text-orange-50',
    'HARD': 'bg-red-500 text-red-50',
    'INSANE': 'bg-purple-500 text-purple-50',
  };

  async function upvote() {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/challenges/${challenge.id}/upvote`;
    const response = await request(url, "POST", {});
    if (!response || !response.success) {
      console.log("unable to upvote");
      return;
    }
    setChallengeData({ ...challengeData, upvotes: response.upvotes, downvotes: response.downvotes });
  }

  async function downvote() {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/challenges/${challenge.id}/downvote`;
    const response = await request(url, "POST", {});
    if (!response || !response.success) {
      console.log("unable to upvote");
      return;
    }
    setChallengeData({ ...challengeData, upvotes: response.upvotes, downvotes: response.downvotes });
  }

  useEffect(() => {
    if (challenge) {
      setChallengeData(challenge);
      fetchAuthorPfp(challenge.creator);
    }
  }, [challenge]);

  async function fetchAuthorPfp(username) {
    try {
      const endPoint = `${process.env.NEXT_PUBLIC_API_URL}/users/${username}/pfp`;
      const result = await request(endPoint, "GET", null);
      if (result) {
        setAuthorPfp(result);
      } else {
        setAuthorPfp(`https://robohash.org/${username}.png?set=set1&size=150x150`);
      }
    } catch (err) {
      console.log('failed to get profile picture');
    }
  }

  return (
    <>
      <div className="grow bg-neutral-800 text-gray-50 p-3 overflow-y-auto">
        <h1 className="flex align-middle text-2xl font-semibold py-2 line-clamp-1">
          {challenge ? challenge.title : <Skeleton baseColor="#333" highlightColor="#666" />}
          <div className="ml-auto rounded-sm text-right text-2xl flex items-center">
            <div onClick={upvote} className="cursor-pointer px-2 hover:bg-neutral-700 rounded-sm">
              <i className="mr-2 fas fa-arrow-up text-green-500 cursor-pointer"></i>
              {challengeData && challengeData.upvotes !== undefined ? challengeData.upvotes : <Skeleton width={20} />}
            </div>
            <div onClick={downvote} className="cursor-pointer px-2 hover:bg-neutral-700 rounded-sm">
              <i className="mr-2 fas fa-arrow-down text-red-500 cursor-pointer"></i>
              {challengeData && challengeData.downvotes !== undefined ? challengeData.downvotes : <Skeleton width={20} />}
            </div>
          </div>
        </h1>
        <h2 className="flex flex-wrap gap-2 pb-2">
          {challenge ? (
            <>
              {<Tag bgColor={colorText[challenge.difficulty]} textColor="font-bold">{challenge.difficulty.toLowerCase()}</Tag>}
              {challenge.category.map((s) => <Tag key={s}>{s}</Tag>)}
            </>)
            : <Skeleton baseColor="#333" highlightColor="#666" width='20rem' />}
        </h2>

        <h2 className="flex gap-2 pb-8">
          {challenge ? <>
            <div className="flex items-center">
              <img src={authorPfp} alt="Author's profile picture" className="bg-neutral-700 h-8 w-8 rounded-full" />
              <Link href={`/users/${challenge.creator}`} className="text-blue-500 pr-3 hover:underline ml-2">{challenge.creator}</Link>
            </div>
            <p className="flex text-neutral-200 opacity-70 items-center text-sm">
              <i className="fas fa-solid fa-eye mr-2 text-lg"></i>
              {challenge.views}

            </p>
          </>
            : <Skeleton baseColor="#333" highlightColor="#666" width='20rem' />}
        </h2>

        <ReactMarkdown></ReactMarkdown>
        {challenge ? <MarkdownViewer content={challenge.content}></MarkdownViewer> : <Skeleton baseColor="#333" highlightColor="#666" count={8} />}
   
            <hr className="border-neutral-700 mt-4"></hr>
            <h1 className="text-xl font-semibold mt-4">Associated Files</h1>
            {fileIDName && fileIDLink ? (
              fileIDName !== "This challenge does not have any associated files." ? (
                <a href={fileIDLink} className="mt-1 bg-neutral-700/50 hover:bg-neutral-700/90 duration-100 hover:cursor-pointer px-5 py-2 w-full text-white flex mx-auto items-center text-blue-500" target="_blank" rel="noopener noreferrer">
                  <i className="fas fa-file-alt text-blue-500 mr-2"></i>
                  {fileIDName}
                </a>
              ) : (
                <p>{fileIDName}</p>
              )
            ) : (
              <p>You may need to boot the terminal to see the associated files.</p>
            )}
            <hr className="border-neutral-700 mt-4"></hr>
            {creatorMode && (
              <>
                <hr className="border-neutral-700 mt-4"></hr>
                <div className="w-full mt-10 bg-neutral-700/50 hover:bg-neutral-700/90 duration-100 rounded-sm text-white mx-auto items-center text-blue-500">
                  <div className="bg-neutral-800/40 px-4 py-1 pb-3">
                    <h1 className="text-lg mt-2"><i className="fas fa-lightbulb mr-2"></i>Creator Insights</h1>
                  </div>
                  <div className="grid grid-cols-4 w-full mt-2 px-5 py-2">
                    <div>
                      <h1 className="text-md">Solves</h1>
                      <p className="text-xl">{insights.solves}</p>
                    </div>
                    <div>
                      <h1 className="text-md">Attempts</h1>
                      <p className="text-xl">{insights.attempts}</p>
                    </div>
                    <div>
                      <h1 className="text-md">Solves <span className="text-neutral-500 text-sm">(30d)</span></h1>
                      <p className="text-xl text-white">{insights.solvesLast30Days}</p>
                    </div>
                    <div>
                      <h1 className="text-md">Attempts <span className="text-neutral-500 text-sm">(30d)</span></h1>
                      <p className="text-xl text-white">{insights.attemptsLast30Days}</p>
                    </div>
                  </div>
                  <br />
                  <LineChart className="mb-3" width={600} height={300} data={solvesData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                    <Line type="monotone" dataKey="solves" stroke="#8884d8" />
                  </LineChart>
                  <br />
                </div>
              </>
            )}
      </div >
      <div className="shrink-0 bg-neutral-800 h-10 w-full"></div>
    </>
  )
}



function Tag({ bgColor = 'bg-neutral-700', textColor = 'text-neutral-50', children }) {
  return <p className={`${bgColor} ${textColor} capitalize rounded-sm px-2`}>{children}</p>
}

function WriteUpPage({ cache, setCache, onWriteupSelect }) {
  const { challenge } = cache;
  const router = useRouter();
  const [writeups, setWriteups] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [solvedChallenges, setSolvedChallenges] = useState([]);

  useEffect(() => {
    if (!challenge) return;

    // Fetch writeups for the challenge
    const fetchWriteups = async () => {
      //toast.info('Fetching writeups...');
      try {
        const response = await request(`${process.env.NEXT_PUBLIC_API_URL}/challenges/${challenge.id}/writeups`, "GET", null);
        if (response.length > 0) {
          setWriteups(response);
          //   toast.success('Successfully fetched writeups');
        } else {
          // toast.error('Failed to fetch writeups: SEE CONSOLE', response);
          console.error('Failed to fetch writeups:', response);
        }

      } catch (error) {
        //  console.error('Error fetching writeups:', error);
      }
    };

    fetchWriteups();
  }, [challenge]);

  useEffect(() => {
    // Fetch solved challenges for the user
    const fetchSolvedChallenges = async () => {
      try {
        const accountResponse = await request(`${process.env.NEXT_PUBLIC_API_URL}/account`, "GET", null);
        const solvedChallengesResponse = await request(`${process.env.NEXT_PUBLIC_API_URL}/users/${accountResponse.username}/solvedChallenges`, "GET", null);
        setSolvedChallenges(solvedChallengesResponse);
      } catch (error) {
        console.error('Error fetching solved challenges:', error);
      }
    };

    fetchSolvedChallenges();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWriteup, setSelectedWriteup] = useState(false);
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);


  const upvoteWriteup = async (writeupId) => {
    try {
      const response = await request(`${process.env.NEXT_PUBLIC_API_URL}/writeups/${writeupId}/upvote`, 'POST', { "message": "Upvoted writeup" });
      if (response.success) {
        setUpvotes(response.upvotes);
        setDownvotes(response.downvotes);
      } else {
        console.error("Failed to upvote:", response.message);
      }
    } catch (error) {
      console.error("Error upvoting writeup:", error);
    }
  };

  const downvoteWriteup = async (writeupId) => {
    try {
      const response = await request(`${process.env.NEXT_PUBLIC_API_URL}/writeups/${writeupId}/downvote`, 'POST', { "message": "Downvoted writeup" });
      if (response.success) {
        setUpvotes(response.upvotes);
        setDownvotes(response.downvotes);
      } else {
        console.error("Failed to downvote:", response.message);
      }
    } catch (error) {
      console.error("Error downvoting writeup:", error);
    }
  };


  const [temp, setTemp] = useState(null);


  const openModal = async (writeup) => {
    try {
      
      const url = `${process.env.NEXT_PUBLIC_API_URL}/writeups/fetch/${temp.id}`;
      const response = await request(url, "GET", null);
      temp.content = response.content;
      setUpvotes(response.upvotes);
      setDownvotes(response.downvotes);
      setSelectedWriteup(temp);
    } catch(err) {
      console.log(err);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedWriteup(null);
  };
  return (
    <>
      <div className="flex">
        <div className="grow bg-neutral-800 text-gray-50 p-3 overflow-y-auto">
          <h2 className="text-2xl font-semibold pt-2 flex items-center">Writeups           <span className="bg-neutral-600 px-1 text-sm ml-2"><i className="fas fa-flask"></i> Experimental Feature</span>
          </h2>
        </div>
        <div className="ml-auto">
          <button onClick={() => setIsCreating(true)} className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-2 py-1 mt-5 text-sm mr-4">New Draft</button>
        </div>
      </div>
      <div className="px-4 overflow-auto">
        {writeups.map((writeup, index) => (
          <div key={index} onClick={() =>  {
            setTemp(writeup);
            setIsConfirmModalOpen(true);

          }} className='mb-2 bg-neutral-700/50 hover:bg-neutral-700/90 duration-100 hover:cursor-pointer px-5 py-2 w-full text-white flex mx-auto '>
            <div className='w-full flex'>
              <div>
                <h3 className="text-xl">{writeup.title}</h3>
                <p className="text-sm text-blue-500 font-semibold" onClick={() => window.location.href = `../../users/${writeup.user.username}`}>@{writeup.user.username}</p>

              </div>
              <div className="ml-auto mt-2">
                <p className="text-sm text-right hidden">{writeup.views} views</p>
                <div className="space-x-2 text-right text-lg">
                  <i className="fas fa-arrow-up text-green-500 cursor-pointer"></i> {writeup.upvotes}
                  <i className="fas fa-arrow-down text-red-500 cursor-pointer"></i> {writeup.downvotes}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {!writeups.length && (
        <div className="px-3">
          <div className="w-full mx-auto mt-2 flex rounded-sm bg-neutral-900 py-2.5">
            <div className="my-auto mx-auto text-center pt-4 pb-4 text-xl text-white">
              <i className="text-4xl fas fa-exclamation-circle mx-auto text-center text-neutral-700/80"></i>
              <p className="text-xl">Looks like no writeups have been made for this challenge yet.</p>
              <p className="text-sm">Maybe you could create one?</p>
            </div>
          </div>
        </div>
      )}
      <div className="shrink-0 bg-neutral-800 h-10 w-full"></div>

      {selectedWriteup && (
        <Dialog
          open={isModalOpen}
          onClose={closeModal}
          className="fixed inset-0 z-10 overflow-y-auto"
        >
          <div className="flex items-center justify-center min-h-screen px-4">
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
            <div className="relative bg-neutral-800 text-white w-full  rounded max-w-3xl mx-auto p-6">


              <div className="flex">

                <div>
                  <h1 className='text-2xl'>{selectedWriteup.title}</h1>
                  <p>
                    Authored by <span onClick={() => window.location.href = `../../users/${selectedWriteup.user.username}`} className='text-blue-500 cursor-pointer'>{selectedWriteup.user.username}</span> for challenge <span onClick={() => window.location.href = `../../challenges/${selectedWriteup.challengeId}`} className='text-yellow-500 cursor-pointer'>{selectedWriteup.title}</span>.
                  </p>
                </div>
                <div className="ml-auto">
                  <button className="px-2 rounded-full bg-green-700 hover:bg-green-600" onClick={() => upvoteWriteup(selectedWriteup.id)}>
                    <i className="fas fa-arrow-up"></i> {upvotes}
                  </button>
                  <button className="px-2 rounded-full bg-red-700 hover:bg-red-600 ml-2" onClick={() => downvoteWriteup(selectedWriteup.id)}>
                    <i className="fas fa-arrow-down"></i> {downvotes}
                  </button>
                </div>
              </div>

              <div className="mt-2 text-white overflow-auto">
                <MarkdownViewer content={selectedWriteup.content} />
              </div>







              <button className='mt-6 bg-neutral-700 hover:bg-neutral-600 px-4 py-2 rounded-sm' onClick={closeModal}>Close</button>





            </div>


          </div>
        </Dialog>
      )}

      {isConfirmModalOpen && (
        <Dialog
          open={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          className="fixed inset-0 z-10 overflow-y-auto"
        >
          <div className="flex items-center justify-center min-h-screen px-4">
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
            <div className="relative bg-neutral-800 text-white w-full max-w-xl mx-auto p-6 rounded">
              <Dialog.Title className="text-xl font-semibold"><i className="fas fa-exclamation-triangle text-yellow-500 mr-2"></i>Are you sure you want to view this writeup?</Dialog.Title>
              <p className="mt-2 mb-4">You will not be able to get points for this challenge if you view this writeup. Do you want to continue?</p>
              <button onClick={() => {
                setIsConfirmModalOpen(false);
                openModal(selectedWriteup);
              }} className=" bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-2 rounded border-none">Continue</button>
                         <button onClick={() => setIsConfirmModalOpen(false)} className="ml-2 border-none bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded">Nevermind</button>

            </div>
              </div>
            </Dialog>
          )}

      
      <Menu open={isCreating} setOpen={setIsCreating} solvedChallenges={solvedChallenges} />
    </>
  );
}


function LeaderboardPage({ cache, setCache }) {



  const router = useRouter();
  const [selectedWriteup, setSelectedWriteup] = useState(null);

  const [urlChallengeId, urlSelectedTab] = (router ?? {})?.query?.id ?? [undefined, undefined];


  useEffect(() => {
    (async () => {
      if (cache['leaderboard-page']) {
        return;
      }
      setCache('leaderboard-page', {});
    })();
  })



  // START OF CREATE FUNCTIONALITY
  const [isCreating, setIsCreating] = useState(false);
  const [solvedChallenges, setSolvedChallenges] = useState([]);
  useEffect(() => {
    try {
      request(`${process.env.NEXT_PUBLIC_API_URL}/account`, "GET", null)
        .then((data) => {

          request(`${process.env.NEXT_PUBLIC_API_URL}/users/${data.username}/solvedChallenges`, "GET", null).then(challenges => {
            console.log("cow")
            console.log(challenges)
            challenges.forEach((challenge) => (
              console.log(challenge.slug)
            ))
            setSolvedChallenges(challenges)

          })
        })
        .catch((err) => {
          console.log(err);
        });


    } catch (error) { }
  }, []);
  // END OF CREATE FUNCTIONALITY

  // START OF FETCH WRITEUP FUNCTIONALITY
  const [leaderboard, setLeaderboardData] = useState([]);
  useEffect(() => {
    console.log(`Fetching writeup data for challenge ${urlChallengeId}`)

    try {
      request(`${process.env.NEXT_PUBLIC_API_URL}/challenges/${urlChallengeId}/leaderboard`, "GET", null)
        .then((data) => {
          console.log(`Leaderboard Data: ${JSON.stringify(data)}`)
          try {
            setLeaderboardData(data)
          } catch (err) {
            console.log("Error loading leaderboard data.")
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) { }
  }, []);

  return (
    <>
      <div className="flex">


        <div className="grow bg-neutral-800 text-gray-50 p-3 overflow-y-auto">
          <h2 className="text-2xl font-semibold pt-2">Leaderboards</h2>
        </div>






      </div>

      <div className="grid grid-cols-3">
        <div className="">

        </div>
      </div>

      {leaderboard.length > 0 ? (
        leaderboard.slice(0, 10).map((entry, index) => {
          let color;
          switch (index) {
            case 0:
              color = "from-yellow-700 to-yellow-800"; // gold
              break;
            case 1:
              color = "from-gray-700 to-gray-800"; // silver
              break;
            case 2:
              color = "from-orange-800 to-orange-900"; // bronze
              break;
            default:
              color = "bg-neutral-700"; // default color for others
          }
          return (
            <div className="px-3" key={index}>
              <div className={`flex justify-between items-center py-2 px-2 bg-gradient-to-r ${color} rounded-lg my-2`}>
                <div className="flex items-center justify-between align-middle">
                  <img
                    src={entry.user.profileImage || `https://robohash.org/${entry.user.username}.png?set=set1&size=150x150`}
                    className="w-8 h-8 mr-2 rounded-full"
                    alt={`${entry.user.username}'s profile`}
                  />
                  <span className="text-2xl font-bold">{index + 1}.</span>
                  <span className="ml-2 text-xl font-semibold text-white">
                    <Link href={`/users/${entry.user.username}`}>
                      {entry.user.username}
                    </Link>
                  </span>
                </div>
                <div className="text-xl font-semibold">{entry.points} points</div>
              </div>
            </div>
          )
        })
      ) : (
        <div className="px-3">
          <div className="flex justify-center items-center py-2 px-2 bg-neutral-900 rounded-lg my-2">
            <div className="text-sm text-white">

              <p className="text-center"> <img className="w-1/6 mx-auto" src="../../lbmissing.svg"></img></p>

              <p className="text-lg mb-4"> Nobody has solved this challenge yet - be the first!</p>
            </div>
          </div>
        </div>
      )}
      <div className="shrink-0 bg-neutral-800 h-10 w-full"></div>
    </>
  )
}

function CommentsPage({ cache }) {
  const { challenge } = cache;
  const [newComment, setNewComment] = useState('');
  const [hasReply, configReply] = useState(false);
  const [reply, setReply] = useState({});
  const [replyingPerson, setReplyingTo] = useState('');

  const [replyingId, setReplyingId] = useState('');
  const [comments, setComments] = useState([]);
  const commentBoxRef = useRef(null); // Add a ref for the comment box

  useEffect(() => {
    if (!challenge) {
      return;
    }
    (async () => {
      try {
        const getCommentsResult = await request(`${process.env.NEXT_PUBLIC_API_URL}/challenges/${challenge.id}/comments`, "GET", null);
        setComments(getCommentsResult.result);
      } catch (error) {
        console.error("Failed to fetch comments: " + error);
      }
    })();
  }, [challenge]);

  const handleReplySubmit = async (commentId, replyText) => {
    // Implement API call to submit reply
    console.log(`Reply to ${commentId}:`, replyText);
    setReply({ ...reply, [commentId]: '' });
    setExpandedComments((prev) => ({
      ...prev,
      [commentId]: true,
    }));
  };

  const replyingTo = async (commentId, username) => {
    configReply(true);
    setReplyingTo(username);
    setReplyingId(commentId);
    // Scroll to the comment box
    commentBoxRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const cancelReply = async () => {
    configReply(false);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCommentSubmit = async (e) => {
    if (!newComment) return;
    e.preventDefault();
    if (!newComment.trim()) return; // Prevent empty comments

    setIsSubmitting(true); // Set loading state to true

    try {
      let payload = { content: newComment };
      if (hasReply) {
        payload = { content: newComment, parent: replyingId };
      }

      const response = await request(`${process.env.NEXT_PUBLIC_API_URL}/challenges/${challenge.id}/comments`, "POST", payload);
      setNewComment('');
      const getCommentsResult = await request(`${process.env.NEXT_PUBLIC_API_URL}/challenges/${challenge.id}/comments`, "GET", null);
      setComments(getCommentsResult.result);
      if (response.success) {
        console.log('Comment submitted:', response);
        setNewComment(''); // Clear the input after successful submission
        if (hasReply) {
          setExpandedComments((prev) => ({
            ...prev,
            [replyingId]: true,
          }));
        }
      } else {
        console.error('Failed to submit comment:', response.error);
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false); // Set loading state to false
    }
  };

  const handleUpvote = async (commentId) => {
    try {
      const response = await request(`${process.env.NEXT_PUBLIC_API_URL}/challenges/comments/${commentId}/upvote`, "POST", {});
      if (response.success) {
        const updatedComments = comments.map(comment => {
          if (comment.id === commentId) {
            return { ...comment, upvotes: response.upvotes, downvotes: response.downvotes };
          }
          return comment;
        });
        setComments(updatedComments);
      } else {
        console.error('Failed to upvote comment:', response.message);
      }
    } catch (error) {
      console.error('Error upvoting comment:', error);
    }
  };

  const handleDownvote = async (commentId) => {
    try {
      const response = await request(`${process.env.NEXT_PUBLIC_API_URL}/challenges/comments/${commentId}/downvote`, "POST", {});
      if (response.success) {
        const updatedComments = comments.map(comment => {
          if (comment.id === commentId) {
            return { ...comment, upvotes: response.upvotes, downvotes: response.downvotes };
          }
          return comment;
        });
        setComments(updatedComments);
      } else {
        console.error('Failed to downvote comment:', response.message);
      }
    } catch (error) {
      console.error('Error downvoting comment:', error);
    }
  };

  // Helper function to organize comments into a tree structure
  const organizeComments = (comments) => {
    const commentMap = {};
    comments.forEach(comment => {
      comment.replies = [];
      commentMap[comment.id] = comment;
    });

    const rootComments = [];
    comments.forEach(comment => {
      if (comment.parentId) {
        if (commentMap[comment.parentId]) {
          commentMap[comment.parentId].replies.push(comment);
        }
      } else {
        rootComments.push(comment);
      }
    });

    return rootComments;
  };

  const [expandedComments, setExpandedComments] = useState({});

  const toggleReplies = (commentId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  // Recursive component to render comments and their replies
  const Comment = ({ comment }) => {
    const { username } = useContext(Context);
    const isExpanded = expandedComments[comment.id] || false;

    return (
      <div className="my-2 p-2 bg-neutral-800  group transition-all duration-300">
        <div className="flex">
          <div className="flex items-center">
            <div className="mr-2 text-md text-center text-neutral-400 bg-neutral-700/10 px-1 rounded-md">
              <button className="hover:text-neutral-600" onClick={() => handleUpvote(comment.id)}>
                <i className="fas fa-arrow-up"></i> <span>{comment.upvotes}</span>
              </button>
              <br />
              <button className="hover:text-neutral-600" onClick={() => handleDownvote(comment.id)}>
                <i className="fas fa-arrow-down"></i> <span>{comment.downvotes}</span>
              </button>
              <br></br>


            </div>

            <img
              src={comment.profilePicture || `https://robohash.org/${comment.username}.png?set=set1&size=150x150`}
              className="w-8 h-8 rounded-full"
              alt={`${comment.username}'s profile`}
            />
            <span className="ml-2 text-lg font-semibold text-white">
              <a href={`/users/${comment.username}`} className={`hover:text-neutral-10 ${comment.role === 'PRO' ? 'bg-gradient-to-br from-orange-300 to-yellow-300 bg-clip-text text-transparent' : ''}`}>
                {comment.username}
              </a>
              {comment.role === 'ADMIN' && (
                <>
                  <span className="bg-red-600 px-1 text-sm ml-2"><i className="fas fa-code fa-fw"></i> developer</span>
                </>
              )}
              {comment.role === 'PRO' && (
                <>
                  <span className="ml-2 bg-gradient-to-br from-orange-400 to-yellow-600 px-1 text-sm"><i className="fas fa-crown fa-fw"></i> pro</span>
                </>
              )}
              <span className="ml-2 text-sm font-medium"> {new Date(comment.createdAt).toLocaleString()}</span>

              {username && username === comment.username && (
                <button onClick={() => openDeleteModal(comment.id)} className="ml-2 text-sm text-red-500"><i className="fas fa-trash-alt"></i></button>
              )}
            </span>
          </div>
        </div>
        <p className="text-neutral-200 pl-12">{comment.content}</p>
        {isExpanded && comment.replies.length > 0 && (
          <div className="pl-4 border-l-2 border-neutral-700">
            {comment.replies.map((reply) => <Comment key={reply.id} comment={reply} />)}
          </div>
        )}
        <div className="ml-12 flex">
          <button onClick={() => replyingTo(comment.id, comment.username)} className="text-sm text-blue-500">Reply</button>
          {comment.replies.length > 0 && (
            <button onClick={() => toggleReplies(comment.id)} className="ml-2 text-sm text-blue-500">
              {isExpanded ? 'Hide Replies' : 'Show Replies'}
            </button>
          )}



        </div>
      </div>
    );
  };

  const CommentsSection = ({ comments }) => {
    const organizedComments = organizeComments(comments);

    return (
      <div>
        {organizedComments.length > 0 ? (
          organizedComments.map((comment, index) => (
            <Comment key={index} comment={comment} />
          ))
        ) : (
          <p className="text-neutral-400">No comments yet. Be the first to comment!</p>
        )}
      </div>
    );
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  const openDeleteModal = (commentId) => {
    setCommentToDelete(commentId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCommentToDelete(null);
  };

  const deleteComment = async (commentId) => {
    try {
      const response = await request(`${process.env.NEXT_PUBLIC_API_URL}/challenges/${challenge.id}/comments/${commentId}`, "DELETE", {});

      //resync comments
      const getCommentsResult = await request(`${process.env.NEXT_PUBLIC_API_URL}/challenges/${challenge.id}/comments`, "GET", null);
      setComments(getCommentsResult.result);
      toast.success("Comment deleted successfully.");

    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      closeDeleteModal();
    }
  };

  return (
    <>
      <div className="grow bg-neutral-800 text-gray-50 p-3 overflow-y-auto">
        <div className="flex items-center">
          <h1 className="text-2xl font-semibold py-2 line-clamp-1">Comments</h1>
          <span className="bg-neutral-600 px-1 text-sm ml-2"><i className="fas fa-flask"></i> Experimental Feature</span>
        </div>


        <form onSubmit={handleCommentSubmit} className="mb-4  bottom-0 left-0">
          <p className="text-red-500 hidden">Hmm, that doesn't seem very nice. Please read our terms of service. </p>
          <div className="flex w-full">
            <div className="w-full">
              <input
                onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className=" text-black p-2 w-full bg-neutral-700 border-none text-white placeholder-white"
                ref={commentBoxRef} // Attach the ref to the input
              />
              {hasReply &&
                <div className="flex w-full text-left px-2 bg-neutral-500/10 border-none py-1">
                  Replying to <span className="text-yellow-500 ml-1">{replyingPerson}</span>
                  <button className="ml-auto text-right" onClick={cancelReply}><i className="fas fa-times"></i></button>
                </div>
              }
            </div>
            <button type="submit" className="bg-neutral-600 hover:bg-blue-500 border-none text-white px-4 text-xl h-10">
              {isSubmitting ? <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg> : <i className="fas fa-paper-plane"></i>}
            </button>
          </div>
        </form>
        {challenge && comments && (
          <CommentsSection comments={comments} />

        )}
      </div>
      <div className="shrink-0 bg-neutral-800 h-10 w-full"></div>
      <DeleteCommentModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={() => deleteComment(commentToDelete)}
      />
    </>
  );
}


function AIPage() {
  return (
    <div>
          <div className="grow bg-neutral-800 text-gray-50 p-3 overflow-y-auto">
          <div>
        <h1 className=" text-2xl font-semibold py-2">
        CTFGuide AI
       </h1>
        </div>
       <div className="flex items-center align-middle gap-x-4">
        
        <p className="text-white text-lg">CTFGuide AI is a powerful tool that can help you solve challenges. It can be used to help you solve challenges.</p>
       </div>
       
       <p className="mx-auto text-center mt-4 bg-neutral-700 p-4 rounded-md">
       <ul className="list-none pl-6">
          <li className="flex items-start"><i className="fa fa-check mr-2 mt-1"></i> <span>Using CTFGuideAI is the same as using all three hints.</span></li>
          <li className="flex items-start"><i className="fa fa-check mr-2 mt-1"></i> <span>CTFGuideAI do not have access to solutions, meaning it will only guide you.</span></li>
          <li className="flex items-start"><i className="fa fa-check mr-2 mt-1"></i> <span>CTFGuideAI has access to your terminal.</span></li>
        </ul>
       </p>

       <p className="mt-4">Currently, CTFGuideAI is in closed alpha. If you want to be notified when it is open to the public, please fill out the form below.</p>
       <div className="mt-4" >
         <div className="mb-4">
           <label htmlFor="role" className="block text-sm font-medium text-white">Your Role</label>
           <select id="role" name="role" className="mt-1 block bg-neutral-700 w-full pl-3 pr-10 py-2  focus:outline-none ring-0  sm:text-sm rounded-md">
             <option value="">Select your role</option>
             <option value="student">Student</option>
             <option value="teacher">Teacher</option>
             <option value="workforce">In the Workforce</option>
           </select>
           <label htmlFor="why" className="mt-4 block text-sm font-medium text-white">Why do you want to use CTFGuideAI?</label>
           <textarea id="why" name="why" className="mt-1 block bg-neutral-700 w-full pl-3 pr-10 py-2  focus:outline-none ring-0  sm:text-sm rounded-md"></textarea>

         </div>
       
         <button type="submit" onClick={() => {
          toast.success("Thank you for your interest in CTFGuideAI! We will notify you when it is ready.");
         }} className=" flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium  duration-100 text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
           Submit
         </button>
       </div>
       
       </div>
    </div>
  );
}

function DeleteCommentModal({ isOpen, onClose, onConfirm }) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded bg-neutral-900 text-white p-6">
          <Dialog.Title className="text-lg font-semibold">Delete Comment</Dialog.Title>
          <p className="mt-2">Are you sure you want to delete this comment? This action cannot be undone.</p>
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={onClose} className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
            <button onClick={onConfirm} className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded">Delete</button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
