import React, { useState, useEffect } from 'react';

const Modal = ({ isOpen, createAnnouncement, onClose }) => {
 const [modalStyle, setModalStyle] = useState({});
 const [message, setMessage] = useState("");

 useEffect(() => {
  if (isOpen) {
    setModalStyle({
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.4)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: '1000'
    });
  } else {
    setModalStyle({});
  }
 }, [isOpen]);

 return (
    <div style={modalStyle}>
    <div style={{backgroundColor: '#333', color: '#fff', padding: '20px', borderRadius: '10px'}}>
        <div>This message will be displayed to all members of the class</div>
    <textarea
    value={message}
    onChange={(e) => setMessage(e.target.value)}
        rows="4" 
        cols="50" 
        style={{
        width: '100%', 
        padding: '10px', 
        margin: '10px 0', 
        border: "1px solid white", 
        borderRadius: '5px', 
        backgroundColor: '#333', 
        color: '#fff', 
        resize: 'none', 
        fontSize: '16px'
        }}
    ></textarea>
    <button onClick={() => createAnnouncement(message)} style={{backgroundColor: '#4CAF50', color: '#fff', border: 'none', padding: '10px 20px', textAlign: 'center', textDecoration: 'none', display: 'inline-block', fontSize: '16px', margin: '4px 2px', cursor: 'pointer'}}>Send</button>
    <button onClick={onClose} style={{backgroundColor: '#4CAF50', color: '#fff', border: 'none', padding: '10px 20px', textAlign: 'center', textDecoration: 'none', display: 'inline-block', fontSize: '16px', margin: '4px 2px', cursor: 'pointer'}}>Close</button>
    </div>
    </div>

 );
};

export default Modal;
