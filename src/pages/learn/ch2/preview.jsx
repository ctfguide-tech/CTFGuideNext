import Head from 'next/head'

import { Footer } from '@/components/Footer'
import { StandardNav } from '@/components/StandardNav'
import { Fragment, useState } from 'react'
import { LearnNav } from '@/components/learn/LearnNav'
import { MarkDone } from '@/components/learn/MarkDone'
import { motion } from 'framer-motion';

export default function Dashboard() {
    const [open, setOpen] = useState(true)
    const [markdown, setMarkdown] = useState("");

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
                <div className="w-full mt-10 backdrop-blur-lg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1548&q=80')" }}>
                    <div className="backdrop-blur-md flex mx-auto text-center h-28 my-auto">
                        <h1 className='text-4xl text-white mx-auto my-auto font-semibold'>What is Forensics?</h1>
                    </div>
                </div>
                    <div className="flex max-w-7xl mx-auto ">
                    {/* Sidebar */}
                    <LearnNav navElements={[{href: "./preview", title: "What is Forensics?"}, {href: "./video2", title: "Cyberchef 101"}, {href: "./activity2", title: "Mastery Task"}, {href: "./dynamic2", title: "I spy with my little eyes..."}]}/>

                    {/* Main content area */}
                    <div className="text-white">

                        {/* Load in markdown from a github url */}
                        <motion.h1
                            className='mt-10 text-3xl font-semibold animate-slide-in-right'
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            >
                            🔎 What is Forensics?
                        </motion.h1>
                        <hr className='mb-5 mt-2'></hr>
                        <h1 className='text-2xl text-blue-500 mt-2'>Intro: Forensics</h1>
                        Forensics, in the context of cybersecurity, refers to the process of analyzing digital data in order to gather evidence or intelligence that can be used in investigations or legal proceedings. In particular, forensics in Capture The Flag (CTF) competitions involves the examination and analysis of a given set of digital artifacts or files to extract hidden information or uncover clues that will help the participant solve a particular challenge or task.
CTF forensics challenges may take a variety of forms, such as file or disk image analysis, network packet analysis, memory dump analysis, or even steganography. In each case, participants are typically given a set of artifacts or data to work with, and must use their knowledge of digital forensics techniques to uncover hidden information or identify patterns that will lead them to the solution.
<h1 className='mt-6 text-2xl text-blue-500'>Examples</h1>
For example, in a file analysis challenge, participants may be given a file with a specific file format and asked to extract certain information from it. They may use various tools and techniques to analyze the file structure, examine metadata, or search for hidden data that may be encoded within the file. In a network packet analysis challenge, participants may be given a network capture file and asked to identify specific packets or extract certain information from them, such as passwords or IP addresses.
To succeed in CTF forensics challenges, participants need a strong understanding of digital forensics principles and techniques, as well as proficiency in using a range of tools and software for analyzing digital data. Some of the most commonly used tools in CTF forensics challenges include hex editors, forensic analysis software, network analysis tools, and steganography detection software.
Overall, CTF forensics challenges offer an exciting and challenging way to test and develop skills in digital forensics and cybersecurity, and provide valuable experience for those pursuing careers in these fields.
                <img width="300" className='mx-auto text-center mt-10' src="https://www.ctfguide.com/arch2.png"></img>
                    <div className='mt-6 ml-6'>
                        <MarkDone sublesson={5} section={1} href={"./video2"}/>
                    </div>
                </div>
                </div>
            </div>
        </main>   
        <Footer />
        </>
    )
}
