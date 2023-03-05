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
  let username = "laphatize"
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`http://localhost:3001/users/${username}/likes`);
      const data = await response.json();
      setLikes(data);
    };
    fetchData();
    setLikes([
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

            <h1 className='text-white text-4xl mt-5'>Likes</h1>
            {/* Fetch likes from API */}
            <div className="flex flex-col mt-5">
            {likes.map((like) => (
                  <div>
                    <div className="flex flex-row items-center justify-between text-white">
                        <h1>{like.slug}</h1>
                        <h1>{like.title}</h1>

                        </div>
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
