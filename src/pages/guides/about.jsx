import Head from 'next/head';
import { useState, useEffect } from 'react';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { useRef } from "react";
import { motion, useScroll } from "framer-motion";
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


          <h1 className="text-3xl font-bold mb-4 mt-5">About CTFGuide</h1>
          <p className="mb-4 text-lg">
          Hello there, we're so happy to have you here! We are CTFGuide, a platform that helps you master cybersecurity through a personalized and community-based approach. Our platform offers various features like cloud terminals, hundreds of practice problems, and competitions that allow you to enhance your cybersecurity skills. We use AI-driven feedback to help you identify your strengths and weaknesses so you can improve your knowledge. Our website also provides a personalized roadmap based on your skill level and learning goals. We are proud to have reached over 50 schools, with over 10,200 attempts made on our challenges, and more than 1,346 challenges solved. Our approach emphasizes hands-on learning and community engagement, providing a dynamic and supportive environment for you to learn and grow.
            <br></br>

           
          </p>

          <p className='mt-10'>Join our <a href="https://discord.gg/q3hgRBvgkX" className='cursor-pointer text-blue-500 hover:underline '>Discord Community</a> to get updates and talk with fellow hackers.</p>
     

          </div>
        </div>
      </main>
      <Footer />


    </>
  );
}
