import Head from 'next/head'

import { Footer } from '@/components/Footer'

import { StandardNav } from '@/components/StandardNav'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { Stats } from '@/components/dashboard/Stats'
import { Developer } from '@/components/dashboard/Developer'
import { Performance } from '@/components/dashboard/Performance'
import { useEffect } from 'react'
import { Friends } from '@/components/dashboard/Friends'
import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";


export default function Dashboard() {
  const [inputText, setInputText] = useState("");

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const [open, setOpen] = useState(true)
  var pfpString = ""
  var pfpChanged = false;

  useEffect(() => {
    loadGeneral() 
    const fileInput = document.getElementById('fileInput');

  
  }, []);

  function pfpChange() {
    pfpChanged = true;
  }

 

  
  function loadGeneral() {


    var xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", function() {
      if(this.readyState === 4) {

        console.log(this.responseText)
        document.getElementById("first-name").value = JSON.parse(this.responseText).firstName;
        document.getElementById("last-name").value = JSON.parse(this.responseText).lastName;
        document.getElementById("bio").value = JSON.parse(this.responseText).bio;
        document.getElementById("url").value = JSON.parse(this.responseText).githubUrl;
        document.getElementById("location").value = JSON.parse(this.responseText).location;
        document.getElementById("username").value = JSON.parse(this.responseText).username;
        document.getElementById("email").value = JSON.parse(this.responseText).email;

        if (pfpString == "") {

        } else {
          document.getElementById("pfp").src = pfpString;
        }

        if (JSON.parse(this.responseText).profileImage == "") {
          document.getElementById("pfp").src = `https://robohash.org/${document.getElementById("username").value}.png?set=set1&size=150x150`
        } else {
          document.getElementById("pfp").src = JSON.parse(this.responseText).profileImage;
        }


      }
    });

    xhr.open("GET", "http://localhost:3001/account");
    xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("idToken"));

    xhr.send();

  }

  function saveGeneral() {
    document.getElementById("save").innerHTML = "Saving..."

    if (pfpChanged) {
      var xhr = new XMLHttpRequest();
      xhr.addEventListener("readystatechange", function() {
        if(this.readyState === 4) {
  
            const file = document.getElementById('fileInput').files[0];
            const storage = getStorage();
            const storageRef = ref(storage,  JSON.parse(this.responseText).email + "/pictures/" + "pfp")
  
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

                xhr.addEventListener("readystatechange", function() {
                  if(this.readyState === 4) {
                    console.log(this.responseText);
                    document.getElementById("save").innerHTML = "Save"

                  }
                });
                
                xhr.open("PUT", `${NEXT_PUBLIC_API_URL}/account`);
                xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("idToken"));
                xhr.setRequestHeader("Content-Type", "application/json");
                
                xhr.send(data);

              });
            });
  
  
        } 
      });
  
      xhr.open("GET", "http://localhost:3001/account");
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

      xhr.addEventListener("readystatechange", function() {
        if(this.readyState === 4) {
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






<div className='flex max-w-6xl mx-auto'>
      <div className="  text-gray-900 flex-none mt-10 border-r pr-10 pl-10" style={{ borderColor: "#212121" }}>
            <ul className="py-2 mr-2">
              <li className="py-1"><a href="../dashboard" className="px-2 py-2 text-white  font-medium text-lg"> General</a></li>
              <li className="py-1 "><a href="../dashboard/likes" className="px-2 py-1  text-white hover:text-gray-400 font-medium text-lg">Security</a></li>
              <li className="py-1 "><a href="../dashboard/likes" className="px-2 py-1  text-white hover:text-gray-400 font-medium text-lg">Email Preferences</a></li>


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

                        <div className="sm:col-span-6">
                          <label htmlFor="photo" className="block text-sm font-medium leading-6 text-white">
                            Photo
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
                            name="url"
                            id="url"
                            className="mt-2 bg-neutral-800 border-none block w-full rounded-md  py-1.5 text-white shadow-sm  sm:text-sm sm:leading-6"
                            />
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
                            Country
                          </label>
                          <select
                            id="location"
                            name="country"
                            autoComplete="country-name"
                            className="mt-2 bg-neutral-800 border-none block w-full rounded-md  py-1.5 text-white shadow-sm  sm:text-sm sm:leading-6"
                            >
                            <option />
                            <option>United States</option>
                            <option>Canada</option>
                            <option>Mexico</option>
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
            


      <Footer />
    </>
  )
}
