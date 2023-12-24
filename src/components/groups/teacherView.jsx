import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { useEffect, Fragment, useState } from 'react';
import { Transition, Dialog } from '@headlessui/react';
import StudentProfile from '@/components/groups/studentProfile';
import TeacherSettings from '@/components/groups/teacherSettings';
import CreateAssignment from '@/components/groups/createAssignment';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const defaultImages = [
  'https://robohash.org/pranavramesh',
  'https://robohash.org/laphatize',
  'https://robohash.org/stevewilkers',
  'https://robohash.org/rickast',
  'https://robohash.org/picoarc',
  'https://robohash.org/jasoncalcanis',
];

export default function TeacherView({ uid, group }) {
  const [classroom, setClassroom] = useState({});
  const [inviteEmail, setInviteEmail] = useState('');
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [color, setColor] = useState('gray');
  const [inviteLink, setInviteLink] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [viewSettings, setViewSettings] = useState(false);
  const [editingAnnouncementIdx, setEditingAnnouncementIdx] = useState(-1);
  // const [upgraded, setUpgraded] = useState(false);
  const [viewCreateAssignment, setViewCreateAssignment] = useState(false);
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const getClassroom = async () => {
      const classroomCode = group;
      const url = `${baseUrl}/classroom/classroom-by-classcode?classCode=${classroomCode}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setClassroom(data.body);
      } else {
        console.log('Error when getting classroom info');
      }
    };
    getClassroom();
  }, []);

  const handleInvite = async () => {
    setColor('gray');
    setMessage('Invite link: ');
    setInviteLink('generating...');
    const email = inviteEmail;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
      setColor('lightgreen');
      setMessage('Your invite link: ');
      const url = `${baseUrl}/classroom/getAccessToken?classCode=${classroom.classCode}&email=${email}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setColor('lightgreen');
        setInviteLink(
          `localhost:3000/groups/invites/${classroom.classCode}/${data.body}`
        );
      } else {
        setMessage(data.message);
        setColor('red');
        setInviteLink('');
      }
    } else {
      setColor('red');
      setMessage('Invalid email');
      setInviteLink('');
    }
  };

  const updateAnnouncement = async (id, message) => {
    try {
      if (!id) return;
      const url = `${baseUrl}/classroom/announcements/${id}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      const data = await response.json();
      let classroomAnnouncements = classroom.announcements;
      setClassroom((prevClassroom) => ({
        ...prevClassroom,
        announcements: classroomAnnouncements.map((announcement) =>
          announcement.id === id ? data.body : announcement
        ),
      }));
      console.log(data.message);
    } catch (err) {
      console.log(err);
    }
    setAnnouncement('');
    setEditingAnnouncementIdx(-1);
  };

  const parseDate = (dateString) => {
    let dateObject = new Date(dateString);
    let month = dateObject.getMonth() + 1; // getMonth() returns a zero-based value (where zero indicates the first month of the year)
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
  const createAnnouncement = async (message) => {
    setAnnouncement('');
    try {
      if (message.length < 1) return;
      const classCode = classroom.classCode;
      const url = `${baseUrl}/classroom/announcements`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classCode, message }),
      });
      const data = await response.json();
      classroom.announcements.push(data.body);
      console.log(data.message);
    } catch (err) {
      console.log(err);
    }
    setAnnouncement('');
    setIsModalOpen(false);
  };

  const deleteAnnouncement = async (id) => {
    try {
      if (!id) return;
      const url = `${baseUrl}/classroom/announcements/${id}`;
      const response = await fetch(url, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      setClassroom((prevClassroom) => ({
        ...prevClassroom,
        announcements: prevClassroom.announcements.filter(
          (announcement) => announcement.id !== id
        ),
      }));
      console.log(data.message);
    } catch (err) {
      console.log(err);
    }
    setAnnouncement('');
  };

  if (selectedStudent) {
    return (
      <StudentProfile
        uidOfTeacher={uid}
        student={selectedStudent}
        classroom={classroom}
      >
        <button
          onClick={() => setSelectedStudent(null)}
          style={{ margin: '0px' }}
          className="ml-4 rounded-lg bg-blue-600 px-2 py-1 text-white hover:bg-blue-600/50"
        >
          Back to classroom
        </button>
      </StudentProfile>
    );
  }

  if (viewCreateAssignment) {
    return <CreateAssignment classroomId={classroom.id} />;
  }

  if (viewSettings) {
    return <TeacherSettings classroom={classroom} />;
  }

  const styles = {
    textarea: {
      width: '100%',
      padding: '10px',
      margin: '10px 0',
      border: '1px solid white',
      borderRadius: '5px',
      backgroundColor: '#333',
      color: '#fff',
      resize: 'none',
      fontSize: '16px',
    },
    button: {
      backgroundColor: '#333',
      color: '#fff',
      border: 'none',
      padding: '10px 20px',
      textAlign: 'center',
      textDecoration: 'none',
      display: 'inline-block',
      fontSize: '16px',
      margin: '4px 2px',
      cursor: 'pointer',
    },
  };

  function copy() {
    var copyText = document.getElementById('copyBox');
    copyText.type = 'text';
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyText.value);
    copyText.type = 'hidden';
  }
  return (
    <>
      <Head>
        <title>Coming Soon - CTFGuide</title>
        <style>
          @import
          url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
        </style>
      </Head>
      <StandardNav />
      <div className=" min-h-screen  ">
        <div className="mx-auto mt-10 max-w-6xl">
          <div className="flex">
            <h1 className="text-3xl font-semibold text-white">
              {classroom.name}
            </h1>
            <div className="ml-auto">
              <button
                onClick={() => setViewCreateAssignment(true)}
                className="rounded-lg bg-blue-600 px-2 py-1 text-white hover:bg-blue-600/50"
              >
                Create Assignment
              </button>
              <button className="ml-4 rounded-lg bg-blue-600 px-2 py-1 text-white hover:bg-blue-600/50">
                Create Lab
              </button>
              <button
                onClick={() => setViewSettings(true)}
                className="ml-4 rounded-lg bg-blue-600 px-2 py-1 text-white hover:bg-blue-600/50"
              >
                <i className="fa fa-cog"></i> Settings
              </button>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-6 gap-x-4">
            <div className="col-span-4 rounded-lg border-t-8 border-blue-600 bg-neutral-800/50 px-4 py-3 ">
              {/* LOOPING THROUGH MEMBERS */}
              <h1 className="text-xl font-semibold text-white"> Members</h1>
              <div className="grid grid-cols-3 gap-x-2 gap-y-2">
                {classroom.teachers && classroom.teachers.length === 0 ? (
                  <div style={{ color: 'white' }}>No teachers yet...</div>
                ) : (
                  classroom.teachers &&
                  classroom.teachers.map((teacher, idx) => {
                    const i =
                      defaultImages.length - 1 - (idx % defaultImages.length);
                    return (
                      <div
                        key={idx}
                        className="flex items-center rounded-lg bg-neutral-900"
                      >
                        <img
                          src={defaultImages[i]}
                          className="ml-1 h-10 w-10 "
                        ></img>{' '}
                        <h1 className="ml-6 mt-2 pl-1 text-white">
                          {' '}
                          <i className="fas fa-user-shield"></i>{' '}
                          {teacher.username}
                        </h1>
                      </div>
                    );
                  })
                )}
                {classroom.students &&
                  classroom.students.map((student, idx) => {
                    const i = idx % defaultImages.length;
                    return (
                      <div
                        key={idx}
                        className="flex items-center rounded-lg bg-neutral-900"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setSelectedStudent(student)}
                      >
                        <img
                          src={defaultImages[i]}
                          className="ml-1 h-10 w-10 "
                        ></img>{' '}
                        <h1 className="ml-6 mt-2 pl-1 text-white">
                          {student.username}
                        </h1>
                      </div>
                    );
                  })}
              </div>

              <br></br>
              <p className="mt-10 text-white">
                Invite students to your group by sharing the join code.
              </p>
              <div className="mt-2 flex rounded-lg bg-black p-2">
                <p className="text-white" style={{ fontSize: '20px' }}>
                  {classroom.classCode}
                </p>
                <div className="ml-auto">
                  <i
                    onClick={copy}
                    class="far fa-copy cursor-pointer text-white hover:text-neutral-400"
                  ></i>
                </div>
              </div>

              <br></br>
              <h1 className="text-xl font-semibold text-white">
                {' '}
                Course Description{' '}
              </h1>
              <div
                style={{ color: 'white', cursor: 'default' }}
                className="mb-4 cursor-pointer rounded-sm  bg-neutral-900 p-3 hover:bg-neutral-900/50"
              >
                {classroom.description}
              </div>
            </div>
            <div className="col-span-2 rounded-lg  border-t-8  border-blue-600 bg-neutral-800/50 px-4 py-3">
              <h1 className="text-xl font-semibold text-white">Assignments</h1>
              <div className="mt-1 ">
                {classroom &&
                  classroom.assignments &&
                  classroom.assignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      onClick={() => {
                        window.location.href = '/assignments/' + assignment.id;
                      }}
                      className="mb-4 cursor-pointer rounded-sm  bg-neutral-900 p-3  hover:bg-neutral-900/50"
                    >
                      <h2 className="text-lg text-white">
                        {assignment.category}: {assignment.name}
                      </h2>
                      <p className="text-white">
                        Due: {parseDate(assignment.dueDate)}{' '}
                      </p>
                    </div>
                  ))}

                <button className="w-full rounded-sm bg-neutral-900 px-2 py-1 text-white">
                  View All
                </button>
              </div>
            </div>
            <br></br>
            <div className="col-span-6 rounded-lg border-l border-neutral-800 bg-neutral-800/50 px-4 py-3">
              <div className="flex items-center">
                <h1 className="text-xl text-white">Announcements</h1>
                <button
                  className="ml-4 rounded-lg bg-blue-600 px-2 py-1 text-white hover:bg-blue-600/50"
                  style={{ marginLeft: '66%' }}
                  onClick={handleOpenModal}
                >
                  Make Announcement
                </button>
              </div>
              <ul
                style={{
                  color: 'white',
                  padding: '0',
                  margin: '0',
                  height: '300px',
                  overflowY: 'auto',
                }}
              >
                {isModalOpen && (
                  <div>
                    <textarea
                      value={announcement}
                      onChange={(e) => setAnnouncement(e.target.value)}
                      rows="4"
                      cols="50"
                      style={styles.textarea}
                    ></textarea>
                    <button
                      onClick={() => createAnnouncement(announcement)}
                      style={styles.button}
                    >
                      Post
                    </button>
                    <button onClick={handleCloseModal} style={styles.button}>
                      Cancel
                    </button>
                  </div>
                )}
                {classroom.announcements &&
                  classroom.announcements
                    .slice()
                    .reverse()
                    .map((announcementObj, idx) => {
                      if (idx === editingAnnouncementIdx) {
                        return (
                          <div key={idx}>
                            <textarea
                              value={announcement}
                              onChange={(e) => setAnnouncement(e.target.value)}
                              rows="4"
                              cols="50"
                              style={styles.textarea}
                            ></textarea>
                            <button
                              onClick={() =>
                                updateAnnouncement(
                                  announcementObj.id,
                                  announcement
                                )
                              }
                              style={styles.button}
                            >
                              Update
                            </button>
                            <button
                              onClick={() => setEditingAnnouncementIdx(-1)}
                              style={styles.button}
                            >
                              Cancel
                            </button>
                          </div>
                        );
                      } else {
                        return (
                          <div style={{ position: 'relative' }} key={idx}>
                            <li
                              onClick={() => {
                                setEditingAnnouncementIdx(idx);
                                setAnnouncement(announcementObj.message);
                              }}
                              className="mb-4 cursor-pointer rounded-lg bg-neutral-900 p-3 hover:bg-neutral-900/50"
                              style={{
                                marginLeft: '10px',
                                marginTop: '10px',
                                cursor: 'default',
                              }}
                            >
                              <span style={{ fontSize: '13px' }}>
                                {new Date(
                                  announcementObj.createdAt
                                ).toLocaleDateString()}
                              </span>{' '}
                              <br></br>{' '}
                              <span style={{ fontSize: '17px' }}>
                                {announcementObj.message}
                              </span>
                            </li>
                            <span
                              onClick={() =>
                                deleteAnnouncement(announcementObj.id)
                              }
                              style={{
                                fontSize: '15px',
                                position: 'absolute',
                                right: '0',
                                paddingRight: '10px',
                                bottom: '0',
                                cursor: 'pointer',
                              }}
                            >
                              <i
                                className="fa fa-trash"
                                style={{ color: 'rgb(255,99,71)' }}
                              >
                                {' '}
                                remove
                              </i>
                            </span>
                          </div>
                        );
                      }
                    })}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <input
        type="hidden"
        id="copyBox"
        value={classroom.classCode || ''}
      ></input>

      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={setOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              onClick={() => setOpen(false)}
              className="z-2 fixed inset-0 bg-black bg-opacity-75 transition-opacity"
            />
          </Transition.Child>
          <div className="flex min-h-screen items-center justify-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  backgroundColor: '#161716',
                }}
                className="  transform  overflow-hidden rounded-lg bg-neutral-700 px-40 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:align-middle "
              >
                <div className="w-full">
                  <div className="mx-auto mt-3 text-center sm:mt-5">
                    <h1 className="text-center text-xl text-white">
                      {' '}
                      Invite by Email
                    </h1>
                    <input
                      id="email"
                      style={{ width: '250px' }}
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="cursor-outline-none mt-2 rounded-lg  border-transparent bg-neutral-800 py-0.5  text-sm  text-white outline-none focus:border-transparent  focus:outline-none  focus:ring-0  "
                      placeholder="example@ctfguide.com"
                    ></input>
                    <br></br>
                    <div className="mx-auto mt-4 w-full pb-5 text-center">
                      <button
                        onClick={handleInvite}
                        className="rounded-lg bg-neutral-800 px-4 py-2 text-white hover:bg-neutral-600/50"
                      >
                        {' '}
                        invite{' '}
                      </button>
                      <button
                        onClick={() => {
                          setOpen(false);
                        }}
                        className="ml-4 rounded-lg bg-neutral-800 px-4 py-2 text-white hover:bg-neutral-600/50"
                      >
                        Cancel
                      </button>
                      <div style={{ color: color, marginTop: '10px' }}>
                        {message}
                      </div>
                      <div style={{ color: 'white', marginTop: '10px' }}>
                        {inviteLink}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <Footer />
    </>
  );
}
