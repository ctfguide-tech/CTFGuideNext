import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
const STRIPE_KEY = "pk_test_51NyMUrJJ9Dbjmm7hji7JsdifB3sWmgPKQhfRsG7pEPjvwyYe0huU1vLeOwbUe5j5dmPWkS0EqB6euANw2yJ2yQn000lHnTXis7";

export default function StudentView({ uid, group }) {
    const baseUrl = "http://localhost:3001"; // switch to deployment api url

    const [classroom, setClassroom] = useState({});
    const [upgradeType, setUpgradeType] = useState("CTFGuideStudentEDUPaymentLink");
    const [isUpgraded, setIsUpgraded] = useState(false);
    const [paymentLink, setPaymentLink] = useState("");

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
              const upgraded = data.body.upgrades.some(i => (i.name === "CTFGuideStudentEDU" && i.userId === uid) || i.name === "CTFGuideInstitutionEDU");
              setIsUpgraded(upgraded);
            } else {
              console.log("Error when getting classroom info");
            }
        };
        getClassroom();
    }, []);


    const viewProfile = student => {
        console.log("Link to a page to view this students profile");
    }

    const leaveClass = async () => {
        try {
            const classroomId = classroom.id;
            const url = `${baseUrl}/classroom/leave`;
            const response = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ isTeacher: false, classroomId, userId: uid })
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

    const viewGrades = () => {
        // see the students grades
    }

    const studentUpgrade = async () => {
        if(upgradeType === "None") return;
        try {
            if(upgradeType.includes("PaymentLink")) {
                const response = await fetch(`${baseUrl}/classroom/upgrade`, {
                    method: 'POST',
                    body: JSON.stringify({
                    upgradeType: upgradeType.split("PaymentLink")[0],
                    numberOfSeats: 1,
                    classroomId: classroom.id,
                    userId: uid
                }),
                headers: {
                'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if(data.success) {
                setPaymentLink(data.body);
                console.log(data.body);
            }
        } else {
            const stripe = await loadStripe(STRIPE_KEY);
            const response = await fetch(`${baseUrl}/payments/stripe/create-checkout-session`, {
              method: 'POST',
              body: JSON.stringify({
                subType: upgradeType,
                quantity: 1,
                uid: uid,
                operation: "classroomUpgrade",
                data: { classroomId: classroom.id }
              }),
              headers: {
                'Content-Type': 'application/json'
              }
            });
            const session = await response.json();
            if(session.success) {
              await stripe.redirectToCheckout({ sessionId: session.sessionId });
            } else {
              console.log("Error:", session.message);
            }
          }
        } catch(error) {
          console.log(error);
        }
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
                        {
                            isUpgraded && <i className="fa fa-star" style={{color: "yellow", fontSize: "25px", paddingLeft: "10px"}}></i>
                        }
                        <div className='ml-auto'>
                        <button onClick={leaveClass} className='ml-4 bg-orange-600 rounded-lg hover:bg-orange-600/50 text-white px-2 py-1'> Leave</button>
                        {
                            !isUpgraded && <button onClick={studentUpgrade} className='ml-4 bg-blue-600 rounded-lg hover:bg-blue-600/50 text-white px-2 py-1'> Upgrade</button>
                        }
                   </div>
                </div>
                <div className='grid grid-cols-6 mt-4 gap-x-4'>
                    <div className='border-t-8 border-blue-600 col-span-4 bg-neutral-800/50 px-4 py-3 rounded-lg '>
                    {/* LOOPING THROUGH MEMBERS */}
                    <h1 className='text-xl text-white font-semibold'> Members</h1>
                        <div className='grid grid-cols-3 gap-x-2 gap-y-2'>
                        {
                            classroom.teachers && classroom.teachers.length === 0
                            ? <div style={{color: "white"}}>No teachers yet...</div>
                            : classroom.teachers &&
                            classroom.teachers.map((teacher, idx) => {
                                const i = defaultImages.length-1 - idx % defaultImages.length;
                                return (
                                    <div key={idx}  className='flex bg-neutral-900 rounded-lg items-center'>
                                    <img src={defaultImages[i]} className='ml-1 w-10 h-10 '></img>{" "}
                                    <h1 className='text-white ml-6 mt-2 pl-1'> <i className="fas fa-user-shield"></i> {teacher.username}</h1>
                                    </div>
                                );
                            })
                        }
                        {
                            classroom.students &&
                            classroom.students.map((student, idx) => {
                                const i = idx % defaultImages.length;
                                return (
                                    <div key={idx} className='flex bg-neutral-900 rounded-lg items-center'>
                                    <img src={defaultImages[i]} className='ml-1 w-10 h-10 '></img>{" "}
                                    <h1 className='text-white ml-6 mt-2 pl-1'>{student.username}</h1>
                                    </div>
                                );
                            })
                        }
                        </div>

                        <br></br>

                                <br></br>
                    <h1 className='text-xl text-white font-semibold'> Course Description </h1>
                    <div style={{color: "white", cursor: "default"}} className='bg-neutral-900 hover:bg-neutral-900/50 cursor-pointer  p-3 rounded-sm mb-4'>{classroom.description}</div>

                    </div>
                    <div className='border-blue-600 border-t-8  col-span-2  bg-neutral-800/50 px-4 py-3 rounded-lg'>
                    <h1 className='text-xl text-white font-semibold'>Assignments</h1>
                <div className='mt-1 '>
                        {demoAssignments.map(assignment => (
                            <div key={assignment.id} onClick={() => {window.location.href = "/assignments/testingfun"}} className='bg-neutral-900 hover:bg-neutral-900/50 cursor-pointer  p-3 rounded-sm  mb-4'>
                                <h2 className='text-lg text-white'>{assignment.title}</h2>
                                <p className='text-white'>{assignment.description}</p>
                                <p className='text-white'>Due Date: {assignment.dueDate}</p>
                            </div>
                        ))}

                        <button className='bg-neutral-900 text-white rounded-sm w-full px-2 py-1'>View All</button>
                    </div>
                    </div>
                    <br></br>
                    <div className='col-span-6 border-l border-neutral-800 bg-neutral-800/50 px-4 py-3 rounded-lg'>
                        <div className='flex items-center'>
                            <h1 className='text-xl text-white'>Announcements</h1>
                        </div>
                        <ul style={{color: "white", padding: "0", margin: "0", height: "300px", overflowY: "auto"}}>

                            {
                                classroom.announcements && classroom.announcements.slice().reverse().map((announcementObj, idx) => {
                                    return (
                                        <div style={{position: 'relative'}} key={idx}>
                                        <li className='bg-neutral-900 hover:bg-neutral-900/50 cursor-pointer p-3 rounded-lg mb-4' style={{marginLeft: '10px', marginTop: "10px", cursor: "default"}}>
                                            <span style={{fontSize: "13px"}}>{new Date(announcementObj.createdAt).toLocaleDateString()}</span> <br></br> <span style={{fontSize: "17px"}}>{announcementObj.message}</span>
                                        </li>
                                        <span onClick={() => deleteAnnouncement(announcementObj.id)} style={{fontSize: "15px", position: 'absolute', right: '0', paddingRight: "10px", bottom: '0', cursor: "pointer"}}>
                                        </span>
                                        </div>
                                    )
                                })
                            }
                        </ul>
                    </div>
                </div>
                </div>
                </div>

            <Footer />
        </>
    );
}
