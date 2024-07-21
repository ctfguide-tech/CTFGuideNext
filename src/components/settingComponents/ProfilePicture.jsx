import React, { useState, useRef, useEffect } from 'react';
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
import ProfilePicture from '@/components/settingComponents/ProfilePicture';

export default function General() {
  const router = useRouter();
  const bioRef = useRef(null);

  const [username, setUsername] = useState('');
  const [inputText, setInputText] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [tempBio, setTempBio] = useState(bio);
  const [showBioPreview, setShowBioPreview] = useState(false);
  const [pfp, setPfp] = useState('');

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
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-md bg-neutral-800 px-3 py-2 text-white"
                  placeholder="First Name"
                />
              </div>

              <div className="sm:col-span-3">
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-md bg-neutral-800 px-3 py-2 text-white"
                  placeholder="Last Name"
                />
              </div>

              <div className="sm:col-span-6">
                <textarea
                  ref={bioRef}
                  value={tempBio}
                  onChange={(e) => setTempBio(e.target.value)}
                  className="w-full rounded-md bg-neutral-800 px-3 py-2 text-white"
                  placeholder="Bio"
                />
                <p className="mt-3 text-sm text-white">
                  Brief description for your profile. URLs are hyperlinked.
                </p>
              </div>

              <div className="sm:col-span-6">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="w-full rounded-md bg-neutral-800 px-3 py-2 text-white"
                  placeholder="Your GitHub link: github.com/"
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
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-md bg-neutral-800 px-3 py-2 text-white"
                  placeholder="Location"
                />
              </div>

              <div className="sm:col-span-3">
                <Locations
                  selectedLocation={location}
                  setSelectedLocation={setLocation}
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={saveGeneral}
                className="rounded-md bg-blue-500 px-4 py-2 text-white"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
