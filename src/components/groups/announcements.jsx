import { useState } from 'react';
import request from '@/utils/request';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const [makingNewPost, setMakingNewPost] = useState(false);
  const [loading, setLoading] = useState(false);
  const [displayConfirm, setDisplayConfirm] = useState(-1);

  const handleCloseModal = () => {
    setEditingAnnouncementIdx(-1);
    setIsModalOpen(false);
    setMakingNewPost(false);
  };

  const updateAnnouncement = async (id, message) => {
    setLoading(true);
    if (!id) {
      toast.error('Unable to make announcement, Please refresh the page.');
      return;
    }
    const url = `${baseUrl}/classroom/announcements/${id}/${classCode}`;
    const body = { message };
    const data = await request(url, 'PUT', body);
    if(data && data.success) {
      setAnnouncements((currentItems) =>
        currentItems.map((item) =>
          item.id === id ? { ...item, message: message } : item
        )
      );
    } else {
      console.log(data.message);
      toast.error('Unable to make announcement, Please refresh the page.');
    }
    setAnnouncement('');
    setEditingAnnouncementIdx(-1);
    setLoading(false);
  };

  const createAnnouncement = async (message) => {
    setLoading(true);
    const username = localStorage.getItem('username');
    if (message.length < 1) {
      toast.error('Announcement cannot be empty.');
      setLoading(false);
      setAnnouncement('');
      setEditingAnnouncementIdx(-1);
      setMakingNewPost(false);
      return;
    }
    const body = {
      classCode,
      message,
      type: 'IMPORTANT',
      username,
    };
    const url = `${baseUrl}/classroom/announcements/${classCode}`;
    const data = await request(url, 'POST', body);
    if(data && data.success) {
      let tmp = [...announcements];
      tmp.push(data.body);
      setAnnouncements(tmp);
      setIsModalOpen(false);
    }
    setLoading(false);
    setAnnouncement('');
    setEditingAnnouncementIdx(-1);
    setMakingNewPost(false);
  };

  const deleteAnnouncement = async (id) => {
    setLoading(true);
    if (!id) return;
    const url = `${baseUrl}/classroom/announcements/${id}/${classCode}`;
    const data = await request(url, 'DELETE', null);
    if(data && data.success) {
      setAnnouncements((currentItems) =>
        currentItems.filter((item) => item.id !== id)
      );
    } else {
      console.log(data.message);
    }
    setAnnouncement('');
    setLoading(false);
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
          <h1 className="text-xl text-white font-semibold">Announcements</h1>
        </div>
        <ul
          style={{
            color: 'white',
            padding: '0',
            margin: '0',
            height: '350px',
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
                        {
                          /*
                        <span
                          className="bg-green-900 ml-4 text-sm text-white px-2 py-1 rounded-md"
                          style={{ marginRight: '5px' }}
                        >
                          {`${announcementObj.type}`}
                        </span>
                           * */
                        }
                        <br></br> <span style={{whiteSpace: 'pre-wrap'}}> {announcementObj.message}</span>
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
        <div className="ml-auto mt-8 ">
          <button
            disabled={editingAnnouncementIdx !== -1}
            onClick={() => {
              setMakingNewPost(true);
              setIsModalOpen(true);
              setAnnouncement('');
            }}
            className="rounded-lg bg-neutral-800/80 px-4 py-0.5 text-white"
          >
            <i className="fas fa-bullhorn pe-2"></i> New Post
          </button>
        </div>
      </div>
      <ul
        style={{
          color: 'white',
          padding: '0',
          margin: '0',
          height: '500px',
          overflowY: 'auto',
        }}
      >

      {isModalOpen && (
        <div style={{ paddingBottom: '15px' }}>
          <textarea
            value={announcement}
            onChange={(e) => {
              setAnnouncement(e.target.value);
            }}
              rows={Math.max(announcement.length/70, 6)}
            cols="50"
            className=" my-4 w-full rounded-lg border border-neutral-800/50 bg-neutral-800 p-2 text-white"
          ></textarea>
          <button
            disabled={loading}
            onClick={() => createAnnouncement(announcement)}
            className="mr-2 rounded-lg bg-blue-600 px-2 py-1 text-white hover:bg-blue-600/50"
          >
            {loading ? 
              <span>
              Posting {" "}
              <i className="fas fa-spinner fa-pulse"
                style={{color: "white", fontSize: "15px"}}>
              </i>
              </span>
              : 'Post'}
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
                      rows={Math.max(announcement.length/70, 6)}
                    cols="50"
                    style={styles.textarea}
                  ></textarea>
                  <button
                    className="rounded-lg"
                    disabled={loading}
                    onClick={() =>
                      updateAnnouncement(announcementObj.id, announcement)
                    }
                    style={styles.button}
                  >
                    {
                      loading ? 
                      <span>
                      Updating {" "}
                      <i className="fas fa-spinner fa-pulse"
                        style={{color: "white", fontSize: "15px"}}>
                      </i>
                      </span>
                      : 'Update'
                    }
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
              return (
                <div style={{ position: 'relative' }} key={idx}>
                  <li
                    onClick={() => {
                      if (!makingNewPost) {
                        setEditingAnnouncementIdx(idx);
                        setAnnouncement(announcementObj.message);
                      }
                    }}
                    className="w-fullhover:border-blue-500 mb-4 cursor-pointer list-none rounded-lg border border-neutral-900/50  bg-neutral-800 px-4 py-2"
                  >
                    <span className="text-white" style={{ fontSize: '15px' }}>
                      {announcementObj.author}{' '}
                      {new Date(announcementObj.createdAt).toLocaleDateString()}{' '}
                      &nbsp;
                      {new Date(
                        announcementObj.createdAt
                      ).toLocaleTimeString()}{' '}
                      <br></br>
                      <textarea
                        value={announcementObj.message}
                        id="bio"
                        name="bio"
                        rows={Math.max(announcementObj.message.length/70, 3)}
                        className="resize-none block w-full rounded-md border-0 border-none bg-transparent text-white shadow-none placeholder:text-slate-400 focus:ring-0 sm:py-0 sm:text-sm sm:leading-6 p-0"
                        readOnly
                      />

                    </span>{' '}
                    <br></br>{' '}
                  </li>

                    {
                      displayConfirm !== idx ? (

                  <span
                    onClick={() => setDisplayConfirm(idx)}
                    disabled={loading}
                    className="absolute bottom-0 right-0  mb-1 mr-2 cursor-pointer rounded-lg bg-neutral-800 px-2 text-sm text-white hover:bg-neutral-800/50"
                  >
                    <i className="fa fa-trash mr-1 text-red-500"> </i>
                    Delete

                  </span>
                      ) : (
                          <span
                            className="absolute bottom-0 right-0  mb-1 mr-2 cursor-pointer rounded-lg bg-neutral-800 px-2 text-sm text-white hover:bg-neutral-800/50"
                          >
                            <button 
                              className = "rounded-lg bg-blue-700 text-white hover:bg-blue-800"
                              style={{
                                padding: "5px  10px", // Increase padding
                                margin: "0px 5px", // Increase padding
                                fontSize: "10px", // Increase font size
                                borderRadius: "5px", // Add border radius
                              }}
                              onClick={() => {
                                deleteAnnouncement(announcementObj.id) 
                                setDisplayConfirm(-1)
                              }
                              }  
                            >
                              {
                                loading ? <i className="fas fa-spinner fa-pulse" style={{color: "white", fontSize: "15px"}}></i> : "Confirm"
                              }
                            </button>
                            <button  
                              onClick={() => setDisplayConfirm(-1)}  
                              className= "rounded-lg bg-red-700 text-white hover:bg-red-800"  
                              style={{
                                padding: "5px  10px", // Increase padding
                                fontSize: "10px", // Increase font size
                                borderRadius: "5px", // Add border radius
                              }}
                            >
                              Cancel
                            </button>

                          </span>
                        )
                    }
                  </div>
                );
              }
          })}
      </ul>
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
    </div>
  );
};

export default Announcement;
