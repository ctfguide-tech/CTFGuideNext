import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Transition, Fragment, Dialog } from '@headlessui/react';
import { useState } from 'react';

import { Menu } from '@headlessui/react';

export default function CreateGroup() {
  const baseUrl = "http://localhost:3001"; // change this in deployment

  const [selectedOption, setSelectedOption] = useState(null);

  const [open, setOpen] = useState(false);
  const [domain, setDomain] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [seats, setSeats] = useState(0);
  const [time, setTime] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);


  

  const mockLoad = async () => {
    const submitButton = document.getElementById('submitButton');
    submitButton.innerHTML = "Loading...";
    submitButton.disabled = true;

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain, description, seats, time, selectedCategory })
    };


    //console.log({ domain, description, seats, time, selectedCategory });
    // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/`, requestOptions);
    // const data = await response.json();
   
    submitButton.innerHTML = "Submit";
    submitButton.disabled = false;
  }

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
            <h1 className='text-white text-3xl'>Create an Assignment</h1>
            <div className='ml-auto hidden'>
              <button className='px-2 py-1 rounded-lg bg-blue-600 text-white ml-4'>Create Group</button>
              <button onClick={() => setOpen(true)} className='px-2 py-1 rounded-lg  bg-neutral-800/50 hover:bg-neutral-700/50 text-white ml-4'>Join a Group</button>

            </div>

          </div>


        <div className='container bg-neutral-800/40 mt-4 py-3 px-4'>
            <div className="space-y-12">
    <div className="border-b border-neutral-900/10 pb-12">
      <h2 className="text-base font-semibold leading-7 text-white">Assignment Settings</h2>
      <p className="mt-1 text-sm leading-6 text-white">CTFGuide needs some information to issue an assignment to students.</p>

      <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-4">
            <div className="grid grid-cols-1">
    <div>

    <div className="grid grid-cols-3 gap-x-8 w-full">
