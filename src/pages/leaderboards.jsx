import React, { useEffect, useState } from 'react'
import {
  ArrowRightIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/20/solid'

import Head from 'next/head'
import { StandardNav } from '@/components/StandardNav'
import { Footer } from '@/components/Footer'
import { PracticeNav } from '@/components/practice/PracticeNav'
import { Community } from '@/components/practice/community'
import { MyTable } from '@/components/Table'
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table
} from '@/components/ui/table'
import request from '@/utils/request'

export default function Leaderboard () {
  const [leaderboardData, setLeaderboardData] = useState([])

  useEffect(() => {
    // replace 'http://localhost:5000' with your backend URL

    request(`${process.env.NEXT_PUBLIC_API_URL}/leaderboard/`, 'GET', null)
      .then((response) => {
        setLeaderboardData(response.leaderboard)
        console.log('leaderboards: ', response.leaderboard)
      })
      .catch((error) => {
        console.error('Error fetching leaderboard data: ', error)
      })
  }, [])
  return (
    <>
      <Head>
        <title>Leaderboards - CTFGuide</title>
        <meta name='description' content='Practice Problems' />
        <style>
          @import
          url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');

        </style>
      </Head>
      <div className='flex min-h-screen flex-col'>
        <StandardNav />
        <main>
          <div className='mx-auto mt-20 flex max-w-7xl flex-col items-end gap-5 md:flex-row'>
            <div
              className='relative w-full flex-1 cursor-pointer bg-gradient-to-br from-gray-600 via-gray-400 via-65% to-gray-600 shadow md:w-auto podium'
              onClick={() => {
                window.location.href =
                  '../users/' + leaderboardData[1].user.username
              }}
            >
              <div className='flag-top' />
              <div className='absolute -top-20 left-1/2 hidden -translate-x-1/2 transform md:block'>
                <img
                  alt='Avatar'
                  className='rounded-full'
                  height='100'
                  src={
                    leaderboardData[1]?.user?.profileImage === ''
                      ? 'https://robohash.org/' +
                        leaderboardData[1]?.user?.username
                      : `${leaderboardData[1]?.user?.profileImage}`
                  }
                  style={{
                    aspectRatio: '64/64',
                    objectFit: 'cover'
                  }}
                  width='100'
                />
              </div>
              <div className='px-4 py-5 pt-12 sm:p-6'>
                <dl>
                  <dd className='mt-1 text-center text-2xl font-semibold text-gray-100'>
                    <span className='text-xl'>#2</span>{' '}
                    {leaderboardData[1]?.user?.username}
                  </dd>
                  <dd className='mx-auto mt-1 w-1/3 rounded-lg border border-white text-center text-lg text-white'>
                    {leaderboardData[1]?.totalPoints} points
                  </dd>
                </dl>
              </div>
            </div>

            <div
              className='relative w-full flex-1 cursor-pointer bg-gradient-to-br from-amber-600 via-yellow-400 via-75% to-amber-600 shadow md:w-auto podium'
              onClick={() => {
                window.location.href =
                  '../users/' + leaderboardData[0].user.username
              }}
            >
              <div className='flag-top' />
              <div className='absolute -top-16 left-1/2 hidden -translate-x-1/2 transform md:block'>
                <img
                  alt='Avatar'
                  className='rounded-full'
                  height='100'
                  src={
                    leaderboardData[0]?.user?.profileImage === ''
                      ? 'https://robohash.org/' +
                        leaderboardData[0]?.user?.username
                      : `${leaderboardData[0]?.user?.profileImage}`
                  }
                  style={{
                    aspectRatio: '80/80',
                    objectFit: 'cover'
                  }}
                  width='100'
                />
              </div>
              <div className='px-4 py-8 pt-16 sm:p-10'>
                <dl>
                  <dd className='mt-1 text-center text-3xl font-semibold text-gray-100'>
                    <span className='text-2xl'>#1</span>{' '}
                    {leaderboardData[0]?.user?.username}

                  </dd>
                  <dd className='mx-auto mt-1 w-1/2 rounded-lg border border-white text-center text-xl text-white'>
                    {leaderboardData[0]?.totalPoints} points
                  </dd>
                </dl>
              </div>
            </div>

            <div
              className='relative w-full flex-1 cursor-pointer bg-gradient-to-br from-orange-900 via-orange-400 via-65% to-orange-900 shadow md:w-auto podium'
              onClick={() => {
                window.location.href =
                  '../users/' + leaderboardData[2].user.username
              }}
            >
              {
                // too poopy
              }
              <div className='flag-top' />
              <div className='absolute -top-20 left-1/2 hidden -translate-x-1/2 transform md:block'>
                <img
                  alt='Avatar'
                  className='rounded-full'
                  height='100'
                  src={
                    leaderboardData[2]?.user?.profileImage === ''
                      ? 'https://robohash.org/' +
                        leaderboardData[2]?.user?.username
                      : `${leaderboardData[2]?.user?.profileImage}`
                  }
                  style={{
                    aspectRatio: '64/64',
                    objectFit: 'cover'
                  }}
                  width='100'
                />
              </div>
              <div className='px-4 py-5 pt-12 sm:p-6'>
                <dl>
                  <dd className='mt-1 text-center text-2xl font-semibold text-gray-100'>
                    <span className='text-xl'>#3</span>{' '}
                    {leaderboardData[2]?.user?.username}
                  </dd>
                  <dd className='mx-auto mt-1 w-1/3 rounded-lg border border-white text-center text-lg text-white'>
                    {leaderboardData[2]?.totalPoints} points
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className='mx-auto max-w-7xl'>
            <div>
              <div className='w-full pt-8'>
                <div className='relative w-full overflow-auto'>
                  <Table className='text-white'>
                    <TableHeader>
                      <TableRow>
                        <TableHead className='w-[50px]'>Rank</TableHead>
                        <TableHead>Player</TableHead>
                        <TableHead className='text-center'>Points</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leaderboardData && leaderboardData.length > 3 && leaderboardData.slice(3).map((entry, index) => (
                        <TableRow
                          key={index}
                          className='hover:cursor-pointer hover:bg-neutral-700'
                          onClick={() => {
                            window.location.href =
                              '../users/' + entry.user.username
                          }}
                        >
                          <TableCell className='text-center text-lg font-medium'>
                            #{index + 4}
                          </TableCell>
                          <TableCell>
                            <div className='flex items-center gap-2'>
                              <img
                                alt='Avatar'
                                className='rounded-full'
                                height='32'
                                src={
                                  entry.user.profileImage === ''
                                    ? 'https://robohash.org/' +
                                      entry.user.username
                                    : `${entry.user.profileImage}`
                                }
                                style={{
                                  aspectRatio: '32/32',
                                  objectFit: 'cover'
                                }}
                                width='32'
                              />
                              <a
                                className='text-lg'
                                href={'../users/' + entry.user.username}
                              >
                                {entry.user.username}
                                {entry.user.role === 'ADMIN' && (
                                  <>
                                    <span className='bg-red-600 px-1 text-sm ml-2'><i className='fas fa-code fa-fw' /> developer</span>
                                  </>
                                )}
                                {entry.user.role === 'PRO' && (
                                  <>
                                    <span className=' ml-2 bg-gradient-to-br from-orange-400 to-yellow-600    px-1 text-sm'><i className='fas fa-crown fa-fw' /> pro</span>
                                  </>
                                )}
                              </a>
                            </div>
                          </TableCell>
                          <TableCell className='text-center'>
                            {entry.totalPoints}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </main>
        <div className='flex h-full w-full grow basis-0' />
        <Footer />
      </div>
    </>
  )
}
