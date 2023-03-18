import Head from 'next/head'

import { Footer } from '@/components/Footer'

import { StandardNav } from '@/components/StandardNav'
import { LearnNav } from '@/components/learn/LearnNav'
import { MarkDone } from '@/components/learn/MarkDone'
import { motion } from 'framer-motion';
import { useState, useEffect, Fragment } from 'react'
import { Disclosure, Menu, Transition, Dialog } from '@headlessui/react'


export default function Dashboard() {
    const [open, setOpen] = useState(false)
    
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
                <div className='max-w-6xl mx-auto '>
                <div className=" w-full mt-10 backdrop-blur-lg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1548&q=80')" }}>
                    <div className="backdrop-blur-md flex mx-auto text-center h-28 my-auto">
                        <h1 className='text-4xl text-white mx-auto my-auto font-semibold'>Linux Basics</h1>
                    </div>
                </div>
                    <div className="flex max-w-7xl mx-auto ">
                    {/* Sidebar */}
                    <LearnNav navElements={[{href: "./preview", title: "What is Linux?"}, {href: "./video1", title: "Command Basics"}, {href: "./activity1", title: "Mastery Task"}, {href: "./dynamic1", title: "Logging into a server"}]}/>

                    {/* Main content area */}
                    <div className=" text-white">

                        {/* Load in markdown from a github url */}
                        <motion.h1
                            className='mt-10 text-3xl font-semibold animate-slide-in-left'
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            >
                            What is Linux
                        </motion.h1>
                        <hr className='mb-5 mt-2'></hr>
                        <h1 className='text-2xl text-blue-500 mt-2'>What is Linux?</h1>
Linux is a free and  <span className='text-yellow-400' onClick={() => setOpen(true)}><i class="fas fa-star"></i> open source</span> operating system. It is developed by Linus Torvalds, a programmer and the creator of the Linux operating system. Development of Linux originially started in 1991 and has quickly grown to be one of the most popular operating systems in the world.  <br></br><br></br>The syntax of Linux commands are very similar to that of Unix. You'll find that in the tech world, that the Linux operating system is the most popular choice for servers. Although, Windows and MacOS can still be used as servers. A plethora of cybersecurity tools are generally designed for Linux. There are many Linux Distributions that you can use, the most popular one for cybersecurity is Kali Linux. It's advised that if you're new to Linux you use a distribution like Ubuntu.
<h1 className='mt-6 text-2xl text-blue-500'>Understanding the Linux architecture.</h1>
Linux architecture is based on a modular approach. The kernel, which is the core of the operating system, manages the resources of the computer and provides services to applications. The shell is a command line interpreter that allows users to interact with the kernel. The hardware consists of the physical components of the computer, such as the processor, memory, and storage devices. The utilities are programs that provide functions that are not directly related to the operation of the computer, such as text editors and file managers.
                
                <img width="300" className='mx-auto text-center mt-10' src="https://www.ctfguide.com/arch2.png"></img>
                    <div className='mt-6 ml-6'>
                        <MarkDone sublesson={1} section={1} href={"./video1"}/>
                    </div>
                    </div>
                    </div>
                </div>

                <Transition.Root show={open} as={Fragment} style={{ fontFamily: 'Poppins, sans-serif', overflow:'hidden'}} className="test">
      <Dialog as="div" className="fixed inset-0 overflow-hidden" onClose={setOpen}>
        <div className="absolute inset-0 overflow-hidden">
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="absolute inset-0 bg-neutral-800 bg-opacity-75 transition-opacity" />
          </Transition.Child>
          <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="relative w-screen max-w-md">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-500"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-500"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 left-0 -ml-8 pt-4 pr-2 flex sm:-ml-10 sm:pr-4">
                    <button
                      type="button"
                      className="rounded-md text-gray-300 hover:text-white focus:outline-none"
                      onClick={() => setOpen(false)}
                    >
                      <span className="sr-only">Close panel</span>
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </Transition.Child>
                <div className="test bg-gradient-to-br from-neutral-800 to-black border border-gray-800 h-full flex flex-col py-6 bg-white shadow-xl overflow-y-scroll">
                  <div className="px-4 sm:px-6">
                    <Dialog.Title className="text-lg font-medium text-white text-2xl">What is open source?</Dialog.Title>
                    <div class="hidden bg-gray-800 rounded-lg px-4 py-2 mt-4">


                    <div class="flex items-center justify-between">
                      <div>
                        <p class="text-white  uppercase">Hint 1</p>
                        
                        </div>
                        <div class="ml-2 flex-shrink-0 flex w-1/10">
                          <button class="border text-white border-green-500 px-4 py-1 rounded-lg hover:bg-neutral-800">Unlock Hint</button>
                          </div>
                          </div>
                  
                  
                  
                  
                    </div>

                    <div class="hidden bg-gray-800 rounded-lg px-4 py-2 mt-4">


