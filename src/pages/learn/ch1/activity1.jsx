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

    /**
    useEffect(() => {
        const fetchData = async () => {
          const response = await fetch("https://gist.githubusercontent.com/rt2zz/e0a1d6ab2682d2c47746950b84c0b6ee/raw/83b8b4814c3417111b9b9bef86a552608506603e/markdown-sample.md");
          const data = await response.text();
          setMarkdown(data);
        };
        fetchData();
      }, []);
     */

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
                    <div className="flex h-screen max-w-7xl mx-auto ">
                    {/* Sidebar */}
                    <LearnNav navElements={[{href: "/learn/ch1/preview", title: "What is Linux?"}, {href: "/learn/ch1/video1", title: "Command Basics"}, {href: "/learn/ch1/activity1", title: "Mastery Task"}, {href: "/learn/ch1/dynamic1", title: "Logging into a server"}]}/>

                    {/* Main content area */}
                    <QuizPage totalQuizPages={6} sublesson={3} quizPage={quizPage}/>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
