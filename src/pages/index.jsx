import Head from 'next/head'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Hero } from '@/components/home/Hero'
import { useState } from 'react'
import { FeatureCard } from '@/components/home/FeatureCard'
import { Footer } from '@/components/Footer'
import { PricingPanel } from '@/components/home/PricingPanel'
export default function Home() {
  const features = [
    {
      name: 'Practice Problems',
      description:
        'Get access to over hundereds of verified community uploaded practice problems.',
    },
    {
      name: 'Huge Community',
      description:
        'Talk about the latest cybersecurity news with fellow hackers.',
    },
   
  ]
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

      <div className="relative overflow-hidden pt-24 sm:pt-32 lg:pt-40">
      <div className="mx-auto max-w-md px-6 text-center sm:max-w-3xl lg:max-w-7xl lg:px-8">
        <div>
          <h2 className="text-xl font-semibold text-blue-600 ">Learn ethical hacking no matter where you are.</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl">Don't have Linux? No problem.</p>
          <p className="mx-auto mt-5 max-w-prose text-xl text-gray-100">
            Solve challenges in the cloud with our terminal. No more waiting for terminal instances to spin up. It's always ready to go.
          </p>
        </div>
        <div className="mt-12 -mb-10 sm:-mb-24 lg:-mb-80">
          <p className='text-left w-full bg-black text-white '><span className='px-2 text-sm'><b>Username:</b> <span id="username" className='text-yellow-400'>ctfguide_demo1</span> - <b>Password: </b><span className='text-yellow-400'>pASS$$  </span></span></p>
          <iframe src="https://terminal.ctfguide.com/wetty" height="600" className='w-full px-2 bg-black'></iframe>
        </div>
      </div>
    </div>
   
    <div className="">
      <div className="mx-auto max-w-7xl py-24 px-6 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Features</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-gray-100">
           We've got everything to make you a pro at ethical hacking.
          </p>
        </div>
        <dl className="mt-20 grid grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8">
          {features.map((feature) => (
            <div key={feature.name} className="relative">
              <dt>
                <p className="ml-10 text-lg font-semibold leading-8 text-white">{feature.name}</p>
              </dt>
              <dd className="mt-2 ml-10 text-base leading-7 text-gray-300">{feature.description}</dd>
            </div> 
          ))}
        </dl>
      </div>
    </div>
      <Footer/>
    </>
  )
}
