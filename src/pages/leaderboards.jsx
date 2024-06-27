import React, { useEffect, useState } from 'react';
import {
  ArrowRightIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/20/solid';

import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { PracticeNav } from '@/components/practice/PracticeNav';
import { Community } from '@/components/practice/community';
import { MyTable } from '@/components/Table';
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import request from '@/utils/request';


export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    // replace 'http://localhost:5000' with your backend URL
  
      request(`${process.env.NEXT_PUBLIC_API_URL}/leaderboard/`, 'GET', null).then(response => {
        setLeaderboardData(response.leaderboard);
        console.log("leaderboards: ", response.leaderboard)
      })
      .catch(error => {
        console.error('Error fetching leaderboard data: ', error);
      });


  }, []);
  return (
    <>
      <Head>
        <title>Leaderboards - CTFGuide</title>
        <meta name="description" content="Practice Problems" />
        <style>
          @import
          url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
        </style>
      </Head>
      <div className="flex min-h-screen flex-col">
        <StandardNav />
        <main>
      

        <div className="mt-20 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
    <div className=" overflow-hidden shadow bg-gradient-to-r from-yellow-500 to-orange-500">
        <div className="px-4 py-5 sm:p-6">
            <dl>
                <dd className="mt-1 text-3xl font-semibold text-white text-center">
                    <span className="text-3xl">#1</span> { leaderboardData[0]?.user?.username }
                </dd>
                <dd className="mt-1 text-lg text-white text-center border border-white w-1/3 rounded-lg mx-auto">
                    { leaderboardData[0]?.totalPoints } points
                </dd>
            </dl>
        </div>
    </div>

    <div className="overflow-hidden  shadow bg-gradient-to-r from-gray-500 to-white">
        <div className="px-4 py-5 sm:p-6">
            <dl>
                <dd className="mt-1 text-3xl font-semibold text-gray-100 text-center">
                    <span className="text-3xl">#2</span> { leaderboardData[1]?.user?.username }
                </dd>
                <dd className="mt-1 text-lg text-white text-center border border-white w-1/3 rounded-lg mx-auto">
                    { leaderboardData[1]?.totalPoints } points
                </dd>
            </dl>
        </div>
    </div>

    <div className="overflow-hidden shadow  bg-gradient-to-r from-orange-900 to-yellow-700">
        <div className="px-4 py-5 sm:p-6">
            <dl>
                <dd className="mt-1 text-3xl font-semibold text-white text-center">
                    <span className="text-3xl">#3</span> { leaderboardData[2]?.user?.username }
                </dd>
                <dd className="mt-1 text-lg text-white text-center border border-white w-1/3 rounded-lg mx-auto">
                    { leaderboardData[2]?.totalPoints } points
                </dd>
            </dl>
        </div>
    </div>
</div>


          <div className="mx-auto max-w-7xl">
            {/* <div> */}
            {/* <PracticeNav /> */}
            {/* </div> */}
            <div>
              <div className="w-full pt-8">
   
          <div className="relative w-full overflow-auto">
            <Table className="text-white">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Rank</TableHead>
                  <TableHead>Player</TableHead>
          
                  <TableHead className="text-center">Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
        {leaderboardData.map((entry, index) => (
          <TableRow key={index} className="hover:bg-neutral-700 hover:cursor-pointer" onClick={() => {window.location.href = "../users/" + entry.user.username}}>
            <TableCell className="font-medium text-lg text-center">{index + 1}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <img
                  alt="Avatar"
                  className="rounded-full"
                  height="32"
                  src={`https://robohash.org/${entry.user.username}`}
                  style={{
                    aspectRatio: "32/32",
                    objectFit: "cover",
                  }}
                  width="32"
                />
                <a className="text-lg" href={"../users/" + entry.user.username}>{entry.user.username}</a>
              </div>
            </TableCell>
            <TableCell className="text-center">{entry.totalPoints}</TableCell>
          </TableRow>
        ))}

      </TableBody>
            </Table>

          </div>
 
              </div>
            </div>
          </div>
        </main>
        <div className="flex h-full w-full grow basis-0"></div>
        <Footer />
      </div>
    </>
  );
}
