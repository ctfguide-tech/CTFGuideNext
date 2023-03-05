import Link from 'next/link'

import { Container } from '@/components/Container'
import { Logo } from '@/components/Logo'
import { NavLink } from '@/components/NavLink'
import { Divider, DonutChart } from "@tremor/react";
import { Card } from "@tremor/react";
import { useState, useEffect } from 'react'

const cities = [
    {
        name: 'New York',
        sales: 9800,
    },
    {
        name: 'London',
        sales: 4567,
    },
    {
        name: 'Hong Kong',
        sales: 3908,
    },
    {
        name: 'San Francisco',
        sales: 2400,
    },
    {
        name: 'Singapore',
        sales: 1908,
    },
    {
        name: 'Zurich',
        sales: 1398,
    },
];

const valueFormatter = (number) => (
    `$ ${Intl.NumberFormat('us').format(number).toString()}`
);





export function Stats() {

    const [streak, setStreak] = useState("");
    const [rank, setRank] = useState("");
    const [points, setPoints] = useState("")


    useEffect(() => {


        fetch(`${process.env.NEXT_PUBLIC_API_URL}/account`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("idToken"),
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setStreak(data.streak)
                setRank(data.leaderboardNum)
                setPoints(data.points)
            })
            .catch((err) => {
                console.log(err);
            });
    }, [])


    return (
        <>
           
                <div className='mx-auto '>
                    <h1 className="text-xl text-white tracking-tight mt-2    " style={{ color: "#595959" }}> AT A GLANCE</h1>
                    <div className='mx-auto text-center grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-1 mb-4 mt-2  gap-4 rounded-lg'>
                        <div style={{ backgroundColor: "#212121", borderColor: "#3b3a3a" }} className=' px-4 py-2 mx-auto w-full stext-center text-white rounded-lg  '>

                            <h1 className='text-3xl text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-blue-900'>{streak} days</h1>
                            <h1 className='text-xl'>Streak</h1>
                        </div>

                        <div style={{ backgroundColor: "#212121", borderColor: "#3b3a3a" }} className=' px-4 py-2 mx-auto w-full text-center text-white rounded-lg '>
                            <h1 className='text-3xl text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-yellow-900'>{rank}</h1>
                            <h1 className='text-xl '>Rank</h1>
                        </div>

                        <div style={{ backgroundColor: "#212121", borderColor: "#3b3a3a" }} className=' px-4 py-2 mx-auto w-full text-center text-white rounded-lg '>
                            <h1 className='text-3xl text-transparent bg-clip-text bg-gradient-to-br from-red-400 to-blue-900'>{points}</h1>

                            <h1 className='text-xl'>Points</h1>
                        </div>
                    </div>
                </div>


        </>
    )
}
