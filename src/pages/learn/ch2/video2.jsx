import Head from 'next/head';

import { Footer } from '@/components/Footer';
import { StandardNav } from '@/components/StandardNav';
import { useEffect, useState } from 'react';
import { LearnNav } from '@/components/learn/LearnNav';
import { MarkDone } from '@/components/learn/MarkDone';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';


export default function Dashboard() {

  const router = useRouter();
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
        <div className="mx-auto max-w-6xl">
          <h1 className="mt-4 mt-6 text-5xl font-semibold text-white">
            What is Forensics?
          </h1>
          <div className="mx-auto  flex max-w-7xl ">
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
            <div className="flex-1 text-white ">
              {/* Load in markdown from a github url */}
            <div className='bg-neutral-800/100 my-auto  align-center flex px-4 py-4 mb-4 mt-10 border-t-4 border-blue-700'>
              <motion.h1
                className="animate-slide-in-left  text-3xl font-semibold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Cyberchef 101
              </motion.h1>
              <div className='ml-auto '>

              <button onClick={() => { router.push('./preview') }} className='bg-neutral-900 hover:bg-blue-800/100 px-4 py-1 text-xl rounded-l-sm'>←</button>
              <button  className=' bg-neutral-900  px-4 py-1 text-xl rounded-l-sm' disabled>2</button>
    <button onClick={() => { router.push('./dynamic2') }}  className='mr-4 bg-neutral-900  hover:bg-blue-800 px-4 py-1 text-xl rounded-r-sm'>→</button>
            
    <MarkDone sublesson={6} section={1} href="./activity2" />

              </div>
              </div>
              <iframe
              className="text-center mx-auto rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10"
              width="1000"
                height="415"
                src="https://www.youtube.com/embed/6S0v8lIk9oA"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
              ></iframe>
  
          
              <div className='mt-10' >
                <iframe
                   width="1000"
                   height="600"
                src="https://gchq.github.io/CyberChef/"

                
                >

                </iframe>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
