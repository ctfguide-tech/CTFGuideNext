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
                const response = await fetch('https://api.ctfguide.com/challenges/type/all');
                const data = await response.json();
                setChallenges([...data]);
            } catch (err) {
                throw err;
            }
        };
        fetchData();        
    }, []);

    // function loadChallenges() {
    //     fetch('https://api.ctfguide.com/challenges/type/all')
    //         .then(response => response.json())
    //         .then(data => {
    //             for ( var i = 0; i < data.length; i++ ) {
    //             var difficultyColor = "border-green-500";
                
    //             if (data[i].difficulty == "easy") {
    //                 difficultyColor = "border-green-500";
    //             } else if (data[i].difficulty == "medium") {
    //                 difficultyColor = "border-yellow-500";
    //             } else if (data[i].difficulty == "hard") {
    //                 difficultyColor = "border-red-500";
    //             }

    //             document.getElementById("starter").insertAdjacentHTML('afterend', `<div className='card rounded-lg px-4 py-2 w-full border-l-4 ${difficultyColor}' style='background-color: #212121'>
    //             <h1 className='text-white text-2xl'>${data[i].title}</h1>
    //             <p className='text-white truncate'>${data[i].problem.substring(0, 40)}</p>
    //             <div className='flex mt-2'>

    //                 <p className='text-white px-2  rounded-lg bg-blue-900 text-sm'>${data[i].category}</p>
    //             </div>
    //         </div>`)
    //             }
    //         })
    //         .catch(error => {
    //             console.log(error)
    //     });
    // }
    // loadChallenges();

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
                <div className="flex">
                    <div className="flex h-screen max-w-7xl mx-auto ">
                        <PracticeNav />
                    </div>
                    <div className='w-3/4'>
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
