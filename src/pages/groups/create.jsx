import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Transition, Fragment, Dialog } from '@headlessui/react';
import { useState } from 'react';

export default function CreateGroup() {
    const [selectedOption, setSelectedOption] = useState(null);

  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');



  function joinCode() {
    // Fetch code
    // If code is valid, join group
    // Else, display error

    let code = document.getElementById("joinCode").ariaValueMax;
    if (!code) {
      return window.alert("Please enter a join code.")
    } 

    fetch('/api/groups', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code: code }),
      authorization: "Bearer " + localStorage.getItem("token")
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        if (data.success == true) {
          window.location.reload();
        } else {
          window.alert("Invalid join code.")
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });


  }

  function submitButton() {
    // Send group data to server to create group
    const groupData = {
        name: document.getElementById('course_name').value,
        description: document.getElementById('course_description').value,
        email_domain: document.getElementById('email_domain').value,
        pricing_model: selectedOption
    };
    console.log(groupData);
    fetch('http://localhost:3001/groups', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('idToken')
      },
      body: JSON.stringify(groupData),
     

    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        if (data.success == true) {
          window.alert("ok")
      //    window.location.reload();
        } else {
          window.alert("Invalid join code.")
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
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
            <h1 className='text-white text-3xl'>Create a Group</h1>
            <div className='ml-auto hidden'>
              <button className='px-2 py-1 rounded-lg bg-blue-600 text-white ml-4'>Create Group</button>
              <button onClick={() => setOpen(true)} className='px-2 py-1 rounded-lg  bg-neutral-800/50 hover:bg-neutral-700/50 text-white ml-4'>Join a Group</button>

            </div>

          </div>


        <div className='container bg-neutral-800/40 mt-4 py-3 px-4'>
            <div className="space-y-12">
    <div className="border-b border-neutral-900/10 pb-12">
      <h2 className="text-base font-semibold leading-7 text-white">General Settings</h2>
      <p className="mt-1 text-sm leading-6 text-white">CTFGuide needs some information in order to deploy your group.</p>

      <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-4">
            <div className="grid grid-cols-1">
    <div>
    <label for="username" className="block text-sm font-medium leading-6 text-white">Email Domain</label>
          <div className="mt-2">
            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-neutral-700 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600 sm:max-w-md">
              <span className="flex select-none items-center pl-3 text-neutral-500 sm:text-sm">johndoe@</span>
              <input type="text" name="username" id="email_domain"  className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-white placeholder:text-neutral-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder="coolschool.edu"/>

            </div>

    </div>
   
            </div>
       
 <div>

    <div className='bg-neutral-850 mt-4 border border-neutral-500 rounded-lg px-4 text-white py-2'>
                <b>✨ What is this?</b>
                <h1>To invite students into your group, they must enter a group code. If the code is shared to another student who isn't in your organization, CTFGuide will prevent them for joining by verifying if their email contains the domain.</h1>

                <br></br>

                <h1>That being said, your organization may not have custom email domains. In that case, we suggest going through the invite process in class and disable joining afterwards.</h1>
             </div> 
    </div>
           
          </div>
          
        </div>

        <div className="col-span-full">
          <label for="about" className="block text-sm font-medium leading-6 text-white">Course Description</label>
          <div className="mt-2">
            <textarea id="course_description" name="about" rows="3" className="bg-transparent  block w-full rounded-md border-0 py-1.5 text-white shadow-sm ring-1 ring-inset ring-neutral-700 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"></textarea>
          </div>
          <p className="mt-3 text-sm leading-6 text-white">Write a short, brief description about your course. CTFGuide will use AI to suggest lesson content, labs, and more. This field is optional.</p>
        </div>

        <div className="sm:col-span-4">
          <label for="username" className="block text-sm font-medium leading-6 text-white">Course Name</label>
          <div className="mt-2">
            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-neutral-700 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600 sm:max-w-md">
           
              <input type="text" name="Course Name" id="course_name"  className="block flex-1 border-0 bg-transparent py-1.5 text-white placeholder:text-neutral-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder="Silly Hacking 101"/>

            </div>
       
          </div>
        </div>
        </div>

        <h1 className='text-sm mt-4 text-white'>Pricing Model</h1>
        <div className='mt-2 grid grid-row-1 grid-cols-2 gap-4 gap-x-4 text-white '>
            <div 
                className={`bg-neutral-800 hover:bg-neutral-750 px-2 py-2 text-center ${selectedOption === 'student' ? 'border-2 border-blue-600' : 'border-2 border-neutral-800'}`}
                onClick={() => setSelectedOption('student')}
            >
                <h1>Paid for by Student  <b className='text-yellow-500 italic text-sm'>Most Popular!</b></h1>
                <h1 className='text-2xl font-semibold'>$53</h1>
                <h1 className='text-sm'>per semester</h1>
            </div>

            <div 
                className={`bg-neutral-800 hover:bg-neutral-750 px-2 py-2 text-center ${selectedOption === 'institution' ? 'border-2 border-blue-600' : 'border-2 border-neutral-800'}`}
                onClick={() => setSelectedOption('institution')}
            >
                <h1>Paid for by Institution</h1>
                <h1 className='text-2xl font-semibold'>$40</h1>
                <h1 className='text-sm'>per student, per semester</h1>
            </div>
        </div>

        <h1 className='text-sm mt-4 text-white'>Expected amount of students</h1>

        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-neutral-700 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600 sm:max-w-md">
           
           <input type="text" name="username" id="username"  className="block flex-1 border-0 bg-transparent py-1.5 text-white placeholder:text-neutral-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder="Just needs to be an estimate."/>

         </div>

         <h1 className='text-sm mt-4 text-white'>What time do you expect you'll start to use CTFGuide in the classroom.</h1>

<div className="flex rounded-md shadow-sm ring-1 ring-inset ring-neutral-700 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600 sm:max-w-md">
   
   <input type="time" name="username" id="username"  className="block flex-1 border-0 bg-transparent py-1.5 text-white placeholder:text-neutral-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder="Just needs to be an estimate."/>

 </div>

 <div className='bg-neutral-850 mt-4 border border-neutral-500 rounded-lg px-4 text-white py-2'>
                <b>✨ Why do we ask for this information?</b>
                <h1>CTFGuide boasts a swift terminal boot time, but pre-deploying terminals can enhance this speed even further. By obtaining these estimates, we aim to optimize our terminal pools and schedule maintenance more effectively. Rest assured, even if the pool sizes aren't precise, we've allocated a generous buffer. In the rare event of a delay, a student might experience a brief 5-second wait for their terminal to deploy.</h1>
 </div> 
    

    <button onClick={submitButton} id="submitButton" className='px-5  py-1 text-xl text-white bg-blue-700 rounded-lg hover:bg-blue-600/50 mt-4'> Submit</button>
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
