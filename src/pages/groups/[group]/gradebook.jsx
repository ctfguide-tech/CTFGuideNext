import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { useEffect, useState } from 'react';
import LoadingBar from 'react-top-loading-bar';
import ClassroomNav from '@/components/groups/classroomNav';
import { useRouter } from 'next/router';
import CreateAssignment from '@/components/groups/assignments/createAssignment';
import request from '@/utils/request';
import Loader from '@/components/Loader';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const Gradebook = () => {
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [classroom, setClassroom] = useState({});
  const [progress, setProgress] = useState(0);
  const [viewCreateAssignment, setViewCreateAssignment] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [isEditingGrade, setIsEditingGrade] = useState({});
  const [newGrade, setNewGrade] = useState("");
  const [classroomId, setClassroomId] = useState(-1);

  const router = useRouter();
  const { group } = router.query;

  const getStudentsSubmissionsFinalGrades = async (classroomId) => {
    try {
      const url =
        baseUrl +
        '/submission/getStudentsSubmissionsFinalGrades/' +
        classroomId;
      const data = await request(url, 'GET', null);
      if (data && data.success) {
        setStudents(data.body);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getAssignments = async () => {
    const url = `${baseUrl}/classroom/classroom-by-classcode/${group}`
    const data = await request(url, 'GET', null);
    if (data && data.success) {
      setAssignments(data.body.assignments);
      setClassroomId(data.body.id);
      await getStudentsSubmissionsFinalGrades(data.body.id);
    } else {
      console.log(data);
    }
  };

  useEffect(() => {
    const authenticate = async () => {
      const auth = await checkPermissions();
      if(!auth) {
        router.replace("/groups");
      } else {
        await getAssignments();
        setLoadingAuth(false);
      }
    }
    if(group) {
      authenticate();
    }
  }, [group]);

  const checkPermissions = async () => {
    const url = `${baseUrl}/classroom/auth/${group}`;
    const res = await request(url, 'GET', null);
    if(!res) return false;
    return res.success && res.isTeacher;
  };

  async function saveGrade() {
    const url = `${baseUrl}/submission/update-student-grade`;

    let nGrade = newGrade / isEditingGrade.total * 100;
    if(isEditingGrade.isLate) {
      //nGrade += isEditingGrade.latePen
    }

    const body = { newGrade: nGrade, uid: isEditingGrade.uid, assignmentId: isEditingGrade.assignmentId };
    const response = await request(url, "PUT", body);
    if(response.success) await getStudentsSubmissionsFinalGrades(classroomId);
    setNewGrade("");
  }

  if(viewCreateAssignment && group) {
   return <CreateAssignment classCode={group}/>
  }

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
      <LoadingBar
        color="#0062ff"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <div className="bg-neutral-800">
        <div className=" mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-10 justify-between">
            {classroom && <ClassroomNav classCode={group} />}
            <div className="flex items-center">
              <button
                onClick={() => {
                  setViewCreateAssignment(true);
                }}
                className="rounded-lg bg-neutral-800/80 px-4 py-0.5 text-white "
              >
                <i className="fas fa-plus-circle pe-2"></i> New Assignment
              </button>

            </div>
          </div>
        </div>
      </div>

      <Loader isLoad={loadingAuth} />
      {
        !loadingAuth &&
          <>
      <div className="mx-auto mt-10 max-w-6xl">
        <div className="flex">
          <h1 className="text-3xl font-semibold text-white">Gradebook</h1>
          <div className="ml-auto">
            <button
              onClick={() =>
                router.push(`/groups/${group}/home`)
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
                {assignments.map((assignment) => (
                  <th
                    key={assignment.id}
                    scope="col"
                    class="cursor-pointerpx-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500"
                  >
                    {assignment.name}
                  </th>
                ))}
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500"
                >
                  Final Grade
                </th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={index} class="bg-neutral-800 hover:bg-neutral-700">
                  <td class="whitespace-nowrap px-6 py-4 text-sm font-medium text-white">
                    {student.name}
                  </td>
                  {assignments.map((assignment) => (
                    <td
                      key={assignment.id}
                      className={`whitespace-nowrap px-6 py-4 text-sm ${
                        student[assignment.name].grade === null
                          ? 'text-white-400'
: student[assignment.name].late && student[assignment.name].grade === -1 ? 'text-red-400'
: student[assignment.name].late ? 'text-yellow-400'
                          : 'text-green-400'
                      }`}
                    >
                      {student[assignment.name].grade === null
                        ? 'N/A'
                      : student[assignment.name].grade === -1 ? "Not Submitted" 
                        : <span onClick={() => setIsEditingGrade({
                                isLate: student[assignment.name].late, latePen: assignment.latePenalty, total: assignment.totalPoints, assignmentId: assignment.id, uid: student[assignment.name].uid})}>

                  {
                    isEditingGrade.assignmentId === assignment.id && student[assignment.name].uid === isEditingGrade.uid ? 
                                    <input  
    className="w-14 h-6 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 p-1"   
                                      type="number"  
                                      value={newGrade}  
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          setIsEditingGrade({});
                                          saveGrade();
                                        }
                                      }}
                                      onChange={(e) => setNewGrade(e.target.value)}
                                      onBlur={() => setIsEditingGrade({})}
                                    />
                                    : `${student[assignment.name].grade}`
                                }

                                /{student[assignment.name].total}
                          </span>}
                    </td>
                  ))}
                        <td class="whitespace-nowrap px-6 py-4 text-sm text-white">
                          {student.finalGrade === null
                            ? 'N/A'
                            : `${student.finalGrade.toFixed(2)}%`}
                        </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
      <Footer />
          </>
      }
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
