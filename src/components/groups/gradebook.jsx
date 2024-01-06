import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { useEffect, useState } from 'react';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const Gradebook = ({ classroomId }) => {
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const getStudentsSubmissionsFinalGrades = async (classroomId) => {
    try {
      const url =
        baseUrl +
        '/submission/getStudentsSubmissionsFinalGrades/' +
        classroomId;
      var requestOptions = {
        method: 'GET',
      };
      const response = await fetch(url, requestOptions);
      const data = await response.json();
      if (data.success) {
        setStudents(data.body);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getAssignments = async () => {
    try {
      const params = window.location.href.split('/');
      const classCode = params[4];
      var requestOptions = {
        method: 'GET',
      };
      console.log(classCode);
      const response = await fetch(
        `${baseUrl}/classroom/classroom-by-classcode?classCode=${classCode}`,
        requestOptions
      );
      const data = await response.json();
      if (data.success) {
        setAssignments(data.body.assignments);
        await getStudentsSubmissionsFinalGrades(data.body.id);
      } else {
        console.log(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAssignments();
  }, []);

  const refresh = () => {
    getAssignments();
  };

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



      <div className="max-w-6xl mx-auto mt-10">



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
      <div class="mt-4 mx-auto text-white flex items-center justify-center pb-10 rounded-sm">
  <table class="min-w-full divide-y divide-neutral-700">
    <thead class="bg-neutral-800 rounded-sm">
      <tr>
        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
          Student
        </th>
        {assignments.map((assignment) => (
          <th key={assignment.id} scope="col" class="cursor-pointerpx-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
            {assignment.name}
          </th>
        ))}
        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
          Final Grade
        </th>
      </tr>
    </thead>
    <tbody>
      {students.map((student, index) => (
        <tr key={index} class="bg-neutral-800 hover:bg-neutral-700">
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
            {student.name}
          </td>
          {assignments.map((assignment) => (
            <td
              key={assignment.id}
              class={`px-6 py-4 whitespace-nowrap text-sm ${
                student[assignment.name].grade === null ? 'text-yellow-400' : 'text-green-400'
              }`}
            >
              {student[assignment.name].grade === null ? 'N/A' : `${student[assignment.name].grade}/${student[assignment.name].total}`}
            </td>
          ))}
          <td class="px-6 py-4 whitespace-nowrap text-sm text-white">
            {student.finalGrade === null ? 'N/A' : `${student.finalGrade}%`}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

</div>


      <Footer />
    </>
  );
};

/*
        {classroomId !== -1 &&
          students.map((student, idx) => {
            return (
              <div key={idx}>
                {' '}
                <StudentGradeCard
                  student={student}
                  classroomId={classroomId}
                />{' '}
              </div>
            );
          })}
*/
export default Gradebook;
