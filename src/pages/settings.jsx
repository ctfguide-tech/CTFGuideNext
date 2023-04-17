import Head from 'next/head';
import { Footer } from '@/components/Footer';
import { StandardNav } from '@/components/StandardNav';
import { useEffect } from 'react';
import { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  updatePassword,
  getAuth,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { useRouter } from 'next/router';

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

  var pfpString = '';
  var pfpChanged = false;

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fileInput = document.getElementById('fileInput');
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
              document.getElementById('pfp').src = pfpString;
            }

            if (JSON.parse(this.responseText).profileImage == '') {
              document.getElementById('pfp').src = `https://robohash.org/${
                document.getElementById('username').value
              }.png?set=set1&size=150x150`;
            } else {
              document.getElementById('pfp').src = JSON.parse(
                this.responseText
              ).profileImage;
            }
          } catch (e) {
            console.log(e);
          }
        }
      });

      xhr.open('GET', `${process.env.NEXT_PUBLIC_API_URL}/account`);
      xhr.setRequestHeader(
        'Authorization',
        'Bearer ' + localStorage.getItem('idToken')
      );

      xhr.send();
    }
  }

  function saveGeneral() {
    document.getElementById('save').innerHTML = 'Saving...';

    if (pfpChanged) {
      var xhr = new XMLHttpRequest();
      xhr.addEventListener('readystatechange', function () {
        if (this.readyState === 4) {
          const file = document.getElementById('fileInput').files[0];
          const storage = getStorage();
          const storageRef = ref(
            storage,
            JSON.parse(this.responseText).email + '/pictures/' + 'pfp'
          );

          uploadBytes(storageRef, file).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((downloadURL) => {
              document.getElementById('pfp').src = downloadURL;
              console.log(downloadURL);

              var firstName = document.getElementById('first-name').value;
              var lastName = document.getElementById('last-name').value;
              var bio = document.getElementById('bio').value;
              var github = document.getElementById('url').value;
              var location = document.getElementById('location').value;

              var data = {};
              if (bio !== "") {
                data.bio = bio;
              }
              if (github !== "") {
                data.githubUrl = github;
              }
              if (firstName !== "") {
                data.firstName = firstName;
              }
              if (lastName !== "") {
                data.lastName = lastName;
              }
              if (location !== "") {
                data.location = location;
              }
              if (downloadURL !== "") {
                data.profileImage = downloadURL;
              }
              
              var gooddata = JSON.stringify(data);
              
              var xhr = new XMLHttpRequest();

              xhr.addEventListener('readystatechange', function () {
                if (this.readyState === 4) {
                  console.log(this.responseText);
                  document.getElementById('save').innerHTML = 'Save';
                }
              });

              xhr.open('PUT', `${process.env.NEXT_PUBLIC_API_URL}/account`);
              xhr.setRequestHeader(
                'Authorization',
                'Bearer ' + localStorage.getItem('idToken')
              );
              xhr.setRequestHeader('Content-Type', 'application/json');

              xhr.send(gooddata);
            });
          });
        }
      });

      xhr.open('GET', `${process.env.NEXT_PUBLIC_API_URL}/account`);
      xhr.setRequestHeader(
        'Authorization',
        'Bearer ' + localStorage.getItem('idToken')
      );
      xhr.send();
    } else {
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
      xhr.setRequestHeader(
        'Authorization',
        'Bearer ' + localStorage.getItem('idToken')
      );
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.send(data);
    }
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
    xhr.setRequestHeader(
      'Authorization',
      'Bearer ' + localStorage.getItem('idToken')
    );
    xhr.setRequestHeader('Content-Type', 'application/json');

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
    xhr.setRequestHeader(
      'Authorization',
      'Bearer ' + localStorage.getItem('idToken')
    );

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
              className="  mt-10 flex-none border-r pr-10 pl-10 text-gray-900"
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
              </ul>
            </div>

            <div className="flex-1 xl:overflow-y-auto">
              <div className="mx-auto max-w-3xl py-10 px-4 sm:px-6 lg:py-12 lg:px-8">
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

                    <div className="blur-sm sm:col-span-6 ">
                      <label
                        htmlFor="photo"
                        className="block flex text-sm font-medium leading-6 text-white"
                      >
                        Photo (Experimental)
                      </label>
                      <div className="mt-2 flex items-center">
                        <img
                          className="inline-block h-12 w-12 rounded-full"
                          id="pfp"
                          src=""
                          alt="photo"
                        />
                        <div className="relative ml-4">
                          <input
                            onChange={pfpChange}
                            id="fileInput"
                            name="user-photo"
                            type="file"
                            className="peer absolute inset-0 h-full w-full rounded-md opacity-0"
                            disabled
                          />
                          <label
                            htmlFor="user-photo"
                            className="bg-neutral cursor:pointer pointer-events-none block rounded-md py-2 px-3 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-slate-300 peer-hover:bg-neutral-800 peer-focus:ring-2 peer-focus:ring-blue-600"
                          >
                            <span>Change</span>
                            <span className="sr-only"> user photo</span>
                          </label>
                        </div>
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
                          defaultValue={''}
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

                  <div className="flex justify-end gap-x-3 pt-8">
                    <button
                      id="save"
                      onClick={saveGeneral}
                      className="inline-flex justify-center rounded-md bg-blue-600 py-2 px-3 text-sm font-semibold text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
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

      {security && (
        <div id="security" className="">
          <div className="mx-auto flex max-w-6xl">
            <div
              className="  mt-10 flex-none border-r pr-10 pl-10 text-gray-900"
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
              </ul>
            </div>

            <div className="flex-1 xl:overflow-y-auto">
              <div className="mx-auto max-w-3xl py-10 px-4 sm:px-6 lg:py-12 lg:px-8">
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
                    className="inline-flex justify-center rounded-md bg-blue-600 py-2 px-3 text-sm font-semibold text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
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
              className="  mt-10 flex-none list-none border-r pr-10 pl-10 text-white"
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
              </ul>
            </div>

            <div className="flex-1 xl:overflow-y-auto">
              <div className="mx-auto max-w-3xl py-10 px-4 sm:px-6 lg:py-12 lg:px-8">
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
                      className="inline-flex justify-center rounded-md bg-blue-600 py-2 px-3 text-sm font-semibold text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
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
