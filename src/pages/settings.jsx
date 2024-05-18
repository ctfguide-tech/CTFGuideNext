import Head from 'next/head';
import { Footer } from '@/components/Footer';
import { StandardNav } from '@/components/StandardNav';
import { useEffect } from 'react';
import { useState } from 'react';
import { getCookie } from '@/utils/request';
import General from '@/components/settingComponents/generalPage';
import Security from '@/components/settingComponents/securityPage';
import {
  updatePassword,
  getAuth,
  reauthenticateWithCredential,
  EmailAuthProvider,
  confirmPasswordReset,
} from 'firebase/auth';
import { useRouter } from 'next/router';
import { loadStripe } from '@stripe/stripe-js';
import Link from 'next/link';

const STRIPE_KEY = process.env.NEXT_PUBLIC_APP_STRIPE_KEY;

export default function Dashboard() {
  const router = useRouter();

  const [inputText, setInputText] = useState('');

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const [open, setOpen] = useState(true);
  const [general, setGeneral] = useState(false);
  const [security, setSecurity] = useState(false);
  const [preferences, setPreferences] = useState(false);
  const [billing, setbilling] = useState(false);
  const [username, setUsername] = useState('');


  const [selectedImage, setSelectedImage] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [pfp, setPfp] = useState(`https://robohash.org/KshitijIsCool.png?set=set1&size=150x150`);



  var pfpString = '';
  var pfpChanged = false;

  const auth = getAuth();
  const user = auth.currentUser;

  const handlePopupOpen = () => {
    setIsPopupOpen(true);
  }



  const handleClick = () => {}
  useEffect(() => {
    const fileInput = document.getElementById('fileInput');

    // set username
    var xhr = new XMLHttpRequest();

    xhr.addEventListener('readystatechange', function() {
      if (this.readyState === 4) {
        console.log(this.responseText);
        try {
          if (document.getElementById('first-name')) {

            setUsername(JSON.parse(this.responseText).username);
          }

        } catch (e) {
          console.log(e);
        }
      }
    });

    xhr.open('GET', `${process.env.NEXT_PUBLIC_API_URL}/account`);
    let token = getCookie();
    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
    xhr.withCredentials = true;
    xhr.send();
  }, []);

  function pfpChange() {
    pfpChanged = true;
  }
  useEffect(() => {
    console.log(router.query.loc);
    if (router.query.loc == 'general' || router.query.loc == undefined) {
      setGeneral(true);
      loadGeneral();
    } else {
      setGeneral(false);
    }

    if (router.query.loc == 'security') {
      setSecurity(true);
    } else {
      setSecurity(false);
    }

    if (router.query.loc == 'billing') {
      setbilling(true);
    } else {
      setbilling(false);
    }

    if (router.query.loc == 'preferences') {
      loadPreferences();
      setPreferences(true);
    } else {
      setPreferences(false);
    }
  }, [router.query]);

  function loadGeneral() {
    if (router.query.loc == 'general' || router.query.loc == undefined) {
      var xhr = new XMLHttpRequest();

      xhr.addEventListener('readystatechange', function() {
        if (this.readyState === 4) {
          console.log(this.responseText);
          try {
            if (document.getElementById('first-name')) {
              document.getElementById('first-name').value = JSON.parse(
                this.responseText
              ).firstName;
              document.getElementById('last-name').value = JSON.parse(
                this.responseText
              ).lastName;
              document.getElementById('bio').value = JSON.parse(
                this.responseText
              ).bio;
              document.getElementById('url').value = JSON.parse(
                this.responseText
              ).githubUrl;
              document.getElementById('location').value = JSON.parse(
                this.responseText
              ).location;
              document.getElementById('username').value = JSON.parse(
                this.responseText
              ).username;
              document.getElementById('email').value = JSON.parse(
                this.responseText
              ).email;
            }

            if (pfpString == '') {
            } else {
              //  document.getElementById('pfp').src = pfpString;
            }



          } catch (e) {
            console.log(e);
          }
        }
      });

      xhr.open('GET', `${process.env.NEXT_PUBLIC_API_URL}/account`);
      let token = getCookie();
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      xhr.withCredentials = true;
      xhr.send();

    }
  }

  const redirectToCheckout = async (event) => {
    try {
      const stripe = await loadStripe(STRIPE_KEY);
      const subscriptionType = document.getElementById('paymentType').value;
      console.log(subscriptionType);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payments/stripe/create-checkout-session`,
        {
          method: 'POST',
          body: JSON.stringify({
            subType: subscriptionType,
            quantity: 1,
            operation: 'subscription',
            data: {},
          }),
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        }
      );

      const session = await response.json();
      if (session.error) {
        console.log('Creating the stripe session failed');
        return;
      }

      const result = await stripe.redirectToCheckout({
        sessionId: session.sessionId,
      });

      if (result.error) {
        console.log(result.error.message);
      }
    } catch (error) {
      console.log(error);
    }g
  };

  const updateCardInfo = async () => {
    try {
      const stripe = await loadStripe(STRIPE_KEY);
      const subscriptionType = document.getElementById('paymentType').value;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payments/stripe/update-card`,
        {
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify({
            subType: subscriptionType,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const session = await response.json();

      await stripe.redirectToCheckout({
        sessionId: session.sessionId,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const cancelSubscription = async () => {
    try {
      const subscriptionType = document.getElementById('paymentType').value;
      const url = `${process.env.NEXT_PUBLIC_API_URL}/payments/stripe/cancel`;
      const response = await fetch(url, {
        method: 'PUT',
        credentials: 'include',
        body: JSON.stringify({
          subType: subscriptionType,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log(data.message);
    } catch (err) {
      console.log(err);
    }
  };

 
  function savePreferences() {
    document.getElementById('savePreferences').innerHTML = 'Saving...';

    var data = JSON.stringify({
      FRIEND_ACCEPT: document.getElementById('friend-notif').checked,
      CHALLENGE_VERIFY: document.getElementById('challenge-notif').checked,
    });

    var xhr = new XMLHttpRequest();

    xhr.addEventListener('readystatechange', function() {
      if (this.readyState === 4) {
        document.getElementById('savePreferences').innerHTML = 'Save';
      }
    });

    xhr.open('PUT', `${process.env.NEXT_PUBLIC_API_URL}/account/preferences`);

    xhr.setRequestHeader('Content-Type', 'application/json');
    let token = getCookie();
    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
    xhr.withCredentials = true;

    xhr.send(data);
  }

  function loadPreferences() {
    // WARNING: For GET requests, body is set to null by browsers.

    var xhr = new XMLHttpRequest();

    xhr.addEventListener('readystatechange', function() {
      if (this.readyState === 4) {
        console.log(this.responseText);
        console.log('PREFFF');
        try {
          if (JSON.parse(this.responseText)[0].value == true) {
            document.getElementById('friend-notif').checked = true;
          }

          if (JSON.parse(this.responseText)[1].value == true) {
            document.getElementById('challenge-notif').checked = true;
          }
        } catch (error) {
          // .alert(error)
        }
      }
    });

    xhr.open('GET', `${process.env.NEXT_PUBLIC_API_URL}/account/preferences`);
    let token = getCookie();
    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
    xhr.withCredentials = true;
    xhr.send();
  }



  return (        
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


      {general && (              
        <div id="general" className="">
          <div className="mx-auto flex max-w-6xl">

            {/*DIV CONTAINING LINKS FOR THE SIDE BAR, THIS SHOWS UP IN ALL PAGES*/}
            <div
              className="  mt-10 flex-none border-r pl-10 pr-10 text-gray-900"
              style={{ borderColor: '#212121' }}
            >
              <ul className="mr-2 py-2">
                <li className="py-1">
                  <Link
                    href="../settings"
                    className="px-2 py-2 text-lg  font-medium text-white"
                    
                  >
                    {' '}
                    General
                  </Link>
                </li>
                <li className="py-1 ">
                  <Link
                    href="../settings?loc=security"
                    className="px-2 py-1  text-lg font-medium text-white hover:text-gray-400"
                  >
                    Security
                  </Link>
                </li>
                <li className="py-1 ">
                  <Link
                    href="../settings?loc=preferences"
                    className="px-2 py-1  text-lg font-medium text-white hover:text-gray-400"
                  >
                    Email Preferences
                  </Link>
                </li>
                <li className="py-1 ">
                  <Link
                    href="../settings?loc=billing"
                    className="px-2 py-1  text-lg font-medium text-white hover:text-gray-400"
                  >
                    Billing
                  </Link>
                </li>
              </ul>
            </div>

            {/*DIV CONTAINING THE BODY OF GENERAL SECTION*/}
            <General/>
          </div>
        </div>
      )}

      {billing && (
        <div id="general" className="">
          <div className="mx-auto flex max-w-6xl">

            {/*DIV CONTAINING LINKS FOR THE SIDE BAR, */}
            <div
              className="  mt-10 flex-none border-r pl-10 pr-10 text-gray-900"
              style={{ borderColor: '#212121' }}
            >
              <ul className="mr-2 py-2">
                <li className="py-1">
                  <Link
                    href="../settings"
                    className="px-2 py-2 text-lg  font-medium text-white"
                  >
                    {' '}
                    General
                  </Link>
                </li>
                <li className="py-1 ">
                  <Link
                    href="../settings?loc=security"
                    className="px-2 py-1  text-lg font-medium text-white hover:text-gray-400"
                  >
                    Security
                  </Link>
                </li>
                <li className="py-1 ">
                  <Link
                    href="../settings?loc=preferences"
                    className="px-2 py-1  text-lg font-medium text-white hover:text-gray-400"
                  >
                    Email Preferences
                  </Link>
                </li>
                <li className="py-1 ">
                  <Link
                    href="../settings?loc=billing"
                    className="px-2 py-1  text-lg font-medium text-white hover:text-gray-400"
                  >
                    Billing
                  </Link>
                </li>
              </ul>
            </div>

            {/*DIV CONTAINING BODY OF THE BILLING SECTION*/}
            <div className="flex-1 xl:overflow-y-auto">
              <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
                <h1 className="mb-3 text-3xl font-bold tracking-tight text-white">
                  Billing
                </h1>

                <div className="w-2/3 rounded-sm bg-neutral-800 px-4  py-4 pb-12">
                  <div className="flex">
                    <div>
                      <h1 className="text-white">FREE</h1>
                      <h1 className="text-xl text-white">Standard Account</h1>
                    </div>
                    <div className="ml-auto">
                      <button className="mt-2 hidden border border-blue-600 px-2 py-1 text-blue-600 hover:bg-neutral-700">
                        CHANGE PLAN
                      </button>
                    </div>
                  </div>
                  <h1 className="mt-4 font-semibold text-white">
                    Usage Limits
                  </h1>

                  <div className="mb-1 flex justify-between">
                    <span className="text-base font-medium text-white">
                      Terminal Usage
                    </span>
                    <span className="text-sm font-medium   text-white">
                      0%{' '}
                    </span>
                  </div>
                  <div className="h-2.5  w-full rounded-full bg-neutral-700">
                    <div
                      className="h-2.5 rounded-full bg-blue-600"
                      style={{ width: '0%' }}
                    ></div>
                  </div>

                  <div className="mb-1 mt-4 flex justify-between">
                    <span className="text-base font-medium text-white">
                      CPU Burst Usage
                    </span>
                    <span className="text-sm font-medium   text-white">0%</span>
                  </div>
                  <div className="h-2.5  w-full rounded-full bg-neutral-700">
                    <div
                      className="h-2.5 rounded-full bg-blue-600"
                      style={{ width: '0%' }}
                    ></div>
                  </div>

                  <h1 className="mt-4 text-white ">
                    Container Hardware: Standard Compute
                  </h1>
                </div>

                <p className="mt-5 text-white">
                  CTFGuide currently has a very generous grant from Google Cloud
                  Platform, which allows us to provide free compute to our
                  users. However, this grant is limited, and we may have to
                  start charging for compute in the future. If we do, we will
                  give you a 30 day notice before we start charging for compute.
                </p>

                <div className="hidden items-center justify-between text-white">
                  <hr className="mb-2 mt-2 border-neutral-600 text-white" />
                  <h1 className="mt-4 text-center text-4xl">
                    Upgrade to{' '}
                    <span className="font-bold text-blue-500">
                      CTFGuide Pro
                    </span>
                  </h1>
                  <div className="grid grid-cols-2 gap-4">
                    <div
                      className="hover mt-4 rounded border border-neutral-700 px-4 py-4 text-white"
                      style={{ cursor: 'pointer' }}
                    >
                      <h1 className="text-center text-3xl">Monthly</h1>
                      <h1 className="text-center text-xl">$4.99/month</h1>
                    </div>
                    <div
                      className="hover mt-4 rounded border border-neutral-700 px-4 py-4 text-white"
                      style={{ cursor: 'pointer' }}
                    >
                      <h1 className="text-center text-3xl">Annually</h1>
                      <h1 className="text-center text-xl">$35.88/year</h1>
                    </div>
                  </div>
                  <h1 className="mb-1 mt-4 text-center text-xl">
                    What do you get?
                  </h1>
                  <div className="px-2 py-1 text-center">
                    <p>Access to exclusive learning content.</p>
                  </div>
                  <div className="mt-1 px-2 py-1 text-center">
                    <p>Show of an exclusive CTFGuide Pro badge</p>
                  </div>
                  <div className="mt-1 px-2 py-1 text-center">
                    <p>Animated profile pictures**</p>
                  </div>
                  <div className="mt-1 px-2 py-1 text-center">
                    <p>Increased container time</p>
                  </div>
                  <div className="mt-1 px-2 py-1 text-center">
                    <p>AI Tutor**</p>
                  </div>
                  <p className="mt-4 text-sm text-gray-500">
                    * For the features marked with a star, it means it has not
                    been released yet. For every month you have CTFGuide Pro, if
                    the feature has not been implemented yet, you'll be given an
                    additional free month of Pro.
                  </p>
                </div>

                <div className="hidden">
                  <hr className="mt-4 border-neutral-500"></hr>
                  <h1 className="mt-4 text-white"> Dev Testing</h1>

                  <select
                    id="paymentType"
                    className="mt-4 border-none bg-neutral-800 py-1 text-white"
                  >
                    <option value="CTFGuidePro">CTFGuidePro</option>
                    <option value="CTFGuideStudentEDU">
                      CTFGuideStudentsEDU
                    </option>
                    <option value="CTFGuideInstitutionEDU">
                      CTFGuideInstitutionEDU
                    </option>
                  </select>

                  <br></br>
                  <button
                    onClick={redirectToCheckout}
                    className="text-md mt-4 rounded-lg bg-blue-600 px-2 py-1 text-white"
                  >
                    Stripe Checkout Demo
                  </button>
                  <br></br>

                  <button
                    onClick={updateCardInfo}
                    className="text-md mt-4 rounded-lg bg-blue-600 px-2 py-1 text-white"
                  >
                    Update card infomation
                  </button>
                  <button
                    onClick={cancelSubscription}
                    className="text-md mt-4 rounded-lg bg-blue-600 px-2 py-1 text-white"
                  >
                    cancel subscription
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {security && (
        <div id="security" className="">
          <div className="mx-auto flex max-w-6xl">


            {/*DIV CONTAINING LINKS FOR THE SIDE BAR*/}
            <div
              className="  mt-10 flex-none border-r pl-10 pr-10 text-gray-900"
              style={{ borderColor: '#212121' }}
            >
              <ul className="mr-2 py-2">
                <li className="py-1">
                  <Link
                    href="../settings"
                    className="px-2 py-2 text-lg  font-medium text-white"
                  >
                    {' '}
                    General
                  </Link>
                </li>
                <li className="py-1 ">
                  <Link
                    href="../settings?loc=security"
                    className="px-2 py-1  text-lg font-medium text-white hover:text-gray-400"
                  >
                    Security
                  </Link>
                </li>
                <li className="py-1 ">
                  <Link
                    href="../settings?loc=preferences"
                    className="px-2 py-1  text-lg font-medium text-white hover:text-gray-400"
                  >
                    Email Preferences
                  </Link>
                </li>
                <li className="py-1 ">
                  <Link
                    href="../settings?loc=billing"
                    className="px-2 py-1  text-lg font-medium text-white hover:text-gray-400"
                  >
                    Billing
                  </Link>
                </li>
              </ul>
            </div>

            {/*DIV CONTAINING BODY OF THE SECURITY SECTION*/}
            <Security/>
          </div>
        </div>
      )}


      {preferences && (
        <div id="preferences" className="">
          <div className="mx-auto flex max-w-6xl">

            {/*DIV CONTAINING LINKS FOR THE SIDE BAR*/}
            <div
              className="  mt-10 flex-none list-none border-r pl-10 pr-10 text-white"
              style={{ borderColor: '#212121' }}
            >
              <ul className="mr-2 list-none py-2">
                <li className="py-1">
                  <Link
                    href="../settings"
                    className="px-2 py-2 text-lg  font-medium text-white"
                  >
                    {' '}
                    General
                  </Link>
                </li>
                <li className="py-1 ">
                  <Link
                    href="../settings?loc=security"
                    className="px-2 py-1  text-lg font-medium text-white hover:text-gray-400"
                  >
                    Security
                  </Link>
                </li>
                <li className="py-1 ">
                  <Link
                    href="../settings?loc=preferences"
                    className="px-2 py-1  text-lg font-medium text-white hover:text-gray-400"
                  >
                    Email Preferences
                  </Link>
                </li>
                <li className="py-1 ">
                  <Link
                    href="../settings?loc=billing"
                    className="px-2 py-1  text-lg font-medium text-white hover:text-gray-400"
                  >
                    Billing
                  </Link>
                </li>
              </ul>
            </div>

            {/*DIV CONTAINING BODY OF THE PREFERENCES SECTION*/}
            <div className="flex-1 xl:overflow-y-auto">
              <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
                <h1 className="text-3xl font-bold tracking-tight text-white">
                  Email Preferences
                </h1>

                <div className="mt-6 space-y-8 ">
                  <fieldset>
                    <legend className="sr-only">Notifications</legend>
                    <div className="space-y-5">
                      <div className="relative flex items-start">
                        <div className="flex h-6 items-center">
                          <input
                            id="friend-notif"
                            aria-describedby="comments-description"
                            name="comments"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                          />
                        </div>
                        <div className="ml-3 text-sm leading-6">
                          <label
                            htmlFor="comments"
                            className="font-medium text-white"
                          >
                            Friend Requests
                          </label>
                          <p
                            id="comments-description"
                            className="text-neutral-400"
                          >
                            Get notified when someones accepts or sends you a
                            friend request.
                          </p>
                        </div>
                      </div>
                      <div className="relative flex items-start">
                        <div className="flex h-6 items-center">
                          <input
                            id="challenge-notif"
                            aria-describedby="candidates-description"
                            name="candidates"
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                          />
                        </div>
                        <div className="ml-3 text-sm leading-6">
                          <label
                            htmlFor="candidates"
                            className="font-medium text-white"
                          >
                            Creator Notifications
                          </label>
                          <p
                            id="candidates-description"
                            className="text-neutral-400"
                          >
                            Get notified when your challenges get verified.
                          </p>
                        </div>
                      </div>
                    </div>
                  </fieldset>

                  <div className="flex justify-end gap-x-3 pt-8">
                    <button
                      id="savePreferences"
                      onClick={savePreferences}
                      className="inline-flex justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
