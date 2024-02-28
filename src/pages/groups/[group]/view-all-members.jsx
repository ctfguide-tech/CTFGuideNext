import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import React from 'react';
import { useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import StudentNav from '@/components/groups/studentNav';
import { useRouter } from 'next/router';
import ClassroomNav from '@/components/groups/classroomNav';
import request from '@/utils/request';



const ViewAllMembers = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const router = useRouter();
    const { group } = router.query;
    const [classroom, setClassroom] = useState({});
    const [loadingAuth, setLoadingAuth] = useState(true);
    const [isTeacher, setIsTeacher] = useState(false);





    const auth = async (classCode) => {
        const url = `${baseUrl}/classroom/auth/${classCode}`;
        const res = await request(url, 'GET', null);
        if (!res) setIsTeacher(false);
        setIsTeacher(res.success && res.isTeacher);
    };

    const getClassroom = async (classCode) => {
        const url = `${baseUrl}/classroom/classroom-by-classcode/${classCode}`;
        const data = await request(url, 'GET', null);
        if (data && data.success) {
            setClassroom(data.classroom);
        } else {
            console.log("Error fetching classroom");
            console.log("classCode", classCode);
        }
    };

    useEffect(() => {
        if (group) {
            setLoadingAuth(true);
            auth(group);
            getClassroom(group);
        }
    }, [group]);


    return (
        <>
            <Head>
                <title>Members - CTFGuide</title>
                <style>
                    @import
                    url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
                </style>
            </Head>
            <StandardNav />
            {!isTeacher ? <StudentNav classCode={group} /> :
                <div className="bg-neutral-800">
                    <div className=" mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-10 justify-between">
                            {isTeacher && <ClassroomNav classCode={group} />}
                            <div className="flex items-center">
                                {isTeacher &&
                                    <button
                                        onClick={() => {
                                            setViewCreateAssignment(true);
                                        }}
                                        className="rounded-lg bg-neutral-800/80 px-4 py-0.5 text-white "
                                    >
                                        <i className="fas fa-plus-circle pe-2"></i> New Assignment
                                    </button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            }
            <div className="mx-auto mt-6   max-w-6xl  justify-center">
                <h1 className="mt-4 text-xl font-semibold text-white">
                    Teachers
                </h1>
                <hr className="rounded-lg border border-blue-600 bg-neutral-900 mb-3" />
                <div className="grid grid-cols-1 gap-x-4 gap-y-2">
                    {classroom.teachers && classroom.teachers.length === 0 ? (
                        <div style={{ color: 'white' }}>No teachers yet...</div>
                    ) : (
                        classroom.teachers &&
                        classroom.teachers.map((teacher, idx) => {
                            const i =
                                defaultImages.length - 1 - (idx % defaultImages.length);
                            return (
                                <div
                                    key={idx}
                                    className="flex items-center space-x-2 rounded-lg "
                                >
                                    <img
                                        src={defaultImages[i]}
                                        className="h-10 w-10 rounded-full border border-neutral-800 bg-neutral-700" // Make image circular
                                        alt={`Teacher ${teacher.username}`}
                                    />
                                    <h1 className="truncate text-white">
                                        <i className="fas fa-user-shield"></i>{' '}
                                        {teacher.firstName} {teacher.lastName}
                                    </h1>
                                </div>
                            );
                        })
                    )}


                    <h1 className="mt-4 text-xl font-semibold text-white">
                        Students
                    </h1>
                    <hr className="rounded-lg border border-blue-600 bg-neutral-900 mb-3" />
                    {classroom.students &&
                        classroom.students.map((student, idx) => {
                            const i = idx % defaultImages.length;
                            return (
                                <div
                                    key={idx}
                                    className="flex items-center space-x-2 rounded-lg  "
                                >
                                    <img
                                        src={defaultImages[i]}
                                        className="h-10 w-10 rounded-full border border-neutral-800 bg-neutral-700" // Make image circular
                                        alt={`Student ${student.username}`}
                                    />
                                    <h1 className="text-white">{student.firstName} {student.lastName}</h1>
                                </div>
                            );
                        })}
                </div>

            </div>

            <Footer />
        </>
    );


};
export default ViewAllMembers;