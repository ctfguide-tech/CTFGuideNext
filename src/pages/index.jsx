import Head from 'next/head'
import Link from 'next/link'
import { Header } from '@/components/Header'
import {Hero}  from '@/components/home/Hero'
import { useState } from 'react'
import { Footer } from '@/components/Footer'
import { AboutPanel } from '@/components/home/AboutPanel'
import { FeaturesPanel } from '@/components/home/FeaturePanel' 
import { Stats } from '@/components/home/Stats'
import { LearningPanel } from '@/components/home/LearningPanel'
import { Enterprise } from '@/components/home/Enterprise'


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

      <LearningPanel/>
    <Stats></Stats>
    <Enterprise/>

    <div className='mx-auto text-center mx-auto max-w-7xl px-6 lg:px-8 py-20' style={{backgroundColor:"#212121"}}>
    <h1 className='text-white text-4xl mx-auto text-center font-semibold mb-8'>What are you waiting for? Start hacking today!</h1>
    <a href="./register" className=' rounded-lg text-2xl px-10 py-2 bg-blue-600 mx-auto text-center text-white'>Create Account</a>
    
    </div>
  <Footer/>
    </>
  )
}
