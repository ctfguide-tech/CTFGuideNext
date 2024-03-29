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
  const [markdown, setMarkdown] = useState('');
  const router = useRouter();

  return (
    <>
      <Head>
        <title>What is Forensics? - CTFGuide</title>
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
                Forensics
              </h1>
            </div>
          </div>
          <div className="mx-auto flex max-w-7xl ">
            {/* Sidebar */}
            <LearnNav
              lessonNum={2}
              navElements={[
                { href: './preview', title: 'What is Forensics?' },
                { href: './video2', title: 'Cyberchef 101' },
                { href: './activity2', title: 'Mastery Task' },
                { href: './dynamic2', title: 'I spy with my little eyes...' },
              ]}
            />

            {/* Main content area */}
            <div className="text-white">
              {/* Load in markdown from a github url */}
              <div className='bg-neutral-800/100 my-auto  align-center flex px-4 py-4 mb-4 mt-10 border-t-4 border-blue-700'>
              <motion.h1
                className="animate-slide-in-left  text-3xl font-semibold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                What is Forensics
              </motion.h1>
              <div className='ml-auto '>
              <button  onClick={() => { router.push('../learn') }} className='bg-neutral-900 hover:bg-blue-800/100 px-4 py-1 text-xl rounded-l-sm'>←</button>
              <button className=' bg-neutral-900  px-4 py-1 text-xl rounded-l-sm' disabled>1</button>

                <button  onClick={() => { router.push('./video2') }} className='mr-4 bg-neutral-900  hover:bg-blue-800 px-4 py-1 text-xl rounded-r-sm'>→</button>
             
                <MarkDone sublesson={5} section={1} href={'./video2'} />

              </div>
              </div>
              <h1 className="mt-2 text-2xl text-blue-500">Intro: Forensics</h1>
              Forensics, in the context of cybersecurity, refers to the process
              of analyzing digital data in order to gather evidence or
              intelligence that can be used in investigations or legal
              proceedings. In particular, forensics in Capture The Flag (CTF)
              competitions involves the examination and analysis of a given set
              of digital artifacts or files to extract hidden information or
              uncover clues that will help the participant solve a particular
              challenge or task. CTF forensics challenges may take a variety of
              forms, such as file or disk image analysis, network packet
              analysis, memory dump analysis, or even steganography. In each
              case, participants are typically given a set of artifacts or data
              to work with, and must use their knowledge of digital forensics
              techniques to uncover hidden information or identify patterns that
              will lead them to the solution.
              <h1 className="mt-6 text-2xl text-blue-500">
                Examples{' '}
                <span
                  className="text-lg text-yellow-400 hover:text-yellow-500"
                  onClick={() => setOpen(true)}
                >
                  <i class="fas fa-star"></i>
                </span>{' '}
              </h1>
              For example, in a file analysis challenge, participants may be
              given a file with a specific file format and asked to extract
              certain information from it. They may use various tools and
              techniques to analyze the file structure, examine metadata, or
              search for hidden data that may be encoded within the file. In a
              network packet analysis challenge, participants may be given a
              network capture file and asked to identify specific packets or
              extract certain information from them, such as passwords or IP
              addresses. To succeed in CTF forensics challenges, participants
              need a strong understanding of digital forensics principles and
              techniques, as well as proficiency in using a range of tools and
              software for analyzing digital data. Some of the most commonly
              used tools in CTF forensics challenges include hex editors,
              forensic analysis software, network analysis tools, and
              steganography detection software. Overall, CTF forensics
              challenges offer an exciting and challenging way to test and
              develop skills in digital forensics and cybersecurity, and provide
              valuable experience for those pursuing careers in these fields.
              <img
                width="300"
                className="mx-auto mt-10 text-center"
                src="https://github.com/ctfguide-tech/CTFGuideNext/blob/main/public/solve1.png?raw=true"
              ></img>
              <div className="mt-6 ml-6">
              </div>
            </div>
          </div>
        </div>

        <Transition.Root
          show={open}
          as={Fragment}
          style={{ fontFamily: 'Poppins, sans-serif', overflow: 'hidden' }}
          className="test"
        >
          <Dialog
            as="div"
            className="fixed inset-0 overflow-hidden"
            onClose={setOpen}
          >
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
              <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
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
                      <div className="absolute top-0 left-0 -ml-8 flex pt-4 pr-2 sm:-ml-10 sm:pr-4">
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
                    <div className="test flex h-full flex-col overflow-y-scroll border border-gray-800 bg-white bg-gradient-to-br from-neutral-800 to-black py-6 shadow-xl">
                      <div className="px-4 sm:px-6">
                        <Dialog.Title className="text-lg text-2xl font-medium text-white">
                          Key Examples
                        </Dialog.Title>
                        <div class="mt-4 hidden rounded-lg bg-gray-800 px-4 py-2">
                          <div class="flex items-center justify-between">
                            <div>
                              <p class="uppercase  text-white">Hint 1</p>
                            </div>
                            <div class="w-1/10 ml-2 flex flex-shrink-0">
                              <button class="rounded-lg border border-green-500 px-4 py-1 text-white hover:bg-neutral-800">
                                Unlock Hint
                              </button>
                            </div>
                          </div>
                        </div>

                        <div class="mt-4 hidden rounded-lg bg-gray-800 px-4 py-2">
                          <div class="flex items-center justify-between">
                            <div>
                              <p class="uppercase  text-white">Hint 2</p>
                            </div>
                            <div class="w-1/10 ml-2 flex flex-shrink-0">
                              <button class="rounded-lg border border-green-500 px-4 py-1 text-white hover:bg-neutral-800">
                                Unlock Hint
                              </button>
                            </div>
                          </div>
                        </div>

                        <div class="mt-4 hidden rounded-lg bg-gray-800 px-4 py-2">
                          <div class="flex items-center justify-between">
                            <div>
                              <p class="uppercase  text-white">Answer</p>
                            </div>
                            <div class="w-1/10 ml-2 flex flex-shrink-0">
                              <button class="rounded-lg border border-orange-500 px-4 py-1 text-white hover:bg-neutral-800">
                                Upgrade to PRO
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        {/* Replace with your content */}
                        <div className="text-white">
                          <h1 className=" mt-2 text-xl text-blue-500">
                            <i class="far fa-lightbulb"></i> Examples in the
                            real world:
                          </h1>

                          <div className="mt-2 rounded-lg bg-neutral-800 px-3 py-2">
                            <h1>
                              Identifying and tracing the source of a
                              cyberattack: Forensic cybersecurity experts use
                              various techniques such as network traffic
                              analysis, malware analysis, and log analysis to
                              identify and track the source of a cyberattack.
                              For instance, if a company's system is hacked,
                              forensic analysts may use forensic imaging tools
                              to capture the state of the system at the time of
                              the breach and then analyze the captured data to
                              identify the hacker's IP address and other
                              relevant details.
                            </h1>
                          </div>
                          <div className="mt-2 rounded-lg bg-neutral-800 px-3 py-2">
                            <h1>
                              Recovering lost or stolen data: Forensic
                              cybersecurity experts can help retrieve lost or
                              stolen data by analyzing the computer or device
                              used to store the information. They use advanced
                              data recovery techniques to retrieve deleted
                              files, corrupted data, and other types of lost
                              data. For example, if a company's critical data is
                              deleted or lost due to a cyber attack, forensic
                              analysts can use data recovery tools to recover
                              the lost data and help the company recover from
                              the breach.
                            </h1>
                          </div>
                          <div className="mt-2 rounded-lg bg-neutral-800 px-3 py-2">
                            <h1>
                              Investigating cybercrime: Forensic cybersecurity
                              experts play a vital role in investigating
                              cybercrime. They work closely with law enforcement
                              agencies to collect and analyze digital evidence
                              related to cybercrime. This evidence can be used
                              in court to prosecute cybercriminals. For
                              instance, forensic analysts may investigate cases
                              of identity theft, online fraud, hacking, and
                              other cybercrimes by collecting and analyzing
                              evidence such as log files, email records, and
                              social media activity.
                            </h1>
                          </div>
                        </div>

                        <div className="text-white">
                          <h1 className=" mt-4 text-xl text-blue-500">
                            <i class="far fa-lightbulb"></i> Tooling Examples:
                          </h1>
                          <div className="mt-2 rounded-lg bg-neutral-800 px-3 py-2">
                            <h1>
                              <span className="text-yellow-400">
                                EnCase Forensic
                              </span>{' '}
                              - A commercial digital forensics software suite
                              used for forensic analysis of computer systems,
                              mobile devices, and other electronic devices.
                            </h1>
                          </div>
                          <div className="mt-2 rounded-lg bg-neutral-800 px-3 py-2">
                            <h1>
                              <span className="text-yellow-400">Wireshark</span>{' '}
                              - A free and open-source packet analyzer used for
                              network troubleshooting, analysis, software and
                              communications protocol development, and
                              education.
                            </h1>
                          </div>
                          <div className="mt-2 rounded-lg bg-neutral-800 px-3 py-2">
                            <h1>
                              <span className="text-yellow-400">
                                Sleuth Kit
                              </span>{' '}
                              - A collection of free and open-source tools for
                              digital forensics investigations on Unix and
                              Linux-based systems.
                            </h1>
                          </div>
                        </div>

                        {/* /End replace */}

                        <div className="hidden text-white">
                          <h1 className=" mb-2 text-xl">How do hints work?</h1>
                          <p>
                            Your first hint will only allow you to earn 1/2 of
                            the points avaliable for this challenge.
                          </p>
                          <br />
                          <p>
                            Your second hint will only allow you to earn 1/3 of
                            the points avaliable for this challenge.
                          </p>
                          <br />
                          <p>
                            Viewing the answer will simply mark the challenge
                            solved for you and not award you any points. This
                            feature is only for pro members.
                          </p>
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
  );
}
