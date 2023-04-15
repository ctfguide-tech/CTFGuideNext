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

const TextPage = () => {
  const router = useRouter();
  const [markdown, setMarkdown] = useState(null)
  const [html, setHtml] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const lesson = router.query.lesson;
        const page = router.query.page;
        const url = `https://raw.githubusercontent.com/ctfguide-tech/CTFGuideLessons/main/${router.query.lesson}/text/${router.query.page}.html`
        const response = await fetch(url)
        const markdown = await response.text()
        // setMarkdown(markdown)
        setHtml(markdown)
      } catch (error) {
        setError(error)
      }
    }
    fetchData()
  }, [router.query.lesson, router.query.page])

  useEffect(() => {
    async function parseMarkdown() {
      if (markdown) {
        try {
          const html = marked.parse(markdown)
          setHtml(html)
        } catch (error) {
          setError(error)
        }
      }
    }
    // parseMarkdown()
  }, [markdown])

  if (error) {
    return <div>Error: {error.message}</div>
  }

  if (!markdown) {
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
      <div className="text-white" dangerouslySetInnerHTML={{ __html: html }} />
      <p className="text-white">{router.query.lesson} {router.query.page}</p>
    </>
  )
}

export default TextPage;
