import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Transition, Fragment, Dialog } from '@headlessui/react';
import { useState } from 'react';
export default function ComingSoon() {

  const [open, setOpen] = useState(false);
  return (
    <>
      <Head>
        <title>Groups - CTFGuide</title>
        <style>
          @import
          url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
        </style>
      </Head>
      <StandardNav />
      <div className=" min-h-screen  ">



        <div className="mx-auto mt-10 max-w-6xl">

          <div className='flex'>
            <h1 className='text-white text-3xl'>Groups</h1>
            <div className='ml-auto'>
              <button className='px-2 py-1 rounded-lg bg-blue-600 text-white ml-4'>Create Group</button>
              <button onClick={() => setOpen(true)} className='px-2 py-1 rounded-lg  bg-neutral-800/50 hover:bg-neutral-700/50 text-white ml-4'>Join a Group</button>

            </div>

          </div>

          <div className=' mt-  rounded-lg  '>
            <motion.div
              className="mx-auto w-full rounded-md"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mx-auto mt-6 flex rounded-sm bg-neutral-800/40 w-full py-2.5 ">
                <div className="my-auto mx-auto text-center pt-4 pb-4 text-xl text-white">
                  <i className="text-4xl fas fa-users-slash mx-auto text-center text-neutral-700/80"></i>
                  <p>Looks like you have are not enrolled in any groups.</p>
                  <a  className='mx-auto cursor-pointer'>
                    <p className='mx-auto text-center text-lg text-blue-600 hover:text-blue-500 ' onClick={() => setOpen(true)}> Do you have a join code?<ArrowRightIcon className='ml-1 mt-0.5 h-5 hidden' /></p>
                  </a>
                </div>
              </div>
            </motion.div>

            <div id="group-grid" className='grid grid-cols-2 gap-4 mt-4 hidden'>

              <div className='bg-neutral-800/50 border border-neutral-800 rounded-lg p-4 hover:bg-[#2c2c2c]'>
                <h1 className='text-white text-xl'>CSE 597A</h1>
                <p className='text-white'>Introduction to Computer Security</p>


              </div>

              <div className='bg-neutral-800/50 border border-neutral-800 rounded-lg p-4 grid-cols-3 hover:bg-[#2c2c2c]'>
                <div className='col-span-2'>
                  <h1 className='text-white text-xl'>CSE 527A</h1>
                  <p className='text-white'>Cybersecurity: a surface level understanding</p>


                </div>
              </div>


              <div className='bg-neutral-800/50 border border-neutral-800 rounded-lg p-4 hover:bg-[#2c2c2c]'>
                <h1 className='text-white text-xl'>CSE 597WC</h1>
                <p className='text-white'>Introduction to Computer Security</p>


              </div>






            </div>





          </div>


          <Transition.Root show={open} as={Fragment}>

<Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={setOpen}>

    <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
    >
        <div  
        onClick={() => setOpen(false)}
        className="fixed inset-0 bg-black bg-opacity-75 transition-opacity z-2" />
  
    </Transition.Child>
    <div className="flex items-center justify-center min-h-screen">
        <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
            <div style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: "#161716" }} className="  bg-neutral-700  rounded-lg px-40 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle ">
                <div className='w-full'>
                    <div className="mt-3 sm:mt-5 text-center mx-auto">
                        <h1 className="text-white text-xl text-center"> Enter a join code</h1>
                        <input className='mt-2 py-0.5 bg-neutral-800  rounded-lg outline-none focus:outline-none  focus:ring-0  focus:border-transparent text-sm border-transparent  cursor-outline-none  text-white  '></input>
                      <br></br>
                      <div className='w-full mx-auto text-center mt-4 pb-5' >
                        <button className='hover:bg-neutral-600/50 bg-neutral-800 text-white rounded-lg px-4 py-2'> Join </button><button onClick={() => setOpen(false)} className='px-4 py-2 ml-4 rounded-lg bg-neutral-800 hover:bg-neutral-600/50 text-white'>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </Transition.Child>
    </div>
</Dialog>
</Transition.Root>


        </div>



      </div>




      <Footer />
    </>
  );
}
