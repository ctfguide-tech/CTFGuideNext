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
import CreateAssignment from '@/components/groups/assignments/createAssignment';
import Loader from '@/components/Loader';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const ViewAllAssignments = () => {
  const [assignments, setAssignments] = useState({});
  const [isTeacher, setIsTeacher] = useState(false);
  const [grades, setGrades] = useState({});
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [viewCreateAssignment, setViewCreateAssignment] = useState(false);

  const router = useRouter();
  const { group } = router.query;

  const getAssignments = async (classCode) => {
    const url = `${baseUrl}/classroom-assignments/fetch-assignments/${classCode}`;
    const data = await request(url, 'GET', null);
    if (data && data.success) {
      setAssignments(data.body);
    } else {
      console.log('Error when getting classroom info');
    }
  };

  const getGrades = async (classCode) => {
    const url = `${baseUrl}/submission/student-finalgrade/${classCode}`;
    const data = await request(url, 'GET', null);
    if (data && data.success) setGrades(data.body);
    else console.log('Error when getting grades');
    setLoadingAuth(false);
  }

  const parseDate = (dateString) => {
    let dateObject = new Date(dateString);
    let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let time = dateObject.toLocaleString('en-US', {timeZone: timeZone, hour12: false}).split(',')[1].trim().substring(0, 5);
    let hours = dateObject.getHours();
    let minutes = dateObject.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    let minutesString = minutes < 10 ? '0' + minutes : minutes;
    time = hours + ':' + minutesString + ' ' + ampm;
    return dateObject.toLocaleDateString('en-US', {timeZone: timeZone}) + ' ' + time;
  };

  const auth = async (classCode) => {
    const url = `${baseUrl}/classroom/auth/${classCode}`;
    const res = await request(url, 'GET', null);
    if(!res) setIsTeacher(false);
    setIsTeacher(res.success && res.isTeacher);
  };

  useEffect(() => {
    if(group) {
      setLoadingAuth(true);
      auth(group);
      getAssignments(group);
      getGrades(group)
    }
  }, [group]);


  if (viewCreateAssignment && group) {
    return <CreateAssignment classCode={group} />;
  }

  return (
    <>
      <Head>
        <title>View all Assignments - CTFGuide</title>
        <style>
          @import
          url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
          /* bold */
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
      <Loader isLoad={loadingAuth} />
      {
        !loadingAuth && 
        <>
      <div className="mx-auto mt-6   max-w-6xl  justify-center ">
        <h1 className="mx-auto text-2xl font-semibold text-white">
          Assignments
        </h1>
        <h2 className="mb-4 mt-4 text-lg font-semibold text-white">
          Upcoming Assignments
        </h2>

        {
        assignments.length > 0 ? (
          assignments
            .filter((assignment) => new Date(assignment.dueDate) > new Date())
            .map((assignment) => (
              <div
                key={assignment.id}
                className="mb-2 cursor-pointer rounded-sm border-l-4 border-green-600 bg-neutral-800/50 px-3 py-3 hover:bg-neutral-800 text-white"
                      onClick={() => router.push(`/assignments/${isTeacher ? 'teacher' : "student"}/${assignment.id}`)}
              >
                {/* Make assignment box look pretty */}
                <h2 className="text-md text-white"
                  onClick={() => {
                    router.replace(
                      `/assignments/${isTeacher ? 'teacher' : 'student'}/${assignment.id}`
                    );
                  }}
                >
                  <Tooltip id="quiz-tooltip" place="left" />
                  <Tooltip id="test-tooltip" place="left" />
                  <Tooltip id="homework-tooltip" place="left" />
                  <Tooltip id="assessment-tooltip" place="left" />

                  {assignment.category === 'quiz' && (
                    <i
                      title="quiz"
                      className="fas fa-question-circle"
                      data-tooltip-id="quiz-tooltip"
                      data-tooltip-content="Quiz"
                    ></i>
                  )}
                  {assignment.category === 'test' && (
                    <i
                      title="test"
                      className="fas fa-clipboard-check"
                      data-tooltip-id="test-tooltip"
                      data-tooltip-content="Test"
                    ></i>
                  )}
                  {assignment.category === 'homework' && (
                    <i
                      title="homework"
                      className="fas fa-book"
                      data-tooltip-id="homework-tooltip"
                      data-tooltip-content="Homework"
                    ></i>
                  )}
                  {assignment.category === 'assessment' && (
                    <i
                      title="assessment"
                      className="fas fa-file-alt"
                      data-tooltip-id="assessment-tooltip"
                      data-tooltip-content="Assessment"
                    ></i>
                  )}

                  <span className="ml-0.5"> {assignment.name} 
                              {!assignment.isOpen && 
                              <span style={{color: "#C41E3A"}}>(closed)</span>} </span>
                </h2>
                <p className="text-white">
                  Due: {parseDate(assignment.dueDate)}
                </p>
                      <p>
                        {grades[assignment.name] && grades[assignment.name].grade || "NA"}/
                        {assignment.totalPoints} pts
                      </p>
              </div>
            ))
        ) : (
          <div className="mb-2 cursor-pointer rounded-sm border-l-4 border-red-600 bg-neutral-800/50 px-3 py-3 text-white hover:bg-neutral-800">
            <h1 className="text-white">No assignments available</h1>
          </div>
        )}

        <h2 className="mb-4 text-lg font-semibold text-white">
          Past Assignments
        </h2>
        {/*Make so that subitted assignments are also here*/}
        {
        
        assignments.length > 0 ? (
          assignments
            .filter((assignment) => new Date(assignment.dueDate) < new Date())
            .map((assignment) => (
              <div
                key={assignment.id}
                className="mb-2 cursor-pointer rounded-sm border-l-4 border-green-600 bg-neutral-800/50 px-3 py-3 hover:bg-neutral-800"
                onClick={() => router.push(`/assignments/${isTeacher ? 'teacher' : "student"}/${assignment.id}`)}
              >
                {/* Make assignment look pretty*/}
                <h2 className="text-md text-white"
                  onClick={() => {
                    router.replace(
                      `/assignments/${isTeacher ? 'teacher' : 'student'}/${assignment.id}`
                    );
                  }}
                >
                  <Tooltip id="quiz-tooltip" place="left" />
                  <Tooltip id="test-tooltip" place="left" />
                  <Tooltip id="homework-tooltip" place="left" />
                  <Tooltip id="assessment-tooltip" place="left" />

                  {assignment.category === 'quiz' && (
                    <i
                      title="quiz"
                      className="fas fa-question-circle"
                      data-tooltip-id="quiz-tooltip"
                      data-tooltip-content="Quiz"
                    ></i>
                  )}
                  {assignment.category === 'test' && (
                    <i
                      title="test"
                      className="fas fa-clipboard-check"
                      data-tooltip-id="test-tooltip"
                      data-tooltip-content="Test"
                    ></i>
                  )}
                  {assignment.category === 'homework' && (
                    <i
                      title="homework"
                      className="fas fa-book"
                      data-tooltip-id="homework-tooltip"
                      data-tooltip-content="Homework"
                    ></i>
                  )}
                  {assignment.category === 'assessment' && (
                    <i
                      title="assessment"
                      className="fas fa-file-alt"
                      data-tooltip-id="assessment-tooltip"
                      data-tooltip-content="Assessment"
                    ></i>
                  )}

                  <span className="ml-0.5"> {assignment.name} </span>
                </h2>
                <p className="text-white">
                  Due: {parseDate(assignment.dueDate)} 
                </p>
                      <p className="text-white">
                        {grades[assignment.name] && grades[assignment.name].grade || "NA"}/
                        {assignment.totalPoints} pts
                      </p>
              </div>
            ))
        ) : (
          <div className="mb-2 cursor-pointer rounded-sm border-l-4 border-red-600 bg-neutral-800/50 px-3 py-3 text-white hover:bg-neutral-800">
            <h1 className="text-white">No assignments available</h1>
          </div>
        )}
      </div>

      <Footer />
          </>
      }
    </>
  );
};

export default ViewAllAssignments;
