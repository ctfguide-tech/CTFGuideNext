import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { useEffect, useState } from 'react';
import LoadingBar from 'react-top-loading-bar';
import request from '@/utils/request';
import StudentNav from '@/components/groups/studentNav';
import { useRouter } from 'next/router';
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const StudentGradebook = () => {
  const [assignments, setAssignments] = useState([]);
  const [name, setName] = useState("");
  const [finalGrade, setFinalGrade] = useState(0);
  const router = useRouter();
  const classCode = router.query.group;

  const fetchFinalGrade = async () => {
    const url = `${baseUrl}/submission/student-finalgrade/${classCode}`;
    const data = await request(url, "GET", null);
    if(data && data.success) {
      const info = data.body;
      setName(info["name"] || localStorage.getItem("username"));
      setFinalGrade(info["finalGrade"] || 0);
      const asigns = Object.entries(info)
      .filter(([key]) => key !== "name" && key !== "finalGrade")
      .map(([key, value]) => ({ [key]: value }));
      setAssignments(asigns);
    } else console.log("Unable to get final grade data");
    console.log(data);
  }

  useEffect(() => {
    fetchFinalGrade()
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
      <StudentNav classCode={classCode}/>
      <div className="mx-auto mt-10 max-w-6xl">
        <div className="flex">
          <h1 className="text-3xl font-semibold text-white">Student Gradebook</h1>
          <div className="ml-auto">
            <button
              onClick={() =>
                router.push(`/groups/${classCode}/home`)
              }
              className=" rounded-lg bg-blue-600 px-2 py-1 text-white hover:bg-blue-600/50"
              style={{
                fontSize: '15px',
              }}
            >
              <i className="fa fa-arrow-left" style={{ color: 'white' }}></i>{' '}
              Back
            </button>
          </div>
        </div>
        <div class="mx-auto mt-4 flex items-center justify-center rounded-sm pb-10 text-white">
          <table class="min-w-full divide-y divide-neutral-700">
            <thead class="rounded-sm bg-neutral-800">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500"
                >
                  Student
                </th>
                {assignments.map((assignment) => { 
                  const title = Object.keys(assignment)[0];
                  return (

                  <th
                    key={assignment.id}
                    scope="col"
                    class="cursor-pointerpx-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500"
                  >
                      {title}
                  </th>
                )})}
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500"
                >
                  Final Grade
                </th>
              </tr>
            </thead>
            <tbody>
              <tr class="bg-neutral-800 hover:bg-neutral-700">
                <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-white">
                  {name}
                </td>
                {assignments.map((assignment) => {
                  const title = Object.keys(assignment)[0];
                  const data = assignment[title];
                  return (
                  <td
                    key={assignment.id}
                    class={`whitespace-nowrap px-6 py-4 text-sm ${data.grade === null
                    ? 'text-yellow-400'
                    : 'text-green-400'}`}>
                    {data.grade === null
                      ? 'N/A'
                      : `${data.grade}/${data.total}`}
                  </td>
                )})}
                <td class="whitespace-nowrap px-6 py-4 text-sm text-white">
                  {finalGrade === null
                    ? 'N/A'
                    : `${finalGrade}%`}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default StudentGradebook;