<div class="flex items-center justify-between">
  <div>
    <p class="text-white  uppercase">Hint 2</p>
    
    </div>
    <div class="ml-2 flex-shrink-0 flex w-1/10">
      <button class="border text-white border-green-500 px-4 py-1 rounded-lg hover:bg-neutral-800">Unlock Hint</button>
      </div>
      </div>




</div>

<div class="hidden bg-gray-800 rounded-lg px-4 py-2 mt-4">


<div class="flex items-center justify-between">
  <div>
    <p class="text-white  uppercase">Answer</p>
    
    </div>
    <div class="ml-2 flex-shrink-0 flex w-1/10">
      <button class="border text-white border-orange-500 px-4 py-1 rounded-lg hover:bg-neutral-800">Upgrade to PRO</button>
      </div>
      </div>




</div>
                  </div>
                  <div className="mt-6 relative flex-1 px-4 sm:px-6">
                    {/* Replace with your content */}
                    <div className="text-white">

                      <img src="https://st2.depositphotos.com/5240153/8821/v/450/depositphotos_88210338-stock-illustration-open-source-code-program-technology.jpg"></img>
                    <h1 className=" text-xl mb-2 mt-4 font-bold text-blue-500 "><i class="fas fa-book"></i> Definition:</h1>
                 
                    Open source software is software that is freely available for anyone to download and use. The source code for open source software is also available for anyone to view and modify. This allows for a community of developers to work together to improve the software.
                    <hr className="mt-4 mb-4 border-gray-700"></hr>
                    <h1 className=" text-xl mt-2 text-blue-500"><i class="far fa-lightbulb"></i> Examples:</h1>
                    <div className="mt-2 bg-neutral-800 px-3 py-2 rounded-lg">
                      <h1>
                        <span className="text-yellow-400">Linux</span> - A free and open-source operating system for computers, servers, mobile devices, and embedded systems.
                    </h1>
                    </div>
                    <div className="mt-2 bg-neutral-800 px-3 py-2 rounded-lg">
                      <h1>
                      <span className="text-yellow-400">  Mozilla Firefox</span> - A free and open-source web browser developed by the Mozilla Foundation.

                    </h1>
                    </div>
                    <div className="mt-2 bg-neutral-800 px-3 py-2 rounded-lg">
                      <h1>
                      <span className="text-yellow-400">VLC media player</span> - A free and open-source cross-platform multimedia player and framework that plays most multimedia files as well as DVDs, Audio CDs, VCDs, and various streaming protocols.
                    </h1>
                    </div>
                    <div className="mt-2 bg-neutral-800 px-3 py-2 rounded-lg">
                      <h1>
                      <span className="text-yellow-400">    Chromium</span> - A free and open-source web browser developed by Google, intended to provide a safer, faster, and more stable way for all users to experience the web.
                    </h1>
                    </div>
                    <div className="mt-2 bg-neutral-800 px-3 py-2 rounded-lg">
                      <h1>
                      <span className="text-yellow-400">    CTFGuide </span>- A free and open-source CTF learning platform.
                    </h1> 
                    </div>
                   
                   
                 </div>
                    {/* /End replace */}
               
               
                    <div className="text-white hidden">
                    <h1 className=" text-xl mb-2">How do hints work?</h1>
                    <p>Your first hint will only allow you to earn 1/2 of the points avaliable for this challenge.</p>
                    <br/>
                    <p>Your second hint will only allow you to earn 1/3 of the points avaliable for this challenge.</p>
                    <br/>
                    <p>Viewing the answer will simply mark the challenge solved for you and not award you any points. This feature is only for pro members.</p>

                 </div>

                 
          



                  </div>


               
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>

            </main>


            
            <Footer />
        </>
    )
}
