import Head from 'next/head'
import Link from 'next/link'
import { Button } from '@/components/Button'
import { TextField } from '@/components/Fields'
import { Logo } from '@/components/Logo'
import { Alert } from '@/components/Alert'
import { useState, useEffect } from "react"
import { app } from '../config/firebaseConfig';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth"

const provider = new GoogleAuthProvider();

export default function Login() {
  const auth = getAuth();
  const [session, setSession] = useState();
  const [logoutUrl, setLogoutUrl] = useState();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
      }
    });
  }, [])


  async function loginUser() {
    const email = document.getElementById("username").value
    const password = document.getElementById("password").value

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {


        // Fetch ID Token
        userCredential.user.getIdToken().then((idToken) => {
          // Send token to backend via HTTPS
          var data = new FormData();
          var xhr = new XMLHttpRequest();


          xhr.open("GET", `${process.env.NEXT_PUBLIC_API_URL}/account`);
          xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
              var parsed = JSON.parse(this.responseText);

              // Store Token in local storage.
              localStorage.setItem("idToken", idToken);


              if (!parsed.email) {
                // User hasn't finished onboarding.
                window.location.replace("/onboarding");
                return;
              }

              // Store related API endpoints in local storage.
              localStorage.setItem("userLikesUrl", parsed.userLikesUrl);
              localStorage.setItem("userChallengesUrl", parsed.userChallengesUrl);
              localStorage.setItem("userBadgesUrl", parsed.userBadgesUrl);
              localStorage.setItem("notificationsUrl", parsed.notificationsUrl);
              localStorage.setItem("email", parsed.email);
              localStorage.setItem("role", parsed.role);


              // Redirect to dashboard
              window.location.replace("/dashboard");

            }
          });
          xhr.setRequestHeader("Authorization", "Bearer " + idToken);
          xhr.send(data);
        }
        );

      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        document.getElementById("error").classList.remove("hidden");
        document.getElementById("errorMessage").innerHTML = errorMessage;
      });

  }

  async function loginGoogle() {
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
       

           // Fetch ID Token
           result.user.getIdToken().then((idToken) => {
            // Send token to backend via HTTPS
            console.log(idToken)
            localStorage.setItem("idToken", idToken);


            var data = new FormData();
            var xhr = new XMLHttpRequest();

  

            xhr.open("GET", `${process.env.NEXT_PUBLIC_API_URL}/account`);
            xhr.addEventListener("readystatechange", function () {
              if (this.readyState === 4) {
                try {
                  var parsed = JSON.parse(this.responseText);
                  
              
                  if (!parsed.email) {
                    // User hasn't finished onboarding.
                    window.location.replace("/onboarding");
                    return;
                  }

                  // Store related API endpoints in local storage.
                  localStorage.setItem("userLikesUrl", parsed.userLikesUrl);
                  localStorage.setItem("userChallengesUrl", parsed.userChallengesUrl);
                  localStorage.setItem("userBadgesUrl", parsed.userBadgesUrl);
                  localStorage.setItem("notificationsUrl", parsed.notificationsUrl);
                  localStorage.setItem("email", parsed.email);
                  localStorage.setItem("role", parsed.role);

                  window.location.replace("/dashboard")
                } catch (error) {
                  console.log("Error parsing JSON data:", error);
                }
              }
            });
            xhr.setRequestHeader("Authorization", "Bearer " + idToken);
            xhr.send(data);
          }
          );

      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
      
        const credential = GoogleAuthProvider.credentialFromError(error);
        
        document.getElementById("error").classList.remove("hidden");
        document.getElementById("errorMessage").innerHTML = errorMessage;
      });
  }


  return (
    <>
      <Head>
        <title>Sign In - CTFGuide</title>
        <style>
          @import url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
        </style>
      </Head>


      <div style={{ fontFamily: "Poppins, sans-serif" }} className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link href="../">
            <img
              className="mx-auto h-20 w-auto"
              src="../darkLogo.png"
              alt="CTFGuide"
            />
          </Link>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">Sign in to your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">

            <a href="../register" className="font-semibold text-blue-600 hover:text-blue-500">
              Don&apos;t have an account?
            </a>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div style={{ backgroundColor: "#212121" }} className=" py-8 px-4 shadow sm:rounded-lg sm:px-10">

            <div className="space-y-6">
              <div id="error" className="hidden bg-red-500 px-4 py-1 rounded tex†-white">
                <h1 className='text-white text-center' id="errorMessage">Something went wrong.</h1>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                  Username
                </label>
                <div className="mt-1">
                  <input
                    style={{ backgroundColor: "#161716", borderWidth: "0px" }}
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    className="text-white block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    style={{ backgroundColor: "#161716", borderWidth: "0px" }}
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="text-white block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-center mx-auto">
                  <a href="#" className="text-center font-medium text-blue-600 hover:text-blue-500">
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  onClick={loginUser}
                  className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Sign in
                </button>
              </div>
            </div>

            <div className="mt-6">


              <div className="mt-6  gap-3 ">
                <div>
                  <a
                    style={{ backgroundColor: "#161716", borderWidth: "0px" }}
                    href="#"
                    className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
                    onClick={loginGoogle}
                  >
                    <span className="sr-only">Sign in with Google</span>
                    <svg className='h-6 w-6' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48px" height="48px"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" /><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" /><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" /><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" /></svg>
                    <p className='ml-2'>Login with Google</p>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}