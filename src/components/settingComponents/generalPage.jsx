
import React from 'react'
import { useState } from 'react';
import { Transition, Dialog } from '@headlessui/react';
import { Fragment } from 'react';
import { Locations } from '@/components/settingComponents/locations';
import { useRouter } from 'next/router';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getCookie } from '@/utils/request';
import { useEffect } from 'react';

export default function General(){
  const router = useRouter();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [inputText, setInputText] = useState('');

  const handleInputChange = (event) => {
    setInputText(event.target.value);
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

  const handleClick = () => {}
 
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

    xhr.addEventListener('readystatechange', function() {
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
  
    return(
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

            {/* LOCATION OPTIONS */}
            <div className="sm:col-span-3">  
              <label
                htmlFor="country"
                className="block text-sm font-medium leading-6 text-white"
              >
                Location
              </label>
              <Locations />
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
    );
}
