
import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { useEffect, useState } from 'react';
import { Transition, Fragment, Dialog } from '@headlessui/react';
import { loadStripe } from '@stripe/stripe-js';

const STRIPE_KEY = "pk_test_51NyMUrJJ9Dbjmm7hji7JsdifB3sWmgPKQhfRsG7pEPjvwyYe0huU1vLeOwbUe5j5dmPWkS0EqB6euANw2yJ2yQn000lHnTXis7";
const baseUrl = "http://localhost:3001";

const defaultImages = [
  "https://robohash.org/pranavramesh",
  "https://robohash.org/laphatize",
  "https://robohash.org/stevewilkers",
  "https://robohash.org/rickast",
  "https://robohash.org/picoarc",
  "https://robohash.org/jasoncalcanis",
];

export default function teacherSettings({ classroom }) {
    
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteLink, setInviteLink] = useState("ctfguide.com/invite/*****/********");
    const [inviteActivated, setInviteActivated] = useState(false);

    const [description, setDescription] = useState(classroom.description);
    const [numberOfSeats, setNumberOfSeats] = useState(classroom.numberOfSeats);
    const [isOpen, setIsOpen] = useState(classroom.open ? 'open' : 'close');
    const [nameOfClassroom, setNameOfClassroom] = useState(classroom.name);
    const [emailDomain, setEmailDomain] = useState(classroom.org);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const [showOverlay, setShowOverlay] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [messageOfConfirm, setMessageOfConfirm] = useState('');
    const [index, setIndex] = useState(-1);

    const [subType, setSubType] = useState("None");

    const actions = [
      "Are you sure you want to delete the class all data will be lost",
      "Are you sure you want to leave the class",
      "Are you sure you want to make these changes?",
      `Are you sure you want to remove ${selectedStudent && selectedStudent.username} from the class?`
    ]
    
    const handleNumberOfSeats = (event) => {
        const value = event.target.value;
        if (value !== '' && !isNaN(value) && parseInt(value) >= classroom.numberOfSeats) {
          setNumberOfSeats(value);
        }
    };


    const addSubscriptionToClass = async () => {
      if(subType === "None") return;
      try {
        const stripe = await loadStripe(STRIPE_KEY);
        const subscriptionType = subType;
        const userId = localStorage.getItem("uid");
        const response = await fetch(`${baseUrl}/payments/stripe/create-checkout-session`, {
          method: 'POST',
          body: JSON.stringify({
            subType: subscriptionType,
            quantity: numberOfSeats,
            uid: userId,
            operation: "subscription",
            data: {}
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const session = await response.json();
        await stripe.redirectToCheckout({ sessionId: session.sessionId });
      } catch(error) {
        console.log(error);
      }
    };


    const handleInviteLink = async () => {
        setInviteActivated(true);
        const email = inviteEmail;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(email)) {
          setInviteLink('generating...');
          const url = `${baseUrl}/classroom/getAccessToken?classCode=${classroom.classCode}&email=${email}`;
          const response = await fetch(url);
          const data = await response.json();
          console.log(data);
          if(data.success) {
              setInviteLink(`localhost:3000/groups/invites/${classroom.classCode}/${data.body}`);
          } else {
            setInviteLink(data.message);
          }
        }
    };

    const handleDelete = async () => {
        try {
            const code = classroom.classCode;
            const url = `${baseUrl}/classroom/remove`;
            const response = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ classCode: code })
            });
            const data = await response.json();
            if(data.success) {
                window.location.href = "/groups";
            } else {
                console.log("Error when removing classroom");
            }
        } catch(err) {
            console.log(err);
        }
    };

    const leaveClass = async () => {
      try {
          const uidOfTeacher = localStorage.getItem("uid");
          const classroomId = classroom.id;
          const url = `${baseUrl}/classroom/leave`;
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isTeacher: true, classroomId, userId: uidOfTeacher })
          });
          const data = await response.json();
          if(data.success) {
              window.location.href = `/groups`;
          } else {
              console.log(data.message);
          }
      } catch(err) {
          console.log(err);
      }
  };


    const removeStudent = async () => {
      try {
          const uidOfTeacher = localStorage.getItem("uid");
          const classroomId = classroom.id;
          const userId = selectedStudent.uid;
          const url = `${baseUrl}/classroom/leave`;
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, classroomId, isTeacher: false })
          });
          const data = await response.json();
          if(data.success) {
              console.log("The student has been removed");
              window.location.href = `/groups/${classroom.classCode}/${uidOfTeacher}`;
          } else {
              console.log("Error when removing classroom");
          }
      } catch(err) {
          console.log(err);
      }
  };

    const handleConfirmClick = async () => {
      if(index === 0) {
        await handleDelete()
      } else if(index === 1) {
        await leaveClass();
      } else if(index === 2) {
        await saveChanges();
      } else if(index === 3) {
        await removeStudent();
      } else return;
    };


    const addSeatToClass = async seatsToAdd => {
      try {
          const classroomId = classroom.id;
          const pricingPlan = classroom.pricingPlan;
          const url = `${baseUrl}/classroom/add-seat`;
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pricingPlan, classroomId, seatsToAdd })
          });
          const data = await response.json();
          if(data.success) {
              if(data.sessionId) {
                  const stripe = await loadStripe(STRIPE_KEY);
                  await stripe.redirectToCheckout({ sessionId: data.sessionId });
              } else {
                  console.log("Seat has been updated");
                  window.location.href = ``;
              }
          } else {
              console.log("Error when adding seat");
          }
      } catch(err) {
          console.log(err);
      }
  };

    const saveChanges = async () => {
      try {
        const reqBody = {
          classCode: classroom.classCode,
          nameOfClassroom: nameOfClassroom,
          org: emailDomain,
          openStatus: (isOpen === 'open'),
          description,
        };
        const url = `${baseUrl}/classroom/save`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reqBody)
        });
        const data = await response.json();
        if(data.success) {
            console.log("The class has been updated");
            const newNumberOfSeats = parseInt(numberOfSeats);
            if(classroom.numberOfSeats !== newNumberOfSeats) {
              const seatsToAdd = newNumberOfSeats - classroom.numberOfSeats;
              await addSeatToClass(seatsToAdd);
            } else {
              window.location.href = ``;
            }
        } else {
            console.log("Error when updating the class");
        }
      } catch(err) {
          console.log(err);
      }
    };
  
    const filteredOptions = classroom.students.filter(option =>
      option.username.toLowerCase().includes(searchInput.toLowerCase())
    );

    console.log(subType);
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
            <div id="general" className="">
          <div className="mx-auto flex max-w-6xl">
  

            <div className="flex-1 xl:overflow-y-auto">
              <div className="mx-auto max-w-3xl py-10 px-4 sm:px-6 lg:py-12 lg:px-8">

                <button onClick={() => window.location.href = ``} className="ml-4 bg-blue-600 rounded-lg hover:bg-blue-600/50 text-white px-2 py-1" style={{fontSize: "10px", marginLeft: "-15px", marginBottom: "10px"}}>
                  <i className="fa fa-arrow-left" style={{color: "white"}}></i> Back</button>

                <h1 className="text-3xl font-bold tracking-tight text-white">
                  Classroom Settings
                </h1>

                <div className="mt-6 space-y-8 ">
                  <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
                    <div className="sm:col-span-6">
                      <h2 className="text-xl font-medium text-white">
                        Payed by {classroom.pricingPlan}
                      </h2>
                      <p className="mt-1 text-sm text-white">
                        All changes will be applied after clicking the save button
                      </p>
                    </div>

                    <div className="sm:col-span-3">
                        <label
                        htmlFor="number-of-seats"
                        className="block text-sm font-medium leading-6 text-white"
                        >
                        Number of seats
                        </label>
                        <input
                        type="number"
                        autoComplete="off"
                        value={numberOfSeats}
                        onChange={handleNumberOfSeats}
                        className="mt-2 block w-full rounded-md border-none bg-neutral-800 py-1.5 text-white shadow-sm sm:text-sm sm:leading-6"
                        />
                    </div>

                    <div className="sm:col-span-3">
                        <label
                        htmlFor="number-of-seats"
                        className="block text-sm font-medium leading-6 text-white"
                        >
                        Name of classroom
                        </label>
                        <input
                        autoComplete="off"
                        value={nameOfClassroom}
                        onChange={(e) => setNameOfClassroom(e.target.value)}
                        className="mt-2 block w-full rounded-md border-none bg-neutral-800 py-1.5 text-white shadow-sm sm:text-sm sm:leading-6"
                        />
                    </div>

                    <div className="sm:col-span-3">
                        <label
                        htmlFor="classroom-status"
                        className="block text-sm font-medium leading-6 text-white"
                        >
                        Classroom status
                        </label>
                        <select
                        value={isOpen}
                        onChange={(e) => setIsOpen(e.target.value)}
                        id="classroom-status"
                        className="mt-2 block w-full rounded-md border-none bg-neutral-800 py-1.5 text-white shadow-sm sm:text-sm sm:leading-6"
                        >
                        <option value="open">open</option>
                        <option value="close">close</option>
                        </select>
                    </div>

                    <div className="sm:col-span-3">
                        <label
                        htmlFor="number-of-seats"
                        className="block text-sm font-medium leading-6 text-white"
                        >
                        Email Domain
                        </label>
                        <input
                        autoComplete="off"
                        value={emailDomain}
                        onChange={(e) => setEmailDomain(e.target.value)}
                        className="mt-2 block w-full rounded-md border-none bg-neutral-800 py-1.5 text-white shadow-sm sm:text-sm sm:leading-6"
                        />
                    </div>

                    <div className="sm:col-span-6">
                      <label
                        htmlFor="username"
                        className="block text-sm font-medium leading-6 text-white"
                      >
                        Invite a Teacher
                      </label>
                      <div className="mt-2 flex rounded-md shadow-sm">
                        <input
                          name="username"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          id="username"
                          placeholder='johnDoe@ctfguide.com'
                          className="block w-full rounded-md border-none bg-neutral-800  py-1.5 text-white shadow-sm  sm:text-sm sm:leading-6"
                        />
                        <button className='ml-4 bg-blue-600 rounded-lg hover:bg-blue-600/50 text-white px-2 py-1' onClick={handleInviteLink}>invite</button>
                      </div>
                      <div className='bg-black rounded-lg p-2 mt-2 flex'>
                                    <p className='text-white' style={{fontSize: "15px", color: inviteActivated ? "white" : "gray"}}>{inviteLink}</p>
                                <div className='ml-auto'>
                                <i class="far fa-copy text-white hover:text-neutral-400 cursor-pointer"></i></div>
                                </div>
                    </div>

                    <div className="sm:col-span-6">
                      <label
                        className="block text-sm font-medium leading-6 text-white"
                      >
                        Add a subscription to classroom
                      </label>
                      <div className="mt-2 flex rounded-md shadow-sm">
                      <select
                          value={subType}
                          onChange={(e) => setSubType(e.target.value)}
                          className="block w-full rounded-md border-none bg-neutral-800 py-1.5 text-white shadow-sm sm:text-sm sm:leading-6"
                          >
                          <option value="None">None</option>
                          <option value="CTFGuidePro">CTFGuidePro</option>
                        </select>

                        <button className='ml-4 bg-blue-600 rounded-lg hover:bg-blue-600/50 text-white px-2 py-1' onClick={addSubscriptionToClass}>Add</button>
                        </div>
                    </div>


                    <div className="sm:col-span-6">
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium leading-6 text-white"
                      >
                        Classroom Description
                      </label>
                      <div className="mt-2">
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          id="bio"
                          name="bio"
                          rows={6}
                          className="block w-full rounded-md border-0 border-none bg-neutral-800 text-white shadow-sm  placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:py-1.5 sm:text-sm sm:leading-6"
                        />
                      </div>
                      <p className="mt-3 text-sm text-white">
                        Brief description for your classroom.
                      </p>
                    </div>

                    <div style={{width: "700px"}}>
                    <div >
                      <h1 className='text-xl text-white'> Students: </h1>
                      <div style={{display: "flex"}}>
                        <input
                          type="text"
                          value={searchInput}
                          onChange={e => setSearchInput(e.target.value)}
                          placeholder='Search for Student...'
                          className="mt-2 block w-full rounded-md border-none bg-neutral-800 py-1.5 text-white shadow-sm sm:text-sm sm:leading-6"
                        />

                        </div>
                          <br></br>
                      <div className='grid grid-cols-5 gap-x-4 gap-y-2'>
                          {
                              filteredOptions.map((student, idx) => {
                                  const i = idx % defaultImages.length;
                                  return (
                                      <div key={idx} style={{width: "140px", border: selectedStudent && selectedStudent.username === student.username ? "2px solid lightblue" : ""}} className='flex bg-neutral-900 rounded-lg items-center' onClick={() => setSelectedStudent(student)}>
                                      <img src={defaultImages[i]} className='ml-1 w-8 h-8 '></img>{" "}
                                      <h3 className='text-white ml-3 mt-2 pl-1' style={{marginLeft: "-5px"}}>{student.username}</h3>
                                      </div>
                                  );
                              })
                          }
                      </div>
                      </div>
                    </div>
                  </div>
                  <Transition.Root show={showOverlay} as={Fragment}>

                  <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={setShowOverlay}>

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
                              onClick={() => setShowOverlay(false)}
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
                                          <div className="mt-3 sm:mt-5 text-center mx-auto" style={{width: "350px"}}>
                                              <h2 className="text-white text-xl text-center">{messageOfConfirm}</h2>
                                          <br></br>
                                          <div className='w-full mx-auto text-center mt-4 pb-5' >
                                              <button onClick={handleConfirmClick} className='hover:bg-neutral-600/50 bg-neutral-800 text-white rounded-lg px-4 py-2'> Confirm </button>
                                              <button onClick={() => {setShowOverlay(false)}} className='px-4 py-2 ml-4 rounded-lg bg-neutral-800 hover:bg-neutral-600/50 text-white'>Cancel</button>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </Transition.Child>
                          </div>
                      </Dialog>
                      </Transition.Root>

                    <button onClick={() => {
                      setShowOverlay(true);
                      setMessageOfConfirm(actions[2]);
                      setIndex(2);
                      }} className="inline-flex justify-center rounded-md bg-blue-600 py-2 px-3 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                    Save
                    </button>

                    <button onClick={() => {
                      setShowOverlay(true);
                      setMessageOfConfirm(actions[3]);
                      setIndex(3);
                      }} style={{marginLeft: "25%", opacity: selectedStudent === null && "0.5"}} disabled={selectedStudent === null} className='ml-4 bg-pink-600 rounded-lg hover:bg-pink-600/50 text-white px-2 py-1'>remove {selectedStudent ? selectedStudent.username : "student"}</button>

                    <button onClick={() => {
                      setShowOverlay(true);
                      setMessageOfConfirm(actions[1]);
                      setIndex(1);
                      }}  className='ml-4 bg-yellow-600 rounded-lg hover:bg-yellow-600/50 text-white px-2 py-1'>Leave class</button>
                 

                    <button onClick={() => {
                      setShowOverlay(true);
                      setMessageOfConfirm(actions[0]);
                      setIndex(0);
                      }} className='ml-4 bg-red-600 rounded-lg hover:bg-red-600/50 text-white px-2 py-1'>Delete class</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Footer />
        </>
    );
}
