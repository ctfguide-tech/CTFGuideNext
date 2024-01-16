import { useState } from 'react';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;
const Announcement = ({
  isTeacher,
  classCode,
  announcementsProp,
  isModalOpen,
  setIsModalOpen,
}) => {
  const [announcements, setAnnouncements] = useState(announcementsProp);
  const [announcement, setAnnouncement] = useState('');

  const [editingAnnouncementIdx, setEditingAnnouncementIdx] = useState(-1);

  const handleCloseModal = () => {
    setIsModalOpen(false);
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

      setAnnouncements((currentItems) =>
        currentItems.map((item) =>
          item.id === id ? { ...item, message: message } : item
        )
      );

      console.log(data.message);
    } catch (err) {
      console.log(err);
    }
    setAnnouncement('');
    setEditingAnnouncementIdx(-1);
  };

  const createAnnouncement = async (message) => {
    setAnnouncement('');
    try {
      console.log(message);
      const token = localStorage.getItem('idToken');
      if (message.length < 1) return;
      const url = `${baseUrl}/classroom/announcements`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({
          classCode,
          message,
          type: 'IMPORTANT',
          username: localStorage.getItem('username'),
        }),
      });

      const data = await response.json();

      let tmp = announcements;
      tmp.push(data.body);
      setAnnouncements(tmp);

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

      setAnnouncements((currentItems) =>
        currentItems.filter((item) => item.id !== id)
      );

      console.log(data.message);
    } catch (err) {
      console.log(err);
    }
    setAnnouncement('');
  };

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
  if (!isTeacher) {
    return (
      <div className="col-span-6 rounded-lg border-l border-neutral-800 bg-neutral-800/50 px-4 py-3">
        <div className="flex items-center">
          <h1 className="text-xl text-white">Announcements</h1>
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
          {announcements &&
            announcements
              .slice()
              .reverse()
              .map((announcementObj, idx) => {
                return (
                  <div style={{ position: 'relative' }} key={idx}>
                    <li
                      className="mb-4 cursor-pointer rounded-lg bg-neutral-900 p-3 hover:bg-neutral-900/50"
                      style={{
                        marginLeft: '10px',
                        marginTop: '10px',
                        cursor: 'default',
                      }}
                    >
                      <span className="text-white" style={{ fontSize: '13px' }}>
                        {announcementObj.author}{' '}
                        {new Date(
                          announcementObj.createdAt
                        ).toLocaleDateString()}{' '}
                        &nbsp;
                        {new Date(
                          announcementObj.createdAt
                        ).toLocaleTimeString()}{' '}
                        {`(${announcementObj.type}) `}
                        <br></br> {announcementObj.message}
                      </span>{' '}
                    </li>
                    <span
                      onClick={() => deleteAnnouncement(announcementObj.id)}
                      style={{
                        fontSize: '15px',
                        position: 'absolute',
                        right: '0',
                        paddingRight: '10px',
                        bottom: '0',
                        cursor: 'pointer',
                      }}
                    ></span>
                  </div>
                );
              })}
        </ul>
      </div>
    );
  }

  return (
    <div className="l col-span-6 rounded-lg ">
      <div className="flex items-center ">
        <h1 className="mb-2 mt-10 text-xl font-semibold text-white">
          Announcements
        </h1>
      </div>
      <ul></ul>
      {isModalOpen && (
        <div style={{ paddingBottom: '15px' }}>
          <textarea
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            rows="4"
            cols="50"
            className=" my-4 w-full rounded-lg border border-neutral-800/50 bg-neutral-800 p-2 text-white"
          ></textarea>
          <button
            onClick={() => createAnnouncement(announcement)}
            className="mr-2 rounded-lg bg-blue-600 px-2 py-1 text-white hover:bg-blue-600/50"
          >
            Post
          </button>
          <button
            onClick={handleCloseModal}
            className="mr-2 rounded-lg bg-blue-600 px-2 py-1 text-white hover:bg-blue-600/50"
          >
            Cancel
          </button>
        </div>
      )}
      {announcements &&
        announcements
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
                    className="rounded-lg"
                    onClick={() =>
                      updateAnnouncement(announcementObj.id, announcement)
                    }
                    style={styles.button}
                  >
                    Update
                  </button>
                  <button
                    className="rounded-lg"
                    onClick={() => setEditingAnnouncementIdx(-1)}
                    style={styles.button}
                  >
                    Cancel
                  </button>
                </div>
              );
            } else {
              console.log(announcementObj);
              return (
                <div style={{ position: 'relative' }} key={idx}>
                  <li
                    onClick={() => {
                      setEditingAnnouncementIdx(idx);
                      setAnnouncement(announcementObj.message);
                    }}
                    className="w-fullhover:border-blue-500 mb-4 cursor-pointer list-none rounded-lg border border-neutral-900/50  bg-neutral-800 px-4 py-2"
                  >
                    <span className="text-white" style={{ fontSize: '13px' }}>
                      {announcementObj.author}{' '}
                      {new Date(announcementObj.createdAt).toLocaleDateString()}{' '}
                      &nbsp;
                      {new Date(
                        announcementObj.createdAt
                      ).toLocaleTimeString()}{' '}
                      {`(${announcementObj.type}) `}
                      <br></br> {announcementObj.message}
                    </span>{' '}
                    <br></br>{' '}
                  </li>
                  <span
                    onClick={() => deleteAnnouncement(announcementObj.id)}
                    className="absolute bottom-0 right-0  mb-1 mr-2 cursor-pointer rounded-lg bg-neutral-800 px-2 text-sm text-white hover:bg-neutral-800/50"
                  >
                    <i className="fa fa-trash mr-1 text-red-500"> </i>
                    Delete
                  </span>
                </div>
              );
            }
          })}
    </div>
  );
};

export default Announcement;
