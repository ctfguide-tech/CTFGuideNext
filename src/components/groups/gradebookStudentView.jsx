import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { useEffect, useState } from 'react';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const GradebookStudentView = ({ userId, classroomId }) => {
    const [submissions, setSubmissions] = useState([]);
    const [assignments, setAssignments] = useState([]);



    const getSubmissions = async (userId, classroomId) => {
        try {
            const url = baseUrl + '/submission/getStudentSubmissions/' + userId + '/' + classroomId;
            var requestOptions = {
                method: 'GET',
            };
            const response = await fetch(url, requestOptions);
            const data = await response.json();
            if (data.success) {
                setSubmissions(data.body);
            }

        } catch (err) {
            console.log(err);
        }

    };

    const getAssignments = async (classroomId) => {
        try {
            const url = baseUrl + '/assignments/fetch-assignments/' + classroomId;
            var requestOptions = {
                method: 'GET',
            };
            const response = await fetch(url, requestOptions);
            const data = await response.json();
            if (data.success) {
                setAssignments(data.body);
            }

        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getSubmissions(userId, classroomId);
    }, []);

    useEffect(() => {
        getAssignments(classroomId);
    }, []);






    return (
        <>
            <Head>
                <title>Gradebook - CTFGuide</title>
                <style>
                    @import
                    url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
                </style>
            </Head>
            <StandardNav />

            <div className = "max-w-6xl mx-auto mt-10">

            <div className='flex'>
                <h1 className='text-3xl font-semibold text-white'>Gradebook</h1>
                <div className='ml-auto'>
                    <button
                        onClick={() => (window.location.href = ``)}
                        className=" rounded-lg bg-blue-600 px-2 py-1 text-white hover:bg-blue-600/50"
                        style={{
                            fontSize: '15px',
                        }}
                    >
                        <i className="fa fa-arrow-left" style={{ color: 'white' }}></i> Back
                    </button>
                </div>
            </div>
    


            </div>

            <Footer />
        </>
    );

};

export default GradebookStudentView;