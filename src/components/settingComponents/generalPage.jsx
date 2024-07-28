import React, { useState, useEffect, useRef } from 'react';
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
import Markdown from 'react-markdown';
import { Context } from '@/context';
import { useContext } from 'react';
import { CheckIcon } from '@heroicons/react/20/solid';


export default function General() {
  const router = useRouter();
  const bioRef = useRef(null);
  const { role } = useContext(Context);
  const includedFeatures = [
    'Priority machine access',
    'Machines with GUI',
    'Access to more operating systems',
    'Longer machine times',
    'CTFGuide Pro flair on your profile, comments, and created content'

  ]
  const [isBannerPopupOpen, setIsBannerPopupOpen] = useState(false);
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
  const [tempBio, setTempBio] = useState(bio);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showBioPreview, setShowBioPreview] = useState(false);
  const [banner, setBanner] = useState(
    'https://images.unsplash.com/photo-1633259584604-afdc243122ea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80&quote'
  );

  const insertText = (text) => {
    const textarea = bioRef.current;
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const newValue =
      textarea.value.substring(0, startPos) +
      text +
      textarea.value.substring(endPos, textarea.value.length);
    setTempBio(newValue);
    textarea.focus();
    textarea.selectionEnd = startPos + text.length;
  };

  const magicSnippet = () => {
    const id = Math.random().toString(36).substring(7);
    insertText(`[Click to run: ${id}](https://ctfguide.com/magic/)`);
  };

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
      console.log(e);
    }
  };

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handlePopupOpen = () => {
    setIsPopupOpen(true);
  };

  const handleBannerPopupOpen = () => {
    setIsBannerPopupOpen(true);
  };

  const handleBannerChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file); // Ensure selectedImage is set for banner as well
    setImageUrl(URL.createObjectURL(file));
    setBanner(URL.createObjectURL(file)); // Set the banner URL
    setIsBannerPopupOpen(true); // Open the banner popup
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await request(
          `${process.env.NEXT_PUBLIC_API_URL}/account`,
          'GET',
          null
        );
        const userData = await response;
        console.log('User Data:', userData); // Debugging statement

        // Set the fetched data into the state
        setUserData(userData);
        setUsername(userData.username);
        setInputText(userData.githubUrl || '');
        setFirstName(userData.firstName || '');
        setLastName(userData.lastName || '');
        setBio(userData.bio || '');
        setTempBio(userData.bio || '');
        setLocation(userData.location || '');
        setBanner(userData.bannerImage || 'https://images.unsplash.com/photo-1633259584604-afdc243122ea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80');

        const endPoint = `${process.env.NEXT_PUBLIC_API_URL}/users/${userData.username}/pfp`;
        const result = await request(endPoint, 'GET', null);
        console.log('Profile Picture Result:', result); // Debugging statement
        if (result) {
          setPfp(result);
        } else {
          setPfp(
            `https://robohash.org/${userData.username}.png?set=set1&size=150x150`
          );
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
      const file = new File([blob], 'profile_picture.png', {
        type: 'image/png',
      });

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


  const handleBannerSaveChanges = async () => {
    setIsSaving(true);


    try {
      const response = await fetch(banner);
      const blob = await response.blob();
      const file = new File([blob], 'banner.png', {
        type: 'image/png',
      });

      const formData = new FormData();
      formData.append('banner', file);

      const endPoint = `${process.env.NEXT_PUBLIC_API_URL}/users/${username}/updateBanner`;
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
        console.log('Banner uploaded successfully');
        setIsSaving(false);
        window.location.reload();
      } else {
        console.log('Failed to upload banner');
        setIsSaving(false);
      }
    } catch (err) {
      console.log('An error occurred while uploading banner', err);
    } finally {
      setIsBannerPopupOpen(false);
    }
  };

  const saveGeneral = async () => {
    setIsSaving(true);

    const data = {
      bio: tempBio || '',
      githubUrl: inputText || '',
      firstName: firstName || '',
      lastName: lastName || '',
      location: location || '',
    };

    try {
      const response = await request(
        `${process.env.NEXT_PUBLIC_API_URL}/account`,
        'PUT',
        data
      );
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
        <h1 className="text-3xl font-bold tracking-tight text-white">
          General
        </h1>

        {isLoading ? (
          <div className="mt-6 space-y-8">
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
              <div className="sm:col-span-6">
                <h2 className="text-xl font-medium text-white">Profile</h2>
                <p className="mt-1 text-sm text-white">
                  This information will be displayed publicly so be careful what
                  you share.
                </p>
              </div>

              <div className="sm:col-span-3">
                <Skeleton
                  height={40}
                  baseColor="#262626"
                  highlightColor="#3a3a3a"
                />
              </div>

              <div className="sm:col-span-3">
                <Skeleton
                  height={40}
                  baseColor="#262626"
                  highlightColor="#3a3a3a"
                />
              </div>

              <div className="sm:col-span-6">
                <Skeleton
                  height={40}
                  baseColor="#262626"
                  highlightColor="#3a3a3a"
                />
              </div>

              <div className="sm:col-span-6">
                <Skeleton
                  height={100}
                  baseColor="#262626"
                  highlightColor="#3a3a3a"
                />
                <p className="mt-3 text-sm text-white">
                  Brief description for your profile. URLs are hyperlinked.
                </p>
              </div>

              <div className="sm:col-span-6">
                <Skeleton
                  height={40}
                  baseColor="#262626"
                  highlightColor="#3a3a3a"
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
                  This information will be displayed publicly so be careful what
                  you share.
                </p>
              </div>

              <div className="sm:col-span-3">
                <Skeleton
                  height={40}
                  baseColor="#262626"
                  highlightColor="#3a3a3a"
                />
              </div>

              <div className="sm:col-span-3">
                <Skeleton
                  height={40}
                  baseColor="#262626"
                  highlightColor="#3a3a3a"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-8">
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
              <div className="sm:col-span-6">
                <h2 className="text-xl font-medium text-white">Profile</h2>
                <p className="mt-1 text-sm text-white">
                  This information will be displayed publicly so be careful what
                  you share.
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
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-2 block w-full rounded-md border-none bg-neutral-800 py-1.5 text-white shadow-sm sm:text-sm sm:leading-6"
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
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-2 block w-full rounded-md border-none bg-neutral-800 py-1.5 text-white shadow-sm sm:text-sm sm:leading-6"
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
                    value={username}
                    className="block w-full rounded-md border-none bg-neutral-800 py-1.5 text-white shadow-sm sm:text-sm sm:leading-6"
                    disabled
                  />
                </div>

              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="photo"
                  className="block flex text-sm font-medium leading-6 text-white"
                >
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
                    className="bg-neutral cursor:pointer ml-4 block rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-neutral-800 peer-focus:ring-2 peer-focus:ring-blue-600"
                  >
                    Change
                  </button>
                </div>
              </div>

              {
                (role === "PRO" || role === 'ADMIN') && (
                  <>
                    <div className="sm:col-span-4">
                      <label
                        htmlFor="photo"
                        className="block flex text-sm font-medium leading-6 text-white"
                      >
                        Banner Picture      <span className=" font-bold text-xs ml-2 bg-gradient-to-br from-amber-600 via-yellow-700 via-75% to-amber-600 py-[-1px] px-2 text-sm"><i className="fas fa-crown fa-fw"></i> Exclusive to Pro</span>

                      </label>
                      <div className="mt-2 flex items-center">
                        {banner && (
                          <img

                            className="h-12 w-full object-cover"
                            id="banner"
                            src={banner || "https://images.unsplash.com/photo-1633259584604-afdc243122ea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"}
                            alt="banner"
                          />

                        )}
                        <input
                          className="hidden"
                          type="file"
                          id="bannerImageInput"
                          onChange={handleBannerChange}
                          accept="image/*"
                        />
                        <button
                          onClick={handleBannerPopupOpen}
                          className="bg-neutral cursor:pointer ml-4 block rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-neutral-800 peer-focus:ring-2 peer-focus:ring-blue-600"
                        >
                          Change
                        </button>
                      </div>
                    </div>

                  </>
                )
              }

              {
                (role !== "PRO" || role !== 'ADMIN') && (
                  <>
                    <div className="sm:col-span-4">
                      <label
                        htmlFor="photo"
                        className="block flex text-sm font-medium leading-6 text-white"
                      >
                        Banner Picture      <span className=" font-bold text-xs ml-2 bg-gradient-to-br from-amber-600 via-yellow-700 via-75% to-amber-600 py-[-1px] px-2 text-sm"><i className="fas fa-crown fa-fw"></i> Exclusive to Pro</span>


                      </label>
                      <div className="mt-2 flex items-center">
                        {banner && (
                          <img

                            className="h-12 w-full object-cover"
                            id="banner"
                            src={banner || "https://images.unsplash.com/photo-1633259584604-afdc243122ea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"}
                            alt="banner"
                          />

                        )}
                        <input
                          className="hidden"
                          type="file"
                          id="bannerImageInput"
                          onChange={handleBannerChange}
                          accept="image/*"
                        />
                        <button
                          onClick={() => setShowUpgradeModal(true)}
                          className="bg-neutral cursor:pointer ml-4 block rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-neutral-800 peer-focus:ring-2 peer-focus:ring-blue-600"
                        >
                          Change
                        </button>
                      </div>
                    </div>

                  </>
                )
              }

              <div className="sm:col-span-6">
                <label
                  htmlFor="description"
                  className="text-md block font-medium leading-6 text-white"
                >
                  Bio
                </label>
                <div className="mt-2">
                  <div className="toolbar flex py-1">
                    <button
                      onClick={() => insertText('**Enter bold here**')}
                      className="toolbar-button mr-1 pr-2 text-white"
                    >
                      <i className="fas fa-bold"></i>
                    </button>
                    <button
                      onClick={() => insertText('*Enter italic here*')}
                      className="toolbar-button mr-1 px-2 text-white"
                    >
                      <i className="fas fa-italic"></i>
                    </button>
                    <button
                      onClick={() => insertText('# Enter Heading here')}
                      className="toolbar-button mr-1 px-2 text-white"
                    >
                      <i className="fas fa-heading"></i>
                    </button>
                    <button
                      onClick={() => insertText('[Name](url)')}
                      className="toolbar-button mr-1 px-2 text-white"
                    >
                      <i className="fas fa-link"></i>
                    </button>
                    <button
                      onClick={() => insertText('```Enter Code here```')}
                      className="toolbar-button mr-1 px-2 text-white"
                    >
                      <i className="fas fa-code"></i>
                    </button>
                    <button
                      onClick={() => magicSnippet()}
                      className="toolbar-button mr-1 px-2 text-white"
                    >
                      <i className="fas fa-terminal"></i>
                    </button>
                    <button
                      onClick={() => setShowBioPreview(!showBioPreview)}
                      className="ml-auto rounded-md text-sm px-2 text-white"
                    >
                      {showBioPreview ? 'Hide Preview' : 'Preview Bio'}
                    </button>
                  </div>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={tempBio}
                    onChange={(e) => setTempBio(e.target.value)}
                    className="block w-full rounded-md border-0 border-none bg-neutral-800 text-white shadow-sm placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:py-1.5 sm:text-sm sm:leading-6"
                    ref={bioRef}
                  />
                </div>
                <p className="text-md mt-3 text-white">
                  Brief description for your profile. URLs are hyperlinked.
                </p>
              </div>


              {showBioPreview && (
                <div className=" sm:col-span-full">
                  <label className="block text-md font-medium leading-6 text-white">
                    Bio Preview
                  </label>
                  <div className="mt-2 rounded-lg bg-neutral-800 p-4 text-white">
                    <Markdown>{tempBio}</Markdown>
                  </div>
                </div>
              )}

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
                  value={inputText}
                  className="mt-2 block w-full rounded-md border-none bg-neutral-800 py-1.5 text-white shadow-sm sm:text-sm sm:leading-6"
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
                  This information will be displayed publicly so be careful what
                  you share.
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
                  value={userData?.email || ''}
                  className="mt-2 block w-full rounded-md border-none bg-neutral-800 py-1.5 text-white shadow-sm sm:text-sm sm:leading-6"
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
                <Locations
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            {/* Profile Picture Popup */}
            <Transition.Root show={isPopupOpen} as={Fragment}>
              <Dialog
                as="div"
                className="fixed inset-0 z-10 overflow-y-auto"
                onClose={handlePopupClose}
              >
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
                <div className="mt-20 flex min-h-screen items-center justify-center px-4 pt-4 text-center sm:block sm:p-0">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-0 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  >
                    <div className="relative inline-block w-full max-w-xl transform overflow-hidden border-t-4 border-blue-500 bg-neutral-800 px-10 pb-10 pb-4 pt-10 pt-5 text-left align-middle shadow-xl transition-all sm:my-8 sm:align-middle">
                      <h1 className="mt-4 text-xl text-white">
                        Upload a profile picture
                      </h1>
                      <p className="mt-2 pb-8 text-sm text-white">
                        Your profile picture will be used as your avatar on the
                        platform. So make sure it's a good representation of
                        you! Make sure your profile picture follows CTFGuide's{' '}
                        <a
                          href="https://ctfguide.com/terms"
                          className="font-semibold text-blue-500"
                        >
                          terms of service
                        </a>
                        .
                      </p>
                      <div className="mx-auto mt-4 w-auto text-center text-white">
                        <label
                          htmlFor="profileImageInput"
                          className="cursor-pointer rounded-md bg-neutral-600 px-3 py-2 text-white"
                        >
                          Choose a file
                        </label>
                      </div>
                      {imageUrl && (
                        <div
                          className="mx-auto mt-4"
                          style={{
                            height: '300px',
                            width: '300px',
                            position: 'relative',
                          }}
                        >
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
                            style={{
                              containerStyle: { height: '100%', width: '100%' },
                            }}
                          />
                        </div>
                      )}
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={handleSaveChanges}
                          className="rounded-md bg-blue-500 px-4 py-2 text-white"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </Transition.Child>
                </div>
              </Dialog>
            </Transition.Root>

            {/* Banner Popup */}

            <Transition.Root show={isBannerPopupOpen} as={Fragment}>
              <Dialog
                as="div"
                className="fixed inset-0 z-10 overflow-y-auto"
                onClose={() => setIsBannerPopupOpen(false)} // Ensure the popup can be closed
              >
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
                    onClick={() => setIsBannerPopupOpen(false)}
                    className="fixed inset-0 bg-neutral-900 bg-opacity-75 transition-opacity"
                  />
                </Transition.Child>
                <div className="mt-20 flex min-h-screen items-center justify-center px-4 pt-4 text-center sm:block sm:p-0">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-0 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  >
                    <div className="relative inline-block w-full max-w-xl transform overflow-hidden border-t-4 border-blue-500 bg-neutral-800 px-10 pb-10 pb-4 pt-10 pt-5 text-left align-middle shadow-xl transition-all sm:my-8 sm:align-middle">
                      <h1 className="mt-4 text-xl text-white">
                        Upload a banner image
                      </h1>
                      <p className="mt-2 pb-8 text-sm text-white">
                        Your banner will replace the default banner on your profile. All images must follow CTFGuide's{' '}
                        <a
                          href="https://ctfguide.com/terms"
                          className="font-semibold text-blue-500"
                        >
                          terms of service
                        </a>
                        .
                      </p>

                      {banner && (
                        <div
                          className="mx-auto mt-4"

                        >
                          <img src={banner} className="h-20 w-full object-cover" alt="banner" />
                        </div>
                      )}

                      <div className="mx-auto mt-4 w-auto text-center text-white">
                        <label
                          htmlFor="bannerImageInput"
                          className={`cursor-pointer rounded-md bg-neutral-600 px-3 py-2 text-white ${banner ? 'cursor-default' : ''}`}
                        >
                          {banner ? 'Choose a different picture' : 'Choose a file'}
                        </label>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={handleBannerSaveChanges}
                          className="rounded-md bg-blue-500 px-4 py-2 text-white"
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
                className="rounded-md bg-blue-500 px-4 py-2 text-white"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}

        {showUpgradeModal && <div className={`fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-50 ${open ? '' : 'hidden'}`}>
          <div className="modal-content  w-full h-full animate__animated  animate__fadeIn">
            <div className="bg-neutral-900 bg-opacity-70  w-full h-full py-24 sm:py-32">
              <div className="mx-auto max-w-7xl px-6 lg:px-8 animate__animated animate__slideInDown">
                <div className="mx-auto max-w-3xl sm:text-center">
                  <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Upgrade to CTFGuide <span className='text-yellow-500'>Pro</span></h2>

                </div>
                <div className="mx-auto mt-10 max-w-2xl rounded-3xl sm:mt-10 lg:mx-0 lg:flex lg:max-w-none bg-neutral-800 border-none">
                  <div className="p-8 sm:p-10 lg:flex-auto">
                    <h3 className="text-2xl font-bold tracking-tight text-white">Monthly Subscription</h3>
                    <p className="mt-6 text-base leading-7 text-white">
                      Enjoy our core features for free and upgrade to get perks like priority access to terminals, custom container images, customization perks, and more!

                    </p>
                    <div className="mt-10 flex items-center gap-x-4">
                      <h4 className="flex-none text-lg font-semibold leading-6 text-blue-600">What's included</h4>
                      <div className="h-px flex-auto bg-gray-100" />
                    </div>
                    <ul
                      role="list"
                      className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-white sm:grid-cols-2 sm:gap-6"
                    >
                      {includedFeatures.map((feature) => (
                        <li key={feature} className="flex gap-x-3">
                          <CheckIcon className="h-6 w-5 flex-none text-blue-600" aria-hidden="true" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <button onClick={() => setShowUpgradeModal(false)} className=" mt-6 px-4 py-1 bg-neutral-900 hover:bg-neutral-700 text-white">
                      No, thanks.
                    </button>
                  </div>

                  <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0 ">
                    <div className="rounded-2xl bg-neutral-850 h-full text-center ring-1 ring-inset ring-gray-900/5 bg-neutral-700 lg:flex lg:flex-col lg:justify-center">
                      <div className="mx-auto max-w-xs px-8">
                        <p className="text-base font-semibold text-white">Billed monthly</p>
                        <p className="mt-6 flex items-baseline justify-center gap-x-2">
                          <span className="text-5xl font-bold tracking-tight text-white">$5</span>
                          <span className="text-sm font-semibold leading-6 tracking-wide text-white">USD</span>
                        </p>
                        <a
                          href="../settings/billing"
                          className="mt-10 block w-full rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                        >
                          Subscribe
                        </a>
                        <p className="mt-6 text-xs leading-5 text-white">
                          Invoices and receipts available for easy company reimbursement
                        </p>



                      </div>


                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>}
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
