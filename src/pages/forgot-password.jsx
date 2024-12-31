import Head from 'next/head';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; // Import useRouter
import AuthFooter from '@/components/auth/AuthFooter'
export default function Forgot() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validToken, setValidToken] = useState(false);
  const [token, setToken] = useState("");
  const [tokenId, setTokenId] = useState("");

  const router = useRouter();
  async function resetPassword() {
    try {
      if(!email) {
        toast.error("Please enter a valid email");
        return;
      }

      const opt = { 
        method: 'POST', 
        body: JSON.stringify({ email }), 
        headers: { 'Content-Type': 'application/json' }
      };

      const url = process.env.NEXT_PUBLIC_API_URL + '/email/reset-password';
      const response = await fetch(url, opt);
      const data = await response.json();

      if(data.success) {
        toast.success("Password reset email has been sent. It should arrive within a few minutes.");
      } else {
        toast.error("Email failed to send try again later");
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function validateCode(token) {
    try {

      const opt = { 
        method: 'POST', 
        body: JSON.stringify({ token }), 
        headers: { 'Content-Type': 'application/json' }
      };

      const url = process.env.NEXT_PUBLIC_API_URL + '/email/reset-password-validate';
      const response = await fetch(url, opt);
      const data = await response.json();

      if(data.success) {
        setValidToken(true);
        setToken(data.body.code);
        setTokenId(data.body.id);
        setEmail(data.body.email);
      }

      else toast.error("Your token is expired, enter your email again");

    } catch(err) {
      console.log(err);
    }
  }


  async function reset() {
    if(password !== confirmPassword) {
      toast.error("passwords do not match");
      return;
    }

    let valid = false;
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long.');
    } else if (!/[A-Z]/.test(password)) {
      toast.error('Password must contain at least one uppercase letter.');
    } else if (!/[a-z]/.test(password)) {
      toast.error('Password must contain at least one lowercase letter.');
    } else if (!/[0-9]/.test(password)) {
      toast.error('Password must contain at least one number.');
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      toast.error('Password must contain at least one special character.');
    } else {
      valid = true;
    }

    if(!valid) return;

    const opt = { 
      method: 'POST', 
      body: JSON.stringify({ email, password, token, tokenId }), 
      headers: { 'Content-Type': 'application/json' }
    };

    const url = `${process.env.NEXT_PUBLIC_API_URL}/email/change-password`;
    const response = await fetch(url, opt);
    const data = await response.json();

    if(data.success) {
      toast.success("Password has been reset");
      router.push("/login");
    } else {
      toast.error("Unable to reset the password, try again later");
    }
  }


  useEffect(() => {
    if(router.query.token) {
      validateCode(router.query.token);
    }
  }, [router.query]);

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
        

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div
            style={{ backgroundColor: '#212121' }}
            className=" pb-8 pt-1 px-4 shadow border-t-4 border-blue-600 sm:px-10"
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

            {
              validToken ? 
              <div>
              <h1 className='text-white  text-xl'>Update your credentials </h1>

              <div className='mt-3'>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-200"
                >
                New Password
                </label>
                <div className="mt-1">
                  <input
                    style={{ backgroundColor: '#161716', borderWidth: '0px' }}
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="block w-full appearance-none  border border-gray-300 px-3 py-2 text-white placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="mt-4 block text-sm font-medium text-gray-200"
                >
                Confirm Password
                </label>
                <div className="mt-1">
                  <input
                    style={{ backgroundColor: '#161716', borderWidth: '0px' }}
                    type="password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="block w-full appearance-none  border border-gray-300 px-3 py-2 text-white placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              </div>

              : 
              <div>
                                <div className=''>

<h1 className='text-white  text-xl'>Account Recovery </h1>
<p className='text-white tracking-tight text-xs'>No worries - we'll get you back to your account in no time.</p>
</div>
                <label
                  htmlFor="email"
                  className="mt-4 block text-sm font-medium text-gray-200"
                >
                  Email
                </label>
                <div className="mt-1">
                  <input
                    style={{ backgroundColor: '#161716', borderWidth: '0px' }}
                    id="email"
                    name="email"
                    type="text"
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                    className="block w-full appearance-none  border border-gray-300 px-3 py-2 text-white placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            }

            {
              validToken ? 
              <div>
                <button
                onClick={reset}
                  type="submit"
                  className="flex w-full justify-center border border-transparent bg-blue-700 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Reset Password
                </button>
              </div>
                :
              <div>
                <button
                onClick={resetPassword}
                  type="submit"
                  className="flex w-full justify-center  border border-transparent bg-blue-700 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Send Password Reset Email
                </button>
              </div>
            }
<div className=''> 
<a href="./login"  className='text-center text-sm  mx-auto text-blue-500 mt-10 hover:text-blue-400'>Return to login?</a>

    </div>            </div>


          </div>
          <AuthFooter/>

        </div>


        
        
      </div>
      

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}
