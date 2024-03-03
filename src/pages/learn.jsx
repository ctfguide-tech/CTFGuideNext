import Head from 'next/head';
import Link from 'next/link';
import { Footer } from '@/components/Footer';
import { StandardNav } from '@/components/StandardNav';
import { useEffect } from 'react';
import { useState } from 'react';
import { LearningModule } from '@/components/learn/LearningModule';
import request from '@/utils/request';

export default function Dashboard() {
  const [open, setOpen] = useState(true);
  /*
    Code to check if onboarding has been complete
  */
  useEffect(() => {
    try {
      //fetch('api.ctfguide.com/dashboard')
      const url = `${process.env.NEXT_PUBLIC_API_URL}/dashboard`;
      request(url, 'GET', null)
        .then((data) => {
          if (data.onboardingComplete == false) {
          }
        });
    } catch (error) {}
  }, []);

  const [loggedIn, setLoggedIn] = useState(null);

  useEffect(() => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/ami`;
      request(url, 'GET', null)
        .then((data) => setLoggedIn(data))
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {}
  }, []);

  return (
    <>
      <Head>
        <title>Learn - CTFGuide</title>
        <meta
          name="description"
          content="Cybersecurity made easy for everyone"
        />
        <style>
          @import
          url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
        </style>
      </Head>
      <StandardNav />
      <main>
        <div className="w-full hidden" style={{ backgroundColor: '#212121' }}>
          <div className="mx-auto my-auto flex h-28 text-center">
            <h1 className="mx-auto my-auto text-4xl font-semibold text-white">
              Learn
            </h1>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-6xl">

          <div className='bg-neutral-800/50  border-l-4 border-yellow-400 px-6 py-2 text-white'> 
            <h1 className='text-xl font-semibold'><i class="fas fa-exclamation-triangle"></i> Limited Functionality</h1>
            <p>
              A new way to learn on CTFGuide is coming soon. For now, you may experience issues with progress saving and may have to reload the page a few times to get your terminal to work. We apologize for the inconvenience and are working hard to bring you a better learning experience.
            </p>
          </div>


          <h1 className="mb-4 mt-6 text-3xl font-semibold text-white">
            Up next for you
          </h1>
          <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-6">
            {/**Up Next Card 1*/}
            <div className="flex rounded-lg bg-[#212121] px-4 py-4 hover:bg-[#2c2c2c]">
              <div className="flex px-0 py-0">
                <div className="my-auto pr-4">
                  <svg
                    className="h-10 w-10 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                    />
                  </svg>
                </div>

                <div>
                  <h1 className="text-2xl font-medium text-white">
                    Mastery Task
                  </h1>
                  <h1 className="text-md italic text-white">
                    Located in{' '}
                    <span className="text-blue-500">Linux Basics</span>
                  </h1>
                </div>
              </div>
              <div className="my-auto ml-auto px-2">
                <a
                  href="../learn/ch1/activity1"
                  className="rounded-lg bg-blue-700 px-2 py-1 text-lg text-white"
                >
                  Start Task
                </a>
              </div>
            </div>

            {/**Up Next Card 2*/}
            <div className="flex rounded-lg bg-[#212121] px-4 py-4 hover:bg-[#2e2e2e]">
              <div className="flex px-0 py-0">
                <div className="my-auto pr-4">
                  <svg
                    className="h-10 w-10 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-medium text-white">
                    What is Linux?
                  </h1>
                  <h1 className="text-md italic text-white">
                    Located in{' '}
                    <span className="text-blue-500">Linux Basics</span>
                  </h1>
                </div>
              </div>
              <div className="my-auto ml-auto px-2">
                <a
                  href="../learn/ch1/preview"
                  className="rounded-lg bg-blue-700 px-2 py-1 text-lg text-white"
                >
                  Start Task
                </a>
              </div>
            </div>
          </div>

          <h1 className="mb-4 mt-10 text-3xl font-semibold text-white">
            Learning Modules
          </h1>
          <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-6">
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
                'https://camo.githubusercontent.com/a965a210af93849289fa20576cdfccaf10c928842acb1ff888ee6faec89f423a/687474703a2f2f6a61736f6e6c6f6e672e6769746875622e696f2f67656f5f7061747465726e2f6578616d706c65732f6f7665726c617070696e675f72696e67732e706e67'
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
                'https://camo.githubusercontent.com/5a2472dfa2d25f42fc0e5c4af0218a645eae6554885072ed271aec10e991da55/687474703a2f2f6a61736f6e6c6f6e672e6769746875622e696f2f67656f5f7061747465726e2f6578616d706c65732f636f6e63656e747269635f636972636c65732e706e67'
              }
              link={'../learn/ch2/preview'}
              sectionHrefs={[
                '../learn/ch2/preview',
                '../learn/ch2/video2',
                '../learn/ch2/activity2',
                '../learn/ch2/dynamic2',
              ]}
            />
            <LearningModule
              lessonId={3}
              title={'Cryptography'}
              sections={[
                'Introduction to Cryptography',
                'Cryptography Outline Video',
                'Mastery Task',
                'Password Dump',
              ]}
              imgSrc={
                'https://camo.githubusercontent.com/cc63a3ff9435f23f64e9d2cb2b9d09238c4634407968aaf1a652b301c4520ae6/687474703a2f2f6a61736f6e6c6f6e672e6769746875622e696f2f67656f5f7061747465726e2f6578616d706c65732f737175617265732e706e67'
              }
              link={'../learn/ch3/preview'}
              sectionHrefs={[
                '../learn/ch3/preview',
                '../learn/ch3/video3',
                '../learn/ch3/activity3',
                '../learn/ch3/dynamic3',
              ]}
            />
          </div>
          <div className='hidden bg-neutral-800/50 px-8 py-6 rounded-md mt-16'>
            <h1 className="mb-1 text-3xl font-semibold text-white">
              Explore a Tool
            </h1>
            <h2 className="text-base font-semibold leading-8 text-blue-600">
              See how a tool works in action.
            </h2>
            <div className="mt-4 grid grid-cols-4 gap-x-6 gap-y-6">

            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
