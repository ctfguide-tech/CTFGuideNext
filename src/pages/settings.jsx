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
const people = [
  {
    name: 'Leslie Alexander',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Leslie Alexander',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    name: 'Leslie Alexander',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  // More people...
]



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
  
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <h1 className='text-4xl text-white mt-4'>Settings</h1>

        { /* Code for changing password / account settings view*/}
        <div class="grid lg:grid-cols-2 md:grid-cols-2 sml:grid-cols-1 gap-4">


<div style={{backgroundColor: "rgb(33, 33, 33)"}}  className=" mt-4  px-4 py-4 text-white rounded ">
  <div id="error" className="hidden bg-red-900 px-2 mb-4 border border-red-600 text-white rounded-lg">
    <p>Something went wrong</p>
  </div>
  <div className=" items-center justify-between" >
    <h1 className="text-2xl w-full font-bold"><i class="fas fa-shield-alt"></i> Account Settings</h1>
    <p className="text-xl font-semibold">Change your account password</p>
    <input type="password" id="newpass" placeholder="New Password" className=" mt-3 border border-gray-600  px-2 py-1 rounded-lg w-full" />

    <input type="password" id="confirmnewpass" placeholder="Confirm New Password" className="mt-3 border border-gray-600  px-2 py-1 rounded-lg w-full" />
    <button  class="bg-blue-700 px-2 py-1 rounded-lg mt-3">Change Password</button>
    <p className="text-xl font-semibold mt-4 hidden">Change your username</p>
    <input placeholder="Loading..." id="usernamechange" className="hidden mt-3 border border-gray-600  px-2 py-1 rounded-lg w-full" />

    <p className="hidden text-xl font-semibold mt-4">Set a biography</p>
    <textarea placeholder="People can see your biography when clicking on your name" className="hidden mt-3 border border-gray-600  px-2 py-1 rounded-lg w-full">
    </textarea>

    <p className="hidden text-xl font-semibold mt-4">Profile Picture</p>

    <div className="flex align-middle">
      <img className="hidden h-10 w-10 rounded-full align-middle border border-white" src="../../defaultpfp.png" alt="profile picture" />
      <input type="file" className="hidden ml-2 mt-1.5 text-sm align-middle"></input>
    </div>
    <button class="hidden bg-blue-700 px-2 py-1 rounded-lg mt-3">Save Changes</button>

  </div>

</div>

</div>
    
</div>
      </main>
      <Footer />
    </>
  )
}
