import Head from 'next/head'

import { Footer } from '@/components/Footer'

import { StandardNav } from '@/components/StandardNav'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { Stats } from '@/components/dashboard/Stats'
import { Developer } from '@/components/dashboard/Developer'
import { Performance } from '@/components/dashboard/Performance'
import { useEffect } from 'react'
import { Friends } from '@/components/dashboard/Friends'
import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { LearnNav } from '@/components/learn/LearnNav'
import { QuickSettings } from '@/components/dashboard/QuickSetttings'
import { Suggest } from '@/components/dashboard/Suggest'
import { ProgressBar  } from '@tremor/react'
import ReactMarkdown from "react-markdown";

export default function Dashboard() {
    const [open, setOpen] = useState(true)
    const [markdown, setMarkdown] = useState("");


    useEffect(() => {



        fetch(`${process.env.NEXT_PUBLIC_API_URL}/lessons/sublesson/1/progress/1`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("idToken"),
          },
        })
          .then((res) => res.json())
          .then((data) => {
         //   window.alert(JSON.stringify(data));
          })
          .catch((err) => {
            console.log(err);
          });
    }, [])



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
                <div className='max-w-6xl mx-auto '>
                <div className=" w-full  mt-10 backdrop-blur-lg	" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1548&q=80')" }}>
                    <div className="backdrop-blur-md flex mx-auto text-center h-28 my-auto">
                        <h1 className='text-4xl text-white mx-auto my-auto font-semibold'>Linux Basics</h1>
                    </div>
                </div>
                    <div className="flex h-screen max-w-7xl mx-auto ">
                    {/* Sidebar */}
                    <LearnNav/>

                    

                    {/* Main content area */}
                    <div className="flex-1 text-white">

                        {/* Load in markdown from a github url */}

                        <h1 className='mt-10 text-3xl font-semibold'>What is Linux</h1>
                        <hr className='mb-5 mt-2'></hr>
                        <h1 className='text-2xl text-blue-500'>What is Linux?</h1>
Linux is a free and  open source operating system. It is developed by Linus Torvalds, a programmer and the creator of the Linux operating system. Development of Linux originially started in 1991 and has quickly grown to be one of the most popular operating systems in the world.  <br></br><br></br>The syntax of Linux commands are very similar to that of Unix. You'll find that in the tech world, that the Linux operating system is the most popular choice for servers. Although, Windows and MacOS can still be used as servers. A plethora of cybersecurity tools are generally designed for Linux. There are many Linux Distributions that you can use, the most popular one for cybersecurity is Kali Linux. It's advised that if you're new to Linux you use a distribution like Ubuntu.
<h1 className='mt-6 text-2xl text-blue-500'>Understanding the Linux architecture.</h1>
Linux architecture is based on a modular approach. The kernel, which is the core of the operating system, manages the resources of the computer and provides services to applications. The shell is a command line interpreter that allows users to interact with the kernel. The hardware consists of the physical components of the computer, such as the processor, memory, and storage devices. The utilities are programs that provide functions that are not directly related to the operation of the computer, such as text editors and file managers.
                
                <img width="300" className='mx-auto text-center mt-10' src="https://www.ctfguide.com/arch2.png"></img>
                    </div>
                    </div>


                </div>
            </main>
            <Footer />
        </>
    )
}
