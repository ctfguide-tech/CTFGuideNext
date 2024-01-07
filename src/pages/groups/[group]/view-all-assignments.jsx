import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const baseClientUrl = `localhost:3000`;

const ViewAllAssignments = () => {
    const [classroom, setClassroom] = useState({});

    const getClassroom = async () => {
        const params = window.location.href.split('/');
        const url = `${baseUrl}/classroom/classroom-by-classcode?classCode=${params[4]}`;
        const requestOptions = {
            method: 'GET',
        };
        const response = await fetch(url, requestOptions);
        const data = await response.json();
        if (data.success) {
            setClassroom(data.body);
        } else {
            console.log('Error when getting classroom info');
        }
    };

    useEffect(() => {
        getClassroom();
    }, []);

    return (
        <>
            <Head>
                <title>Assignments - CTFGuide</title>
                <meta name="description" content="Cybersecurity made easy for everyone" />
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                </style>

            </Head>
            <StandardNav />
            <div className='max-w-6xl mx-auto grid grid-cols-3 gap-x-8 flex justify-center mt-6'>
            <h1 className="text-2xl font-semibold mx-auto text-white">Assignments</h1>
            </div>
            

            <div className='max-w-6xl mx-auto grid grid-cols-3 gap-x-8 flex justify-center mt-10'>
                <div className='text-white'>Collumn 1</div>

                <div className='mt-1'>
                    <h2 className="text-lg font-semibold text-white mb-4">Upcoming Assignments</h2>
                    {classroom &&
                        classroom.assignments &&
                        classroom.assignments
                            .filter(assignment => new Date(assignment.dueDate) > new Date())
                            .map(assignment => (
                                <div
                                    key={assignment.id}
                                    onClick={() => {
                                        window.location.href = '/assignments/' + assignment.id;
                                    }}
                                    className="mb-2 border-l-4 border-gray-600 cursor-pointer rounded-sm bg-neutral-800/50 px-3 py-3 hover:bg-neutral-800"
                                >
                                    {/* Make assignment box look pretty */}
                                </div>
                            ))}
                </div>

                <div className='text-white'>Collumn 3</div>
            </div>

            <div className='max-w-6xl mx-auto grid grid-cols-3 gap-x-8 flex justify-center mt-10'>
                <div className='text-white'>Collumn 1</div>

                <div className='mt-1'>
                    <h2 className="text-lg font-semibold text-white mb-4">Past Assignments</h2>
                    {classroom &&
                        classroom.assignments &&
                        classroom.assignments
                            .filter(assignment => new Date(assignment.dueDate) < new Date())
                            .map(assignment => (
                                <div
                                    key={assignment.id}
                                    onClick={() => {
                                        window.location.href = '/assignments/' + assignment.id;
                                    }}
                                    className="mb-2 border-l-4 border-green-600 cursor-pointer rounded-sm bg-neutral-800/50 px-3 py-3 hover:bg-neutral-800"
                                >
                                    {/* Make assignment look pretty*/}
                                </div>
                            ))}
                </div>

                <div className='text-white'>Collumn 3</div>
            </div>


            <Footer />
        </>
    );
};

export default ViewAllAssignments;
