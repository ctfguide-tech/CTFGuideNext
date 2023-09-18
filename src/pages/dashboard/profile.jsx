import Head from 'next/head';

import { Footer } from '@/components/Footer';
import { StandardNav } from '@/components/StandardNav';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { useEffect } from 'react';
import { useState } from 'react';
import { SideNavContent } from '@/components/dashboard/SideNavContents';
import { RightSideFiller } from '@/components/dashboard/RightSideFiller';

import { Router } from 'react-router-dom';
import { useRouter } from 'next/router';

export default function Dashboard() {
    const [username, setUsername] = useState(null);
    const [realName, setRealName] = useState(null);
    const [bio, setBio] = useState(null);
    const [followerCount, setFollowerCount] = useState(null);
    const [followingCount, setFollowingCount] = useState(null);
    const [leaderboardRank, setLeaderboardRank] = useState(null);
    const [openBio, setOpenBio] = useState(false);
    const [banner, bannerState] = useState(false);


    // Get and store user data
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
                    if (data.error) {
                        router.push('/login');
                    }
                    setUsername(data.username);
                    setRealName(data.firstName + ' ' + data.lastName);
                    if (data.bio === null) {
                        setBio('No bio set.');
                    } else {
                        setBio(data.bio);
                    }
                    setFollowerCount(data.followersNum);
                    setFollowingCount(data.followingNum);
                    setLeaderboardRank(data.leaderboardNum);
                })
                .catch((err) => {
                    console.log(err);
                })
        } catch {
        }
    }, []);

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
                    <div className="flex-1 mt-5 justify-center items-center w-full">
              
                        {/* Add profile content here */}
                        <div>
                            <div className="flex items-center">
                                <h1 className="mt-5 text-xl text-gray-300">Your Bio</h1>
                                <div className="ml-auto">
                                    {(!openBio &&
                                        <button 
                                            className="px-2 text-lg mt-5 font-medium text-white bg-neutral-800 hover:text-neutral-500"
                                            onClick={openTheBio}
                                            hidden={openBio}>
                                            Edit
                                        </button>
                                    ) || ( 
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
                                {(openBio &&
                                    <div>
                                        <textarea
                                            id="bio"
                                            style={{ backgroundColor: '#212121', resize: "none"}}
                                            readOnly={false}
                                            onChange={openBanner}
                                            placeholder="Tell us about yourself!"                              
                                            className="mt-3 w-full rounded-sm border-none rounded-lg rounded-lg bg-neutral-800/50 px-6 py-3 text-lg text-white"
                                        ></textarea>
                                    </div>

                                ) || (
                                    <h1 className="mt-3 rounded-sm border border-none rounded-lg rounded-lg bg-neutral-800/50 px-6 py-3 text-lg text-white">
                                        {bio === null || bio === "" ? "No bio set." : bio}
                                    </h1>
                                )}
                            </div>
                        </div>
                        <div>
                        {/* Badge Content */}
                            <h1 className="mt-5 text-xl text-gray-300">Badges</h1>
                            <h1 className="mt-3 rounded-sm border border-none rounded-lg bg-neutral-800/50 px-6 py-3 text-lg text-white">
                                Hmm, looks like you have no badges yet.
                            </h1>
                        </div>
                        <div className='hidden'>
                        {/* Pinned Challenges Content */}
                            <h1 className="mt-5 text-xl text-gray-300">Pinned Challenges</h1>
                            <h1 className="mt-3 rounded-sm border border-none rounded-lg bg-neutral-800/50 px-6 py-3 text-lg text-white">
                                Challenge content here.
                            </h1>
                        </div>
                        <div>
                        {/* Pinned Challenges Content */}
                            <h1 className="mt-5 text-xl text-gray-300">Statistics</h1>
                            <h1 className="mt-3 rounded-sm border border-none rounded-lg bg-neutral-800/50 px-6 py-3 text-lg text-white">
                                This feature is temporarily disabled.
                            </h1>
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