import { useState, useEffect } from "react";
import Notification from "./Notification";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:3000/account/notifications");
      const data = await response.json();
      setNotifications(data);
    };
    fetchData();
    setNotifications([
        {
            "date": "1-2-19",
            "message": "Your challenge was approved!",
            "type": "CHALLENGE"
        },
        {
            "date": "1-2-19",
            "message": "Mish accepted your friend request!",
            "type": "FRIEND"
        },
        {
            "date": "1-2-19",
            "message": "Congrats on finishing Intro to Linux",
            "type": "GENERAL"
        },
    ])
  }, []);

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          style={{ backgroundColor: "#212121", color: "#F9FAFB" }}
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
        >
          Notifications
        </button>
      </div>
      <div
        className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-gray-900 ring-1 ring-gray-900 ring-opacity-5 focus:outline-none"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        tabIndex="-1"
    >
    <div className="py-1 space-y-1" role="none">
        {notifications.map((notification) => (
        <div key={notification.id}>
            <Notification
            date={notification.date}
            message={notification.message}
            type={notification.type}
        />
      </div>
    ))}
  </div>
</div>

    </div>
  );
};

export default Notifications;
