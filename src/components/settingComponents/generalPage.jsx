
import React, { useState, useEffect, useRef } from 'react';
import { Transition, Dialog } from '@headlessui/react';
import { Fragment } from 'react';
import { Locations } from '@/components/settingComponents/locations';
import { useRouter } from 'next/router';
import request from '@/utils/request';
import { getCookie } from '@/utils/request';
import Cropper from 'react-easy-crop';
import getCroppedImg from '@/components/cropImage';

export default function General() {
  const router = useRouter();

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [username, setUsername] = useState('');
  const [inputText, setInputText] = useState('');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [pfp, setPfp] = useState('');
  const [open, setOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const bioRef = useRef(null);
  const githubRef = useRef(null);
  const locationRef = useRef(null);

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
    showCroppedImage();
  };

  const showCroppedImage = async () => {
    try {
      const croppedImage = await getCroppedImg(
        URL.createObjectURL(selectedImage),
        croppedAreaPixels,
        rotation
      );
      console.log('donee', { croppedImage });
      setCroppedImage(croppedImage);
    } catch (e) {
      console.error(e);
    }
  };

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handlePopupOpen = () => {
    setIsPopupOpen(true);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await request(`${process.env.NEXT_PUBLIC_API_URL}/account`, 'GET', null);
        const userData = await response;
        setUsername(userData.username);

        const endPoint = `${process.env.NEXT_PUBLIC_API_URL}/users/${userData.username}/pfp`;
        const result = await request(endPoint, 'GET', null);
        console.log(result)
        if (result) {
          setPfp(result);
          localStorage.setItem('pfp', result);
        } else {
          setPfp(`https://robohash.org/${userData.username}.png?set=set1&size=150x150`);
        }
      } catch (err) {
        console.error('Failed to fetch user data', err);
      }
    };

    fetchUserData();
  }, []);

  const handlePopupClose = () => {
    setIsPopupOpen(false);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
    setImageUrl(URL.createObjectURL(file));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    if (!croppedImage) {
      console.log('No cropped image available');
      setIsPopupOpen(false);
      return;
    }

    try {
      const response = await fetch(croppedImage);
      const blob = await response.blob();
      const file = new File([blob], 'profile_picture.png', { type: 'image/png' });

      const formData = new FormData();
      formData.append('profilePic', file);

      const endPoint = `${process.env.NEXT_PUBLIC_API_URL}/users/${username}/updatePfp`;
      const uploadResponse = await fetch(endPoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getCookie()}`,
          credentials: 'include',
        },
        body: formData,
      });

      const result = await uploadResponse.json();
      console.log('Here is the result: ', result);

      if (result.success) {
        console.log('Profile picture uploaded successfully');
        setIsSaving(false);
        window.location.reload();
      } else {
        console.log('Failed to upload profile picture');
        setIsSaving(false);
      }
    } catch (err) {
      console.log('An error occurred while uploading profile picture', err);
    } finally {
      setIsPopupOpen(false);
    }
  };

  const saveGeneral = async () => {
    document.getElementById('save').innerHTML = 'Saving...';

    const data = {
      bio: bioRef.current.value,
      githubUrl: githubRef.current.value,
      firstName: firstNameRef.current.value,
      lastName: lastNameRef.current.value,
      location: locationRef.current.value,
    };

    try {
      const response = await request(`${process.env.NEXT_PUBLIC_API_URL}/account`, 'PUT', data);
      console.log(response);
      document.getElementById('save').innerHTML = 'Save';
    } catch (err) {
      console.error('Failed to save general information', err);
      document.getElementById('save').innerHTML = 'Save';
    }
  };

  return (
    <div className="flex-1 xl:overflow-y-auto">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <h1 className="text-3xl font-bold tracking-tight text-white">General</h1>

        <div className="mt-6 space-y-8">
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
                ref={firstNameRef}
                className="mt-2 block w-full rounded-md border-none bg-neutral-800 py-1.5 text-white shadow-sm sm:text-sm sm:leading-6"
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
                ref={lastNameRef}
                className="mt-2 block w-full rounded-md border-none bg-neutral-800 py-1.5 text-white shadow-sm sm:text-sm sm:leading-6"
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
                  className="block w-full rounded-md border-none bg-neutral-800 py-1.5 text-white shadow-sm sm:text-sm sm:leading-6"
                  disabled
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="photo" className="block flex text-sm font-medium leading-6 text-white">
                Profile Picture
              </label>
              <div className="mt-2 flex items-center">
                { pfp && (
                  <img
                    className="inline-block h-12 w-12 rounded-full"
                  id="pfp"
                  src={pfp}
                    alt="photo"
                  />
                )}
                <input
                  className="hidden"
                  type="file"
                  id="profileImageInput"
                  onChange={handleImageChange}
                  accept="image/*"
                />
                <button
                  onClick={handlePopupOpen}
                  className="ml-4 bg-neutral cursor:pointer block rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-neutral-800 peer-focus:ring-2 peer-focus:ring-blue-600"
                >
                  Change
                </button>
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
                  ref={bioRef}
                  className="block w-full rounded-md border-0 border-none bg-neutral-800 text-white shadow-sm placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:py-1.5 sm:text-sm sm:leading-6"
                  defaultValue={'No bio set yet!'}
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
                ref={githubRef}
                className="mt-2 block w-full rounded-md border-none bg-neutral-800 py-1.5 text-white shadow-sm sm:text-sm sm:leading-6"
              />
              <label htmlFor="url" className="mt-0.5 block text-xs font-medium leading-6 text-white">
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
                className="mt-2 block w-full rounded-md border-none bg-neutral-800 py-1.5 text-white shadow-sm sm:text-sm sm:leading-6"
                disabled
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="country" className="block text-sm font-medium leading-6 text-white">
                Location
              </label>
              <Locations ref={locationRef} />
            </div>
          </div>

          <Transition.Root show={isPopupOpen} as={Fragment}>
            <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={handlePopupClose}>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div
                  onClick={() => {
                    handlePopupClose();
                    localStorage.setItem('22-18-update', false);
                  }}
                  className="fixed inset-0 bg-neutral-900 bg-opacity-75 transition-opacity"
                />
              </Transition.Child>
              <div className="flex items-center justify-center min-h-screen pt-4 px-4 text-center sm:block sm:p-0 mt-20">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <div className="max-w-xl relative inline-block align-middle w-full pb-10 pt-10 border-t-4 border-blue-500 bg-neutral-800 px-10 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle">
                    <h1 className="text-white text-xl mt-4">Upload a profile picture</h1>
                    <p className="text-white text-sm mt-2 pb-8">
                      Your profile picture will be used as your avatar on the platform. So make sure it's a good
                      representation of you! Make sure your profile picture follows CTFGuide's{' '}
                      <a href="https://ctfguide.com/terms" className="text-blue-500 font-semibold">
                        terms of service
                      </a>
                      .
                    </p>
                    <div className="mx-auto text-center w-auto text-white mt-4">
                      <label htmlFor="profileImageInput" className="cursor-pointer bg-neutral-600 px-3 py-2 text-white hover:bg-neutral-500">
                        Choose File
                      </label>
                      <input
                        className="hidden"
                        type="file"
                        id="profileImageInput"
                        onChange={handleImageChange}
                        accept="image/*"
                      />
                    </div>
                    <br />
                    <div>
                      <div className="">
                        <div className="w-full h-full bg-white">
                          <div className="hidden controls">
                            <input
                              type="range"
                              value={zoom}
                              min={1}
                              max={3}
                              step={0.1}
                              aria-labelledby="Zoom"
                              onChange={(e) => {
                                setZoom(e.target.value);
                              }}
                              className="zoom-range"
                            />
                          </div>
                        </div>
                        {selectedImage && (
                          <div className="mx-auto flex justify-center items-center">
                            <div className="h-72 w-80 mx-20 relative rounded-lg p-4 text-center flex items-center justify-center">
                              <label>
                                <div>
                                  <img
                                    src={croppedImage}
                                    alt="Selected Profile Picture"
                                    className="mx-auto h-48 w-48 object-cover rounded-full hidden"
                                  />
                                  <Cropper
                                    image={URL.createObjectURL(selectedImage)}
                                    crop={crop}
                                    rotation={rotation}
                                    zoom={zoom}
                                    aspect={4 / 4}
                                    onCropChange={setCrop}
                                    onRotationChange={setRotation}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                  />
                                  <br />
                                  <br />
                                  <br />
                                  <br />
                                  <br />
                                  <br />
                                  <br />
                                </div>
                              </label>
                            </div>
                          </div>
                        )}
                        <div className="flex justify-end mt-4">
                          <div className="flex justify-end">
                            <button className="mx-3 md w-20 text-white py-2 bg-neutral-800 hover:text-neutral-500" onClick={handlePopupClose}>
                              Close
                            </button>
                          </div>
                          <div className="flex items-center justify-start">
                            <button className="mx-3 w-20 text-white py-2 bg-blue-600" onClick={handleSaveChanges}>
                                {isSaving ? <i class="fas fa-spinner fa-spin"></i> : 'Save'}
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
              className="inline-flex justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
