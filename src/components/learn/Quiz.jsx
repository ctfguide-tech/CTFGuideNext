import { useState, useEffect } from "react";

export function Quiz({ page, sublesson }) {
  /**
   * const [quizData, setQuizData] = useState(null);
   * 
  useEffect(() => {
    fetch(`http://localhost:3000/quiz/${page}`)
      .then((response) => response.json())
      .then((data) => setQuizData({
        "question": "Is javascript free?",
        "answers": ["Yes", "No", "Javascript follows a freemium model where users get 10 GB of javascript free and then $5 for each following 10 GBs"]
      }))
      .catch(
        setQuizData({
            "question": "Is javascript free?",
            "answers": ["Yes", "No", "Javascript follows a freemium model where users get 10 GB of javascript free and then $5 for each following 10 GBs"]
          })
      );
  }, [page]);

  if (!quizData) {
    return <div></div>;
  }
  **/

  const checkAnswer = () => {
    // Check answer
    // const selectiom = formSubmission
    if (/**quizData[parseInt(page) - 1].solution == selection*/1) {
      console.log("Submission correct!")
      useEffect(() => {
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/lessons/sublesson/${sublesson}/progress/${page}`, {
              method: 'PUT',
              headers: {
                  "Content-Type": "application/json",
                  "Authorization": "Bearer " + localStorage.getItem("idToken"),
              },
          })
          .then((res) => res.json())
          .catch((err) => {
              // Trigger Unauthenticated Popup
          });
      }, [])
    } else {
      // Answer not correct!
      console.log("Submission incorrect!")
    }
  };

  const quizData = [
    {
      "question": "What is Linux?",
      "answers": ["An operating system", "A programming language", "A video game", "A web browser"],
      "solution": "An operating system"
    },
    {
      "question": "Which command is used to list files and directories in Linux?",
      "answers": ["pwd", "ls", "cd", "cat"],
      "solution": "ls"
    },
    {
      "question": "Which command is used to change the permissions of a file in Linux?",
      "answers": ["chmod", "chown", "chgrp", "chmodx"],
      "solution": "chmod"
    },
    {
      "question": "Which command is used to create a new directory in Linux?",
      "answers": ["mkdir", "touch", "cp", "mv"],
      "solution": "mkdir"
    },
    {
      "question": "Which command is used to search for a specific string in a file in Linux?",
      "answers": ["grep", "find", "locate", "whereis"],
      "solution": "grep"
    },
    {
      "question": "Which command is used to remove a directory in Linux?",
      "answers": ["rmdir", "rm", "mv", "cp"],
      "solution": "rmdir"
    }
  ]
  const { question, answers } = quizData[page - 1];

  return (
    <div
      style={{
        backgroundColor: "#212121",
        padding: "1rem",
        borderRadius: "0.5rem",
        width: "85%",
      }}
    >
      <h2
        style={{
          color: "white",
          fontWeight: "bold",
          fontSize: "1.5rem",
          marginBottom: "0.5rem",
        }}
      >
        Question {page}:
      </h2>
      <p style={{ color: "white", fontSize: "1.25rem", marginBottom: "1rem" }}>
        {question}
      </p>
      <form>
        {answers.map((answer, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "0.5rem",
            }}
          >
            <input
              type="radio"
              id={`option${index + 1}`}
              name="answer"
              value={`option${index + 1}`}
              style={{ marginRight: "0.5rem" }}
            />
            <label
              htmlFor={`option${index + 1}`}
              style={{ color: "white", fontSize: "1.25rem" }}
            >
              {answer}
            </label>
          </div>
        ))}
        <button
          type="submit"
          onSubmit={checkAnswer()}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          style={{ marginTop: "1rem" }}
        >
          Submit
        </button>
      </form>
    </div>
  );
}
