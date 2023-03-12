import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/Button'
import { TextField } from '@/components/Fields'
import { Logo } from '@/components/Logo'
import { Alert } from '@/components/Alert'
import { Container } from '@/components/Container'
import { StandardNav } from '@/components/StandardNav'
import CreatorNavTab from '@/components/challenge/CreatorDashboardTab'
import { DocumentCheckIcon, DocumentChartBarIcon, DocumentMagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { Footer } from '@/components/Footer'

export default function Create() {

  const [activeTab, setActiveTab] = useState('created');

  function handleTabClick(tab) {
    setActiveTab(tab);
  }

  return (
    <>
        <Head>
                <title>Create  - CTFGuide</title>
                <style>
                    @import url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
                </style>
        </Head>
            <StandardNav />

    <main>
  
        <div className="flex max-w-7xl mx-auto mt-10 px-10  pb-6  my-auto rounded-2xl bg-neutral-800 text-white text-2xl space-y-6">
  <div className=" text-4xl font-bold mt-10 my-auto">Pranav’s Creator Dashboard</div>
  <div className="mt-0 flex items-center gap-x-4 ml-auto my-auto">
    <div className=''>
      <div className="px-6 py-2.5 mx-auto text-center rounded-lg bg-neutral-900">
        <div className="text-white text-2xl">1000</div>
        <div className="mt-1 text-white text-sm">Views</div>
      </div>
    </div>

    <div>
      <div className="px-6 py-2.5 mx-auto text-center rounded-lg bg-neutral-900">
        <div className="text-white text-2xl">1000</div>
        <div className="mt-1 text-white text-sm">Attempts</div>
      </div>
    </div>
   
    <div>
      <div className="px-6 py-2.5 mx-auto text-center rounded-lg bg-neutral-900">
        <div className="text-white text-2xl">1000</div>
        <div className="mt-1 text-white text-sm">Solves</div>
      </div>
    </div>
   
   
 
  </div>


  
</div>



  
<div className='flex grid grid-cols-3 gap-x-4 mt-4 mx-auto text-center mt-10'>
   
      <div className=" px-6 py-2.5 w-full mx-auto text-center rounded-lg bg-neutral-900 mx-auto text-center ">
        <div className="text-white text-2xl text-center">Unverified</div>

        </div>

        <div className="px-6 py-2.5  mx-auto text-center rounded-lg bg-neutral-900">
        <div className="text-white text-2xl">Pending Changes</div>

        </div>

        <div className="px-6 py-2.5 mx-auto text-center rounded-lg bg-neutral-900">
        <div className="text-white text-2xl">Published</div>

        </div>


    </div>

    <div className='max-w-7xl mx-auto mt-10'>
      <div className="px-6 py-2.5 mx-auto  rounded-lg bg-neutral-800 flex">
        <div className="text-white text-2xl my-auto">Challenge Name</div>
        <div className='ml-auto flex'>
          <div className="mr-2  px-6 py-2.5 mx-auto text-center  text-red-500 rounded-lg bg-neutral-900">
            Delete
            </div>
            <div className=" px-6 py-2.5 mx-auto text-center  text-white  rounded-lg bg-neutral-900">
            Edit
            </div>

        </div>
        </div>
        
    </div>
 
  
  
      </main>
      <Footer />
    </>
  )
}
