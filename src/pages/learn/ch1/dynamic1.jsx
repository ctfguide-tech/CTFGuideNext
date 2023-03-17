import Head from 'next/head'

import { Footer } from '@/components/Footer'

import { StandardNav } from '@/components/StandardNav'
import { useEffect, useState } from 'react'
import { LearnNav } from '@/components/learn/LearnNav'
import { LearnCore } from '@/components/LearnCore'
import { MarkDone } from '@/components/learn/MarkDone'

export default function Dashboard() {
    const [open, setOpen] = useState(true)
    const [markdown, setMarkdown] = useState("");

    useEffect(() => {
        const fetchData = async () => {
          const response = await fetch("https://gist.githubusercontent.com/rt2zz/e0a1d6ab2682d2c47746950b84c0b6ee/raw/83b8b4814c3417111b9b9bef86a552608506603e/markdown-sample.md");
          const data = await response.text();
          setMarkdown(data);
        };
        fetchData();
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
                    @import url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
                </style>
            </Head>
            <StandardNav />
            <main>
                <div className='max-w mx-auto pl-20'>

                    <div className="flex  max-w mx-auto ">
                    {/* Sidebar */}

                    <LearnNav  navElements={[{href: "./preview", title: "What is Linux?"}, {href: "./video1", title: "Command Basics"}, {href: "./activity1", title: "Mastery Task"}, {href: "./dynamic1", title: "Logging into a server"}]}/>

                    {/* Main content area */}
                    <div className="flex-1 text-white">

                        {/* Load in markdown from a github url */}
                        <LearnCore/>
                        <div className="ml-6 mt-2">
                            <MarkDone sublesson={4} section={1} href={"../"}/>
                        </div>
                    </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
