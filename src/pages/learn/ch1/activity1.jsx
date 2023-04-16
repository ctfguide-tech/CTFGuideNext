import Head from 'next/head';
import { useRouter } from 'next/router';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';

import { StandardNav } from '@/components/StandardNav';
import { useEffect, useState } from 'react';
import { LearnNav } from '@/components/learn/LearnNav';
import QuizPage from '@/components/learn/QuizPage';

export default function Dashboard() {
  // const [open, setOpen] = useState(true)
  // const [markdown, setMarkdown] = useState("");
  const [quizPage, setQuizPage] = useState(1);

  const router = useRouter();

  // Get the `quizPage` query param from the URL, default to 1
  useEffect(() => {
    const page = parseInt(router.query.quizPage, 10) || 1;
    if (page !== quizPage) {
      setQuizPage(page);
    }
  }, [router.query.quizPage]);

  const quizData = [
    {
      question: 'What is Linux?',
      answers: [
        'An operating system',
        'A programming language',
        'A video game',
        'A web browser',
      ],
      solution: 'An operating system',
    },
    {
      question: 'Which command is used to list files and directories in Linux?',
      answers: ['pwd', 'ls', 'cd', 'cat'],
      solution: 'ls',
    },
    {
      question:
        'Which command is used to change the permissions of a file in Linux?',
      answers: ['chmod', 'chown', 'chgrp', 'chmodx'],
      solution: 'chmod',
    },
    {
      question: 'Which command is used to create a new directory in Linux?',
      answers: ['mkdir', 'touch', 'cp', 'mv'],
      solution: 'mkdir',
    },
    {
      question:
        'Which command is used to search for a specific string in a file in Linux?',
      answers: ['grep', 'find', 'locate', 'whereis'],
      solution: 'grep',
    },
    {
      question: 'Which command is used to remove a directory in Linux?',
      answers: ['rmdir', 'rm', 'mv', 'cp'],
      solution: 'rmdir',
    },
  ];

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
        <div className="mx-auto ">
        <div
            className="  w-full backdrop-blur-lg"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1633259584604-afdc243122ea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80')",
            }}
          >
            <div className="mx-auto my-auto flex h-28 text-center backdrop-blur-md">
              <h1 className="mx-auto my-auto text-4xl font-semibold text-white">
                Linux Basics
              </h1>
            </div>
          </div>
          <div className="mx-auto  flex max-w-7xl ">
            {/* Sidebar */}
            <LearnNav
              lessonNum={1}
              navElements={[
                { href: '/learn/ch1/preview', title: 'What is Linux?' },
                { href: '/learn/ch1/video1', title: 'Command Basics' },
                { href: '/learn/ch1/activity1', title: 'Mastery Task' },
                { href: '/learn/ch1/dynamic1', title: 'Using your terminal' },
              ]}
            />

            {/* Main content area */}
            <div className="flex-1 text-white ">

            <div className='bg-neutral-800/100 my-auto  align-center flex px-4 py-4 mb-4 mt-10 border-t-4 border-blue-700'>
              <motion.h1
                className="animate-slide-in-left  text-3xl font-semibold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Mastery Task
              </motion.h1>
              <div className='ml-auto '>

              <button onClick={() => { router.push('./video1') }} className='bg-neutral-900 hover:bg-blue-800/100 px-4 py-1 text-xl rounded-l-sm'>←</button>
              <button  className=' bg-neutral-900  px-4 py-1 text-xl rounded-l-sm' disabled>3</button>
    <button onClick={() => { router.push('./dynamic1') }}  className='mr-4 bg-neutral-900  hover:bg-blue-800 px-4 py-1 text-xl rounded-r-sm'>→</button>
            

              </div>
              </div>

            <QuizPage
              totalQuizPages={6}
              sublesson={3}
              quizPage={quizPage}
              quizData={quizData}
              nextPage={'./dynamic1'}
            />
          </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
