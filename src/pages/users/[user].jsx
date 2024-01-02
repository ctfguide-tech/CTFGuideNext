import firebase from 'firebase/app';
// import { storage } from '../../config/firebaseConfig.js';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '../../config/firebaseConfig.js';

import Markdown from 'react-markdown';

// Kshitij

import 'firebase/storage';
import Head from 'next/head';

import React from 'react';
import { Footer } from '@/components/Footer';
import { StandardNav } from '@/components/StandardNav';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { useEffect } from 'react';
import { useState } from 'react';
import PieChart from '@/components/profile/PieChart.jsx';
import { SideNavContent } from '@/components/dashboard/SideNavContents';
import { RightSideFiller } from '@/components/dashboard/RightSideFiller';
import Skeleton from 'react-loading-skeleton';
import { Router } from 'react-router-dom';
import { useRouter } from 'next/router';
import useRef from 'react';
import { Transition, Fragment, Dialog } from '@headlessui/react';


export default function Users() {
    const router = useRouter();
    const { user } = router.query;


    let invalidUser = null;
    const [ownUser, setOwnUser] = useState(false);


    const [username, setUsername] = useState(null);
    const [realName, setRealName] = useState(null);
    const [bio, setBio] = useState(null);
    const [followerCount, setFollowerCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [followedUser, setFollowedUser] = useState(null);
    const [followerList, setFollowerList] = useState(null);
    const [userData, setUserData] = useState(null);


    const [friendedUser, setFriendedUser] = useState(null);
    const [pendingRequest, setPendingRequest] = useState(null);
    const [friendList, setFriendList] = useState(null);


    const [completedChallenges, setCompletedChallenges] = useState(null);


    const [createDate, setCreateDate] = useState(null);
    const [rank, setRank] = useState(null);


    const [openBio, setOpenBio] = useState(false);
    const [banner, bannerState] = useState(false);
    const [badges, setbadges] = useState([]);


    const [selectedImage, setSelectedImage] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [pfp, setPfp] = useState('`https://robohash.org/Kshitij.png?set=set1&size=150x150`');


    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setSelectedImage(file);
    }


    const handleSaveChanges = async () => {
        if (!selectedImage) {
            console.log("No image selected");
            setIsPopupOpen(false)
            return;
        }


        // upload to firebase storage
        try {
            const storage = getStorage();
            const metadata = {
                contentType: 'image/jpeg',
            };


            const storageRef = ref(storage, `${userData.email}/pictures/pfp`);
            const uploadTask = uploadBytesResumable(storageRef, selectedImage, metadata)


            uploadTask.on('state_changed',
                (snapshot) => {
                    // progress function
                    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
                            break;
                    }
                },
                (error) => {
                    switch (error.code) {
                        case 'storage/unauthorized':
                            console.log('User does not have permission to access the object');
                            break;
                        case 'storage/canceled':
                            console.log('User canceled the upload');
                            break;
                        case 'storage/unknown':
                            console.log('Unknown error occurred, inspect error.serverResponse');
                            break;
                    }
                },
                async () => {
                    const imageUrl = await getDownloadURL(uploadTask.snapshot.ref)


                    console.log(imageUrl)


                    const endPoint = process.env.NEXT_PUBLIC_API_URL + '/users/' + user + '/updatePfp';
                    const requestOptions = {
                        method: 'POST', headers: {
                            'Content-Type': 'application/json', Authorization: 'Bearer ' + localStorage.getItem('idToken'),
                        },
                        body: JSON.stringify({ imageUrl }),
                    };
                    const response = await fetch(endPoint, requestOptions);
                    const result = await response.json();


                    console.log(result)


                    if (response.ok) {
                        console.log("profile picture uploaded successfully");
                    } else {
                        console.log("Failed to upload profile picture");
                    }
                    window.location.reload();
                }
            );
            setIsPopupOpen(false);


        } catch (err) {
            console.log(err);
            console.log("An error occured while uploading profile picture");
        }
    }


    useEffect(() => {
        if (!user) {
            return;
        }

        const fetchPfp = async () => {
            try {


            } catch {


            }
        }
    })


    // Friend useEffect
    useEffect(() => {
        if (!user) {
            return;
        }
        const fetchData = async () => {
            try {
                const endPoint = process.env.NEXT_PUBLIC_API_URL + '/friends/' + user + '/friendList';
                const requestOptions = {
                    method: 'GET', headers: {
                        'Content-Type': 'application/json', Authorization: 'Bearer ' + localStorage.getItem('idToken'),
                    },
                };
                const response = await fetch(endPoint, requestOptions);
                const result = await response.json();


                console.log(result)


                const isFriend = result.friends.some((friend) => friend == localStorage.getItem('username'));


                setFriendedUser(isFriend);


                const endPoint2 = process.env.NEXT_PUBLIC_API_URL + '/friends/' + 'sentRequests';
                const requestOptions2 = {
                    method: 'GET', headers: {
                        'Content-Type': 'application/json', Authorization: 'Bearer ' + localStorage.getItem('idToken'),
                    },
                };
                const response2 = await fetch(endPoint2, requestOptions2);
                const result2 = await response2.json();
                const isPending = result2.some((friend) => friend.recipient.username == user);

                setPendingRequest(isPending);


            } catch (err) {
                invalidUser = true;
            }
        };
        fetchData();
    }, [user]);


    // Follower useEffect
    useEffect(() => {
        if (!user) {
            return;
        }
        const fetchData = async () => {
            try {
                const endPoint = process.env.NEXT_PUBLIC_API_URL + '/followers/' + user + '/followers';
                const requestOptions = {
                    method: 'GET', headers: {
                        'Content-Type': 'application/json', Authorization: 'Bearer ' + localStorage.getItem('idToken'),
                    },
                };
                const response = await fetch(endPoint, requestOptions);
                const result = await response.json();
                const isFollower = result.followers.some(followers => followers.username == localStorage.getItem('username'));
                console.log(result)


                setFollowerCount(result.followers.length);
                setFollowedUser(isFollower);


            } catch (err) {
                invalidUser = true;
            }
        };
        const fetchFollowing = async () => {
            try {
                const endPoint = process.env.NEXT_PUBLIC_API_URL + '/followers/' + user + '/following';
                const requestOptions = {
                    method: 'GET', headers: {
                        'Content-Type': 'application/json', Authorization: 'Bearer ' + localStorage.getItem('idToken'),
                    },
                };
                const response = await fetch(endPoint, requestOptions);
                const result = await response.json();
                console.log(result)


                setFollowerCount(result.following.length);


            } catch (err) {
                invalidUser = true;
            }
        };
        fetchData();
        fetchFollowing();
    }, [user]);


    // Challenge useEffect
    useEffect(() => {
        if (!user) {
            return;
        }
        const fetchData = async () => {
            try {
                const endPoint = process.env.NEXT_PUBLIC_API_URL + '/users/' + user + '/completedChallenges';
                const requestOptions = {
                    method: 'GET', headers: {
                        'Content-Type': 'application/json', Authorization: 'Bearer ' + localStorage.getItem('idToken'),
                    },
                };
                const response = await fetch(endPoint, requestOptions);
                const result = await response.json();
                console.log(result)
                setCompletedChallenges(result);


            } catch (err) {
                console.log(err);
            }
        }


        const fetchUserData = async () => {
            try {
                const endPoint = process.env.NEXT_PUBLIC_API_URL + '/users/' + user;
                const requestOptions = {
                    method: 'GET', headers: {
                        'Content-Type': 'application/json', Authorization: 'Bearer ' + localStorage.getItem('idToken'),
                    },
                };
                const response = await fetch(endPoint, requestOptions);
                const result = await response.json();
                setCreateDate(result.createdAt.substring(0, 10))
                setRank(result.leaderboardNum)


            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
        fetchUserData();
    }, [user])


    useEffect(() => {
        if (!user) {
            return;
        }
        const fetchData = async () => {
            try {
                const endPoint = process.env.NEXT_PUBLIC_API_URL + '/followers/' + user + '/completedChallenges';
                const requestOptions = {
                    method: 'GET', headers: {
                        'Content-Type': 'application/json', Authorization: 'Bearer ' + localStorage.getItem('idToken'),
                    },
                };
                const response = await fetch(endPoint, requestOptions);
                const result = await response.json();
                console.log(result)
                setCompletedChallenges(result);


            } catch (err) {
                console.log(err);
            }
        }
        fetchData;
    }, [user])


    // Get and store user data
    useEffect(() => {
        if (!user) {
            return;
        }
        const fetchData = async () => {
            try {
                const endPoint = process.env.NEXT_PUBLIC_API_URL + '/users/' + user;
                const requestOptions = {
                    method: 'GET', headers: {
                        'Content-Type': 'application/json', Authorization: 'Bearer ' + localStorage.getItem('idToken'),
                    },
                };
                const response = await fetch(endPoint, requestOptions);
                const result = await response.json();


                setUsername(result.username);
                if (result.username == localStorage.getItem('username')) {
                    setOwnUser(true);
                }


                if (result.bio) {
                    setBio(result.bio);
                } else {
                    setBio("");
                }


                setUserData(result);
                setRealName(result.firstName + ' ' + result.lastName);


            } catch (err) {
                invalidUser = true;
            }
        };
        fetchData();
    }, [user]);


    // get user's profile picture
    useEffect(() => {
        if (!user) {
            return;
        }
        const fetchData = async () => {
            try {
                const endPoint = process.env.NEXT_PUBLIC_API_URL + '/users/' + user + '/pfp';
                const requestOptions = {
                    method: 'GET', headers: {
                        'Content-Type': 'application/json', Authorization: 'Bearer ' + localStorage.getItem('idToken'),
                    },
                };
                const response = await fetch(endPoint, requestOptions);
                const result = await response.json();

                if (result) {

                    setPfp(result)
                }




            } catch (err) {
                console.log('failed to get profile picture')
            }
        };
        fetchData();
    }, [user]);


    function openTheBio() {
        setOpenBio(true);
    }


    function closeBannerAndBio() {
        bannerState(false);
        setOpenBio(false);
    }


    function openBanner() {
        bannerState(true);
    }


    function saveBio() {
        setBio(document.getElementById('bio').value);
        closeBannerAndBio();
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/account`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + localStorage.getItem('idToken'),
            },
            body: JSON.stringify({
                bio: document.getElementById('bio').value,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                document.getElementById('bio').value = data.bio;
            })
            .catch((err) => {
                console.log(err);
            });
    }


    const followUser = async () => {
        const endPoint = process.env.NEXT_PUBLIC_API_URL + `/followers/${user}/follow`;
        const requestOptions = {
            method: 'POST', headers: {
                'Content-Type': 'application/json', Authorization: 'Bearer ' + localStorage.getItem('idToken'),
            },
        };
        const response = await fetch(endPoint, requestOptions);
        const result = await response.json();
        console.log(result);
        setFollowedUser(true);
    }


    const unfollowUser = async () => {
        const endPoint = process.env.NEXT_PUBLIC_API_URL + `/followers/${user}/unfollow`;
        const requestOptions = {
            method: 'DELETE', headers: {
                'Content-Type': 'application/json', Authorization: 'Bearer ' + localStorage.getItem('idToken'),
            },
        };
        const response = await fetch(endPoint, requestOptions);
        const result = await response.json();
        console.log(result);
        setFollowedUser(false);
    }


    const friendUser = async () => {
        const endPoint = process.env.NEXT_PUBLIC_API_URL + `/friends/${username}/sendRequest`;
        const requestOptions = {
            method: 'POST', headers: {
                'Content-Type': 'application/json', Authorization: 'Bearer ' + localStorage.getItem('idToken'),
            },
        };
        const response = await fetch(endPoint, requestOptions);
        const result = await response.json();
        setPendingRequest(true);
        console.log(result);
    }


    const unFriendUser = async () => {
        const endPoint = process.env.NEXT_PUBLIC_API_URL + `/friends/${username}/unadd`;
        const requestOptions = {
            method: 'DELETE', headers: {
                'Content-Type': 'application/json', Authorization: 'Bearer ' + localStorage.getItem('idToken'),
            },
        };
        const response = await fetch(endPoint, requestOptions);
        const result = await response.json();
        console.log(result);
        setFriendedUser(false);
    }




    const handlePopupOpen = () => {
        setIsPopupOpen(true);
    }


    const handlePopupClose = () => {
        setIsPopupOpen(false);
    }


    const handleClick = () => {


    }


    const handleDrop = () => {


    }


    const handleDragOver = () => {


    }




    return (
        <>
            <Head>
                <title>Dashboard - CTFGuide</title>
                <meta
                    name="description"
                    content="Cybersecurity made easy for everyone"
                />
                <style>
                    @import
                    url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
                </style>
            </Head>
            <StandardNav />
            <main>
                {/* PROFILE PICTURE POP-UP */}
                {ownUser &&
                    <Transition.Root show={isPopupOpen} as={Fragment}>
                        <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={handlePopupClose}>


                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div onClick={() => {
                                    handlePopupClose()
                                    localStorage.setItem("22-18-update", false)
                                }}
                                    className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" />
                            </Transition.Child>
                            <div className="flex items-end justify-center min-h-screen pt-4 px-4 text-center sm:block sm:p-0">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                >
                                    <div style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: "#161716" }} className="max-w-6xl relative inline-block align-bottom w-5/6 pb-10 pt-10 bg-gray-900 border border-gray-700 rounded-lg px-20 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle ">
                                        <div>
                                            <div className="mt-3 sm:mt-5">
                                                <h1 className="text-white text-4xl text-center pb-10">Change Profile Picture</h1>
                                                <div className="grid grid-cols-2 flex justify-center items-center">
                                                    <div className="mx-20 h-80 w-80 flex items-center justify-center">
                                                        <div className="mx-10">
                                                            <img
                                                                className="h-48 w-48 border border-neutral-800 rounded-full sm:h-48 sm:w-48"
                                                                src={
                                                                    pfp
                                                                }
                                                                alt=""
                                                            />
                                                            <h1 className="text-white text-xl text-center font-bold -mx-6 mt-7">
                                                                Current Profile Picture
                                                            </h1>
                                                        </div>
                                                    </div>
                                                    {/* INPUT BOX */}
                                                    <div
                                                        className="h-72 w-80 border border-neutral-800 mx-20 relative rounded-lg p-4 text-center cursor-pointer flex items-center justify-center"
                                                        onClick={handleClick}
                                                        onDrop={handleImageChange}
                                                        onDragOver={handleImageChange}
                                                    >
                                                        <label htmlFor="profileImageInput">
                                                            {selectedImage ? (
                                                                <div>
                                                                    <img
                                                                        src={URL.createObjectURL(selectedImage)}
                                                                        alt="Selected Profile Picture"
                                                                        className="mx-auto h-48 w-48 object-cover rounded-full"
                                                                    />
                                                                    <h1 className="text-white text-xl text-center font-bold -mx-6 mt-7">
                                                                        New Profile Picture
                                                                    </h1>
                                                                </div>
                                                            ) : (
                                                                <div className="">
                                                                    <svg
                                                                        className="mx-auto h-12 w-12 text-gray-400"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        viewBox="0 0 24 24"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth="2"
                                                                            d="M12 4v16m8-8H4"
                                                                        />
                                                                    </svg>
                                                                    <p className="mt-5 text-sm text-gray-600">Click here or Drag an Image!</p>
                                                                </div>
                                                            )}
                                                        </label>
                                                    </div>
                                                    <input
                                                        className="hidden"
                                                        type="file"
                                                        id="profileImageInput"
                                                        onChange={handleImageChange}
                                                        accept="image/*"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 pt-5">
                                                    <div className="flex items-center justify-end">
                                                        <button className="border border-neutral-700 mx-3 rounded-md w-20 text-white py-2 bg-neutral-800 hover:text-neutral-500"
                                                            onClick={handlePopupClose}>Close
                                                        </button>
                                                    </div>
                                                    <div className="flex items-center justify-start">
                                                        <button className="border border-neutral-700 mx-3 rounded-md w-20 text-white py-2 bg-green-900 hover:text-neutral-500"
                                                            onClick={handleSaveChanges}>Save
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Transition.Child>
                            </div>
                        </Dialog>
                    </Transition.Root>
                }


                {/* BANNER */}
                <div
                    style={{ backgroundSize: "cover", backgroundImage: 'url("https://images.unsplash.com/photo-1500964757637-c85e8a162699?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3903&q=80")' }}
                    className="h-40 w-full object-cover lg:h-30"
                    alt=""
                >
                </div>
                {/* NAME CARD */}
                <div className="mx-auto max-w-7xl   border border-neutral-900">

                    <div className="-mt-16 mb-2 mx-auto max-w-6xl">
                        <div className="flex ">
                            {/* Profile Picture */}
                            <div className="flex">
                                {(username && (
                                    <img
                                        style={{ borderColor: '#ffbf00' }}
                                        onClick={handlePopupOpen}
                                        className="h-40 w-40 rounded-full hover:bg-[#212121] sm:h-30 sm:w-30"
                                        src={pfp}
                                        alt=""
                                    />
                                )) || (
                                        <Skeleton
                                            circle={true}
                                            height={75}
                                            width={75}
                                            baseColor="#262626"
                                            highlightColor="#262626"
                                        />
                                    )}
                            </div>

                            <div className="pt-6 -ml-7 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
                                <div className="ml-8 w-32 flex-auto md:block">
                                    <div className="flex flex-col mt-14">
                                        {/* TOP LINE */}
                                        <div className="flex">
                                            <h1 className="truncate text-3xl font-bold text-white">
                                                {username || (
                                                    <Skeleton baseColor="#262626" highlightColor="#262626" />
                                                )}
                                            </h1>
                                            <h1 className="ml-2 truncate text-3xl font-bold text-blue-600">
                                                #12
                                            </h1>
                                            <button className="ml-3 text-xl text-white hover:text-gray-400">
                                                <i class="fas fa-solid fa-user-plus"></i>{' '}
                                            </button>
                                        </div>

                                        {/* BOTTOM LINE */}
                                        <div className="flex">
                                            <div className="flex">
                                                <p className="text-white text-lg">
                                                    <i class="fas fa-map-marker-alt mt-2"> </i>{' '}
                                                    United States
                                                </p>
                                            </div>
                                            <div>
                                                <p className="ml-3 text-blue-600 font-bold text-lg ">
                                                    <i class="fas fa-solid fa-eye mt-2"> </i>{' '}
                                                    1.2k
                                                </p>
                                            </div>
                                            <div>
                                                <p className="ml-3 text-red-600 font-bold text-lg">
                                                    <i class="fas fa-solid fa-user-shield mt-2"> </i>{' '}
                                                    ADMIN
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="pr-16 pt-6 flex">
                                <div className="flex flex-auto items-center justify-center mt-10">
                                    {/* Social Stats */}
                                    <div className="ml-3 flex items-center justify-center">
                                        <div className="mx-4 flex items-center">
                                            <h1 className="text-lg text-white">
                                                Friends:
                                            </h1>
                                            <h1 className="ml-2 text-lg font-bold text-white">
                                                12
                                            </h1>
                                        </div>

                                        <div className="mx-4 flex items-center">
                                            <h1 className="text-lg text-white">
                                                Followers:
                                            </h1>
                                            <h1 className="ml-2 text-lg font-bold text-white">
                                                23
                                            </h1>
                                        </div>

                                        <div className="mx-4 flex items-center">
                                            <h1 className="text-lg text-white">
                                                Following:
                                            </h1>
                                            <h1 className="ml-2 text-lg font-bold text-white">
                                                34
                                            </h1>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* ACTUAL CONTENT AREA */}
                <div className="container  max-w-6xl mx-auto mt-5 h-full justify-center">
                    <div className="flex justify-center flex-rows w-full ">
                        {/* LEFT SIDE CONTENT */}
                        <div className="h-full w-1/3 mr-4">
                            <div className="bg-neutral-800 rounded-sm h-full grid grid-cols-1 pb-12">

                                <div className="mt-6">
                                    <h1 className="flex justify-center font-bold text-white pb-4">
                                        Streak Chart
                                    </h1>
                                </div>
                                {/* STREAK CHART */}
                                <div>
                                    <div className=" grid grid-rows-10">
                                        <div className="flex items-center justify-center">
                                            <div class="bg-green-300 w-5 h-5"></div>
                                            <div class="bg-neutral-800 w-5 h-5 ml-1"></div>
                                            <div class="bg-green-500 w-5 h-5 ml-1"></div>
                                            <div class="bg-green-600 w-5 h-5 ml-1"></div>
                                            <div class="bg-green-500 w-5 h-5 ml-1"></div>
                                            <div class="bg-green-200 w-5 h-5 ml-1"></div>
                                            <div class="bg-green-500 w-5 h-5 ml-1"></div>
                                        </div>
                                        <div className="flex items-center justify-center mt-1">
                                            <div class="bg-green-500 w-5 h-5"></div>
                                            <div class="bg-green-400 w-5 h-5 ml-1"></div>
                                            <div class="bg-green-600 w-5 h-5 ml-1"></div>
                                            <div class="bg-green-500 w-5 h-5 ml-1"></div>
                                            <div class="bg-neutral-800 w-5 h-5 ml-1"></div>
                                            <div class="bg-green-500 w-5 h-5 ml-1"></div>
                                            <div class="bg-green-500 w-5 h-5 ml-1"></div>
                                        </div>
                                        <div className="flex items-center justify-center mt-1">
                                            <div class="bg-green-300 w-5 h-5"></div>
                                            <div class="bg-green-500 w-5 h-5 ml-1"></div>
                                            <div class="bg-neutral-800 w-5 h-5 ml-1"></div>
                                            <div class="bg-green-500 w-5 h-5 ml-1"></div>
                                            <div class="bg-green-100 w-5 h-5 ml-1"></div>
                                            <div class="bg--neutral-800 w-5 h-5 ml-1"></div>
                                            <div class="bg-green-500 w-5 h-5 ml-1"></div>
                                        </div>
                                        <div className="flex items-center justify-center mt-1">
                                            <div class="bg-green-200 w-5 h-5"></div>
                                            <div class="bg-green-500 w-5 h-5 ml-1"></div>
                                            <div class="bg-green-300 w-5 h-5 ml-1"></div>
                                            <div class="bg-neutral-800 w-5 h-5 ml-1"></div>
                                            <div class="bg-green-500 w-5 h-5 ml-1"></div>
                                            <div class="bg-green-400 w-5 h-5 ml-1"></div>
                                            <div class="bg-green-500 w-5 h-5 ml-1"></div>
                                        </div>
                                        <div className="flex items-center justify-center mt-1">
                                            <div class="bg-neutral-800 w-5 h-5"></div>
                                            <div class="bg-green-500 w-5 h-5 ml-1"></div>
                                            <div class="bg-green-400 w-5 h-5 ml-1"></div>
                                            <div class="bg-green-500 w-5 h-5 ml-1"></div>
                                            <div class="bg-green-600 w-5 h-5 ml-1"></div>
                                            <div class="bg-green-500 w-5 h-5 ml-1"></div>
                                            <div class="bg-green-500 w-5 h-5 ml-1"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* MIDDLE */}
                        <div className="flex justify-center grid grid-cols-1 h-full w-full">
                            <div className="flex justify-center rounded-sm bg-neutral-800 shadow p-4 h-48 mb-4">
                                <div className="grid rows-1">
                                    <h1 className="text-3xl text-white font-bold text-center">Bio</h1>
                                    <Markdown></Markdown>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT SIDE CONTENT */}
                        <div className="h-full w-1/3 ml-4">
                            <div className="bg-neutral-800 rounded-sm h-full grid grid-cols-1">
                                <div className="my-6">
                                    <h1 className="flex items-center justify-center text-white font-bold">
                                        Challenge Completion
                                    </h1>
                                    <div className="my-8 flex items-center justify-center">
                                        <PieChart data={[36, 40, 25, 10, 18]} />
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                    {/* BADGE */}
                    <div>
                        <div className=" rounded-md mt-8 ">
                            {/* Badge Content */}
                            <div className="rounded-md">
                                <h1 className="ml-2 text-2xl font-semibold text-gray-300">Badges</h1>
                                <div className="mt-3 rounded-sm  text-lg text-white">
                                    <div className="mt-2 grid grid-cols-5 gap-x-2 gap-y-4 pb-2 ">
                                        <div
                                            className="bg-neutral-800 align-center mx-auto w-full rounded-lg px-4 py-4 text-center duration-4000 min-h-[190px] min-w-[200px] transition ease-in-out hover:bg-neutral-800/40"
                                        >
                                            <img
                                                src={`../badges/level1/beta.png`}
                                                width="100"
                                                className="mx-auto mt-2 px-1"
                                            />
                                            <h1 class="mx-auto mt-2 text-center text-xl text-white">
                                                Beta User
                                            </h1>
                                            <h1 class="text-lg text-white ">
                                                {new Date("09/12/2022").toLocaleDateString('en-US', {
                                                    month: '2-digit',
                                                    day: '2-digit',
                                                    year: 'numeric',
                                                })}
                                            </h1>
                                        </div>
                                        <div
                                            className=" bg-neutral-800 align-center mx-auto w-full rounded-lg px-4 py-4 text-center duration-4000 min-h-[190px] min-w-[200px] transition ease-in-out hover:bg-neutral-800/40"
                                        >
                                            <img
                                                src={`../badges/group2.png`}
                                                width="100"
                                                className="mx-auto mt-2 px-1 "
                                            />
                                            <h1 class="mx-auto mt-2 text-center text-xl text-white">
                                                Mastermind
                                            </h1>
                                            <h1 class="text-lg text-white ">
                                                {new Date("09/12/2022").toLocaleDateString('en-US', {
                                                    month: '2-digit',
                                                    day: '2-digit',
                                                    year: 'numeric',
                                                })}
                                            </h1>
                                        </div>
                                        <div
                                            className=" bg-neutral-800 align-center mx-auto w-full rounded-lg px-4 py-4 text-center duration-4000 min-h-[190px] min-w-[200px] transition ease-in-out hover:bg-neutral-800/40"
                                        >
                                            <img
                                                src={`../badges/group3.png`}
                                                width="100"
                                                className="mx-auto mt-2 px-1"
                                            />
                                            <h1 class="mx-auto mt-2 text-center text-xl text-white">
                                                Mastermind II
                                            </h1>
                                            <h1 class="text-lg text-white ">
                                                {new Date("09/12/2022").toLocaleDateString('en-US', {
                                                    month: '2-digit',
                                                    day: '2-digit',
                                                    year: 'numeric',
                                                })}
                                            </h1>
                                        </div>
                                        <div
                                            className=" bg-neutral-800 align-center mx-auto w-full rounded-lg px-4 py-4 text-center duration-4000 min-h-[190px] min-w-[200px] transition ease-in-out hover:bg-neutral-800/40"
                                        >
                                            <img
                                                src={`../badges/level1/creator.png`}
                                                width="100"
                                                className="mx-auto mt-2 px-1"
                                            />
                                            <h1 class="mx-auto mt-2 text-center text-xl text-white">
                                                Creator
                                            </h1>
                                            <h1 class="text-lg text-white ">
                                                {new Date("09/12/2022").toLocaleDateString('en-US', {
                                                    month: '2-digit',
                                                    day: '2-digit',
                                                    year: 'numeric',
                                                })}
                                            </h1>
                                        </div>
                                        <div
                                            className=" bg-neutral-800 align-center mx-auto w-full rounded-lg px-4 py-4 text-center duration-4000 min-h-[190px] min-w-[200px] transition ease-in-out hover:bg-neutral-800/40"
                                        >
                                            <img
                                                src={`../badges/level1/contributor.png`}
                                                width="100"
                                                className="mx-auto mt-2 px-1"
                                            />


                                            <h1 class="mx-auto mt-2 text-center text-xl text-white">
                                                Contributor
                                            </h1>
                                            <h1 class="text-lg text-white ">
                                                {new Date("09/12/2022").toLocaleDateString('en-US', {
                                                    month: '2-digit',
                                                    day: '2-digit',
                                                    year: 'numeric',
                                                })}
                                            </h1>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Created Challenges */}
                    <div>
                        {/* CHALLENGE */}
                        <div className="rounded-md">
                            <div className="rounded-md">
                                <h1 className="ml-2 mt-4 py-2 text-2xl font-semibold text-gray-300">Created Challenges</h1>
                                <div className="mt-2 flex flex-col grid grid-cols-3">


                                    <div className="bg-green-600 rounded-md">
                                        <div className="ml-1 relative isolate overflow-hidden rounded-md bg-neutral-900 pb-2 ring-1 ring-white/10 hover:ring-neutral-600">
                                            <div className="relative mx-auto max-w-7xl px-5">
                                                <div
                                                    className="absolute -bottom-8 -left-96 -z-10 transform-gpu blur-3xl sm:-bottom-64 sm:-left-40 lg:-bottom-32 lg:left-8 xl:-left-10"
                                                    aria-hidden="true"
                                                >
                                                    <div
                                                        className="aspect-[1266/975] w-[79.125rem] bg-gradient-to-tr from-[#081e75] to-[#0737f2] opacity-30"
                                                        style={{
                                                            clipPath:
                                                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                                                        }}
                                                    />
                                                </div>
                                                <div className="mx-auto lg:mx-0 lg:max-w-3xl">
                                                    <div className="mt-4 text-lg leading-8 text-gray-300">
                                                        <h1 className="text-2xl font-semibold text-white">Challenge Uno</h1>
                                                        <h1 className="text-xl text-white">Creator: Kshitij</h1>
                                                        <h1 className="text-xl font-bold text-green-600">Easy</h1>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="bg-red-600 rounded-md mx-2">
                                        <div className=" ml-1 relative isolate overflow-hidden rounded-md bg-neutral-900 pb-2 ring-1 ring-white/10 hover:ring-neutral-600">
                                            <div className="relative mx-auto max-w-7xl px-5">
                                                <div
                                                    className="absolute -bottom-8 -left-96 -z-10 transform-gpu blur-3xl sm:-bottom-64 sm:-left-40 lg:-bottom-32 lg:left-8 xl:-left-10"
                                                    aria-hidden="true"
                                                >
                                                    <div
                                                        className="aspect-[1266/975] w-[79.125rem] bg-gradient-to-tr from-[#081e75] to-[#0737f2] opacity-30"
                                                        style={{
                                                            clipPath:
                                                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                                                        }}
                                                    />
                                                </div>
                                                <div className="mx-auto lg:mx-0 lg:max-w-3xl">
                                                    <div className="mt-4 text-lg leading-8 text-gray-300">
                                                        <h1 className="text-2xl font-semibold text-white">Hello</h1>
                                                        <h1 className="text-xl text-white">Creator: Kshitij</h1>
                                                        <h1 className="text-xl font-bold text-red-600">Hard</h1>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="bg-blue-600 rounded-md">
                                        <div className="ml-1 relative isolate overflow-hidden rounded-md bg-black/10 bg-neutral-900 pb-2 ring-1 ring-white/10 hover:ring-neutral-600">
                                            <div className="relative mx-auto max-w-7xl px-5">
                                                <div
                                                    className="absolute -bottom-8 -left-96 -z-10 transform-gpu blur-3xl sm:-bottom-64 sm:-left-40 lg:-bottom-32 lg:left-8 xl:-left-10"
                                                    aria-hidden="true"
                                                >
                                                    <div
                                                        className="aspect-[1266/975] w-[79.125rem] bg-gradient-to-tr from-[#081e75] to-[#0737f2] opacity-30"
                                                        style={{
                                                            clipPath:
                                                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                                                        }}
                                                    />
                                                </div>
                                                <div className="mx-auto lg:mx-0 lg:max-w-3xl">
                                                    <div className="mt-4 text-lg leading-8 text-gray-300">
                                                        <h1 className="text-2xl font-semibold text-white">1 + 1</h1>
                                                        <h1 className="text-xl text-white">Creator: Kshitij</h1>
                                                        <h1 className="text-xl font-bold text-blue-600">Beginner</h1>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="bg-purple-400 rounded-md my-2">
                                        <div className=" ml-1 relative isolate overflow-hidden rounded-md bg-black/10 bg-neutral-900 pb-2 ring-1 ring-white/10 hover:ring-neutral-600">
                                            <div className="relative mx-auto max-w-7xl px-5">
                                                <div
                                                    className="absolute -bottom-8 -left-96 -z-10 transform-gpu blur-3xl sm:-bottom-64 sm:-left-40 lg:-bottom-32 lg:left-8 xl:-left-10"
                                                    aria-hidden="true"
                                                >
                                                    <div
                                                        className="aspect-[1266/975] w-[79.125rem] bg-gradient-to-tr from-[#081e75] to-[#0737f2] opacity-30"
                                                        style={{
                                                            clipPath:
                                                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                                                        }}
                                                    />
                                                </div>
                                                <div className="mx-auto lg:mx-0 lg:max-w-3xl">
                                                    <div className="mt-4 text-lg leading-8 text-gray-300">
                                                        <h1 className="text-2xl font-semibold text-white">Solve World Hunger</h1>
                                                        <h1 className="text-xl text-white">Creator: Kshitij</h1>
                                                        <h1 className="text-xl font-bold text-purple-400">INSANE</h1>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="bg-pink-200 rounded-md mx-2 my-2">
                                        <div className=" ml-1 relative isolate overflow-hidden rounded-md bg-black/10 bg-neutral-900 pb-2 ring-1 ring-white/10 hover:ring-neutral-600">
                                            <div className="relative mx-auto max-w-7xl px-5">
                                                <div
                                                    className="absolute -bottom-8 -left-96 -z-10 transform-gpu blur-3xl sm:-bottom-64 sm:-left-40 lg:-bottom-32 lg:left-8 xl:-left-10"
                                                    aria-hidden="true"
                                                >
                                                    <div
                                                        className="aspect-[1266/975] w-[79.125rem] bg-gradient-to-tr from-[#081e75] to-[#0737f2] opacity-30"
                                                        style={{
                                                            clipPath:
                                                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                                                        }}
                                                    />
                                                </div>
                                                <div className="mx-auto lg:mx-0 lg:max-w-3xl">
                                                    <div className="mt-4 text-lg leading-8 text-gray-300">
                                                        <h1 className="text-2xl font-semibold text-white">P = NP</h1>
                                                        <h1 className="text-xl text-white">Creator: Kshitij</h1>
                                                        <h1 className="text-xl font-bold text-pink-200">IMPOSSIBLE</h1>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="bg-orange-600 rounded-md my-2">
                                        <div className="ml-1 relative isolate overflow-hidden rounded-md bg-black/10 bg-neutral-900 pb-2 ring-1 ring-white/10 hover:ring-neutral-600">
                                            <div className="relative mx-auto max-w-7xl px-5">
                                                <div
                                                    className="absolute -bottom-8 -left-96 -z-10 transform-gpu blur-3xl sm:-bottom-64 sm:-left-40 lg:-bottom-32 lg:left-8 xl:-left-10"
                                                    aria-hidden="true"
                                                >
                                                    <div
                                                        className="aspect-[1266/975] w-[79.125rem] bg-gradient-to-tr from-[#081e75] to-[#0737f2] opacity-30"
                                                        style={{
                                                            clipPath:
                                                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                                                        }}
                                                    />
                                                </div>
                                                <div className="mx-auto lg:mx-0 lg:max-w-3xl">
                                                    <div className="mt-4 text-lg leading-8 text-gray-300">
                                                        <h1 className="text-2xl font-semibold text-white">CTF</h1>
                                                        <h1 className="text-xl text-white">Creator: Kshitij</h1>
                                                        <h1 className="text-xl font-bold text-orange-600">Medium</h1>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>


                    {/* Pinned Challenges */}
                    < div >
                        {/* CHALLENGE */}
                        <div className="rounded-md">
                            <div className="rounded-md">
                                <h1 className="ml-2 mt-4 py-2 text-2xl font-semibold text-gray-300">Pinned Challenges</h1>
                                <div className="mt-2 flex flex-col grid grid-cols-3">


                                    <div className="bg-green-600 rounded-md">
                                        <div className="ml-1 relative isolate overflow-hidden rounded-md bg-neutral-900 pb-2 ring-1 ring-white/10 hover:ring-neutral-600">
                                            <div className="relative mx-auto max-w-7xl px-5">
                                            <div
                                                    className="absolute -bottom-8 -left-96 -z-10 transform-gpu blur-3xl sm:-bottom-64 sm:-left-40 lg:-bottom-32 lg:left-8 xl:-left-10"
                                                    aria-hidden="true"
                                                >
                                                    <div
                                                        className="aspect-[1266/975] w-[79.125rem] bg-gradient-to-tr from-[#081e75] to-[#0737f2] opacity-30"
                                                        style={{
                                                            clipPath:
                                                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                                                        }}
                                                    />
                                                </div>
                                                <div className="mx-auto lg:mx-0 lg:max-w-3xl">
                                                    <div className="mt-4 text-lg leading-8 text-gray-300">
                                                        <h1 className="text-2xl font-semibold text-white">Challenge 1</h1>
                                                        <h1 className="text-xl text-white">Creator: Kshitij</h1>
                                                        <h1 className="text-xl font-bold text-green-600">Easy</h1>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="bg-red-600 rounded-md mx-2">
                                        <div className=" ml-1 relative isolate overflow-hidden rounded-md bg-neutral-900 pb-2 ring-1 ring-white/10 hover:ring-neutral-600">
                                            <div className="relative mx-auto max-w-7xl px-5">
                                            <div
                                                    className="absolute -bottom-8 -left-96 -z-10 transform-gpu blur-3xl sm:-bottom-64 sm:-left-40 lg:-bottom-32 lg:left-8 xl:-left-10"
                                                    aria-hidden="true"
                                                >
                                                    <div
                                                        className="aspect-[1266/975] w-[79.125rem] bg-gradient-to-tr from-[#081e75] to-[#0737f2] opacity-30"
                                                        style={{
                                                            clipPath:
                                                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                                                        }}
                                                    />
                                                </div>
                                                <div className="mx-auto lg:mx-0 lg:max-w-3xl">
                                                    <div className="mt-4 text-lg leading-8 text-gray-300">
                                                        <h1 className="text-2xl font-semibold text-white">Challenge 2</h1>
                                                        <h1 className="text-xl text-white">Creator: Pranav</h1>
                                                        <h1 className="text-xl font-bold text-red-600">Hard</h1>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="bg-blue-600 rounded-md">
                                        <div className=" ml-1 relative isolate overflow-hidden rounded-md bg-neutral-900 pb-2 ring-1 ring-white/10 hover:ring-neutral-600">
                                            <div className="relative mx-auto max-w-7xl px-5">
                                            <div
                                                    className="absolute -bottom-8 -left-96 -z-10 transform-gpu blur-3xl sm:-bottom-64 sm:-left-40 lg:-bottom-32 lg:left-8 xl:-left-10"
                                                    aria-hidden="true"
                                                >
                                                    <div
                                                        className="aspect-[1266/975] w-[79.125rem] bg-gradient-to-tr from-[#081e75] to-[#0737f2] opacity-30"
                                                        style={{
                                                            clipPath:
                                                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                                                        }}
                                                    />
                                                </div>
                                                <div className="mx-auto lg:mx-0 lg:max-w-3xl">
                                                    <div className="mt-4 text-lg leading-8 text-gray-300">
                                                        <h1 className="text-2xl font-semibold text-white">Challenge 3</h1>
                                                        <h1 className="text-xl text-white">Creator: Abhi</h1>
                                                        <h1 className="text-xl font-bold text-blue-600">Beginner</h1>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="bg-purple-400 rounded-md my-2">
                                        <div className=" ml-1 relative isolate overflow-hidden rounded-md bg-black/10 bg-neutral-900 pb-2 ring-1 ring-white/10 hover:ring-neutral-600">
                                            <div className="relative mx-auto max-w-7xl px-5">
                                            <div
                                                    className="absolute -bottom-8 -left-96 -z-10 transform-gpu blur-3xl sm:-bottom-64 sm:-left-40 lg:-bottom-32 lg:left-8 xl:-left-10"
                                                    aria-hidden="true"
                                                >
                                                    <div
                                                        className="aspect-[1266/975] w-[79.125rem] bg-gradient-to-tr from-[#081e75] to-[#0737f2] opacity-30"
                                                        style={{
                                                            clipPath:
                                                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                                                        }}
                                                    />
                                                </div>
                                                <div className="mx-auto lg:mx-0 lg:max-w-3xl">
                                                    <div className="mt-4 text-lg leading-8 text-gray-300">
                                                        <h1 className="text-2xl font-semibold text-white">Challenge 4</h1>
                                                        <h1 className="text-xl text-white">Creator: Scratch</h1>
                                                        <h1 className="text-xl font-bold text-purple-400">INSANE</h1>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="bg-pink-200 rounded-md mx-2 my-2">
                                        <div className=" ml-1 relative isolate overflow-hidden rounded-md bg-black/10 bg-neutral-900 pb-2 ring-1 ring-white/10 hover:ring-neutral-600">
                                            <div className="relative mx-auto max-w-7xl px-5">
                                            <div
                                                    className="absolute -bottom-8 -left-96 -z-10 transform-gpu blur-3xl sm:-bottom-64 sm:-left-40 lg:-bottom-32 lg:left-8 xl:-left-10"
                                                    aria-hidden="true"
                                                >
                                                    <div
                                                        className="aspect-[1266/975] w-[79.125rem] bg-gradient-to-tr from-[#081e75] to-[#0737f2] opacity-30"
                                                        style={{
                                                            clipPath:
                                                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                                                        }}
                                                    />
                                                </div>
                                                <div className="mx-auto lg:mx-0 lg:max-w-3xl">
                                                    <div className="mt-4 text-lg leading-8 text-gray-300">
                                                        <h1 className="text-2xl font-semibold text-white">Challenge 5</h1>
                                                        <h1 className="text-xl text-white">Creator: Staz</h1>
                                                        <h1 className="text-xl font-bold text-pink-200">IMPOSSIBLE</h1>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="bg-orange-600 rounded-md my-2">
                                        <div className="relative isolate overflow-hidden rounded-md bg-black/10 bg-neutral-900 pt-1 pb-5 ring-1 ring-white/10 hover:ring-neutral-600">
                                            <div className="relative mx-auto max-w-7xl px-5">
                                            <div
                                                    className="absolute -bottom-8 -left-96 -z-10 transform-gpu blur-3xl sm:-bottom-64 sm:-left-40 lg:-bottom-32 lg:left-8 xl:-left-10"
                                                    aria-hidden="true"
                                                >
                                                    <div
                                                        className="aspect-[1266/975] w-[79.125rem] bg-gradient-to-tr from-[#081e75] to-[#0737f2] opacity-30"
                                                        style={{
                                                            clipPath:
                                                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                                                        }}
                                                    />
                                                </div>
                                                <div className="mx-auto lg:mx-0 lg:max-w-3xl">
                                                    <div className="flex justify-center mt-4 text-lg leading-8 text-gray-300">
                                                        <h1 className="text-3xl text-white">View All Pinned Challenges </h1>
                                                        <p className="mr-8 flex items-center justify-center text-white text-5xl">
                                                            <i class="fas fa-solid fa-arrow-right"></i>

                                                        </p>


                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div >

                    <div>
                        {/* Join Date */}
                        <div className="rounded-md mt-12 ">
                            {/* Badge Content */}
                            <div className="flex justify-center rounded-md">
                                <h1 className="ml-2 text-2xl text-gray-300">CTFGuide Member since 07/25/2021</h1>
                            </div>
                        </div>
                    </div>
                </div >

            </main >
            <Footer />
            {
                banner && (
                    <div
                        style={{ backgroundColor: '#212121' }}
                        id="savebanner"
                        className="fixed inset-x-0 bottom-0 flex flex-col justify-between gap-y-4 gap-x-8 p-6 ring-1 ring-gray-900/10 md:flex-row md:items-center lg:px-8"
                        hidden={!openBio}
                    >
                        <p className="max-w-4xl text-2xl leading-6 text-white">
                            You have unsaved changes.
                        </p>
                        <div className="flex flex-none items-center gap-x-5">
                            <button
                                onClick={saveBio}
                                type="button"
                                className="rounded-md bg-green-700 px-3 py-2 text-xl font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
                            >
                                Save Changes
                            </button>
                            <button
                                onClick={closeBannerAndBio}
                                type="button"
                                className="text-xl font-semibold leading-6 text-white"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )
            }
        </>
    );
};

