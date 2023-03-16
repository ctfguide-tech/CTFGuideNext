import React, { useState } from 'react';

function MessagesMenu({slug}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [messages, setMessages] = useState([]);

  const handleClick = async () => {
    try {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/challenges/${slug}/messages`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("idToken"),
        },
      })
      .then(res => res.json())
      .then(data => {
        setMessages(response.data);
        setMenuOpen(true);
      })
      .catch(err => {
        console.log(err);
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
    <div className="rounded-md bg-[#3B82F6] hover:bg-[#468dff]">
        <button onClick={handleClick}>
            <div className="flex mx-auto text-center h-10 my-auto">
                <h1 className='text-lg text-white mx-auto my-auto font-semibold'>See Admin Messages</h1>
            </div>
        </button>
    </div>
      {menuOpen && (
        <div>
          {messages.map((message, index) => (
            <div key={index}>
              <h3>{message.title || 'No title provided!'}</h3>
              <p>{message.content || 'No text provided!'}</p>
              <p>{message.createdAt}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MessagesMenu;
