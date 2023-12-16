import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import {  ProgressCircle } from "@tremor/react"

export default function Slug() {
    
    const demoAssignments = [
        {
            id: 1,
            title: 'Assignment 1',
            description: 'Introduction to Cyber Security Basics',
            dueDate: '2023-12-01',
        },
        {
            id: 2,
            title: 'Assignment 2',
            description: 'Understanding Cryptography',
            dueDate: '2024-01-15',
        },
        // Add more assignments as needed
    ];
    

    
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



                <div className="mx-auto mt-4 max-w-6xl">

                <a href="/groups/122ctfguide" className='hidden text-neutral-200 hover:text-neutral-500'><i className="fas fa-long-arrow-alt-left"></i> Return Home</a>



        <div
          className=" "
          aria-hidden="true"
        ></div>
        <div className="" aria-hidden="true"></div>
        <div className="relative flex min-h-full flex-col">
          <div className="mx-auto w-full  flex-grow lg:flex ">
            <div className="min-w-0 flex-1 xl:flex">
              <div className=" lg:min-w-0 lg:flex-1 mt-6 rounded-lg ">
          <div className='mx-auto '>
          <div className="  bg-black/10 shadow-2xl ring-1  ring-white/10 relative isolate overflow-hidden bg-neutral-900 py-14 sm:py-12 rounded-lg">
        <div className="relative mx-auto px-6 lg:px-8">
        <div
          className="absolute -bottom-8 -left-96 -z-10 transform-gpu blur-3xl sm:-bottom-64 sm:-left-40 lg:-bottom-32 lg:left-8 xl:-left-10"
          aria-hidden="true"
        >
         <div
           className="aspect-[1266/975] w-[79.125rem] bg-gradient-to-tr from-[#081e75] to-[#0737f2] opacity-30"
           style={{
             clipPath:
               'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
           }}
         />
       </div>
       <div className="mx-auto  lg:mx-0  ">
         <h1 className='text-white text-3xl font-semibold'>Assignment 1</h1>
                    <div className='ml-auto'>
                       </div>
       </div>
     
     </div>
   </div></div>
   </div>
    </div>
</div>
</div>





                    <h1 className='hidden text-white text-2xl mt-4 font-semibold ' >Classroom Performance</h1>
                    <div className='grid  hidden grid-cols-3 mt-4 gap-x-5'>
                       <div className='text-blue-500 text-3xl text-center bg-neutral-800/50 px-2 py-5 rounded-lg'>
                        <h1 className='font-semibold text-red-400'>45%</h1>
                        <h2 className='text-xl text-white'>Completion Percentage</h2>
                       </div>

                       <div className='text-blue-500 text-3xl text-center bg-neutral-800/50 px-2 py-5 rounded-lg'>
                        <h1 className='font-semibold text-orange-400'>10</h1>
                        <h2 className='text-xl text-white'>Grading Queue</h2>
                       </div>

                       <div className='text-blue-500 text-3xl text-center bg-neutral-800/50 px-2 py-5 rounded-lg'>
                        <h1 className='font-semibold text-green-400'>2</h1>
                        <h2 className='text-xl text-white'>Students Online</h2>
                       </div>
                    </div>

                    <h1 className='text-white text-2xl mt-4 font-semibold'>Individual View</h1>
                    <div className='flex'>
                    <button className='text-white'><i className="fas fa-arrow-circle-left mr-2"></i></button> <h1 className='text-xl text-white'>Pranav Ramesh</h1>                    <button className='text-white'><i className="fas fa-arrow-circle-right ml-2"></i></button>
                   
              
               </div>

                <h1 className='text-white text-lg'>Detected Event #1 - Student checks where they are. <span className='text-green-500'>OK</span></h1>
               <textarea className='w-full bg-black border-none rounded-lg text-white disabled' disabled>
                root@ctftermbackup-1:/home/test# ls&#013; &#010;baskets
              </textarea>
                    
              <h1 className='text-white text-lg'>Detected Event #2 - Student attempts to move into folder but uses incorrect command. <span className='text-red-500'>Penalty issued, will decrease if rebound.</span></h1>
               <textarea className='w-full bg-black border-none rounded-lg text-white disabled' disabled>
               root@ctftermbackup-1:/home/test# change baskets&#013; &#010;
                bash: change: command not found
              </textarea>
                    
                                   
              <h1 className='text-white text-lg'>Detected Event #3 - Student correctly moves into folder baskets. <span className='text-green-500'>OK, penalty decreased.</span></h1>
               <textarea className='w-full bg-black border-none rounded-lg text-white disabled' disabled>
               root@ctftermbackup-1:/home/test# cd baskets&#013; &#010;
                root@ctftermbackup-1:/home/test/baskets#
              </textarea>

                                            
              <h1 className='text-white text-lg'>Detected Event #3 - Student deletes bad.txt. <span className='text-yellow-500'>Objective reached, but student assumed bad.txt was present in this folder.</span></h1>
               <textarea className='w-full bg-black border-none rounded-lg text-white disabled' disabled>
               root@ctftermbackup-1:/home/test# rm -rf bad.txt&#013; &#010;
              </textarea>
<div className='text-center bg-neutral-800/50 w-1/3 py-4 mx-auto mt-4'>
                <h1 className='text-white'>AI Grader</h1>
                <h1 className='text-green-500 text-4xl font-semibold '>95%</h1>
                </div>

                </div>



            </div>

            <Footer />
        </>
    );
}
