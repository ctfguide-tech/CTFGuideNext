import Head from 'next/head';
import { Footer } from '@/components/Footer';
import { StandardNav } from '@/components/StandardNav';
import Sidebar from '@/components/settingComponents/sidebar';
import { useState } from 'react';
import {
  updatePassword,
  getAuth,
  reauthenticateWithCredential,
  EmailAuthProvider,
  confirmPasswordReset,
} from 'firebase/auth';

const STRIPE_KEY = process.env.NEXT_PUBLIC_APP_STRIPE_KEY;


export default function Security(){
  const [inputText, setInputText] = useState('');

  const auth = getAuth();
  const user = auth.currentUser;

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  function saveSecurity() {
      document.getElementById('saveSecurity').innerText = 'Saving...';
      var oldPassword = document.getElementById('oldPassword').value;
  
      reauthenticateWithCredential(
        user,
        EmailAuthProvider.credential(user.email, oldPassword)
      )
        .then(() => {
          var password = document.getElementById('password').value;
          var confirmPassword = document.getElementById('confirm-password').value;
  
          if (password == confirmPassword) {
            updatePassword(user, confirmPassword)
              .then(() => {
                document.getElementById('saveSecurity').innerText = 'Save';
  
                document.getElementById('password').value = '';
                document.getElementById('confirm-password').value = '';
              })
              .catch((error) => {
                document.getElementById('saveSecurity').innerText = 'Save';
                window.alert(error);
              });
          }
        })
        .catch((error) => {
          document.getElementById('saveSecurity').innerText = 'Save';
          window.alert(error);
        });
    }

    return(
        <>
        <Head>
          <title>User Settings</title>
          <meta
            name="description"
            content="Cybersecurity made easy for everyone"
          />
          <style>
            @import
            url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
          </style>
        </Head>
  
        <StandardNav />
  
        <div className="mx-auto flex max-w-6xl">
            <Sidebar/>
            
            <div className="flex-1 xl:overflow-y-auto">
              <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
                <h1 className="text-3xl font-bold tracking-tight text-white">
                  Security
                </h1>

                <div className="mt-6 space-y-8 ">
                  <div className="flex grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
                    <div className="sm:col-span-6">
                      <h2 className="text-xl font-medium text-white">
                        Password Management
                      </h2>
                      <p className="mt-1 text-sm text-white">
                        Change your password
                      </p>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor=""
                        className="block text-sm font-medium leading-6 text-white"
                      >
                        New Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        autoComplete="given-name"
                        className="mt-2 block w-full rounded-md border-none bg-neutral-800  py-1.5 text-white shadow-sm  sm:text-sm sm:leading-6"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="last-name"
                        className="block text-sm font-medium leading-6 text-white"
                      >
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        name="confirm-password"
                        id="confirm-password"
                        autoComplete="family-name"
                        className="mt-2 block w-full rounded-md border-none bg-neutral-800  py-1.5 text-white shadow-sm  sm:text-sm sm:leading-6"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor=""
                        className="block text-sm font-medium leading-6 text-white"
                      >
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        id="oldPassword"
                        autoComplete="given-name"
                        className="mt-2 block w-full rounded-md border-none bg-neutral-800  py-1.5 text-white shadow-sm  sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <button
                    id="saveSecurity"
                    onClick={saveSecurity}
                    className="inline-flex justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
        </div>
  
        <Footer />
      </>
    );
}