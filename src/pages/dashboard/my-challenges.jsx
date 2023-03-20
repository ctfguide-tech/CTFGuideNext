import Head from 'next/head'

import { Footer } from '@/components/Footer'
import { StandardNav } from '@/components/StandardNav'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { useEffect } from 'react'
import { useState } from 'react'
import { SideNavContent } from '@/components/dashboard/SideNavContents'

export default function Dashboard() {
  const [open, setOpen] = useState(true)
  const [badges, setbadges] = useState([]);
  let username = "laphatize"
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${username}/badges`);
      const data = await response.json();
      setbadges(data);
    };
    fetchData();
    setbadges([
        {
            "slug": "scrambled_eggs",
            "title": "Content",
        }
    ])
  }, []);

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

            <h1 className='text-white text-4xl mt-5'>Your Challenges</h1>
         

     
          </div>
        </div>


      </main>
      <Footer />
    </>
  )
}
