import Head from 'next/head';
import { useState, useEffect, useRef} from 'react';
import dynamic from 'next/dynamic';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import request from "@/utils/request";
import { MarkdownViewer } from '@/components/MarkdownViewer';
import { useRouter } from 'next/router';
import CreatedChallenges from '@/components/profile/v2/CreatedChallenges';
import LikedChallenges from '@/components/profile/v2/LikedChallenges';
import Badges from '@/components/profile/v2/Badges';
import Writeups from '@/components/profile/v2/Writeups';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import ActivityCalendar from 'react-activity-calendar';
import Markdown from 'react-markdown';


const mockActivityData = [
    { date: '2024-01-01', count: 1, level: 4 },
    { date: '2024-01-02', count: 0, level: 4 },
    { date: '2024-01-03', count: 0, level: 4 },
    { date: '2024-02-01', count: 0, level: 4 },
    { date: '2024-02-02', count: 0, level: 4 },
    { date: '2024-02-03', count: 1, level: 4 },
    { date: '2024-03-01', count: 2, level: 3 },
    { date: '2024-03-02', count: 1, level: 2 },
    { date: '2024-03-03', count: 0, level: 1 },
    { date: '2024-04-01', count: 3, level: 4 },
    { date: '2024-04-02', count: 2, level: 3 },
    { date: '2024-04-03', count: 1, level: 2 },
    { date: '2024-05-01', count: 1, level: 2 },
    { date: '2024-06-01', count: 1, level: 2 },
    { date: '2024-07-01', count: 1, level: 2 },
    { date: '2024-08-01', count: 1, level: 2 },
    { date: '2024-09-01', count: 1, level: 2 },
    { date: '2024-10-01', count: 1, level: 2 },
    { date: '2024-11-01', count: 1, level: 2 },
    { date: '2024-12-01', count: 1, level: 2 },
    { date: '2024-12-21', count: 1, level: 2 },

];

