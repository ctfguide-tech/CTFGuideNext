import Head from 'next/head';

import { Footer } from '@/components/Footer';
import { StandardNav } from '@/components/StandardNav';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { useEffect } from 'react';
import { useState } from 'react';
import { SideNavContent } from '@/components/dashboard/SideNavContents';
import { RightSideFiller } from '@/components/dashboard/RightSideFiller';
import { FriendCard } from '@/components/dashboard/FriendCard';
import { FriendRequestCard } from '@/components/dashboard/FriendRequestCard';
import { Transition, Fragment, Dialog } from '@headlessui/react';


export default function Dashboard() {
    const [friends, setFriends] = useState([]);
    const [requests, setRequests] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const endPoint = process.env.NEXT_PUBLIC_API_URL + '/friends/' + localStorage.getItem('username') + '/friendList';
                const requestOptions = {
                    method: 'GET', headers: {
                        'Content-Type': 'application/json', Authorization: 'Bearer ' + localStorage.getItem('idToken'),
                    }
                }
                const response = await fetch(endPoint, requestOptions);
                const result = await response.json();

                console.log(result)

                result.friends.forEach((friend, index) => {
                    fetchFriendData(friend, index)
                });

            } catch (err) {
                throw err;
            }
        }

        const fetchFriendData = async (friend, index) => {
            try {
                const friendEndPoint = process.env.NEXT_PUBLIC_API_URL + '/users/' + friend;
                const requestOptions = {
                    method: 'GET', headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + localStorage.getItem('idToken'),
                    }
                }
                const response = await fetch(friendEndPoint, requestOptions);
                const friendData = await response.json();

                updateFriends(friendData, index)
            } catch (err) {
                throw err;
            }
        }

        const updateFriends = (friendData, index) => {
            setFriends(prevFriends => {
                const newFriends = [...prevFriends];
                newFriends[index] = friendData;
                return newFriends;
            })
        }

        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const endPoint = process.env.NEXT_PUBLIC_API_URL + '/friends/pendingRequests';
                const requestOptions = {
                    method: 'GET', headers: {
                        'Content-Type': 'application/json', Authorization: 'Bearer ' + localStorage.getItem('idToken'),
                    }
                }
                const response = await fetch(endPoint, requestOptions);
                const result = await response.json();

                console.log(result)

                result.forEach((request, index) => {
                    updateRequests(request, index)
                });

            } catch (err) {
                throw err;
            }
        }

        const updateRequests = (requestData, index) => {
            setRequests(prevRequests => {
                const newRequests = [...prevRequests];
                newRequests[index] = requestData;
                return newRequests;
            })
        }

        fetchData();
    }, [])

    const handleAccept = async (id) => {
        try {
            const friendEndPoint = process.env.NEXT_PUBLIC_API_URL + '/friends/accept/' + id;
            const requestOptions = {
                method: 'PUT', headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + localStorage.getItem('idToken'),
                }
            }
            const response = await fetch(friendEndPoint, requestOptions);
            const result = await response.json();
            
            console.log(result);

            const acceptedRequest = requests.find(request => request.id === id);

            const newFriend = {
                username: acceptedRequest.requester.username,
                followersNum: 2, // Hardcoded for now
                followingNum: 2 // Hardcoded for now
            }

            setRequests(prevRequests =>  prevRequests.filter(request => request.id !== id)); 
            setFriends(prevFriends => [...prevFriends, newFriend])

        } catch (err) {
            throw err;
        }
    }

    const handleDecline = async (id) => {
        try {
            const friendEndPoint = process.env.NEXT_PUBLIC_API_URL + '/friends/reject/' + id;
            const requestOptions = {
                method: 'DELETE', headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + localStorage.getItem('idToken'),
                }
            }
            const response = await fetch(friendEndPoint, requestOptions);
            const result = await response.json();

            console.log(result);
            setRequests(prevRequests =>  prevRequests.filter(request => request.id !== id)); 


        } catch (err) {
            throw err;
        }
    }

    const handlePopupOpen = () => {
        setIsPopupOpen(true);
    }

    const handlePopupClose = () => {
        setIsPopupOpen(false);
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
                <DashboardHeader />
                <div className="mx-auto flex h-screen max-w-7xl ">
                    {/* Sidebar */}
                    <SideNavContent />

                    {/* Main content area */}
                    <div className="flex-1 mt-5 justify-center items-center">
                        <div className="flex items-center">
                            <h1 className="mt-5 text-3xl text-white">My Friends</h1>
                            <button
                                className="popup-button text-white mt-5 mx-4 px-3 py-2 bg-neutral-800 hover:text-neutral-500"
                                onClick={handlePopupOpen}
                            >View Friend Requests</button>


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
                                    <div className="flex items-end justify-center min-h-screen  pt-4 px-4  text-center sm:block sm:p-0">
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
                                                        <h1 className="text-white text-4xl text-center"> Friend Requests</h1>
                                                        <div className="flex items-center flex-col h-full">
                                                                <div className='grid grid-cols-1 w-full'>
                                                                {(requests != null) && requests.map((request) => {
                                                                    return (
                                                                        <FriendRequestCard
                                                                            username={request.requester.username}
                                                                            followers="2"
                                                                            following="2"
                                                                            onAccept={() => handleAccept(request.id)}
                                                                            onDecline={() => handleDecline(request.id)}
                                                                        />
                                                                    )})}
                                                                </div>
                                                            <button className="text-white mt-5 mx-4 px-2 py-2 bg-neutral-800 hover:text-neutral-500 hover: bg-neutral-700"
                                                                onClick={handlePopupClose}>Close
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Transition.Child>
                                    </div>
                                </Dialog>
                            </Transition.Root>
                        </div>
                        <div className="mb-12 mx-auto grid max-w-7xl grid-cols-1 gap-4 text-center md:grid-cols-3 lg:grid-cols-3">
                            {(friends != null) && friends.map((friend) => {
                                return ( friend != null &&
                                    <FriendCard
                                        username={friend.username}
                                        followers={friend.followersNum}
                                        following={friend.followingNum}
                                    />
                                );
                            })}
                        </div>
                        {!friends &&
                            <h1 className="mt-5 text-3xl text-white">No Friends Added... 😕</h1>
                        }
                    </div>
                </div>
            </main>
        </>
    )
}