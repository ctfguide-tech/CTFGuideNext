import React, {useEffect, useState} from 'react';

import Head from 'next/head'
import Link from 'next/link'
import { Button } from '@/components/Button'
import { TextField } from '@/components/Fields'
import { Logo } from '@/components/Logo'
import { Alert } from '@/components/Alert'
import { Container } from '@/components/Container'
import { StandardNav } from '@/components/StandardNav'
import { Footer } from '@/components/Footer'
import { PracticeNav } from '@/components/practice/PracticeNav'
import { Community } from '@/components/practice/community'
import { GoToCreate } from '@/components/practice/GoToCreate'

export default function Pratice() {
    const [challenges, setChallenges] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // const response = await fetch('https://api.ctfguide.com/challenges/type/all');
                // const data = await response.json();
                // setChallenges([...data]);
                const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/challenges');
                const { result } = await response.json();
                
                setChallenges([...result]);
            } catch (err) {
                throw err;
            }
        };
        fetchData();        
    }, []);

    return (
        <>
            <Head>
                <title>Practice - CTFGuide</title>
                <meta
                    name="description"
                    content="Practice Problems"
                />
                <style>
                    @import url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
                </style>
            </Head>
            <StandardNav />
            <main>
                <div className=" w-full " style={{ backgroundColor: "#212121" }}>
                    <div className="flex mx-auto text-center h-28 my-auto">
                        <h1 className='text-4xl text-white mx-auto my-auto font-semibold'>Community</h1>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row">
                    <div className="w-full md:w-1/5 flex md:h-screen max-w-7xl md:mx-auto md:justify-center px-8 md:px-16">
                        <PracticeNav />
                    </div>
                    <div className='w-full md:w-4/5 px-8 xl:px-16 border-l border-gray-800'>
                        <div className='w-3/4'>
                            <GoToCreate />
                        </div>
                        <Community challenges={challenges} />
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
