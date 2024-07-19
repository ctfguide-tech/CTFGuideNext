import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { useRef } from 'react';
import { useScroll } from 'framer-motion';
import { PracticeNav } from '@/components/practice/PracticeNav';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

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
        <title>Welcome - CTFGuide</title>
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

        <div className="max-w-6xl mx-auto mt-10">


          <div className="w-full  text-neutral-200 ">
     
          <iframe className="w-full h-[50vh]" src="https://www.youtube.com/embed/HrerCAcOblc?si=YH6IHAIA5rwUwHT9" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        
          <div className=" w-full px-8 py-6  flex" style={{ backgroundColor: '#212121' }}>
           

           <div className=" ">
           <h1 className=" text-3xl font-semibold text-white">
             <i className="fa fa-play-circle"></i> Welcome to CTFGuide
            </h1>
            <p className="text-white">
              CTFGuide is a platform for learning and practicing cybersecurity.
            </p>
 </div>

 <div className="ml-auto">
    <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1">Mark as complete</button>
 </div>
        </div>

<div className="px-8 py-6">
        <h1 className="text-2xl font-semibold text-white">Text Summary</h1>
        <p className="mb-4 text-lg">
                Welcome to CTFGuide, a platform to help you master cybersecurity
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


          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}