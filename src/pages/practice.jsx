import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { PracticeNav } from '@/components/practice/PracticeNav';
import { useState, useEffect } from 'react';
import { LearningModule } from '@/components/learn/LearningModule';
export default function Pratice() {
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
        <div className=" w-full " style={{ backgroundColor: '#212121' }}>
          <div className="mx-auto my-auto flex h-28 text-center">
            <h1 className="mx-auto my-auto text-4xl font-semibold text-white">
              Hub
            </h1>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row">
          <div className="flex w-full max-w-7xl px-8 md:mx-auto md:h-screen md:w-1/5 md:justify-center md:px-16">
            <PracticeNav />
          </div>

          <div className="w-full border-l border-neutral-800 px-8 md:w-4/5 xl:px-16">
            <div className="mx-auto">
              <h1 className="mt-10 text-3xl tracking-tight text-gray-100">
                {name ? `Hey, ${name} 👋` : ''}
              </h1>
              {name ? (
                ''
              ) : (
                <a href="/login">
                  <h1 className="text-md mt-10 rounded-md bg-blue-600 px-4 py-1 tracking-tight text-gray-100 hover:bg-blue-500">
                    Log in to view progress!
                  </h1>
                </a>
              )}
              <div className="mt-4 rounded-md border border-neutral-900 bg-neutral-800 px-3">
                <h1 className="mt-3 ml-3 text-3xl tracking-tight text-gray-100"></h1>
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
                  <h1 className="my-auto mt-6 flex truncate text-2xl tracking-tight text-gray-100">
                    {' '}
                    Your Insights{' '}
                    <p className="my-auto ml-2 rounded-lg bg-blue-500 px-2.5 text-sm tracking-[.016em] text-white">
                      EXPERIMENTAL
                    </p>
                  </h1>
                  <div>
                    <p
                      className="mt-3 mb-3 rounded-md border-2 border-neutral-700 px-2 py-1 text-xl  text-white text-neutral-300"
                      id="insight"
                    >
                      <i class="fas fa-spinner fa-spin mr-2"></i>
                      Generating insights, this can take up to 10 seconds.
                    </p>
                  </div>
                </div>
              </div>

              <h1 className="mt-10 text-2xl tracking-tight text-gray-100 hover:underline">
                Getting Started 🚀
              </h1>

              <div className="w-full overflow-x-scroll pb-4">
                <div
                  className="mt-3 flex gap-x-5"
                  style={{ width: 'fit-content' }}
                >
                  <a
                    href="../guides/about"
                    className="w-1/3 w-full flex-shrink-0 cursor-pointer rounded-lg bg-gradient-to-r from-green-900 to-blue-900 px-3 py-2 py-4 font-semibold text-white backdrop-blur-lg hover:bg-neutral-800"
                  >
                    <h1 className="flex text-xl text-neutral-100 ">
                      About CTFGuide <i className="fas fa-book ml-auto"></i>
                    </h1>
                    <p className="text-sm text-neutral-300">
                      Wondering what CTFGuide is? Let's take a look at what
                      we're all about.
                    </p>
                  </a>
                  <a
                    href="../guides/create"
                    className="w-1/3 w-full flex-shrink-0 cursor-pointer rounded-lg bg-gradient-to-r from-red-900 to-pink-900 px-3 py-2 py-4 font-semibold text-white backdrop-blur-lg hover:bg-neutral-800"
                  >
                    <h1 className="flex text-xl text-neutral-100">
                      Creating CTF's <i className="fas fa-book ml-auto"></i>
                    </h1>
                    <p className="text-sm text-neutral-300">
                      Not all CTF's are made the same. Let's take a look at what
                      makes a good CTF.
                    </p>
                  </a>

                  <a
                    href="../guides/solve"
                    className="w-1/3 w-full flex-shrink-0 cursor-pointer rounded-lg bg-gradient-to-r from-yellow-900 to-orange-900 px-3 py-2 py-4 font-semibold text-white backdrop-blur-lg hover:bg-neutral-800"
                  >
                    <h1 className="flex text-xl text-neutral-100">
                      Solving CTF's <i className="fas fa-book ml-auto"></i>
                    </h1>
                    <p className="text-sm text-neutral-300">
                      Never solved a CTF before? We've made a basic how-to guide
                      just for you.
                    </p>
                  </a>

                  <a
                    href="../guides/approve"
                    className="w-1/3 w-full flex-shrink-0 cursor-pointer rounded-lg bg-gradient-to-r from-indigo-900 to-blue-900 px-3 py-2 py-4 font-semibold text-white backdrop-blur-lg hover:bg-neutral-800"
                  >
                    <h1 className="flex text-xl text-neutral-100 ">
                      Getting your challenge approved{' '}
                      <i className="fas fa-book ml-auto"></i>
                    </h1>
                    <p className="text-sm text-neutral-300">
                      Never solved a CTF before? We've made a basic how-to guide
                      just for you.
                    </p>
                  </a>
                </div>
              </div>
              <h1
                className="mt-10 text-2xl tracking-tight text-white "
                style={{ color: '#595959' }}
              >
                {' '}
                SUGGESTED LESSONS
              </h1>
              <div className="w-full overflow-x-scroll pb-4">
                <div
                  className="mt-3 flex gap-x-5"
                  style={{ width: 'fit-content' }}
                >
                  <LearningModule
                    lessonId={1}
                    title={'Linux Basics'}
                    sections={[
                      'What is Linux?',
                      'Command Basics',
                      'Mastery Task',
                      'Logging into a Server',
                    ]}
                    imgSrc={
                      'https://camo.githubusercontent.com/81045db2ee0ac7dc57a361737aec02c91af299e8122a4b92748b2acb0b0a89d0/687474703a2f2f6a61736f6e6c6f6e672e6769746875622e696f2f67656f5f7061747465726e2f6578616d706c65732f6469616d6f6e64732e706e67'
                    }
                    link={'../learn/ch1/preview'}
                    sectionHrefs={[
                      '../learn/ch1/preview',
                      '../learn/ch1/video1',
                      '../learn/ch1/activity1',
                      '../learn/ch1/dynamic1',
                    ]}
                  />
                  <LearningModule
                    lessonId={2}
                    title={'Forensics'}
                    sections={[
                      'What is Forensics?',
                      'Cyberchef 101',
                      'Mastery Task',
                      'I spy with my little eyes...',
                    ]}
                    imgSrc={
                      'https://camo.githubusercontent.com/f38cb60cf74f6e673504cbde590a1481018dd3bcb83d4307b3f20bb2a4a992f7/687474703a2f2f6a61736f6e6c6f6e672e6769746875622e696f2f67656f5f7061747465726e2f6578616d706c65732f636f6e63656e747269635f636972636c65732e706e67'
                    }
                    link={'../learn/ch2/preview'}
                    sectionHrefs={[
                      '../learn/ch1/preview',
                      '../learn/ch1/video1',
                      '../learn/ch1/activity1',
                      '../learn/ch1/dynamic1',
                    ]}
                  />
                  <LearningModule
                    lessonId={3}
                    title={'Cryptography'}
                    sections={[
                      'What is Cryptography?',
                      'PKI Introduction',
                      'Knees deep into TLS',
                      'Password Dump',
                    ]}
                    imgSrc={
                      'https://camo.githubusercontent.com/2885763d225b252ff5409416061b0fd287b206fed23a6f96fb7bd5e315782579/687474703a2f2f6a61736f6e6c6f6e672e6769746875622e696f2f67656f5f7061747465726e2f6578616d706c65732f63686576726f6e732e706e67'
                    }
                    link={'../learn/ch3/preview'}
                    sectionHrefs={[
                      '../learn/ch1/preview',
                      '../learn/ch1/video1',
                      '../learn/ch1/activity1',
                      '../learn/ch1/dynamic1',
                    ]}
                  />
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