<div>
    <label for="username" className="block text-sm font-medium leading-6 text-white">Assignment Title</label>
          <div className="mt-2">
            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-neutral-700 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600 sm:max-w-md">

              <input type="text" name="title" id="assignment_title" value={domain} onChange={(e) => setDomain(e.target.value)} className="px-4 block flex-1 border-0 bg-transparent py-1.5 pl-3 text-white placeholder:text-neutral-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder="Make this descriptive but short."/>

            </div>

    </div>
    </div>

    <div>
    <label for="assignment_points" className="block text-sm  font-medium leading-6 text-white">Assignment Points</label>
          <div className="mt-2">
            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-neutral-700 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600 sm:max-w-md">

              <input type="number" name="title" id="assignment_points"   className="px-4 block flex-1 border-0 bg-transparent py-1.5 pl-3 text-white placeholder:text-neutral-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder="100"/>

            </div>
            </div>
    </div>

    <div>
        <label htmlFor="title" className="block text-sm font-medium leading-6 text-white">Assignment Category</label>
        <div className="mt-2">
            <div className="">
            <Menu as="div" className="relative  text-left rounded">
    <Menu.Button className="flex w-full rounded-md shadow-sm ring-1 ring-inset ring-neutral-700 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600  inline-flex justify-center  rounded-md  shadow-sm px-4 py-2  text-sm font-medium text-white  ">
        {selectedCategory || "Test"}
    </Menu.Button>

      <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-left bg-white divide-y divide-neutral-700 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <Menu.Item>
          {({ active }) => (
            <a
              href="#"
              className={`${active ? '' : ''
                } bg-neutral-800  text-white group flex items-center px-4 py-2 text-sm hover:bg-neutral-900`}

                onClick={() => setSelectedCategory("Test")}
            >
              Test
            </a>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <a
              href="#"
              className={`${active ? '' : ''
                } bg-neutral-800  text-white group flex items-center px-4 py-2 text-sm hover:bg-neutral-900`}
                onClick={() => setSelectedCategory("Quiz")}
            >
              Quiz
            </a>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <a
              href="#"
              className={`${active ? '' : ''
            } bg-neutral-800  text-white group flex items-center px-4 py-2 text-sm hover:bg-neutral-900`}
                onClick={() => setSelectedCategory("HW")}
            >
              HW
            </a>
          )}
        </Menu.Item>
      </Menu.Items>
    </Menu>
            </div>
        </div>
    </div>
    </div>
            </div>
       
 <div>

    </div>
           
          </div>
          
        </div>

        <div className="col-span-full">
          <label for="about" className="block text-sm font-medium leading-6 text-white">Assignment Information</label>
          <div className="mt-2">
            <textarea id="assignment_info" value={description} onChange={(e) => setDescription(e.target.value)} name="about" rows="3" className="bg-transparent  block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-neutral-700 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"></textarea>
          </div>
        </div>

        </div>

        <h1 className='text-sm mt-10 text-white'>Assignment Type</h1>
        <div className='mt-2 grid grid-row-1 grid-cols-3 gap-4 gap-x-4 text-white '>
            <div 
                className={`bg-neutral-800 cursor-pointer px-2 py-2 text-center ${selectedOption === 'existingChallenge' ? 'border-2 border-blue-600' : 'border-2 border-neutral-800 hover:bg-neutral-900 hover:border-neutral-900'}`}
                onClick={() => {setSelectedOption('existingChallenge')}}
            >
                <i className="text-3xl text-blue-500 fas fa-globe"></i>
                <h1 className='text-lg font-semibold'>Existing Challenge</h1>
                <h1 className='text-sm'>Choose an existing challenge made by the community on CTFGuide with assisted grading by AI</h1>
            </div>
            <div 
                className={`bg-neutral-800 cursor-pointer px-2 py-2 text-center ${selectedOption === 'customChallenge' ? 'border-2 border-blue-600' : 'border-2 border-neutral-800 hover:bg-neutral-900 hover:border-neutral-900'}`}
                onClick={() => {setSelectedOption('customChallenge')}}
            >
           
                <i className="text-3xl text-orange-500 fas fa-hand-sparkles"></i>
                <h1 className='text-lg font-semibold'>Custom Challenge</h1>
                <h1 className='text-sm'>Create a new challenge from scratch. This is a classic CTF challenge with assisted grading by AI.</h1>
            </div>
            <div 
                className={`bg-neutral-800 cursor-pointer px-2 py-2 text-center ${selectedOption === 'dynamicLab' ? 'border-2 border-blue-600' : 'border-2 border-neutral-800 hover:bg-neutral-900 hover:border-neutral-900'}`}
                onClick={() => setSelectedOption('dynamicLab')}
            >
                <i className="text-3xl text-green-500 fas fa-robot"></i>
                <h1 className='text-lg font-semibold'>Dynamic Lab</h1>
                <h1 className='text-sm'>Create a simulated Cybersecurity environent graded by AI </h1>
            </div>
            
        </div>

        <h1 className='text-sm mt-6  text-white'>Assignment Due Date</h1>

        <div className="mt-2 flex gap-x-4 rounded-md shadow-sm ring-1 ring-inset ring-neutral-700 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600 sm:max-w-md">
           
           <input type="date" name="username" id="username" value={seats} onChange={(e) => setSeats(e.target.value)} className="block flex-1 border-0 bg-transparent py-1.5 text-white placeholder:text-neutral-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder="Just needs to be an estimate."/>

           <div className="ml-4 flex rounded-r shadow-sm ring-1 ring-inset ring-neutral-700 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600 sm:max-w-md">
   
   <input type="time" name="username" id="username" value={time} onChange={(e) => setTime(e.target.value)} className="block flex-1 border-0 bg-transparent py-1.5 text-white placeholder:text-neutral-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder="Just needs to be an estimate."/>

 </div>

         </div>

         <h1 className='text-sm mt-4 text-white'></h1>


 <div className='hidden bg-neutral-850 mt-4 border border-neutral-500 rounded-lg px-4 text-white py-2'>
                <b>✨ Why do we ask for this information?</b>
                <h1>CTFGuide boasts a swift terminal boot time, but pre-deploying terminals can enhance this speed even further. By obtaining these estimates, we aim to optimize our terminal pools and schedule maintenance more effectively. Rest assured, even if the pool sizes aren't precise, we've allocated a generous buffer. In the rare event of a delay, a student might experience a brief 5-second wait for their terminal to deploy.</h1>
 </div> 
    

    <button onClick={mockLoad} id="submitButton" className='px-5  py-1 text-xl text-white bg-blue-700 rounded-lg hover:bg-blue-600/50 mt-4'> Submit</button>
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
                        <input id="joinCode" className='mt-2 py-0.5 bg-neutral-800  rounded-lg outline-none focus:outline-none  focus:ring-0  focus:border-transparent text-sm border-transparent  cursor-outline-none  text-white  '></input>
                      <br></br>
                      <div className='w-full mx-auto text-center mt-4 pb-5' >
                        <button onClick={() => joinGroup()} className='hover:bg-neutral-600/50 bg-neutral-800 text-white rounded-lg px-4 py-2'> Join </button><button onClick={() => setOpen(false)} className='px-4 py-2 ml-4 rounded-lg bg-neutral-800 hover:bg-neutral-600/50 text-white'>Cancel</button>
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
