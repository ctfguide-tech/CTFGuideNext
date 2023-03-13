import Head from 'next/head'
import Link from 'next/link'
import { Button } from '@/components/Button'
import { TextField } from '@/components/Fields'
import { Logo } from '@/components/Logo'
import { Alert } from '@/components/Alert'
import { Container } from '@/components/Container'
import { StandardNav } from '@/components/StandardNav'
import { Footer } from '@/components/Footer'
import { PracticeNav } from '@/components/practice/PracticeNav'
import { Community } from '@/components/practice/community'
import { GroupCard } from '@/components/practice/ExploreSet'

export default function Pratice() {
    return (
        <>
            <Head>
                <title>Explore - CTFGuide</title>
                <meta
                    name="description"
                    content="Practice Problems"
                />
                <style>
                    @import url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
                </style>
            </Head>
            <StandardNav />
            <main>
                <div className=" w-full " style={{ backgroundColor: "#212121" }}>
                    <div className="flex mx-auto text-center h-28 my-auto">
                        <h1 className='text-4xl text-white mx-auto my-auto font-semibold'>Explore</h1>
                    </div>
                </div>
                <div className="flex h-screen max-w-7xl mx-auto ">
                    <PracticeNav />
                    {/* Main Content */}
                </div>
                <GroupCard
                    title="Group Name"
                    description="A short description of the group"
                    views={42}
                    imageUrl="ff"
                    href=""
                />
            </main>
            <Footer />
        </>
    )
}
