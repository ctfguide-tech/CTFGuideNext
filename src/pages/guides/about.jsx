import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { useRef } from "react";
import { useScroll } from "framer-motion";
import { PracticeNav } from '@/components/practice/PracticeNav';
const pages = [
  { name: 'Hub', href: '../practice', current: false },
  { name: "About CTFGuide", href: './create', current: true },
]

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
          @import url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
        </style>
      </Head>
      <StandardNav />

      <main>
        <div className=" w-full " style={{ backgroundColor: "#212121" }}>
          <div className="flex mx-auto text-center h-28 my-auto">
            <h1 className='text-4xl text-white mx-auto my-auto font-semibold'>Guides</h1>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row">
          <div className="w-full md:w-1/5 flex md:h-screen max-w-7xl md:mx-auto md:justify-center px-8 md:px-16">
            <PracticeNav />
          </div>

          <div className='w-full md:w-4/5 px-8 xl:px-16 border-l border-gray-800 text-neutral-200'>

          <nav className="flex  mx-auto text-center mt-10" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-4">
        <li>
          <div>
            <a href="../dashboard" className=" text-white hover:text-gray-200">
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
          <div className='px-4 py-4 rounded-md mt-5'>
            <h1 className="text-3xl font-bold mb-2">What is CTFGuide?</h1>
            <p className="mb-4 text-xl text-blue-500">
              Hello there, we're so happy to have you here! 
            </p>
            <p className="mb-4 text-lg">
              We are CTFGuide, a platform that helps you master cybersecurity through a personalized and community-based approach. 
              <br></br>
            </p>
            <p className="mb-4 text-lg">
              We offer cloud terminals, hundreds of practice problems, and competitions that allow you to enhance your cybersecurity skills. We use AI-driven feedback to help you identify your strengths and weaknesses so you can improve your skills!
              <br></br>
            </p>
          </div>
          <div className='px-4 py-4 rounded-md'>
            <h1 className="text-3xl font-bold mb-3 mt-5">What is "CTF"?</h1>
              <p className="mb-2 text-2xl text-blue-500">
                CTF = Capture The Flag
              </p>
              <p className="mb-4 text-lg">
                Capture The Flag is type of cybersecurity challenge problem where people use analytical skills, network and security tools, and computer environments to solve problems.
                <br></br>
              </p>
              <p className="mb-4 text-lg">
                Solving these challenges can help you get familiar with real world cybersecurity tools as well as build your critical thinking and analytical skills!
                <br></br>
              </p>
              <p className="mb-2 text-2xl text-blue-500">
                State of the CTF World
              </p>
              <p className="mb-4 text-lg">
                A lot of people play CTFs for fun and CTFs are also a cornerstone of competitive cybersecurity events.
                <br></br>
                <br></br>
                In fact, our founding team comes from this background. Our founder, Pranav, was a big time player in University of Delaware's Blue Hen CTF in 2019/2020.
              </p>
              <p className="mb-2 text-2xl text-blue-500">
                Where next?
              </p>
              <p className="mb-4 text-lg">
                Aside from being fun and games, the basic concept of simulating realistic scenarios is incredibly important for evaluating skillsets.
                <br></br>
                <br></br>
                CTFGuide is a data-centric, simplicity-loving team of cyber enthusiasts and cloud engineers aiming to revolutionize these foundational ideas.
              </p>
          </div>
          <div className='px-4 py-4 rounded-md'>
            <h1 className="text-3xl font-bold mb-3 mt-5">Our Principles 🏆</h1>
              <p className="text-2xl text-blue-500">
                Simplicity
              </p>
              <p className="mb-4 text-lg text-white">
                We aim to be as beginner friendly as possible.
              </p>
              <p className="text-2xl text-blue-500">
                Accessibility
              </p>
              <p className="mb-4 text-lg text-white">
                We're free to use, from anywhere, forever.
              </p>
              <p className="text-2xl text-blue-500">
                Data-Driven
              </p>
              <p className="mb-4 text-lg text-white">
                We help everyone discover their strengths and weaknesses. Discover your cybersecurity skills and interests with us!
              </p>
            </div>
          <p className='bg-neutral-800 px-4 py-2 rounded-md mt-10'>Join our <a href="https://discord.gg/q3hgRBvgkX" className='cursor-pointer text-blue-500 hover:underline '>Discord Community</a> to get updates and chat with fellow hackers!</p>
          </div>
        </div>
      </main>
      <Footer />


    </>
  );
}
