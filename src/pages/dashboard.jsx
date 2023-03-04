import Head from 'next/head'

import { Footer } from '@/components/Footer'

import { StandardNav } from '@/components/StandardNav'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { Stats } from '@/components/dashboard/Stats'
import { Developer } from '@/components/dashboard/Developer'
import { Performance } from '@/components/dashboard/Performance'
import { useEffect } from 'react'
import { Friends } from '@/components/dashboard/Friends'
import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import NotificationDropdown from '@/components/dashboard/NotificationDropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { SideNavContent } from '@/components/dashboard/SideNavContents'
import { QuickSettings } from '@/components/dashboard/QuickSetttings'
import { Suggest } from '@/components/dashboard/Suggest'

export default function Dashboard() {
  const [open, setOpen] = useState(true)


  /*
  Code to check if onboarding has been complete
*/
  useEffect(() => {
    fetch("api.ctfguide.com/dashboard")
      .then((res) => res.json())

      .then((data) => {
        if (data.onboardingComplete == false) {
          //      window.location.replace("http://localhost:3000/onboarding?part=1")
        }
      }
      )
    //  .catch((error) => window.location.replace("http://localhost:3000/onboarding?part=1"))
  })

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

            <Stats />
            <Suggest/>
            <QuickSettings />
            <Performance></Performance>
          </div>
        </div>


      </main>
      <Footer />
    </>
  )
}
