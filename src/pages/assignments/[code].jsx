import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { ProgressCircle } from "@tremor/react"
import { MarkdownViewer } from '@/components/MarkdownViewer';

export default function Slug() {

  const demoAssignments = [
    {
      id: 1,
      title: 'Yummers!',
      description: 'This is an example assingment on the CTFGuide website. Thos is demonstrating a fun activity hosted on the CTFGuide website.',
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



        <div className="mx-auto mt-4">

          <a href="/groups/122ctfguide" className='hidden text-neutral-200 hover:text-neutral-500'><i className="fas fa-long-arrow-alt-left"></i> Return Home</a>



          <div className='w-full bg-blue-900/60 px-4 py-4 '>

            <div className='max-w-6xl mx-auto'>

              <h1 className='text-white font-semibold text-3xl'>{demoAssignments[0].title} </h1>
              <h1 className='text-white'>Due at 11:50 PM 12/25/23</h1>
            </div>
          </div>

          <div className='max-w-6xl mx-auto mt-4'>


            <div className='grid grid-cols-6 gap-x-8 h-full'>
              <div className="col-span-2">
                <h1 className='text-white text-xl font-semibold'>Assignment Description</h1>
                <MarkdownViewer className="text-white" content={demoAssignments[0].description} />

                <b className='text-white'>ASSOCIATED FILES</b>
                <hr className='bg-neutral-900 rounded-lg border border-blue-600' />
                <div className='text-white mt-4 px-4 py-1 bg-neutral-800/50 hover:bg-neutral-700/10 cursor-pointer rounded-lg border border-neutral-800/50'>
                  <h1 className='text-md'><i className="text-white fas fa-file-archive mr-2"></i> this_is_flag.zip</h1>
                </div>

                <p className='font-semibold text-white mt-6'>FLAG SUBMISSION</p>
                <hr className='bg-neutral-900 rounded-lg border border-blue-600' />

                <input placeholder='Think you got the flag? Enter it here!' className='text-white w-full mt-4 px-4 py-1 bg-neutral-800/50 hover:bg-neutral-700/10 cursor-pointer rounded-lg border border-neutral-800/50'></input>
                <button className='mt-3 bg-green-800 hover:bg-green-700 px-2 py-1 text-white rounded-lg'>Check Flag</button>


                <p className='font-semibold text-white mt-6'>HINTS</p>
                <hr className='bg-neutral-900 rounded-lg border border-blue-600' />
                <div

                  className="mt-3  w-full border-l-2  border-yellow-600  bg-[#212121] px-4 mb-2 text-lg"
                  enter="transition-opacity duration-75"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition-opacity duration-150"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"

                >
                  <p className="text-white">
                    <span className='text-sm'>Hint 1</span>
              
                  </p>
                </div>
                <div

className="  w-full border-l-2  border-yellow-600  bg-[#212121] px-4 mb-2 text-lg"
enter="transition-opacity duration-75"
enterFrom="opacity-0"
enterTo="opacity-100"
leave="transition-opacity duration-150"
leaveFrom="opacity-100"
leaveTo="opacity-0"

>
<p className="text-white">
  <span className='text-sm'>Hint 2</span>

</p>
</div>

<div

className="  w-full border-l-2  border-yellow-600  bg-[#212121] px-4 mb-2 text-lg"
enter="transition-opacity duration-75"
enterFrom="opacity-0"
enterTo="opacity-100"
leave="transition-opacity duration-150"
leaveFrom="opacity-100"
leaveTo="opacity-0"

>
<p className="text-white">
  <span className='text-sm'>Hint 3</span>

</p>
</div>



              </div>

              <div className='col-span-4 bg-black h-96 px-4'>
                <iframe className="w-full h-full" src="https://terminal.ctfguide.com/wetty/ssh/root"></iframe>
              </div>
            </div>
          </div>



        </div>


      </div>

      <Footer />
    </>
  );
}
