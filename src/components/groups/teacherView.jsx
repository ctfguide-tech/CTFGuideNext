import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { useEffect, useState } from 'react';
import { Transition, Fragment, Dialog } from '@headlessui/react';
import { loadStripe } from '@stripe/stripe-js';
import StudentProfile from '@/components/groups/studentProfile';
import Modal from './Modal';

export default function TeacherView({ uid, group }) {
    const baseUrl = "http://localhost:3001"; // switch to deployment api url

    const [classroom, setClassroom] = useState({});
    const [inviteEmail, setInviteEmail] = useState('');
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [color, setColor] = useState('gray');
    const [inviteLink, setInviteLink] = useState('');
    const [openClass, setOpenClass] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    
    const defaultImages = [
        "https://robohash.org/pranavramesh",
        "https://robohash.org/laphatize",
        "https://robohash.org/stevewilkers",
        "https://robohash.org/rickast",
        "https://robohash.org/picoarc",
        "https://robohash.org/jasoncalcanis",
    ];

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

    useEffect(() => {
        const getClassroom = async () => {
            const classroomCode = group;
            const url = `${baseUrl}/classroom/classroom-by-classcode?classCode=${classroomCode}`;
            const response = await fetch(url);
            const data = await response.json();
            if(data.success) {
              setClassroom(data.body);
              setOpenClass(data.body.open);
            } else {
              console.log("Error when getting classroom info");
            }
        };
        getClassroom();
    }, []);

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


    const handleInvite = async () => {
        setColor('gray');
        setMessage("Invite link: ");
        setInviteLink('generating...');
        const email = inviteEmail;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(email)) {
            setColor("lightgreen");
            setMessage("Your invite link: ");
            const url = `${baseUrl}/classroom/getAccessToken?classCode=${classroom.classCode}&email=${email}`;
            const response = await fetch(url);
            const data = await response.json();
            if(data.success) {
                setColor("lightgreen");
                setInviteLink(`localhost:3000/groups/invites/${classroom.classCode}/${data.body}`);
            } else {
              setMessage(data.message);
              setColor("red");
              setInviteLink('');
            }
        } else {
            setColor("red");
            setMessage("Invalid email");
            setInviteLink('');
        }
    };


    const addSeatToClass = async () => {
        try {
            const classroomId = classroom.id;
            const pricingPlan = classroom.pricingPlan;
            const url = `${baseUrl}/classroom/add-seat`;
            const response = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ pricingPlan, classroomId, seatsToAdd: 1 })
            });
            const data = await response.json();
            if(data.success) {
                if(data.sessionId) {
                    const stripe = await loadStripe("pk_test_51NyMUrJJ9Dbjmm7hji7JsdifB3sWmgPKQhfRsG7pEPjvwyYe0huU1vLeOwbUe5j5dmPWkS0EqB6euANw2yJ2yQn000lHnTXis7");
                    await stripe.redirectToCheckout({ sessionId: data.sessionId });
                } else {
                    console.log("Seat has been updated");
                    window.location.href = `/groups/${classroom.classCode}/${uid}`;
                }
            } else {
                console.log("Error when adding seat");
            }
        } catch(err) {
            console.log(err);
        }
    }

    const handleToggle = async () => {
        try {
            const classroomId = classroom.id;
            const pricingPlan = classroom.pricingPlan;
            const url = `${baseUrl}/classroom/open-close`;
            const response = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ classroomId, isOpen: openClass })
            });
            const data = await response.json();
            if(data.success) {
                console.log("Class open status toggled");
            } else {
                console.log(data.message);
            }
        } catch(err) {
            console.log(err);
        }
        setOpenClass(!openClass);
    };

    const leaveClass = async () => {
        try {
            const classroomId = classroom.id;
            const url = `${baseUrl}/classroom/leave`;
            const response = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ isTeacher: true, classroomId, userId: uid })
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

    if(selectedStudent) {
        return <StudentProfile uidOfTeacher={uid} student={selectedStudent} classroom={classroom}>
            <button onClick={() => setSelectedStudent(null)} style={{margin: "0px"}} className='ml-4 bg-blue-600 rounded-lg hover:bg-blue-600/50 text-white px-2 py-1'>Back to classroom</button>
        </StudentProfile>
    }

    const createAnnouncement = async message => {
        try {
            if(message.length < 1) return;
            const classroomId = classroom.id;
            const url = `${baseUrl}/classroom/announcements`;
            const response = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ classroomId, message })
            });
            const data = await response.json();
            console.log(data.message);
        } catch(err) {
            console.log(err);
        }
        setIsModalOpen(false);
    };

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
                    <div className='flex'>
                        <h1 className='text-white text-3xl font-semibold'>{classroom.name}</h1>
                        <div className='ml-auto'>
                        <button className='bg-blue-600 rounded-lg hover:bg-blue-600/50 text-white px-2 py-1'>Create Assignment</button>
                        <button className='ml-4 bg-blue-600 rounded-lg hover:bg-blue-600/50 text-white px-2 py-1'>Create Lab</button>
                        <button onClick={addSeatToClass} className='ml-4 bg-blue-600 rounded-lg hover:bg-blue-600/50 text-white px-2 py-1'>Add Seat</button>
                        <button onClick={() => setOpen(true)} className='ml-4 bg-blue-600 rounded-lg hover:bg-blue-600/50 text-white px-2 py-1'>Invite</button>
                        <button onClick={handleDelete} style={{backgroundColor: "red"}}className='ml-4 bg-blue-600 rounded-lg hover:bg-blue-600/50 text-white px-2 py-1'>Delete</button>
                        <button onClick={handleToggle} style={{backgroundColor: "gray"}} className='ml-4 bg-blue-600 rounded-lg hover:bg-blue-600/50 text-white px-2 py-1'>{openClass ? "close" : "open"}</button>
                        <button onClick={leaveClass} style={{backgroundColor: "orange"}} className='ml-4 bg-blue-600 rounded-lg hover:bg-blue-600/50 text-white px-2 py-1'>Leave</button>
                        <button className='ml-4 bg-blue-600 rounded-lg hover:bg-blue-600/50 text-white px-2 py-1' onClick={handleOpenModal}>Announcements</button>
                        {isModalOpen ? <Modal isOpen={isModalOpen} onClose={handleCloseModal} createAnnouncement={createAnnouncement}></Modal> : ""}
                            
                    </div>
                </div>
                <div className='grid grid-cols-6 mt-4 gap-x-4'>
                    <div className='col-span-4 bg-neutral-800/50 px-4 py-3 rounded-lg '>
                    {/* LOOPING THROUGH MEMBERS */}
                    <h1 className='text-xl text-white'> Members: </h1>
                        <div className='grid grid-cols-3 gap-x-2 gap-y-2'>
                        {
                            classroom.teachers && classroom.teachers.length === 0
                            ? <div style={{color: "white"}}>No teachers yet...</div>
                            : classroom.teachers &&
                            classroom.teachers.map((teacher, idx) => {
                                const i = defaultImages.length-1 - idx % defaultImages.length;
                                return (
                                    <div key={idx} style={{border: "2px solid gold"}} className='flex bg-neutral-900 rounded-lg items-center'>
                                    <img src={defaultImages[i]} className='ml-1 w-10 h-10 '></img>{" "}
                                    <h1 className='text-white ml-6 mt-2 pl-1'>{teacher.username}</h1>
                                    </div>
                                );
                            })
                        }
                        {
                            classroom.students ?
                            classroom.students.map((student, idx) => {
                                const i = idx % defaultImages.length;
                                return (
                                    <div key={idx} className='flex bg-neutral-900 rounded-lg items-center' style={{cursor: "pointer"}} onClick={() => setSelectedStudent(student)}>
                                    <img src={defaultImages[i]} className='ml-1 w-10 h-10 '></img>{" "}
                                    <h1 className='text-white ml-6 mt-2 pl-1'>{student.username}</h1>
                                    </div>
                                );
                            }) : ""
                        }
                        </div>

                        <br></br>
                        <p className='text-white mt-10'>Invite students to your group by sharing the link below.</p>
                                <div className='bg-black rounded-lg p-2 mt-2 flex'>
                                    <p className='text-white'>https://ctfguide/{classroom.classCode}</p>
                                <div className='ml-auto'>
                                <i class="far fa-copy text-white hover:text-neutral-400 cursor-pointer"></i></div>
                                </div>

                                <br></br>
                    <h1 className='text-xl text-white'> About this course: </h1>
                    <br></br>
                    <div style={{color: "white"}} className='bg-neutral-900 hover:bg-neutral-900/50 cursor-pointer  p-3 rounded-lg mb-4'>{classroom.description}</div>

                    </div>
                    <div className='col-span-2 border-l border-neutral-800 bg-neutral-800/50 px-4 py-3 rounded-lg'>
                    <h1 className='text-xl text-white'>Assignments</h1>
                <div className='mt-4'>
                        {demoAssignments.map(assignment => (
                            <div key={assignment.id} onClick={() => {window.location.href = "/assignments/testingfun"}} className='bg-neutral-900 hover:bg-neutral-900/50 cursor-pointer  p-3 rounded-lg mb-4'>
                                <h2 className='text-lg text-white'>{assignment.title}</h2>
                                <p className='text-white'>{assignment.description}</p>
                                <p className='text-white'>Due Date: {assignment.dueDate}</p>
                            </div>
                        ))}
                    </div>
                    </div>
                    <br></br>
                    <div className='col-span-6 border-l border-neutral-800 bg-neutral-800/50 px-4 py-3 rounded-lg'>
                    <h1 className='text-xl text-white'>Announcements:</h1>
                        <ul style={{color: "white", padding: "0", margin: "0", height: "300px", overflowY: "auto"}}>
                        {
                            classroom.announcements ? classroom.announcements.slice().reverse().map((announcement, idx) => {
                                return (
                                    <li key={idx} className='bg-neutral-900 hover:bg-neutral-900/50 cursor-pointer  p-3 rounded-lg mb-4' style={{marginLeft: '10px', marginTop:  "10px", cursor: "default"}}>
                                        <span style={{fontSize: "13px"}}>{new Date(announcement.createdAt).toLocaleDateString()}</span> <br></br> <span style={{fontSize: "17px"}}>{announcement.message}</span>
                                    </li>
                                )
                            }) : ""
                        }
                        </ul>
                    </div>
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
                                    <h1 className="text-white text-xl text-center"> Invite by Email</h1>
                                    <input id="email" style={{width: '250px'}} value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} className='mt-2 py-0.5 bg-neutral-800  rounded-lg outline-none focus:outline-none  focus:ring-0  focus:border-transparent text-sm border-transparent  cursor-outline-none  text-white  ' placeholder='example@ctfguide.com'></input>
                                <br></br>
                                <div className='w-full mx-auto text-center mt-4 pb-5' >
                                    <button onClick={handleInvite} className='hover:bg-neutral-600/50 bg-neutral-800 text-white rounded-lg px-4 py-2'> invite </button><button onClick={() => {setOpen(false)}} className='px-4 py-2 ml-4 rounded-lg bg-neutral-800 hover:bg-neutral-600/50 text-white'>Cancel</button>
                                     <div style={{color: color, marginTop: "10px"}}>{message}</div>
                                     <div style={{color: 'white', marginTop: "10px"}}>{inviteLink}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
            </Transition.Root>

            <Footer />
        </>
    );
}



