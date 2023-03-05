import { useState } from "react";
import Head from "next/head";
import { Button } from "@/components/Button";
import { TextField } from "@/components/Fields";

export default function ReportForm() {
  const [text, setText] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    fetch("/report", {
      method: "POST",
      body: JSON.stringify({ text }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  return (
    <>
      <Head>
        <title>Report a Bug - My App</title>
        <style>
          @import url("https://fonts.googleapis.com/css2?family=Poppins&display=swap");
        </style>
      </Head>
      <div className="flex min-h-full flex-col py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
            Report a Bug
          </h2>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div
            style={{ backgroundColor: "#212121" }}
            className=" py-8 px-4 shadow sm:rounded-lg sm:px-10"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <TextField
                  id="text"
                  label="Bug Description"
                  type="text"
                  required
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                />
              </div>
              <div>
                <Button type="submit" fullWidth>
                  Report
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
