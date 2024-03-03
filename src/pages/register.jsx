import Head from 'next/head';
import Link from 'next/link';
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { app } from '../config/firebaseConfig';

const provider = new GoogleAuthProvider();

export default function Register() {
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

        document.getElementById('error').classList.remove('hidden');
        document.getElementById('errorMessage').innerHTML = errorMessage;
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
          window.alert(errorMessage);
          document.getElementById('errorMessage').innerHTML = errorMessage;
          document.getElementById('error').classList.remove('hidden');
        });
    } else {
      document.getElementById('errorMessage').innerHTML = 'Passwords do not match';
      document.getElementById('error').classList.remove('hidden');
    }
  }
  return (
    <>
      <Head>
        <title>Sign Up - CTFGuide</title>
      </Head>

      <div
        style={{ fontFamily: 'Poppins, sans-serif', height: '100vh' }}
        className="animate__animated animate__fadeIn flex min-h-full"
      >
        <div className="flex flex-1 flex-col justify-center  px-4 sm:px-6  lg:flex-none lg:px-20 xl:px-24">
          <div className=" mx-auto w-full max-w-sm lg:w-96">
            <div>
              <Link href="../" className="my-auto flex">
                <img
                  className="zimg h-10 w-10"
                  src="../darkLogo.png"
                  alt="CTFGuide"
                />
                <h1 className="my-auto text-xl text-white">CTFGuide</h1>
              </Link>
              <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">
                Register
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Or{' '}
                <a
                  href="./login"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  login to your account
                </a>
              </p>
            </div>

            <div className="mt-8">
              <div>
                <div>
                  <div className="mt-2 grid grid-cols-1 gap-3 ">
                    <div>
                      <button
                        className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50 focus:ring-2"
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
                        <p className="ml-2">Sign up with Google</p>
                      </button>
                    </div>
                  </div>
                </div>

                <div className=" relative mt-6">
                  <div className="relative flex justify-center text-sm">
                    <span className=" px-2 text-gray-200">
                      Or use your email
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="space-y-6">
                <div
                    id="error"
                    className="text-white hidden rounded bg-red-500 px-4 py-1"
                    >
                    <h1 className="text-center text-white" id="errorMessage">
                        Something went wrong.
                    </h1>
                    </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-white"
                    >
                      Email address
                    </label>
                    <div className="mt-1">
                      <input
                        style={{
                          backgroundColor: '#212121',
                          borderStyle: 'none',
                        }}
                        id="email-address"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="block w-full appearance-none rounded-md px-3  py-2 text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-white"
                    >
                      Password
                    </label>
                    <div className="mt-1">
                      <input
                        style={{
                          backgroundColor: '#212121',
                          borderStyle: 'none',
                        }}
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="block w-full appearance-none rounded-md px-3  py-2 text-white  shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-white"
                    >
                      Confirm Password
                    </label>
                    <div className="mt-1">
                      <input
                        style={{
                          backgroundColor: '#212121',
                          borderStyle: 'none',
                        }}
                        id="cpassword"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="block w-full appearance-none rounded-md px-3  py-2 text-white  shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        style={{
                          backgroundColor: '#212121',
                          borderStyle: 'none',
                        }}
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        htmlFor="remember-me"
                        className="ml-2 block text-sm text-white"
                      >
                        Remember me
                      </label>
                    </div>

                    <div className="text-sm">
                      <a
                        href="#"
                        className="font-medium text-blue-600 hover:text-blue-500"
                      >
                        Forgot your password?
                      </a>
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      onClick={registerUser}
                      id="registerBtn"
                      className="hover:shadow-blue-500/00 flex w-full justify-center rounded-md border border-transparent bg-blue-700 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Create an account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative hidden w-0 flex-1  md:visible lg:visible lg:block">
          <img
            className="absolute inset-0 h-full w-full object-cover "
            src="https://images.unsplash.com/photo-1633259584604-afdc243122ea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
            alt=""
          />
        </div>
      </div>
    </>
  );
}
