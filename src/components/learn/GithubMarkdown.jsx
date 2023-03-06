import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

export default function GitHubMarkdown({ url }) {
  const [markdown, setMarkdown] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(url);
      const data = await response.text();
      setMarkdown(data);
    };
    fetchData();
  }, [url]);

  return <ReactMarkdown>{markdown}</ReactMarkdown>;
};
