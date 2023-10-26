import firebase from 'firebase/app';
// import { storage } from '../../config/firebaseConfig.js';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '../../config/firebaseConfig.js';


import 'firebase/storage';


import Head from 'next/head';


import React from 'react';
import { Footer } from '@/components/Footer';
import { StandardNav } from '@/components/StandardNav';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { useEffect } from 'react';
import { useState } from 'react';
import { SideNavContent } from '@/components/dashboard/SideNavContents';
import { RightSideFiller } from '@/components/dashboard/RightSideFiller';
import Skeleton from 'react-loading-skeleton';
import { Router } from 'react-router-dom';
import { useRouter } from 'next/router';
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
                    //setOwnUser(true);
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


                setPfp(result)




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

                {/* BANNER */}
                <div className="">
                    <div className="">
                        <div
                            style={{ backgroundSize: "cover", backgroundImage: 'url("https://images.unsplash.com/photo-1500964757637-c85e8a162699?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3903&q=80")' }}
                            className="h-40 w-full object-cover lg:h-30"
                            alt=""
                        >
                        </div>
                    </div>
                </div>

                {/* ACTUAL CONTENT AREA */}
                <div className="container  mx-auto -mt-10 h-full justify-center w-3/4">
                    <div className="flex justify-center flex-rows w-full ">

                        {/* LEFT SIDE CONTENT */}
                        <div className="w-1/5 h-full">
                            <div className="bg-neutral-800 h-full mr-4 rounded-lg grid grid-cols-1">

                                {/* PFP AND USER DATA */}
                                <div className="p-4 rounded-lg">
                                    <img
                                        src={pfp}
                                        alt="Profile"
                                        className="w-36 h-36 rounded-full mb-4 mx-auto"
                                    />
                                    <h1 className="text-2xl text-white font-bold text-center">{username}</h1>
                                </div>
                                <div className="mx-3 rounded-lg border border-neutral-600 mb-5">
                                    {bio?
                                    <h1 className="flex justify-center text-white p-3">
                                        {bio}
                                    </h1>
                                    :
                                    <h1 className="flex justify-center text-white p-3">
                                        Hey guys! Sample bio here.
                                    </h1>
                                    }
                                </div>

                                <div>
                                    <div className="border border-neutral-600 text-2xl text-white bg-neutral-800 rounded-lg pl-5 gap-x-3 mx-3 py-0  flex">
                                        Rank: <div className="ml-auto rounded-r-md font-bold px-4 bg-blue-600 h-100 text-white">#3</div>
                                    </div>
                                </div>

                                <div className="mx-3 rounded-lg border border-neutral-600 grid grid-cols-2 my-5">
                                    <div className="flex justify-center grid grid-rows-2">
                                        <h1 className="text-lg text-white">
                                            Followers
                                        </h1>
                                        <h1 className="flex justify-center text-lg font-bold text-white">
                                            56
                                        </h1>
                                    </div>
                                    <div className="flex justify-center grid grid-rows-2">
                                        <h1 className="text-lg text-white">
                                            Following
                                        </h1>
                                        <h1 className="flex justify-center text-lg font-bold text-white">
                                            36
                                        </h1>
                                    </div>
                                </div>

                                <div className="flex justify-center grid grid-cols-1">
                                    <p>{bio}</p>
                                </div>

                                <div className="mb-6">
                                    <h1 className="flex justify-center text-white">
                                        Joined: {createDate}
                                    </h1>
                                </div>


                            </div>
                        </div>


                        <div className="flex justify-center grid grid-cols-1 ">
                            
                        <div className=" h-full">
                                
                            </div>
                            <div className="grid grid-cols-2">
                                <div className=" h-full mr-4">
                                    {/* BADGES */}
                                    <div className="flex justify-center bg-neutral-800 shadow p-4 h-48 rounded-lg mb-4">
                                        <div className="grid cols-1">
                                            <h1 className="text-3xl text-white font-bold text-center">Badges</h1>

                                            <div className="grid grid-cols-2 gap-4">
                                                {/* BADGE 1 */}
                                                <div
                                                    className="mx-auto w-full my-auto rounded-lg px-4 py-4 text-center"
                                                >
                                                    <img
                                                        src={`../badges/level1/beta.png`}
                                                        width="50"
                                                        className="mx-auto px-1"
                                                    />
                                                    <h1 class="mx-auto mt-2 text-center text-sm text-white">
                                                        Beta User
                                                    </h1>
                                                    <h1 class="text-xs text-white ">
                                                        {new Date("09/12/2022").toLocaleDateString('en-US', {
                                                            month: '2-digit',
                                                            day: '2-digit',
                                                            year: 'numeric',
                                                        })}
                                                    </h1>
                                                </div>
                                                
                                                {/* BADGE 2 */}
                                                <div
                                                    className=" mx-auto w-full my-auto rounded-lg px-4 py-4 text-center"
                                                >
                                                    <img
                                                        src={`../badges/group2.png`}
                                                        width="50"
                                                        className="mx-auto px-1"
                                                    />
                                                    <h1 class="mx-auto mt-2 text-center text-sm text-white">
                                                        Beta User
                                                    </h1>
                                                    <h1 class="text-xs text-white ">
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



                                <div className=" h-full">
                                    {/* CHALLENGES */}
                                    <div className="bg-neutral-800 shadow p-6 h-48 rounded-lg mb-4">

                                        <h1 className="text-2xl text-white font-bold text-center">The challenges will be here</h1>
                                        <p className="text-gray-600 text-center">{ }</p>
                                    </div>
                                </div>
                            </div>

                            <div className=" h-full">
                                {/* CHALLENGES */}
                                <div className="bg-neutral-800 shadow p-6 h-36 rounded-lg mb-4">

                                    <h1 className="text-2xl text-white font-bold text-center">Additonal Content here</h1>
                                    <p className="text-gray-600 text-center">{ }</p>
                                </div>
                            </div>

                            <div className=" h-full">
                                {/* CHALLENGES */}
                                <div className="bg-neutral-800 shadow p-6 h-36 rounded-lg mb-8">

                                    <h1 className="text-2xl text-white font-bold text-center">Additonal Content here</h1>
                                    <p className="text-gray-600 text-center">{ }</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>






            </main>
            <Footer />
            {banner && (
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
            )}
        </>
    );
};

