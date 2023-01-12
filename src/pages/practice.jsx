import Head from 'next/head'
import Link from 'next/link'
import { Button } from '@/components/Button'
import { TextField } from '@/components/Fields'
import { Logo } from '@/components/Logo'
import { Alert } from '@/components/Alert'
import { Container } from '@/components/Container'
import { StandardNav } from '@/components/StandardNav'

export default function Pratice() {




    return (
        <>
            <Head>
                <title>Practice  - CTFGuide</title>
                <style>
                    @import url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
                </style>
            </Head>


            <StandardNav />
            <main>

                <div className=" w-full " style={{ backgroundColor: "#212121" }}>

                    <div className="flex mx-auto text-center h-28 my-auto">
                        <h1 className='text-3xl text-white mx-auto my-auto font-semibold'>Practice</h1>
                    </div>


                </div>


                <div className='max-w-6xl mx-auto text-center'>
                  <h1 className='text-white text-3xl'>  Freshly brewed </h1>
                </div>


            </main>



        </>
    )
}
