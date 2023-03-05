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
  const [likes, setLikes] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${localStorage.getItem("userLikesUrl")}`);
      const data = await response.json();
console.log(data)    
  setLikes(data);
      likes.map((like) => (
        console.log(like.challenge.slug)
      ));

    };
    fetchData();
    setLikes([
      
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

            <h1 className='text-white text-4xl mt-5'>Likes</h1>
            {/* Fetch likes from API */}
            <div className="flex flex-col mt-5">
            {likes.map((like) => (
  <div>
    <a href={like.challengeUrl} style={{ backgroundColor: "#212121"}} className='mb-4 flex rounded-lg px-5 py-3 text-white align-center'>
      <h2 className='text-xl font-semibold align-middcenterle'>{like.challenge.title}</h2>

      <div className='ml-auto flex align-center mt-1'>
      <p> {like.challenge.category.join(", ")}</p>
    </div>
    </a>
  </div>
))}

            
                </div>

     
          </div>
        </div>


      </main>
      <Footer />
    </>
  )
}
