import Head from 'next/head';
import { Footer } from '@/components/Footer';
import { StandardNav } from '@/components/StandardNav';
import { useEffect } from 'react';
import { useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getCookie } from '@/utils/request';
import { Transition, Dialog } from '@headlessui/react';
import { Fragment } from 'react';
import request from "@/utils/request";

import {
  updatePassword,
  getAuth,
  reauthenticateWithCredential,
  EmailAuthProvider,
  confirmPasswordReset,
} from 'firebase/auth';
import { useRouter } from 'next/router';
import { loadStripe } from '@stripe/stripe-js';

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


const handlePopupClose = () => {
    setIsPopupOpen(false);
}
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
}


const handleSaveChanges = async () => {
    if (!selectedImage) {
        console.log("No image selected");
        setIsPopupOpen(false)
        return;
    }


    // upload to firebase storage
    try {
        const storage = getStorage();
        const metadata = {
            contentType: 'image/jpeg',
        };


        const storageRef = ref(storage, `${email}/pictures/pfp`);
        const uploadTask = uploadBytesResumable(storageRef, selectedImage, metadata)


        uploadTask.on('state_changed',
            (snapshot) => {
                // progress function
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                switch (error.code) {
                    case 'storage/unauthorized':
                        console.log('User does not have permission to access the object');
                        break;
                    case 'storage/canceled':
                        console.log('User canceled the upload');
                        break;
                    case 'storage/unknown':
                        console.log('Unknown error occurred, inspect error.serverResponse');
                        break;
                }
            },
            async () => {
                const imageUrl = await getDownloadURL(uploadTask.snapshot.ref)
                console.log(imageUrl)
                console.log(user);
                const endPoint = process.env.NEXT_PUBLIC_API_URL + '/users/' + username + '/updatePfp';
                const body = { imageUrl }
                const response = await request(endPoint, "POST", body);
                console.log("Here is the result: ", response)
                if (response.success) {
                    console.log("profile picture uploaded successfully");
                } else {
                    console.log("Failed to upload profile picture");
                }
                window.location.reload();

            }
        );
        setIsPopupOpen(false);


    } catch (err) {
        console.log(err);
        console.log("An error occured while uploading profile picture");
    }
}

