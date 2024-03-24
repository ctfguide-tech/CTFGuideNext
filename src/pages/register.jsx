import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { app } from '../config/firebaseConfig';
import  AuthFooter  from '../components/auth/AuthFooter';
const provider = new GoogleAuthProvider();

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Register() {
  const [validationMessage, setValidationMessage] = useState('');
  const [validationMessage2, setValidationMessage2] = useState('');

  const [userHasEdited, setUserHasEdited] = useState(false); // New state to track if the user has edited the input
  const [password, setPassword] = useState('');
  const [cpassword, setCPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (!userHasEdited) return; // Don't validate until the user edits the input
  
    if (password !== cpassword) {
      setValidationMessage2('Passwords do not match.');
    } else {
      if (cpassword !== "") {
      setValidationMessage2('Looks good!');
      } else {
        setValidationMessage2('');
      }
    }
    if (password == "") {
      setValidationMessage('')

      return;
    }
    // some password safety
  if (password.length < 8) {
    setValidationMessage('Password must be at least 8 characters long.');
  } else if (!/[A-Z]/.test(password)) {
    setValidationMessage('Password must contain at least one uppercase letter.');
  } else if (!/[a-z]/.test(password)) {
    setValidationMessage('Password must contain at least one lowercase letter.');
  } else if (!/[0-9]/.test(password)) {
    setValidationMessage('Password must contain at least one number.');
  } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    setValidationMessage('Password must contain at least one special character.');
  } else {
    setValidationMessage('Looks good!');
    // make message green
    
  }

    
  }, [password, cpassword, userHasEdited]);

  async function loginGoogle() {
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        // Fetch ID Token
        result.user.getIdToken().then((idToken) => {
          //console.log("We are making a register");
          // Send token to backend via HTTPS
          var data = new FormData();
          var xhr = new XMLHttpRequest();
          xhr.open('GET', `${process.env.NEXT_PUBLIC_API_URL}/account`);
          xhr.addEventListener('readystatechange', function () {
            if (this.readyState === 4) {
              try {
                var parsed = JSON.parse(this.responseText);

                document.cookie = `idToken=${idToken}; SameSite=None; Secure; Path=/`;
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

                document.cookie = `idToken=${idToken}; SameSite=None; Secure; Path=/`;
                window.location.replace('/dashboard');
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

        toast.error(errorMessage);
      });
  }

  async function registerUser() {
    const auth = getAuth();

    if (
      document.getElementById('password').value ===
      document.getElementById('cpassword').value
    ) {
      createUserWithEmailAndPassword(
        auth,
        document.getElementById('email-address').value,
        document.getElementById('cpassword').value
      )
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          userCredential.user.getIdToken().then((idToken) => {

            document.cookie = `idToken=${idToken}; SameSite=None; Secure; Path=/`;
            var xhr = new XMLHttpRequest();
            xhr.open('GET', `${process.env.NEXT_PUBLIC_API_URL}/account`);
            xhr.addEventListener('readystatechange', function () {
              if (this.readyState === 4) {
                var parsed = JSON.parse(this.responseText);
                document.cookie = `idToken=${idToken}; SameSite=None; Secure; Path=/`;
                window.location.replace('/onboarding');
              }
            });
            xhr.setRequestHeader('Authorization', `Bearer ${idToken}`);
            xhr.send();
          });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // handle each error
          if (errorCode === 'auth/invalid-credential') {
            toast.error('Invalid credentials.');
          }
          if (errorCode === 'auth/invalid-email') {
            toast.error('Invalid email.');
          }
          if (errorCode === 'auth/invalid-password') {
            toast.error('Invalid password.');
          }
        
          
        });
    } else {
      toast.error("Passwords do not match.");
    }
  }
  return (
    <>
      <Head>
        <title>Sign Up - CTFGuide</title>
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

<h1 className='text-white  text-xl'>Get started on</h1>
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
                    href="../login"
                    className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  Already have an account?
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
                        id="email-address"
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
      type="password"
      name="name"
      id="password"
      value={password}
      autoComplete="current-password"
      required
    
      onChange={(e) => {
        setPassword(e.target.value);
        if (!userHasEdited) setUserHasEdited(true); // Set to true on first edit
      }}
      className="block w-full appearance-none rounded-sm border border-gray-300 px-3 py-2 text-white placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
      />
    {userHasEdited && validationMessage && (
      <div className={validationMessage === "Looks good!" ? "text-green-500 text-sm mt-2"  : "text-red-500 text-sm mt-2"}>
      {validationMessage}
      </div>
    )}


                    </div>
                    </div>


                    <div>
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-200"
                    >
                       Confirm Password
                    </label>
                    <div className="mt-1">
                        <input
                        style={{ backgroundColor: '#161716', borderWidth: '0px' }}
                        id="cpassword"
                        name="cpassword"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={cpassword}
                        onChange={(e) => {
                          setCPassword(e.target.value);
                        }}
                        className="block w-full appearance-none rounded-sm border border-gray-300 px-3 py-2 text-white placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                        />
                          {userHasEdited && validationMessage2 && (
      <div className={validationMessage2 === "Looks good!" ? "text-green-500 text-sm mt-2"  : "text-red-500 text-sm mt-2"}>
      {validationMessage2}
      </div>
    )}
                    </div>
                    </div>


                    <div className='mt-4'>
                    <button
                        type="submit"
                        onClick={registerUser}
                        className="flex w-full justify-center rounded-sm border border-transparent bg-blue-700 hover:bg-blue-700/90 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        {
                          isLoading ? (
                            <i className="fas fa-spinner text-md fa-spin"></i>
                          ) : (
                            <span className='text-md'>Create an account</span>
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
                        <span className="sr-only">Sign up with Google</span>
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
                        <p className="ml-2">Sign up with Google</p>
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
