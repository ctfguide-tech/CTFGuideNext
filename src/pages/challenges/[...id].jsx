import { MarkdownViewer } from "@/components/MarkdownViewer";
import { StandardNav } from "@/components/StandardNav";
import request from "@/utils/request";
import { Dialog } from "@headlessui/react";
import { DocumentTextIcon } from "@heroicons/react/20/solid";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
import ReactMarkdown from "react-markdown";
import Menu from '@/components/editor/Menu';
import { comment } from "postcss";

import { getCookie } from '@/utils/request';
import { jwtDecode } from 'jwt-decode';
import api from '@/utils/terminal-api';


export default function Challenge() {
  const router = useRouter();


  // I hate this
  const [urlChallengeId, urlSelectedTab] = (router ?? {})?.query?.id ?? [undefined, undefined];


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
    'write-up': { text: 'Write Up', element: WriteUpPage, },
    'hints': { text: 'Hints', element: HintsPage, },
    'leaderboard': { text: 'Leaderboard', element: LeaderboardPage, },
    'comments': { text: 'Comments', element: CommentsPage, },

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
        console.log(submitChallengeResult)
        const { success, incorrect, error } = submitChallengeResult ?? {};
        if (error || !submitChallengeResult) {
          // An error occurred >:(
          alert(error);
          return;
        }
        if (incorrect) {
          // Incorrect
          alert(incorrect);
          return;
        }
        // Success
        alert(success);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingFlagSubmit(false);
      }
    })();
  }

  // ========================================= STEVES TERMINAL STUFF NO TOUCHING ====================================== 
  const [password, setPassword] = useState("N/A");
  const [containerId, setContainerId] = useState("");
  const [userName, setUserName] = useState(localStorage.getItem("username") || "");
  const [minutesRemaining, setMinutesRemaining] = useState(60);
  const [fetchingTerminal, setFetchingTerminal] = useState(true);
  const [foundTerminal, setFoundTerminal] = useState(false);
  const [terminalUrl, setTerminalUrl] = useState("");

  const createTerminal = async (skipToCheckStatus) => {
    const challenge = cache.challenge;
    const cookie = getCookie('idToken');

    const data = await api.buildDocketTerminal(challenge.id, cookie );
    //console.log(data)
    if (data) {

      setPassword(data.terminalUserPassword);
      setTerminalUrl(data.url);
      setUserName(data.terminalUserName);
      setContainerId(data.containerId);
      setFoundTerminal(true);
      setMinutesRemaining(60);
      setFetchingTerminal(false);

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
      await createTerminal(false);
    }
  }

  useEffect(() => {
    if(cache.challenge) {
      checkIfTerminalExists();
    }
  },[cache])


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
      <div className='flex flex-col min-w-[64rem] text-white overflow-x-auto overflow-y-hidden min-h-0 h-screen'>
        <StandardNav alignCenter={false} />
        <main className="flex flex-grow p-2 gap-2 overflow-y-hidden">
          <div className="flex flex-col flex-1 bg-neutral-800 overflow-y-hidden rounded-md">
            <div className="flex shrink-0 p-1 items-center gap-1 bg-neutral-700 h-12 w-full">
              {Object.entries(tabs).map(([url, tab]) => <TabLink tabName={tab.text} selected={selectedTab === tab} url={`/challenges/${urlChallengeId}/${url}`} key={url} />)}
            </div>
            {/* Only this element should rerender on tab switch */}
            {<selectedTab.element cache={cache} setCache={setCache} />}
          </div>
          <div className="flex flex-col flex-1 bg-neutral-800 overflow-hidden rounded-md">
            <div className="grow bg-neutral-950 w-full overflow-hidden">
              <div className="h-full">
                <div className="flex">
                 <h1 className="text-sm font-semibold py-2 line-clamp-1 pl-2">Username: {userName}</h1>
                  <h1 className="text-sm font-semibold py-2 line-clamp-1 pl-2">Password: {password}</h1>
                  <h1 className="text-sm font-semibold py-2 line-clamp-1 pl-2">Remaining Time: {minutesRemaining}</h1>
                 <div className="ml-auto flex px-2">

                 <h1 className="text-sm font-semibold py-2 line-clamp-1 pl-2"><i className="fas fa-sync-alt"></i> Restart Terminal </h1>
                  <h1 className="text-sm font-semibold py-2 line-clamp-1 pl-2"><i className="fas fa-power-off"></i> Shutdown Terminal </h1>

              </div>
              

                </div>
                <div className="flex bg-yellow-900">
                  <h1 className="text-sm font-semibold line-clamp-1 pl-2">Our terminal infrastructure is experiencing heavy load. Terminals may feel slow.</h1>
              
              

                </div>
                <iframe src={terminalUrl} className="pl-2 pb-10 w-full h-full overflow-hidden "   />
              </div>
            </div>
            
            <div className="shrink-0 bg-neutral-800 h-12 w-full">
              <form action="" method="get" onSubmit={onSubmitFlag} className="flex p-1 gap-2 h-full">
                <input name="flag" type="text" required placeholder="Flag..." className="text-black h-full p-0 rounded-sm grow px-2 w-1/2" />
                <input name="submitFlag" type="submit" value="Submit Flag" disabled={loadingFlagSubmit} className="h-full border border-green-500/50 hover:border-green-200/50 bg-green-600 hover:bg-green-500 disabled:bg-neutral-800 disabled:text-neutral-400 disabled:border-neutral-500/50 transition-all text-green-50 cursor-pointer disabled:cursor-default px-2 rounded-sm" />
              </form>
            </div>
          </div>
        </main >
      </div>
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

