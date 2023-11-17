import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Transition, Fragment, Dialog } from '@headlessui/react';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
const auth = getAuth();

export default function Groups() {
  const baseUrl = "http://localhost:3001"
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("");
  const [teacherClassrooms, setTeacherClassrooms] = useState([]);
  const [studentClassrooms, setStudentClassrooms] = useState([]);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const getAllClassrooms = async () => {
      const uid = localStorage.getItem('uid');
      if(!uid) return;
      setUserId(uid);
      const url = `${baseUrl}/classroom/all-classrooms?uid=${uid}`;
      const response = await fetch(url);
      const data = await response.json();
      if(data.success) {
        setTeacherClassrooms(data.teacher);
        setStudentClassrooms(data.student);
      } else {
        console.log(data.message);
      }
    }
    getAllClassrooms();
  }, []);


  const joinClass = async () => {
    setMessage("loading...");
    setColor("gray")
    let code = document.getElementById("joinCode").value;
    try {
      const userId = localStorage.getItem('uid');
      const url = "http://localhost:3001/classroom/join";
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({classCode: code, userId: userId, isTeacher: false, email: auth.currentUser.email}) // need to get the role of user from local storage
      });
      const res = await response.json();
      if(res.success) {
        if(res.sessionId) {
          // do the stripe stuff
          const stripe = await loadStripe("pk_test_51NyMUrJJ9Dbjmm7hji7JsdifB3sWmgPKQhfRsG7pEPjvwyYe0huU1vLeOwbUe5j5dmPWkS0EqB6euANw2yJ2yQn000lHnTXis7");
          const result = await stripe.redirectToCheckout({ sessionId: res.sessionId });
          console.log(result);
        } else {
          setColor("green");
          setMessage("successfuly joined the class");
          console.log("successfuly joined the class");
        }
      } else {
        setColor("#FF7276");
        setMessage(res.message);
        console.log(res.message);
      }
    } catch(err) {
      console.log(err);
    }
  };

  


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
              <a href="./groups/create" className='px-2 py-1 rounded-lg bg-blue-600 text-white ml-4'>Create Group</a>
              <button onClick={() => setOpen(true)} className='px-2 py-1 rounded-lg  bg-neutral-800/50 hover:bg-neutral-700/50 text-white ml-4'>Join a Group</button>

            </div>

          </div>

          <div className=' mt-  rounded-lg hidden '>
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

        <h1 className='text-white text-2xl mt-10'>{teacherClassrooms.length === 0 ? "You do not own any classrooms yet... " : "Classes you own"}</h1>
          <div className='mt-4 grid grid-cols-3 gap-x-4'>

          {
            teacherClassrooms.map((classroom, idx) => {
              return (
                <div key={idx} className=' bg-neutral-800 rounded-lg px-4 py-2 hover:bg-neutral-800/50 cursor-pointer' 
                onClick={() => {window.location.href = `/groups/${classroom.classCode}/${userId}`}}>
                <h1 className='text-3xl text-neutral-300 font-semibold'>{classroom.name}</h1>
                <p className='text-neutral-400'><i className="fas fa-users"></i> {classroom.numberOfSeats}</p>
                </div>
              )
            })
          }
          </div>



          <h1 className='text-white text-2xl mt-10'>{studentClassrooms.length === 0 ? "You haven't joined any classes yet..." : "Joined Classes"}</h1>
          <div className='mt-4 grid grid-cols-3 gap-x-4'>

          {
            studentClassrooms.map((classroom, idx) => {
              return (
                <div key={idx} className=' bg-neutral-800 rounded-lg px-4 py-2 hover:bg-neutral-800/50 cursor-pointer' 
                onClick={() => {window.location.href = `/groups/${classroom.classCode}/${userId}`}}>
                <h1 className='text-3xl text-neutral-300 font-semibold'>{classroom.name}</h1>
                <p className='text-neutral-400'><i className="fas fa-users"></i> {classroom.numberOfSeats}</p>
                </div>
              )
            })
          }
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
                        <button onClick={() => joinClass()} className='hover:bg-neutral-600/50 bg-neutral-800 text-white rounded-lg px-4 py-2'> Join </button><button onClick={() => {setOpen(false); setMessage("")}} className='px-4 py-2 ml-4 rounded-lg bg-neutral-800 hover:bg-neutral-600/50 text-white'>Cancel</button>
                        <div style={{color: color, marginTop: "10px"}}>{message}</div>
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
