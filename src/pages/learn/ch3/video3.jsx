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
        <div className="mx-auto max-w-6xl">
          <h1 className="mt-4 mt-6 text-5xl font-semibold text-white">
            Cryptography!
          </h1>
          <div className="mx-auto  flex max-w-7xl ">
            {/* Sidebar */}
            <LearnNav
              lessonNum={3}
              navElements={[
                { href: './preview', title: 'Cryptography!' },
                { href: './video3', title: 'PKI Introduction' },
                { href: './activity3', title: 'Knees Deep into TLS' },
                { href: './dynamic3', title: 'Password Dump' },
              ]}
            />

            {/* Main content area */}
            <div className="flex-1 text-white ">
              {/* Load in markdown from a github url */}
              <iframe
                className="mx-auto mt-10"
                width="800"
                height="415"
                src="https://www.youtube.com/watch?v=t0F7fe5Alwg"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
              ></iframe>
              <div className="flex">
                <motion.h1
                  className="animate-slide-in-right mt-4 ml-12 mr-6 text-3xl font-semibold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  PKI Introduction
                </motion.h1>
              </div>
              <h1 className=" ml-12 text-lg font-semibold text-blue-500">
                @CTFGuideTeam
              </h1>
              <div className="ml-6 mt-2">
                <MarkDone sublesson={10} section={1} href="./activity3" />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
