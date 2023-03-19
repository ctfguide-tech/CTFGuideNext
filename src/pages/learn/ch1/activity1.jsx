import Head from 'next/head'
import { useRouter } from 'next/router';
import { Footer } from '@/components/Footer'

import { StandardNav } from '@/components/StandardNav'
import { useEffect, useState } from 'react'
import { LearnNav } from '@/components/learn/LearnNav'
import QuizPage from '@/components/learn/QuizPage'

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
          "question": "What is Linux?",
          "answers": ["An operating system", "A programming language", "A video game", "A web browser"],
          "solution": "An operating system"
        },
        {
          "question": "Which command is used to list files and directories in Linux?",
          "answers": ["pwd", "ls", "cd", "cat"],
          "solution": "ls"
        },
        {
          "question": "Which command is used to change the permissions of a file in Linux?",
          "answers": ["chmod", "chown", "chgrp", "chmodx"],
          "solution": "chmod"
        },
        {
          "question": "Which command is used to create a new directory in Linux?",
          "answers": ["mkdir", "touch", "cp", "mv"],
          "solution": "mkdir"
        },
        {
          "question": "Which command is used to search for a specific string in a file in Linux?",
          "answers": ["grep", "find", "locate", "whereis"],
          "solution": "grep"
        },
        {
          "question": "Which command is used to remove a directory in Linux?",
          "answers": ["rmdir", "rm", "mv", "cp"],
          "solution": "rmdir"
        }
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
                    @import url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
                </style>
            </Head>
            <StandardNav />
            <main>
                <div className='max-w-6xl mx-auto'>
                    <h1 className='text-white text-5xl mt-4 font-semibold mt-6'>Linux Basics</h1>
                    <div className="flex  max-w-7xl mx-auto ">
                    {/* Sidebar */}
                    <LearnNav navElements={[{href: "/learn/ch1/preview", title: "What is Linux?"}, {href: "/learn/ch1/video1", title: "Command Basics"}, {href: "/learn/ch1/activity1", title: "Mastery Task"}, {href: "/learn/ch1/dynamic1", title: "Using your terminal"}]}/>

                    {/* Main content area */}
                    <QuizPage totalQuizPages={6} sublesson={3} quizPage={quizPage} quizData={quizData} nextPage={"./dynamic1"}/>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
