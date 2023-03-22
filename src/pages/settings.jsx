import Head from 'next/head'
import { Footer } from '@/components/Footer'
import { StandardNav } from '@/components/StandardNav'
import { useEffect } from 'react'
import { useState } from 'react'
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updatePassword, getAuth, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth'
import { useRouter } from 'next/router'

export default function Dashboard() {

  const router = useRouter()

  const [inputText, setInputText] = useState("");

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const [open, setOpen] = useState(true)
  const [general, setGeneral] = useState(false)
  const [security, setSecurity] = useState(false)
  const [preferences, setPreferences] = useState(false)

  var pfpString = ""
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
    console.log(router.query.loc)
    if (router.query.loc == "general" || router.query.loc == undefined) {
      setGeneral(true)
      loadGeneral()
    } else {
      setGeneral(false)
    }

    if (router.query.loc == "security") {
      setSecurity(true)
    } else {
      setSecurity(false)
    }

    if (router.query.loc == "preferences") {
      loadPreferences();
      setPreferences(true)
    } else {
      setPreferences(false)
    }

  }, [router.query]);













  function loadGeneral() {
    if (router.query.loc == "general" || router.query.loc == undefined) {


    var xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {

        console.log(this.responseText)
        try {

        if (document.getElementById("first-name")) { 
            document.getElementById("first-name").value = JSON.parse(this.responseText).firstName;
            document.getElementById("last-name").value = JSON.parse(this.responseText).lastName;
            document.getElementById("bio").value = JSON.parse(this.responseText).bio;
            document.getElementById("url").value = JSON.parse(this.responseText).githubUrl;
            document.getElementById("location").value = JSON.parse(this.responseText).location;
            document.getElementById("username").value = JSON.parse(this.responseText).username;
            document.getElementById("email").value = JSON.parse(this.responseText).email;
        }
        
        if (pfpString == "") {

        } else {
          document.getElementById("pfp").src = pfpString;
        }

        if (JSON.parse(this.responseText).profileImage == "") {
          document.getElementById("pfp").src = `https://robohash.org/${document.getElementById("username").value}.png?set=set1&size=150x150`
        } else {
          document.getElementById("pfp").src = JSON.parse(this.responseText).profileImage;
        }



      } catch (e) {
        console.log(e)
      }

      
      }
    });

    xhr.open("GET", `${process.env.NEXT_PUBLIC_API_URL}/account`);
    xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("idToken"));

    xhr.send();

  }

  }

  function saveGeneral() {
    document.getElementById("save").innerHTML = "Saving..."

    if (pfpChanged) {
      var xhr = new XMLHttpRequest();
      xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {

          const file = document.getElementById('fileInput').files[0];
          const storage = getStorage();
          const storageRef = ref(storage, JSON.parse(this.responseText).email + "/pictures/" + "pfp")

          uploadBytes(storageRef, file).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((downloadURL) => {
              document.getElementById("pfp").src = downloadURL;
              console.log(downloadURL)

              var firstName = document.getElementById("first-name").value;
              var lastName = document.getElementById("last-name").value;
              var bio = document.getElementById("bio").value;
              var github = document.getElementById("url").value;
              var location = document.getElementById("location").value;



              var data = JSON.stringify({
                "bio": bio,
                "githubUrl": github,
                "firstName": firstName,
                "lastName": lastName,
                "location": location,
                "profileImage": downloadURL
              });

              var xhr = new XMLHttpRequest();

              xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                  console.log(this.responseText);
                  document.getElementById("save").innerHTML = "Save"

                }
              });

              xhr.open("PUT", `${process.env.NEXT_PUBLIC_API_URL}/account`);
              xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("idToken"));
              xhr.setRequestHeader("Content-Type", "application/json");

              xhr.send(data);

            });
          });


        }
      });

      xhr.open("GET", `${process.env.NEXT_PUBLIC_API_URL}/account`);
      xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("idToken"));
      xhr.send();
    } else {

      var firstName = document.getElementById("first-name").value;
      var lastName = document.getElementById("last-name").value;
      var bio = document.getElementById("bio").value;
      var github = document.getElementById("url").value;
      var location = document.getElementById("location").value;



      var data = JSON.stringify({
        "bio": bio,
        "githubUrl": github,
        "firstName": firstName,
        "lastName": lastName,
        "location": location,
      });

      var xhr = new XMLHttpRequest();

      xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
          console.log(this.responseText);
          document.getElementById("save").innerHTML = "Save"

        }
      });

      xhr.open("PUT", `${process.env.NEXT_PUBLIC_API_URL}/account`);
      xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("idToken"));
      xhr.setRequestHeader("Content-Type", "application/json");

      xhr.send(data);

    }




  }

  function savePreferences() {

    document.getElementById("savePreferences").innerHTML = "Saving..."

    var data = JSON.stringify({
      "FRIEND_ACCEPT": document.getElementById("friend-notif").checked,
      "CHALLENGE_VERIFY": document.getElementById("challenge-notif").checked,
    });
    
    var xhr = new XMLHttpRequest();
    
    xhr.addEventListener("readystatechange", function() {
      if(this.readyState === 4) {
        document.getElementById("savePreferences").innerHTML = "Save"
      }
    });
    
    xhr.open("PUT", `${process.env.NEXT_PUBLIC_API_URL}/account/preferences`);
    xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("idToken"));
    xhr.setRequestHeader("Content-Type", "application/json");
    
    xhr.send(data);
  }

  function loadPreferences() {
    // WARNING: For GET requests, body is set to null by browsers.

    var xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        console.log(this.responseText);
        console.log("PREFFF")
try {
        if (JSON.parse(this.responseText)[0].value == true) {
          document.getElementById("friend-notif").checked = true;
        }

        if (JSON.parse(this.responseText)[1].value == true) {
          document.getElementById("challenge-notif").checked = true;
        }
      } catch (error) {
        // .alert(error)
      }


      }
    });

    xhr.open("GET", `${process.env.NEXT_PUBLIC_API_URL}/account/preferences`);
    xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("idToken"));

    xhr.send();
  }

  function saveSecurity() {

    document.getElementById("saveSecurity").innerText = "Saving...";
    var oldPassword = document.getElementById("oldPassword").value;

    reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, oldPassword)).then(() => {

      var password = document.getElementById("password").value;
      var confirmPassword = document.getElementById("confirm-password").value;

      if (password == confirmPassword) {

        updatePassword(user, confirmPassword).then(() => {

          document.getElementById("saveSecurity").innerText = "Save";

          document.getElementById("password").value = "";
          document.getElementById("confirm-password").value = "";


        }).catch((error) => {

          document.getElementById("saveSecurity").innerText = "Save";

          window.alert(error)
        });



      }

    }).catch((error) => {
      document.getElementById("saveSecurity").innerText = "Save";
      window.alert(error)
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
          @import url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
        </style>
      </Head>


      <StandardNav />

      {
        general && (
          <div id="general" className="">
            <div className='flex max-w-6xl mx-auto'>
              <div className="  text-gray-900 flex-none mt-10 border-r pr-10 pl-10" style={{ borderColor: "#212121" }}>
                <ul className="py-2 mr-2">
                  <li className="py-1"><a href="../settings" className="px-2 py-2 text-white  font-medium text-lg"> General</a></li>
                  <li className="py-1 "><a href="../settings?loc=security" className="px-2 py-1  text-white hover:text-gray-400 font-medium text-lg">Security</a></li>
                  <li className="py-1 "><a href="../settings?loc=preferences" className="px-2 py-1  text-white hover:text-gray-400 font-medium text-lg">Email Preferences</a></li>


                </ul>
              </div>


              <div className="flex-1 xl:overflow-y-auto">
                <div className="mx-auto max-w-3xl py-10 px-4 sm:px-6 lg:py-12 lg:px-8">
                  <h1 className="text-3xl font-bold tracking-tight text-white">General</h1>

                  <div className="mt-6 space-y-8 ">
                    <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
                      <div className="sm:col-span-6">
                        <h2 className="text-xl font-medium text-white">Profile</h2>
                        <p className="mt-1 text-sm text-white">
                          This information will be displayed publicly so be careful what you share.
                        </p>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-white">
                          First name
                        </label>
                        <input
                          type="text"
                          name="first-name"
                          id="first-name"
                          autoComplete="given-name"
                          className="bg-neutral-800 border-none mt-2 block w-full rounded-md  py-1.5 text-white shadow-sm  sm:text-sm sm:leading-6"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-white">
                          Last name
                        </label>
                        <input
                          type="text"
                          name="last-name"
                          id="last-name"
                          autoComplete="family-name"
                          className="bg-neutral-800 border-none mt-2 block w-full rounded-md  py-1.5 text-white shadow-sm  sm:text-sm sm:leading-6"
                        />
                      </div>

                      <div className="sm:col-span-6">
                        <label htmlFor="username" className="block text-sm font-medium leading-6 text-white">
                          Username
                        </label>
                        <div className="mt-2 flex rounded-md shadow-sm">

                          <input
                            type="text"
                            name="username"
                            id="username"
                            autoComplete="username"
                            defaultValue="lisamarie"
                            className="bg-neutral-800 border-none block w-full rounded-md  py-1.5 text-white shadow-sm  sm:text-sm sm:leading-6"
                            disabled
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-6 blur-sm ">
                        <label htmlFor="photo" className="block text-sm font-medium leading-6 text-white flex">
                          Photo  (Experimental)
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
                              className="pointer-events-none block rounded-md bg-neutral py-2 px-3 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-slate-300 cursor:pointer peer-hover:bg-neutral-800 peer-focus:ring-2 peer-focus:ring-blue-600"
                            >
                              <span>Change</span>
                              <span className="sr-only"> user photo</span>
                            </label>
                          </div>

                        </div>
                      </div>

                      <div className="sm:col-span-6">
                        <label htmlFor="description" className="block text-sm font-medium leading-6 text-white">
                          Bio
                        </label>
                        <div className="mt-2">
                          <textarea
                            id="bio"
                            name="bio"
                            rows={4}
                            className="bg-neutral-800 border-none block w-full rounded-md border-0 text-white shadow-sm  placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:py-1.5 sm:text-sm sm:leading-6"
                            defaultValue={''}
                          />
                        </div>
                        <p className="mt-3 text-sm text-white">
                          Brief description for your profile. URLs are hyperlinked.
                        </p>
                      </div>

                      <div className="sm:col-span-6">
                        <label htmlFor="url" className="block text-sm font-medium leading-6 text-white">
                          Github Username
                        </label>
                        <input
                          type="text"
                          onChange={handleInputChange}
                          name="url"
                          id="url"
                          className="mt-2 bg-neutral-800 border-none block w-full rounded-md  py-1.5 text-white shadow-sm  sm:text-sm sm:leading-6"
                        />
                        <label htmlFor="url" className="block mt-0.5 text-xs font-medium leading-6 text-white">
                          Your GitHub link: github.com/{inputText}
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-y-6 pt-8 sm:grid-cols-6 sm:gap-x-6">
                      <div className="sm:col-span-6">
                        <h2 className="text-xl font-medium text-white">Personal Information</h2>
                        <p className="mt-1 text-sm text-white">
                          This information will be displayed publicly so be careful what you share.
                        </p>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="email-address" className="block text-sm font-medium leading-6 text-white">
                          Email address
                        </label>
                        <input
                          type="text"
                          name="email-address"
                          id="email"
                          autoComplete="email"
                          className="mt-2 bg-neutral-800 border-none block w-full rounded-md  py-1.5 text-white shadow-sm  sm:text-sm sm:leading-6"
                          disabled
                        />
                      </div>


                      <div className="sm:col-span-3">
                        <label htmlFor="country" className="block text-sm font-medium leading-6 text-white">
                          Location
                        </label>
                        <select
                          id="location"
                          name="country"
                          autoComplete="country-name"
                          className="mt-2 bg-neutral-800 border-none block w-full rounded-md  py-1.5 text-white shadow-sm  sm:text-sm sm:leading-6"
                        >
                          <option />
                          <option>North America</option>
                          <option>South America</option>
                          <option>Europe</option>
                          <option>Africa</option>
                          <option>Asia</option>
                          <option>Oceania</option>
                          <option>Antarctica</option>
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
        )

      }


      {
        security && (
          <div id="security" className="">
            <div className='flex max-w-6xl mx-auto'>
              <div className="  text-gray-900 flex-none mt-10 border-r pr-10 pl-10" style={{ borderColor: "#212121" }}>
                <ul className="py-2 mr-2">
                  <li className="py-1"><a href="../settings" className="px-2 py-2 text-white  font-medium text-lg"> General</a></li>
                  <li className="py-1 "><a href="../settings?loc=security" className="px-2 py-1  text-white hover:text-gray-400 font-medium text-lg">Security</a></li>
                  <li className="py-1 "><a href="../settings?loc=preferences" className="px-2 py-1  text-white hover:text-gray-400 font-medium text-lg">Email Preferences</a></li>


                </ul>
              </div>


              <div className="flex-1 xl:overflow-y-auto">
                <div className="mx-auto max-w-3xl py-10 px-4 sm:px-6 lg:py-12 lg:px-8">
                  <h1 className="text-3xl font-bold tracking-tight text-white">Security</h1>

                  <div className="mt-6 space-y-8 ">
                    <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6 flex" >
                      <div className="sm:col-span-6">
                        <h2 className="text-xl font-medium text-white">Password Management</h2>
                        <p className="mt-1 text-sm text-white">
                          Change your password
                        </p>
                      </div>


                      <div className="sm:col-span-3">
                        <label htmlFor="" className="block text-sm font-medium leading-6 text-white">
                          New Password
                        </label>
                        <input
                          type="password"
                          name="password"
                          id="password"
                          autoComplete="given-name"
                          className="bg-neutral-800 border-none mt-2 block w-full rounded-md  py-1.5 text-white shadow-sm  sm:text-sm sm:leading-6"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-white">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          name="confirm-password"
                          id="confirm-password"
                          autoComplete="family-name"
                          className="bg-neutral-800 border-none mt-2 block w-full rounded-md  py-1.5 text-white shadow-sm  sm:text-sm sm:leading-6"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="" className="block text-sm font-medium leading-6 text-white">
                          Current Password
                        </label>
                        <input
                          type="password"
                          name="password"
                          id="oldPassword"
                          autoComplete="given-name"
                          className="bg-neutral-800 border-none mt-2 block w-full rounded-md  py-1.5 text-white shadow-sm  sm:text-sm sm:leading-6"
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


      {
        preferences && (
          <div id="preferences" className="">
            <div className='flex max-w-6xl mx-auto'>
              <div className="  text-white flex-none mt-10 border-r list-none pr-10 pl-10" style={{ borderColor: "#212121" }}>
                <ul className="py-2 mr-2 list-none">
                  <li className="py-1"><a href="../settings" className="px-2 py-2 text-white  font-medium text-lg"> General</a></li>
                  <li className="py-1 "><a href="../settings?loc=security" className="px-2 py-1  text-white hover:text-gray-400 font-medium text-lg">Security</a></li>
                  <li className="py-1 "><a href="../settings?loc=preferences" className="px-2 py-1  text-white hover:text-gray-400 font-medium text-lg">Email Preferences</a></li>


                </ul>
              </div>


              <div className="flex-1 xl:overflow-y-auto">
                <div className="mx-auto max-w-3xl py-10 px-4 sm:px-6 lg:py-12 lg:px-8">
                  <h1 className="text-3xl font-bold tracking-tight text-white">Email Preferences</h1>

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
                            <label htmlFor="comments" className="font-medium text-white">
                              Friend Requests
                            </label>
                            <p id="comments-description" className="text-neutral-400">
                              Get notified when someones accepts or sends you a friend request.
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
                            <label htmlFor="candidates" className="font-medium text-white">
                              Creator Notifications
                            </label>
                            <p id="candidates-description" className="text-neutral-400">
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
  )
}
