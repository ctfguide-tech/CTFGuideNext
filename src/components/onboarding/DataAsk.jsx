import { Container } from '@/components/Container';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getCookie } from '@/utils/request';

export function DataAsk({ props }) {
  const router = useRouter();

  useEffect(() => {
    if (router.query.part == '1') {
      if (router.query.error) {
        document.getElementById('error').classList.remove('hidden');
        document.getElementById('error').innerHTML = router.query.error;
      }
    }
  });

  function submitData() {
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
      document.getElementById('error').classList.remove('hidden');
      document.getElementById('error').innerHTML = "Fill all fields.";
      return;
    } else if (username.length < 3 || username.length > 20) {
      document.getElementById('error').classList.remove('hidden');
      document.getElementById('error').innerHTML = "Username must be between 3 and 20 letters/numbers!";
      return;
    } else if (/^[0-9]/.test(username)) {

      document.getElementById('error').classList.remove('hidden');
      document.getElementById('error').innerHTML = "Username starts with a number.";
    } else if (/^[A-Z]/.test(username)) {
      document.getElementById('error').classList.remove('hidden');
      document.getElementById('error').innerHTML = "Username starts with a capital letter.";
   
      
    } else if (/^[!@#$%^&*(),.?":{}|<>]/.test(username)) {
      document.getElementById('error').classList.remove('hidden');
      document.getElementById('error').innerHTML = "Username starts with a special character.";
   
    
    } else  if (birthday) {
      const minDate = new Date("1900-01-01");
      const currentDate = new Date();
      const maxDate = new Date(currentDate.getFullYear() - 13, currentDate.getMonth(), currentDate.getDate());
      const inputDate = new Date(birthday);
  
      if (isNaN(inputDate.getTime())) {
        document.getElementById('error').classList.remove('hidden');
        document.getElementById('error').innerHTML = "Invalid date format.";
        return;
      }
  
      if (inputDate < minDate) {
        document.getElementById('error').classList.remove('hidden');
        document.getElementById('error').innerHTML = "Date must be after January 1, 1900";
        return;
      }
  
      if (inputDate > maxDate) {
        document.getElementById('error').classList.remove('hidden');
        document.getElementById('error').innerHTML = "You must be 13 or older.";
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

            document.getElementById('error').classList.remove('hidden');
            document.getElementById('error').innerHTML = parsed.error;

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
    <div className="h-screen my-auto">


      <div className='mt-60 mx-auto my-auto items-center justify-center grid grid-cols-2 max-w-6xl mx-auto mt-20'>

        <div className="   my-auto">




          <div style={{ backgroundColor: '#161716' }} className=" ">



            <div
              style={{ backgroundColor: '#161716' }}
              className=" "
            >
              <div className="  px-4 ">
                <h1 className="text-xl text-white ">
                  {' '}
                  Finish creating your account
                </h1>

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
                      className="relative rounded-md rounded-b-none border  px-3 py-2 focus-within:z-10 focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
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
                        style={{ backgroundColor: '#212121' }}
                        className="mt-2 block w-full rounded border-0 p-0 py-1 px-4 text-white  placeholder-gray-500 focus:ring-0 sm:text-sm"
                        placeholder="This is what people on CTFGuide will know you as."
                      />
                    </div>

                    <div
                      style={{ borderColor: '#212121' }}
                      className="relative rounded-md rounded-t-none rounded-b-none border gap-x-4  px-3 py-2 focus-within:z-10 focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
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
                          style={{ backgroundColor: '#212121' }}
                          className="mt-2 block w-full rounded border-0 p-0 py-1 px-4 text-white  placeholder-gray-500 focus:ring-0 sm:text-sm"
                          placeholder="First Name"
                        />

                        <input
                          type="text"
                          name="name"
                          id="lastname"
                          style={{ backgroundColor: '#212121' }}
                          className="mt-2 block w-full rounded border-0 p-0 py-1 px-4 text-white  placeholder-gray-500 focus:ring-0 sm:text-sm"
                          placeholder="Last Name"
                        />
                      </div>
                    </div>

                    <div
                      style={{ borderColor: '#212121' }}
                      className="relative rounded-md rounded-t-none border px-3 py-2 focus-within:z-10 focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
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
                        style={{ backgroundColor: '#212121' }}
                        className="mt-2 block w-full rounded border-0 p-0 py-1 px-4 text-white placeholder-gray-500 focus:ring-0 sm:text-sm"
                      ></input>
                    </div>
                  </div>

                  <div className="mx-auto inline-flex text-center mt-4">
                    <input
                      id="legal"
                      style={{ backgroundColor: '#212121' }}
                      type="checkbox"
                      className="mt-1  rounded-lg border border-gray-700 px-2 py-1"
                    ></input>
                    <p className="ml-2 text-white">
                      I agree to the <a href="https://ctfguide.com/terms-of-service" className='text-blue-500'>Terms of Service</a> and <a href="https://ctfguide.com/privacy-policy" className='text-blue-500'>Privacy Policy</a>
                    </p>
                  </div>

                  <div className="mx-auto mx-auto text-center">
                    <button
                      onClick={() => {
                        submitData();
                      }}
                      className="button mx-auto mt-8 w-2/3 rounded bg-blue-800 py-2 text-white hover:bg-blue-900"
                    >
                      Start Hacking
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='mx-auto my-auto text-white px-10'>


          <h1> We learned 55% of new signups weren't finishing our onboarding process, so we tried cutting it down to just 4 input boxes. </h1>

          <h1 className='mt-4'>We need a username (to know who you are) and date of birth (COPPA laws).  </h1>

          <h1 className='mt-4 bg-neutral-800 px-4 py-2'>"I was able to get a Ferrari because I finished creating my CTFGuide account."<br />- Scratch (Employee #2)</h1>
        </div>

      </div>
    </div>
  );
}
