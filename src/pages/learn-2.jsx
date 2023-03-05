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
import { ProgressBar  } from '@tremor/react'

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
                <title>Learn - CTFGuide</title>
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
                <div className='max-w-6xl mx-auto'>
                    <h1 className='text-white text-5xl mt-4 font-semibold mt-6'>Learn</h1>

                    <h1 className='text-white text-2xl mt-4 font-semibold mt-6'>Learning Modules</h1>
                    <div className="grid grid-cols-2 mt-4 gap-4">
                        <a href="../learn" className='mt-1 py-6 mt-4 rounded-lg' style={{backgroundColor:"#212121"}}>
                            <h1 className='text-white text-2xl mx-auto text-center'>Linux Basics</h1>
                            <div className='px-10 mt-4 text-white'>
                            <ProgressBar percentageValue={45} color="blue" tooltip={true} marginTop="mt-2" />
                            <p1 className="mt-4">43%</p1>
                            </div>
                        </a>
                        <div className='mt-1 py-6 mt-4 rounded-lg' style={{backgroundColor:"#212121"}}>
                            <h1 className='text-white text-2xl mx-auto text-center'>Cryptography</h1>
                            <div className='px-10 mt-4 text-white'>
                            <ProgressBar percentageValue={45} color="blue" tooltip={true} marginTop="mt-2" />
                            <p1 className="mt-4">43%</p1>
                            </div>
                        </div>
                        <div className='mt-1 py-6 mt-4 rounded-lg' style={{backgroundColor:"#212121"}}>
                            <h1 className='text-white text-2xl mx-auto text-center'>Forensics</h1>
                            <div className='px-10 mt-4 text-white'>
                            <ProgressBar percentageValue={45} color="blue" tooltip={true} marginTop="mt-2" />
                            <p1 className="mt-4">43%</p1>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
            <Footer />
        </>
    )
}
