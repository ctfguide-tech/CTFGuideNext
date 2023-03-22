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
                <div className="w-full mt-10 backdrop-blur-sm" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1579684288538-c76a2fab9617?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1715&q=80')" }}>
                    <div className="backdrop-blur-md flex mx-auto text-center h-28 my-auto">
                        <h1 className='text-4xl text-white mx-auto my-auto font-semibold'>What is Forensics?</h1>
                    </div>
                </div>
                    <div className="flex max-w-7xl mx-auto ">
                    {/* Sidebar */}
                    <LearnNav lessonNum={2} navElements={[{href: "./preview", title: "What is Forensics?"}, {href: "./video2", title: "Cyberchef 101"}, {href: "./activity2", title: "Mastery Task"}, {href: "./dynamic2", title: "I spy with my little eyes..."}]}/>

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
<h1 className='mt-6 text-2xl text-blue-500'>Examples <span className='text-yellow-400 hover:text-yellow-500 text-lg' onClick={() => setOpen(true)}><i class="fas fa-star"></i></span> </h1>
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
                    <Dialog.Title className="text-lg font-medium text-white text-2xl">Key Examples</Dialog.Title>
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

                 
                    <h1 className=" text-xl mt-2 text-blue-500"><i class="far fa-lightbulb"></i> Examples in the real world:</h1>
                 
                    <div className="mt-2 bg-neutral-800 px-3 py-2 rounded-lg">
                      <h1>
                      Identifying and tracing the source of a cyberattack: Forensic cybersecurity experts use various techniques such as network traffic analysis, malware analysis, and log analysis to identify and track the source of a cyberattack. For instance, if a company's system is hacked, forensic analysts may use forensic imaging tools to capture the state of the system at the time of the breach and then analyze the captured data to identify the hacker's IP address and other relevant details.
                    </h1>
                    </div>
                    <div className="mt-2 bg-neutral-800 px-3 py-2 rounded-lg">
                      <h1>
                      Recovering lost or stolen data: Forensic cybersecurity experts can help retrieve lost or stolen data by analyzing the computer or device used to store the information. They use advanced data recovery techniques to retrieve deleted files, corrupted data, and other types of lost data. For example, if a company's critical data is deleted or lost due to a cyber attack, forensic analysts can use data recovery tools to recover the lost data and help the company recover from the breach.


                    </h1>
                    </div>
                    <div className="mt-2 bg-neutral-800 px-3 py-2 rounded-lg">
                      <h1>
                      Investigating cybercrime: Forensic cybersecurity experts play a vital role in investigating cybercrime. They work closely with law enforcement agencies to collect and analyze digital evidence related to cybercrime. This evidence can be used in court to prosecute cybercriminals. For instance, forensic analysts may investigate cases of identity theft, online fraud, hacking, and other cybercrimes by collecting and analyzing evidence such as log files, email records, and social media activity.



</h1> 
                    </div>
                   
                   
                 </div>

                 <div className="text-white">

                 
<h1 className=" text-xl mt-4 text-blue-500"><i class="far fa-lightbulb"></i> Tooling Examples:</h1>
<div className="mt-2 bg-neutral-800 px-3 py-2 rounded-lg">
  <h1>
    <span className="text-yellow-400">EnCase Forensic</span> - A commercial digital forensics software suite used for forensic analysis of computer systems, mobile devices, and other electronic devices.
</h1>
</div>
<div className="mt-2 bg-neutral-800 px-3 py-2 rounded-lg">
  <h1>
    <span className="text-yellow-400">Wireshark</span> - A free and open-source packet analyzer used for network troubleshooting, analysis, software and communications protocol development, and education.
</h1>
</div>
<div className="mt-2 bg-neutral-800 px-3 py-2 rounded-lg">
  <h1>
    <span className="text-yellow-400">Sleuth Kit</span> - A collection of free and open-source tools for digital forensics investigations on Unix and Linux-based systems.
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
