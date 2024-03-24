import firebase from 'firebase/app';
// import { storage } from '../../config/firebaseConfig.js';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '../../config/firebaseConfig.js';

import Markdown from 'react-markdown';

// Kshitij
import { Tooltip } from 'react-tooltip'

import 'firebase/storage';
import Head from 'next/head';

import React from 'react';
import { Footer } from '@/components/Footer';
import { StandardNav } from '@/components/StandardNav';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { useEffect } from 'react';
import { useState } from 'react';

import ChallengeCard from '@/components/profile/ChallengeCard.jsx';
import PieChart from '@/components/profile/PieChart.jsx';
import Badge from '@/components/profile/Badge.jsx';

import { SideNavContent } from '@/components/dashboard/SideNavContents';
import { RightSideFiller } from '@/components/dashboard/RightSideFiller';
import Skeleton from 'react-loading-skeleton';
import { Router } from 'react-router-dom';
import { useRouter } from 'next/router';
import useRef from 'react';

import { Transition, Dialog } from '@headlessui/react';
import { Fragment } from 'react';

import request from "@/utils/request";

const shades = [
    'ml-1 h-5 w-5 bg-neutral-900',
    'ml-1 h-5 w-5 bg-blue-100',
    'ml-1 h-5 w-5 bg-blue-200',
    'ml-1 h-5 w-5 bg-blue-300',
    'ml-1 h-5 w-5 bg-blue-400',
    'ml-1 h-5 w-5 bg-blue-500',
    'ml-1 h-5 w-5 bg-blue-600',
    'ml-1 h-5 w-5 bg-blue-700',
    'ml-1 h-5 w-5 bg-blue-800',
    'ml-1 h-5 w-5 bg-blue-900',
];

