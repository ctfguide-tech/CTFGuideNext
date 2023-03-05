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
                <title>Practice  - CTFGuide</title>
                <style>
                    @import url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
                </style>
        </Head>
            <StandardNav />

    <main>
    <div className=" w-full " style={{ backgroundColor: "#212121" }}>
        <div className="flex mx-auto text-center h-28 my-auto">
            <h1 className='text-4xl text-white mx-auto my-auto font-semibold'>Create</h1>
        </div>
    </div>
    <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/3 bg-gray-800 p-4">
            <h2 className="text-lg font-semibold text-white">Stats Dashboard</h2>
            {/* Dashboard content goes here */}
          </div>
          <div className="w-full md:w-2/3 p-4">
            <h2 className="text-lg font-semibold text-white">{activeTab === 'created' ? 'Created Challenges' : activeTab === 'unverified' ? 'Unverified Challenges' : 'Pending Changes'}</h2>
            <CreatorNavTab activeTab={activeTab}></CreatorNavTab>
          </div>
        </div>
    <div className="flex max-w-6xl mx-auto mt-10">
                    <div className="w-2/3  max-w-xs flex-row-reverse">
            <div className='max-w-6xl mx-auto text-left mt-6'>
                    <h1 className='text-white text-3xl font-semibold mb-3'> My Challenges </h1>
            </div>
        <div className="flex items-center mt-1">
              <button
                 style={{ backgroundColor: "#212121", borderWidth: "0px" }}
                 onClick={() => handleTabClick('created')}
                 isActive={activeTab === 'created'}
                 type="button"
                 className="mr-2 inline-flex justify-center rounded-md border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
               >
                <DocumentCheckIcon className="w-5 h-5 text-white" aria-hidden="true" />
                <span>&nbsp;Created</span>
              </button>
              <button
                 style={{ backgroundColor: "#212121", borderWidth: "0px" }}
                 onClick={() => handleTabClick('unverified')}
                 isActive={activeTab === 'unverified'}
                 type="button"
                 className="mr-2 inline-flex justify-center rounded-md border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
               >
                <DocumentChartBarIcon className="w-5 h-5 text-white" aria-hidden="true" />
                <span>&nbsp;Unverified</span>
              </button>
              <button
                 style={{ backgroundColor: "#212121", borderWidth: "0px" }}
                 onClick={() => handleTabClick('pending changes')}
                 isActive={activeTab === 'pendingChanges'}
                 type="button"
                 className="mr-2 inline-flex justify-center rounded-md border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
               >
                <DocumentMagnifyingGlassIcon className="w-5 h-5 text-white" aria-hidden="true" />
                <span>&nbsp;Pending</span>
              </button>
          </div>
        </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
