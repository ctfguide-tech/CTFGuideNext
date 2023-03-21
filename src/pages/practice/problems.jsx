import Head from 'next/head'
import React, { useState, useEffect } from "react";
import { StandardNav } from '@/components/StandardNav'
import { Footer } from '@/components/Footer'
import { PracticeNav } from '@/components/practice/PracticeNav'
import { ProblemSetCards } from '@/components/practice/GoToCreate'
import ProblemSet from '@/components/practice/ProblemSet'
import { ChallengeCard } from '@/components/create/ChallengeCard';
import { Community } from '@/components/practice/community'

import Challenge from "@/components/challenge/ChallengeComponent";

export default function ProblemsPage() {
    const [components, setComponents] = useState([]);
    const set = [
        {
            name: "Cryptography", 
            description: "Cryptography deals with algorithms to secure info. Encryption/decryption are the foundation of cybersecurity."
        },
        {
            name: "Forensics", 
            description: "Sometimes, secrets are hidden in plain site. Can you crack these challenges?"
        },
        {
            name: "Web", 
            description: "Cryptography deals with algorithms to secure info. Encryption/decryption are the foundation of cybersecurity."
        }
    ];

    const [cryptoChallenges, setCryptoChallenges] = useState([]);


    useEffect(() => {
        try {
            fetch(process.env.NEXT_PUBLIC_API_URL + "/challenges")
                .then((response) => response.json())
                .then((data) => {
                    if (result) {
                    const {result} = data;
                    setComponents(result);
                    }
                })
                .catch((error) => {
                    console.error(error);
                });

           
      
        } catch {

        }

  


    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // const response = await fetch('https://api.ctfguide.com/challenges/type/all');
                // const data = await response.json();
                // setChallenges([...data]);
                const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/challenges?category=cryptography');
                const { result } = await response.json();
                
                setCryptoChallenges([...result]);
            } catch (err) {
                console.log (err);
            }
        };
        fetchData();        
    }, []);

    const filterData = (category) => {
        return components.filter(component => {
            return component.category.some(categoryName => {
                return categoryName.toLowerCase() === category.toLowerCase();
            })
        });
    }

    const badgeColor = {
        'easy': 'bg-[#28a745] text-[#212529] ',
        'medium': 'bg-[#f0ad4e] text-[#212529] ',
        'hard': 'bg-[#dc3545] ',
    }

    const borderColor = {
        'easy': 'border-[#28a745] text-[#212529] ',
        'medium': 'border-[#f0ad4e] text-[#212529] ',
        'hard': 'border-[#dc3545] ',
    }


    return (
        <>
            <Head>
                <title>Problem Sets - CTFGuide</title>
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
                        <h1 className='text-4xl text-white mx-auto my-auto font-semibold'>Problem Sets</h1>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row">
                    <div className="w-full md:w-1/5 flex md:h-screen max-w-7xl md:mx-auto md:justify-center px-8 md:px-16">
                        <PracticeNav />
                    </div>
                    <div className='w-full md:w-4/5 px-8 xl:px-16 border-l border-gray-800'>
                        <div className='w-3/4'>
                            <ProblemSetCards />
                        </div>
                        {set.map((setInfo, index) => (
                            <div key={index} className="rounded-lg overflow-hidden shadow-lg mb-16 mr-4 border-2 border-[#212121]">
                                <h2 className="mt-8 text-center text-3xl font-bold tracking-tight text-white">{setInfo.name}</h2>
                                <p className="text-gray-300 text-center mt-2">{setInfo.description}</p>
                                <div className="container mx-auto">
                                    <ProblemSet data={filterData(setInfo.name)}/>
                                </div>
                            </div>
                        ))}

                        <div>
                        <h2 className="mt-8 text-center text-3xl font-bold tracking-tight text-white">Cryptography</h2>
                                <p className="text-gray-300 text-center mt-2">Cryptography deals with algorithms to secure info. Encryption/decryption are the foundation of cybersecurity.</p>
                             

                                <div className="w-full overflow-x-scroll pb-4">
  <div className="flex gap-x-5 mt-3" style={{ width: "fit-content" }}>                             {
                            cryptoChallenges.map((data) => (
                                <a 
                                href={{
                                    pathname: "/challenge",
                                    query: {
                                        slug: data.slug
                                    }
                                }}
                                className=""
                                >
                                <div className={"min-h-[190px] min-w-[200px] w-full ml-4 flex-shrink-0 cursor-pointer text-white bg-neutral-800 hover:bg-neutral-800 font-semibold rounded-lg px-3 py-2  backdrop-blur-lg py-4 border-t-8 " + borderColor[data.difficulty.toLowerCase()]}
>
                                    { /* difficulty in red, green or yellow */ }
                                    <span className={'text-white px-2 rounded-lg font-semibold bg-blue-900 text-sm mr-2 mt-1 ' + badgeColor[data.difficulty.toLowerCase()]}>{data.difficulty}</span>

                                    <h3 className='text-white  font-bold truncate mt-2 text-2xl'>{data.title.substring(0, 45)}</h3>
                                    <p className='text-white truncate text-md mt-1'>{data.content.substring(0, 40)}</p>
                                  
                                </div>
                            </a>                            ))
                        }
                        </div>
                             </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
