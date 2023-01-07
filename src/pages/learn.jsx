import Head from 'next/head'

import { CallToAction } from '@/components/CallToAction'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { PrimaryFeatures } from '@/components/PrimaryFeatures'
import { StandardNav } from '@/components/StandardNav'
import { LearnCore } from '@/components/LearnCore'
export default function Dashboard() {
  return (
    <>
      <Head>
        <title>Learn - CTFGuide</title>
        <meta
          name="description"
          content="Cybersecurity made easy for everyone"
        />
      </Head>
        <StandardNav />

      <main>
      
        <LearnCore/>
      </main>
      <Footer />
    </>
  )
}
