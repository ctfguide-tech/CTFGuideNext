import Head from 'next/head'

import { Footer } from '@/components/Footer'

import { StandardNav } from '@/components/StandardNav'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { Stats } from '@/components/dashboard/Stats'
import { Developer } from '@/components/dashboard/Developer'
import { Performance } from '@/components/dashboard/Performance'
import { useEffect } from 'react'
import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { SideNavContent } from '@/components/dashboard/SideNavContents'
import { QuickSettings } from '@/components/dashboard/QuickSetttings'
import { Suggest } from '@/components/dashboard/Suggest'

import { MyFriends } from '@/components/dashboard/MyFriends'
import { MyChallenges } from '@/components/dashboard/MyChallenges'
import { Likes } from '@/components/dashboard/Likes'
import { Badges } from '@/components/dashboard/Badges'


export default function Dashboard() {
  const [open, setOpen] = useState(true)



  return (



    <>
      <Head>
        <title>Dashboard - CTFGuide</title>
        <meta
          name="description"
          content="Cybersecurity made easy for everyone"
        />
        <style>
          @import url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
        </style>
      </Head>
      <StandardNav />
      <main>

        <DashboardHeader />

        <div className="flex h-screen max-w-7xl mx-auto ">
          {/* Sidebar */}
          <SideNavContent />

          {/* Main content area */}
          <div className="flex-1">
            <QuickSettings />

            <Stats />
            <Suggest />
            <Performance></Performance>


            <MyFriends />
            <MyChallenges/>
            <Likes  />
            <Badges/>


          </div>
        </div>


      </main>
      <Footer />
    </>
  )
}
