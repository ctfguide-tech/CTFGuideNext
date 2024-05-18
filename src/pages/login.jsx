import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import router from 'next/router';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthFooter from '@/components/auth/AuthFooter';
import { GoogleLogin } from '@react-oauth/google';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const requestOptions = { 
      method: 'POST', 
      body: JSON.stringify({ email, password }), 
      headers: { 'Content-Type': 'application/json' } 
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/account/login`, requestOptions);
      const { success, token, body } = await response.json();
      console.log(success, token, body);
      if (success) {
        document.cookie = `idToken=${token}; SameSite=None; Secure; Path=/`;

        localStorage.setItem('username', body.username);
        localStorage.setItem('firstname', body.firstName);
        localStorage.setItem('lastname', body.lastName);
        localStorage.setItem('birthday', body.birthday);

        /*
        localStorage.setItem('userLikesUrl', body.userLikesUrl);
        localStorage.setItem('userChallengesUrl', body.userChallengesUrl);
        localStorage.setItem('userBadgesUrl', body.userBadgesUrl);
        localStorage.setItem('notificationsUrl', body.notificationsUrl);
        */

        router.push('/dashboard');
      } else {
        toast.error('Invalid credentials');
      }
    } catch(error) {
      console.log(error);
    }
    setIsLoading(false);
  }

  // do the same for google auth login
  async function handleSuccess(data) {
    console.log(data);
  }

  async function handleError(data) {
    console.log(data);
  }

  return (
    <>
        <Head>
            <title>Sign In - CTFGuide</title>
            <style>
            @import
            url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
            </style>
        </Head>
        <div style={{
            backgroundPosition: 'center',
            backgroundRepeat: 'repeat',
            width: '100%',
            height: '100%',
        }}>
            <div
            style={{ fontFamily: 'Poppins, sans-serif' }}
            className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 animate__animated animate__fadeIn "
            >
          <form onSubmit={handleLogin}>

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
           
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md ">
              <div>
              <div
                
                className=" pb-10 pt-4 px-4 shadow sm:px-10 border-t-4 border-blue-600 bg-neutral-800"
                >
                <div className="space-y-6">
                    <div
                    id="error"
                    className="tex†-white hidden rounded bg-red-500 px-4 py-1"
                    >
                    <h1 className="text-center text-white" id="errorMessage">
                        Something went wrong.
                    </h1>
                    </div>
                    <div>
<div className='flex items-center'>

<h1 className='text-white  text-xl'>Login to </h1>
                      <Link href="/" className="flex items-center ml-1">
                <img
                  className="z-10 h-10 w-10"
                  src="/darkLogo.png"
                  alt="CTFGuide"
                />
                <h1 className="text-xl text-white font-semibold">CTFGuide</h1>
              </Link>
</div>
                <p className="text-sm text-gray-600">
                <a
                    href="../register"
                    className="font-semibold text-blue-600 hover:text-blue-700"
                >
                    Don't have an account?
                </a>
                </p>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-200 mt-4"
                    >
                        Email
                    </label>
                    <div className="mt-1">
                        <input
                        style={{ backgroundColor: '#161716', borderWidth: '0px' }}
                        id="username"
                        name="email"
                        onChange={(e) => setEmail(e.target.value)}
                        type="text"
                        autoComplete="email"
                        required
                        className="block w-full appearance-none rounded-sm border border-gray-300 px-3 py-2 text-white placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                        />
                    </div>
                    </div>

                    <div>
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-200"
                    >
                        Password
                    </label>
                    <div className="mt-1">
                        <input
                        style={{ backgroundColor: '#161716', borderWidth: '0px' }}
                        id="password"
                        name="password"
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        autoComplete="current-password"
                        required
                        className="block w-full appearance-none rounded-sm border border-gray-300 px-3 py-2 text-white placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                        />
                    </div>
                    </div>

                    <div className="flex ">
                    <div className=" text-left text-sm">
                        <a
                        href="./forgot-password"
                        className="text-left font-medium text-blue-600 hover:text-blue-500"
                        >
                        Forgot your password?
                        </a>
                    </div>
                    </div>

                    <div>
                    <button
                        type="submit"
                        onClick={handleLogin}
                        className="flex w-full justify-center rounded-sm border border-transparent bg-blue-700 hover:bg-blue-700/90 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        {
                          isLoading ? (
                            <i className="fas fa-spinner text-md fa-spin"></i>
                          ) : (
                            <span className='text-md'>Sign in</span>
                          )
                        }
                  </button>
                    </div>
                </div>

                <div className="mt-6 ">
                    <div className="mt-6  gap-3 ">
                    <div>
                        <GoogleLogin
                          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
                          onSuccess={(data) => handleSuccess(data)}
                          onFailure={(data) => handleError(data)}
                          text="continue_with" // Custom button text
                          theme="filled_black" // Optional: Choose between "default", "dark", or "light" themes
                          width="370" // Optional: Custom button width
                        />
                    </div>
                    <div className='mt-2 bg-neutral-900 hidden'>
                    <a
                          href="#"
                          className="inline-flex items-center w-full justify-center rounded-sm py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-neutral-900/50"
                        >
                        <span className="sr-only">Sign in with Microsoft</span>
                        <img className='w-5 h-5 mr-2' src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Microsoft_icon.svg/512px-Microsoft_icon.svg.png" alt="Microsoft"/>
                        <p>Login with Microsoft</p>
                      </a>
                    </div>
                  </div>
                </div>

            
                </div>


            <AuthFooter/>

              </div>
            </div>
          </form>
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
