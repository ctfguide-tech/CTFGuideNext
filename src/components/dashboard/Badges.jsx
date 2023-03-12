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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { SideNavContent } from '@/components/dashboard/SideNavContents'
import { QuickSettings } from '@/components/dashboard/QuickSetttings'
import { Suggest } from '@/components/dashboard/Suggest'


export function MyFriends() {

    return (
    
    <>
        <h1 className='text-white text-4xl mt-5'>Badges</h1>
        {/* Fetch badges from API */}
        <div className="grid grid-cols-5 mt-4 gap-x-4 gap-y-4">
            {badges.map((data) => (
                <div style={{ backgroundColor: "#212121" }} className='mx-auto px-4 py-4 rounded-lg w-full text-center  align-center'>
                    <img src={`../badges/level1/${data.badge.badgeName.toLowerCase()}.png`} width="100" className='mx-auto px-1 mt-2' />

                    <h1 class="text-white text-xl  mx-auto text-center mt-2">{data.badge.badgeName}</h1>
                    <h1 class="text-white text-lg ">{new Date(data.createdAt).toLocaleDateString('en-US', {
                        month: '2-digit',
                        day: '2-digit',
                        year: 'numeric',
                    })}</h1>
                </div>
            ))}
        </div>
    </>
    
    )
}