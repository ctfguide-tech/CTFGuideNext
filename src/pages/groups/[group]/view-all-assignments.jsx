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
    const date = new Date(dateString);
    const offsetInMinutes = date.getTimezoneOffset();
    date.setMinutes(date.getMinutes() + offsetInMinutes);
    function to12HourFormat(hour, minute) {
      let period = hour >=  12 ? "PM" : "AM";
      hour = hour %  12;
      hour = hour ? hour :  12; // the hour '0' should be '12'
      return hour + ":" + minute.toString().padStart(2, '0') + " " + period;
    }
    const day = date.getDate();
    const month = date.getMonth() +  1; // Months are  0-based in JavaScript
    const year = date.getFullYear().toString().slice(-2);
    const hour = date.getHours();
    const minute = date.getMinutes();
    const time = to12HourFormat(hour, minute);
    const formattedDate = `${month}/${day}/${year} ${time}`;
    return formattedDate;
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
        </style>
      </Head>
      <StandardNav />
      
      <div className="border-b border-neutral-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center space-x-4">
            <button
              onClick={() => router.push(`/groups/${group}/home`)}
              className="text-neutral-400 hover:text-white transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => router.push(`/groups/${group}/view-all-assignments`)}
              className="text-neutral-400 hover:text-white transition-colors"
            >
              Assignments
            </button>
            <button
              onClick={() => router.push(`/groups/${group}/gradebook`)}
              className="text-neutral-400 hover:text-white transition-colors"
            >
              Gradebook
            </button>
            <button
              onClick={() => router.push(`/groups/${group}/settings`)}
              className="text-neutral-400 hover:text-white transition-colors"
            >
              Settings
            </button>
          </div>
        </div>
      </div>

      <Loader isLoad={loadingAuth} />
      
      {!loadingAuth && 
        <div className="min-h-screen bg-neutral-900 py-8">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white">Assignments</h1>
              <p className="mt-2 text-neutral-400">View and manage your class assignments</p>
            </div>

            <div className="space-y-8">
              {/* Upcoming Assignments Section */}
              <div>
                <h2 className="mb-4 text-xl font-semibold text-white">
                  Upcoming Assignments
                </h2>
                <div className="space-y-3">
                  {assignments.length > 0 ? (
                    assignments
                      .filter((assignment) => new Date(parseDate(assignment.dueDate)) > new Date())
                      .map((assignment) => (
                        <div
                          key={assignment.id}
                          onClick={() => router.push(`/assignments/${isTeacher ? 'teacher' : "student"}/${assignment.id}`)}
                          className="group cursor-pointer rounded-lg border border-neutral-800 bg-neutral-800/50 p-4 transition hover:border-neutral-700 hover:bg-neutral-800"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                {assignment.category === 'quiz' && (
                                  <i className="fas fa-question-circle text-blue-500" data-tooltip-id="quiz-tooltip" data-tooltip-content="Quiz"></i>
                                )}
                                {assignment.category === 'test' && (
                                  <i className="fas fa-clipboard-check text-green-500" data-tooltip-id="test-tooltip" data-tooltip-content="Test"></i>
                                )}
                                {assignment.category === 'homework' && (
                                  <i className="fas fa-book text-orange-500" data-tooltip-id="homework-tooltip" data-tooltip-content="Homework"></i>
                                )}
                                {assignment.category === 'assessment' && (
                                  <i className="fas fa-file-alt text-purple-500" data-tooltip-id="assessment-tooltip" data-tooltip-content="Assessment"></i>
                                )}
                                <h3 className="text-lg font-medium text-white">
                                  {assignment.name}
                                  {!assignment.isOpen && 
                                    <span className="ml-2 text-sm font-normal text-red-500">(closed)</span>
                                  }
                                </h3>
                              </div>
                              <p className="mt-1 text-sm text-neutral-400">
                                Due: {parseDate(assignment.dueDate)}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-medium text-neutral-300">
                                {grades[assignment.name]?.grade || "NA"}/{assignment.totalPoints} pts
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="rounded-lg border border-neutral-800 bg-neutral-800/50 p-4 text-neutral-400">
                      No upcoming assignments
                    </div>
                  )}
                </div>
              </div>

              {/* Past Assignments Section */}
              <div>
                <h2 className="mb-4 text-xl font-semibold text-white">
                  Past Assignments
                </h2>
                <div className="space-y-3">
                  {assignments.length > 0 ? (
                    assignments
                      .filter((assignment) => new Date(parseDate(assignment.dueDate)) < new Date())
                      .map((assignment) => (
                        <div
                          key={assignment.id}
                          onClick={() => router.push(`/assignments/${isTeacher ? 'teacher' : "student"}/${assignment.id}`)}
                          className="group cursor-pointer rounded-lg border border-neutral-800 bg-neutral-800/50 p-4 transition hover:border-neutral-700 hover:bg-neutral-800"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                {/* Same icons as above */}
                                <h3 className="text-lg font-medium text-white">
                                  {assignment.name}
                                </h3>
                              </div>
                              <p className="mt-1 text-sm text-neutral-400">
                                Due: {parseDate(assignment.dueDate)}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-medium text-neutral-300">
                                {grades[assignment.name]?.grade === -1 ? (
                                  <span className="text-red-500">Not Submitted</span>
                                ) : (
                                  `${grades[assignment.name]?.grade || "NA"}/${assignment.totalPoints} pts`
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="rounded-lg border border-neutral-800 bg-neutral-800/50 p-4 text-neutral-400">
                      No past assignments
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      <Footer />
    </>
  );
};

export default ViewAllAssignments;
