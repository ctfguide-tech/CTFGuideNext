
import React from 'react'
import { useState } from 'react';
import { Transition, Dialog } from '@headlessui/react';
import { Fragment } from 'react';
import { Locations } from '@/components/settingComponents/locations';
import { useRouter } from 'next/router';
import { getCookie } from '@/utils/request';
import { useEffect } from 'react';
import  request  from '@/utils/request';
import {Context} from '@/context';
import { useContext } from 'react';

export default function General() {
  
  const {profilePic} = useContext(Context);
  
  const [unsavedNotif, setOpenBio] = useState(false);
  const [banner, bannerState] = useState(false);

  const [bio, setBio] = useState(null);

  const [firstName, setFname] = useState(null);
  const [lastName, setLname] = useState(null);
  const [githubLink, setGithub] = useState(null);


function closeUnsavedNotif() {
    bannerState(false);
}
  const [inputText, setInputText] = useState('');
  
  const user = {};

 
  const router = useRouter();

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);


  const handleInputChange = (event) => {
    setInputText(event.target.value);
    if (event.target.value !== '') {
      bannerState(true);
    } else {
      bannerState(false)
    }
  };
  const [pfp, setPfp] = useState(`https://robohash.org/KshitijIsCool.png?set=set1&size=150x150`);
  const [open, setOpen] = useState(true);


  function pfpChange() {
    pfpChanged = true;
    
  }

  const handlePopupOpen = () => {
    setIsPopupOpen(true);
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

    setPfp(URL.createObjectURL(selectedImage));

    // upload to firebase storage
    try {

      profilePic.setProfilePic(URL.createObjectURL(selectedImage))
      setIsPopupOpen(false);

    } catch (err) {
      console.log(err);
      console.log("An error occured while uploading profile picture");
    }
  }

  const handleClick = () => { }



  async function saveInformation() {
    setBio(document.getElementById('bio').value);
    setFname(document.getElementById('first-name').value);
    setLname(document.getElementById('last-name').value);
    
    var body = {
        bio: document.getElementById('bio').value,
        firstName: document.getElementById('first-name').value,
        lastName: document.getElementById('last-name').value
    };
    const data = await request(
       `${process.env.NEXT_PUBLIC_API_URL}/account`,
        'PUT',
         body
    ).then((response) => {
      console.log(response)
      document.getElementById('save').innerHTML = 'Save';

    });
    if (!data) {
        console.log('Failed to save');
    }
    setBio(body.bio);
    setFname(body.firstName);
    setLname(body.lastName);
    console.log( document.getElementById('bio').value)
}
   async function saveGeneral() {
    document.getElementById('save').innerHTML = 'Saving...';

    var github = document.getElementById('url').value;
    var location = document.getElementById('location').value;

    var data = JSON.stringify({
      githubUrl: github,
      location: location,
    });

    var xhr = new XMLHttpRequest();

    xhr.addEventListener('readystatechange', function () {
      if (this.readyState === 4) {
        console.log(this.responseText);
        document.getElementById('save').innerHTML = 'Save';
      }
    });

    

    saveInformation();
    closeUnsavedNotif();


  }

  return (
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
                onChange={handleInputChange}

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
                onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                id="url"
                onChange={handleInputChange}
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

            {/* LOCATION OPTIONS */}
            <div className="sm:col-span-3">
              <label
                htmlFor="country"
                className="block text-sm font-medium leading-6 text-white"
              >
                Location
              </label>
              <Locations id="location" />
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
                                    id='profilePicture'
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

      {banner && (
                <div
                    style={{ backgroundColor: '#212121' }}
                    id="savebanner"
                    className="fixed inset-x-0 bottom-0 flex flex-col justify-between gap-x-8 gap-y-4 p-6 ring-1 ring-gray-900/10 md:flex-row md:items-center lg:px-8"
                    hidden={!unsavedNotif}
                >
                    <p className="max-w-4xl text-2xl leading-6 text-white">
                        You have unsaved changes.
                    </p>
                    <div className="flex flex-none items-center gap-x-5">
                       
                        <button
                            onClick={closeUnsavedNotif}
                            type="button"
                            className="text-xl font-semibold leading-6 text-white"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
    </div>

    
  );
}
