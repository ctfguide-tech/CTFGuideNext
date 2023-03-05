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

      <div className=" w-full " style={{ backgroundColor: "#212121" }}>

<div className="flex mx-auto text-center h-28 my-auto">
    <h1 className='text-4xl text-white mx-auto my-auto font-semibold'>Creator Portal</h1>
</div>



</div>

<div className='max-w-7xl mx-auto'>
    <h1 className='text-white text-3xl mt-10'>Your Challenges</h1>
    
    <h1 className="text-xl text-white tracking-tight mt-2    " style={{ color: "#595959" }}> DRAFTS</h1>
    <div style={{ backgroundColor: "#212121" }} className="mb-3 rounded-lg flex align-middle">

    <div>
    <h1 className="text-xl text-white  px-5 py-1" > Challenge 1</h1>

    </div>
      <div className='ml-auto mt-2'>
        <button className=' text-white px-1 rounded-lg'>Edit</button>
        <button className=' text-red-500 mr-4 ml-4 rounded-lg'>Delete</button>

        </div>
    </div>
    <div style={{ backgroundColor: "#212121" }} className="mb-3 rounded-lg flex align-middle">

<div>
<h1 className="text-xl text-white  px-5 py-1" > Challenge 1</h1>

</div>
  <div className='ml-auto mt-2'>
    <button className=' text-white px-1 rounded-lg'>Edit</button>
    <button className=' text-red-500 mr-4 ml-4 rounded-lg'>Delete</button>

    </div>
</div>
<div style={{ backgroundColor: "#212121" }} className="mb-3 rounded-lg flex align-middle">

<div>
<h1 className="text-xl text-white  px-5 py-1" > Challenge 1</h1>

</div>
  <div className='ml-auto mt-2'>
    <button className=' text-white px-1 rounded-lg'>Edit</button>
    <button className=' text-red-500 mr-4 ml-4 rounded-lg'>Delete</button>

    </div>
</div>
    


    <h1 className="text-xl text-white tracking-tight mt-2    " style={{ color: "#595959" }}> PENDING REVIEW</h1>
    <div style={{ backgroundColor: "#212121" }} className="mb-3 rounded-lg flex align-middle">

    <div>
    <h1 className="text-xl text-white  px-5 py-1" > Challenge 1</h1>

    </div>
      <div className='ml-auto mt-2'>
        <button className=' text-red-500 mr-4 ml-4 rounded-lg'>Cancel Review</button>

        </div>
    </div>

    <div style={{ backgroundColor: "#212121" }} className="mb-3 rounded-lg flex align-middle">

<div>
<h1 className="text-xl text-white  px-5 py-1 align-center" > Challenge 1 <span className='ml-4 bg-yellow-900 text-yellow-200 px-4  text-sm rounded-full'>Review Requested</span></h1>

</div>
  <div className='ml-auto mt-2'>
    <button className=' text-white px-1 rounded-lg'>Edit</button>
    <button className=' text-red-500 mr-4 ml-4 rounded-lg'>Delete</button>

    </div>
</div>


    <h1 className="text-xl text-white tracking-tight mt-2    " style={{ color: "#595959" }}> PUBLISHED</h1>
    <div style={{ backgroundColor: "#212121" }} className="mb-3 rounded-lg flex align-middle">

    <div>
    <h1 className="text-xl text-white  px-5 py-1" > Challenge 1</h1>

    </div>
      <div className='ml-auto mt-2'>
        <button className=' text-white px-1 rounded-lg'>Edit</button>
        <button className=' text-red-500 mr-4 ml-4 rounded-lg'>Request Deletion</button>

        </div>
    </div>
</div>


      </main>
      <Footer />
    </>
  )
}