export default function Create() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const bioRef = useRef(null);

    const router = useRouter();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('LIKED CHALLENGES');
    const [isBioExpanded, setIsBioExpanded] = useState(false);
    const [followers, setFollowers] = useState(0);
    const [following, setFollowing] = useState(0);
    const [activityData, setActivityData] = useState(mockActivityData);
    const [bio, setBio] = useState(null);
    const [showBioPreview, setShowBioPreview] = useState(false);
    const [tempBio, setTempBio] = useState(null);
    const [unsavedNotif, setOpenBio] = useState(false);
    const [banner, bannerState] = useState(false);
    const [inputText, setInputText] = useState('');
    
    const toggleBio = () => {
        setIsBioExpanded(!isBioExpanded);
    };

    function closeUnsavedNotif() {
        bannerState(false);
    }

    const handleInputChange = (event) => {
        setInputText(event.target.value);
        if (event.target.value !== '') {
          bannerState(true);
        } else {
          bannerState(false)
        }
      };

      const handleBioChange = (event) =>{
        handleInputChange(event);
        setTempBio(event.target.value);
      }

    const renderContent = () => {
        switch (activeTab) {
            case 'LIKED CHALLENGES':
                return <>
                    <h1 className='text-2xl font-bold text-white'>LIKED CHALLENGES</h1>
                    {user != undefined && (
                        <LikedChallenges user={user} />
                    )}
                </>
                    ;
            case 'WRITEUPS':
                return <>
                    <h1 className='text-2xl font-bold text-white'>WRITEUPS</h1>
                    {user && (
                        <Writeups user={user} />
                    )}
                </>
            case 'CREATED CHALLENGES':
                return <>
                    <h1 className='text-2xl font-bold text-white'>CREATED CHALLENGES</h1>
                    <CreatedChallenges />
                </>
            case 'BADGES':
                return <>
                    <h1 className='text-2xl font-bold text-white'>BADGES</h1>
                    <Badges />
                </>
            default:
                return null;
        }
    };

    useEffect(() => {
        request(`${process.env.NEXT_PUBLIC_API_URL}/users/${router.query.user}`, "GET", null)
            .then((data) => {
                console.log(data)
                setUser(data);
                setFollowers(data.followers || 0);
                setFollowing(data.following || 0);
            })
            .catch((err) => {
                console.log(err);
            });
        setTempBio(user && user.bio);
        
        const fetchActivityData = async () => {
            try {
                const response = await request(`${process.env.NEXT_PUBLIC_API_URL}/users/${router.query.user}/activity`, 'GET', null);
                setActivityData(response.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchActivityData();


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
              setTempBio(userData.bio || '');
      
            } catch (err) {
              console.error('Failed to fetch user data', err);
            } 
          };
          fetchUserData();
    }, [router.query.user]);

   
  
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
      console.log( user.bio)
      bannerState(true);
    };
  
    const magicSnippet = () => {
      const id = Math.random().toString(36).substring(7);
      insertText(`[Click to run: ${id}](https://ctfguide.com/magic/)`);
    };
  


    const saveBio = async () => {     
        const data = {
            bio: tempBio || '',
          };
          try {
            const response = await request(
              `${process.env.NEXT_PUBLIC_API_URL}/account`,
              'PUT',
              data
            );
            console.log(response);
          } catch (err) {
            console.error('Failed to save general information', err);
          } 
          closeUnsavedNotif();
    }

    return (
        <>
            <Head>
                <title>{user && user.username}'s Profile - CTFGuide</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
                </style>
            </Head>
            <StandardNav />
            <div>
                <div>
                    <div
                        style={{ backgroundSize: "cover", backgroundImage: 'url("https://images.unsplash.com/photo-1633259584604-afdc243122ea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80")' }}
                        className="h-20 w-full object-cover lg:h-20"
                        alt=""
                    >
                    </div>
                </div>
                <div className="mx-auto max-w-7xl ">
                    <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
                        <div className="flex w-40">
                            <a href='../settings'>
                                {(user && user.profileImage && (
                                    <img
                                        className="rounded-full hover:bg-[#212121] sm:h-32 sm:w-32"
                                        src={user && user.profileImage}
                                        alt=""
                                    />
                                )) || (
                                        <Skeleton
                                            circle={true}
                                            height={128}
                                            width={128}
                                            baseColor='#262626'
                                            highlightColor='#3a3a3a'
                                        />
                                    )}
                            </a>
                        </div>
                        <div className="mt-4 w-full">
                            <div className="">
                                <div className="mt-6 ">
                                    <div className="mt-6  flex w-full">

                                        <div>
                                            <h1 className="mt-8 truncate text-2xl font-bold text-white f">
                                                {user && user.username || (
                                                    <Skeleton baseColor='#262626' highlightColor='#3a3a3a' width='15rem' />
                                                )}
                                            </h1>
                                            <p className="text-white  ">
                                                <i className="fas fa-map-marker-alt mt-2"></i>{' '}
                                                {user && user.location || (
                                                    <Skeleton width='25rem' baseColor='#262626' highlightColor='#3a3a3a' />
                                                )}
                                            </p>
                                        </div>
                                        <div className='ml-auto  flex mt-14'>
                                            <h1 className='text-white mr-2'>Following: {following}</h1>
                                            <h1 className='text-white'>Followers: {followers}</h1>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>



            <main className='max-w-7xl mx-auto mt-10'>
                <div className='mt-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-4 lg:gap-x-4 gap-y-4 ' >
                    <div className='w-full bg-neutral-800 border-t-4 border-blue-600 h-40'>
                        <div className='col-span-2 bg-neutral-800 px-4 pt-4 ' >
                            <h1 className='text-2xl text-white font-bold'>ACTIVITY FEED</h1>
                            {user && (
                                <h1 className='mx-auto my-auto text-neutral-400'>Looks like {user.username} hasn't been that active.</h1>
                            )}
                            <hr className='px-4 border-neutral-700 mt-4'>
                            </hr>
                        </div>

                        <div className='col-span-2 bg-neutral-800 px-4 pt-4 '>
                            <div className='bg-neutral-800'>
                                <h1 className='text-2xl text-white font-bold'>SKILL CHART</h1>
                                {user && (
                                    <h1 className='mx-auto my-auto text-neutral-400'>It seems that {user.username} hasn't solved any challenges yet.</h1>
                                )}
                            </div>
                            <hr className='px-4 border-neutral-700 mt-4'></hr>
                        </div>

                        <div className='bg-neutral-800 gap-y-4 px-4 py-4 h-full' >
                            <h1 className='text-2xl text-white font-bold'>NERD STATS</h1>
                            {user && (
                                <div className='text-neutral-400 text-xs'>
                                    <p>Creation Date : {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', minute: 'numeric', hour: 'numeric' })}</p>
                                    <p>Total Challenges: {user.totalChallenges || '0'}</p>
                                    <p>Total Writeups: {user.totalWriteups || '0'}</p>
                                    <p>Total Badges: {user.totalBadges || '0'}</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className='col-span-3 border-t-4 border-blue-600'>
                        <div className='bg-neutral-800 px-4 py-4'>
                            {user && (
                                <h1 className='text-2xl text-white font-bold uppercase mb-4'>ABOUT {user.username}</h1>
                            )}
                            <p className='text-neutral-400'>
                            {user && <MarkdownViewer content={user.bio} />}
                            </p>
                        </div>
                {showBioPreview && (
                    <div className=" sm:col-span-full">
                    <label className="block text-md font-medium leading-6 text-white mt-1">
                              Bio Editor
                    </label>
                    <div className="mt-2 rounded-lg bg-neutral-800 p-4 text-white">
                        
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
                    
                  </div>
                            <textarea
                                id="bio"
                                name="bio"
                                rows={4}
                                value={tempBio} 
                                onChange={handleBioChange}
                                className="block w-full rounded-md border-0 border-none bg-neutral-800 text-white shadow-sm placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:py-1.5 sm:text-sm sm:leading-6"
                                ref={bioRef}
                                
                           />
                            </div>

                        
                            </div>

                            
                        )}

                        <div className='grid grid-cols-1 gap-y-4 pt-4 '>
                            <div>
                                <div className='pb-2 '>
                                    <ul className='hidden md:flex w-full list-none text-neutral-500'>
                                        {['LIKED CHALLENGES', 'WRITEUPS', 'CREATED CHALLENGES', 'BADGES'].map(tab => (
                                            <li
                                                key={tab}
                                                className={`mr-4 cursor-pointer ${activeTab === tab ? ' border-blue-600 text-blue-600 font-semibold' : ''}`}
                                                onClick={() => setActiveTab(tab)}
                                            >
                                                {tab}
                                            </li>
                                        ))}
                                    </ul>
                                    <select
                                        className='md:hidden w-full border-none px-4 w-1/2 bg-neutral-800 text-neutral-50 rounded'
                                        value={activeTab}
                                        onChange={(e) => setActiveTab(e.target.value)}
                                    >
                                        {['LIKED CHALLENGES', 'WRITEUPS', 'CREATED CHALLENGES', 'BADGES'].map(tab => (
                                            <option key={tab} value={tab}>
                                                {tab}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className='bg-neutral-800 px-4 py-4 border-t-4 border-blue-600'>
                                    {user != undefined && renderContent()}
                                </div>

                                <div className='w-full'>
                                    <div className='text-white'>
                                        <div className='w-full border-t-4 border-blue-600 bg-neutral-800 px-4 py-4 mt-4'>
                                            <h2 className="text-2xl font-bold text-white mb-4">STREAK CHART</h2>
                                            <div className='flex justify-center'>
                                                <ActivityCalendar
                                                    data={mockActivityData}
                                                    showMonthLabels={true} // Ensure month labels are shown
                                                    theme={{
                                                        light: ['#1f1f1f', '#c0d7ff', '#93bfff', '#66a7ff', '#3a8fff'],
                                                        dark: ['#1f1f1f', '#c0d7ff', '#93bfff', '#66a7ff', '#3a8fff'],
                                                        level4: '#3a8fff'
                                                    }}
                                                />      </div>  </div> </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>


            <Footer />

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
                    <button onClick={saveBio} type="button" className="rounded-sm bg-green-700 px-3 py-2 text-xl font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900">
                            Save Changes
                        </button>
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
        </>
    );
}