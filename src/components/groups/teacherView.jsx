import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { useEffect, Fragment, useState } from 'react';
import { Transition, Dialog } from '@headlessui/react';
import CreateAssignment from '@/components/groups/assignments/createAssignment';
import { Tooltip } from 'react-tooltip';
import Announcements from '@/components/groups/announcements';
import ClassroomNav from '@/components/groups/classroomNav';
import LoadingBar from 'react-top-loading-bar';
import request from '@/utils/request';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useRouter } from 'next/router';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const baseClientUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;

const defaultImages = ['/DefaultKana.png', '/CuteKana.png', '/FancyKana.png', '/ConfusedKana.png', '/TophatKana.png'];

export default function TeacherView({ group }) {
  const [classroom, setClassroom] = useState({});
  const [inviteEmail, setInviteEmail] = useState('');
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [color, setColor] = useState('gray');
  const [inviteLink, setInviteLink] = useState('');
  const [viewCreateAssignment, setViewCreateAssignment] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postContent, setPostContent] = useState('');
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
    setProgress(100);
  }, [group]);

  const handleInvite = async () => {
    setColor('gray');
    setMessage('Invite link: ');
    setInviteLink('generating...');
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail)) {
      setColor('red');
      setMessage('Invalid email');
      setInviteLink('');
      return;
    }

    const url = `${baseUrl}/classroom/getAccessToken?classCode=${classroom.classCode}&email=${inviteEmail}`;
    const data = await request(url, 'GET', null);
    
    if (data && data.success) {
      setColor('lightgreen');
      setMessage('Your invite link: ');
      setInviteLink(`${baseClientUrl}/groups/invites/${classroom.classCode}/${data.body}`);
    } else {
      setColor('red');
      setMessage(data.message);
      setInviteLink('');
    }
  };

  const parseDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleCreatePost = async () => {
    try {
      const response = await request(`${baseUrl}/classroom/announcements/create`, 'POST', {
        classCode: classroom.classCode,
        content: postContent
      });
      
      if (response.success) {
        setIsModalOpen(false);
        setPostContent('');
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  if (viewCreateAssignment && classroom) {
    return <CreateAssignment classCode={classroom.classCode} />;
  }

  return (
    <>
      <Head>
        <title>{classroom.name || 'Classroom'} - CTFGuide</title>
      </Head>
      <StandardNav />
      <LoadingBar color="#0062ff" progress={progress} onLoaderFinished={() => setProgress(0)} />
      
      <div className="min-h-screen bg-neutral-900">
        {/* Top Navigation */}
        <div className="border-b border-neutral-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-14 items-center space-x-4">
              <button
                onClick={() => router.push(`/groups/${classroom.classCode}/home`)}
                className="text-neutral-400 hover:text-white transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => router.push(`/groups/${classroom.classCode}/view-all-assignments`)}
                className="text-neutral-400 hover:text-white transition-colors"
              >
                Assignments
              </button>
              <button
                onClick={() => router.push(`/groups/${classroom.classCode}/gradebook`)}
                className="text-neutral-400 hover:text-white transition-colors"
              >
                Gradebook
              </button>
              <button
                onClick={() => router.push(`/groups/${classroom.classCode}/settings`)}
                className="text-neutral-400 hover:text-white transition-colors"
              >
                Settings
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                {classroom.name || <Skeleton baseColor="#262626" highlightColor="#262626" width={300} />}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-neutral-400">
                <div className="flex items-center">
                  <i className="fas fa-users mr-2"></i>
                  <span>{classroom.students?.length || 0} Students</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-key mr-2"></i>
                  <span>Class Code: </span>
                  <code className="ml-2 px-2 py-0.5 rounded bg-neutral-800 font-mono">
                    {classroom.classCode}
                  </code>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setViewCreateAssignment(true)}
                className="flex items-center px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                disabled
                data-tooltip-id="new-assignment-tooltip"
                data-tooltip-content="Temporarily disabled due to technical issues"
              >
                <i className="fas fa-plus mr-2"></i>
                New Assignment
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white transition-colors"
                disabled
                data-tooltip-id="new-post-tooltip"
                data-tooltip-content="Temporarily disabled due to technical issues"
              >
                <i className="fas fa-bullhorn mr-2"></i>
                New Post
              </button>
              <button
                onClick={() => setOpen(true)}
                className="flex items-center px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white transition-colors"
              >
                <i className="fas fa-user-plus mr-2"></i>
                Invite Students
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-neutral-800/50 rounded-lg p-6 border border-neutral-700/50">
              <div className="flex items-center">
                <i className="fas fa-tasks text-2xl text-blue-400 mr-4"></i>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {classroom.assignments?.length || 0}
                  </div>
                  <div className="text-sm text-neutral-400">Total Assignments</div>
                </div>
              </div>
            </div>
            <div className="bg-neutral-800/50 rounded-lg p-6 border border-neutral-700/50">
              <div className="flex items-center">
                <i className="fas fa-chart-line text-2xl text-green-400 mr-4"></i>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {classroom.assignments?.filter(a => new Date(a.dueDate) > new Date()).length || 0}
                  </div>
                  <div className="text-sm text-neutral-400">Active Assignments</div>
                </div>
              </div>
            </div>
            <div className="bg-neutral-800/50 rounded-lg p-6 border border-neutral-700/50">
              <div className="flex items-center">
                <i className="fas fa-users text-2xl text-purple-400 mr-4"></i>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {classroom.students?.length || 0}
                  </div>
                  <div className="text-sm text-neutral-400">Enrolled Students</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="col-span-2 space-y-6">
              {/* Course Description */}
              <div className="bg-neutral-800/50 rounded-lg border border-neutral-700/50 p-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Course Description
                </h2>
                <p className="text-neutral-300">
                  {classroom.description || 'No description available.'}
                </p>
              </div>

              {/* Members Section */}
              <div className="bg-neutral-800/50 rounded-lg border border-neutral-700/50 p-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Members
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {classroom.teachers?.map((teacher, idx) => (
                    <div key={idx} className="flex items-center p-3 bg-neutral-900/50 rounded-lg border border-neutral-800/50">
                      <img
                        src={defaultImages[defaultImages.length - 1 - (idx % defaultImages.length)]}
                        className="h-10 w-10 rounded-full border border-neutral-700"
                        alt={`${teacher.firstName} ${teacher.lastName}`}
                      />
                      <div className="ml-3">
                        <div className="text-white font-medium">
                          {teacher.firstName} {teacher.lastName}
                        </div>
                        <div className="text-xs text-neutral-400">
                          <i className="fas fa-user-shield mr-1"></i> Teacher
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {classroom.students?.map((student, idx) => (
                    <div key={idx} className="flex items-center p-3 bg-neutral-900/50 rounded-lg border border-neutral-800/50">
                      <img
                        src={defaultImages[idx % defaultImages.length]}
                        className="h-10 w-10 rounded-full border border-neutral-700"
                        alt={`${student.firstName} ${student.lastName}`}
                      />
                      <div className="ml-3">
                        <div className="text-white font-medium">
                          {student.firstName} {student.lastName}
                        </div>
                        <div className="text-xs text-neutral-400">
                          <i className="fas fa-user mr-1"></i> Student
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Upcoming Assignments */}
              <div className="bg-neutral-800/50 rounded-lg border border-neutral-700/50">
                <div className="p-4 border-b border-neutral-700/50">
                  <h2 className="text-lg font-semibold text-white">
                    Upcoming Assignments
                  </h2>
                </div>
                <div className="p-4">
                  {classroom.assignments?.filter(a => new Date(a.dueDate) > new Date())
                    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                    .slice(0, 5)
                    .map((assignment, idx) => (
                      <div
                        key={idx}
                        onClick={() => window.location.href = '/assignments/teacher/' + assignment.id}
                        className="group cursor-pointer bg-neutral-900/50 hover:bg-neutral-900 border border-neutral-800/50 rounded-lg p-4 transition-all duration-200"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-white font-medium group-hover:text-blue-400 transition-colors flex items-center">
                              <AssignmentIcon category={assignment.category} />
                              <span className="ml-2">{assignment.name}</span>
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
                    ))}
                  
                  {(!classroom.assignments || classroom.assignments.filter(a => new Date(a.dueDate) > new Date()).length === 0) && (
                    <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-neutral-800/50 rounded-full flex items-center justify-center">
                          <i className="fas fa-calendar text-neutral-400"></i>
                        </div>
                        <div>
                          <h3 className="text-white font-medium">No upcoming assignments</h3>
                          <p className="text-sm text-neutral-400">
                            Create an assignment using the button above
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Platform Updates */}
              <div className="bg-neutral-800/50 rounded-lg border border-neutral-700/50">
                <div className="p-4 border-b border-neutral-700/50 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">Platform Updates</h2>
                  <span className="px-2 py-1 text-xs bg-yellow-500/20 text-yellow-500 rounded">
                    Alert
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-white font-medium mb-2">Expected Downtime</h3>
                  <p className="text-sm text-neutral-300 mb-4">
                    Our terminal platform will be receiving updates. During this time, 
                    students will not be able to complete virtual labs.
                  </p>
                  <div className="text-sm text-neutral-400 bg-neutral-900/50 p-3 rounded-lg">
                    <i className="fas fa-info-circle mr-2"></i>
                    Affected services: EDU, Terminals, Create a VM, and Virtual Labs
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={setOpen}>
          <div className="flex min-h-screen items-center justify-center px-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black/75 transition-opacity" />
            </Transition.Child>

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="relative transform overflow-hidden rounded-xl bg-neutral-900 border border-neutral-800 px-8 pt-5 pb-4 text-left shadow-xl transition-all sm:w-full sm:max-w-lg">
                <div className="absolute right-4 top-4">
                  <button
                    onClick={() => setOpen(false)}
                    className="text-neutral-400 hover:text-white transition-colors"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>

                <div className="text-center">
                  <div className="mx-auto w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
                    <i className="fas fa-user-plus text-blue-500 text-xl"></i>
                  </div>
                  <Dialog.Title as="h3" className="text-2xl font-semibold text-white mb-2">
                    Invite Student
                  </Dialog.Title>
                  <p className="text-neutral-400 text-sm mb-6">
                    Enter the student's email address to generate an invite link
                  </p>
                </div>

                <div className="space-y-4">
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="student@school.edu"
                    className="w-full px-4 py-2.5 rounded-lg bg-neutral-800 text-white placeholder-neutral-400 border border-neutral-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                  />

                  {inviteLink && (
                    <div className={`p-4 rounded-lg ${color === 'lightgreen' ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                      <p className="text-sm font-medium mb-1 text-white">
                        {message}
                      </p>
                      <p className="text-sm text-neutral-300 break-all">
                        {inviteLink}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setOpen(false)}
                      className="px-4 py-2 rounded-lg border border-neutral-700 text-white hover:bg-neutral-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleInvite}
                      className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                      Generate Link
                    </button>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <Transition.Root show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={setIsModalOpen}>
          <div className="flex min-h-screen items-center justify-center px-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black/75 transition-opacity" />
            </Transition.Child>

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="relative transform overflow-hidden rounded-xl bg-neutral-900 border border-neutral-800 px-8 pt-5 pb-4 text-left shadow-xl transition-all sm:w-full sm:max-w-lg">
                <div className="absolute right-4 top-4">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-neutral-400 hover:text-white transition-colors"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>

                <div className="text-center">
                  <div className="mx-auto w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
                    <i className="fas fa-bullhorn text-blue-500 text-xl"></i>
                  </div>
                  <Dialog.Title as="h3" className="text-2xl font-semibold text-white mb-2">
                    Create New Post
                  </Dialog.Title>
                  <p className="text-neutral-400 text-sm mb-6">
                    Share an announcement with your class
                  </p>
                </div>

                <div className="space-y-4">
                  <textarea
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder="Write your announcement here..."
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-lg bg-neutral-800 text-white placeholder-neutral-400 border border-neutral-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                  />

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 rounded-lg border border-neutral-700 text-white hover:bg-neutral-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreatePost}
                      className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                      Post Announcement
                    </button>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <Tooltip id="new-assignment-tooltip" />
      <Tooltip id="new-post-tooltip" />

      <Footer />
    </>
  );
}

// Helper component for assignment icons
const AssignmentIcon = ({ category }) => {
  const iconClass = {
    quiz: "fas fa-question-circle",
    test: "fas fa-clipboard-check",
    homework: "fas fa-book",
    assessment: "fas fa-file-alt"
  }[category] || "fas fa-file";

  return (
    <i className={iconClass} data-tooltip-id={`${category}-tooltip`} data-tooltip-content={category.charAt(0).toUpperCase() + category.slice(1)} />
  );
};
