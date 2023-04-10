import Head from 'next/head';
import { useRouter } from 'next/router';
import { Footer } from '@/components/Footer';

import { StandardNav } from '@/components/StandardNav';
import { useEffect, useState } from 'react';
import { LearnNav } from '@/components/learn/LearnNav';
import QuizPage from '@/components/learn/QuizPage';

export default function Dashboard() {
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
      question: 'What does forensics in CTF competitions involve?',
      answers: [
        'The process of analyzing digital data to gather evidence or intelligence',
        'The process of analyzing physical data to gather evidence or intelligence',
        'The process of analyzing verbal data to gather evidence or intelligence',
        'None of the above',
      ],
      solution:
        'The process of analyzing digital data to gather evidence or intelligence',
    },
    {
      question: 'What are some examples of CTF forensics challenges?',
      answers: [
        'File or disk image analysis',
        'Network packet analysis',
        'Memory dump analysis',
        'All of the above',
      ],
      solution: 'All of the above',
    },
    {
      question: 'What is a hex editor used for in CTF forensics challenges?',
      answers: [
        'Analyzing and manipulating binary data in files',
        'Analyzing and manipulating text data in files',
        'Analyzing and manipulating image data in files',
        'None of the above',
      ],
      solution: 'Analyzing and manipulating binary data in files',
    },
    {
      question:
        'What is steganography detection software used for in CTF forensics challenges?',
      answers: [
        'Detecting hidden messages or data within files',
        'Detecting hidden passwords within network traffic',
        'Detecting hidden data within memory dumps',
        'None of the above',
      ],
      solution: 'Detecting hidden messages or data within files',
    },
    {
      question: 'What is the primary goal of CTF forensics challenges?',
      answers: [
        'To hack into a system or network',
        'To extract hidden information or uncover clues',
        'To create digital artifacts or files',
        'None of the above',
      ],
      solution: 'To extract hidden information or uncover clues',
    },
    {
      secret:
        'Yes, the questions and answers are stored on the frontend! You must be a forensics expert! Contact Ray for a shoutout',
      question:
        'What skills are important for success in CTF forensics challenges?',
      answers: [
        'Understanding of digital forensics principles and techniques',
        'Proficiency in using various tools and software for analyzing digital data',
        'Both A and B',
        'None of the above',
      ],
      solution: 'Both A and B',
    },
  ];

  return (
    <>
      <Head>
        <title>What is Forensics? - CTFGuide</title>
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
        <div className="mx-auto max-w-6xl">
          <h1 className="mt-4 mt-6 text-5xl font-semibold text-white">
            What is Forensics?
          </h1>
          <div className="mx-auto  flex max-w-7xl ">
            {/* Sidebar */}
            <LearnNav
              lessonNum={2}
              navElements={[
                { href: '/learn/ch2/preview', title: 'What is Forensics?' },
                { href: '/learn/ch2/video2', title: 'Cyberchef 101' },
                { href: '/learn/ch2/activity2', title: 'Mastery Task' },
                {
                  href: '/learn/ch2/dynamic2',
                  title: 'I spy with my little eyes...',
                },
              ]}
            />

            {/* Main content area */}
            <QuizPage
              totalQuizPages={6}
              sublesson={7}
              quizPage={quizPage}
              quizData={quizData}
              nextPage={'./dynamic2'}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
