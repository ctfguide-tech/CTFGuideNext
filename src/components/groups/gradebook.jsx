import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { useEffect, useState } from 'react';
import StudentGradeCard from '@/components/StudentGradeCard';
// ABHI is a sex god
import { useRouter } from 'next/router';


const Gradebook = () => {
    const router = useRouter();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
    const [students, setStudents] = useState([]);
    const [assignments, setAssignments] = useState([])

    useEffect(() => {
        const params = window.location.href.split('/');
        const id = params[5];
        const classCode = params[4];
        const validateUid = async () => {
            // make sure that this user is a teacher
        }
        const getStudents = async () => {
            try {
                var requestOptions = {
                    method: 'GET'
                };
                console.log(classCode)
                const response = await fetch(`${baseUrl}/classroom/getStudents/${classCode}`, requestOptions)
                const data = await response.json();
                console.log(data);
                if(data.success) {
                    setStudents(data.body.students);
                } else {
                    console.log(data)
                }
            } catch(err) {
                console.log(err);
            }
        }

        const getAssignments = async () => {
            try {
                var requestOptions = {
                    method: 'GET'
                };
                console.log(classCode)
                const response = await fetch(`${baseUrl}/classroom/classroom-by-classcode?classCode=${classCode}`, requestOptions)
                const data = await response.json();
                console.log(data);
                if(data.success) {
                    setAssignments(data.body.assignments);
                } else {
                    console.log(data)
                }
            } catch(err) {
                console.log(err);
            }
        }

        if (classCode) {
            getStudents();
            getAssignments();
        }
    }, []);
    // each student object has an array of submissions and each submission is linked to a class
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
           <div>
                {
                    assignments.map((assignment, idx) => {
                        return (
                            <div key={idx} style={{color: "white"}}>{assignment.name}</div>
                        )
                    })
                }
                {
                    students && students.map((student, idx) => {
                        return (
                            <div key={idx}><StudentGradeCard student={student} /></div>
                        )
                    })
                }
           </div>
            <Footer />
        </>
    );
};

export default Gradebook;




