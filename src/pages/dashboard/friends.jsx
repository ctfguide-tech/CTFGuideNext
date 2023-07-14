import Head from 'next/head';

import { Footer } from '@/components/Footer';
import { StandardNav } from '@/components/StandardNav';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { useEffect } from 'react';
import { useState } from 'react';
import { SideNavContent } from '@/components/dashboard/SideNavContents';
import { RightSideFiller } from '@/components/dashboard/RightSideFiller';
import { FriendCard } from '@/components/dashboard/FriendCard';


import { Router } from 'react-router-dom';
import { useRouter } from 'next/router';

export default function Dashboard() {
    const router = useRouter();
    const { slug } = router.query;
    const [friends, setFriends] = useState(["Loading..."]);
    

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
        }}

        const fetchFriendData = async (friend, index) => {
            try {
                const friendEndPoint = process.env.NEXT_PUBLIC_API_URL + '/users/' + friend;
                const requestOptions = {
                    method: 'GET', headers: {
                        'Content-Type': 'application/json', 
                        Authorization: 'Bearer ' + localStorage.getItem('idToken'),
                }}
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
                    <h1 className="mt-5 text-3xl text-white">My Friends</h1>
                    <div className = "mb-12 mx-auto grid max-w-7xl grid-cols-1 gap-4 text-center md:grid-cols-3 lg:grid-cols-3">
                        {friends.map((friend) => {
                            return (
                                <FriendCard friend={friend.username}/>
                            );
                        })}
                    </div>





                </div>
            </div>
        </main>
    </>
    )}