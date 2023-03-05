import React, { useState, useEffect } from "react";
import axios from "axios";

function TabContent({ activeTab }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let response;

      console.log(activeTab)
      switch (activeTab) {
        case "Tab 1":
          response = await axios.get("https://api.example.com/tab1");
          break;
        case "Tab 2":
          response = await axios.get("https://api.example.com/tab2");
          break;
        case "Tab 3":
          response = await axios.get("https://api.example.com/tab3");
          break;
        default:
          response = await axios.get("https://api.example.com/default");
          break;
      }

      setData(response.data);
    };

    fetchData();
  }, [activeTab]);

  return (
    <div>
      {data.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}

export default TabContent;
