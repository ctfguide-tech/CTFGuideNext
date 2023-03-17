import Head from 'next/head'
import Link from 'next/link'
import { Button } from '@/components/Button'
import { TextField } from '@/components/Fields'
import { Logo } from '@/components/Logo'
import { Alert } from '@/components/Alert'
import { Container } from '@/components/Container'
import { StandardNav } from '@/components/StandardNav'
import { useRouter } from 'next/router'
import { useEffect, useState, Fragment } from 'react'
import { faL } from '@fortawesome/free-solid-svg-icons'
import { Disclosure, Menu, Transition, Dialog } from '@headlessui/react'
import { BellIcon, MenuIcon, XIcon, FireIcon, StarIcon } from '@heroicons/react/outline'
import { XMarkIcon } from '@heroicons/react/24/outline'
import Collapsible from 'react-collapsible';

function Pratice({slug}) {
    const NO_PLACE = "Not placed";

    const [challenge, setChallenge] = useState({});
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [open, setOpen] = useState(false);
    const [hintOpen, setHintOpen] = useState(false);
    const [flag, setFlag] = useState("");
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [leaderboards, setLeaderboards] = useState([NO_PLACE, NO_PLACE, NO_PLACE]);
    const [award, setAward] = useState("");

    const [userData, setUserData] = useState({
        points: 0,
        susername: 'Loading...',
        spassword: 'Loading...',
    })

    useEffect(() => {
        const award = localStorage.getItem('award');
        
        if(award) {
            setAward(award);
        }

        const fetchData = async () => {
            try {
                const endPoint = process.env.NEXT_PUBLIC_API_URL + '/challenges/' + slug;
                const requestOptions = {
                    method: 'GET',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('idToken'),
                    },
                };
                const response = await fetch(endPoint, requestOptions);
                const result = await response.json();
                setChallenge(result);
            } catch (err) {
                throw err;
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchLikeUrl  = async () => {
            const userLikesUrl = localStorage.getItem('userLikesUrl');
            const requestOptions = {
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('idToken'),
                },
            };
            const response = await fetch(userLikesUrl, requestOptions);
            const result = await response.json();

            const likes = result.filter(item => {
                return item.challenge.slug === slug;
            })
            setLiked(likes.length ? true : false);
            setLikeCount(likeCount + 1)
        }
        fetchLikeUrl();
    }, []);

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    useEffect(() => {
        fetchComments();
    }, []);

    useEffect(() => {
        if(challenge.upvotes) {
            setLikeCount(challenge.upvotes);
        }
    }, [challenge])

    const submitFlag = async () => {
        const slug = challenge.slug;
        console.log(flag.length);
        
        if(!flag) {
            document.getElementById("enteredFlag").classList.remove("border-gray-700");
            document.getElementById("enteredFlag").classList.add("border-red-600");
            document.getElementById("enterFlagBTN").innerHTML = "Submit Flag";

            setTimeout(function () {
                document.getElementById("enteredFlag").classList.remove("border-red-600");
            }, 2000)
        } else {
            try {
                const endPoint = process.env.NEXT_PUBLIC_API_URL + '/challenges/' + slug + '/submissions';
                const requestOptions = {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('idToken'),
                    },
                    body: JSON.stringify({
                        "keyword": flag,
                    })
                };
                const response = await fetch(endPoint, requestOptions);
                const { success, error } = await response.json();

                if(error) {
                    alert(error);
                }
                
                if(success) {
                    document.getElementById("enteredFlag").classList.add("border-green-600");
                    document.getElementById("enterFlagBTN").innerHTML = "Submit Flag";
                    setOpen(true);
        
                    setTimeout(function () {
                        document.getElementById("enteredFlag").classList.remove("border-green-600");
                    }, 2000)
                } else {
                    document.getElementById("enteredFlag").classList.add("border-red-600");
                    document.getElementById("enterFlagBTN").innerHTML = "Submit Flag";

                    setTimeout(function () {
                        document.getElementById("enteredFlag").classList.remove("border-red-600");
                    }, 2000)
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

            if(result && result.length) {
                setComments([...result]);
            }
        } catch (error) {
            throw error;
        }
    }

    const onCommentReport = async () => {
        alert("Thank you for reporting this comment. Our moderation team will look into this.");
        // Call comment report API
    }

    const fetchLeaderboard = async () => {
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/challenges/' + slug + '/leaderboard');
            const leaderboards = await response.json();
            const NO_PLACE = "Not placed";

            if(!leaderboards.length) return;

            const user1 = leaderboards.filter(leaderboard => {
                return leaderboard.id == 1
            })
            const user2 = leaderboards.filter(leaderboard => {
                return leaderboard.id == 2
            })
            const user3 = leaderboards.filter(leaderboard => {
                return leaderboard.id == 3
            })

            setLeaderboards([
                user1.length ? user1[0].username : NO_PLACE, 
                user2.length ? user2[0].username : NO_PLACE,
                user3.length ? user3[0].username : NO_PLACE,
            ]);
        } catch (error) {
            throw error;
        }
    }

    const submitComment = async () => {
        const endPoint = process.env.NEXT_PUBLIC_API_URL + '/challenges/' + slug + '/comments';
        const requestOptions = {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('idToken')
            },
            body: JSON.stringify({
                "content": comment,
            })
        };
        const response = await fetch(endPoint, requestOptions);
        const result = await response.json();

        setComments([result, ...comments]);

        if(result.error) {
            console.log("Error occured while adding the comment");
        }
    }
    const commentChange = (event) => {
        setComment(event.target.value);
    }
    const flagChanged = (event) => {
        setFlag(event.target.value);
    }
    const likeChallenge = async () => {
        console.log(liked)
        if(!liked) {
            const endPoint = process.env.NEXT_PUBLIC_API_URL + '/challenges/' + slug + '/like';
            const requestOptions = {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('idToken')
                },
            };
            const {error} = await fetch(endPoint, requestOptions);
            if(error) {
                alert(error)
            } else {
                setLikeCount(likeCount + 1)
                setLiked(true)
            }
        } else {
            const endPoint = process.env.NEXT_PUBLIC_API_URL + '/challenges/' + slug + '/deletelike';
            const requestOptions = {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('idToken')
                },
            };
            const {error} = await fetch(endPoint, requestOptions);
            if(error) {
                alert(error)
            } else {
                setLikeCount(likeCount - 1)
                setLiked(false)
            }
        }
    }

    return (
        <>
        <Head>
        <title>Practice  - CTFGuide</title>
        <style>
        @import url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
        </style>
        </Head>
        
        
        <StandardNav />
        <main>
        
        <div className=" w-full " style={{ backgroundColor: "#212121" }}>
            <div className="flex mx-auto text-center h-28 my-auto">
            <h1 className='text-4xl text-white mx-auto my-auto font-semibold'>{challenge.slug}</h1>
            </div>
        </div>
        
        
        
        <div className='max-w-6xl mx-auto text-left mt-6'>
            <div className='flex place-items-center justify-between mb-2'>
                <div>
                    <h1 className='text-white text-3xl font-semibold inline-block'> Challenge Description </h1>
                </div>

                <div>
                    <button onClick={likeChallenge} className="w-[80px] h-[80px] m-1 rounded-md card-body border-2 border-solid border-orange-400">
                        <h1 className="text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-yellow-400  text-2xl font-semibold">👍</h1>
                        <p className="text-white text-lg">{likeCount}</p>
                    </button>
                </div>
            </div>
        {/* ***************************************** */}
        <div>

            <div className="flex items-center justify-between">

            <div className="flex w-full my-auto">
                <h1 id="challengeName" className="mt-5 w-1/2 text-4xl text-white mb-4 font-semibold">
                    {challenge.title}
                </h1>

                <div style={{ backgroundColor: "#212121" }} className="ml-auto  w-1/6 my-auto  rounded-lg px-2 py-1">
                <div className="text-sm mt-1   rounded-lg px-1 py-1 rounded-lg flex" >


                    <div className="c-avatar" >

                    <img width="70" className="rounded-full mx-auto c-avatar__image" src="https://avatars.githubusercontent.com/u/67762433?v=4"></img>


                    </div>

                    <div className=" pl-3">
                    <div className="text-white text-lg font-bold">{challenge.creator} <i className="fas fa-tools"></i></div>
                    <div className=" text-sm" style={{ color: "#8c8c8c" }}> Author</div>

                    </div>

                </div>
                </div>
            </div>


            </div>

        </div>
        <p id="challengeDetails" style={{ color: "#8c8c8c" }} className="w-5/6 text-white text-lg">
            {challenge.content}
        </p>
        <div className="flex ">
            <div className="mt-4 rounded-lg">
                <div className="text-sm    rounded-lg   rounded-lg flex" >
                    <div style={{ color: "#8c8c8c" }} className="mb-4">

                    <input id="enteredFlag" onChange={flagChanged} style={{ backgroundColor: "#212121" }} placeholder="Flag Here" className="mx-auto text-white  focus-outline-none  outline-none px-4 py-1 rounded-lg mr-2 bg-black border border-gray-700"></input>
                    <button id="enterFlagBTN" onClick={submitFlag} className="  bg-green-700   rounded-lg  hover:bg-green-900 text-green-300 px-4 py-1">Submit Flag</button>
                    <button onClick={() => setHintOpen(true)} className="mt-4  bg-black  rounded-lg  bg-yellow-700 text-yellow-300 hover:bg-yellow-900 text-white px-4 py-1 ml-2">Stuck?</button>
                    </div>

                </div>
            </div>
        </div>
        <div className="mt-6 grid lg:grid-cols-3 gap-10 sm:grid-cols-1">

            <div style={{ backgroundColor: "#212121" }} className="w-full py-3 card mx-auto text-center">
            <div className="card-body">
                <h1 className="text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-yellow-400  text-2xl font-semibold">#1</h1>
                <p className="text-white text-lg">{leaderboards[0]}</p>

            </div>
            </div>

            <div style={{ backgroundColor: "#212121" }} className="w-full py-3 card mx-auto text-center">
            <div className="card-body">
                <h1 className="text-white text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-indigo-500 " >#2</h1>
                <p className="text-white text-lg">{leaderboards[1]}</p>

            </div>
            </div>

            <div style={{ backgroundColor: "#212121" }} className="w-full py-3 card mx-auto text-center">
            <div className="card-body">
                <h1 className="text-white text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-green-500">#3</h1>
                <p className="text-white text-lg">{leaderboards[2]}</p>

            </div>
            </div>

        </div>

        <div id="terminal" className=" mt-6 ">
            <p className="text-gray-400 mb-2 hint"><span className="text-white ">Terminal (Beta)</span> Login as <span className="text-yellow-400">{userData.susername}</span> using the password <span className="text-yellow-400">{userData.spassword}</span><a style={{ cursor: 'pointer' }} className="hidden hover:bg-black text-gray-300">Need help?</a></p>
            <iframe className="w-full" height="500" src="https://terminal.ctfguide.com/wetty/ssh/root?pass=" ></iframe>
        </div>
        <div className="mt-5 rounded-lg px-5 ">
            <h1 className="text-white text-3xl font-semibold">Comments</h1>
            <textarea id="comment" onChange={commentChange} style={{ backgroundColor: "#212121" }} className="border-none mt-4 text-white focus-outline-none outline-none block w-full bg-black rounded-lg"></textarea>

            <button onClick={submitComment} id="commentButton" style={{ backgroundColor: "#212121" }} className="mt-4 border border-gray-700 bg-black hover:bg-gray-900 rounded-lg text-white px-4 py-1">Post Comment</button>
            <h1 id="commentError" className="hidden text-red-400 text-xl px-2 py-1 mt-4">Error posting comment! This could be because it was less than 5 characters or greater than 250 characters. </h1>
            {
                comments.map((message, index) => (

                <div key={index} className="mt-4 bg-black rounded-lg  " style={{ backgroundColor: "#212121" }} >
                    <h1 className="text-white px-5 pt-4 text-xl">@{message.username}</h1>
                    <p className="px-5 text-white pb-4 space-y-10">
                        <span className="mb-5">{message.content}</span><br className="mt-10"></br>
                        <a onClick={onCommentReport} className="mt-4 text-red-600 hover:text-red-500 cursor-pointer">Report Comment</a>
                    </p>
                </div>
                ))
            }
            </div>  
        </div>
        {/* ***************************************** */}
        
        <hr className='max-w-4xl mx-auto mt-10 border-slate-800'></hr>
        
        <div className='max-w-6xl mx-auto text-left mt-6'>
            <h1 className='text-white text-3xl font-semibold'> 📦  Recently Created </h1>
            <div className="grid grid-cols-4 gap-4 gap-y-6 mt-4">
            <div className='card rounded-lg px-4 py-2 w-full border-l-4 border-green-500' style={{ backgroundColor: "#212121" }}>
            <h1 className='text-white text-2xl'>Scrambled Eggs</h1>
            <p className='text-white'>Decrypt my breakfast please</p>
            <div className='flex mt-2'>
            
            <p className='text-white px-2  rounded-lg bg-blue-900 text-sm'>decryption</p>
            <p className='ml-2 text-white px-2 rounded-lg bg-blue-900 text-sm'>cryptography</p>
            </div>
            
            
            
            </div>
            <div className='card rounded-lg px-4 py-2 w-full border-l-4 border-red-500' style={{ backgroundColor: "#212121" }}>
            <h1 className='text-white text-2xl'>Scrambled Eggs</h1>
            <p className='text-white'>Decrypt my breakfast please</p>
            <div className='flex mt-2'>
            
            <p className='text-white px-2  rounded-lg bg-blue-900 text-sm'>decryption</p>
            <p className='ml-2 text-white px-2 rounded-lg bg-blue-900 text-sm'>cryptography</p>
            </div>
            
            </div>
            <div className='card rounded-lg px-4 py-2 w-full border-l-4 border-yellow-500' style={{ backgroundColor: "#212121" }}>
            <h1 className='text-white text-2xl'>Scrambled Eggs</h1>
            <p className='text-white'>Decrypt my breakfast please</p>
            <div className='flex mt-2'>
            
            <p className='text-white px-2  rounded-lg bg-blue-900 text-sm'>decryption</p>
            <p className='ml-2 text-white px-2 rounded-lg bg-blue-900 text-sm'>cryptography</p>
            </div>
            </div>
            <div className='card rounded-lg px-4 py-2 w-full border-l-4 border-red-500' style={{ backgroundColor: "#212121" }}>
            <h1 className='text-white text-2xl'>Scrambled Eggs</h1>
            <p className='text-white'>Decrypt my breakfast please</p>
            <div className='flex mt-2'>
            
            <p className='text-white px-2  rounded-lg bg-blue-900 text-sm'>decryption</p>
            <p className='ml-2 text-white px-2 rounded-lg bg-blue-900 text-sm'>cryptography</p>
            </div>
            
            </div>
            <div className='card rounded-lg px-4 py-2 w-full border-l-4 border-yellow-500' style={{ backgroundColor: "#212121" }}>
            <h1 className='text-white text-2xl'>Scrambled Eggs</h1>
            <p className='text-white'>Decrypt my breakfast please</p>
            <div className='flex mt-2'>
            
            <p className='text-white px-2  rounded-lg bg-blue-900 text-sm'>decryption</p>
            <p className='ml-2 text-white px-2 rounded-lg bg-blue-900 text-sm'>cryptography</p>
            </div>
            </div>
            <div className='card rounded-lg px-4 py-2 w-full border-l-4 border-red-500' style={{ backgroundColor: "#212121" }}>
            <h1 className='text-white text-2xl'>Scrambled Eggs</h1>
            <p className='text-white'>Decrypt my breakfast please</p>
            <div className='flex mt-2'>
            
            <p className='text-white px-2  rounded-lg bg-blue-900 text-sm'>decryption</p>
            <p className='ml-2 text-white px-2 rounded-lg bg-blue-900 text-sm'>cryptography</p>
            </div>
            
            </div>
            <div className='card rounded-lg px-4 py-2 w-full border-l-4 border-yellow-500' style={{ backgroundColor: "#212121" }}>
            <h1 className='text-white text-2xl'>Scrambled Eggs</h1>
            <p className='text-white'>Decrypt my breakfast please</p>
            <div className='flex mt-2'>
            
            <p className='text-white px-2  rounded-lg bg-blue-900 text-sm'>decryption</p>
            <p className='ml-2 text-white px-2 rounded-lg bg-blue-900 text-sm'>cryptography</p>
            </div>
            </div>
            <div className='card rounded-lg px-4 py-2 w-full border-l-4 border-red-500' style={{ backgroundColor: "#212121" }}>
            <h1 className='text-white text-2xl'>Scrambled Eggs</h1>
            <p className='text-white'>Decrypt my breakfast please</p>
            <div className='flex mt-2'>
            
            <p className='text-white px-2  rounded-lg bg-blue-900 text-sm'>decryption</p>
            <p className='ml-2 text-white px-2 rounded-lg bg-blue-900 text-sm'>cryptography</p>
            </div>
            
            </div>
            <div className='card rounded-lg px-4 py-2 w-full border-l-4 border-yellow-500' style={{ backgroundColor: "#212121" }}>
            <h1 className='text-white text-2xl'>Scrambled Eggs</h1>
            <p className='text-white'>Decrypt my breakfast please</p>
            <div className='flex mt-2'>
            
            <p className='text-white px-2  rounded-lg bg-blue-900 text-sm'>decryption</p>
            <p className='ml-2 text-white px-2 rounded-lg bg-blue-900 text-sm'>cryptography</p>
            </div>
            </div>
            
            
            </div>
        </div>
        
        
        </main>
        <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={setOpen}>
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
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
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
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
              <div className="relative inline-block align-bottom bg-gray-900 border border-gray-700 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
                <div>
                  <div className="mx-auto flex items-center justify-center rounded-full ">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>

                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-100">
                      Nice hackin', partner!
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-gray-200">
                        You were awarded <span>{award}</span> points.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 mx-auto text-center flex">
                  <button
                    type="button"
                    className="inline-flex justify-center w-auto rounded-md shadow-sm px-4 py-2 bg-gray-800 border border-gray-700 text-base font-medium text-white  focus:outline-none  sm:text-sm"
                    onClick={() => window.location.href = "../leaderboards/global"}
                  >
                    View Leaderboards
                  </button>
                  <button
                    type="button"
                    className="ml-2 w-auto inline-flex justify-center   rounded-md shadow-sm px-4 py-2 bg-gray-800 border border-gray-700 text-base font-medium text-white  focus:outline-none  sm:text-sm"
                    onClick={() => window.location.href = "../practice/all"}
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
                                </Dialog.Title>
                                <div className="ml-3 flex h-7 items-center">
                                <button
                                    type="button"
                                    className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    onClick={() => setHintOpen(false)}
                                >
                                    <span className="sr-only">Close panel</span>
                                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                </button>
                                </div>
                            </div>
                            </div>
                            <div className="relative mt-6 flex-1 px-4 sm:px-6  text-yellow-400 font-medium">
                                {challenge.Hints ? challenge.Hints.map((hint, index) => (
                                    <div key={index} className='w-full p-2 border-2 border-gray-300 border-solid text-lg bg-[#212121]'>
                                    <Collapsible trigger={"Hint #" + (index + 1)} >
                                        <p className='text-base text-white font-normal'>
                                            {hint.message}
                                        </p>
                                    </Collapsible>
                                </div>
                                )) : <p className='text-base text-white font-normal'>
                                    Oops, no hints for this challenge.
                                </p>}
                            </div>
                        </div>
                        </Dialog.Panel>
                    </Transition.Child>
                    </div>
                </div>
                </div>
            </Dialog>
        </Transition.Root>
        
        </>
    )
}

Pratice.getInitialProps = async ({pathname, req, query}) => {
    const slug = query.slug;
    console.log(pathname);
    return {slug: slug}
}

export default Pratice;