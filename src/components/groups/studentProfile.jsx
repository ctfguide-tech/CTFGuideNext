

import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { useEffect, useState } from 'react';

export default function studentProfile({ uidOfTeacher, classroom, student, children }) {
    const baseUrl = "http://localhost:3001";
    const assignments = [
        {title: "Assignment 1", status: "on time", grade: 87, dueDate: "1/25/12"},
        {title: "Assignment 2", status: "on time",grade: 93, dueDate: "1/26/12"},
        {title: "Assignment 3", status: "on time",grade: 95, dueDate: "1/25/12"},
        {title: "Assignment 4", status: "on time",grade: 95, dueDate: "1/25/12"},
        {title: "Assignment 5", status: "late",grade: 80, dueDate: "2/26/12"},
        {title: "Assignment 6", status: "on time",grade: 96, dueDate: "2/27/12"},
        {title: "Assignment 7", status: "on time",grade: 97, dueDate: "2/28/12"},
        {title: "Assignment 8", status: "on time",grade: 98, dueDate: "2/29/12"},
        {title: "Assignment 8", status: "on time",grade: 98, dueDate: "2/29/12"},
        {title: "Assignment 8", status: "late",grade: 98, dueDate: "2/29/12"},
        {title: "Assignment 8", status: "late",grade: 98, dueDate: "2/29/12"},
        {title: "Assignment 8", status: "on time",grade: 98, dueDate: "2/29/12"},
        {title: "Assignment 8", status: "on time",grade: 98, dueDate: "2/29/12"},
        {title: "Assignment 8", status: "on time",grade: 98, dueDate: "2/29/12"},
    ]

    const removeStudent = async () => {
        try {
            const classroomId = classroom.id;
            const userId = student.uid;
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
                        <h1 className='text-white text-3xl font-semibold'>{student.firstName} {student.lastName}  ({student.username})</h1>
                        <div className='ml-auto'>
                        <button onClick={removeStudent} style={{background: "red"}} className='bg-blue-600 rounded-lg hover:bg-blue-600/50 text-white px-2 py-1'>Remove Student</button>

                    </div>
                </div>


                <div className='grid grid-cols-6 mt-4 gap-x-4' style={{backgroundColor: '#333', color: '#fff'}}>
                <div className='col-span-4 bg-neutral-800/50 px-4 py-3 rounded-lg '>
                <div style={{color: "white", fontSize: '20px', fontWeight: 'bold'}}>Overall Grade Grade: A+</div>
                <div style={{color: "white", fontSize: '20px', fontWeight: 'bold'}}>Status: {student.status}</div>
                <div className='grid grid-cols-5 mt-4 gap-x-4' style={{color: "white", fontSize: '18px', fontWeight: 'bold'}}>
                    <div>Name</div>
                    <div>Due</div>
                    <div>Status</div>
                    <div>Score</div>
                </div>
                <div style={{overflow: 'auto', maxHeight: '500px', minHeight: "500px"}}>
                    {assignments.map((assignment, index) => (
                        <div key={index} className='grid grid-cols-5 gap-x-4' style={{backgroundColor: '#444', marginTop: '10px', padding: '10px'}}>
                            <div style={{color: "white"}}>{assignment.title}</div>
                            <div style={{color: "white"}}>{assignment.dueDate}</div>
                            <div style={{color: "white"}}>{assignment.status}</div>
                            <div style={{color: "white"}}>{assignment.grade}/100</div>
                            <div style={{display: 'flex', justifyContent: 'space-between'}}> 
                                <button className='bg-yellow-600 rounded-lg hover:bg-yellow-600/50 text-white px-2 py-1'>Edit</button>
                                <button className='bg-red-600 rounded-lg hover:bg-red-600/50 text-white px-2 py-1'><i className="fas fa-trash" ></i></button>
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{padding: "10px", paddingTop: "15px"}}>{children}</div>
                </div>



                    <div className='col-span-2 border-l border-neutral-800 bg-neutral-800/50 px-4 py-3 rounded-lg'>

                    <h1 className='text-xl text-white'>Ungraded assignments</h1>
   {/* <div className='mt-4'>
                        {demoAssignments.map(assignment => (
                            <div key={assignment.id} onClick={() => {window.location.href = "/assignments/testingfun"}} className='bg-neutral-900 hover:bg-neutral-900/50 cursor-pointer  p-3 rounded-lg mb-4'>
                                <h2 className='text-lg text-white'>{assignment.title}</h2>
                                <p className='text-white'>{assignment.description}</p>
                                <p className='text-white'>Due Date: {assignment.dueDate}</p>
                            </div>
                        ))}
                    </div> */}
                    </div>
                   </div>
                    
                </div>



            </div>


            <Footer />
        </>
    );
}
