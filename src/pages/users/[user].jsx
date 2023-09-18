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
import { data } from 'autoprefixer';
import { faF } from '@fortawesome/free-solid-svg-icons';

export const data2 = [
  ["Task", "Hours per Day"],
  ["Work", 11],
  ["Eat", 2],
  ["Commute", 2],
  ["Watch TV", 2],
  ["Sleep", 7],
];

// chart options no legend jsut graph




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

    

    const [friendedUser, setFriendedUser] = useState(null);
    const [pendingRequest, setPendingRequest] = useState(null);
    const [friendList, setFriendList] = useState(null);

    const [followedUser, setFollowedUser] = useState(null);
    const [followerList, setFollowerList] = useState(null);

    const [completedChallenges, setCompletedChallenges] = useState(null);

    const [createDate, setCreateDate] = useState(null);
    const [rank, setRank] = useState(null);

    const [openBio, setOpenBio] = useState(false);
    const [banner, bannerState] = useState(false);
    const [badges, setbadges] = useState([]);

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
    })

    

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

                setRealName(result.firstName + ' ' + result.lastName);

            } catch (err) {
                invalidUser = true;
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
            <div>
      <div>
        <div
          style={{ backgroundSize: "cover", backgroundImage: 'url("https://images.unsplash.com/photo-1500964757637-c85e8a162699?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2703&q=80")' }}
          className="h-48 0 w-full object-cover lg:h-30"
          alt=""
        >
        </div>
      </div>
      <div className="mx-auto max-w-7xl ">
        <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
          <div className="flex">
            <a href="./settings">
              {(username && (
                <img
                  style={{ borderColor: '#ffbf00' }}
                  className="h-24 w-24 rounded-full hover:bg-[#212121] sm:h-32 sm:w-32"
                  src={
                    `https://robohash.org/` +
                    username +
                    `.png?set=set1&size=150x150`
                  }
                  alt=""
                />
              )) || (
                  <Skeleton
                    circle={true}
                    height={150}
                    width={150}
                    baseColor="#262626"
                    highlightColor="#262626"
                  />
                )}
            </a>
          </div>
          <div className="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
            <div className="mt-6 min-w-0 flex-1 sm:hidden md:block">
              <h1 className="mt-8 truncate text-2xl font-bold text-white">
                {username || (
                  <Skeleton baseColor="#262626" highlightColor="#262626" />
                )}
              </h1>
              <p className="text-white">
                <i class="fas fa-map-marker-alt mt-2"></i>{' '}
                United States

              <span className='text-orange-400'>
              <i class="fas fa-shield-alt mt-2 ml-4"></i>{' '}
            Admin</span>
              </p>
            </div>
            <div className="justify-stretch mt-12 flex sm:px-4 px-4 md:px-0 lg:px-0 ">
              <div className="mr-4 hidden">
           
              </div>

           
              <div className="grid grid-cols-3  mt-4  bg-neutral-900/50 px-6 ">
                                                    <div className="text-lg text-white bg-neutral-800 rounded-lg pl-2 gap-x-3 mr-2  py-0 flex">
                                                        Leaderboard Rank: <div className="ml-auto rounded-r-lg px-4 bg-purple-600 h-100 text-white">{rank}</div>
                                                    </div>

                                                    <div className="text-lg text-white bg-neutral-800 rounded-lg pl-2 gap-x-3 mr-2  py-0 flex">
                                                    Join Date: <div className="ml-auto rounded-r-lg px-4 bg-blue-600 h-100 text-white">{createDate}</div>
                                                    </div>
                                                
                                                    <div className="text-lg text-white bg-neutral-800 rounded-lg pl-2 gap-x-3 mr-2  py-0 flex">
                                                    Demo Statistics: <div className="ml-auto rounded-r-lg px-4 bg-green-600 h-100 text-white">23.4%</div>
                                                    </div>
                                                
                                                </div>
              <div
                className="ml-4 mt-8 mb-0 rounded-lg px-10 py-1 hidden"
                style={{ backgroundColor: '#212121', borderWidth: '0px' }}
              >
                <h1 className="mx-auto  mt-0 text-center text-xl font-semibold text-white">
                  #{rank}
                </h1>
                <p className="mt-0 text-white">Rank</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 hidden min-w-0 flex-1 sm:block md:hidden">
          <h1 className="truncate text-2xl font-bold text-gray-900">
            {username || (
              <Skeleton baseColor="#262626" highlightColor="#262626" />
            )}
          </h1>
        </div>
      </div>
    </div>


                <div className="">
                    <div className="max-w-7xl mx-auto   ">
                        {/* Main content area */}
                        <div className="flex-1 justify-center items-center">
                            {/* BANNER */}
                     
                            {/* Add profile content here */}
                            <div className='bg-neutral-900 py-4'>
                                <div className="">
                                    <div className="relative isolate rounded-md overflow-hidden bg-black/10 bg-neutral-900 py-4 mx-5 ">
                                        <div className="hidden absolute -bottom-8 -left-96 -z-10 transform-gpu blur-3xl sm:-bottom-64 sm:-left-40 lg:-bottom-32 lg:left-8 xl:-left-10">
                                            <div
                                                className="aspect-[1266/975] w-[79.125rem] bg-gradient-to-tr from-[#081e75] to-[#0737f2] opacity-30"
                                                style={{
                                                    clipPath:
                                                        'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                                                }}
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 mx-5">
                                            <div className="mx-4">
                                                <div className="flex items-center">
                                                    <h1 className="mt-4 text-2xl font-semibold text-gray-300">Biography</h1>
                                           
                                                    <div className="ml-auto">
                                                        {((!openBio && ownUser) &&
                                                            <button
                                                                className="px-2 text-lg mt-5 font-medium text-white bg-neutral-800 hover:text-neutral-500"
                                                                onClick={openTheBio}
                                                                hidden={openBio}>
                                                                Edit
                                                            </button>
                                                        ) || ((ownUser && openBio) &&
                                                            <button
                                                                className="px-2 text-lg mt-5 font-medium text-white bg-red-600 hover:text-neutral-500"
                                                                onClick={closeBannerAndBio}
                                                                hidden={!openBio}>
                                                                Cancel
                                                            </button>
                                                            )}
                                                    </div>
                                                </div>
                                                <div>
                                                    {((openBio && ownUser) &&
                                                        <div>
                                                            <textarea
                                                                id="bio"
                                                                style={{ backgroundColor: '#212121', resize: "none" }}
                                                                readOnly={false}
                                                                onChange={openBanner}
                                                                placeholder="Tell us about yourself!"
                                                                className="mt-3 w-full rounded-sm border-white/10 bg-neutral-900/50 px-6 py-3 text-lg text-white"
                                                            ></textarea>
                                                        </div>
                                                    ) || (
                                                            <h1 className="mt-3 rounded-lg  bg-neutral-800 px-6 py-3 text-lg text-white">
                                                                {bio === null || bio === "" ? "No bio set." : bio}
                                                            </h1>
                                                        )}
                                                </div>
                                            </div>
                                            <div className="mx-4 mt-4">
                                                {/* Badge Content */}
                                                <h1 className="mt-4 text-2xl font-semibold text-gray-300">Badges</h1>
                                                <div className="mt-3 rounded-sm bg-neutral-900/50 text-lg text-white">
                                                    <div className="mt-4 grid grid-cols-4 gap-x-2 gap-y-4  pb-10 "
>

                                                    <div
                                                            
                                                            className=" bg-neutral-800 align-center mx-auto w-full rounded-lg px-4 py-4  text-center duration-4000 min-h-[190px] min-w-[200px] transition ease-in-out hover:bg-neutral-800/40"
                                                            >
                                                            <img
                                                                src={`../badges/level1/beta.png`}
                                                                width="100"
                                                                className="mx-auto mt-2 px-1"
                                                            />

                                                            <h1 class="mx-auto mt-2  text-center text-xl text-white">
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
                                                            
                                                            className=" bg-neutral-800 align-center mx-auto w-full rounded-lg px-4 py-4  text-center duration-4000 min-h-[190px] min-w-[200px] transition ease-in-out hover:bg-neutral-800/40"
                                                            >
                                                            <img
                                                                src={`../badges/group2.png`}
                                                                width="100"
                                                                className="mx-auto mt-2 px-1 "
                                                            />

                                                            <h1 class="mx-auto mt-2  text-center text-xl text-white">
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
                                                            
                                                            className=" bg-neutral-800 align-center mx-auto w-full rounded-lg px-4 py-4  text-center duration-4000 min-h-[190px] min-w-[200px] transition ease-in-out hover:bg-neutral-800/40"
                                                            >
                                                            <img
                                                                src={`../badges/group3.png`}
                                                                width="100"
                                                                className="mx-auto mt-2 px-1"
                                                            />

                                                            <h1 class="mx-auto mt-2  text-center text-xl text-white">
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
                                                            
                                                            className=" bg-neutral-800 align-center mx-auto w-full rounded-lg px-4 py-4  text-center duration-4000 min-h-[190px] min-w-[200px] transition ease-in-out hover:bg-neutral-800/40"
                                                            >
                                                            <img
                                                                src={`../badges/level1/creator.png`}
                                                                width="100"
                                                                className="mx-auto mt-2 px-1"
                                                            />

                                                            <h1 class="mx-auto mt-2  text-center text-xl text-white">
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
                                                            
                                                            className=" bg-neutral-800 align-center mx-auto w-full rounded-lg px-4 py-4  text-center duration-4000 min-h-[190px] min-w-[200px] transition ease-in-out hover:bg-neutral-800/40"
                                                            >
                                                            <img
                                                                src={`../badges/level1/contributor.png`}
                                                                width="100"
                                                                className="mx-auto mt-2 px-1"
                                                            />

                                                            <h1 class="mx-auto mt-2  text-center text-xl text-white">
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


                                                            

                                                        {/* {badges.map((data) => (
                                                            <div
                                                            
                                                            className=" bg-neutral-800 align-center mx-auto w-full rounded-lg px-4 py-4  text-center"
                                                            >
                                                            <img
                                                                src={`../badges/level1/${data.badge.badgeName.toLowerCase()}.png`}
                                                                width="100"
                                                                className="mx-auto mt-2 px-1"
                                                            />

                                                            <h1 class="mx-auto mt-2  text-center text-xl text-white">
                                                                {data.badge.badgeName}
                                                            </h1>
                                                            <h1 class="text-lg text-white ">
                                                                {new Date(data.createdAt).toLocaleDateString('en-US', {
                                                                month: '2-digit',
                                                                day: '2-digit',
                                                                year: 'numeric',
                                                                })}
                                                            </h1>
                                                            </div>
                                                        ))} */}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mx-4">

                                                                                            <h1 className=" py-2 text-2xl font-semibold text-gray-300">Pinned Challenges</h1>
                                                                                            <div className="mt-2 flex flex-col">

                <div>
                  <a
                    className="align-center mb-4 flex rounded-lg  border-none border-blue-700 bg-[#212121] px-5 py-3 text-white hover:border-blue-800 hover:bg-[#262626]"
                  >
                    <h2 className="align-middcenterle text-xl font-semibold">
                   Test Challenge
                    </h2>

                    <div className="align-center ml-auto flex">
                      <div className="rounded-md bg-blue-700 px-3 py-1">
                        <p> hard</p>
                      </div>
                    </div>
                  </a>
                </div>
        
                <div>
                  <a
                    className="align-center mb-4 flex rounded-lg  border-none border-blue-700 bg-[#212121] px-5 py-3 text-white hover:border-blue-800 hover:bg-[#262626]"
                  >
                    <h2 className="align-middcenterle text-xl font-semibold">
                   Test Challenge
                    </h2>

                    <div className="align-center ml-auto flex">
                      <div className="rounded-md bg-blue-700 px-3 py-1">
                        <p> hard</p>
                      </div>
                    </div>
                  </a>
                </div>

                <div>
                  <a
                    className="align-center mb-4 flex rounded-lg  border-none border-blue-700 bg-[#212121] px-5 py-3 text-white hover:border-blue-800 hover:bg-[#262626]"
                  >
                    <h2 className="align-middcenterle text-xl font-semibold">
                   Test Challenge
                    </h2>

                    <div className="align-center ml-auto flex">
                      <div className="rounded-md bg-blue-700 px-3 py-1">
                        <p> hard</p>
                      </div>
                    </div>
                  </a>
                </div>

                <div>
                  <a
                    className="align-center mb-4 flex rounded-lg  border-none border-blue-700 bg-[#212121] px-5 py-3 text-white hover:border-blue-800 hover:bg-[#262626]"
                  >
                    <h2 className="align-middcenterle text-xl font-semibold">
                   Test Challenge
                    </h2>

                    <div className="align-center ml-auto flex">
                      <div className="rounded-md bg-blue-700 px-3 py-1">
                        <p> hard</p>
                      </div>
                    </div>
                  </a>
                </div>
            </div>
</div>
                                        </div>
                                    </div>
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