const handleClick = () => {

}


  useEffect(() => {
    const fileInput = document.getElementById('fileInput');

    // set username
    var xhr = new XMLHttpRequest();

    xhr.addEventListener('readystatechange', function () {
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

      xhr.addEventListener('readystatechange', function () {
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
    }
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

  function saveGeneral() {
    document.getElementById('save').innerHTML = 'Saving...';

      var firstName = document.getElementById('first-name').value;
      var lastName = document.getElementById('last-name').value;
      var bio = document.getElementById('bio').value;
      var github = document.getElementById('url').value;
      var location = document.getElementById('location').value;

      var data = JSON.stringify({
        bio: bio,
        githubUrl: github,
        firstName: firstName,
        lastName: lastName,
        location: location,
      });

      var xhr = new XMLHttpRequest();

      xhr.addEventListener('readystatechange', function () {
        if (this.readyState === 4) {
          console.log(this.responseText);
          document.getElementById('save').innerHTML = 'Save';
        }
      });

      xhr.open('PUT', `${process.env.NEXT_PUBLIC_API_URL}/account`);
      xhr.setRequestHeader('Content-Type', 'application/json');
      let token = getCookie();
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      xhr.withCredentials = true;
      xhr.send(data);
    
  }

  function savePreferences() {
    document.getElementById('savePreferences').innerHTML = 'Saving...';

    var data = JSON.stringify({
      FRIEND_ACCEPT: document.getElementById('friend-notif').checked,
      CHALLENGE_VERIFY: document.getElementById('challenge-notif').checked,
    });

    var xhr = new XMLHttpRequest();

    xhr.addEventListener('readystatechange', function () {
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

    xhr.addEventListener('readystatechange', function () {
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
            <div
              className="  mt-10 flex-none border-r pl-10 pr-10 text-gray-900"
              style={{ borderColor: '#212121' }}
            >
              <ul className="mr-2 py-2">
                <li className="py-1">
                  <a
                    href="../settings"
                    className="px-2 py-2 text-lg  font-medium text-white"
                  >
                    {' '}
                    General
                  </a>
                </li>
                <li className="py-1 ">
                  <a
                    href="../settings?loc=security"
                    className="px-2 py-1  text-lg font-medium text-white hover:text-gray-400"
                  >
                    Security
                  </a>
                </li>
                <li className="py-1 ">
                  <a
                    href="../settings?loc=preferences"
                    className="px-2 py-1  text-lg font-medium text-white hover:text-gray-400"
                  >
                    Email Preferences
                  </a>
                </li>
                <li className="py-1 ">
                  <a
                    href="../settings?loc=billing"
                    className="px-2 py-1  text-lg font-medium text-white hover:text-gray-400"
                  >
                    Billing
                  </a>
                </li>
              </ul>
            </div>

            <div className="flex-1 xl:overflow-y-auto">
              <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
                <h1 className="text-3xl font-bold tracking-tight text-white">
                  General
                </h1>

                <div className="mt-6 space-y-8 ">
                  <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
                    <div className="sm:col-span-6">
                      <h2 className="text-xl font-medium text-white">
                        Profile
                      </h2>
                      <p className="mt-1 text-sm text-white">
                        This information will be displayed publicly so be
                        careful what you share.
                      </p>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="first-name"
                        className="block text-sm font-medium leading-6 text-white"
                      >
                        First name
                      </label>
                      <input
                        type="text"
                        name="first-name"
                        id="first-name"
                        autoComplete="given-name"
                        className="mt-2 block w-full rounded-md border-none bg-neutral-800  py-1.5 text-white shadow-sm  sm:text-sm sm:leading-6"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="last-name"
                        className="block text-sm font-medium leading-6 text-white"
                      >
                        Last name
                      </label>
                      <input
                        type="text"
                        name="last-name"
                        id="last-name"
                        autoComplete="family-name"
                        className="mt-2 block w-full rounded-md border-none bg-neutral-800  py-1.5 text-white shadow-sm  sm:text-sm sm:leading-6"
                      />
                    </div>

                    <div className="sm:col-span-6">
                      <label
                        htmlFor="username"
                        className="block text-sm font-medium leading-6 text-white"
                      >
                        Username
                      </label>
                      <div className="mt-2 flex rounded-md shadow-sm">
                        <input
                          type="text"
                          name="username"
                          id="username"
                          autoComplete="username"
                          defaultValue="lisamarie"
                          className="block w-full rounded-md border-none bg-neutral-800  py-1.5 text-white shadow-sm  sm:text-sm sm:leading-6"
                          disabled
                        />
                      </div>
                    </div>

                    <div className=" sm:col-span-6 ">
                      <label
                        htmlFor="photo"
                        className="block flex text-sm font-medium leading-6 text-white"
                      >
                        Profile Picture
                      </label>
                      <div className="mt-2 flex items-center">
                        <img
                          className="inline-block h-12 w-12 rounded-full"
                          id="pfp"
                          src={
                            pfp
                          }
                          alt="photo"
                        />
                          <input
                                                        className="hidden"
                                                        type="file"
                                                        id="profileImageInput"
                                                        onChange={handleImageChange}
                                                        accept="image/*"
                                                    />

                        <button onClick={() => handlePopupOpen()} className="ml-4 bg-neutral cursor:pointer  block rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-neutral-800 peer-focus:ring-2 peer-focus:ring-blue-600">
                          Change
                        </button>
                      
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium leading-6 text-white"
                      >
                        Bio
                      </label>
                      <div className="mt-2">
                        <textarea
                          id="bio"
                          name="bio"
                          rows={4}
                          className="block w-full rounded-md border-0 border-none bg-neutral-800 text-white shadow-sm  placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:py-1.5 sm:text-sm sm:leading-6"
                          defaultValue={'No bio set yet!'}
                        />
                      </div>
                      <p className="mt-3 text-sm text-white">
                        Brief description for your profile. URLs are
                        hyperlinked.
                      </p>
                    </div>

                    <div className="sm:col-span-6">
                      <label
                        htmlFor="url"
                        className="block text-sm font-medium leading-6 text-white"
                      >
                        Github Username
                      </label>
                      <input
                        type="text"
                        onChange={handleInputChange}
                        name="url"
                        id="url"
                        className="mt-2 block w-full rounded-md border-none bg-neutral-800  py-1.5 text-white shadow-sm  sm:text-sm sm:leading-6"
                      />
                      <label
                        htmlFor="url"
                        className="mt-0.5 block text-xs font-medium leading-6 text-white"
                      >
                        Your GitHub link: github.com/{inputText}
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-y-6 pt-8 sm:grid-cols-6 sm:gap-x-6">
                    <div className="sm:col-span-6">
                      <h2 className="text-xl font-medium text-white">
                        Personal Information
                      </h2>
                      <p className="mt-1 text-sm text-white">
                        This information will be displayed publicly so be
                        careful what you share.
                      </p>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="email-address"
                        className="block text-sm font-medium leading-6 text-white"
                      >
                        Email address
                      </label>
                      <input
                        type="text"
                        name="email-address"
                        id="email"
                        autoComplete="email"
                        className="mt-2 block w-full rounded-md border-none bg-neutral-800  py-1.5 text-white shadow-sm  sm:text-sm sm:leading-6"
                        disabled
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium leading-6 text-white"
                      >
                        Location
                      </label>
                      <select
                        id="location"
                        name="country"
                        autoComplete="country-name"
                        className="mt-2 block w-full rounded-md border-none bg-neutral-800  py-1.5 text-white shadow-sm  sm:text-sm sm:leading-6"
                      >
                        <option value="Afghanistan">Afghanistan</option>
                        <option value="Åland Islands">Åland Islands</option>
                        <option value="Albania">Albania</option>
                        <option value="Algeria">Algeria</option>
                        <option value="American Samoa">American Samoa</option>
                        <option value="Andorra">Andorra</option>
                        <option value="Angola">Angola</option>
                        <option value="Anguilla">Anguilla</option>
                        <option value="Antarctica">Antarctica</option>
                        <option value="Antigua and Barbuda">
                          Antigua and Barbuda
                        </option>
                        <option value="Argentina">Argentina</option>
                        <option value="Armenia">Armenia</option>
                        <option value="Aruba">Aruba</option>
                        <option value="Australia">Australia</option>
                        <option value="Austria">Austria</option>
                        <option value="Azerbaijan">Azerbaijan</option>
                        <option value="Bahamas">Bahamas</option>
                        <option value="Bahrain">Bahrain</option>
                        <option value="Bangladesh">Bangladesh</option>
                        <option value="Barbados">Barbados</option>
                        <option value="Belarus">Belarus</option>
                        <option value="Belgium">Belgium</option>
                        <option value="Belize">Belize</option>
                        <option value="Benin">Benin</option>
                        <option value="Bermuda">Bermuda</option>
                        <option value="Bhutan">Bhutan</option>
                        <option value="Bolivia">Bolivia</option>
                        <option value="Bosnia and Herzegovina">
                          Bosnia and Herzegovina
                        </option>
                        <option value="Botswana">Botswana</option>
                        <option value="Bouvet Island">Bouvet Island</option>
                        <option value="Brazil">Brazil</option>
                        <option value="British Indian Ocean Territory">
                          British Indian Ocean Territory
                        </option>
                        <option value="Brunei Darussalam">
                          Brunei Darussalam
                        </option>
                        <option value="Bulgaria">Bulgaria</option>
                        <option value="Burkina Faso">Burkina Faso</option>
                        <option value="Burundi">Burundi</option>
                        <option value="Cambodia">Cambodia</option>
                        <option value="Cameroon">Cameroon</option>
                        <option value="Canada">Canada</option>
                        <option value="Cape Verde">Cape Verde</option>
                        <option value="Cayman Islands">Cayman Islands</option>
                        <option value="Central African Republic">
                          Central African Republic
                        </option>
                        <option value="Chad">Chad</option>
                        <option value="Chile">Chile</option>
                        <option value="China">China</option>
                        <option value="Christmas Island">
                          Christmas Island
                        </option>
                        <option value="Cocos (Keeling) Islands">
                          Cocos (Keeling) Islands
                        </option>
                        <option value="Colombia">Colombia</option>
                        <option value="Comoros">Comoros</option>
                        <option value="Congo">Congo</option>
                        <option value="Congo, The Democratic Republic of The">
                          Congo, The Democratic Republic of The
                        </option>
                        <option value="Cook Islands">Cook Islands</option>
                        <option value="Costa Rica">Costa Rica</option>
                        <option value="Cote D'ivoire">Cote D'ivoire</option>
                        <option value="Croatia">Croatia</option>
                        <option value="Cuba">Cuba</option>
                        <option value="Cyprus">Cyprus</option>
                        <option value="Czech Republic">Czech Republic</option>
                        <option value="Denmark">Denmark</option>
                        <option value="Djibouti">Djibouti</option>
                        <option value="Dominica">Dominica</option>
                        <option value="Dominican Republic">
                          Dominican Republic
                        </option>
                        <option value="Ecuador">Ecuador</option>
                        <option value="Egypt">Egypt</option>
                        <option value="El Salvador">El Salvador</option>
                        <option value="Equatorial Guinea">
                          Equatorial Guinea
                        </option>
                        <option value="Eritrea">Eritrea</option>
                        <option value="Estonia">Estonia</option>
                        <option value="Ethiopia">Ethiopia</option>
                        <option value="Falkland Islands (Malvinas)">
                          Falkland Islands (Malvinas)
                        </option>
                        <option value="Faroe Islands">Faroe Islands</option>
                        <option value="Fiji">Fiji</option>
                        <option value="Finland">Finland</option>
                        <option value="France">France</option>
                        <option value="French Guiana">French Guiana</option>
                        <option value="French Polynesia">
                          French Polynesia
                        </option>
                        <option value="French Southern Territories">
                          French Southern Territories
                        </option>
                        <option value="Gabon">Gabon</option>
                        <option value="Gambia">Gambia</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Germany">Germany</option>
                        <option value="Ghana">Ghana</option>
                        <option value="Gibraltar">Gibraltar</option>
                        <option value="Greece">Greece</option>
                        <option value="Greenland">Greenland</option>
                        <option value="Grenada">Grenada</option>
                        <option value="Guadeloupe">Guadeloupe</option>
                        <option value="Guam">Guam</option>
                        <option value="Guatemala">Guatemala</option>
                        <option value="Guernsey">Guernsey</option>
                        <option value="Guinea">Guinea</option>
                        <option value="Guinea-bissau">Guinea-bissau</option>
                        <option value="Guyana">Guyana</option>
                        <option value="Haiti">Haiti</option>
                        <option value="Heard Island and Mcdonald Islands">
                          Heard Island and Mcdonald Islands
                        </option>
                        <option value="Holy See (Vatican City State)">
                          Holy See (Vatican City State)
                        </option>
                        <option value="Honduras">Honduras</option>
                        <option value="Hong Kong">Hong Kong</option>
                        <option value="Hungary">Hungary</option>
                        <option value="Iceland">Iceland</option>
                        <option value="India">India</option>
                        <option value="Indonesia">Indonesia</option>
                        <option value="Iran, Islamic Republic of">
                          Iran, Islamic Republic of
                        </option>
                        <option value="Iraq">Iraq</option>
                        <option value="Ireland">Ireland</option>
                        <option value="Isle of Man">Isle of Man</option>
                        <option value="Israel">Israel</option>
                        <option value="Italy">Italy</option>
                        <option value="Jamaica">Jamaica</option>
                        <option value="Japan">Japan</option>
                        <option value="Jersey">Jersey</option>
                        <option value="Jordan">Jordan</option>
                        <option value="Kazakhstan">Kazakhstan</option>
                        <option value="Kenya">Kenya</option>
                        <option value="Kiribati">Kiribati</option>
                        <option value="Korea, Democratic People's Republic of">
                          Korea, Democratic People's Republic of
                        </option>
                        <option value="Korea, Republic of">
                          Korea, Republic of
                        </option>
                        <option value="Kuwait">Kuwait</option>
                        <option value="Kyrgyzstan">Kyrgyzstan</option>
                        <option value="Lao People's Democratic Republic">
                          Lao People's Democratic Republic
                        </option>
                        <option value="Latvia">Latvia</option>
                        <option value="Lebanon">Lebanon</option>
                        <option value="Lesotho">Lesotho</option>
                        <option value="Liberia">Liberia</option>
                        <option value="Libyan Arab Jamahiriya">
                          Libyan Arab Jamahiriya
                        </option>
                        <option value="Liechtenstein">Liechtenstein</option>
                        <option value="Lithuania">Lithuania</option>
                        <option value="Luxembourg">Luxembourg</option>
                        <option value="Macao">Macao</option>
                        <option value="Macedonia, The Former Yugoslav Republic of">
                          Macedonia, The Former Yugoslav Republic of
                        </option>
                        <option value="Madagascar">Madagascar</option>
                        <option value="Malawi">Malawi</option>
                        <option value="Malaysia">Malaysia</option>
                        <option value="Maldives">Maldives</option>
                        <option value="Mali">Mali</option>
                        <option value="Malta">Malta</option>
                        <option value="Marshall Islands">
                          Marshall Islands
                        </option>
                        <option value="Martinique">Martinique</option>
                        <option value="Mauritania">Mauritania</option>
                        <option value="Mauritius">Mauritius</option>
                        <option value="Mayotte">Mayotte</option>
                        <option value="Mexico">Mexico</option>
                        <option value="Micronesia, Federated States of">
                          Micronesia, Federated States of
                        </option>
                        <option value="Moldova, Republic of">
                          Moldova, Republic of
                        </option>
                        <option value="Monaco">Monaco</option>
                        <option value="Mongolia">Mongolia</option>
                        <option value="Montenegro">Montenegro</option>
                        <option value="Montserrat">Montserrat</option>
                        <option value="Morocco">Morocco</option>
                        <option value="Mozambique">Mozambique</option>
                        <option value="Myanmar">Myanmar</option>
                        <option value="Namibia">Namibia</option>
                        <option value="Nauru">Nauru</option>
                        <option value="Nepal">Nepal</option>
                        <option value="Netherlands">Netherlands</option>
                        <option value="Netherlands Antilles">
                          Netherlands Antilles
                        </option>
                        <option value="New Caledonia">New Caledonia</option>
                        <option value="New Zealand">New Zealand</option>
                        <option value="Nicaragua">Nicaragua</option>
                        <option value="Niger">Niger</option>
                        <option value="Nigeria">Nigeria</option>
                        <option value="Niue">Niue</option>
                        <option value="Norfolk Island">Norfolk Island</option>
                        <option value="Northern Mariana Islands">
                          Northern Mariana Islands
                        </option>
                        <option value="Norway">Norway</option>
                        <option value="Oman">Oman</option>
                        <option value="Pakistan">Pakistan</option>
                        <option value="Palau">Palau</option>
                        <option value="Palestinian Territory, Occupied">
                          Palestinian Territory, Occupied
                        </option>
                        <option value="Panama">Panama</option>
                        <option value="Papua New Guinea">
                          Papua New Guinea
                        </option>
                        <option value="Paraguay">Paraguay</option>
                        <option value="Peru">Peru</option>
                        <option value="Philippines">Philippines</option>
                        <option value="Pitcairn">Pitcairn</option>
                        <option value="Poland">Poland</option>
                        <option value="Portugal">Portugal</option>
                        <option value="Puerto Rico">Puerto Rico</option>
                        <option value="Qatar">Qatar</option>
                        <option value="Reunion">Reunion</option>
                        <option value="Romania">Romania</option>
                        <option value="Russian Federation">
                          Russian Federation
                        </option>
                        <option value="Rwanda">Rwanda</option>
                        <option value="Saint Helena">Saint Helena</option>
                        <option value="Saint Kitts and Nevis">
                          Saint Kitts and Nevis
                        </option>
                        <option value="Saint Lucia">Saint Lucia</option>
                        <option value="Saint Pierre and Miquelon">
                          Saint Pierre and Miquelon
                        </option>
                        <option value="Saint Vincent and The Grenadines">
                          Saint Vincent and The Grenadines
                        </option>
                        <option value="Samoa">Samoa</option>
                        <option value="San Marino">San Marino</option>
                        <option value="Sao Tome and Principe">
                          Sao Tome and Principe
                        </option>
                        <option value="Saudi Arabia">Saudi Arabia</option>
                        <option value="Senegal">Senegal</option>
                        <option value="Serbia">Serbia</option>
                        <option value="Seychelles">Seychelles</option>
                        <option value="Sierra Leone">Sierra Leone</option>
                        <option value="Singapore">Singapore</option>
                        <option value="Slovakia">Slovakia</option>
                        <option value="Slovenia">Slovenia</option>
                        <option value="Solomon Islands">Solomon Islands</option>
                        <option value="Somalia">Somalia</option>
                        <option value="South Africa">South Africa</option>
                        <option value="South Georgia and The South Sandwich Islands">
                          South Georgia and The South Sandwich Islands
                        </option>
                        <option value="Spain">Spain</option>
                        <option value="Sri Lanka">Sri Lanka</option>
                        <option value="Sudan">Sudan</option>
                        <option value="Suriname">Suriname</option>
                        <option value="Svalbard and Jan Mayen">
                          Svalbard and Jan Mayen
                        </option>
                        <option value="Swaziland">Swaziland</option>
                        <option value="Sweden">Sweden</option>
                        <option value="Switzerland">Switzerland</option>
                        <option value="Syrian Arab Republic">
                          Syrian Arab Republic
                        </option>
                        <option value="Taiwan">Taiwan</option>
                        <option value="Tajikistan">Tajikistan</option>
                        <option value="Tanzania, United Republic of">
                          Tanzania, United Republic of
                        </option>
                        <option value="Thailand">Thailand</option>
                        <option value="Timor-leste">Timor-leste</option>
                        <option value="Togo">Togo</option>
                        <option value="Tokelau">Tokelau</option>
                        <option value="Tonga">Tonga</option>
                        <option value="Trinidad and Tobago">
                          Trinidad and Tobago
                        </option>
                        <option value="Tunisia">Tunisia</option>
                        <option value="Turkey">Turkey</option>
                        <option value="Turkmenistan">Turkmenistan</option>
                        <option value="Turks and Caicos Islands">
                          Turks and Caicos Islands
                        </option>
                        <option value="Tuvalu">Tuvalu</option>
                        <option value="Uganda">Uganda</option>
                        <option value="Ukraine">Ukraine</option>
                        <option value="United Arab Emirates">
                          United Arab Emirates
                        </option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="United States">United States</option>
                        <option value="United States Minor Outlying Islands">
                          United States Minor Outlying Islands
                        </option>
                        <option value="Uruguay">Uruguay</option>
                        <option value="Uzbekistan">Uzbekistan</option>
                        <option value="Vanuatu">Vanuatu</option>
                        <option value="Venezuela">Venezuela</option>
                        <option value="Viet Nam">Viet Nam</option>
                        <option value="Virgin Islands, British">
                          Virgin Islands, British
                        </option>
                        <option value="Virgin Islands, U.S.">
                          Virgin Islands, U.S.
                        </option>
                        <option value="Wallis and Futuna">
                          Wallis and Futuna
                        </option>
                        <option value="Western Sahara">Western Sahara</option>
                        <option value="Yemen">Yemen</option>
                        <option value="Zambia">Zambia</option>
                        <option value="Zimbabwe">Zimbabwe</option>
                      </select>
                    </div>
                  </div>

 {/* PROFILE PICTURE POP-UP */}

          <Transition.Root show={isPopupOpen} as={Fragment}>
            <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={() => handlePopupClose()}>


                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div onClick={() => {
                                    handlePopupClose()
                                    localStorage.setItem("22-18-update", false)
                                }}
                                    className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" />
                            </Transition.Child>
                            <div className="flex items-end justify-center min-h-screen pt-4 px-4 text-center sm:block sm:p-0">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                >
                                    <div style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: "#161716" }} className="max-w-6xl relative inline-block align-bottom w-5/6 pb-10 pt-10 bg-gray-900 border border-gray-700 rounded-lg px-20 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle ">
                                        <div>
                                            <div className="mt-3 sm:mt-5">
                                                <h1 className="text-white text-4xl text-center pb-10">Change Profile Picture</h1>
                                                <div className="grid grid-cols-2 flex justify-center items-center">
                                                    <div className="mx-20 h-80 w-80 flex items-center justify-center">
                                                        <div className="mx-10">
                                                            <img
                                                                className="h-48 w-48 border border-neutral-800 rounded-full sm:h-48 sm:w-48"
                                                                src={pfp}
                                                                alt=""
                                                            />
                                                            <h1 className="text-white text-xl text-center font-bold -mx-6 mt-7">
                                                                Current Profile Picture
                                                            </h1>
                                                        </div>
                                                    </div>
                                                    {/* INPUT BOX */}
                                                    <div
                                                        className="h-72 w-80 border border-neutral-800 mx-20 relative rounded-lg p-4 text-center cursor-pointer flex items-center justify-center"
                                                        onClick={handleClick}
                                                        onDrop={handleImageChange}
                                                        onDragOver={handleImageChange}
                                                    >
                                                        <label htmlFor="profileImageInput">
                                                            {selectedImage ? (
                                                                <div>
                                                                    <img
                                                                        src={URL.createObjectURL(selectedImage)}
                                                                        alt="Selected Profile Picture"
                                                                        className="mx-auto h-48 w-48 object-cover rounded-full"
                                                                    />
                                                                    <h1 className="text-white text-xl text-center font-bold -mx-6 mt-7">
                                                                        New Profile Picture
                                                                    </h1>
                                                                </div>
                                                            ) : (
                                                                <div className="">
                                                                    <svg
                                                                        className="mx-auto h-12 w-12 text-gray-400"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        viewBox="0 0 24 24"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth="2"
                                                                            d="M12 4v16m8-8H4"
                                                                        />
                                                                    </svg>
                                                                    <p className="mt-5 text-sm text-gray-600">Click here or Drag an Image!</p>
                                                                </div>
                                                            )}
                                                        </label>
                                                    </div>
                                                    <input
                                                        className="hidden"
                                                        type="file"
                                                        id="profileImageInput"
                                                        onChange={handleImageChange}
                                                        accept="image/*"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 pt-5">
                                                    <div className="flex items-center justify-end">
                                                        <button className="border border-neutral-700 mx-3 rounded-md w-20 text-white py-2 bg-neutral-800 hover:text-neutral-500"
                                                            onClick={() => handlePopupClose()}>Close
                                                        </button>
                                                    </div>
                                                    <div className="flex items-center justify-start">
                                                        <button className="border border-neutral-700 mx-3 rounded-md w-20 text-white py-2 bg-green-900 hover:text-neutral-500"
                                                            onClick={() => handleSaveChanges()}>Save
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Transition.Child>
                            </div>
                        </Dialog>
                    </Transition.Root>
                

                  <div className="flex justify-end gap-x-3 pt-8">
                    <button
                      id="save"
                      onClick={saveGeneral}
                      href="../dashboard"
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

      {billing && (
        <div id="general" className="">
          <div className="mx-auto flex max-w-6xl">
            <div
              className="  mt-10 flex-none border-r pl-10 pr-10 text-gray-900"
              style={{ borderColor: '#212121' }}
            >
              <ul className="mr-2 py-2">
                <li className="py-1">
                  <a
                    href="../settings"
                    className="px-2 py-2 text-lg  font-medium text-white"
                  >
                    {' '}
                    General
                  </a>
                </li>
                <li className="py-1 ">
                  <a
                    href="../settings?loc=security"
                    className="px-2 py-1  text-lg font-medium text-white hover:text-gray-400"
                  >
                    Security
                  </a>
                </li>
                <li className="py-1 ">
                  <a
                    href="../settings?loc=preferences"
                    className="px-2 py-1  text-lg font-medium text-white hover:text-gray-400"
                  >
                    Email Preferences
                  </a>
                </li>
                <li className="py-1 ">
                  <a
                    href="../settings?loc=billing"
                    className="px-2 py-1  text-lg font-medium text-white hover:text-gray-400"
                  >
                    Billing
                  </a>
                </li>
              </ul>
            </div>

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
            <div
              className="  mt-10 flex-none border-r pl-10 pr-10 text-gray-900"
              style={{ borderColor: '#212121' }}
            >
              <ul className="mr-2 py-2">
                <li className="py-1">
                  <a
                    href="../settings"
                    className="px-2 py-2 text-lg  font-medium text-white"
                  >
                    {' '}
                    General
                  </a>
                </li>
                <li className="py-1 ">
                  <a
                    href="../settings?loc=security"
                    className="px-2 py-1  text-lg font-medium text-white hover:text-gray-400"
                  >
                    Security
                  </a>
                </li>
                <li className="py-1 ">
                  <a
                    href="../settings?loc=preferences"
                    className="px-2 py-1  text-lg font-medium text-white hover:text-gray-400"
                  >
                    Email Preferences
                  </a>
                </li>
                <li className="py-1 ">
                  <a
                    href="../settings?loc=billing"
                    className="px-2 py-1  text-lg font-medium text-white hover:text-gray-400"
                  >
                    Billing
                  </a>
                </li>
              </ul>
            </div>

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
        </div>
      )}

      {preferences && (
        <div id="preferences" className="">
          <div className="mx-auto flex max-w-6xl">
            <div
              className="  mt-10 flex-none list-none border-r pl-10 pr-10 text-white"
              style={{ borderColor: '#212121' }}
            >
              <ul className="mr-2 list-none py-2">
                <li className="py-1">
                  <a
                    href="../settings"
                    className="px-2 py-2 text-lg  font-medium text-white"
                  >
                    {' '}
                    General
                  </a>
                </li>
                <li className="py-1 ">
                  <a
                    href="../settings?loc=security"
                    className="px-2 py-1  text-lg font-medium text-white hover:text-gray-400"
                  >
                    Security
                  </a>
                </li>
                <li className="py-1 ">
                  <a
                    href="../settings?loc=preferences"
                    className="px-2 py-1  text-lg font-medium text-white hover:text-gray-400"
                  >
                    Email Preferences
                  </a>
                </li>
                <li className="py-1 ">
                  <a
                    href="../settings?loc=billing"
                    className="px-2 py-1  text-lg font-medium text-white hover:text-gray-400"
                  >
                    Billing
                  </a>
                </li>
              </ul>
            </div>

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
