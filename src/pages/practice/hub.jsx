import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { PracticeNav } from '@/components/practice/PracticeNav';
import { useState, useEffect } from 'react';
import { MagnifyingGlassCircleIcon, RocketLaunchIcon, ArrowRightIcon, HandThumbUpIcon } from '@heroicons/react/20/solid';
import request from '@/utils/request';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Practice() {
  useEffect(() => {
    try {
      const url = `${baseUrl}/stats/dashboard`;
      request(url, 'GET', null)
        .then((data) => {
          setStats([
            {
              id: 1,
              name: 'Challenges Solved',
              value: data.solved,
            },
            {
              id: 2,
              name: 'Challenges Viewed',
              value: data.viewed,
            },
            {
              id: 3,
              name: 'Total Attempts',
              value: data.submissions,
            }

          ]);

        })
        .catch((err) => {
          console.log(err);
        });
    } catch {}
  }, []);

  function loadChallenges() {
    try {
      const url = baseUrl + '/challenges/type/all';
      request(url, 'GET', null)
        .then((data) => {
          for (var i = 0; i < data.length; i++) {
            var difficultyColor = 'border-green-500';

            if (data[i].difficulty == 'easy') {
              difficultyColor = 'border-green-500';
            } else if (data[i].difficulty == 'medium') {
              difficultyColor = 'border-yellow-500';
            } else if (data[i].difficulty == 'hard') {
              difficultyColor = 'border-red-500';
            }

            if(!document) return;
            document.getElementById('starter').insertAdjacentHTML(
              'afterend',
              `<div class='card rounded-lg px-4 py-2 w-full border-l-4 ${difficultyColor}' style='background-color: #212121'>
                <h1 class='text-white text-2xl'>${data[i].title}</h1>
                <p class='text-white truncate'>${data[i].problem.substring(
                  0,
                  40
                )}</p>
                <div class='flex mt-2'>

                    <p class='text-white px-2  rounded-lg bg-blue-900 text-sm'>${
                      data[i].category
                    }</p>
                </div>
            </div>`
            );
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch {}
  }

  const [challenges, setChallenges] = useState([]);


  const [stats, setStats] = useState([
    { id: 1, name: '...', value: '...' },
    { id: 2, name: '...', value: '...' },
    { id: 3, name: '...', value: '...' },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_API_URL + '/challenges'
        );
        const { result } = await response.json();

        setChallenges([...result]);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  loadChallenges();
  const [streak, setStreak] = useState('');
  const [rank, setRank] = useState('');
  const [points, setPoints] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/account`;
      request(url, 'GET', null)
        .then((data) => {
          setStreak(data.streak);
          setRank(data.leaderboardNum + 1);
          setPoints(data.points);
          setName(data.username);

          setStats([
            { id: 1, name: 'Challenge Streak', value: 0 },
            { id: 2, name: 'Leaderboard Placement', value: 0 },
            { id: 3, name: 'Challenges Attempted', value: 0 },
          ]);
        })
        .catch((err) => {
          console.log(err);
        });

      // fetch user challenge data

      const fetchData = async () => {
        try {
          const data = await request(localStorage.getItem('userChallengesUrl'), 'GET', null);
          if(!data) return;
          console.log(data);

          const url = `https://PastNaturalLine.laphatize.repl.co?data=${JSON.stringify(data)}`
          const resp = await fetch(url);
          const data2 = await resp.json();

          if(!document) return;
          document.getElementById('insight').innerHTML =
            "Heads up! If you haven't solved a challenge - this response will be incorrect. " +
            data2;
        } catch {}
      };
      fetchData();
    } catch {}
  }, []);

  return (
    <>
      <Head>
        <title>Hub - CTFGuide</title>
        <meta name="description" content="Practice Problems" />
        <style>
          @import
          url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
        </style>
      </Head>
      <StandardNav />
      <main>
        <div className="">
          
          <div className="w-full border-l border-neutral-800 px-8 ">


            <div className="mx-auto">
            <div className='bg-neutral-800/50 mt-6 max-w-7xl  mx-auto border-l-4 border-yellow-400 px-6 py-2 text-white'> 
            <h1 className='text-xl font-semibold'><i class="fas fa-exclamation-triangle"></i> Deprecation Notice</h1>
            <p>
             This page (the Hub) is being removed in the next update. You'll be able to find insights on your dashboard instead.
            </p>
          </div>

              <div className=" mt-4 rounded-lg lg:min-w-0 lg:flex-1 ">
                <div className="mx-auto max-w-7xl">
                  <div className="  relative isolate overflow-hidden  rounded-lg bg-black/10 bg-neutral-900 py-14 shadow-2xl ring-1 ring-white/10 sm:py-12">
                    <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                      <div
                        className="absolute -bottom-8 -left-96 -z-10 transform-gpu blur-3xl sm:-bottom-64 sm:-left-40 lg:-bottom-32 lg:left-8 xl:-left-10"
                        aria-hidden="true"
                      >
                        <div
                          className="aspect-[1266/975] w-[79.125rem] bg-gradient-to-tr from-[#081e75] to-[#0737f2] opacity-30"
                          style={{
                            clipPath:
                              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                          }}
                        />
                      </div>
                      <div className="mx-auto max-w-6xl lg:mx-0 lg:max-w-3xl">
                        <h2 className="text-base font-semibold leading-8 text-blue-600">
                          PERFORMANCE OVERVIEW
                        </h2>
                        <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                          Practice makes perfect.
                        </p>
                        <p className="mt-4 text-lg leading-8 text-gray-300">
                          CTFGuide has a plethora of user uploaded challenges
                          that can help you improve specific skills. All
                          challenges are vetted by the CTFGuide team to ensure
                          they are of high quality.
                        </p>
                      </div>
                      <dl className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-10 text-white sm:grid-cols-2 sm:gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-4">
                        {stats.map((stat) => (
                          <div
                            key={stat.id}
                            className="flex flex-col gap-y-3 border-l border-white/10 pl-6"
                          >
                            <dt className="text-sm leading-6">{stat.name}</dt>
                            <dd className="order-first text-3xl font-semibold tracking-tight">
                              {stat.value}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mx-auto grid max-w-7xl grid-cols-6 gap-x-4">
                <div className="col-span-1">
                  <PracticeNav />
                </div>
                <div className="col-span-5 ml-4 bg-neutral-900/50 px-8 rounded-md mt-8 shadow-2xl ring-1 ring-white/10">
                  <h1 className="flex mt-6 text-2xl tracking-tight text-gray-100 ">
                    Getting Started.<RocketLaunchIcon className='mt-1 ml-2 h-6 w-6 text-blue-500 hidden'/>
                  </h1>
                  <div className="mt-3 grid grid-cols-3 gap-x-6">
                    <div className="">
                      <a href='/guides/about'>
                      <div className="  relative isolate overflow-hidden  rounded-md bg-black/10 bg-neutral-900 pb-4 shadow-2xl ring-1 ring-white/10 hover:ring-white/40">
                        <div className="relative mx-auto max-w-7xl  px-5">
                          <div
                            className="absolute -bottom-8 -left-96 -z-10 transform-gpu blur-3xl sm:-bottom-64 sm:-left-40 lg:-bottom-32 lg:left-8 xl:-left-10"
                            aria-hidden="true"
                          >
                            <div
                              className="aspect-[1266/975] w-[79.125rem] bg-gradient-to-tr from-[#081e75] to-[#0737f2] opacity-30"
                              style={{
                                clipPath:
                                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                              }}
                            />
                          </div>
                          <div className="mx-auto  lg:mx-0 lg:max-w-3xl">
                            <div className="mt-4 text-lg leading-8 text-gray-300">
                              <h1 className="flex text-xl text-neutral-100 mb-1">
                                About CTFGuide{' '}
                                <i className="fas fa-book ml-auto text-[#3b82f6] mt-1.5"></i>
                              </h1>
                              <p className="text-sm text-neutral-300">
                                Wondering what CTFGuide is? Let's take a look at
                                what we're all about.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      </a>
                    </div>

                    <div className="">
                      <a href='/guides/create'>
                      <div className="  relative isolate overflow-hidden  rounded-md bg-black/10 bg-neutral-900 pb-4 shadow-2xl ring-1 ring-white/10 hover:ring-white/40">
                        <div className="relative mx-auto max-w-7xl  px-5">
                          <div
                            className="absolute -bottom-8 -left-96 -z-10 transform-gpu blur-3xl sm:-bottom-64 sm:-left-40 lg:-bottom-32 lg:left-8 xl:-left-10"
                            aria-hidden="true"
                          >
                            <div
                              className="aspect-[1266/975] w-[79.125rem] bg-gradient-to-tr from-[#081e75] to-[#0737f2] opacity-30"
                              style={{
                                clipPath:
                                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                              }}
                            />
                          </div>
                          <div className="mx-auto  lg:mx-0 lg:max-w-3xl">
                            <div className="mt-4 text-lg leading-8 text-gray-300">
                              <h1 className="flex text-xl text-neutral-100 mb-1">
                                Creating CTF's{' '}
                                <i className="fas fa-pen ml-auto text-[#3b82f6] mt-1.5"></i>
                              </h1>
                              <p className="text-sm text-neutral-300">
                                Not all CTF's are made the same. Let's take a
                                look at what makes a good CTF.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      </a>
                    </div>

                    <div className="">
                      <a href='/guides/solve'>
                      <div className="  relative isolate overflow-hidden  rounded-md bg-black/10 bg-neutral-900 pb-4 shadow-2xl ring-1 ring-white/10 hover:ring-white/40">
                        <div className="relative mx-auto max-w-7xl  px-5">
                          <div
                            className="absolute -bottom-8 -left-96 -z-10 transform-gpu blur-3xl sm:-bottom-64 sm:-left-40 lg:-bottom-32 lg:left-8 xl:-left-10"
                            aria-hidden="true"
                          >
                            <div
                              className="aspect-[1266/975] w-[79.125rem] bg-gradient-to-tr from-[#081e75] to-[#0737f2] opacity-30"
                              style={{
                                clipPath:
                                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                              }}
                            />
                          </div>
                          <div className="mx-auto  lg:mx-0 lg:max-w-3xl">
                            <div className="mt-4 text-lg leading-8 text-gray-300">
                              <h1 className="flex text-xl text-neutral-100 mb-1">
                                Solving CTF's{' '}
                                <i className="fas fa-hammer ml-auto text-[#3b82f6] mt-1.5"></i>
                              </h1>
                              <p className="text-sm text-neutral-300">
                                Never solved a CTF before? We've made a basic
                                how-to guide just for you.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      </a>
                    </div>
                  </div>

                  <h1 className="flex mt-6 text-2xl tracking-tight text-gray-100">
                    Your Insights.<MagnifyingGlassCircleIcon className="text-white h-5 w-5 mt-1.5 ml-1.5 hidden" />
                  </h1>
                  <div>
                    <div className="mt-3 w-full pb-4 mb-4">
                      <div className="grid grid-cols-1 gap-x-10">
                        <div
                          href="../challenges/1"
                          className="w-1/3 w-full flex-shrink-0 cursor-pointer rounded-sm  bg-neutral-800/50 to-blue-900 px-5   py-4 font-semibold text-white backdrop-blur-lg hover:bg-neutral-800"
                        >
                          <h1 className="flex text-xl text-neutral-100 ">
                            Hmmm, looks like we have no insights for you yet...
                          </h1>
                          <p className="text-sm text-neutral-300">
                            CTFGuide can give you insights based on your past
                            CTF solves. But, it does require you to solve
                            several problems first.
                          </p>
                          <a href="/practice/community">
                            <p className='flex tracking-loose text-blue-500 mt-2 hover:underline'>
                                Let's get hacking<ArrowRightIcon className='ml-1.5 h-5 mt-0.5'/>
                            </p>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
