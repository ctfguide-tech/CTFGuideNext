import Head from 'next/head'
import { StandardNav } from '@/components/StandardNav'
import { Footer } from '@/components/Footer'
import { PracticeNav } from '@/components/practice/PracticeNav'

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
                <div className="flex flex-col sm:flex-row">
                    <div className="w-full md:w-1/5 flex md:h-screen max-w-7xl md:mx-auto md:justify-center px-8 md:px-16">
                        <PracticeNav />
                    </div>
                    <div className='w-full md:w-4/5 px-8 xl:px-16 border-l border-gray-800'>
                        Explore
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}
