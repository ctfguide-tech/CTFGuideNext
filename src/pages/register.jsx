import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import  AuthFooter  from '../components/auth/AuthFooter';
import { ToastContainer, toast } from 'react-toastify';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import request from "../utils/request";

function Register() {
  const [validationMessage, setValidationMessage] = useState('');
  const [validationMessage2, setValidationMessage2] = useState('');
  const [userHasEdited, setUserHasEdited] = useState(false); // New state to track if the user has edited the input
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [cpassword, setCPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [accountType, setAccountType] = useState('EMAIL');
  const [showEnterCode, setShowEnterCode] = useState(false);
  const [code, setCode] = useState("");

  async function emailExists(emailData) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/account/check-email`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: emailData
          }),
        }
      );
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  }

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
    } else {
      setValidationMessage('Looks good!');
      // make message green
    }
  }, [password, cpassword, userHasEdited]);


  async function registerUser(e) {
    setAccountType('EMAIL');
    e.preventDefault();
    if(email == "" || password == "" || cpassword == "") {
      toast.error('Please fill in all fields.');
      return;
    }
    if(password.length < 8) {
      toast.error('Password must be at least 8 characters long.');
      return;
    }

    if(password !== cpassword) {
      toast.error('Passwords do not match.');
    }
    
    const exists = await emailExists(email);
    if(!exists) {
      toast.error('Email already exists.');
      return;
    }

    const url = process.env.NEXT_PUBLIC_API_URL + "/email/send";
    const response = await request(url, "POST", {email});
    if (response.success) {
      toast.success("Email was sent to " + email);
      setShowEnterCode(true);
    } else {
      toast.error("Email failed to send try again later");
    }
  }

  async function verifyCode(e) {
    e.preventDefault();
    if(!code) {
      toast.error("Please enter a code");
      return;
    }
    const url = process.env.NEXT_PUBLIC_API_URL + "/email/verify";
    const response = await request(url, "POST", {email, code});
    if (response.success) {
      setShowOnboarding(true);
    } else {
      toast.error(response.message);
    }
  }

  async function handleSuccess(data) {
    console.log("Setting account by google");
    setAccountType('GOOGLE');
    const { credential } = data;
    const decode = jwtDecode(credential);
    setEmail(decode.email);
    const exists = await emailExists(decode.email);
    if(!exists) {
      toast.error('Email already exists.');
      return;
    }
    setPassword('');
    setShowOnboarding(true);
  }

  async function handleError(data) {
    console.log(data);
    toast.error('Account failed to create.');
  }

  return (
    <>
      {
        showOnboarding ? (
          <>
            <Head>
              <title>Dashboard - CTFGuide</title>
              <meta
                name="description"
                content="Cybersecurity made easy for everyone"
              />
            </Head>
            <main>
              <div className="h-flex h-screen items-center justify-center">
                <OnboardingFlow email={email} password={password} accountType={accountType} />
              </div>
            </main>
          </>
        ) : (
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


              <form >
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
                                <h1 className="text-xl text-white font-semibold">CTFGuide </h1>
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
                           {
                            showEnterCode ? (
                              <>
                                    <label
                                      htmlFor="email"
                                      className="block text-sm font-medium text-gray-200 mt-4"
                                    >
                                      Code
                                    </label>
                                    <div className="mt-1">
                                      <input
                                        style={{ backgroundColor: '#161716', borderWidth: '0px' }}
                                        id="code"
                                        onChange={(e) => setCode(e.target.value)}
                                        name="code"
                                        type="text"
                                        value={code}
                                        required
                                        className="block w-full appearance-none rounded-sm border border-gray-300 px-3 py-2 text-white placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                                      />
                                    </div>

                                  </>
                                ) : (
                                  <>
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
                                          onChange={(e) => setEmail(e.target.value)}
                                          name="email"
                                          type="text"
                                          autoComplete="email"
                                          required
                                          className="block w-full appearance-none rounded-sm border border-gray-300 px-3 py-2 text-white placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                                        />
                                      </div>
                                      <br></br>
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
                                        <div className={validationMessage === "Looks good!" ? "text-green-500 text-sm mt-2" : "text-red-500 text-sm mt-2"}>
                                          {validationMessage}
                                        </div>
                                      )}
                                    </div>
                                      <br></br>
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
                                        <div className={validationMessage2 === "Looks good!" ? "text-green-500 text-sm mt-2" : "text-red-500 text-sm mt-2"}>
                                          {validationMessage2}
                                        </div>
                                      )}
                                    </div>
                                  </>
                                )
                              }
                            </div>

                            {
                              !showEnterCode ? (
                                <div className='mt-4'>
                                  <button
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

                              ) : (
                                <div className='mt-4'>
                                  <button
                                    onClick={(e) => verifyCode(e)}
                                    className="flex w-full justify-center rounded-sm border border-transparent bg-blue-700 hover:bg-blue-700/90 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                  >
                                    {
                                      isLoading ? (
                                        <i className="fas fa-spinner text-md fa-spin"></i>
                                      ) : (
                                        <span className='text-md'>Verify Code</span>
                                      )
                                    }
                                  </button>
                                </div>
                              )
                            }

                          </div>

                          {
                          !showEnterCode && (
                              <div className="mt-6 ">
                                <div className="mt-6  gap-3 ">
                                  <div>
                                    <GoogleLogin
                                      clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
                                      onSuccess={(data) => handleSuccess(data)}
                                      onFailure={(data) => handleError(data)}
                                      text="signup_with" // Custom button text
                                      theme="filled_black" // Optional: Choose between "default", "dark", or "light" themes
                                      width="370" // Optional: Custom button width
                                    />
                                  </div>
                                </div>
                              </div>
                            )
                        }

                      </div>

                      <AuthFooter/>

                    </div>

                    <div>

                      
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
          )
      }
    </>
  );
}
export default Register;
