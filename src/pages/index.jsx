import Head from 'next/head'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Hero } from '@/components/home/Hero'
import { useState } from 'react'
import { Footer } from '@/components/Footer'
import { AboutPanel } from '@/components/home/AboutPanel'
import { FeaturesPanel } from '@/components/home/FeaturesPanel' 
import { Stats } from '@/components/home/Stats'

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


      <FeaturesPanel/>
    <AboutPanel/>
    <Stats></Stats>

      <Footer/>
    </>
  )
}
