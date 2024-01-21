import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import React from 'react';
import { useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';

import { useRouter } from 'next/router';
import ClassroomNav from '@/components/groups/classroomNav';
import request from '@/utils/request';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const baseClientUrl = `localhost:3000`;

const ViewAllAssignments = () => {
  const [assignments, setAssignments] = useState({});
  const [isTeacher, setIsTeacher] = useState(false);
  const [classCode, setClassCode] = useState('');
  const [grades, setGrades] = useState({});

  const router = useRouter();

  const getAssignments = async () => {
    const params = window.location.href.split('/');
    setClassCode(params[4]);
    const url = `${baseUrl}/classroom-assignments/fetch-assignments/${params[4]}`;
    const data = await request(url, 'GET', null);
    if (data && data.success) {
      setAssignments(data.body);
    } else {
      console.log('Error when getting classroom info');
    }
  };

  const getGrades = async () => {
    const params = window.location.href.split('/');
    const url = `${baseUrl}/submission/student-finalgrade/${params[4]}`;
    const data = await request(url, 'GET', null);
    if (data && data.success) setGrades(data.body);
    else console.log('Error when getting grades');
  }

  const parseDate = (dateString) => {
    let dateObject = new Date(dateString);
    let month = dateObject.getMonth() + 1;
    let day = dateObject.getDate();
    let year = dateObject.getFullYear();
    let hours = dateObject.getHours();
    let minutes = dateObject.getMinutes();
    let ampm = hours >= 12 ? ' PM' : ' AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let strTime = hours + ':' + minutes + ampm;
    let formattedDate = `${month}/${day}/${year} ${strTime}`;
    return formattedDate;
  };

  // make the route to auth teacher/students
  const auth = (classroom) => {
    return true;
  };

  useEffect(() => {
    getAssignments();
    getGrades()
  }, []);


  console.log(grades);

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
      <div className="bg-neutral-800">
        <div className=" mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-10 justify-between">
            {isTeacher && <ClassroomNav classCode={classCode} />}
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
                className="mb-2 cursor-pointer rounded-sm border-l-4 border-green-600 bg-neutral-800/50 px-3 py-3 hover:bg-neutral-800"
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

                  <span className="ml-0.5"> {assignment.name} </span>
                </h2>
                <p className="text-white">
                  Due: {parseDate(assignment.dueDate)} | {grades[assignment.name] && grades[assignment.name].grade || 0}/
                  {assignment.totalPoints} pts
                </p>
                <button onClick={() => router.push(`/groups/${classCode}/edit-assignment/${assignment.id}`)}>Edit Assignment</button>
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
                  Due: {parseDate(assignment.dueDate)} | {grades[assignment.name] && grades[assignment.name].grade || 0}/
                  {assignment.totalPoints} pts pts
                </p>
                <button onClick={() => router.push(`/groups/${classCode}/edit-assignment/${assignment.id}`)}>Edit Assignment</button>
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
  );
};

export default ViewAllAssignments;
