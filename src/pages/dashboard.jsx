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
import Upgrade from '@/components/nav/Upgrade';
import { useRouter } from 'next/router';
import { CheckIcon } from '@heroicons/react/20/solid';

const includedFeatures = [
  'Priority machine access',
  'Machines with GUI',
  'Access to more operating systems',
  'Longer machine times',
  'CTFGuide Pro flair on your profile, comments, and created content'

]
export default function Dashboard() {

  const [likes, setLikes] = useState(null);
  const [badges, setbadges] = useState([]);
  const [challenges, setchallenges] = useState([]);
  const [objectives, setObjectives] = useState(null);
  const [activities, setActivities] = useState([]);
  const [popular, setPopular] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [role, setRole] = useState(false);
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

    const fetchAccountDetails = async() => {
      request(`${process.env.NEXT_PUBLIC_API_URL}/account`, 'GET', null)
        .then((data) => {
          
          setRole(data.role);
        })
        .catch((err) => {
          console.log(err);
        });
    }


    fetchRecommendedChallenges();
    fetchPopularChallenges();
    fetchAccountDetails();
    request(`${process.env.NEXT_PUBLIC_API_URL}/activityFeed/`, 'GET', null).then(response => {
      console.log(response)
      setActivities(response.activityFeed);
    })
    .catch(error => {
      console.error('Error fetching feed data: ', error);
    });
    const intervalId = setInterval(() => {
      request(`${process.env.NEXT_PUBLIC_API_URL}/activityFeed/`, 'GET', null).then(response => {
        //console.log(response)
        if (response.activityFeed.length > 0) {
          setActivities(response.activityFeed);
        }
      })
      .catch(error => {
        console.error('Error fetching feed data: ', error);
      });
    }, 5000); // 5000 milliseconds = 5 seconds
  
    return () => clearInterval(intervalId); //

  }, []);

  useEffect(() => {
 
    setShowOnboarding(false);
  }, []);

  const handleHideOnboarding = () => {
    setShowOnboarding(false);
 //   localStorage.setItem('showOnboarding', JSON.stringify(false));
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

     

      <div className='flex flex-col min-h-screen'>
        <StandardNav />
        <DashboardHeader />
        <main className="animate__animated animate__fadeIn">
          <div className="flex flex-col lg:flex-row md:mt-8 lg:mt-8 items-start p-4 mx-auto gap-4 max-w-7xl text-neutral-50">
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
                          <a href="/tutorials/welcome-to-ctfguide" className='bg-white hover:bg-neutral-200 cursor-pointer text-blue-500 font-bold text-xs px-2 py-0.5 rounded'>Start Tutorial</a>
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
              {  role == "USER" &&
              <div className='mb-10'>
              <h1 className='text-2xl  text-neutral-100 tracking-wide font-semibold mb-4'>
                  Sponsor Messaging
                </h1>
    <div 
        class='break-inside relative overflow-hidden flex flex-col justify-between space-y-2 text-sm rounded-xl max-w-[23rem] p-4 pb-9 mb-4 bg-blue-800 text-white cursor-pointer' 
        onClick={() => setShowUpgradeModal(true)}
    >
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
</div>
}
     <h1 className='text-2xl text-neutral-100 tracking-wide font-semibold  mb-4'>
                 Connect with CTFGuide
                </h1>
    <div class='break-inside relative overflow-hidden flex flex-col justify-between  text-sm rounded-xl max-w-[23rem] px-6 py-4 mb-4 bg-indigo-800 text-white'>
       
    <a href="https://discord.gg/q3hgRBvgkX" target="_blank" rel="noopener noreferrer">
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
               <a href='https://x.com/intent/user?screen_name=ctfguideapp' target="_blank" rel="noopener noreferrer" class="inline-flex  text-center mx-auto items-center bg-white px-2 rounded-lg text-black  font-bold py-1 hover:underline">
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

                {showUpgradeModal &&    <div className={`fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-50 ${open ? '' : 'hidden'}`}>
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
         
    </>
  );
}
