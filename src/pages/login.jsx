import Head from 'next/head';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { TextField } from '@/components/Fields';
import { Logo } from '@/components/Logo';
import { Alert } from '@/components/Alert';
import { useState, useEffect } from 'react';
import { app } from '../config/firebaseConfig';
import router from 'next/router';

import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthFooter from '@/components/auth/AuthFooter';

const provider = new GoogleAuthProvider();


export default function Login() {
  const auth = getAuth();
  const [session, setSession] = useState();
  const [logoutUrl, setLogoutUrl] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      // removing the cookie
      document.cookie = "idToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    });
  }, []);

  async function loginUser() {
    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    setIsLoading(true);

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Fetch ID Token
        userCredential.user.getIdToken().then((idToken) => {

          // Send token to backend via HTTPS
          var data = new FormData();
          var xhr = new XMLHttpRequest();

          document.cookie = `idToken=${idToken}; SameSite=None; Secure; Path=/`;

          xhr.open('GET', `${process.env.NEXT_PUBLIC_API_URL}/account`);
          xhr.addEventListener('readystatechange', function () {
            if (this.readyState === 4) {
              var parsed = JSON.parse(this.responseText);

              // Sotre username
              localStorage.setItem('username', parsed.username);

              if (!parsed.email) {
                window.location.replace('/onboarding');
                return;
              }

              // Store related API endpoints in local storage.
              localStorage.setItem('userLikesUrl', parsed.userLikesUrl);
              localStorage.setItem(
                'userChallengesUrl',
                parsed.userChallengesUrl
              );

              localStorage.setItem('userBadgesUrl', parsed.userBadgesUrl);
              localStorage.setItem('notificationsUrl', parsed.notificationsUrl);
              localStorage.setItem('role', parsed.role);

              localStorage.setItem('username', parsed.username);

              router.push('/dashboard');
            }
          });
          xhr.setRequestHeader('Authorization', 'Bearer ' + idToken);
          xhr.send(data);
        });
      })
      .catch((error) => {
        setIsLoading(false);
        const errorCode = error.code;
        const errorMessage = error.message;
     
        let userFriendlyMessage;
        switch (errorCode) {
          case 'auth/user-not-found':
            userFriendlyMessage = 'No user found with this email.';
            break;
          case 'auth/wrong-password':
            userFriendlyMessage = 'Incorrect password. Please try again.';
            break;
          case 'auth/too-many-requests':
            userFriendlyMessage = 'Too many attempts. Please try again later.';
            break;
          default:
            userFriendlyMessage = 'An error occurred. Please try again.';
        }
        toast.error(userFriendlyMessage);

      });
  }

  async function loginGoogle() {
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        // Fetch ID Token
        result.user.getIdToken().then((idToken) => {

          // Send token to backend via HTTPS
          document.cookie = `idToken=${idToken}; SameSite=None; Secure; Path=/`;

          var data = new FormData();
          var xhr = new XMLHttpRequest();

          xhr.open('GET', `${process.env.NEXT_PUBLIC_API_URL}/account`);
          xhr.addEventListener('readystatechange', function () {
            if (this.readyState === 4) {
              try {
                var parsed = JSON.parse(this.responseText);

                if (!parsed.email) {
                  // User hasn't finished onboarding.
                  window.location.replace('/onboarding');
                  return;
                }

                // Store related API endpoints in local storage.
                localStorage.setItem('userLikesUrl', parsed.userLikesUrl);
                localStorage.setItem(
                  'userChallengesUrl',
                  parsed.userChallengesUrl
                );
                localStorage.setItem('userBadgesUrl', parsed.userBadgesUrl);
                localStorage.setItem(
                  'notificationsUrl',
                  parsed.notificationsUrl
                );

                localStorage.setItem('role', parsed.role);
                localStorage.setItem('username', parsed.username);

                // addthing the token to cookies

                router.push('/dashboard');

              } catch (error) {
                console.log('Error parsing JSON data:', error);
              }
            }
          });
          xhr.setRequestHeader('Authorization', 'Bearer ' + idToken);
          xhr.send(data);
        });
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;

        const credential = GoogleAuthProvider.credentialFromError(error);
        // basic cleaned errormeSSAGE to send back

        let userFriendlyMessage;
        switch (errorCode) {
          case 'auth/user-not-found':
            userFriendlyMessage = 'No user found with this email.';
            break;
          case 'auth/wrong-password':
            userFriendlyMessage = 'Incorrect password. Please try again.';
            break;
          case 'auth/too-many-requests':
            userFriendlyMessage = 'Too many attempts. Please try again later.';
            break;
          default:
            userFriendlyMessage = 'An error occurred. Please try again.';
        }
        toast.error(userFriendlyMessage);

      });
  }

  const loginMicrosoft = () => {
    // Microsoft login logic here
    const provider2 = new OAuthProvider('microsoft.com');
    signInWithPopup(auth, provider2)
      .then((result) => {
        result.user.getIdToken().then((idToken) => {

          // Send token to backend via HTTPS
          document.cookie = `idToken=${idToken}; SameSite=None; Secure; Path=/`;

          var data = new FormData();
          var xhr = new XMLHttpRequest();

          xhr.open('GET', `${process.env.NEXT_PUBLIC_API_URL}/account`);
          xhr.addEventListener('readystatechange', function () {
            if (this.readyState === 4) {
              try {
                var parsed = JSON.parse(this.responseText);

                if (!parsed.email) {
                  // User hasn't finished onboarding.
                  window.location.replace('/onboarding');
                  return;
                }

                // Store related API endpoints in local storage.
                localStorage.setItem('userLikesUrl', parsed.userLikesUrl);
                localStorage.setItem(
                  'userChallengesUrl',
                  parsed.userChallengesUrl
                );
                localStorage.setItem('userBadgesUrl', parsed.userBadgesUrl);
                localStorage.setItem(
                  'notificationsUrl',
                  parsed.notificationsUrl
                );

                localStorage.setItem('role', parsed.role);
                localStorage.setItem('username', parsed.username);

                // addthing the token to cookies

                router.push('/dashboard');

              } catch (error) {
                console.log('Error parsing JSON data:', error);
              }
            }
          });
          xhr.setRequestHeader('Authorization', 'Bearer ' + idToken);
          xhr.send(data);
        });
      }).catch((error) => {
        // Handle Errors here.
        console.log(error)
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The MicrosoftAuthProvider credential to access the Microsoft API.
        const credential = error.credential;
        // Display error message
        document.getElementById('error').classList.remove('hidden');
        document.getElementById('errorMessage').innerHTML = errorMessage;
      });
  };

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
                        onClick={loginUser}
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
                        <a
                      
                        href="#"
                        className="inline-flex w-full bg-neutral-900 justify-center rounded-sm   py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-neutral-900/50"
                        onClick={loginGoogle}
                        >
                        <span className="sr-only">Sign in with Google</span>
                        <svg
                            className="h-6 w-6"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 48 48"
                            width="48px"
                            height="48px"
                        >
                            <path
                            fill="#FFC107"
                            d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                            />
                            <path
                            fill="#FF3D00"
                            d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                            />
                            <path
                            fill="#4CAF50"
                            d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                            />
                            <path
                            fill="#1976D2"
                            d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                            />
                        </svg>
                        <p className="ml-2">Login with Google</p>
                        </a>
                    </div>
                    <div className='mt-2 bg-neutral-900 hidden'>
                    <a
  href="#"
  className="inline-flex items-center w-full justify-center rounded-sm py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-neutral-900/50"
  onClick={loginMicrosoft} // Remember to update this to your Microsoft login function
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
