import { Container } from '@/components/Container';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getCookie } from '@/utils/request';
import AuthFooter from '@/components/auth/AuthFooter';
import Link from 'next/link';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';


export function DataAsk({ props }) {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userHasEdited, setUserHasEdited] = useState(false); // New state to track if the user has edited the input
  function logout() {
    signOut(auth)
      .then(() => {
        window.location.replace('/login');
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const auth = getAuth();

  
  useEffect(() => {
    if (router.query.part == '1') {
      if (router.query.error) {
        document.getElementById('error').classList.remove('hidden');
        document.getElementById('error').innerHTML = router.query.error;
      }
    }
  });
  useEffect(() => {
    if (!userHasEdited) return; // Don't validate until the user edits the input
  
    // Your existing validation logic
    if (username.length < 3 || username.length > 20) {
      setValidationMessage('Username must be between 3 and 20 characters long.');
    } else if (/^[0-9]/.test(username)) {
      setValidationMessage('Username must not start with a number.');
    } else if (/^[A-Z]/.test(username)) {
      setValidationMessage('Username must not start with a capital letter.');
    } else if (/^[!@#$%^&*(),.?":{}|<>]/.test(username)) {
      setValidationMessage('Username must not start with a special character.');
    } else if (!/^[a-zA-Z0-9]+$/.test(username)) {
      setValidationMessage('Username can only contain letters and numbers.');
    } else {
      setValidationMessage('');
    }
  }, [username, userHasEdited]);

  function submitData() {
    setIsLoading(true);
    // Generate JSON to send
    var username = document.getElementById('username').value;
    var birthday = document.getElementById('birthday').value;
    var firstname = document.getElementById('firstname').value;
    var lastname = document.getElementById('lastname').value;
    var termsAgreement = document.getElementById('legal').checked;

    const parts = birthday.split('-');
    const newDateStr = `${parts[1]}-${parts[2]}-${parts[0]}`;
    localStorage.setItem('username', document.getElementById('username').value);
    localStorage.setItem('birthday', newDateStr);
    localStorage.setItem(
      'firstname',
      document.getElementById('firstname').value
    );
    localStorage.setItem(
      'lastname',
      document.getElementById('lastname').value
    );

    if (!username || !birthday || !firstname || !lastname || !termsAgreement) {

      toast.error("Fill all fields.");
      setIsLoading(false);

      return;
    } else if (username.length < 3 || username.length > 20) {
      toast.error("Username must be between 3 and 20 letters/numbers!");
      setIsLoading(false);
      return;
    } else if (/^[0-9]/.test(username)) {
      toast.error("Username starts with a number.");
      setIsLoading(false);
    } else if (/^[A-Z]/.test(username)) {
      toast.error("Username starts with a capital letter.");
      setIsLoading(false);
      
    } else if (/^[!@#$%^&*(),.?":{}|<>]/.test(username)) {
        toast.error("Username starts with a special character.");
        setIsLoading(false);
    } else  if (birthday) {
      const minDate = new Date("1900-01-01");
      const currentDate = new Date();
      const maxDate = new Date(currentDate.getFullYear() - 13, currentDate.getMonth(), currentDate.getDate());
      const inputDate = new Date(birthday);
  
      if (isNaN(inputDate.getTime())) {
        toast.error("Invalid date format.");
        setIsLoading(false);
        return;
      }
  
      if (inputDate < minDate) {
        toast.error("Date must be after January 1, 1900");
        setIsLoading(false);
        return;
      }
  
      if (inputDate > maxDate) {
        toast.error("You must be 13 or older.");
        setIsLoading(false);
        return;
      }
  
      // send http request
      var xhr = new XMLHttpRequest();
      xhr.open('POST', `${process.env.NEXT_PUBLIC_API_URL}/users`);
      xhr.setRequestHeader('Content-Type', 'application/json');

      let token = getCookie();
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);

      xhr.withCredentials = true;

      xhr.addEventListener('readystatechange', function () {
        if (this.readyState === 4 && this.readyState === 201) {
          var parsed = JSON.parse(this.responseText);
          if (parsed.username) {
            // Sign out
            // Redirect to login
            window.location.href = '/dashboard';
          }
        }

        if (this.readyState === 4 && this.readyState != 201) {
          var parsed = JSON.parse(this.responseText);

          if (parsed.error === 'undefined' || parsed.error) {


            setIsLoading(false);
            toast.error(parsed.error);

          } else {
            window.location.href = "./dashboard";
            //       window.location.replace('./onboarding?part=1&error=' + parsed.error);
         //   document.getElementById('error').classList.remove('hidden');
         //   document.getElementById('error').innerHTML = parsed.error;
          }
        }
      });

      xhr.send(
        JSON.stringify({
          username: localStorage.getItem('username'),
          birthday: localStorage.getItem('birthday'),
          firstName: localStorage.getItem('firstname'),
          lastName: localStorage.getItem('lastname'),
          location: "????",
        })
      );
      }
    
  } 
  

  return (
    <div style={{
      backgroundPosition: 'center',
      backgroundRepeat: 'repeat',
      width: '100%',
      height: '100%',
  }}>

          <div
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                      className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8"
                      >
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md ">




            <div
                
                className=" pb-10 pt-4 px-4 shadow sm:px-10 border-t-4 border-blue-600 bg-neutral-800"
                >



            <div
          
            >
              <div className="  ">
         

              <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md ">
                <h1 className="text-xl text-white  ">
                  {' '}
                  Finish creating your account
                </h1>
     
                </div>

            

                <div
                  id="error"
                  className="mt-2 mb-2 hidden rounded-lg bg-red-900 px-2 py-1 text-center text-white"
                >
                  Error - Something went wrong.
                </div>
                <div className=" mt-4">
                  <div className="isolate -space-y-px rounded-md sh
                adow-sm">
                    <div
                      style={{ borderColor: '#212121' }}
                      className="relative rounded-md rounded-b-none   py-2 focus-within:z-10 "
                    >

                      <label
                        htmlFor="job-title"
                        className="block text-xs font-medium text-white"
                      >
                        Username
                      </label>

                      <input
      type="text"
      name="name"
      id="username"
      value={username}
      onChange={(e) => {
        setUsername(e.target.value);
        if (!userHasEdited) setUserHasEdited(true); // Set to true on first edit
      }}
      className="bg-neutral-900 mt-2 block w-full rounded border-0 p-0 py-1 px-4 text-white placeholder-gray-500 focus:ring-0 sm:text-sm"
      placeholder="This is what people on CTFGuide will know you as."
    />
    {userHasEdited && validationMessage && (
      <div className="text-red-500 text-sm mt-2">
        {validationMessage}
      </div>
    )}
                    </div>

                    <div
                      style={{ borderColor: '#212121' }}
                      className="relative rounded-md rounded-t-none rounded-b-none  gap-x-4   py-2 focus-within:z-10 "
                    >       <label
                      htmlFor="job-title"
                      className="block text-xs font-medium text-white"
                    >
                        Full Name
                      </label>
                      <div className='flex gap-x-4'>
                        <input
                          type="text"
                          name="name"
                          id="firstname"
                          className="bg-neutral-900 mt-2 block w-full rounded border-0 p-0 py-1 px-4  text-white  placeholder-gray-500 focus:ring-0 sm:text-sm"
                          placeholder="First Name"
                        />

                        <input
                          type="text"
                          name="name"
                          id="lastname"
                          className="bg-neutral-900 mt-2 block w-full rounded border-0 p-0 py-1 px-4 text-white  placeholder-gray-500 focus:ring-0 sm:text-sm"
                          placeholder="Last Name"
                        />
                      </div>
                    </div>

                    <div
                      style={{ borderColor: '#212121' }}
                      className="relative rounded-md rounded-t-none  py-2 focus-within:z-10 "
                    >
                      <label
                        htmlFor="job-title"
                        className="block text-xs font-medium text-white"
                      >
                        Birthday
                      </label>

                      <input
                        id="birthday"
                        type="date"
                        className="bg-neutral-900 mt-2 block w-full rounded--sm border-0 p-0 py-1 px-4 text-white placeholder-gray-500 focus:ring-0 sm:text-sm"
                      ></input>
                    </div>
                  </div>

                  <div className="mx-auto inline-flex text-left mt-4">
                    <input
                      id="legal"
                      type="checkbox"
                      className="mt-1  rounded-lg bg-neutral-900 border-none px-2 py-1"
                    ></input>
                    <p className="ml-2 text-sm text-white">
                      I agree to the <a href="https://ctfguide.com/terms-of-service" target="_blank" rel="noopener noreferrer" className='text-blue-500'>Terms of Service</a> and <a href="https://ctfguide.com/privacy-policy" target="_blank" rel="noopener noreferrer" className='text-blue-500'>Privacy Policy</a>

                    </p>
                  </div>

                  <div className="mx-auto mx-auto text-center mt-4">
                    <button
                      onClick={() => {
                        submitData();
                      }}
                      className="flex w-full justify-center rounded-sm border border-transparent bg-blue-700 hover:bg-blue-700/90 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                      {
                        isLoading ? (
                          <i className="fas fa-spinner text-lg fa-spin"></i>
                        ) : (
                          <span>Start Hacking</span>
                        )
                      }
                    </button>

                    <p className='text-sm text-neutral-500 hover:text-white hover:cursor-pointer mt-4' onClick={logout}><i className="fas fa-sign-out-alt"></i> Logout</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

                <AuthFooter />
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
    </div>
  );
}
