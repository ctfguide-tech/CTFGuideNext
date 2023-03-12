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
            <h1 className='text-white text-4xl mt-5'>Your Challenges</h1>
        </>
    )
}