function TabLink({ tabName, selected, url }) {
  const selectedStyle = selected ? 'text-white bg-neutral-600' : 'text-neutral-400';
  return (
    <Link href={url} className={`flex justify-center items-center ${selectedStyle} hover:text-white px-2 hover:bg-neutral-600 rounded-sm h-full`}>
      <DocumentTextIcon className="text-blue-500 w-6 mr-1 inline-flex" />
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
    if(data && data.success) {
      setHints(data.hintArray);
    }
  }

  useEffect(() => {
    if(challenge) fetchHints()
  }, [challenge])

  const showHint = async (i) => {
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
      console.log('problem when feching hints');
    }
  };

  return (
    <>
      <div className="grow bg-neutral-800 text-gray-50 p-3 overflow-y-auto">
        <h1 className="text-2xl font-semibold py-2 line-clamp-1">
         Hints
        </h1>
      <div style={{padding: "5px", margin: "5px"}}>
              {hints.map((hint, idx) => {
                return (
                  <div
                    className="mb-2 mt-3 w-full border-l-2 border-yellow-600 hover:cursor-pointer bg-[#212121] px-4 py-2 text-md opacity-75 transition-opacity transition-opacity duration-150 duration-75 hover:opacity-100"
                    onClick={() => showHint(idx)}
                  >
                    <div style={{ maxWidth: '90%' }}>
                      
                      <p className="text-white">
                        <span className=" ">
                          {hint.message}
                        </span>
             
                      </p>
                    </div>
                    <span className="mt-1 text-sm text-white">
                      { Math.abs(hint.penalty) } point penalty
                    </span>
                  </div>
                );
              })}
      </div>
    </div>
      <div className="shrink-0 bg-neutral-800 h-10 w-full"></div>
    </>
  )
}


function DescriptionPage({ cache }) {
  const { challenge } = cache;
  const colorText = {
    'BEGINNER': 'bg-blue-500 text-blue-50',
    'EASY': 'bg-green-500 text-green-50',
    'MEDIUM': 'bg-orange-500 text-orange-50',
    'HARD': 'bg-red-500 text-red-50',
    'INSANE': 'bg-purple-500 text-purple-50',
  };
  return (
    <>
      <div className="grow bg-neutral-800 text-gray-50 p-3 overflow-y-auto">
        <h1 className="text-4xl font-semibold py-2 line-clamp-1">
          {challenge ? challenge.title : <Skeleton baseColor="#333" highlightColor="#666" />}
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
            <Link href={`/users/${challenge.creator}`} className="text-blue-500 pr-3 hover:underline">{challenge.creator} </Link>
            <p className="flex text-neutral-200 opacity-70 items-center text-sm">
              <i className="fas fa-solid fa-eye mr-2 text-lg"></i>
              {challenge.views}
              <i className="ml-4 mr-2 text-neutral-300 fas fa-solid fa-heart text-lg"></i>
              {challenge.upvotes}
            </p>
          </>
            : <Skeleton baseColor="#333" highlightColor="#666" width='20rem' />}
        </h2>
        <ReactMarkdown></ReactMarkdown>
        {challenge ? <MarkdownViewer content={challenge.content}></MarkdownViewer> : <Skeleton baseColor="#333" highlightColor="#666" count={8} />}
      </div >
      <div className="shrink-0 bg-neutral-800 h-10 w-full"></div>
    </>
  )
}



