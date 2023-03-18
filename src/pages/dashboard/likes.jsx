import Head from 'next/head'

import { Footer } from '@/components/Footer'

import { StandardNav } from '@/components/StandardNav'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { useEffect } from 'react'
import { useState } from 'react'
import { SideNavContent } from '@/components/dashboard/SideNavContents'

export default function Dashboard() {
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

            <h1 className='text-white text-4xl mt-5'>My Likes</h1>
            {/* Fetch likes from API */}

              {likes.length === 0 && (
                <div className='mt-3'>
                  <h1 className='text-white text-lg bg-neutral-800 border border-neutral-700 px-6 py-3 rounded-lg'>
                    🤔 Hmm, looks like you haven't liked a challenge yet.</h1>
                  </div>
              )}


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
