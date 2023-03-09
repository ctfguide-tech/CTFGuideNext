import { useState, useEffect } from "react";

export function Quiz({ page }) {
  const [quizData, setQuizData] = useState(null);

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

  const { question, answers } = quizData;

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
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          style={{ marginTop: "1rem" }}
        >
          Submit
        </button>
      </form>
    </div>
  );
}
