import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { useEffect, useState } from 'react';
import StudentNav from '@/components/groups/studentNav';
import Link from 'next/link';
import { useRouter } from 'next/router';
import request from '@/utils/request';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export default function StudentView({ group }) {
  const [classroom, setClassroom] = useState({});
  const router = useRouter();

  useEffect(() => {
    const getClassroom = async () => {
      const url = `${baseUrl}/classroom/classroom-by-classcode/${group}`;
      const data = await request(url, 'GET');
      if (data && data.success) {
        setClassroom(data.body);
      }
    };
    getClassroom();
  }, [group]);

  const parseDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <>
      <Head>
        <title>{classroom.name || 'Classroom'} - CTFGuide</title>
      </Head>
      <StandardNav />
      <StudentNav classCode={classroom.classCode} />
      
      <div className="min-h-screen bg-neutral-900/30 pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {classroom.name}
            </h1>
            <div className="flex items-center space-x-4 text-sm text-neutral-400">
              <div className="flex items-center">
                <i className="fas fa-user-shield mr-2"></i>
                <span>{classroom.teachers?.length || 0} Teachers</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-users mr-2"></i>
                <span>{classroom.students?.length || 0} Students</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-key mr-2"></i>
                <span>Class Code: {classroom.classCode}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Course Description */}
              <div className="bg-neutral-800/40 rounded-xl border border-neutral-700/50 p-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Course Description
                </h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-neutral-300 whitespace-pre-wrap">
                    {classroom.description || 'No description available.'}
                  </p>
                </div>
              </div>

              {/* Assignments Section */}
              <div className="bg-neutral-800/40 rounded-xl border border-neutral-700/50 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">
                    Recent Assignments
                  </h2>
                  <Link
                    href={`/groups/${classroom.classCode}/view-all-assignments`}
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center"
                  >
                    View All <i className="fas fa-arrow-right ml-2"></i>
                  </Link>
                </div>

                <div className="space-y-3">
                  {classroom.assignments && classroom.assignments.length > 0 ? (
                    classroom.assignments.slice(0, 3).map((assignment, idx) => (
                      <div
                        key={idx}
                        onClick={() => router.push(`/assignments/student/${assignment.id}`)}
                        className="group cursor-pointer bg-neutral-900/50 hover:bg-neutral-900 border border-neutral-800/50 rounded-lg p-4 transition-all duration-200"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-white font-medium group-hover:text-blue-400 transition-colors">
                              {assignment.name} 
                              {!assignment.isOpen && 
                                <span className="ml-2 text-red-400 text-sm">(closed)</span>
                              }
                            </h3>
                            <p className="text-sm text-neutral-400 mt-1">
                              Due: {parseDate(assignment.dueDate)}
                            </p>
                          </div>
                          <span className="text-neutral-500 group-hover:text-neutral-400 transition-colors">
                            <i className="fas fa-chevron-right"></i>
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-neutral-800/50 rounded-full flex items-center justify-center">
                          <i className="fas fa-book text-neutral-400"></i>
                        </div>
                        <div>
                          <h3 className="text-white font-medium">No assignments yet</h3>
                          <p className="text-sm text-neutral-400">
                            Check back later for new assignments
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Platform Updates */}
              <div className="bg-neutral-800/40 rounded-xl border border-neutral-700/50 overflow-hidden">
                <div className="px-6 py-4 bg-neutral-800/60 border-b border-neutral-700/50">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">Platform Updates</h2>
                    <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full">
                      New
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="prose prose-invert max-w-none">
                    <p className="text-sm text-neutral-300">
                      Thank you for signing up for CTFGuide Groups! We are excited to get your feedback on our platform. 
                      Follow us on Twitter/X <a href="https://twitter.com/@ctfguideapp" className="text-blue-400 hover:text-blue-300">@ctfguideapp</a> for updates.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}
