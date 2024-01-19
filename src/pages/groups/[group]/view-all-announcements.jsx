import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import React from 'react';
import { useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import Announcements from '@/components/groups/announcements';


import { useRouter } from 'next/router';

import ClassroomNav from '@/components/groups/classroomNav';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const ViewAllAnnouncements = () => {
    const [classroom, setClassroom] = useState({});
    const [isTeacher, setIsTeacher] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    const getClassroom = async () => {
        const params = window.location.href.split('/');
        console.log(params);
        const url = `${baseUrl}/classroom/classroom-by-classcode?classCode=${params[4]}`;
        const requestOptions = {
            method: 'GET',
        };
        const response = await fetch(url, requestOptions);
        const data = await response.json();
        if (data.success) {
            setClassroom(data.body);
            const isAuth = auth(data.body);
            if (!isAuth) {
                router.replace('/groups');
            }
        } else {
            console.log('Error when getting classroom info');
        }
    };

    const auth = (classroom) => {
        const uid = localStorage.getItem('uid');
        const isStudent = classroom.students.map(
            (student) => uid === student.uid
        )[0];
        const isTeacher = classroom.teachers.map(
            (teacher) => uid === teacher.uid
        )[0];
        if (!(isStudent || isTeacher)) {
            return false;
        } else {
            setIsTeacher(isTeacher);
            return true;
        }
    };

    useEffect(() => {
        getClassroom();
    }, []);

    return (
        <>
            <Head>
                <title>View all Announcements - CTFGuide</title>
                <style>
                    @import
                    url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
                /* bold */
                </style>
            </Head>
            <StandardNav />
            <div className="bg-neutral-800">
                <div className=" mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-10 justify-between">
                        {isTeacher && classroom && <ClassroomNav classCode={classroom.classCode} />}
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
            <div className="mx-auto mt-6   max-w-6xl  justify-center ">
                <h1 className="mx-auto text-2xl font-semibold text-white">
                    Announcements
                </h1>
                {classroom && classroom.announcements && (
                <Announcements
                  isTeacher={true}
                  classCode={classroom.classCode}
                  announcementsProp={classroom.announcements}
                  isModalOpen={isModalOpen}
                  setIsModalOpen={setIsModalOpen}
                />
              )}
                    
            </div>
            <Footer />
        </>
    )
};

export default ViewAllAnnouncements;