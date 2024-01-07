import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import React from 'react';
import { useState, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import { useRouter } from 'next/router';
const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const baseClientUrl = `localhost:3000`;

const ViewAllAssignments = () => {
  const [classroom, setClassroom] = useState({});

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
    } else {
      console.log('Error when getting classroom info');
    }
  };

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

  useEffect(() => {
    getClassroom();
  }, []);

  return (
    <>
      <Head>
        <title>Assignments - CTFGuide</title>
        <meta
          name="description"
          content="Cybersecurity made easy for everyone"
        />
        <style>
          @import
          url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        </style>
      </Head>
      <StandardNav />
      <div className="mx-auto mt-6   max-w-6xl  justify-center ">
        <h1 className="mx-auto text-2xl font-semibold text-white">
          Assignments
        </h1>
        <h2 className="mb-4 text-lg font-semibold text-white mt-4">
            Upcoming Assignments
          </h2>
        
        {classroom &&
            classroom.assignments &&
            classroom.assignments.length > 0 ? (
            classroom.assignments
              .filter((assignment) => new Date(assignment.dueDate) > new Date())
              .map((assignment) => (
                <div
                  key={assignment.id}
                  onClick={() => {
                    window.location.href = '/assignments/' + assignment.id;
                  }}
                  className="mb-2 cursor-pointer rounded-sm border-l-4 border-gray-600 bg-neutral-800/50 px-3 py-3 hover:bg-neutral-800"
                >
                  {/* Make assignment box look pretty */}
                  <h2 className="text-md text-white">
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
                    Due: {parseDate(assignment.dueDate)} | 0/{assignment.points} pts
                  </p>
                </div>
              ))
          ) : (
            <div className="mb-2 cursor-pointer rounded-sm border-l-4 border-red-600 bg-neutral-800/50 px-3 py-3 hover:bg-neutral-800 text-white">
              <h1 className="text-white">No assignments available</h1>
            </div>
          )}

        
      
      
          <h2 className="mb-4 text-lg font-semibold text-white">
            Past Assignments
          </h2>
          {/*Make so that subitted assignments are also here*/}
          {classroom &&
            classroom.assignments &&
            classroom.assignments.length > 0 ? (
            classroom.assignments
              .filter((assignment) => new Date(assignment.dueDate) < new Date())
              .map((assignment) => (
                <div
                  key={assignment.id}
                  onClick={() => {
                    window.location.href = '/assignments/' + assignment.id;
                  }}
                  className="mb-2 cursor-pointer rounded-sm border-l-4 border-green-600 bg-neutral-800/50 px-3 py-3 hover:bg-neutral-800"
                >
                  {/* Make assignment look pretty*/}
                  <h2 className="text-md text-white">
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
                    Due: {parseDate(assignment.dueDate)} | 0/{assignment.points}
                    pts
                  </p>
                </div>
              ))
          ) : (
            <div className="mb-2 cursor-pointer rounded-sm border-l-4 border-red-600 bg-neutral-800/50 px-3 py-3 hover:bg-neutral-800 text-white">
              <h1 className="text-white">No assignments available</h1>
            </div>
          )}
        </div>

            
      <Footer />
      </>

  );
};

export default ViewAllAssignments;
