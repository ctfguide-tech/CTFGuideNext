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
                <title>What is Forensics? - CTFGuide</title>
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
                    <LearnNav navElements={[{href: "./preview", title: "What is Forensics?"}, {href: "./video2", title: "Cyberchef 101"}, {href: "./activity2", title: "Mastery Task"}, {href: "./dynamic2", title: "I spy with my little eyes..."}]}/>

                    {/* Main content area */}
                    <div className="flex-1 text-white">

                        {/* Load in markdown from a github url */}
                        <LearnCore/>
                        <div className="ml-6 mt-2">
                            <MarkDone sublesson={8} section={1} href={"../"}/>
                        </div>
                    </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
