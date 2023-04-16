import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head'
import { marked } from 'marked';
import { Footer } from '@/components/Footer';

import { StandardNav } from '@/components/StandardNav';
import { LearnNav } from '@/components/learn/LearnNav';
import { MarkDone } from '@/components/learn/MarkDone';
import { motion } from 'framer-motion';
import { Disclosure, Menu, Transition, Dialog } from '@headlessui/react';
import LessonConfig from '@/config/lessonConfigs'

const TextPage = () => {
  const router = useRouter();
  const [html, setHtml] = useState(null)
  const [contentConfig, setContentConfig] = useState(null)
  const [error, setError] = useState(null)
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        // Actual Content
        const url = `https://raw.githubusercontent.com/ctfguide-tech/CTFGuideLessons/main/${router.query.lesson}/text/${router.query.page}.html`
        // Config Content
        // const configurl = `https://raw.githubusercontent.com/ctfguide-tech/CTFGuideLessons/main/${router.query.lesson}/config.json`
        const response = await fetch(url)
        // const configresponse = await fetch(configurl)
        const htmlcontent = await response.text()
        // const configcontent = await configresponse.json()
        setHtml(htmlcontent)
        // setContentConfig(configcontent)
        setContentConfig(LessonConfig[parseInt(router.query.lesson) - 1])
      } catch (error) {
        setError(error)
      }
    }
    fetchData()
  }, [router.query.lesson, router.query.page])

  if (error) {
    return <div>Error: {error.message}</div>
  }

  if (!html) {
    return <div>Loading...</div>
  }

  if (!contentConfig) {
    return <div>Loading...</div>
  }

  return (
    <>
      <Head>
        <title>Lesson {router.query.lesson} Page {router.query.page} - CTFGuide</title>
        <style>
          @import
          url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
        </style>
      </Head>
      <StandardNav />
      <main>
        <div className="mx-auto max-w-6xl ">
          <div
            className=" mt-10 w-full backdrop-blur-lg"
            style={{
              backgroundImage:
                `url(${contentConfig.bgimage})`,
            }}
          >
            <div className="mx-auto my-auto flex h-28 text-center backdrop-blur-md">
              <h1 className="mx-auto my-auto text-4xl font-semibold text-white">
                {contentConfig.title}
              </h1>
            </div>
          </div>
          <div className="mx-auto flex max-w-7xl ">
            {/* Sidebar */}
            <LearnNav
              lessonNum={contentConfig.lessonNum}
              navElements={[
                { href: contentConfig.navHrefs[0], title: contentConfig.navTitles[0] },
                { href: contentConfig.navHrefs[1], title: contentConfig.navTitles[1] },
                { href: contentConfig.navHrefs[2], title: contentConfig.navTitles[2] },
                { href: contentConfig.navHrefs[3], title: contentConfig.navTitles[3] },
              ]}
            />

            {/* Main content area, Load from content repo */}
            <div className="text-white" dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

export default TextPage;
