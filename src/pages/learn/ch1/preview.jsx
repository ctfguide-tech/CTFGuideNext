import Head from 'next/head';

import { Footer } from '@/components/Footer';

import { StandardNav } from '@/components/StandardNav';
import { LearnNav } from '@/components/learn/LearnNav';
import { MarkDone } from '@/components/learn/MarkDone';
import { motion } from 'framer-motion';
import { useState, useEffect, Fragment } from 'react';
import { Disclosure, Menu, Transition, Dialog } from '@headlessui/react';


import { useRouter } from 'next/router';



export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const [markdown, setMarkdown] = useState('');

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

        console.log("hello")
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
          <div className="mx-auto flex max-w-7xl ">
            {/* Sidebar */}
            <LearnNav
              lessonNum={1}
              navElements={[
                { href: './preview', title: 'What is Linux?' },
                { href: './video1', title: 'Command Basics' },
                { href: './activity1', title: 'Mastery Task' },
                { href: './dynamic1', title: 'Logging into a server' },
              ]}
            />

            {/* Main content area */}
            <div className=" text-white">
              {/* Load in markdown from a github url */}

                <div className='bg-neutral-800/100 my-auto  align-center flex px-4 py-4 mb-4 mt-10 border-t-4 border-blue-700'>
              <motion.h1
                className="animate-slide-in-left  text-3xl font-semibold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                What is Linux
              </motion.h1>
              <div className='ml-auto '>
              <button  onClick={() => { router.push('../learn') }} className='bg-neutral-900 hover:bg-blue-800/100 px-4 py-1 text-xl rounded-l-sm'>←</button>
              <button className=' bg-neutral-900  px-4 py-1 text-xl rounded-l-sm' disabled>1</button>

                <button  onClick={() => { router.push('./video1') }} className='mr-4 bg-neutral-900  hover:bg-blue-800 px-4 py-1 text-xl rounded-r-sm'>→</button>
             
                <MarkDone sublesson={1} section={1} href={'./video1'} />

              </div>
              </div>

<div className='grid grid-cols-8 gap-x-10'>
<div className='col-span-6'>
              <h1 className=" mt-2 text-2xl font-semibold text-blue-500">A brief introduction...</h1>
              Linux is a free and{' '}
              <span className="text-yellow-400 cursor-pointer" onClick={() => setOpen(true)}>
                <i class="fas fa-star"></i> open source
              </span>{' '}
              operating system. It is developed by Linus Torvalds, a programmer
              and the creator of the Linux operating system. Development of
              Linux originially started in 1991 and has quickly grown to be one
              of the most popular operating systems in the world. <br></br>
              <br></br>The syntax of Linux commands are very similar to that of
              Unix. You'll find that in the tech world, that the Linux operating
              system is the most popular choice for servers. Although, Windows
              and MacOS can still be used as servers. A plethora of
              cybersecurity tools are generally designed for Linux. There are
              many Linux Distributions that you can use, the most popular one
              for cybersecurity is Kali Linux. It's advised that if you're new
              to Linux you use a distribution like Ubuntu.
              </div>
          <div className='col-span-2 text-center'>
          <img className='mt-10' src="https://i.insider.com/60da111936cf170019de8431?width=1136&format=jpeg"></img>
           <p className='mt-2 text-sm text-neutral-300'>  Picture of Linus Torwalds, the creator of Linux</p>
            </div>
            </div>
            
              <h1 className="font-semibold mt-6 text-2xl text-blue-500">
                Understanding the Linux architecture.
              </h1>
              Linux architecture is based on a modular approach. The kernel,
              which is the core of the operating system, manages the resources
              of the computer and provides services to applications. The shell
              is a command line interpreter that allows users to interact with
              the kernel. The hardware consists of the physical components of
              the computer, such as the processor, memory, and storage devices.
              The utilities are programs that provide functions that are not
              directly related to the operation of the computer, such as text
              editors and file managers.
              <img
                width="300"
                className="mx-auto mt-10 text-center"
                src="../../arch2.png"
              ></img>
      
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
