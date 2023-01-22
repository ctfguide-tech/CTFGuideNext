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
                        <h1 className='text-4xl text-white mx-auto my-auto font-semibold'>Practice</h1>
                    </div>


                </div>


                <div className='max-w-6xl mx-auto text-left mt-6'>
                  <h1 className='text-white text-3xl font-semibold'> 🔥 Popular </h1>
                  <div className="grid grid-cols-4 gap-4 mt-4">
                    <div className='card rounded-lg px-4 py-2 w-full border-l-4 border-green-500' style={{ backgroundColor: "#212121" }}>
                        <h1 className='text-white text-2xl'>Scrambled Eggs</h1>
                        <p className='text-white'>Decrypt my breakfast please</p>
                        <span></span>
                        
                    </div>
                    <div className='card rounded-lg px-4 py-2 w-full border-l-4 border-red-500' style={{ backgroundColor: "#212121" }}>
                        <h1 className='text-white text-2xl'>Scrambled Eggs</h1>
                        <p className='text-white'>Decrypt my breakfast please</p>
                        
                    </div>
                    <div className='card rounded-lg px-4 py-2 w-full border-l-4 border-yellow-500' style={{ backgroundColor: "#212121" }}>
                        <h1 className='text-white text-2xl'>Scrambled Eggs</h1>
                        <p className='text-white'>Decrypt my breakfast please</p>
                        
                    </div>
                  </div>
                </div>


            </main>



        </>
    )
}
