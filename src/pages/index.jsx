import Head from 'next/head'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { useState } from 'react'
import { FeatureCard } from '@/components/FeatureCard'
import { Footer } from '@/components/Footer'
import { PricingPanel } from '@/components/PricingPanel'
export default function Home() {

  return (
    <>

      <Head>
        <title>CTFGuide</title>
        <meta
          name="description"
          content="Cybersecurity as a service."
        />
        <style>
          @import url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
        </style>
      </Head>
      <Header/>
      <Hero/>

      <FeatureCard/>
      <PricingPanel/>
      <Footer/>
    </>
  )
}
