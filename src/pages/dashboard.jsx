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
      <DashboardHeader />

        <div class="grid grid-cols-2 w-full">
          <div className='w-auto'>
        <Stats />
        <div className="max-w-6xl mx-auto w-full px-9">


        <h1 className="text-xl text-white tracking-tight mt-2  mb-2  " style={{ color: "#595959" }}> YOUR BADGES</h1>
        <div
            style={{ backgroundColor: "#212121", borderColor: "#3b3a3a" }}
            className="rounded-lg  mb-4 px-6 py-5 shadow-sm border hover:border-gray-600 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
          >

            <div class="grid-cols-3 gap-y-10 grid gap-4">
              <div class="col-span-1 flex items-center space-x-3 ">
                <img src="../hacker.png" className="w-10 h-10 rounded-full" />
                <h1 className='text-white'>Hackerman</h1>
                </div>
                <div class="col-span-1 flex items-center space-x-3 ">
                <img src="../hacker.png" className="w-10 h-10 rounded-full" />
                <h1 className='text-white'>Hackerman</h1>
                </div>
                <div class="col-span-1 flex items-center space-x-3 ">
                <img src="../hacker.png" className="w-10 h-10 rounded-full" />
                <h1 className='text-white'>Hackerman</h1>
                </div>
                <div class="col-span-1 flex items-center space-x-3 ">
                <img src="../hacker.png" className="w-10 h-10 rounded-full" />
                <h1 className='text-white'>Hackerman</h1>
                </div>
                <div class="col-span-1 flex items-center space-x-3 ">
                <img src="../hacker.png" className="w-10 h-10 rounded-full" />
                <h1 className='text-white'>Hackerman</h1>
                </div>

            </div>
</div>

<h1 className="text-xl text-white tracking-tight mt-2  mb-2  " style={{ color: "#595959" }}> YOUR CHALLENGES</h1>
        <div
            style={{ backgroundColor: "#212121", borderColor: "#3b3a3a" }}
            className="items-center rounded-lg flex mb-4 px-6 py-5 shadow-sm border hover:border-gray-600 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
          >

         <h1 className='text-white text-xl '>Bit Busters!</h1>
         <div className='ml-auto text-white'>
            <p>4.5K Views ∙ 1.2K Attempts ∙ <span className='text-blue-400 cursor-pointer hover:underline'>Edit Challenge</span></p>
         </div>
</div>




          <h1 className="text-xl text-white tracking-tight mt-2  mb-2  " style={{ color: "#595959" }}> PLATFORM  FEED</h1>

          <div
            style={{ backgroundColor: "#212121", borderColor: "#3b3a3a" }}
            className="rounded-lg mb-16  px-6 py-5 shadow-sm border hover:border-gray-600 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
          >

            <h1 className="text-white text-xl">CTFGuide Winter Competition</h1>

            <p className="text-white mt-2" style={{ color: "#8c8c8c" }}>
              The CTFGuide Winter Competition is now live! Compete against other CTFGuide users to win prizes and earn points. The competition ends on January 1st, 2023. Join the competition by clicking this link: https://comp.ctfguide.com/2.
            </p>


            <p className="mt-4 text-sm italic" style={{ color: "#8c8c8c" }}>Posted by CTFGuide Team - 12/21/22</p>

          </div>
        </div>
        </div>
        <div className=''>
        <h1 className="text-xl text-white tracking-tight mt-2    " style={{ color: "#595959" }}> YOUR FRIENDS</h1>
        <div className="pr-6 mt-4">
      {people.map((person) => (
        <div
          key={person.email}
          style={{ backgroundColor: "#212121", borderColor: "#3b3a3a" }}
          className="relative flex items-center space-x-3  w-full rounded-lg mb-4 px-6 py-2 shadow-sm border hover:border-gray-600 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
    
    >
          <div className="flex-shrink-0">
            <img className="h-12 w-12 rounded-full" src={person.imageUrl} alt="" />
          </div>
          <div className="min-w-0 flex-1">
            <a href="#" className="focus:outline-none">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-lg font-medium text-white">{person.name}</p>
            </a>
          </div>
          <div className='ml-auto'>              <button className='text-sm bg-red-500 rounded-lg px-2 text-white'>Remove Friend</button>

            </div>
        </div>
      ))}
    </div>
        <h1 className="text-xl text-white tracking-tight mt-2    " style={{ color: "#595959" }}> INSIGHTS</h1>

<Performance></Performance>

          </div>
        </div>

        <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div style={{backgroundColor: "#212121"}} className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-base font-semibold leading-6 text-white">
                          Notifications
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md  text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onClick={() => setOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <p className="h-6 w-6 text-white" aria-hidden="true">✕</p>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">

                      <div className='flex flex-col'>
                        <div className='flex flex-row'>
                          <div className='flex flex-col'>
                            <p className='text-white'>CTFGuide Winter Competition</p>
                            <p className='text-white text-sm'>Posted by CTFGuide Team - 12/21/22</p>
                            </div>
                            <div className='ml-auto'>
                              <button className='text-sm bg-red-500 rounded-lg px-2 text-white'>Dismiss</button>
                              </div>

                         </div>
                         </div>
                    
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>

      </main>
      <Footer />
    </>
  )
}
