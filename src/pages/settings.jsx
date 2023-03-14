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

export default function Dashboard() {
  const [inputText, setInputText] = useState("");

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

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
        <title>User Settings</title>
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
<div class="grid lg:grid-cols-1 md:grid-cols-2 sml:grid-cols-1 gap-4">

<div className='col-end-1 col-span-1'>
  <div style={{backgroundColor: "rgb(33, 33, 33)"}} className="mt-4 px-4 py-4 text-white rounded ">
  <div id="error" className="hidden bg-red-900 px-2 mb-4 border border-red-600 text-white rounded-lg">
    <p>Something went wrong</p>
  </div>
  <div className="items-center justify-between" >    
    <div className="space-y-4">
      <p className="text-2xl font-semibold text-center">Change your account password</p>
      <div id="error" className="hidden bg-red-500 px-4 py-1 rounded tex†-white">
        <h1 className='text-white text-center' id="errorMessage">Something went wrong.</h1>
      </div>
      <div>
      <label htmlFor="email" className="px-5 block text-sm font-medium text-gray-200">
        New Password
      </label>
      <div className="mt-1 px-4">
        <input
          style={{ backgroundColor: "#161716", borderWidth: "0px" }}
          id="newpass"
          name="username"
          type="password"
          placeholder='New Password'
          autoComplete="username"
          required
          className="text-white block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
        />
      </div>
      </div>
      <div>
        <label htmlFor="password" className="px-5 block text-sm font-medium text-gray-200">
          Confirm Password
        </label>    
      <div className="mt-1 px-4">
        <input
          style={{ backgroundColor: "#161716", borderWidth: "0px" }}
          id="confirmnewpass"
          name="password"
          type="password"
          placeholder='Confirm New Password'
          autoComplete="current-password"
          required
          className="text-white block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
        />
      </div>
      </div>
      <div className='w-1/2 mx-auto py-2'>
        <button
          type="submit"
          className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Change Password
        </button>
      </div>
    </div>
  </div>
</div>
<hr className="mt-8 mb-8 border-gray-700"></hr>
<div>
  <div style={{backgroundColor: "rgb(33, 33, 33)"}} className="mt-4 px-4 py-4 text-white rounded ">
  <div id="error" className="hidden bg-red-900 px-2 mb-4 border border-red-600 text-white rounded-lg">
    <p>Something went wrong</p>
  </div>
  <div className="items-center justify-between" >    
    <div className="space-y-4">
      <p className="text-2xl font-semibold text-center">Change your account info</p>
      <div id="error" className="hidden bg-red-500 px-4 py-1 rounded tex†-white">
        <h1 className='text-white text-center' id="errorMessage">Something went wrong.</h1>
      </div>
      <div>
        <label htmlFor="updatebio" className="px-5 block text-sm font-medium text-gray-200">
          Bio
        </label>
        <div className="mt-1 px-4">
          <input
            style={{ backgroundColor: "#161716", borderWidth: "0px" }}
            id="bio"
            name="bio"
            type="text"
            placeholder='Student & InfoSec Researcher'
            className="text-white block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>
      <div>
        <label htmlFor="updategithuburl" className="px-5 block text-sm font-medium text-gray-200">
          GitHub Handle
        </label>
        <div className="mt-1 px-4">
          <input
            style={{ backgroundColor: "#161716", borderWidth: "0px" }}
            id="githuburl"
            name="githuburl"
            type="text"
            placeholder='laphatize'
            value={inputText}
            onChange={handleInputChange}
            className="text-white block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <h2 className="px-5 mt-2 block text-xs font-medium text-gray-200">Your URL will be github.com/{inputText}</h2>
      </div>
      <div>
        <label htmlFor="updatefirstname" className="px-5 block text-sm font-medium text-gray-200">
          First Name
        </label>
        <div className="mt-1 px-4">
          <input
            style={{ backgroundColor: "#161716", borderWidth: "0px" }}
            id="first"
            name="first"
            type="text"
            placeholder='Pranav'
            className="text-white block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>
      <div>
        <label htmlFor="updatelastname" className="px-5 block text-sm font-medium text-gray-200">
          Last Name
        </label>
        <div className="mt-1 px-4">
          <input
            style={{ backgroundColor: "#161716", borderWidth: "0px" }}
            id="last"
            name="last"
            type="text"
            placeholder='Ramesh'
            className="text-white block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>
      <div>
        <label htmlFor="location" className="px-5 block text-sm font-medium text-gray-200">
          Location
        </label>
        <div className="mt-1 px-4">
          <input
            style={{ backgroundColor: "#161716", borderWidth: "0px" }}
            id="location"
            name="location"
            type="text"
            placeholder='Allentown, PA'
            className="text-white block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>
      <div className='w-1/2 mx-auto py-2'>
        <button
          type="submit"
          className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Update Profile
        </button>
      </div>
    </div>
  </div>
</div>
    
</div>
</div>
  <div className='ml-8 col-end-2 col-span-1'>
    <div style={{backgroundColor: "rgb(33, 33, 33)"}} className="mt-4 px-4 py-4 text-white rounded ">
      <div id="error" className="hidden bg-red-900 px-2 mb-4 border border-red-600 text-white rounded-lg">
        <p>Something went wrong</p>
      </div>
      <div className="space-y-4">
      <p className="text-2xl font-semibold text-center">Change Profile Picture</p>
        <div id="error" className="hidden bg-red-500 px-4 py-1 rounded tex†-white">
          <h1 className='text-white text-center' id="errorMessage">Something went wrong.</h1>
        </div>
        <p className=" text-xl font-semibold mt-4">Profile Picture</p>

        <div className="flex align-middle">
          <img className=" h-10 w-10 rounded-full align-middle border border-white" src="../../default_pfp.jpeg" alt="profile picture" />
          <input type="file" className=" ml-2 mt-1.5 text-sm align-middle"></input>
        </div>
        <button class=" bg-blue-700 px-2 py-1 rounded-lg mt-3">Save Changes</button>
      </div>
    </div>
  </div>
</div>   
</div>
      </main>
      <Footer />
    </>
  )
}
