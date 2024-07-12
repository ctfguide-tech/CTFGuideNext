
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Transition, Dialog } from '@headlessui/react';
import { Fragment } from 'react';
import { Locations } from '@/components/settingComponents/locations';
import { useRouter } from 'next/router';
import request from '@/utils/request';
import { getCookie } from '@/utils/request';
import Cropper from 'react-easy-crop';
import getCroppedImg from '@/components/cropImage';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function General() {
  const router = useRouter();

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [username, setUsername] = useState('');
  const [inputText, setInputText] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [pfp, setPfp] = useState('');
  const [open, setOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);

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
        console.log('User Data:', userData); // Debugging statement

        // Set the fetched data into the state
        setUserData(userData);
        setUsername(userData.username);
        setInputText(userData.githubUrl || '');
        setFirstName(userData.firstName || '');
        setLastName(userData.lastName || '');
        setBio(userData.bio || '');
        setLocation(userData.location || '');

        const endPoint = `${process.env.NEXT_PUBLIC_API_URL}/users/${userData.username}/pfp`;
        const result = await request(endPoint, 'GET', null);
        console.log('Profile Picture Result:', result); // Debugging statement
        if (result) {
          setPfp(result);
        } else {
          setPfp(`https://robohash.org/${userData.username}.png?set=set1&size=150x150`);
        }
      } catch (err) {
        console.error('Failed to fetch user data', err);
      } finally {
        setIsLoading(false);
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
    setIsSaving(true);

    const data = {
      bio: bio || '',
      githubUrl: inputText || '',
      firstName: firstName || '',
      lastName: lastName || '',
      location: location || '',
    };

    try {
      const response = await request(`${process.env.NEXT_PUBLIC_API_URL}/account`, 'PUT', data);
      console.log(response);
      toast.success('Changes saved successfully!');
    } catch (err) {
      console.error('Failed to save general information', err);
      toast.error('Failed to save changes.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 xl:overflow-y-auto">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <h1 className="text-3xl font-bold tracking-tight text-white">General</h1>

        {isLoading ? (
          <div className="mt-6 space-y-8">
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
              <div className="sm:col-span-6">
                <h2 className="text-xl font-medium text-white">Profile</h2>
                <p className="mt-1 text-sm text-white">
                  This information will be displayed publicly so be careful what you share.
                </p>
              </div>

              <div className="sm:col-span-3">
                <Skeleton height={40} baseColor='#262626' highlightColor='#3a3a3a' />
              </div>

              <div className="sm:col-span-3">
                <Skeleton height={40} baseColor='#262626' highlightColor='#3a3a3a' />
              </div>

              <div className="sm:col-span-6">
                <Skeleton height={40} baseColor='#262626' highlightColor='#3a3a3a' />
              </div>

              <div className="sm:col-span-6">
                <Skeleton height={100} baseColor='#262626' highlightColor='#3a3a3a' />
                <p className="mt-3 text-sm text-white">
                  Brief description for your profile. URLs are hyperlinked.
                </p>
              </div>

              <div className="sm:col-span-6">
                <Skeleton height={40} baseColor='#262626' highlightColor='#3a3a3a' />
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
                <Skeleton height={40} baseColor='#262626' highlightColor='#3a3a3a' />
              </div>

              <div className="sm:col-span-3">
                <Skeleton height={40} baseColor='#262626' highlightColor='#3a3a3a' />
              </div>
            </div>
          </div>
        ) : (
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
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
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
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
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
                    value={username}
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
                  {pfp && (
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
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="block w-full rounded-md border-0 border-none bg-neutral-800 text-white shadow-sm placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:py-1.5 sm:text-sm sm:leading-6"
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
                  value={inputText}
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
                  value={userData?.email || ''}
                  className="mt-2 block w-full rounded-md border-none bg-neutral-800 py-1.5 text-white shadow-sm sm:text-sm sm:leading-6"
                  disabled
                />
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="country" className="block text-sm font-medium leading-6 text-white">
                  Location
                </label>
                <Locations
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
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
                    leaveFrom="opacity-0 translate-y-0 sm:scale-100"
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
                        <label htmlFor="profileImageInput" className="cursor-pointer bg-neutral-600 px-3 py-2 text-white rounded-md">
                          Choose a file
                        </label>
                      </div>
                      {imageUrl && (
                        <div className="mt-4">
                          <Cropper
                            image={imageUrl}
                            crop={crop}
                            rotation={rotation}
                            zoom={zoom}
                            aspect={1}
                            onCropChange={setCrop}
                            onRotationChange={setRotation}
                            onZoomChange={setZoom}
                            onCropComplete={onCropComplete}
                          />
                        </div>
                      )}
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={handleSaveChanges}
                          className="bg-blue-500 px-4 py-2 text-white rounded-md"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </Transition.Child>
                </div>
              </Dialog>
            </Transition.Root>

            <div className="flex justify-end">
              <button
                onClick={saveGeneral}
                className="bg-blue-500 px-4 py-2 text-white rounded-md"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}


