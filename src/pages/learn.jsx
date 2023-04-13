import Head from 'next/head';
import Link from 'next/link';
import { Footer } from '@/components/Footer';
import { StandardNav } from '@/components/StandardNav';
import { useEffect } from 'react';
import { useState } from 'react';
import { LearningModule } from '@/components/learn/LearningModule';

export default function Dashboard() {
  const [open, setOpen] = useState(true);
  /*
    Code to check if onboarding has been complete
  */
  useEffect(() => {
    try {
      fetch('api.ctfguide.com/dashboard')
        .then((res) => res.json())

        .then((data) => {
          if (data.onboardingComplete == false) {
          }
        });
    } catch (error) {}
  }, []);

  const [loggedIn, setLoggedIn] = useState(null);

  useEffect(() => {
    try {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/ami`)
        .then((response) => response.json())
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
      </main>
      <Footer />
    </>
  );
}
