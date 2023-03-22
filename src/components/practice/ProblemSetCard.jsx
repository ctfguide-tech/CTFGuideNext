import Head from 'next/head'
import React, { useState, useEffect } from "react";
import { StandardNav } from '@/components/StandardNav'
import { Footer } from '@/components/Footer'
import { PracticeNav } from '@/components/practice/PracticeNav'
import { ProblemSetCards } from '@/components/practice/GoToCreate'
import ProblemSet from '@/components/practice/ProblemSet'

export default function ProblemSetCard({categoryName}) {
    const [components, setComponents] = useState([]);
    const [cryptoChallenges, setCryptoChallenges] = useState([]);

    useEffect(() => {
        try {
            fetch(process.env.NEXT_PUBLIC_API_URL + `/challenges?category=${categoryName}`)
                .then((response) => response.json())
                .then((data) => {
                    console.log(data)
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
                const response = await fetch(process.env.NEXT_PUBLIC_API_URL + `/challenges?category=${categoryName}`);
                const { result } = await response.json();
                setCryptoChallenges(result);
                console.log(cryptoChallenges)
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
            <div className="w-full overflow-x-scroll pb-4">
                                <div className="flex gap-x-5 mt-3" style={{ width: "fit-content" }}>                             {
                                    cryptoChallenges && cryptoChallenges.map((data) => (
                                        <a
                                            href={`/challenge?slug=${data.slug}`}
                                            className=""
                                        >
                                            <div className={"min-h-[190px] min-w-[200px] w-full ml-4 flex-shrink-0 cursor-pointer text-white bg-neutral-800 hover:bg-neutral-800 font-semibold rounded-lg px-3 py-2  backdrop-blur-lg py-4 border-t-8 " + borderColor[data.difficulty.toLowerCase()]}
                                            >
                                                { /* difficulty in red, green or yellow */}
                                                <span className={'text-white px-2 rounded-lg font-semibold bg-blue-900 text-sm mr-2 mt-1 ' + badgeColor[data.difficulty.toLowerCase()]}>{data.difficulty}</span>

                                                <h3 className='text-white  font-bold truncate mt-2 text-2xl'>{data.title.substring(0, 45)}</h3>
                                                <p className='text-white truncate text-md mt-1'>{data.content.substring(0, 40)}</p>

                                            </div>
                                        </a>))
                                }
                                </div>
                            </div>
        </>
    )
}
