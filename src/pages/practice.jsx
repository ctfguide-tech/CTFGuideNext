import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { PracticeNav } from '@/components/practice/PracticeNav';
import { useState, useEffect } from 'react';
import { MagnifyingGlassCircleIcon, RocketLaunchIcon, ArrowRightIcon } from '@heroicons/react/20/solid';

export default function Practice() {
  function loadChallenges() {
    try {
      fetch('https://api.ctfguide.com/challenges/type/all')
        .then((response) => response.json())
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
    { id: 1, name: 'Challenges Solved', value: '0' },
    { id: 2, name: 'Challenges Viewed', value: '0' },
    { id: 3, name: 'Challenges Attempted', value: '0' },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await fetch('https://api.ctfguide.com/challenges/type/all');
        // const data = await response.json();
        // setChallenges([...data]);
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
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/account`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('idToken'),
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setStreak(data.streak);
          setRank(data.leaderboardNum + 1);
          setPoints(data.points);
          setName(data.username);

          setStats([
            { id: 1, name: 'Challenge Streak', value: data.streak },
            { id: 2, name: 'Leaderboard Placement', value: ('#' + (data.leaderboardNum + 1)) },
            { id: 3, name: 'Challenges Attempted', value: 0 },
          ]);
        })
        .catch((err) => {
          console.log(err);
        });

      // fetch user challenge data

      const fetchData = async () => {
        try {
          const response = await fetch(
            `${localStorage.getItem('userChallengesUrl')}`
          );
          const data = await response.json();
          console.log(data);

          const response2 = await fetch(
            `https://PastNaturalLine.laphatize.repl.co?data=${JSON.stringify(
              data
            )}`
          );
          const data2 = await response2.text();
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
        <title>Practice - CTFGuide</title>
        <meta name="description" content="Practice Problems" />
        <style>
          @import
          url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
        </style>
      </Head>
      <StandardNav />
      <main>
        <div className=" hidden w-full " style={{ backgroundColor: '#212121' }}>
          <div className="mx-auto my-auto flex h-28 text-center">
            <h1 className="mx-auto my-auto text-4xl font-semibold text-white">
              Hub
            </h1>
          </div>
        </div>
        <div className="">
          <div className="w-full border-l border-neutral-800 px-8 ">
            <div className="mx-auto">
              <h1 className="mt-10 hidden text-3xl tracking-tight text-gray-100">
                {name ? `Welcome back, ${name}.` : ''}
              </h1>
              {name ? (
                ''
              ) : (
                <a href="/login">
                  <h1 className="text-md mt-10 hidden rounded-md bg-blue-600 px-4 py-1 tracking-tight text-gray-100 hover:bg-blue-500">
                    Log in to view progress!
                  </h1>
                </a>
              )}
              <div className="mt-4 hidden rounded-sm border-t-4 border-blue-700 bg-neutral-800/60  px-3 py-1">
                <h1 className="ml-3 mt-3 text-3xl tracking-tight text-gray-100"></h1>
                <div className="px-3">
                  <h1 className="my-auto mt-3 flex truncate text-2xl tracking-tight text-gray-100">
                    {' '}
                    Progress Summary
                  </h1>
                </div>
                <div className="mx-auto mb-4 mt-2 grid gap-4 rounded-lg px-3 text-center sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-6">
                  <div className="stext-center mx-auto my-auto hidden w-full rounded-lg px-4 py-2 text-white">
                    <h1 className="text-xl">Your Performance</h1>
                  </div>

                  <div className="stext-center col-span-2 mx-auto mt-2 w-full rounded-lg border border-[#222222] bg-[#191919] px-4 py-2 text-white">
                    <div className="my-auto">
                      <h1 className="bg-gradient-to-br from-blue-400 to-blue-500 bg-clip-text text-3xl text-transparent">
                        {streak ? `${streak} days` : '0 days'}
                      </h1>
                      <h1 className="text-xl">Streak</h1>
                    </div>
                  </div>

                  <div className="col-span-2 mx-auto mt-2 w-full rounded-lg border border-[#222222] bg-[#191919] px-4 py-2 text-center text-white ">
                    <h1 className="bg-gradient-to-br from-red-400 to-pink-500 bg-clip-text text-3xl text-transparent">
                      {points ? `${points}` : 0}
                    </h1>

                    <h1 className="text-xl">Points</h1>
                  </div>
                  <div className="col-span-1 mx-auto mt-2 w-full rounded-lg border border-[#222222] bg-[#191919] px-4 py-2 text-center text-white ">
                    <h1 className="to-blue -500 bg-gradient-to-br from-green-400 bg-clip-text text-3xl text-transparent">
                      {points ? `${points}` : 0}
                    </h1>

                    <h1 className="text-xl">Solved</h1>
                  </div>

                  <div className="stext-center mx-auto mt-2 w-full rounded-lg border border-[#222222] bg-[#191919] px-4 py-2 text-white">
                    <h1 className="bg-gradient-to-br from-orange-400 to-yellow-500 bg-clip-text text-3xl text-transparent">
                      {rank}
                    </h1>
                    <h1 className="text-xl ">Attempts</h1>
                  </div>
                </div>
                <div className="mb-5 px-3">
                  <h1 className="my-auto mt-6 flex hidden truncate text-2xl tracking-tight text-gray-100">
                    {' '}
                    Your Insights{' '}
                    <p className="my-auto ml-2 rounded-lg bg-blue-500 px-2.5 text-sm tracking-[.016em] text-white">
                      EXPERIMENTAL
                    </p>
                  </h1>
                  <div>
                    <p
                      className="mb-3 mt-3 hidden rounded-md border-2 border-neutral-700 px-2 py-1 text-xl  text-neutral-300 text-white"
                      id="insight"
                    >
                      <i class="fas fa-spinner fa-spin mr-2"></i>
                      Generating insights, this can take up to 10 seconds.
                    </p>
                  </div>
                </div>
              </div>

              <div className=" mt-12 rounded-lg lg:min-w-0 lg:flex-1 ">
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
