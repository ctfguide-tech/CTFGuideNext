import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { useRef } from 'react';
import { useScroll } from 'framer-motion';
import { PracticeNav } from '@/components/practice/PracticeNav';
import {
  Bars3Icon,
  BellIcon,
  XMarkIcon,
  Cog6ToothIcon,
  PencilSquareIcon,
  ShieldExclamationIcon,
  UserCircleIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
const pages = [
  { name: 'Hub', href: '../practice', current: false },
  { name: 'About CTFGuide', href: './create', current: true },
];

export default function CTFGuide() {
  const ref = useRef(null);
  const { scrollXProgress } = useScroll({ container: ref });
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
        <div className=" w-full " style={{ backgroundColor: '#212121' }}>
          <div className="mx-auto my-auto flex h-28 text-center">
            <h1 className="mx-auto my-auto text-4xl font-semibold text-white">
              Guides
            </h1>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row">
          <div className="flex w-full max-w-7xl px-8 md:mx-auto md:h-screen md:w-1/5 md:justify-center md:px-16">
            <PracticeNav />
          </div>

          <div className="w-full border-l border-gray-800 px-8 text-neutral-200 md:w-4/5 xl:px-16">
            <nav
              className="mx-auto  mt-10 flex text-center"
              aria-label="Breadcrumb"
            >
              <ol role="list" className="flex items-center space-x-4">
                <li>
                  <div>
                    <a
                      href="../dashboard"
                      className=" text-white hover:text-gray-200"
                    >
                      <i className="fas fa-home"></i>

                      <span className="sr-only">Home</span>
                    </a>
                  </div>
                </li>
                {pages.map((page) => (
                  <li key={page.name}>
                    <div className="flex items-center">
                      <svg
                        className="h-5 w-5 flex-shrink-0 text-gray-200"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                      </svg>
                      <a
                        href={page.href}
                        className="ml-4 text-sm font-medium text-gray-100 hover:text-gray-200"
                        aria-current={page.current ? 'page' : undefined}
                      >
                        {page.name}
                      </a>
                    </div>
                  </li>
                ))}
              </ol>
            </nav>
            <div className="mt-5 rounded-md px-4 py-4">
              <h1 className="mb-2 text-3xl font-bold">What is CTFGuide?</h1>
              <p className="mb-8 text-xl text-blue-500">
                Hello there, we're so happy to have you here!
              </p>
              <p className="mb-4 text-lg">
                We are CTFGuide, a platform to help you master cybersecurity
                through a personalized and community-based approach.
                <br></br>
              </p>
              <p className="mb-4 text-lg">
                We offer cloud terminals, hundreds of practice problems, and
                competitions that allow you to enhance your cybersecurity
                skills. We use AI-driven feedback to help you identify your
                strengths and weaknesses so you can improve your skills!
                <br></br>
              </p>
            </div>
            <div className="rounded-md px-4 py-4">
              <h1 className="mb-3 mt-5 text-3xl font-bold">What is "CTF"?</h1>
              <p className="mb-2 text-2xl text-blue-500">
                CTF = Capture The Flag
              </p>
              <p className="mb-8 text-lg">
                <span className="font-semibold">Capture The Flag</span> is a
                type of cybersecurity challenge problem where people use
                analytical skills, network and security tools, and computer
                environments to solve problems.<br></br>
                <br></br>
                Solving these challenges can help you get familiar with real
                world cybersecurity tools as well as build your critical
                thinking and analytical skills!
              </p>
              <p className="mb-2 text-2xl text-blue-500">
                State of the CTF World
              </p>
              <p className="mb-4 text-lg">
                A lot of people play CTFs for fun and CTFs are also a
                cornerstone of competitive cybersecurity events.
                <br></br>
                In fact, our founding team comes from this background. Our
                founder, Pranav, was a big time player in University of
                Delaware's Blue Hen CTF in 2019/2020.
              </p>
              <img className="mb-8 mt-4 w-1/6" src="../organization.png"></img>
              <p className="mb-2 text-2xl text-blue-500">Where next?</p>
              <p className="mb-4 text-lg">
                Aside from competitive cybersecurity and education, the concept
                of simulating realistic scenarios is incredibly important for
                evaluating skillsets.
                <br></br>
                <br></br>
                CTFGuide is a data-centric, simplicity-loving team of cyber
                enthusiasts and cloud engineers aiming to revolutionize skills
                evaluation in cybersecurity.
              </p>
            </div>
            <div className="rounded-md px-4 py-4">
              <h1 className="mb-3 mt-5 text-3xl font-bold">
                Our Principles 🏆
              </h1>
              <p className="mt-6 text-2xl text-blue-500">Simplicity</p>
              <p className="mb-4 text-lg text-white">
                We aim to be as beginner friendly as possible.
              </p>
              <img className="mb-8 h-16" src="../practice.png"></img>
              <p className="text-2xl text-blue-500">Accessibility</p>
              <p className="mb-4 text-lg text-white">
                We're free to use, from anywhere, forever.
              </p>
              <img className="mb-8 h-16" src="../free.png"></img>
              <p className="text-2xl text-blue-500">Data-Driven</p>
              <p className="mb-4 text-lg text-white">
                We use data to help you discover your skills and interests with
                us!
              </p>
              <img className="mb-8 h-16" src="../stats.png"></img>
            </div>
            <div className="rounded-md px-4 py-4">
              <h1 className="mb-3 mt-5 text-3xl font-bold">Get Started!</h1>
              <a href="/guides/solve" className="flex">
                <p className="mt-4 text-2xl text-blue-400 hover:text-blue-300">
                  Learn how to solve your first CTF
                </p>
                <ArrowRightIcon
                  className="ml-2 mt-5 block h-6 w-6 text-blue-400 hover:text-blue-300"
                  aria-hidden="true"
                />
              </a>
              <a href="/guides/create" className="flex">
                <p className="mt-4 text-2xl text-blue-400 hover:text-blue-300">
                  Create a CTF challenge
                </p>
                <ArrowRightIcon
                  className="ml-2 mt-5 block h-6 w-6 text-blue-400 hover:text-blue-300"
                  aria-hidden="true"
                />
              </a>
              <a href="/guides/approve" className="flex">
                <p className="mt-4 text-2xl text-blue-400 hover:text-blue-300">
                  Getting a CTF challenge approved
                </p>
                <ArrowRightIcon
                  className="ml-2 mt-5 block h-6 w-6 text-blue-400 hover:text-blue-300"
                  aria-hidden="true"
                />
              </a>
            </div>
            <p className="mt-10 rounded-md bg-neutral-800 px-4 py-2">
              Join our{' '}
              <a
                href="https://discord.gg/q3hgRBvgkX"
                className="cursor-pointer text-blue-500 hover:underline "
              >
                Discord Community
              </a>{' '}
              to get updates and chat with fellow hackers!
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
