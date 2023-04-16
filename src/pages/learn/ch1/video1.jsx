import Head from 'next/head';

import { Footer } from '@/components/Footer';

import { StandardNav } from '@/components/StandardNav';
import { useEffect, useState } from 'react';
import { LearnNav } from '@/components/learn/LearnNav';
import { MarkDone } from '@/components/learn/MarkDone';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const [open, setOpen] = useState(true);
  const [markdown, setMarkdown] = useState('');
  const [terminalUsername, setTerminalUsername] = useState('...');
  const [terminalPassword, setTerminalPassword] = useState('...');

  // Start Terminal
  useEffect(() => {

    const fetchTerminalData = async () => {
      try {
        const endPoint = 'https://terminal-gateway.ctfguide.com/createvm';
        const requestOptions = {
          method: 'GET',
        };
        const response = await fetch(endPoint, requestOptions);
        const result = await response.json();

        setTerminalUsername(result.username);
        setTerminalPassword(result.password);
      } catch (err) {
        console.log(err);
        setTerminalUsername('Something went wrong.');
        setTerminalPassword('Something went wrong.');
      }
    };

    try {
      fetchTerminalData();
    } catch (err) {
      console.log(err);
      setTerminalUsername('Something went wrong.');
      setTerminalPassword('Something went wrong.');
    }
  }, []);
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
  const router = useRouter();


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
          <div className="mx-auto  flex max-w-7xl ">
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
            <div className="flex-1 text-white ">
              {/* Load in markdown from a github url */}
              <div className='bg-neutral-800/100 my-auto  align-center flex px-4 py-4 mb-4 mt-10 border-t-4 border-blue-700'>
              <motion.h1
                className="animate-slide-in-left  text-3xl font-semibold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Command Basics
              </motion.h1>
              <div className='ml-auto '>

              <button onClick={() => { router.push('./preview') }} className='bg-neutral-900 hover:bg-blue-800/100 px-4 py-1 text-xl rounded-l-sm'>←</button>
              <button  className=' bg-neutral-900  px-4 py-1 text-xl rounded-l-sm' disabled>2</button>
    <button onClick={() => { router.push('./activity1') }}  className='mr-4 bg-neutral-900  hover:bg-blue-800 px-4 py-1 text-xl rounded-r-sm'>→</button>
            
                <MarkDone sublesson={2} section={1} href="./activity1" />

              </div>
              </div>
              <iframe
              className="text-center mx-auto rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10"
              width="1000"
                height="415"
                src="https://www.youtube.com/embed/D7sp_vv9db4"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
              ></iframe>

<div id="terminal" className=" mt-6 ">
            <p className="hint mb-2 text-gray-400">
              <span className="text-white ">Terminal (Beta)</span> Login as{' '}
              <span className="text-yellow-400">{terminalUsername}</span> using
              the password{' '}
              <span className="text-yellow-400">{terminalPassword}</span>
         
            </p>
            <iframe
              className="w-full"
              height="500"
              src="https://terminal.ctfguide.com/wetty/ssh/root?pass="
            ></iframe>
          </div>
       
           
              <div className="ml-6 mt-2">
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
