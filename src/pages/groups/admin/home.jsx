import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';

export default function ComingSoon() {
    return (
        <>
            <Head>
                <title>Coming Soon - CTFGuide</title>
                <style>
                    @import
                    url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
                </style>
            </Head>
            <StandardNav />
            <div className=" min-h-screen  ">



                <div className="mx-auto mt-10 max-w-6xl">

                    <h1 className='text-white text-3xl'>Pennsylvania State University</h1>
                    <div className='px-4 py-4  mt- bg-neutral-800 rounded-lg  '>

                    <h1 className='text-white text-2xl'>Bounded Courses</h1>
                    <p className='text-white'>Bounded courses are courses linked with your LMS and CTFGuide.</p>


                    <div className='grid grid-cols-2 gap-4 mt-4'>

                        <div className='bg-neutral-900 border border-neutral-800 rounded-lg p-4'>
                            <h1 className='text-white text-xl'>CSE 597A</h1>    
                            <p className='text-white'>Introduction to Computer Security</p>

                            <div className='mt-4'>
                                <button className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg'>View Course</button>
                            </div>
                            </div>

                            <div className='bg-neutral-900 border border-neutral-800 rounded-lg p-4 grid-cols-3'>
        <div className='col-span-2'>
        <h1 className='text-white text-xl'>CSE 527A</h1>    
                            <p className='text-white'>Cybersecurity: a surface level understanding</p>

                            <div className='mt-4'>
                                <button className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg'>View Course</button>
                            </div>
        </div>
                            </div>


                            <div className='bg-neutral-900 border border-neutral-800 rounded-lg p-4'>
                            <h1 className='text-white text-xl'>CSE 597WC</h1>    
                            <p className='text-white'>Introduction to Computer Security</p>

                            <div className='mt-4'>
                                <button className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg'>View Course</button>
                            </div>
                            </div>

                            
                            </div>

                            
                            

                        
                    </div>

              
                    <div className='px-4 py-4  mt-10 bg-neutral-800 rounded-lg  '>

<h1 className='text-white text-2xl'>Pending Approval</h1>
<p className='text-white'>These are courses we've detected in your LMS but have not been connected to CTFGuide yet.</p>


<div className='grid grid-cols-2 gap-4 mt-4'>

    <div className='bg-neutral-900 border border-neutral-800 rounded-lg p-4'>
        <h1 className='text-white text-xl'>CSE 597A</h1>    
        <p className='text-white'>Introduction to Computer Security</p>

        <div className='mt-4'>
            <button className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg'>Connect</button>
        </div>
        </div>

        <div className='bg-neutral-900 border border-neutral-800 rounded-lg p-4 grid-cols-3'>
<div className='col-span-2'>
<h1 className='text-white text-xl'>CSE 527A</h1>    
        <p className='text-white'>Cybersecurity: a surface level understanding</p>

        <div className='mt-4'>
            <button className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg'>View Course</button>
        </div>
</div>
        </div>


        <div className='bg-neutral-900 border border-neutral-800 rounded-lg p-4'>
        <h1 className='text-white text-xl'>CSE 597WC</h1>    
        <p className='text-white'>Introduction to Computer Security</p>

        <div className='mt-4'>
            <button className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg'>Connect</button>
        </div>
        </div>

        
        </div>

        
        

    
</div>
                </div>



            </div>

            <Footer />
        </>
    );
}