function Tag({ bgColor = 'bg-neutral-700', textColor = 'text-neutral-50', children }) {
  return <p className={`${bgColor} ${textColor} capitalize rounded-sm px-2`}>{children}</p>
}

function WriteUpPage({ cache, setCache }) {

  

  const router = useRouter();
  const [selectedWriteup, setSelectedWriteup] = useState(null);

  const [urlChallengeId, urlSelectedTab] = (router ?? {})?.query?.id ?? [undefined, undefined];


  useEffect(() => {
    (async () => {
      if (cache['write-page']) {
        return;
      }
      setCache('write-page', {});
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
  const [writeUp, setWriteUp] = useState([]);
  useEffect(() => {
    console.log(`Fetching writeup data for challenge ${urlChallengeId}`)

    try {
      request(`${process.env.NEXT_PUBLIC_API_URL}/challenges/${urlChallengeId}/writeups`, "GET", null)
        .then((data) => {
          console.log(`Writeup data: ${JSON.stringify(data)}`)
          setWriteUp(data)
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) { }
  }, []);

  return (
    <>
      <div className="flex">
        {!selectedWriteup && (
          <>
            <div className="grow bg-neutral-800 text-gray-50 p-3 overflow-y-auto">
              <h2 className="text-2xl font-semibold pt-2">Write Ups</h2>
            </div>
            <div className="ml-auto">
              <button onClick={() => { setIsCreating(true) }} className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-2 py-1 mt-5  text-sm mr-4">New Draft</button>
            </div>
          </>
        )}

      </div>
      {selectedWriteup ? (
        <WriteupView writeup={selectedWriteup} onBack={() => setSelectedWriteup(null)} />
      ) : (
      

      <div className="px-4 overflow-auto">
        {writeUp.map((writeup, index) => (
          <div key={index} onClick={() => setSelectedWriteup(writeup)} className='mb-1 bg-neutral-700 hover:bg-neutral-600 hover:cursor-pointer px-5 py-3 w-full text-white flex mx-auto border border-neutral-600'>
            <div className='w-full flex'>
              <div className="">

                <h3 className="text-2xl">{writeup.title}</h3>
                <p className="text-sm">Authored by {writeup.user.username}</p>

              </div>
              <div className="ml-auto mt-2">
                <p className="text-sm text-right">452 views</p>

                <div className=" space-x-2 text-right text-lg">
                  <i className="fas fa-arrow-up text-green-500 cursor-pointer"></i> {writeup.upvotes}
                  <i className="fas fa-arrow-down text-red-500 cursor-pointer"></i>  {writeup.downvotes}
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>
        )}

        {
          !writeUp.length && (
            <div className="px-3">
                       <div className=" w-full mx-auto mt-2 flex rounded-sm bg-neutral-900 py-2.5 ">
            <div className="my-auto mx-auto text-center pt-4 pb-4 text-xl text-white">
              <i className="text-4xl fas fa-exclamation-circle mx-auto text-center text-neutral-700/80"></i>
              <p className="text-xl">Looks like no writeups have been made for this challenge yet.</p>
              <p className="text-sm">Maybe you could create one?</p>

            </div>
          </div>
            </div>
          )
        }
      
      <div className="shrink-0 bg-neutral-800 h-10 w-full"></div>
      <Menu open={isCreating} setOpen={setIsCreating} solvedChallenges={solvedChallenges} />
</>
  )
}

function WriteupView({ writeup, onBack }) {
  const [upvotes, setUpvotes] = useState(writeup.upvotes);
  const [downvotes, setDownvotes] = useState(writeup.downvotes);

  async function upvoteWriteup(writeupId) {
    try {
      const upvoteEndpoint = `${process.env.NEXT_PUBLIC_API_URL}/writeups/${writeupId}/upvote`;
      const response = await request(upvoteEndpoint, 'POST', {
        "message": "Upvoted writeup"
      });
      if (response.success) {
        console.log("Upvoted successfully");
        setUpvotes(response.upvotes)
        setDownvotes(response.downvotes)
    
      } else {
        console.error("Failed to upvote:", response.message);
      }
    } catch (error) {
      console.error("Error upvoting writeup:", error);
    }
  }
  
  async function downvoteWriteup(writeupId) {
    try {
      const downvoteEndpoint = `${process.env.NEXT_PUBLIC_API_URL}/writeups/${writeupId}/downvote`;
      const response = await request(downvoteEndpoint, 'POST', {
        "message": "Downvoted writeup"
      });
      if (response.success) {
        console.log("Downvoted successfully");
        setUpvotes(response.upvotes)
        setDownvotes(response.downvotes)
      } else {
        console.error("Failed to downvote:", response.message);
      }
    } catch (error) {
      console.error("Error downvoting writeup:", error);
    }
  }


  return (
    <div className="px-4 mt-4">

      <div className="flex">
        <div>
        <h1 className="text-3xl">{writeup.title}</h1>
        <p>Authored by {writeup.user.username}</p>

        </div>
        <div className="ml-auto mt-3 text-right" >
  <button className="hover:text-neutral-200 mb-2" onClick={onBack}><i className="fas fa-long-arrow-alt-left"></i> View all writeups</button> <br></br>
  <button
    className="px-2 rounded-full bg-green-700 hover:bg-green-600"
    onClick={() => upvoteWriteup(writeup.id)}
  >
    <i className="fas fa-arrow-up"></i> {upvotes}
  </button>
  <button
    className="px-2 rounded-full bg-red-700 hover:bg-red-600 ml-2"
    onClick={() => downvoteWriteup(writeup.id)}
  >
    <i className="fas fa-arrow-down"></i> {downvotes}
  </button>    
</div>
      </div>
      

<br></br>
      <MarkdownViewer content={writeup.content} />

    </div>
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
          } catch(err) {
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

      {leaderboard.slice(0, 3).map((entry, index) => {
        let color;
        switch(index) {
          case 0:
            color = "from-yellow-500 to-yellow-700"; // gold
            break;
          case 1:
            color = "from-gray-500 to-gray-700"; // silver
            break;
          case 2:
            color = "from-orange-500 to-orange-700"; // bronze
            break;
          default:
            color = "from-green-500 to-blue-700"; // default color for others
        }
        return (
        <div className="px-3">
            <div key={index} className={`flex justify-between items-center py-2 px-10 bg-gradient-to-r ${color} rounded-lg my-2`}>
            <div className="flex items-center">
              <span className="text-2xl font-bold">{index + 1}.</span>
              <span className="ml-2 text-xl font-semibold text-white">{entry.user.username}</span>
            </div>
            <div className="text-xl font-semibold">{entry.points} points</div>
          </div>
        </div>
        )
      })}
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


  useEffect(() => {
    if (!challenge) {
      return;
    }
    (async () => {
      try {
        const getCommentsResult = await request(`${process.env.NEXT_PUBLIC_API_URL}/challenges/${challenge.id}/comments`, "GET", null);
          challenge[`comments`] =  getCommentsResult.result;
          console.log(challenge.comments)
          setNewComment()

          

      } catch (error) { console.error("Failed to fetch comments: " + error); }
    })();
  }, [challenge]);

  const handleCommentSubmit = async (e) => {

    if(!newComment) return;
    e.preventDefault();
  if (!newComment.trim()) return; // Prevent empty comments
    
  try {
    let payload = { content: newComment  };
    console.log("debug: " + hasReply);
    console.log(replyingId);

    if (hasReply) {
      payload =  { content: newComment, parent: replyingId}
    }



    const response = await request(`${process.env.NEXT_PUBLIC_API_URL}/challenges/${challenge.id}/comments`, "POST", payload);
    setNewComment('');
    (async () => {
      try {
        const getCommentsResult = await request(`${process.env.NEXT_PUBLIC_API_URL}/challenges/${challenge.id}/comments`, "GET", null);
          challenge[`comments`] =  getCommentsResult.result;
          console.log(challenge.comments)
          setNewComment()

          

      } catch (error) { console.error("Failed to fetch comments: " + error); }
    })();
    if (response.success) {
      console.log('Comment submitted:', response);
      setNewComment(''); // Clear the input after successful submission
      // Optionally refresh comments or update UI here
    } else {
      console.error('Failed to submit comment:', response.error); 
    }
  } catch (error) {
    console.error('Error submitting comment:', error);
  }
  };

  const handleReplySubmit = async (commentId, replyText) => {
    // Implement API call to submit reply
    console.log(`Reply to ${commentId}:`, replyText);
    setReply({ ...reply, [commentId]: '' });
  };

  const replyingTo = async (commentId, username) => {
    configReply(true);
    setReplyingTo(username)
    setReplyingId(commentId);
  }

  const cancelReply = async () => {
    configReply(false);
  }

  // Helper function to organize comments into a tree structure
  const organizeComments = (comments) => {
    const commentMap = {};

    // Initialize map with all comments
    comments.forEach(comment => {
      comment.replies = [];
      commentMap[comment.id] = comment;
    });

    // Populate replies
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

  // Recursive component to render comments and their replies
  const Comment = ({ comment }) => {
    const [showReplies, setShowReplies] = useState(false); // State to toggle replies visibility

    return (
      <div className="my-2 p-2 bg-neutral-800 ">
        <div className="flex ">
          <div className="flex items-center">
            <div className="mr-2 text-md text-center  text-neutral-400 bg-neutral-700/50 px-1 rounded-md">
              <button className="hover:text-neutral-600"><i className="fas fa-arrow-up"></i> <span>1</span></button>
              <br />
              <button className="hover:text-neutral-600"><i className="fas fa-arrow-down"></i> <span>2</span></button>
            </div>
            <img src={`https://ui-avatars.com/api/?name=${comment.username}.svg`} className="w-8 h-8 rounded-full" />
            <span className="ml-2 text-lg font-semibold text-white">{comment.username}
              {comment.username === 'laphatize' && (
                <>
                  <span className="bg-red-600 px-1 text-sm ml-2"><i class="fas fa-code fa-fw"></i> developer</span>
                  <span className="ml-2 bg-orange-600 px-1 text-sm "><i class="fas fa-crown fa-fw"></i> pro</span>
                </>
              )}
              <span className="ml-2 text-sm font-medium"> {new Date(comment.createdAt).toLocaleString()}</span>
            </span>
          </div>
        
        </div>
        <p className="text-neutral-200 pl-12">{comment.content}</p>
        {showReplies && comment.replies.length > 0 && (
          <div className="pl-4 border-l-2 border-neutral-700">
            {comment.replies.map((reply) => <Comment key={reply.id} comment={reply} />)}
          </div>
        )}

        <div className="ml-12">
        <button onClick={() => replyingTo(comment.id, comment.username)} className="text-sm text-blue-500">Reply</button>
          {comment.replies.length > 0 && (
            <button onClick={() => setShowReplies(!showReplies)} className="ml-2 text-sm text-blue-500">
              {showReplies ? 'Hide Replies' : 'Show Replies'}
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
        {organizedComments.map((comment, index) => (
          <Comment key={index} comment={comment} />
        ))}
      </div>
    );
  };

  
  return (
    <>
      <div className="grow bg-neutral-800 text-gray-50 p-3 overflow-y-auto">
        <h1 className="text-2xl font-semibold py-2 line-clamp-1">
          Comments
        </h1>
    
<form onSubmit={handleCommentSubmit} className="mb-4">
<p className="text-red-500 hidden">Hmm, that doesn't seem very nice. Please read our terms of service. </p>

  <div className="flex w-full">
    
    <div className="w-full">
      
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="text-black p-2  w-full bg-neutral-700 border-none text-white placeholder-white"
          />

          {hasReply &&
          <div className=" flex w-full  text-left  px-2 bg-neutral-500/10 border-none   py-1"> Replying to  <span className="text-yellow-500 ml-1">{replyingPerson}</span><button className="ml-auto text-right" onClick={cancelReply}><i class="fas fa-times"></i></button></div>
  }
  </div>
          <button type="submit" className="bg-neutral-600 hover:bg-blue-500 border-none text-white px-4 text-xl h-10"><i class="fas fa-paper-plane"></i></button>
          <button type="submit" className="bg-neutral-600 hover:bg-red-500 border-none text-white px-4 text-xl h-10"><i class="fas fa-trash"></i></button>

          </div>
        </form>
        {challenge && challenge.comments && <CommentsSection comments={challenge.comments} />}



      </div >
      <div className="shrink-0 bg-neutral-800 h-10 w-full"></div>
    </>
  )
}
