import Head from 'next/head';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import request from "@/utils/request";
import { MarkdownViewer } from '@/components/MarkdownViewer';
import { useRouter } from 'next/router';
import CreatedChallenges from '@/components/profile/v2/CreatedChallenges';
import Badges from '@/components/profile/v2/Badges';

export default function Create() {

    const router = useRouter();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('LIKED CHALLENGES');
    const [isBioExpanded, setIsBioExpanded] = useState(false);

    const toggleBio = () => {
        setIsBioExpanded(!isBioExpanded);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'LIKED CHALLENGES':
                return <h1 className='text-2xl font-bold text-neutral-400'>LIKED CHALLENGES</h1>;
            case 'WRITEUPS':
                return <h1 className='text-2xl font-bold text-neutral-400'>WRITEUPS</h1>;
            case 'CREATED CHALLENGES':
                return <>
                    <h1 className='text-2xl font-bold text-neutral-400'>CREATED CHALLENGES</h1>
                    <CreatedChallenges/>
                    </>
            case 'BADGES':
                return <>
                    <h1 className='text-2xl font-bold text-neutral-400'>BADGES</h1>
                    <Badges/>
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
            })
            .catch((err) => {
                console.log(err);
            });
    }, [router.query.user]);


    return (
        <>
            <Head>
                <title>Create - CTFGuide</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
                </style>
            </Head>
            <StandardNav />

            <main className='max-w-7xl mx-auto mt-10'>

                <div className='text-white text-xl px-10  py-10 w-full bg-neutral-800 flex items-center'>


                    <div className='flex items-center'>
                        
                        {user && (
                            <>
                                <img src={user.profileImage || ''} alt="Profile Image" className='w-20 h-20 rounded-full' />
                                <h1 className='ml-4 text-3xl mr-2 font-bold'>{user.username}</h1>
                            </>
                        )}
                        <div className='ml-4 mr-2 bg-yellow-600 px-4 rounded-full ml-auto text-sm'>
                            <p>
                                pro
                            </p>
                        </div>
                        <div className='ml-4 bg-red-600 px-4 rounded-full ml-auto text-sm'>
                            <p>
                                developer
                            </p>
                        </div>
                    </div>



                    <div className='ml-auto'>
                      
                            {/*followers following*/}
                            <div className=' px-2   ml-auto text-lg flex items-center gap-x-4'>
                                <p>
                                    {user && ( 
                                        <>
                                    <span className='font-bold'> Followers</span> {user.followers || '0'}
                                    <span className='font-bold ml-4'> Following</span> {user.following || '0'}
                                        </>
                                    )}

                                </p>

                                <div className='flex items-center gap-x-2'>
                                <button className='bg-blue-600 px-4 rounded-full ml-auto text-sm'>
                                    <i class="fas fa-user-plus"></i>
                                </button>
                                <button className='bg-red-600 px-4 rounded-full ml-auto text-sm'>
                                    <i class="fas fa-flag"></i>
                                </button>
                                </div>

                            </div>
                        </div>
                    </div>


                    <div className='mt-10 grid grid-cols-6 gap-x-4 gap-y-4 w-full'>
  
                    <div className='col-span-2 bg-neutral-800 px-4 py-4' style={{ height: '400px', overflowY: 'auto' }}>

                        
<h1 className='text-2xl text-neutral-400 font-bold'>ACTIVITY FEED</h1>
                            {user && (
                                <h1 className='mx-auto my-auto text-neutral-600'>Looks like {user.username} hasn't been that active.</h1>
                            )}

</div>
              
             
                        <div className='col-span-4'>

                            <div className='grid grid-cols-1 gap-y-4 '>
                                <div>
                            <div className='pb-2'>
                                <ul className='flex w-full list-none text-neutral-500'>
                                    {['LIKED CHALLENGES', 'WRITEUPS', 'CREATED CHALLENGES', 'BADGES'].map(tab => (
                                        <li
                                            key={tab}
                                            className={`mr-4 cursor-pointer ${activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600 font-semibold' : ''}`}
                                            onClick={() => setActiveTab(tab)}
                                        >
                                            {tab}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                           <div className='bg-neutral-800 px-4 py-4'>

                        
                           {renderContent()}
                           </div>
                           </div>
                           <div className='bg-neutral-800 px-4 py-4'>

                        {user && (
                            <h1 className='text-2xl text-neutral-400 font-bold uppercase'>ABOUT {user.username}</h1>
                            )}

                            <p className='text-neutral-400'>
                                {user && user.bio }
                            </p>
                        
               </div>             
</div>
                        </div>
                        <div className='col-span-2 '>

                                <div className='grid grid-cols-1 gap-y-4'>
                            <div className='bg-neutral-800 px-4 py-4'>
                            <h1 className='text-2xl text-neutral-400 font-bold'>SKILL CHART</h1>
                            {user && (
                                <h1 className='mx-auto my-auto text-neutral-600'>It seems that {user.username} hasn't solved any challenges yet.</h1>
                            )}
                            </div>

                                     <div className='bg-neutral-800 px-4 py-4'>
                            <h1 className='text-2xl text-neutral-400 font-bold'>NERD STATS</h1>
                            {user && (
                              <div className='text-white text-sm'>
                                    <p>Account Created Date : {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', minute:'numeric', hour:'numeric'})}</p>
                                    <p>Total Challenges: {user.totalChallenges || '0'}</p>
                                    <p>Total Writeups: {user.totalWriteups || '0'}</p>
                                    <p>Total Badges: {user.totalBadges || '0'}</p>
                                </div>
                            )}
                            </div>
                            </div>

                        </div>


                 
                    </div>

            </main>





            <div className=' flex w-full h-full grow basis-0'></div>
            <Footer />
        </>
    );
}

