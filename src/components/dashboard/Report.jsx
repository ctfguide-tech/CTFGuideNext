import { useState } from 'react';
import Head from 'next/head';
import { TextField } from '@/components/Fields';
import { motion } from 'framer-motion';

export default function ReportForm() {
  const [text, setText] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [showError, setErrorPopup] = useState(false);

  function handleSubmit(event) {
    try {
      event.preventDefault();
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/report?type=USER`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('idToken'),
        },
        body: JSON.stringify({ message: text, itemid: '' }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Report Sent', data);
          if (data?.error) {
            setErrorPopup(true);
            setTimeout(() => setErrorPopup(false), 4000);
          } else {
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 4000);
          }
        })
        .catch((error) => {
          setErrorPopup(true);
          setTimeout(() => setErrorPopup(false), 4000);
        });
    } catch {}
  }

  return (
    <>
      <Head>
        <title>Report a Bug</title>
        <style>
          @import
          url("https://fonts.googleapis.com/css2?family=Poppins&display=swap");
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
            style={{ backgroundColor: '#212121' }}
            className="py-8 px-4 shadow sm:rounded-lg sm:px-10"
          >
            <form onSubmit={handleSubmit} className="space-y-2">
              <label
                for="difficulty"
                className="block text-sm font-medium leading-5 text-gray-200"
              >
                Message
              </label>
              <div>
                <TextField
                  id="text"
                  type="text"
                  required
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  className="mb-6"
                />
              </div>
              <label
                for="difficulty"
                className="block text-sm font-medium leading-5 text-gray-200"
              >
                Report Type
              </label>
              <select
                style={{ backgroundColor: '#363636' }}
                id="type"
                className="block w-full rounded border-none pr-40 pl-3 pr-10 text-base leading-6 text-white focus:outline-none sm:text-sm sm:leading-5"
              >
                <option disabled="">General</option>
                <option>User</option>
                <option>Challenge</option>
                <option>Bug</option>
              </select>
              <div>
                <button
                  type="submit"
                  className="mt-8 flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Submit Report!
                </button>
              </div>
            </form>
          </div>
        </div>
        {showPopup && (
          <motion.h1
            className="center animate-slide-in-right fixed bottom-6 right-6 rounded-md bg-blue-400 p-2 py-2 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div>Submitted Report!</div>
          </motion.h1>
        )}
        {showError && (
          <motion.h1
            className="center animate-slide-in-right fixed bottom-6 right-6 rounded-md bg-blue-400 p-2 py-2 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div>Failed to send Report!</div>
          </motion.h1>
        )}
      </div>
    </>
  );
}
