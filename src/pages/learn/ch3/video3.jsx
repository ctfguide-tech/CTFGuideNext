import Head from 'next/head';

import { Footer } from '@/components/Footer';
import { StandardNav } from '@/components/StandardNav';
import { useEffect, useState } from 'react';
import { LearnNav } from '@/components/learn/LearnNav';
import { MarkDone } from '@/components/learn/MarkDone';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [open, setOpen] = useState(true);
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        'https://gist.githubusercontent.com/rt2zz/e0a1d6ab2682d2c47746950b84c0b6ee/raw/83b8b4814c3417111b9b9bef86a552608506603e/markdown-sample.md'
      );
      const data = await response.text();
      setMarkdown(data);
    };
    fetchData();
  }, []);

  return (
    <>
      <Head>
        <title>Cryptography! - CTFGuide</title>
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
                Cryptography
              </h1>
            </div>
            <div className='text-center text-white bg-yellow-800 py-2'>
                <h1>This lesson will temporarily serve a general overview until our content creation team finishes the new/updated lesson. We aren't exactly pleased with the current state of this learning module.</h1>
            </div>
          </div>
          <div className="mx-auto  flex max-w-7xl ">
            {/* Sidebar */}
            <LearnNav
              lessonNum={3}
              navElements={[
                { href: './preview', title: 'Introduction to Cryptography' },
                { href: './video3', title: 'Cryptography Outline' },
                { href: './activity3', title: 'Mastery Task' },
                { href: './dynamic3', title: 'Password Dump' },
              ]}
            />

            {/* Main content area */}
            <div className="flex-1 text-white ">
              {/* Load in markdown from a github url */}

              <div className='bg-neutral-800/100 my-auto  align-center flex px-4 py-4 mb-4 mt-10 border-t-4 border-blue-700'>
              <motion.h1
                className="animate-slide-in-left  text-3xl font-semibold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Cryptography Outline
              </motion.h1>
              <div className='ml-auto '>

              <button onClick={() => { router.push('./preview') }} className='bg-neutral-900 hover:bg-blue-800/100 px-4 py-1 text-xl rounded-l-sm'>←</button>
              <button  className=' bg-neutral-900  px-4 py-1 text-xl rounded-l-sm' disabled>2</button>
    <button onClick={() => { router.push('./dynamic3') }}  className='mr-4 bg-neutral-900  hover:bg-blue-800 px-4 py-1 text-xl rounded-r-sm'>→</button>
            
    <MarkDone sublesson={10} section={1} href="./activity3" />


              </div>
              </div>
              <iframe
           

className="text-center mx-auto rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10"
              width="1000"
                height="415"
                src="https://www.youtube.com/embed/fX433eTDVVA?start=645"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
              ></iframe>

  
              <p className='mt-4'>This is a video sourced from <a href="https://infosecucalgary.ca/" className='text-blue-500 font-semibold'>University of Calgary's Information Security Club</a>.</p>


            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
