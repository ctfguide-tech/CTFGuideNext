import React, { use } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { useEffect, useState, Fragment } from 'react';
import { Transition, Dialog } from '@headlessui/react';
import {
  XMarkIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { getAuth } from 'firebase/auth';
const auth = getAuth();

import { Footer } from '@/components/Footer';
import { MarkdownViewer } from '@/components/MarkdownViewer';
import {
  CheckCircleIcon,
  FlagIcon,
} from '@heroicons/react/20/solid';
import request from '@/utils/request';

import api from '@/utils/terminal-api';

export default function Challenge() {
  const router = useRouter();
  const { id } = router.query;

  const NO_PLACE = 'Not placed';

  const [challenge, setChallenge] = useState({});
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [submissionMsg, setSubmissionMsg] = useState(false);
  const [hintOpen, setHintOpen] = useState(false);
  const [flag, setFlag] = useState('');
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [leaderboards, setLeaderboards] = useState([
    NO_PLACE,
    NO_PLACE,
    NO_PLACE,
  ]);

  const [loading, setLoading] = useState(true);

  const [award, setAward] = useState('');
  const [terminalUsername, setTerminalUsername] = useState('...');
  const [terminalPassword, setTerminalPassword] = useState('...');

  const [terminalUrl, setTerminalUrl] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [minutesRemaining, setMinutesRemaining] = useState(-1);
  const [foundTerminal, setFoundTerminal] = useState(false);
  const [fetchingTerminal, setFetchingTerminal] = useState(false);

  const [difficulty, setDifficulty] = useState('');
  const [alreadySolved, setAlreadySolved] = useState(false);

  const [progress, setProgress] = useState(0);
  const [eta, setEta] = useState(15);
  const [username, setUsername] = useState(null);

  // change eta by one every sec
  useEffect(() => {
    let interval;

    if (eta >= 0) {
      interval = setInterval(() => {
        setEta((prevEta) => prevEta - 1);
      }, 1000); // Update every 1 second
    }

    return () => {
      clearInterval(interval);
    };
  }, []);

  // console.log(challenge);

  const loadBar = () => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 100 / (15 * 10);
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 100); // Update every 100ms (15 seconds total for 0 to 100)

    return () => {
      clearInterval(interval);
    };
  };

  // Kshitij
  const [hintMessages, setHintMessages] = useState([]);
  const [hideHintButton, setHideHintButton] = useState(false);

  const [userData, setUserData] = useState({
    points: 0,
    susername: 'Loading...',
    spassword: 'Loading...',
  });


  const getChallengeData = async () => {
    const endPoint = process.env.NEXT_PUBLIC_API_URL + '/challenges/' + id;
    const result = await request(endPoint, 'GET', null);
    const { difficulty } = result.body;
    setChallenge(result.body);
    setDifficulty(difficulty);
    setLoading(false);
  };

  const fetchLikeUrl = async () => {
    try {
      setUsername(localStorage.getItem('username'));

      const userLikesUrl = localStorage.getItem('userLikesUrl');
      const response = await request(userLikesUrl, 'GET', null);

      const likedChallenge = response.some(challenge => challenge.challengeId === id);
      console.log("USER ALREADY LIKED: " + likedChallenge);
      setLiked(likedChallenge);

      const likes = response.filter((item) => {
        return item.challenge.slug === slug;
      });


    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (id) {
      getChallengeData();
      fetchLeaderboard();
      getLikes();
      fetchLikeUrl();
      //fetchComments();
      if (challenge.upvotes) {
        setLikeCount(challenge.upvotes);
      }
    }
    const award = localStorage.getItem('award');
    if (award) {
      setAward(award);
    }
  }, [id]);

  const fetchSolvedUsers = async () => {
    try {
      const endPoint =
        process.env.NEXT_PUBLIC_API_URL +
        '/challenges/' +
        id +
        '/completed-users';
      const requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      };
      const response = await fetch(endPoint, requestOptions);
      const result = await response.json();

      if (result != null) {
        const user = result.users.filter((user) => {
          return user.username === localStorage.getItem('username');
        });

        if (user.length) {
          setAlreadySolved(true);
          console.log('Already solved');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTerminal = async () => {
  };

  const submitFlag = async () => {
    const slug = challenge.slug;
    // console.log(flag.length);

    if (!flag) {
      document
        .getElementById('enteredFlag')
        .classList.remove('border-gray-700');
      document.getElementById('enteredFlag').classList.add('border-red-600');
      document.getElementById('enterFlagBTN').innerHTML = 'Submit Flag';

      setTimeout(function () {
        document
          .getElementById('enteredFlag')
          .classList.remove('border-red-600');
      }, 2000);
    } else {
      try {
        const endPoint = process.env.NEXT_PUBLIC_API_URL + '/challenges/' + id + '/submissions';
        const response = await request(endPoint, "POST", { keyword: flag });
        if (!response) {
          console.log('Error occured while submitting the flag');
          return;
        }
        const { success, incorrect, error } = response;
        if (error) {
          document.getElementById('enterFlagBTN').innerHTML = 'Submit Flag';
          setSubmissionMsg('error');
          setOpen(true);
        } else if (success) {
          document
            .getElementById('enteredFlag')
            .classList.add('border-green-600');
          document.getElementById('enterFlagBTN').innerHTML = 'Submit Flag';
          setSubmissionMsg('success');
          setOpen(true);

          if (!alreadySolved) {
            try {
              const endPoint =
                process.env.NEXT_PUBLIC_API_URL + '/users/' + localStorage.getItem('username') + '/complete-challenge/' +
                id +
                '/' +
                difficulty;
              const response = await request(endPoint, "POST", { keyword: flag });
            } catch (err) {
              console.log(err);
            }
          }

          setTimeout(function () {
            document
              .getElementById('enteredFlag')
              .classList.remove('border-green-600');
          }, 2000);
        } else {
          document
            .getElementById('enteredFlag')
            .classList.add('border-red-600');
          document.getElementById('enterFlagBTN').innerHTML = 'Submit Flag';
          setSubmissionMsg('incorrect');
          setOpen(true);

          setTimeout(function () {
            document
              .getElementById('enteredFlag')
              .classList.remove('border-red-600');
          }, 2000);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const fetchComments = async () => {
    try {
      const url = process.env.NEXT_PUBLIC_API_URL + '/challenges/' + id + '/comments';
      const { result } = await request(url, 'GET', null);
      if (result && result.length) {
        setComments([...result]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Kshitij
  async function fetchHints() {
    try {
      const endPoint = process.env.NEXT_PUBLIC_API_URL + '/challenges/' + id + '/hint';
      const result = await request(endPoint, 'GET', null);
      updateHintMessage(result.hintMessage, result.order);
    } catch (error) {
      console.log(error);
    }
  }

  // Kshitij
  const updateHintMessage = (message, id) => {
    setHintMessages((prevHints) => {
      const newHints = [...prevHints];
      newHints[id] = message;
      if (newHints.length === 3) {
        setHideHintButton(true);
      }
      return newHints;
    });
  };

  // Kshitij
  const handleButtonClick = () => {
    if (hintMessages.length < 3) {
      fetchHints();
    }
    if (hintMessages.length === 3) {
      setHideHintButton(true);
    }
  };

  const onCommentReport = async () => {
    alert(
      'Thank you for reporting this comment. Our moderation team will look into this.'
    );
    // Call comment report API
  };

  const fetchLeaderboard = async () => {
    try {
      const url = process.env.NEXT_PUBLIC_API_URL + '/challenges/' + id + '/leaderboard';
      const leaderboards = await request(url, 'GET', null);
      const NO_PLACE = 'Not placed';

      if (!leaderboards.length) return;

      const user1 = leaderboards.filter((leaderboard) => {
        return leaderboard.id == 5;
      });
      const user2 = leaderboards.filter((leaderboard) => {
        return leaderboard.id == 4;
      });
      const user3 = leaderboards.filter((leaderboard) => {
        return leaderboard.id == 3;
      });

      setLeaderboards([
        user1.length ? user1[0].username : NO_PLACE,
        user2.length ? user2[0].username : NO_PLACE,
        user3.length ? user3[0].username : NO_PLACE,
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  const submitComment = async () => {
    const endPoint = process.env.NEXT_PUBLIC_API_URL + '/challenges/' + id + '/comments';
    const result = await request(endPoint, 'POST', { content: comment });

    setComments([result, ...comments]);

    if (result.error) {
      console.log('Error occured while adding the comment');
    }
  };
  const commentChange = (event) => {
    setComment(event.target.value);
  };
  const flagChanged = (event) => {
    setFlag(event.target.value);
  };
  const likeChallenge = async () => {
    try {
      console.log(liked);
      if (!liked) {
        const endPoint = process.env.NEXT_PUBLIC_API_URL + '/challenges/' + id + '/like';
        console.log("FLAG: ADDING LIKE");
        const result = await request(endPoint, 'POST', {});
        setLikeCount(likeCount + 1);
        setLiked(true);
      } else {
        const endPoint = process.env.NEXT_PUBLIC_API_URL + '/challenges/' + id + '/deletelike';
        const result = await request(endPoint, "POST", {});
        setLikeCount(likeCount - 1);
        setLiked(false);
      }
    } catch (err) {
      console.log("Something wrong with adding or removing like: " + err);
    }
  };

  const getLikes = async () => {
    try {
      const endPoint = process.env.NEXT_PUBLIC_API_URL + '/challenges/' + id + '/upvotes';
      const result = await request(endPoint, "GET", null);


      const likeCount = result.upvotes;
      console.log("LIKES: " + result.upvotes);
      setLikeCount(likeCount);

    } catch (err) {
      console.log("Error fetching UPVOTE");
    }
  }

  return (
    <>
      <Head>
        <title>{challenge ? challenge.title : ''} - CTFGuide</title>
        <style>
          @import
          url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
        </style>
      </Head>
      <main>
        <div
          id="reportalert"
          className="center fixed bottom-6 right-6 flex hidden rounded-md bg-[#7cd313] bg-blue-900 p-2 text-white"
        >
          <CheckCircleIcon className="mr-2 h-6 w-6"> </CheckCircleIcon>We'll
          investigate this challenge and take appropriate action.
        </div>
        <StandardNav />
        <div
          className=" w-full py-10 "
          style={{
            backgroundSize: 'cover',
            backgroundImage:
              'url("https://images.unsplash.com/photo-1633259584604-afdc243122ea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80")',
          }}
        >
          <div className="mx-auto my-auto flex  text-center">
            <h1 className="mx-auto my-auto text-4xl font-semibold text-white">
              {' '}
              {challenge.title}{' '}
            </h1>
          </div>
          <div className="mx-auto my-auto  text-center text-lg text-white">
            <div className="my-auto flex place-items-center justify-center">
              <p className="my-auto mr-2 text-sm">Created by</p>
              <img
                className="my-auto my-auto mr-2 h-6   w-6  rounded-full bg-neutral-900"
                src={
                  `https://robohash.org/` +
                  challenge.creator +
                  `.png?set=set1&size=150x150`
                }
                alt=""
              />
              <a href={process.env.NEXT_PUBLIC_FRONTEND_URL + "/users/" + challenge.creator} className="my-auto text-sm hover:underline">{challenge.creator}</a>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-6 max-w-6xl text-left">
          <div className="mb-2 flex place-items-center justify-between">
            <div>
              <h1 className="inline-block text-2xl font-semibold text-white">
                {' '}
                Challenge Description{' '}
              </h1>
            </div>

            {
              loading && (
                <div className="flex place-items-center">
                  <i className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-neutral-800"></i>
                </div>
              )
            }

            <div className="flex">
              <button
                onClick={likeChallenge}
                className="card-body m-1 flex rounded-md bg-neutral-800 px-10 py-2 hover:bg-neutral-700"
              >
                {liked ?
                  <h1 className="mb-2 mr-4 bg-gradient-to-br from-orange-400 to-yellow-400 bg-clip-text text-xl font-semibold text-transparent">
                    <i class="fas fa-heart text-red-500 text-2xl mt-2"> </i>
                  </h1>
                  :
                  <h1 className="mb-2 mr-4 bg-gradient-to-br from-orange-400 to-yellow-400 bg-clip-text text-xl font-semibold text-transparent">
                    <i class="far fa-heart text-red-500 text-2xl mt-2"> </i>
                  </h1>
                }
                <p className="mt-2 text-2xl text-white">{likeCount}</p>
              </button>
              <button
                onClick={() => {
                  document
                    .getElementById('reportalert')
                    .classList.remove('hidden');
                  setTimeout(function () {
                    document
                      .getElementById('reportalert')
                      .classList.add('hidden');
                  }, 15000);
                }}
                className="card-body m-1 flex hidden rounded-md bg-neutral-800 px-10 py-2 hover:bg-neutral-700"
              >
                <h1 className=" flex bg-gradient-to-br from-orange-400 to-yellow-400 bg-clip-text text-2xl font-semibold text-transparent">
                  <FlagIcon className="mr-2 h-8 w-8 text-yellow-600" />{' '}
                  <p className="text-lg font-normal text-white">
                    Report Challenge
                  </p>
                </h1>
              </button>
              <button className="card-body m-1 hidden rounded-md bg-neutral-800 px-4 py-1 hover:bg-neutral-700">
                <h1 className="bg-gradient-to-br from-orange-400 to-yellow-400 bg-clip-text text-sm font-semibold text-transparent">
                  View Submissions
                </h1>
                <p className="text-sm text-white">Coming Soon</p>
              </button>
            </div>
          </div>
          {/* ***************************************** */}

          <div
            id="challengeDetails"

            className="w-full text-white whitespace-pre-wrap  border-blue-700 bg-neutral-800/50 px-4 py-2 text-lg text-white"
          >
            <div>
              <MarkdownViewer content={challenge.content} />
            </div>
          </div>
          <div className="flex ">
            <div className="mt-4 rounded-lg">
              <div className="flex    rounded-lg   rounded-lg text-sm">
                <div style={{ color: '#8c8c8c' }} className="mb-4">
                  <input
                    id="enteredFlag"
                    onChange={flagChanged}
                    style={{ backgroundColor: '#212121' }}
                    placeholder="Flag Here"
                    className="focus-outline-none mx-auto  mr-2  rounded-lg border border-neutral-700 bg-black px-4 py-1 text-white outline-none"
                  ></input>
                  <button
                    id="enterFlagBTN"
                    onClick={submitFlag}
                    className="  rounded-lg   bg-green-700  px-4 py-1 text-green-300 hover:bg-green-900"
                  >
                    Submit Flag
                  </button>
                  <button
                    //hidden={!hintMessages}
                    onClick={() => setHintOpen(true)}
                    className="hidden ml-2  mt-4  rounded-lg  bg-black bg-yellow-700 px-4 py-1 text-white text-yellow-300 hover:bg-yellow-900"
                  >
                    Stuck?
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className='bg-neutral-800 px-2 py-4 mt-10 mb-10'>
            <h1 className='text-white text-center'>Public terminals are temporarily unavaliable. Some challenges that require pre-configured enviroments may not be solvable.</h1>
          </div>
          <div className="mt-6 grid hidden gap-10 sm:grid-cols-1 lg:grid-cols-3">
            <div
              style={{ backgroundColor: '#212121' }}
              className="card mx-auto w-full rounded-lg py-3 text-center shadow-lg"
            >
              <div className="card-body">
                <h1 className="bg-gradient-to-br from-orange-400 to-yellow-400 bg-clip-text text-2xl  font-semibold text-transparent">
                  #1
                </h1>
                <p className="text-lg text-white">{leaderboards[0]}</p>
              </div>
            </div>

            <div
              style={{ backgroundColor: '#212121' }}
              className="card mx-auto w-full rounded-lg py-3 text-center shadow-lg"
            >
              <div className="card-body">
                <h1 className="bg-gradient-to-br from-blue-400 to-indigo-500 bg-clip-text text-2xl font-semibold text-transparent text-white ">
                  #2
                </h1>
                <p className="text-lg text-white">{leaderboards[1]}</p>
              </div>
            </div>

            <div
              style={{ backgroundColor: '#212121' }}
              className="card mx-auto w-full rounded-lg py-3 text-center shadow-lg"
            >
              <div className="card-body">
                <h1 className="bg-gradient-to-br from-blue-400 to-green-500 bg-clip-text text-2xl font-semibold text-transparent text-white">
                  #3
                </h1>
                <p className="text-lg text-white">{leaderboards[2]}</p>
              </div>
            </div>
          </div>
          <div id="terminal" className="hidden mx-auto mt-6 max-w-6xl">
            <div className="hint mb-2 text-gray-400">
              <span className="font-semibold text-white   ">
                {' '}
                <span className="text-blue-500"></span>
              </span>{' '}
              Login as{' '}
              <span className="text-yellow-400">{terminalUsername}</span> using
              the password{' '}
              <span className="text-yellow-400">{terminalPassword}</span>
              <div className="float-right ml-auto flex  cursor-pointer">
                <span
                  style={{ cursor: 'pointer' }}
                  className=" text-gray-300 hover:bg-black"
                >
                  Container will stop in: <span id="timer"></span>
                </span>

                <span
                  onClick={() => {
                    window.location.reload();
                  }}
                  className="ml-2 hidden text-red-500"
                >
                  If you see a 404, click here.
                </span>
              </div>
            </div>

            <div
              className="h-500 mx-auto w-full bg-black py-10 text-center text-white"
              height="500"
              id="terminalLoader"
            >
              <span className="inline-block text-2xl font-semibold text-white">
                {Math.round(progress)}%
              </span>
              <h1 className="text-center text-xl">{!fetchingTerminal ? "Launch Terminal" : "Launching Terminal"}</h1>
              <div className="relative mx-auto max-w-xl ">
                <div className="flex  items-center justify-between">
                  <span className="inline-block rounded-full px-2 py-1 text-xs font-semibold uppercase text-blue-800 "></span>
                </div>
                <div className="mb-4 flex h-2 overflow-hidden rounded bg-blue-600 text-xs">
                  <div
                    style={{ width: `${progress}%` }}
                    className="flex flex-col justify-center whitespace-nowrap bg-blue-900 text-center text-white shadow-none"
                  ></div>
                </div>

                <span className="inline-block hidden text-sm italic text-white">
                  Expected Time: {eta} seconds
                </span>
              </div>
              <img
                className="mx-auto text-center"
                width="50"
                src="https://ctfguide.com/darkLogo.png"
              ></img>
            </div>

            {foundTerminal ? (
              <embed
                onError={() => window.location.reload()}
                className="absolute w-full bg-white opacity-0"
                height="500"
                id="termurl"
                src={foundTerminal ? terminalUrl : ''}
              ></embed>
            ) : (
              <></>
            )}

            <br></br>
            {challenge && !fetchingTerminal && !foundTerminal &&
              <div className=" mx-auto text-center ">
                <span
                  className="cursor-pointer rounded-lg bg-green-800 px-2 py-1 text-white hover:bg-green-700"
                  disabled={fetchingTerminal}
                  onClick={fetchTerminal}
                >
                  Launch Terminal
                </span>
              </div>
            }
          </div>
          <div className="mt-10  rounded-lg  pb-20">
            <h1 className="text-2xl font-semibold text-white">Comments</h1>
            <textarea
              id="comment"
              onChange={commentChange}
              style={{ backgroundColor: '#212121' }}
              className="focus-outline-none mt-4 block w-full rounded-lg border-none bg-black text-white outline-none"
            ></textarea>

            <button
              onClick={submitComment}
              id="commentButton"
              style={{ backgroundColor: '#212121' }}
              className="mt-4 rounded-lg border border-gray-700 bg-black px-4 py-1 text-white hover:bg-gray-900"
            >
              Post Comment
            </button>
            <h1
              id="commentError"
              className="mt-4 hidden px-2 py-1 text-xl text-red-400"
            >
              Error posting comment! This could be because it was less than 5
              characters or greater than 250 characters.{' '}
            </h1>
            {comments.map((message, index) => (
              <div
                key={index}
                className="mt-4 rounded-lg bg-black  "
                style={{ backgroundColor: '#212121' }}
              >
                <h1 className="px-5 pt-4 text-xl text-white">
                  @{message.username}
                </h1>
                <p className="space-y-10 px-5 pb-4 text-white">
                  <span className="mb-5">{message.content}</span>
                  <br className="mt-10"></br>
                  <a
                    onClick={onCommentReport}
                    className="mt-4 cursor-pointer text-red-600 hover:text-red-500"
                  >
                    Report Comment
                  </a>
                </p>
              </div>
            ))}
          </div>
        </div>
        {/* ***************************************** */}
      </main>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={setOpen}
        >
          <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden sm:inline-block sm:h-screen sm:align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="relative inline-block transform overflow-hidden rounded-lg border border-gray-700 bg-gray-900 px-4 pb-4 pt-5 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6 sm:align-middle">
                <div>
                  <div className="mx-auto flex items-center justify-center rounded-full ">
                    {submissionMsg == 'success' && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="h-6 w-6 text-yellow-500"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                        />
                      </svg>
                    )}

                    {submissionMsg == 'incorrect' && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        className="h-14 w-14 text-red-500"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="mt-2 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-100"
                    >
                      {submissionMsg == 'success'
                        ? "Nice hackin', partner!"
                        : ''}
                      {submissionMsg == 'incorrect'
                        ? 'Submission incorrect!'
                        : ''}
                      {submissionMsg == 'error' ? 'Login to submit a flag' : ''}
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-gray-200">
                        {submissionMsg == 'success'
                          ? `You were awarded ${award} points.`
                          : ''}
                        {submissionMsg == 'incorrect'
                          ? `Incorrect submission, no points awarded.`
                          : ''}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mx-auto mt-5 flex text-center sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex w-auto justify-center rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-base font-medium text-white shadow-sm  focus:outline-none  sm:text-sm"
                    onClick={() =>
                      (window.location.href = '../leaderboards/global')
                    }
                  >
                    View Leaderboards
                  </button>
                  <button
                    type="button"
                    className="ml-2 inline-flex w-auto justify-center   rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-base font-medium text-white shadow-sm  focus:outline-none  sm:text-sm"
                    onClick={() => (window.location.href = '../practice')}
                  >
                    Back to Challenges
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <Transition.Root show={hintOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setHintOpen}>
          <div className="fixed inset-0" />

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                    <div className="flex h-full flex-col overflow-y-scroll bg-[#161616] py-6 shadow-xl">
                      <div className="px-4 sm:px-6">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="text-base font-semibold leading-6 text-gray-300">
                            <h2>Hints</h2>
                            <hr></hr>
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                              onClick={() => setHintOpen(false)}
                            >
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </div>
                        <div className="mt-3 rounded-md border border-neutral-900 bg-neutral-800">
                          <h2 className="text-md mx-4 mb-2 mt-2 text-gray-200">
                            <i class="far fa-lightbulb mr-1 text-yellow-400"></i>{' '}
                            On our main platform, each hint incurs a 10% penalty
                            and each submission a 3% penalty.
                          </h2>
                        </div>
                        <div className="absolute bottom-4 mx-auto mt-3 hidden w-4/5 rounded-md border border-neutral-900 bg-neutral-800">
                          <h2 className="text-md mx-4 mb-2 mt-2 text-gray-200">
                            <i class="far fa-star mr-1 text-blue-500"></i> You
                            must be logged in to see hints!
                          </h2>
                        </div>
                      </div>
                      <div className="mt-6 px-4 font-medium text-yellow-400 sm:px-6">
                        {hintMessages ? (
                          <div>
                            {hintMessages.map((hint, index) => (
                              <div
                                key={index}
                                className="mb-2 w-full  border-l-4  border-blue-600 bg-[#212121] px-4 py-3 text-lg"
                                enter="transition-opacity duration-75"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="transition-opacity duration-150"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                              >
                                <p className="text-white">
                                  <span className="text-xl font-semibold">
                                    Hint #{index + 1}
                                  </span>
                                  {hint && <p>{hint}</p>}
                                </p>
                              </div>
                            ))}
                            <div className="w-full">
                              <button
                                hidden={hideHintButton}
                                type="button"
                                className="mx-auto w-full bg-[#212121] py-2 text-center text-lg hover:bg-neutral-800"
                                onClick={handleButtonClick}
                              >
                                <span className="sr-only bg-gradient-to-r from-orange-400 to-yellow-600 bg-clip-text">
                                  View hint
                                </span>
                                <i class="fas fa-unlock "></i>&nbsp; Unlock Hint
                                #{hintMessages.length + 1}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-base font-normal text-white">
                            Oops, no hints for this challenge.
                          </p>
                        )}
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      <p className="hidden mx-auto mt-1.5 w-3/5 rounded-lg bg-neutral-800 px-4 py-0.5 text-sm text-gray-200">
        ℹ We provide accessible environments for everyone to run cybersecurity
        tools. Abuse and unnecessary computation is prohibited.
      </p>
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
