import Head from 'next/head'

import { CallToAction } from '@/components/CallToAction'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { PrimaryFeatures } from '@/components/PrimaryFeatures'
import { Schools } from '@/components/Schools'

export default function Home() {
  return (
    <>
      <Head>
        <title>CTFGuide</title>
        <meta
          name="description"
          content="Most bookkeeping software is accurate, but hard to use. We make the opposite trade-off, and hope you don’t get audited."
        />
      </Head>
      <Header />
      <main>
        <Hero />
        <Schools />
        <PrimaryFeatures />
   
     
      </main>
      <Footer />
    </>
  )
}
