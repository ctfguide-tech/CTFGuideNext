import React, { use } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { useEffect, useState, Fragment } from 'react';
import { Transition, Dialog } from '@headlessui/react';
import { XMarkIcon, HeartIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

import { Footer } from '@/components/Footer';
import { MarkdownViewer } from "@/components/MarkdownViewer";
import { CheckCircleIcon, CheckIcon, FlagIcon } from '@heroicons/react/20/solid';

export default function Challenge() {
    const router = useRouter()
    const { slug } = router.query

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
    const [leaderboards, setLeaderboards] = useState([NO_PLACE, NO_PLACE, NO_PLACE,]);
    const [award, setAward] = useState('');
    const [terminalUsername, setTerminalUsername] = useState('...');
    const [terminalPassword, setTerminalPassword] = useState('...');

    const [difficulty, setDifficulty] = useState('');
    const [alreadySolved, setAlreadySolved] = useState(false);

    let fileurl = ""

    const [progress, setProgress] = useState(0);
    const [eta, setEta] = useState(15)

    // change eta by one every sec 
    useEffect(() => {
        if (eta > 0) {
            const interval = setInterval(() => {
                setEta(prevEta => prevEta - 1);
            }, 1000); // Update every 1 second
        }

        return () => {
            clearInterval(interval);
        };
    }, []);





    useEffect(() => {





        const interval = setInterval(() => {
            setProgress(prevProgress => {


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


    }, []);


    // Kshitij
    const [hintMessages, setHintMessages] = useState([]);
    const [hideHintButton, setHideHintButton] = useState(false);

    const [userData, setUserData] = useState({
        points: 0, susername: 'Loading...', spassword: 'Loading...',
    });

    // The Challenge
    useEffect(() => {

        // first fetch active terminals
        const fetchActiveTerminals = async () => {
            var raw = "";

            var requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };

            fetch(`${process.env.NEXT_PUBLIC_TERM_URL}Terminal/getAllUserTerminals?jwtToken=${localStorage.getItem("idToken")}`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log(result);



                    // handle if empty array
                    if (result.length == 0) {

                        try {
                            //      window.alert("no terminals found")
                            fetchTerminalData();
                        } catch (err) {
                            console.log(err);
                            setTerminalUsername('Something went wrong.');
                            setTerminalPassword('Something went wrong.');
                        }

                    } else {



                        setTerminalUsername(result[0].userName);
                        setTerminalPassword(result[0].password);

                        setTimeout(function () {
                            document.getElementById("termurl").classList.remove("opacity-0");
                            document.getElementById("terminalLoader").classList.add("hidden");
                            //window.alert(               JSON.stringify(result[0])                        )
                            document.getElementById("termurl").src = result[0].url;

                        }, 15000)


                        document.getElementById("timer").innerText = result[0].minutesRemaining + " minutes";
                        let minutes = result[0].minutesRemaining;
                        setInterval(function () {
                            // drop minutes
                            if (minutes == 0) {
                                window.alert("Your terminal session has expired. Please refresh the page to start a new session.")
                                window.location.reload();
                            }
                            minutes = minutes - 1;
                            document.getElementById("timer").innerText = minutes + " minutes";


                        }, 60000)

                    }
                })
                .catch(error => console.log('error', error));


            // send request



        }


        const fetchTerminalData = async () => {
            try {
                console.log("[debug] Creating new container session because nothing was found.")
                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                // random 4 digit number
                let code = Math.floor(Math.random() * 9000) + 1000;

                // create a secure random password
                var password = "";
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                for (var i = 0; i < 10; i++)
                    password += possible.charAt(Math.floor(Math.random() * possible.length));

                fileurl = "https://file-system-run-qi6ms4rtoa-ue.a.run.app/files/info.zip?id=2222"
                console.log("Injecting file: " + fileurl)

                var raw = JSON.stringify({
                    "jwtToken": localStorage.getItem("idToken"),
                    "TerminalGroupName": "school-class-session", // temp
                    "TerminalID": `${code}`,
                    "classID": "psu58102", // temp
                    "dockerLocation": "ctf_base_wetty_terminal",// temp
                    "injectFileLocation": `${fileurl}`, // temp
                    "maxCpuLimit": "500m",// temp
                    "maxMemoryLimit": "512Mi",// temp
                    "minCpuLimit": "250m",// temp
                    "minMemoryLimit": "256Mi",// temp
                    "terminalUsername": localStorage.getItem("username"),
                    "organizationName": "PSU", // temp
                    "terminalPassword": "",
                    "userID": localStorage.getItem("username"),


                });

                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                };

                fetch(process.env.NEXT_PUBLIC_TERM_URL + "Terminal/createTerminal", requestOptions)
                    .then(response => {
                        response.json();


                    })
                    .then(result => {
                        fetchActiveTerminals();




                    })
                    .catch(error => console.log('error', error));
            } catch (err) {
                console.log(err);
                setTerminalUsername('Something went wrong.');
                setTerminalPassword('Something went wrong.');
            }
        };


        if (!slug) {
            return;
        }
        const award = localStorage.getItem('award');

        if (award) {
            setAward(award);
        }

        const fetchData = async () => {
            try {
                const endPoint = process.env.NEXT_PUBLIC_API_URL + '/challenges/' + slug;
                const requestOptions = {
                    method: 'GET', headers: {
                        'Content-Type': 'application/json', Authorization: 'Bearer ' + localStorage.getItem('idToken'),
                    },
                };
                const response = await fetch(endPoint, requestOptions);
                const result = await response.json();
                //result["content"] = result["content"].replace()


                setChallenge(result);

                //    fileurl = result.fileurl;


                try {
                    fetchActiveTerminals();
                } catch (err) {
                    console.log(err);
                }


                setDifficulty(result.difficulty);

                result.availableHints.forEach((hint, index) => {
                    updateHintMessage(hint, index);
                });

            } catch (err) {
                throw err;
            }
        };
        fetchData();
    }, [slug]);










    useEffect(() => {
        if (!slug) {
            return;
        }
        try {
            const fetchLikeUrl = async () => {
                const userLikesUrl = localStorage.getItem('userLikesUrl');
                const requestOptions = {
                    method: 'GET', headers: {
                        'Content-Type': 'application/json', Authorization: 'Bearer ' + localStorage.getItem('idToken'),
                    },
                };

                const response = await fetch(userLikesUrl, requestOptions);
                const result = await response.json();
                try {
                    const likes = result.filter((item) => {
                        return item.challenge.slug === slug;
                    });
                } catch (err) {
                    console.log(err);
                }
                //   setLiked(likes.length ? true : false);
                //  if (likes.length) {
                //   setLikeCount(likeCount + 1);
                // }
            };

            fetchLikeUrl();
        } catch (err) {
            throw err;
        }
    }, [slug]);

    useEffect(() => {
        if (!slug) {
            return;
        }
        fetchLeaderboard();
    }, [slug]);

    useEffect(() => {
        if (!slug) {
            return;
        }
        fetchComments();
    }, [slug]);

    useEffect(() => {
        if (!slug) {
            return;
        }
        if (challenge.upvotes) {
            setLikeCount(challenge.upvotes);
        }
    }, [challenge]);

    useEffect(() => {
        if (!slug) {
            return;
        }
        //   fetchSolvedUsers();
    }, [slug]);

    const fetchSolvedUsers = async () => {
        try {
            const endPoint = process.env.NEXT_PUBLIC_API_URL + '/challenges/' + slug + '/completed-users';
            const requestOptions = {
                method: 'GET', headers: {
                    'Content-Type': 'application/json', Authorization: 'Bearer ' + localStorage.getItem('idToken'),
                }
            }
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
            throw error;
        }
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
                const endPoint = process.env.NEXT_PUBLIC_API_URL + '/challenges/' + slug + '/submissions';
                const requestOptions = {
                    method: 'POST', headers: {
                        'Content-Type': 'application/json', Authorization: 'Bearer ' + localStorage.getItem('idToken'),
                    }, body: JSON.stringify({
                        keyword: flag,
                    }),
                };
                const response = await fetch(endPoint, requestOptions);
                const { success, incorrect, error } = await response.json();

                if (error) {
                    document.getElementById('enterFlagBTN').innerHTML = 'Submit Flag';
                    setSubmissionMsg("error");
                    setOpen(true);
                } else if (success) {
                    document
                        .getElementById('enteredFlag')
                        .classList.add('border-green-600');
                    document.getElementById('enterFlagBTN').innerHTML = 'Submit Flag';
                    setSubmissionMsg("success");
                    setOpen(true);

                    if (!alreadySolved) {
                        try {
                            const endPoint = process.env.NEXT_PUBLIC_API_URL + '/users/' + localStorage.getItem('username') + '/complete-challenge/' + slug + '/' + difficulty;
                            const requestOptions = {
                                method: 'POST', headers: {
                                    'Content-Type': 'application/json', Authorization: 'Bearer ' + localStorage.getItem('idToken'),
                                }, body: JSON.stringify({
                                    keyword: flag,
                                }),
                            };
                            const response = await fetch(endPoint, requestOptions);
                        } catch (err) {
                            throw err;
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
                    setSubmissionMsg("incorrect");
                    setOpen(true);

                    setTimeout(function () {
                        document
                            .getElementById('enteredFlag')
                            .classList.remove('border-red-600');
                    }, 2000);
                }
            } catch (err) {
                throw err;
            }
        }
    };

    const fetchComments = async () => {
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/challenges/' + slug + '/comments');
            const { result } = await response.json();

            if (result && result.length) {
                setComments([...result]);
            }
        } catch (error) {
            throw error;
        }
    };

    // Kshitij
    async function fetchHints() {
        try {
            const endPoint = process.env.NEXT_PUBLIC_API_URL + '/challenges/' + slug + '/hint';
            const requestOptions = {
                method: 'GET', headers: {
                    'Content-Type': 'application/json', Authorization: 'Bearer ' + localStorage.getItem('idToken'),
                }
            }
            const response = await fetch(endPoint, requestOptions);
            const result = await response.json();

            updateHintMessage(result.hintMessage, result.order)
        } catch (error) {
            throw error;
        }
    }

    // Kshitij
    const updateHintMessage = (message, id) => {
        setHintMessages(prevHints => {
            const newHints = [...prevHints]
            newHints[id] = message
            if (newHints.length === 3) {
                setHideHintButton(true);
            }
            return newHints
        })
    }

    // Kshitij
    const handleButtonClick = () => {
        if (hintMessages.length < 3) {
            fetchHints()
        }
        if (hintMessages.length === 3) {
            setHideHintButton(true);
        }
    }


    const onCommentReport = async () => {
        alert('Thank you for reporting this comment. Our moderation team will look into this.');
        // Call comment report API
    };


    const fetchLeaderboard = async () => {
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/challenges/' + slug + '/leaderboard');
            const leaderboards = await response.json();
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

            setLeaderboards([user1.length ? user1[0].username : NO_PLACE, user2.length ? user2[0].username : NO_PLACE, user3.length ? user3[0].username : NO_PLACE,]);
        } catch (error) {
            throw error;
        }
    };



    const submitComment = async () => {
        const endPoint = process.env.NEXT_PUBLIC_API_URL + '/challenges/' + slug + '/comments';
        const requestOptions = {
            method: 'POST', headers: {
                'Content-Type': 'application/json', Authorization: 'Bearer ' + localStorage.getItem('idToken'),
            }, body: JSON.stringify({
                content: comment,
            }),
        };
        const response = await fetch(endPoint, requestOptions);
        const result = await response.json();

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
        console.log(liked);
        if (!liked) {
            const endPoint = process.env.NEXT_PUBLIC_API_URL + '/challenges/' + slug + '/like';
            const requestOptions = {
                method: 'POST', headers: {
                    'Content-Type': 'application/json', Authorization: 'Bearer ' + localStorage.getItem('idToken'),
                },
            };
            const { error } = await fetch(endPoint, requestOptions);
            if (error) {
                alert(error);
            } else {
                setLikeCount(likeCount + 1);
                setLiked(true);
            }
        } else {
            const endPoint = process.env.NEXT_PUBLIC_API_URL + '/challenges/' + slug + '/deletelike';
            const requestOptions = {
                method: 'POST', headers: {
                    'Content-Type': 'application/json', Authorization: 'Bearer ' + localStorage.getItem('idToken'),
                },
            };
            const { error } = await fetch(endPoint, requestOptions);
            if (error) {
                alert(error);
            } else {
                setLikeCount(likeCount - 1);
                setLiked(false);
            }
        }
    };

    return (<>
        <Head>
            <title>{challenge ? challenge.title : ""} - CTFGuide</title>
            <style>
                @import
                url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
            </style>
        </Head>
        <main>
            <div id="reportalert"
                className="hidden text-white flex bg-blue-900 center fixed bottom-6 right-6 rounded-md bg-[#7cd313] p-2">
                <CheckCircleIcon className='w-6 h-6 mr-2'> </CheckCircleIcon>We'll investigate this challenge and
                take appropriate action.
            </div>
            <StandardNav />
            <div className=" w-full py-10 " style={{
                backgroundSize: "cover",
                backgroundImage: 'url("https://images.unsplash.com/photo-1633259584604-afdc243122ea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80")'
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
                            src={`https://robohash.org/` + challenge.creator + `.png?set=set1&size=150x150`}
                            alt=""
                        />
                        <p className="my-auto text-sm">{challenge.creator}</p>
                    </div>
                </div>
            </div>

            <div className="mx-auto mt-6 max-w-6xl text-left">
                <div className="mb-2 flex place-items-center justify-between">
                    <div>
                        <h1 className="inline-block text-3xl font-semibold text-white">
                            {' '}
                            Challenge Description{' '}
                        </h1>
                    </div>

                    <div className="flex">
                        <button
                            onClick={likeChallenge}
                            className="card-body m-1 flex rounded-md bg-neutral-800 px-10 py-2 hover:bg-neutral-700"
                        >
                            <h1 className=" mr-4 bg-gradient-to-br from-orange-400 to-yellow-400 bg-clip-text text-2xl font-semibold text-transparent">
                                <HeartIcon className="h-8 w-8 text-red-500" />
                            </h1>
                            <p className=" text-2xl text-white">{likeCount}</p>
                        </button>
                        <button

                            onClick={() => {
                                document.getElementById("reportalert").classList.remove("hidden");
                                setTimeout(function () {
                                    document.getElementById("reportalert").classList.add("hidden");
                                }, 15000);
                            }}
                            className="card-body hidden m-1 flex rounded-md bg-neutral-800 px-10 py-2 hover:bg-neutral-700"
                        >
                            <h1 className=" flex bg-gradient-to-br from-orange-400 to-yellow-400 bg-clip-text text-2xl font-semibold text-transparent">
                                <FlagIcon className="h-8 w-8 text-yellow-600 mr-2" /> <p
                                    className='text-white font-normal text-lg'>Report Challenge</p>
                            </h1>
                        </button>
                        <button
                            className="hidden card-body m-1 rounded-md bg-neutral-800 px-4 py-1 hover:bg-neutral-700">
                            <h1 className="bg-gradient-to-br from-orange-400 to-yellow-400 bg-clip-text text-sm font-semibold text-transparent">
                                View Submissions
                            </h1>
                            <p className="text-sm text-white">Coming Soon</p>
                        </button>
                    </div>
                </div>
                {/* ***************************************** */}

                <div id="challengeDetails" style={{ color: '#8c8c8c' }}
                    className="w-full text-lg text-white whitespace-pre-wrap border-l-4 border-blue-700 px-4 bg-neutral-800/50 py-2">
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
                                    hidden={!hintMessages}
                                    onClick={() => setHintOpen(true)}
                                    className="mt-4  ml-2  rounded-lg  bg-black bg-yellow-700 px-4 py-1 text-yellow-300 text-white hover:bg-yellow-900"
                                >
                                    Stuck?
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="hidden mt-6 grid gap-10 sm:grid-cols-1 lg:grid-cols-3">
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
                            <h1 className="bg-gradient-to-br from-blue-400 to-indigo-500 bg-clip-text text-2xl font-semibold text-white text-transparent ">
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
                            <h1 className="bg-gradient-to-br from-blue-400 to-green-500 bg-clip-text text-2xl font-semibold text-white text-transparent">
                                #3
                            </h1>
                            <p className="text-lg text-white">{leaderboards[2]}</p>
                        </div>
                    </div>
                </div>
                <div id="terminal" className=" mt-6 max-w-6xl mx-auto">
                    <div className="hint mb-2 text-gray-400">
                        <span className="text-white font-semibold   "> <span className='text-blue-500'></span></span> Login as{' '}
                        <span className="text-yellow-400">{terminalUsername}</span> using
                        the password{' '}
                        <span className="text-yellow-400">{terminalPassword}</span>

                        <div
                            className='float-right ml-auto flex  cursor-pointer'>



                            <span
                                style={{ cursor: 'pointer' }}
                                className=" text-gray-300 hover:bg-black"
                            >
                                Container will stop in: <span id="timer"></span>


                            </span>

                            <span onClick={() => { window.location.reload() }} className='hidden ml-2 text-red-500'>If you see a 404, click here.</span>




                        </div>
                    </div>

                    <div className="w-full bg-black text-center mx-auto text-white h-500 py-10"
                        height="500" id="terminalLoader">
                        <span className="text-2xl font-semibold inline-block text-white">
                            {Math.round(progress)}%
                        </span>
                        <h1 className='text-xl text-center'>Launching Terminal</h1>
                        <div className="relative max-w-xl mx-auto ">
                            <div className="flex  items-center justify-between">
                                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-800 "></span>


                            </div>
                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-600">
                                <div style={{ width: `${progress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-900"></div>
                            </div>

                            <span className="text-sm italic inline-block text-white">
                                Expected Time: {eta} seconds
                            </span>
                        </div>
                        <img className="text-center mx-auto" width="50" src="https://ctfguide.com/darkLogo.png"></img>
                        <span className="text-sm  inline-block text-white">
                            Version 2 <br>
                            </br>

                            AI insights are disabled. If you see a blank page upon loading, please refresh the page.
                        </span>
                    </div>


                    <iframe
                        onError={() => window.location.reload()}
                        className="w-full bg-white opacity-0"
                        height="500"
                        id="termurl"
                    ></iframe>



                </div>
                <div className="mt-5 rounded-lg px-5 pb-20">
                    <h1 className="text-3xl font-semibold text-white">Comments</h1>
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
                    {comments.map((message, index) => (<div
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
                    </div>))}
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
                <div
                    className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
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
                        <div
                            className="relative inline-block transform overflow-hidden rounded-lg border border-gray-700 bg-gray-900 px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6 sm:align-middle">
                            <div>
                                <div className="mx-auto flex items-center justify-center rounded-full ">

                                    {(submissionMsg == "success") && <svg
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
                                    }

                                    {(submissionMsg == "incorrect") && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="text-red-500 w-14 h-14">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>}

                                </div>
                                <div className="mt-2 text-center sm:mt-5">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-100"
                                    >
                                        {(submissionMsg == "success") ? "Nice hackin', partner!" : ""}
                                        {(submissionMsg == "incorrect") ? "Submission incorrect!" : ""}
                                        {(submissionMsg == "error") ? "Login to submit a flag" : ""}
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-gray-200">
                                            {(submissionMsg == "success") ? `You were awarded ${award} points.` : ""}
                                            {(submissionMsg == "incorrect") ? `Incorrect submission, no points awarded.` : ""}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mx-auto mt-5 flex text-center sm:mt-6">
                                <button
                                    type="button"
                                    className="inline-flex w-auto justify-center rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-base font-medium text-white shadow-sm  focus:outline-none  sm:text-sm"
                                    onClick={() => (window.location.href = '../leaderboards/global')}
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
                                    <div
                                        className="flex h-full flex-col overflow-y-scroll bg-[#161616] py-6 shadow-xl">
                                        <div className="px-4 sm:px-6">
                                            <div className="flex items-start justify-between">
                                                <Dialog.Title
                                                    className="text-base font-semibold leading-6 text-gray-300">
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
                                            <div
                                                className="mt-3 rounded-md border border-neutral-900 bg-neutral-800">
                                                <h2 className="text-md mx-4 mt-2 mb-2 text-gray-200">
                                                    <i class="far fa-lightbulb text-yellow-400 mr-1"></i> On
                                                    our main platform, each hint incurs a 10% penalty
                                                    and each submission a 3% penalty.
                                                </h2>
                                            </div>
                                            <div
                                                className="hidden w-4/5 mt-3 rounded-md border border-neutral-900 bg-neutral-800 absolute bottom-4 mx-auto">
                                                <h2 className="text-md mx-4 mt-2 mb-2 text-gray-200">
                                                    <i class="far fa-star text-blue-500 mr-1"></i> You must be
                                                    logged in to see hints!
                                                </h2>
                                            </div>
                                        </div>
                                        <div className="mt-6 px-4 font-medium text-yellow-400 sm:px-6">
                                            {hintMessages ? (
                                                <div>
                                                    {hintMessages.map((hint, index) => (
                                                        <div
                                                            key={index}
                                                            className="w-full border-l-4  border-blue-600  bg-[#212121] px-4 py-3 mb-2 text-lg"
                                                            enter="transition-opacity duration-75"
                                                            enterFrom="opacity-0"
                                                            enterTo="opacity-100"
                                                            leave="transition-opacity duration-150"
                                                            leaveFrom="opacity-100"
                                                            leaveTo="opacity-0"

                                                        >
                                                            <p className="text-white">
                                                                <span className='text-xl font-semibold'>Hint #{index + 1}</span>
                                                                {hint && <p>{hint}</p>}
                                                            </p>
                                                        </div>
                                                    ))}
                                                    <div className="w-full">
                                                        <button
                                                            hidden={hideHintButton}
                                                            type="button"
                                                            className="hover:bg-neutral-800 text-center mx-auto bg-[#212121] w-full py-2 text-lg"
                                                            onClick={handleButtonClick}
                                                        >
                                                            <span className="sr-only bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-600">View hint</span>
                                                            <i class="fas fa-unlock "></i>&nbsp; Unlock Hint #{hintMessages.length + 1}
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
        <p className="mx-auto mt-1.5 w-3/5 rounded-lg bg-neutral-800 py-0.5 px-4 text-sm text-gray-200">
            ℹ We provide accessible environments for everyone to run cybersecurity
            tools. Abuse and unnecessary computation is prohibited.
        </p>
        <Footer />
    </>)
}