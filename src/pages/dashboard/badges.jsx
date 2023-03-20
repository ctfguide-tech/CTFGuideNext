import Head from 'next/head'

import { Footer } from '@/components/Footer'
import { StandardNav } from '@/components/StandardNav'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { useEffect } from 'react'
import { useState } from 'react'
import { SideNavContent } from '@/components/dashboard/SideNavContents'

export default function Dashboard() {
    const [badges, setbadges] = useState([]);
    let username = "laphatize"
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${localStorage.getItem("userBadgesUrl")}`);
                const data = await response.json();
                console.log(data)
                setbadges(data);
            } catch {

            }
        };
        fetchData();
        setbadges([

        ])
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
                    @import url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
                </style>
            </Head>
            <StandardNav />
            <main>

                <DashboardHeader />

                <div className="flex h-screen max-w-7xl mx-auto ">
                    {/* Sidebar */}
                    <SideNavContent />

                    {/* Main content area */}
                    <div className="flex-1">

                        <h1 className='text-white text-4xl mt-5'>My Badges</h1>
                        {/* Fetch badges from API */}

                        {badges.length === 0 && (
                            <div className='mt-3'>
                            <h1 className='text-white text-lg bg-neutral-800 border border-neutral-700 px-6 py-3 rounded-lg'>
                                🤔 Hmm, looks like you haven't earned any badges yet.
                            </h1>
                            </div>
                        )}


                        <div className="grid grid-cols-5 mt-4 gap-x-4 gap-y-4">
                            {badges.map((data) => (
                                <div style={{ backgroundColor: "#212121" }} className='mx-auto px-4 py-4 rounded-lg w-full text-center  align-center'>
                                    <img src={`../badges/level1/${data.badge.badgeName.toLowerCase()}.png`} width="100" className='mx-auto px-1 mt-2' />

                                    <h1 class="text-white text-xl  mx-auto text-center mt-2">{data.badge.badgeName}</h1>
                                    <h1 class="text-white text-lg ">{new Date(data.createdAt).toLocaleDateString('en-US', {
                                        month: '2-digit',
                                        day: '2-digit',
                                        year: 'numeric',
                                    })}</h1>






                                </div>
                            ))}

                        </div>


                    </div>
                </div>


            </main>
            <Footer />
        </>
    )
}