export default function Users() {
    const router = useRouter();
    const { user } = router.query;


    let invalidUser = null;
    const [ownUser, setOwnUser] = useState(false);

    const [location, setLocation] = useState(null);
    const [username, setUsername] = useState(null);

    const [bio, setBio] = useState(null);

    const [followerCount, setFollowerCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [followedUser, setFollowedUser] = useState(null);
    const [followerList, setFollowerList] = useState(null);
    const [userData, setUserData] = useState(null);

    const [activity, setActivity] = useState([]);

    const [friendedUser, setFriendedUser] = useState(null);
    const [pendingRequest, setPendingRequest] = useState(null);
    const [friendList, setFriendList] = useState(null);

    const [createdChallenges, setCreatedChallenges] = useState(null);
    const [pinnedChallenges, setPinnedChallenges] = useState(null);
    const [completedChallenges, setCompletedChallenges] = useState(null);


    const [createDate, setCreateDate] = useState(null);
    const [rank, setRank] = useState(null);
    const [email, setEmail] = useState(null);


    const [openBio, setOpenBio] = useState(false);
    const [bioBanner, bannerState] = useState(false);
    const [tempBio, setTempBio] = useState("");

    const [badges, setbadges] = useState(null);

    const [selectedBanner, setSelectedBanner] = useState(null);
    const [isBannerPopupOpen, setIsBannerPopupOpen] = useState(false);
    const [banner, setBanner] = useState('https://images.unsplash.com/photo-1633259584604-afdc243122ea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80');

    const [selectedImage, setSelectedImage] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [pfp, setPfp] = useState(process.env.NEXT_PUBLIC_FRONTEND_URL + `ConfusedKana.png`);
    const [isLoggedIn, setIsLoggedIn] = useState(null);

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


            const storageRef = ref(storage, `${email}/pictures/pfp`);
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
                    const body = { imageUrl }
                    const response = await request(endPoint, "POST", body);
                    console.log("Here is the result: ", response)
                    if (response.success) {
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


    const handleBannerChange = (event) => {
        const file = event.target.files[0];
        setSelectedBanner(file);
    }


    const handleBannerSave = async () => {
        if (!selectedBanner) {
            console.log("No image selected");
            setIsBannerPopupOpen(false)
            return;
        }


        // upload to firebase storage
        try {
            const storage = getStorage();
            const metadata = {
                contentType: 'image/jpeg',
            };

            const storageRef = ref(storage, `${email}/pictures/banner`);
            const uploadTask = uploadBytesResumable(storageRef, selectedBanner, metadata)


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
                    const endPoint = process.env.NEXT_PUBLIC_API_URL + '/users/' + user + '/updateBanner';
                    const body = { imageUrl };
                    const result = await request(endPoint, "POST", body);
                    console.log(result)
                    if (result.success) {
                        console.log("Banner uploaded successfully");
                    } else {
                        console.log("Failed to upload Banner");
                    }
                    window.location.reload();
                }
            );
            setIsBannerPopupOpen(false);


        } catch (err) {
            console.log(err);
            console.log("An error occured while uploading banner");
        }
    }

    // Friend useEffect
    useEffect(() => {
        if (!user) {
            return;
        }
        const fetchData = async () => {
            try {
                const endPoint = process.env.NEXT_PUBLIC_API_URL + '/friends/' + user + '/friendList';
                const result = await request(endPoint, "GET", null);
                const isFriend = result.friends.some((friend) => friend == localStorage.getItem('username'));
                setFriendedUser(isFriend);
                const endPoint2 = process.env.NEXT_PUBLIC_API_URL + '/friends/' + 'sentRequests';
                const result2 = await request(endPoint2, "GET", null);
                const isPending = result2.some((friend) => friend.recipient.username == user);
                setPendingRequest(isPending);
            } catch (err) {
                invalidUser = true;
            }
        };
        fetchData();
    }, [user]);

    // check to see if user is logged in
    useEffect(() => {
        try {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/account`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + localStorage.getItem('idToken'),
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.error || !data.username) {
                        console.log("debug| user not logged in :(");
                        setIsLoggedIn(false);
                    } else {
                        setIsLoggedIn(true);
                    }
                })
                .catch((err) => {
                    console.log(err);
                    console.log("debug| user not logged in :(")
                    setIsLoggedIn(false);
                })
        } catch {
        }
    }, []);
    

    // Follower useEffect
    useEffect(() => {
        if (!user) {
            return;
        }
        const fetchData = async () => {
            try {
                const endPoint = process.env.NEXT_PUBLIC_API_URL + '/followers/' + user + '/followers';
                const result = await request(endPoint, "GET", null);

                const isFollower = result.followers.some(followers => followers.username == localStorage.getItem('username'));

                setFollowerCount(result.followers.length);
                setFollowedUser(isFollower);


            } catch (err) {
                invalidUser = true;
            }
        };
        const fetchFollowing = async () => {
            try {
                const endPoint = process.env.NEXT_PUBLIC_API_URL + '/followers/' + user + '/following';
                const result = await request(endPoint, "GET", null);
                console.log("Following " + result)


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
                const result = await request(endPoint, "GET", null);
                setCompletedChallenges(result);
                console.log("Completed Challenges Length: " + result.completedBeginnerChallenges.length)
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }, [user])


    // Created Challenge useEffect
    useEffect(() => {
        if (!user) {
            return;
        }

        const fetchData = async () => {
            try {
                const challengeEndPoint = process.env.NEXT_PUBLIC_API_URL + '/users/' + user + '/challenges';
                const challengeResult = await request(challengeEndPoint, "GET", null);
                if (!challengeResult) {
                    setCreatedChallenges(null);
                    return;
                }
                const publicChallenges = challengeResult.filter(challenge => challenge.private === false);
                publicChallenges.length !== 0 ? setCreatedChallenges(publicChallenges) : setCreatedChallenges(null);
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }, [user]);


    // Pinned Challenge useEffect
    useEffect(() => {
        if (!user) {
            return;
        }
        const fetchData = async () => {
            try {
                const pinnedChallengeEndPoint = process.env.NEXT_PUBLIC_API_URL + '/users/' + user + '/likes';
                const pinnedChallengeResult = await request(pinnedChallengeEndPoint, "GET", null);
                pinnedChallengeResult.length !== 0 ? setPinnedChallenges(pinnedChallengeResult) : setPinnedChallenges(null);
                console.log("CHALLENGE INFO" + publicChallenges[0])
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }, [user]);

    // Get and store user data
    useEffect(() => {
        if (!user) {
            return;
        }
        const fetchData = async () => {
            try {

                const endPoint = process.env.NEXT_PUBLIC_API_URL + '/users/' + user;
                const result = await request(endPoint, "GET", null);

                if (!result.username) {
                  //  return window.location.href = '/404';
                }
                setUsername(result.username);
                setCreateDate(result.createdAt);
                setRank(result.leaderboardNum);
                setEmail(result.email);
                setUserData(result);
                console.log("USERDATA: " + result)
                result.username == localStorage.getItem('username') ? setOwnUser(true) : setOwnUser(false);
                result.location === '????' ? setLocation(null) : setLocation(result.location);
                result.bio ? setBio(result.bio) : setBio(null);
                result.bio ? setTempBio(result.bio) : setTempBio("");



                // Fetch Badges
                if (result.badgesNum !== 0 || result.badgesNum !== null) {
                    const badgeEndPoint = process.env.NEXT_PUBLIC_API_URL + '/users/' + user + '/badges';
                    const badgeResult = await request(badgeEndPoint, "GET", null);
                    console.log('BADGES: ' + badgeResult)
                    badgeResult.length !== 0 ? setbadges(badgeResult) : setbadges(null);
                }

            } catch (err) {
                invalidUser = true;
                console.log("this happened")
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
                const result = await request(endPoint, "GET", null);
                console.log(result)
                if (result) {
                    setPfp(result)
                } else {
                    setPfp(`https://robohash.org/${localStorage.getItem('username')}.png?set=set1&size=150x150`)
                }

            } catch (err) {
                console.log('failed to get profile picture')
            }
        };
        fetchData();
    }, [user]);


    // get user's banner
    useEffect(() => {
        if (!user) {
            return;
        }
        const fetchData = async () => {
            try {
                const endPoint = process.env.NEXT_PUBLIC_API_URL + '/users/' + user + '/banner';
                const result = await request(endPoint, "GET", null);
                console.log(result)
                if (result) {
                    if (result !== "https://images.unsplash.com/photo-1500964757637-c85e8a162699?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3903&q=80") {
                        setBanner(result)

                    }
                   
                } else {
                    setBanner('https://images.unsplash.com/photo-1500964757637-c85e8a162699?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3903&q=80')
                }

            } catch (err) {
                console.log('failed to get banner')
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


    const openBanner = (event) => {
        bannerState(true);
        setTempBio(event.target.value);
    };


    async function saveBio() {
        setBio(document.getElementById('bio').value);
        closeBannerAndBio();
        const body = {
            bio: document.getElementById('bio').value
        }
        const data = await request(`${process.env.NEXT_PUBLIC_API_URL}/account`, "PUT", body);
        if (!data) {
            console.log("Failed to save the bio");
        }
        setBio(body.bio);
        window.location.reload();
    }


    const followUser = async () => {
        const endPoint = process.env.NEXT_PUBLIC_API_URL + `/followers/${user}/follow`;
        const result = await request(endPoint, "POST", {});
        if (result) {
            setFollowerCount(prevCount => prevCount + 1);
            setFollowedUser(true);
        }
        console.log(result);
    }


    const unfollowUser = async () => {
        const endPoint = process.env.NEXT_PUBLIC_API_URL + `/followers/${user}/unfollow`;
        const result = await request(endPoint, "DELETE", null);
        if (result) {
            setFollowerCount(prevCount => prevCount - 1);
            setFollowedUser(false);
        }
        console.log(result);
    }


    // const friendUser = async () => {
    //     const endPoint = process.env.NEXT_PUBLIC_API_URL + `/friends/${username}/sendRequest`;
    //     const result = await request(endPoint, "POST", {});
    //     setPendingRequest(true);
    //     console.log(result);
    // }


    // const unFriendUser = async () => {
    //     const endPoint = process.env.NEXT_PUBLIC_API_URL + `/friends/${username}/unadd`;
    //     const result = await request(endPoint, "DELETE", null);
    //     console.log(result);
    //     setFriendedUser(false);
    // }


    const handlePopupOpen = () => {
        setIsPopupOpen(true);
    }


    const handlePopupClose = () => {
        setIsPopupOpen(false);
    }


    const handleBannerPopupOpen = () => {
        setIsBannerPopupOpen(true);
    }


    const handleBannerPopupClose = () => {
        setIsBannerPopupOpen(false);
    }

    const handleClick = () => {

    }

    const getActivity = async () => {
        try {
            console.log("ACTIVITY FLAG : ")

            const url = `${process.env.NEXT_PUBLIC_API_URL}/activity/${userData.username}`;
            const response = await request(url, 'GET');
            const data = await response;
            if (data.success) {
                let arr = data.body;
                setActivity(arr);
            }
            console.log(data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (userData) {
            getActivity();
        }
    }, [userData]);


    return (
        <>
            <Head>
                <title>{username}'s Profile - CTFGuide</title>
                <meta
                    name="description"
                    content="Cybersecurity made easy for everyone"
                />
                <style>
                    @import
                    url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
                </style>
            </Head>
            <StandardNav guestAllowed={isLoggedIn}/>
            <main>
                {/* PROFILE PICTURE POP-UP */}
                {ownUser &&
                    <Transition.Root show={isPopupOpen} as={Fragment}>
                        <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={() => handlePopupClose()}>


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
                                                            onClick={() => handlePopupClose()}>Close
                                                        </button>
                                                    </div>
                                                    <div className="flex items-center justify-start">
                                                        <button className="border border-neutral-700 mx-3 rounded-md w-20 text-white py-2 bg-green-900 hover:text-neutral-500"
                                                            onClick={() => handleSaveChanges()}>Save
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

                {/* BANNER POP-UP */}
                {ownUser &&
                    <Transition.Root show={isBannerPopupOpen} as={Fragment}>
                        <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={() => handleBannerPopupClose()}>


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
                                    handleBannerPopupClose()
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
                                        <div className="mt-3 sm:mt-5">
                                            <h1 className="text-white text-4xl text-center pb-10">Change Banner</h1>
                                            <div className="">
                                                {/* CURRENT BANNER */}
                                                <div className=" h-full w-full flex-1">
                                                    <div
                                                        style={{
                                                            backgroundImage: `url(${banner})`,
                                                            backgroundSize: "cover",
                                                            backgroundPosition: "center",
                                                            width: "100%",
                                                            height: "12vh",
                                                        }}
                                                        className="border border-neutral-600 lg:h-30 sm:w-full"
                                                    >
                                                    </div>
                                                    <h1 className="text-white text-xl text-center font-bold mt-4">
                                                        Current Banner
                                                    </h1>
                                                </div>
                                                {/* INPUT BOX */}
                                                <div
                                                    className="mt-10 text-center cursor-pointer"
                                                    onClick={handleClick}
                                                    onDrop={handleBannerChange}
                                                    onDragOver={handleBannerChange}
                                                >
                                                    <label htmlFor="bannerImageInput">
                                                        {selectedBanner ? (
                                                            <div className="h-full w-full flex-1 justify-center">
                                                                <div
                                                                    style={{
                                                                        backgroundImage: `url(${URL.createObjectURL(selectedBanner)})`,
                                                                        backgroundSize: "cover",
                                                                        backgroundPosition: "center",
                                                                        width: "100%",
                                                                        height: "12vh",
                                                                        alt: "Selected Banner"
                                                                    }}
                                                                    className="border border-neutral-600 lg:h-30 sm:w-full"
                                                                >
                                                                </div>
                                                                <h1 className="text-white text-xl text-center font-bold mt-4">
                                                                    New Banner
                                                                </h1>
                                                            </div>
                                                        ) : (
                                                            <div className="py-20">
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
                                                    id="bannerImageInput"
                                                    onChange={handleBannerChange}
                                                    accept="image/*"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 pt-10">
                                                <div className="flex items-center justify-end">
                                                    <button className="border border-neutral-700 mx-3 rounded-md w-20 text-white py-2 bg-neutral-800 hover:text-neutral-500"
                                                        onClick={() => handleBannerPopupClose()}>Close
                                                    </button>
                                                </div>
                                                <div className="flex items-center justify-start">
                                                    <button className="border border-neutral-700 mx-3 rounded-md w-20 text-white py-2 bg-green-900 hover:text-neutral-500"
                                                        onClick={() => handleBannerSave()}>Save
                                                    </button>
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
                    style={{ backgroundSize: "cover", backgroundImage: `url(${banner})`, backgroundPosition: "center" }}
                    className="h-56 w-full object-cover"
                    alt=""
                >
                    <div className="flex p-2 grid grid-cols-5">
                        <div className="col-span-4"></div>
                        <div className="flex justify-end">
                            {ownUser &&
                                <button className="mr-2 pointer-events-none"
                                    data-tooltip-id="change-banner"
                                    data-tooltip-content="Change Banner"
                                    data-tooltip-place="bottom-end" onClick={() => handleBannerPopupOpen()}>
                                    <i class="pointer-events-auto text-2xl text-neutral-700 hover:text-gray-400 fas fa-pen-square"></i>{' '}
                                    <Tooltip className="" id="change-banner" />
                                </button>
                            }
                        </div>
                    </div>
                </div>
                {/* NAME CARD */}
                <div className="mx-auto max-w-7xl   border border-neutral-900">

                    <div className=" -mt-16 mb-2 mx-auto max-w-6xl">
                        <div className="flex ">
                            {/* Profile Picture */}
                            <div className="flex">
                                {(username && (
                                    <img
                                        style={{ borderColor: '#ffbf00' }}
                                        onClick={() => handlePopupOpen()}
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

                            <div className="pt-6 -ml-3 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
                                <div className="ml-8 w-32 flex-auto md:block">
                                    <div className="flex flex-col mt-14">
                                        {/* TOP LINE */}
                                        <div className="flex">
                                            <h1 className="truncate text-3xl font-bold text-white">
                                                {username || (
                                                    <Skeleton baseColor="#262626" highlightColor="#262626" />
                                                )}
                                            </h1>
                                            {/* <h1 className="ml-2 truncate text-3xl font-bold text-blue-600">
                                                #{rank}
                                            </h1> */}
                                            {!ownUser &&  (!followedUser ? (
                                                <button className="ml-3"
                                                    data-tooltip-id="follow-user"
                                                    data-tooltip-content="Follow User"
                                                    data-tooltip-place="top"
                                                    onClick={() => followUser()}>
                                                    <i class="text-xl text-white hover:text-gray-400 fas fa-solid fa-user-plus"></i>{' '}
                                                    <Tooltip id="follow-user" />
                                                </button>
                                            ) : (
                                                <button className="ml-3"
                                                    data-tooltip-id="unFollow-user"
                                                    data-tooltip-content="Unfollow User"
                                                    data-tooltip-place="top"
                                                    onClick={() => unfollowUser()}
                                                >
                                                    <i class="text-xl text-white hover:text-gray-400 fas fa-solid fa-users-slash"></i>{' '}
                                                    <Tooltip id="unFollow-user" />
                                                </button>
                                            ))}

                                        </div>

                                        {/* BOTTOM LINE */}
                                        <div className="flex gap-x-3">
                                            {location &&
                                                <div className="flex">
                                                    <p className="text-white text-lg">
                                                        <i class="fas fa-map-marker-alt mt-2"> </i>{' '}
                                                        {location}
                                                    </p>
                                                </div>
                                            }
                                            {/* <div>
                                                <p className="ml-3 text-blue-600 font-bold text-lg ">
                                                    <i class="fas fa-solid fa-eye mt-2"> </i>{' '}
                                                    1.2k
                                                </p>
                                            </div> */}
                                            <div>


                                                <p className="text-red-600 font-bold text-lg">
                                                    {/* <i class="fas fa-solid fa-user-shield mt-2"> </i>{' '}
                                                    ADMIN */}
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
                                                Followers:
                                            </h1>
                                            <h1 className="ml-2 text-lg font-bold text-white">
                                                {followerCount}
                                            </h1>
                                        </div>

                                        <div className="mx-4 flex items-center">
                                            <h1 className="text-lg text-white">
                                                Following:
                                            </h1>
                                            <h1 className="ml-2 text-lg font-bold text-white">
                                                {followingCount}
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
                            <div className="bg-neutral-800 rounded-xl h-full grid grid-cols-1 pb-12">

                                <div className="mt-6">
                                    <h1 className="flex justify-center font-bold text-white pb-4">
                                        Streak Chart
                                    </h1>
                                </div>


                                {/* STREAK CHART */}
                                <div>
                                    <div className=" grid-rows-10 grid">
                                        {['', '', '', '', ''].map((e, idx) => {
                                            idx = idx * 7;
                                            return (
                                                <div className="flex items-center justify-center">
                                                    {['', '', '', '', '', '', ''].map((e, j) => (
                                                        <div

                                                            className={`${shades[activity[idx + j]]} mt-1`}
                                                        ></div>
                                                    ))}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>


                            </div>
                        </div>

                        {/* MIDDLE */}
                        <div className="h-full w-full">
                            <div className="rounded-xl bg-neutral-800 shadow p-2 h-full mb-4">
                                <div className="grid grid-cols-5 flex justify-center ">
                                    <div className="col-span-2"></div>
                                    <h1 className="flex justify-center text-2xl font-bold text-white pt-2 pb-4">
                                        Bio
                                    </h1>
                                    <div className="col-span-1"></div>
                                    {ownUser ? ((!openBio && ownUser) &&
                                        <div className="flex justify-end">
                                            <button className="flex justify-end pointer-events-none"
                                                onClick={openTheBio}
                                                hidden={openBio}
                                                data-tooltip-id="edit-bio"
                                                data-tooltip-content="Edit Bio"
                                                data-tooltip-place="top-end">

                                                <i class="pointer-events-auto text-xl mt-2 mr-4 text-white hover:text-gray-400 fas fa-edit"></i>{' '}
                                                <Tooltip className="" id="edit-bio" />
                                            </button>
                                        </div>
                                    ) || (
                                            <div className="flex justify-end">
                                                <button className="flex justify-end pointer-events-none"
                                                    onClick={closeBannerAndBio}
                                                    hidden={!openBio}
                                                    data-tooltip-id="cancel-edit"
                                                    data-tooltip-content="Cancel Edits"
                                                    data-tooltip-place="top-end">

                                                    <i class="pointer-events-auto text-2xl mr-3 text-red-700 hover:text-red-400 fas fa-times"></i>{' '}
                                                    <Tooltip className="" id="cancel-edit" />
                                                </button>
                                            </div>
                                        ) : (<div></div>)}
                                </div>
                                <div>
                                    <div className="px-5 pb-5">
                                        {((openBio && ownUser) &&
                                            <div>
                                                <textarea
                                                    id="bio"
                                                    style={{ backgroundColor: '#212121', resize: "none" }}
                                                    readOnly={false}
                                                    onChange={openBanner}
                                                    value={tempBio}
                                                    className="w-full rounded-lg border-white/10 bg-neutral-900/50 px-6 pt-3 pb-12 text-lg text-white"
                                                ></textarea>
                                            </div>
                                        ) || (
                                                <div className="w-full h-full border border-2 border-white/10 rounded-lg bg-neutral-800 px-6 pt-3 pb-20 text-lg text-white">
                                                    <Markdown>
                                                        {bio === null || bio === "" ? "No Bio Set..." : bio}
                                                    </Markdown>
                                                </div>
                                            )}
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* RIGHT SIDE CONTENT */}
                        <div className="h-full w-1/3 ml-4">
                            <div className="bg-neutral-800 rounded-xl h-full grid grid-cols-1">
                                <div className="my-6">
                                    <h1 className="flex items-center justify-center text-white font-bold">
                                        Challenge Completion
                                    </h1>
                                    <div className="my-8 flex items-center justify-center">
                                        {completedChallenges &&
                                            <PieChart data={[
                                                completedChallenges.completedBeginnerChallenges.length,
                                                completedChallenges.completedEasyChallenges.length,
                                                completedChallenges.completedMediumChallenges.length,
                                                completedChallenges.completedHardChallenges.length,
                                                completedChallenges.completedInsaneChallenges.length]}
                                            />
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                    {/* BADGE */}
                    <div>
                        <div className=" rounded-md mt-4 ">
                            {/* Badge Content */}
                            <div className="rounded-md">
                                <h1 className="ml-2 mb-3 text-3xl font-semibold text-gray-300">Badges</h1>
                                <div className="bg-neutral-800 rounded-xl grid grid-cols-5 gap-x-2 gap-y-2 py-4 px-4">
                                    {badges && badges.length > 0 ? (
                                        badges.map((badge) => (
                                            <Badge
                                                createdAt={badge.createdAt}
                                                badgeName={badge.badge.badgeName}
                                                badgeTier={badge.badge.badgeTier}
                                                badgeInfo={badge.badge.badgeInfo}
                                            />
                                        ))
                                    ) : (
                                        <div
                                            className="border col-span-5 border-neutral-700 border-2 bg-neutral-800 align-center mx-auto w-full rounded-lg px-4 py-4 text-center duration-4000 min-h-[190px] min-w-[200px] transition ease-in-out hover:bg-neutral-700/40"
                                            data-tooltip-content="Complete challenges to earn badges!"
                                            data-tooltip-id="badge-tooltip"
                                            data-tooltip-place="top"
                                        >
                                            {ownUser && <Tooltip id="badge-tooltip" />}
                                            <img src={'/CuteKana.png'} width="100" className="mx-auto mt-2 px-1" />
                                            <h1 className="mx-auto mt-2 text-center text-xl text-white">No Badges Yet...</h1>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Created Challenges */}
                    <div>
                        {/* CHALLENGE */}
                        <div className="rounded-md">
                            <div className="rounded-md">
                                <h1 className="ml-2 mt-4 py-2 text-3xl font-semibold text-gray-300">Created Challenges</h1>
                                <div className="bg-neutral-800 rounded-xl mt-2 gap-x-4 gap-y-2 p-4 flex flex-col grid grid-cols-3">
                                    {(createdChallenges && createdChallenges.map((challenge) => (
                                        <ChallengeCard
                                            id={challenge.id}
                                            title={challenge.title}
                                            category={challenge.category}
                                            difficulty={challenge.difficulty}
                                            createdAt={challenge.createdAt}
                                            creator={challenge.creator}
                                            views={challenge.views}
                                            likes={challenge.upvotes}
                                        />
                                    ))) || (
                                            <div
                                                className="border col-span-5 border-neutral-700 border-2 bg-neutral-800 align-center mx-auto w-full rounded-lg px-4 py-4 text-center duration-4000 min-h-[190px] min-w-[200px] transition ease-in-out hover:bg-neutral-700/40"
                                                data-tooltip-content="Create some challenges and they'll appear here!"
                                                data-tooltip-id="cChal-tooltip"
                                                data-tooltip-place="top"
                                            >
                                                {ownUser &&
                                                    <Tooltip id="cChal-tooltip" />
                                                }
                                                <img
                                                    src={'/CuteKana.png'}
                                                    width="100"
                                                    className="mx-auto mt-2 px-1"
                                                />

                                                <h1 className="mx-auto mt-2 text-center text-xl text-white">
                                                    No Challenges Created Yet...
                                                </h1>

                                            </div>
                                        )}
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Pinned Challenges */}
                    < div >
                        {/* CHALLENGE */}
                        <div className="rounded-md">
                            <div className="rounded-md">
                                <h1 className="ml-2 mt-4 py-2 text-3xl font-semibold text-gray-300">Liked Challenges</h1>
                                <div className="bg-neutral-800 rounded-xl mt-2 gap-x-4 gap-y-2 p-4 flex flex-col grid grid-cols-3">
                                    {pinnedChallenges && Array.isArray(pinnedChallenges) && pinnedChallenges.map((challenge) => (
                                        <ChallengeCard
                                            id={challenge.challengeId}
                                            title={challenge.challenge.title}
                                            category={challenge.challenge.category}
                                            difficulty={challenge.challenge.difficulty}
                                            createdAt={challenge.challenge.createdAt}
                                            creator={challenge.challenge.creator}
                                            views={challenge.challenge.views}
                                            likes={challenge.challenge.upvotes}
                                        />
                                    ))
                                        || (
                                            <div
                                                className="border col-span-5 border-neutral-700 border-2 bg-neutral-800 align-center mx-auto w-full rounded-lg px-4 py-4 text-center duration-4000 min-h-[190px] min-w-[200px] transition ease-in-out hover:bg-neutral-700/40"
                                                data-tooltip-content="Like some challenges and they'll appear here!"
                                                data-tooltip-id="lChal-tooltip"
                                                data-tooltip-place="top"
                                            >
                                                {ownUser &&
                                                    <Tooltip id="cChal-tooltip" />
                                                }
                                                <img
                                                    src={'/CuteKana.png'}
                                                    width="100"
                                                    className="mx-auto mt-2 px-1"
                                                />

                                                <h1 className="mx-auto mt-2 text-center text-xl text-white">
                                                    No Challenges Liked Yet...
                                                </h1>

                                            </div>
                                        )}
                                </div>
                            </div>
                        </div>
                    </div >

                    <div>
                        {/* Join Date */}
                        <div className="rounded-md mt-12 ">
                            {/* Badge Content */}
                            <div className="flex justify-center rounded-md">
                                {createDate && (
                                    <h1 className="ml-2 text-2xl text-gray-300">CTFGuide Member since {createDate.slice(0, 10)}</h1>
                                )}
                            </div>
                        </div>
                    </div>
                </div >

            </main >
            <Footer />
            {
                bioBanner && (
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

