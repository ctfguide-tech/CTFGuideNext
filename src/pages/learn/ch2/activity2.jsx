import Head from 'next/head'
import { useRouter } from 'next/router';
import { Footer } from '@/components/Footer'

import { StandardNav } from '@/components/StandardNav'
import { useEffect, useState } from 'react'
import { LearnNav } from '@/components/learn/LearnNav'
import QuizPage from '@/components/learn/QuizPage'

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
                    <h1 className='text-white text-5xl mt-4 font-semibold mt-6'>What is Forensics?</h1>
                    <div className="flex  max-w-7xl mx-auto ">
                    {/* Sidebar */}
                    <LearnNav navElements={[{href: "/learn/ch2/preview", title: "What is Forensics?"}, {href: "/learn/ch2/video2", title: "Cyberchef 101"}, {href: "/learn/ch2/activity2", title: "Mastery Task"}, {href: "/learn/ch2/dynamic2", title: "I spy with my little eyes..."}]}/>
                    
                    {/* Main content area */}
                    <QuizPage totalQuizPages={6} sublesson={7} quizPage={quizPage}/>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
