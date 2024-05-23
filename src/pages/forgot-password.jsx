import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Forgot() {
  const [session, setSession] = useState();
  const [logoutUrl, setLogoutUrl] = useState();

  function resetPassword() {
    if (document.getElementById("email").value == "") {
        document.getElementById("error").classList.remove("hidden");
        return;
    }
    sendPasswordResetEmail(auth, document.getElementById("email").value)
  .then(() => {
    document.getElementById("good").classList.remove("hidden");
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
    if (document.getElementById("email").value == "") {
        document.getElementById("error").classList.remove("hidden");
        return;
    }
  });

  }


  return (
    <>
      <Head>
        <title>Forgot Password - CTFGuide</title>
        <style>
          @import
          url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
        </style>
      </Head>

      <div
        style={{ fontFamily: 'Poppins, sans-serif' }}
        className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8"
      >
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link href="../">
            <img
              className="mx-auto h-20 w-auto"
              src="../darkLogo.png"
              alt="CTFGuide"
            />
          </Link>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
            Forgot your password?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-200">
                No worries - we'll get you back to your account in no time.
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div
            style={{ backgroundColor: '#212121' }}
            className=" pb-8 pt-1 px-4 shadow sm:rounded-lg sm:px-10"
          >
            <div className="space-y-6">
              <div
                id="error"
                className="tex†-white  hidden mt-2 rounded bg-red-900 border border-red-500 px-4 py-1"
              >
                <h1 className="text-center text-white" id="errorMessage">
                  Something went wrong.
                </h1>
              </div>

              <div
                id="good"
                className="tex†-white hidden rounded bg-green-900 border border-green-500 px-4 py-1"
              >
                <h1 className="text-center text-white" id="errorMessage">
                  Password reset email has been sent. It should arrive within a few minutes.
                </h1>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-200"
                >
                  Email
                </label>
                <div className="mt-1">
                  <input
                    style={{ backgroundColor: '#161716', borderWidth: '0px' }}
                    id="email"
                    name="email"
                    type="text"
                    autoComplete="email"
                    required
                    className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-white placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>


              <div>
                <button
                onClick={resetPassword}
                  type="submit"
                  className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Send Password Reset Email
                </button>


              </div>
<div className='text-center mx-auto'> 
<a href="./login"  className='text-center text-sm  mx-auto text-white mt-10 hover:text-gray-300'>← Return to login?</a>

    </div>            </div>


          </div>
        </div>
      </div>
    </>
  );
}
