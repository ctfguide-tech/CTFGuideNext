import Head from 'next/head';
import { Footer } from '@/components/Footer';
import { StandardNav } from '@/components/StandardNav';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { ArrowLeftIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import request from '@/utils/request';
import ChallengeCard from '@/components/profile/ChallengeCard';
import { BoltIcon, RocketLaunchIcon, TrophyIcon } from '@heroicons/react/20/solid';
import Skeleton from 'react-loading-skeleton';

export default function Dashboard() {

  const [likes, setLikes] = useState(null);
  const [badges, setbadges] = useState([]);
  const [challenges, setchallenges] = useState([]);
  const [objectives, setObjectives] = useState(null);
  const [activities, setActivities] = useState([]);
  const [popular, setPopular] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);

  const exampleObjectives = [
    {
      completed: false,
      description: "Touch grass",
    },
    {
      completed: true,
      description: "Eat McDonalds",
    },
  ]

  useEffect(() => {
    const user = localStorage.getItem('username');
    // verify id token if not logout
    const fetchBadges = async () => {
      try {
        const response = await fetch(
          `${localStorage.getItem('userBadgesUrl')}`
        );
        const data = await response.json();
        setbadges(data);
      } catch { }
    };
    fetchBadges();
    setbadges([]);

    const fetchChallenges = async () => {
      try {
        const pinnedChallengeEndPoint = process.env.NEXT_PUBLIC_API_URL + '/users/' + user + '/likes';
        const pinnedChallengeResult = await request(pinnedChallengeEndPoint, "GET", null);
        setchallenges(pinnedChallengeResult);
      } catch (error) { }
    };
    fetchChallenges();
    setchallenges([]);

    const fetchData = async () => {
      try {
        const pinnedChallengeEndPoint = process.env.NEXT_PUBLIC_API_URL + '/users/' + user + '/likes';
        const pinnedChallengeResult = await request(pinnedChallengeEndPoint, "GET", null);
    //    setLikes(pinnedChallengeResult);
      } catch (error) {
        console.error("Failed to fetch pinnedChallengeResults: ", error)
      }
    };
    fetchData();

    const fetchObjectives = async () => {
      try {
        setTimeout(() => setObjectives(exampleObjectives), 500);
      } catch (error) {
        console.error('Failed to fetch objectives: ', error);
      }
    }
    fetchObjectives();

    const fetchRecommendedChallenges = async () => {
      setLoading(true);
      try {
        const response = await request(`${process.env.NEXT_PUBLIC_API_URL}/challenges/dash/recommended`, 'GET', null);
        setLikes(response); // Assuming the response directly contains the array of challenges
      } catch (error) {
        console.error('Failed to fetch recommended challenges: ', error);
      } finally {
        setLoading(false);
      }
    };


    const fetchPopularChallenges = async () => {
      setLoading(true);
      try {
        const response = await request(`${process.env.NEXT_PUBLIC_API_URL}/challenges/dash/popular`, 'GET', null);
        setPopular(response); // Assuming the response directly contains the array of challenges
      } catch (error) {
        console.error('Failed to fetch recommended challenges: ', error);
      } finally {
        setLoading(false);
      }
    };


    fetchRecommendedChallenges();
    fetchPopularChallenges();
    request(`${process.env.NEXT_PUBLIC_API_URL}/activityFeed/`, 'GET', null).then(response => {
      console.log(response)
      setActivities(response.activityFeed);
    })
    .catch(error => {
      console.error('Error fetching feed data: ', error);
    });
    const intervalId = setInterval(() => {
      request(`${process.env.NEXT_PUBLIC_API_URL}/activityFeed/`, 'GET', null).then(response => {
        console.log(response)
        setActivities(response.activityFeed);
      })
      .catch(error => {
        console.error('Error fetching feed data: ', error);
      });
    }, 5000); // 5000 milliseconds = 5 seconds
  
    return () => clearInterval(intervalId); //

  }, []);

  useEffect(() => {
    const onboardingState = localStorage.getItem('showOnboarding');
    if (onboardingState !== null) {
      setShowOnboarding(JSON.parse(onboardingState));
    }
  }, []);

  const handleHideOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('showOnboarding', JSON.stringify(false));
  };

  return (
    <>
      <Head>
        <title>Dashboard - CTFGuide</title>
        <meta
          name="description"
          content="Cybersecurity made easy for everyone"
        />
        <style>
          @import
          url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
        </style>
      </Head>

      <div className="hidden fixed z-50 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">

          <div className="fixed inset-0 transition-opacity">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>

          <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;

          <div className="inline-block align-bottom bg-neutral-900 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
            <div>
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-5">
                <h3 className="text-lg leading-6 font-medium text-white">
                  Mobile Device Warning
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-white">
                    We regret to inform you that CTFGuide is not optimized for use on mobile devices. While you can still access our website on your phone or tablet, we strongly recommend using a desktop or laptop computer for the best experience.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-6">
              <button type="button" className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-900 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm">
                Okay
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className='flex flex-col min-h-screen'>
        <StandardNav />
        <DashboardHeader />
        <main className="animate__animated animate__fadeIn">
          <div className="flex flex-col lg:flex-row mt-8 items-start p-4 mx-auto gap-4 max-w-7xl text-neutral-50">
            <div className='w-full'>
              {showOnboarding && (
                <div className='w-full p-4'>
                  <h1 className='text-2xl font-semibold flex align-middle'>
                    Onboarding 
                    <span 
                      className='ml-auto text-neutral-700 text-sm cursor-pointer' 
                      onClick={handleHideOnboarding}
                    >
                      Hide
                    </span>
                  </h1>
                  <p className='text-lg mb-6'>Looks like you're new around here. These tutorials will help you get started. You'll even get a sweet badge for completing them!</p>
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='bg-neutral-8000 border border-neutral-700'>
                      <div className='relative'>
                        <img src="../welcomeBanner.svg" className='w-full h-28 object-cover banner-image'></img>
                        <div className='absolute bottom-2 right-2'>
                          <button className='bg-white text-blue-500 font-bold text-xs px-2 py-0.5 rounded'>Start Tutorial</button>
                        </div>
                      </div>
                    </div>
                    <div className='bg-neutral-800 border border-neutral-700'>
                      <div className='relative'>
                        <img src="../gettingStartedBanner.svg" className='w-full h-28 object-cover banner-image'></img>
                        <div className='absolute bottom-2 right-2'>
                          <button className='bg-white text-orange-400 font-bold text-xs px-2 py-0.5 rounded'>Start Tutorial</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className='w-full p-4'>
                <h1 className='text-2xl mb-6 font-semibold'>Recommended Challenges</h1>
                <div className='flex flex-col md:flex-row lg:flex-col xl:flex-row justify-between gap-4 w-full'>
                  {loading ? <><ChallengeCard /><ChallengeCard /></> : (
                    likes?.length > 0 ?
                      likes.map((challenge, index) => <ChallengeCard challenge={challenge} />)
                      : <><ChallengeCard /><ChallengeCard /></>
                  )}
                </div>
              </div>

              <div className='w-full rounded-sm'>
                <div className='w-full p-4'>
                  <h1 className='text-2xl mb-3 font-semibold'>Popular Challenges</h1>
                  <div className='flex flex-col md:flex-row lg:flex-col xl:flex-row justify-between gap-4 w-full'>
                  {loading ? <><ChallengeCard /><ChallengeCard /></> : (
                      popular?.length > 0 ?
                        popular.map((challenge, index) => <ChallengeCard challenge={challenge} />)
                        : <><ChallengeCard /><ChallengeCard /></>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className='relative flex flex-col lg:w-[400px]  rounded-md shrink-0 gap-6'>
         
              <div  className='flex flex-col p-6 rounded-sm w-full hidden' >
                <h1 className='text-2xl text-neutral-100 tracking-wide font-semibold mb-4'>
                  <TrophyIcon className='w-10 my-auto mr-4 inline-flex' />
                  Daily Objectives
                </h1>
                <div className=' mb-4'></div>
                <ul className='list-none grid grid-cols-[2.5rem,1fr] gap-y-2'>
                  {objectives &&
                    objectives.map((objective) =>
                      <div>
                        {objective.completed && <CheckCircleIcon className='w-8 text-blue-300'></CheckCircleIcon>
                          || <XCircleIcon className='w-8 text-neutral-300'></XCircleIcon>}
                        <li className={`inline-flex ${objective.completed && 'line-through'} w-full my-auto`}>{objective.description}</li>
                      </div>
                    )
                    || <>
                      <Skeleton containerClassName='col-span-2' className='mb-4' baseColor='#262626' highlightColor='#3a3a3a' count={2} />
                    </>}
                </ul>
              </div>
              <div className='w-full p-4 h-fit relative'>
                <h1 className='text-2xl text-neutral-100 tracking-wide font-semibold mb-4'>
                  Global Feed
                </h1>
                <ul className='flex flex-col gap-4 [&>*]:line-clamp-2'>
             
                {activities && activities.length > 0 ?
  activities.slice().reverse().map((data) =>
    <div className="text-lg">
      <li>
        <a className='text-blue-500 hover:text-blue-600 cursor-pointer font-bold' href={"../users/" + data.userName}>{data.userName}</a> completed 
        <a className='text-yellow-500 hover:text-yellow-600 cursor-pointer' href={"../challenges/" + data.challengeId}> {data.challengeName}</a>
      </li>
    </div>
  ) :
  <>
    <Skeleton containerClassName='col-span-2' className='mb-4' baseColor='#262626' highlightColor='#3a3a3a' count={2} />
  </>
}


                </ul>
              </div>

              <div className='w-full pb-4 pl-4 pr-4 relative'>
              <h1 className='text-2xl text-neutral-100 tracking-wide font-semibold mb-4'>
                  Sponsor Messaging
                </h1>
    <div class='break-inside relative overflow-hidden flex flex-col justify-between space-y-2 text-sm rounded-xl max-w-[23rem] p-4 pb-9 mb-4 bg-blue-800 text-white'>
        <div class='flex flex-row items-center space-x-3 mt-2'>
            <img src="../product.png" width="80" ></img>
            <span class='text-base text-lg mt-2'>Upgrade to CTFGuide Pro today for just <span className="font-semibold">$5/month</span>.</span>
        </div>
        <div class='flex justify-between items-center hidden'>
                    <span></span>
            <button class='flex items-center justify-center text-xs font-medium rounded-full px-4 py-2 space-x-1 bg-white text-black'>
            <span>Upgrade Now</span>
            <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='#000000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>
                <path d='M5 12h13M12 5l7 7-7 7' />
            </svg>
            </button>
        </div>

        
    </div>

     <h1 className='text-2xl text-neutral-100 tracking-wide font-semibold mt-10 mb-4'>
                 Connect with CTFGuide
                </h1>
    <div class='break-inside relative overflow-hidden flex flex-col justify-between  text-sm rounded-xl max-w-[23rem] px-6 py-4 mb-4 bg-indigo-800 text-white'>
       
    <a href="https://discord.gg/q3hgRBvgkX">
          <div class="mr-4 max-w-sm  flex items-center gap-x-8">
            <i class="fab fa-discord  ml-5  h-10 w-10 text-4xl text-white"></i>

            <div>
            <h5 class=" text-xl font-semibold tracking-tight text-white">
              Join our Discord!
            </h5>
            <p class="mb-3 font-normal text-white">
              Talk to other CTF players and get help with challenges!
            </p>
            <p class="inline-flex  text-center mx-auto items-center bg-white px-2 rounded-lg text-indigo-500 font-bold py-1 hover:underline">
              Invite Link
              <svg
                class="ml-2 h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path>
              </svg>
            </p>
            </div>
          </div>
        </a>

        </div>


        <div class='break-inside relative overflow-hidden flex flex-col justify-between  text-sm rounded-xl max-w-[23rem] px-6 py-4 mb-4 bg-black border border-white/10 text-white'>
       
       <div>
             <div class="mr-4 max-w-sm  flex items-center gap-x-6">
           
               <svg className='ml-5' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="100" ><path fill="white" d="M 5.9199219 6 L 20.582031 27.375 L 6.2304688 44 L 9.4101562 44 L 21.986328 29.421875 L 31.986328 44 L 44 44 L 28.681641 21.669922 L 42.199219 6 L 39.029297 6 L 27.275391 19.617188 L 17.933594 6 L 5.9199219 6 z M 9.7167969 8 L 16.880859 8 L 40.203125 42 L 33.039062 42 L 9.7167969 8 z"/></svg>
               <div>
               <h5 class=" text-xl font-semibold tracking-tight text-white">
                 Follow us on X!
               </h5>
               <p class="mb-3 font-normal text-white">
                 Stay updated with the latest CTFGuide news and updates!
               </p>
               <a href='https://x.com/intent/user?screen_name=ctfguideapp' class="inline-flex  text-center mx-auto items-center bg-white px-2 rounded-lg text-black  font-bold py-1 hover:underline">
                 Follow @ctfguideapp
                 <svg
                   class="ml-2 h-5 w-5"
                   fill="currentColor"
                   viewBox="0 0 20 20"
                   xmlns="http://www.w3.org/2000/svg"
                 >
                   <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
                   <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path>
                 </svg>
               </a>
          
               </div>
               </div>
            
             </div>
       
   
           </div>
          
             </div>


            </div>
          </div >
        </main >
        <div className='flex w-full h-full grow basis-0'></div>
        <Footer />
      </div >
    </>
  );
}