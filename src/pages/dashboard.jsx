import Head from 'next/head';
import { Footer } from '@/components/Footer';
import { StandardNav } from '@/components/StandardNav';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/solid';
import request from '@/utils/request';
import ChallengeCard from '@/components/profile/ChallengeCard';
import {
  BoltIcon,
  RocketLaunchIcon,
  TrophyIcon,
} from '@heroicons/react/20/solid';
import Skeleton from 'react-loading-skeleton';
import Upgrade from '@/components/nav/Upgrade';
import { useRouter } from 'next/router';
import { CheckIcon } from '@heroicons/react/20/solid';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import OnboardingModal from '@/components/modals/OnboardingModal';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import timeTracker from '@/utils/timeTracker';
import Tooltip from '@/components/Tooltip';

const includedFeatures = [
  'Priority machine access',
  'Machines with GUI',
  'Access to more operating systems',
  'Longer machine times',
  'CTFGuide Pro flair on your profile, comments, and created content',
];
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
      description: 'Touch grass',
    },
    {
      completed: true,
      description: 'Eat McDonalds',
    },
  ];
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [completedTasks, setCompletedTasks] = useState(null);
  const [timeProgress, setTimeProgress] = useState(null);
  const [lastNotificationCheck, setLastNotificationCheck] = useState(null);
  const [processedWarningIds, setProcessedWarningIds] = useState(() => {
    // Load processed warnings from localStorage on component mount
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('processedWarningIds');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    }
    return new Set();
  });
  const [isCheckingNotifications, setIsCheckingNotifications] = useState(false);

  // Function to check for new notifications and show alerts
  const checkForNewNotifications = async () => {
    // Prevent multiple simultaneous checks
    if (isCheckingNotifications) {
      console.log('Notification check already in progress, skipping...');
      return;
    }

    setIsCheckingNotifications(true);

    try {
      const response = await request(
        `${process.env.NEXT_PUBLIC_API_URL}/account/notifications`,
        'GET'
      );
      if (response && response.length > 0) {
        // Check for new warning notifications that haven't been processed
        const newWarnings = response.filter(
          (notification) =>
            notification.message &&
            notification.message.includes('warning') &&
            !processedWarningIds.has(notification.id)
        );

        // Only show toast for the most recent new warning that's within the last 5 minutes
        if (newWarnings.length > 0) {
          const latestNewWarning = newWarnings[0];
          const warningTime = new Date(latestNewWarning.createdAt);
          const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000); // 5 minutes ago

          // Only show toast if the warning is recent (within last 5 minutes)
          if (warningTime > fiveMinutesAgo) {
            // Mark this notification as processed BEFORE showing toast
            const newProcessedIds = new Set([
              ...processedWarningIds,
              latestNewWarning.id,
            ]);
            setProcessedWarningIds(newProcessedIds);

            // Save to localStorage immediately
            if (typeof window !== 'undefined') {
              localStorage.setItem(
                'processedWarningIds',
                JSON.stringify([...newProcessedIds])
              );
            }

            // Show custom notification for warning (only once for recent warnings)
            showCustomNotification(latestNewWarning.message, 8000);

            setLastNotificationCheck(new Date(latestNewWarning.createdAt));

            console.log(`Toast shown for warning ID: ${latestNewWarning.id}`);
          } else {
            // For older warnings, just mark them as processed without showing toast
            const newProcessedIds = new Set([
              ...processedWarningIds,
              latestNewWarning.id,
            ]);
            setProcessedWarningIds(newProcessedIds);

            // Save to localStorage
            if (typeof window !== 'undefined') {
              localStorage.setItem(
                'processedWarningIds',
                JSON.stringify([...newProcessedIds])
              );
            }

            console.log(
              `Older warning marked as processed (no toast): ${latestNewWarning.id}`
            );
          }
        } else {
          console.log('No new warnings found');
        }
      }
    } catch (error) {
      console.error('Failed to check notifications:', error);
    } finally {
      setIsCheckingNotifications(false);
    }
  };

  // Function to cleanup old processed warnings (keep only last 100)
  const cleanupProcessedWarnings = () => {
    if (typeof window !== 'undefined' && processedWarningIds.size > 100) {
      const warningArray = Array.from(processedWarningIds);
      const recentWarnings = warningArray.slice(-100); // Keep only last 100
      const newProcessedIds = new Set(recentWarnings);
      setProcessedWarningIds(newProcessedIds);
      localStorage.setItem(
        'processedWarningIds',
        JSON.stringify([...newProcessedIds])
      );
    }
  };

  // Listen for warning events from other components
  useEffect(() => {
    let debounceTimer = null;

    const handleWarningIssued = (event) => {
      // Clear any existing timer
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      // Set a new timer to debounce the event
      debounceTimer = setTimeout(() => {
        console.log('Warning issued event received, checking notifications...');
        checkForNewNotifications();
      }, 1000); // Small delay to ensure backend has processed the warning
    };

    // Add event listener for warning issued events
    window.addEventListener('warningIssued', handleWarningIssued);

    // Add manual trigger function for testing (accessible from console)
    window.triggerNotificationCheck = () => {
      console.log('Manual notification check triggered');
      checkForNewNotifications();
    };

    // Add function to clear processed warnings for testing
    window.clearProcessedWarnings = () => {
      console.log('Clearing processed warnings...');
      setProcessedWarningIds(new Set());
      if (typeof window !== 'undefined') {
        localStorage.removeItem('processedWarningIds');
      }
    };

    return () => {
      window.removeEventListener('warningIssued', handleWarningIssued);
      delete window.triggerNotificationCheck;
      delete window.clearProcessedWarnings;
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [processedWarningIds]);

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
      } catch {}
    };
    fetchBadges();
    setbadges([]);

    const fetchChallenges = async () => {
      try {
        const pinnedChallengeEndPoint =
          process.env.NEXT_PUBLIC_API_URL + '/users/' + user + '/likes';
        const pinnedChallengeResult = await request(
          pinnedChallengeEndPoint,
          'GET',
          null
        );
        setchallenges(pinnedChallengeResult);
      } catch (error) {}
    };
    fetchChallenges();
    setchallenges([]);

    const fetchData = async () => {
      try {
        const pinnedChallengeEndPoint =
          process.env.NEXT_PUBLIC_API_URL + '/users/' + user + '/likes';
        const pinnedChallengeResult = await request(
          pinnedChallengeEndPoint,
          'GET',
          null
        );
    //    setLikes(pinnedChallengeResult);
      } catch (error) {
        console.error('Failed to fetch pinnedChallengeResults: ', error);
      }
    };
    fetchData();

    const fetchObjectives = async () => {
      try {
        setTimeout(() => setObjectives(exampleObjectives), 500);
      } catch (error) {
        console.error('Failed to fetch objectives: ', error);
      }
    };
    fetchObjectives();

    const fetchRecommendedChallenges = async () => {
      setLoading(true);
      try {
        const response = await request(
          `${process.env.NEXT_PUBLIC_API_URL}/challenges/dash/recommended`,
          'GET',
          null
        );
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
        const response = await request(
          `${process.env.NEXT_PUBLIC_API_URL}/challenges/dash/popular`,
          'GET',
          null
        );
        setPopular(response); // Assuming the response directly contains the array of challenges
      } catch (error) {
        console.error('Failed to fetch recommended challenges: ', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchAccountDetails = async () => {
      request(`${process.env.NEXT_PUBLIC_API_URL}/account`, 'GET', null)
        .then((data) => {
          setRole(data.role);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    const checkCompletedTasks = async () => {
      try {
        const accountResponse = await request(
          `${process.env.NEXT_PUBLIC_API_URL}/account`,
          'GET',
          null
        );
        const hasProfilePicture = accountResponse.profileImage;
        const hasCompletedChallenge = accountResponse.points > 0;

        setCompletedTasks({
          profilePicture: hasProfilePicture,
          firstChallenge: hasCompletedChallenge,
        });
      } catch (error) {
        console.error('Failed to check completed tasks:', error);
      }
    };

    checkCompletedTasks();

    fetchRecommendedChallenges();
    fetchPopularChallenges();
    fetchAccountDetails();

    // Check for recent notifications immediately (within last 5 minutes)
    setTimeout(() => {
      checkForNewNotifications();
    }, 1000); // Check after 1 second to ensure component is fully loaded

    // Cleanup old processed warnings on initial load
    cleanupProcessedWarnings();

    request(`${process.env.NEXT_PUBLIC_API_URL}/activityFeed/`, 'GET', null)
      .then((response) => {
        console.log(response);
      setActivities(response.activityFeed);
    })
      .catch((error) => {
      console.error('Error fetching feed data: ', error);
    });
    const intervalId = setInterval(() => {
      request(`${process.env.NEXT_PUBLIC_API_URL}/activityFeed/`, 'GET', null)
        .then((response) => {
        //console.log(response)
        if (response.activityFeed.length > 0) {
          setActivities(response.activityFeed);
        }
      })
        .catch((error) => {
        console.error('Error fetching feed data: ', error);
      });
    }, 5000); // 5000 milliseconds = 5 seconds
  
    // Cleanup old processed warnings every 5 minutes
    const cleanupIntervalId = setInterval(() => {
      cleanupProcessedWarnings();
    }, 300000); // 5 minutes

    return () => {
      clearInterval(intervalId);
      clearInterval(cleanupIntervalId);
    };
  }, []);

  useEffect(() => {
    // Check onboarding status from API
    const checkOnboardingStatus = async () => {
      try {
        const response = await request(
          `${process.env.NEXT_PUBLIC_API_URL}/account`,
          'GET'
        );
        if (!response.hasCompletedOnboarding) {
          setIsOnboardingOpen(true);
        }
      } catch (error) {
        console.error('Failed to check onboarding status:', error);
      }
    };

    checkOnboardingStatus();

    // Don't check for notifications on initial load to prevent showing old notifications on refresh
  }, []);

  const handleHideOnboarding = () => {
    setShowOnboarding(false);
 //   localStorage.setItem('showOnboarding', JSON.stringify(false));
  };

  const completeOnboarding = () => {
    setIsOnboardingOpen(false);
    // The API endpoint will handle updating the database
  };

  useEffect(() => {
    const checkTimeProgress = async () => {
      const progress = await timeTracker.getWeeklyProgress();
      if (progress) {
        setTimeProgress(progress);
      }
    };

    checkTimeProgress();
    const interval = setInterval(checkTimeProgress, 300000);
    
    return () => clearInterval(interval);
  }, []);

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

      <div className="flex min-h-screen flex-col">
        <StandardNav />
        <DashboardHeader />
        <main className="animate__animated animate__fadeIn">
          <div className="mx-auto flex max-w-7xl flex-col items-start text-neutral-50  md:mt-8  lg:mt-8 lg:flex-row">
            <div className="w-full">
              {completedTasks &&
                (!completedTasks.profilePicture ||
                  !completedTasks.firstChallenge) && (
                  <div className="px-4">
                    <div className="animate__animated animate_fadeIn w-full rounded-lg bg-neutral-800/50 p-4 ">
                      <h1 className="flex align-middle text-2xl font-semibold">
                    Onboarding Tasks
                    <span 
                          className="ml-auto cursor-pointer text-sm text-neutral-400 transition-colors hover:text-neutral-200"
                      onClick={handleHideOnboarding}
                    >
                      Hide
                    </span>
                  </h1>
                      <p className="mb-6 text-sm text-neutral-300">
                        Looks like you're new around here. You should try to
                        complete these tasks. Or don't.
                      </p>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div
                          onClick={() => {
                            window.location.href = './settings';
                          }}
                          className={`${
                            completedTasks.profilePicture
                              ? 'border border-green-800 bg-green-900/20'
                              : 'border border-neutral-600 bg-neutral-700/50 hover:bg-neutral-700/70'
                          } cursor-pointer rounded-lg p-6  transition-colors`}
                        >
                          <div className="mb-3 flex items-center gap-3">
                            <div className="rounded-lg bg-blue-500/20 p-2">
                              <UserCircleIcon className="h-6 w-6 text-blue-500" />
                            </div>
                            <h2 className="font-semibold">
                              Set a profile picture
                            </h2>
                            {completedTasks.profilePicture && (
                              <CheckCircleIcon className="ml-auto h-6 w-6 text-green-500" />
                            )}
                          </div>
                          <p className="text-sm text-neutral-400">
                            Personalize your account by adding a profile picture
                          </p>
                        </div>
                        <div
                          onClick={() => {
                            window.location.href =
                              './challenges/07671f2f-cd67-4f0f-a3d1-9bdea299c59c?onboarding=true';
                          }}
                          className={`${
                            completedTasks.firstChallenge
                              ? 'border border-green-800 bg-green-900/20'
                              : 'border border-neutral-600 bg-neutral-700/50 hover:bg-neutral-700/70'
                          } cursor-pointer rounded-lg p-6  transition-colors`}
                        >
                          <div className="mb-3 flex items-center gap-3">
                            <div className="rounded-lg bg-green-500/20 p-2">
                              <BoltIcon className="h-6 w-6 text-green-500" />
                            </div>
                            <h2 className="font-semibold">
                              Complete your first challenge
                            </h2>
                            {completedTasks.firstChallenge && (
                              <CheckCircleIcon className="ml-auto h-6 w-6 text-green-500" />
                        )}
                      </div>
                          <p className="text-sm text-neutral-400">
                            Try solving an entry-level cybersecurity challenge
                          </p>
                        </div>
                  </div>
                </div>
                </div>
              )}

              <div className="w-full p-4">
                {/* Add after the onboarding tasks section */}
{timeProgress && (
                  <div className="mb-4 w-full rounded-lg bg-neutral-800/50 p-6">
                    <h1 className="mb-4 align-middle text-2xl font-semibold">
      Weekly Progress 
      <Tooltip>
                        <div className="ml-1 cursor-help text-xs text-neutral-400 transition-colors hover:text-neutral-300">
          beta
        </div>
                        <div className="absolute z-10 w-[320px] rounded-md bg-neutral-800 px-4 py-2 text-sm text-white shadow-lg">
          <div className="flex flex-col gap-1">
            <p>This is an experimental feature.</p>
            <button 
                              onClick={() => (window.location.href = '/report')}
                              className="text-left text-blue-400 hover:text-blue-300"
            >
              Click here to report an issue →
            </button>
          </div>
        </div>
      </Tooltip>
    </h1>
    
                    <div className="space-y-4">
      {/* Progress Bar */}
                      <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-700">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${
                            timeProgress.onTrack
                              ? 'bg-green-500'
                              : 'bg-yellow-500'
          }`}
                          style={{
                            width: `${timeProgress.progressPercentage}%`,
                          }}
        />
      </div>

      {/* Stats */}
                      <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
                        <div className="rounded-lg bg-neutral-700/50 p-4">
                          <p className="text-neutral-400">Time Spent</p>
                          <p className="text-xl font-semibold">
                            {Math.round(timeProgress.totalMinutesSpent / 60)}h{' '}
                            {timeProgress.totalMinutesSpent % 60}m
          </p>
        </div>
        
                        <div className="rounded-lg bg-neutral-700/50 p-4">
                          <p className="text-neutral-400">Weekly Goal</p>
                          <p className="text-xl font-semibold">
            {Math.round(timeProgress.weeklyGoalMinutes / 60)}h
          </p>
        </div>

                        <div className="rounded-lg bg-neutral-700/50 p-4">
                          <p className="text-neutral-400">Days Left</p>
                          <p className="text-xl font-semibold">
            {timeProgress.daysLeft} days
          </p>
        </div>
      </div>

      {/* Status Message */}
                      <div
                        className={`rounded-lg p-4 ${
                          timeProgress.onTrack
                            ? 'bg-green-900/20 text-green-500'
                            : 'bg-yellow-900/20 text-yellow-500'
                        }`}
                      >
                        <p className="font-medium">
          {timeProgress.onTrack 
                            ? `You're on track! ${Math.round(
                                timeProgress.progressPercentage
                              )}% of your weekly goal complete.`
                            : `You're behind schedule. ${Math.round(
                                timeProgress.progressPercentage
                              )}% complete with ${
                                timeProgress.daysLeft
                              } days left.`}
        </p>
      </div>
    </div>
  </div>
)}

                <h1 className="mb-6 text-2xl font-semibold">
                  Recommended Challenges
                </h1>
                <div className="flex w-full flex-col justify-between gap-4 md:flex-row lg:flex-col xl:flex-row">
                  {loading ? (
                    <>
                      <ChallengeCard />
                      <ChallengeCard />
                    </>
                  ) : likes?.length > 0 ? (
                    likes.map((challenge, index) => (
                      <ChallengeCard challenge={challenge} />
                    ))
                  ) : (
                    <>
                      <ChallengeCard />
                      <ChallengeCard />
                    </>
                  )}
                </div>
              </div>

              <div className="w-full rounded-sm">
                <div className="w-full p-4">
                  <h1 className="mb-3 text-2xl font-semibold">
                    Popular Challenges
                  </h1>
                  <div className="flex w-full flex-col justify-between gap-4 md:flex-row lg:flex-col xl:flex-row">
                    {loading ? (
                      <>
                        <ChallengeCard />
                        <ChallengeCard />
                      </>
                    ) : popular?.length > 0 ? (
                      popular.map((challenge, index) => (
                        <ChallengeCard challenge={challenge} />
                      ))
                    ) : (
                      <>
                        <ChallengeCard />
                        <ChallengeCard />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="relative flex shrink-0 flex-col  gap-6 rounded-md lg:w-[400px]">
              <div className="flex hidden w-full flex-col rounded-sm p-6">
                <h1 className="mb-4 text-2xl font-semibold tracking-wide text-neutral-100">
                  <TrophyIcon className="my-auto mr-4 inline-flex w-10" />
                  Daily Objectives
                </h1>
                <div className=" mb-4"></div>
                <ul className="grid list-none grid-cols-[2.5rem,1fr] gap-y-2">
                  {(objectives &&
                    objectives.map((objective) => (
                      <div>
                        {(objective.completed && (
                          <CheckCircleIcon className="w-8 text-blue-300"></CheckCircleIcon>
                        )) || (
                          <XCircleIcon className="w-8 text-neutral-300"></XCircleIcon>
                        )}
                        <li
                          className={`inline-flex ${
                            objective.completed && 'line-through'
                          } my-auto w-full`}
                        >
                          {objective.description}
                        </li>
                      </div>
                    ))) || (
                    <>
                      <Skeleton
                        containerClassName="col-span-2"
                        className="mb-4"
                        baseColor="#262626"
                        highlightColor="#3a3a3a"
                        count={2}
                      />
                    </>
                  )}
                </ul>
              </div>
              <div className="relative h-fit w-full p-4">
                <h1 className="mb-4 text-2xl font-semibold tracking-wide text-neutral-100">
                  Global Feed
                </h1>
                <ul className="flex flex-col gap-4 [&>*]:line-clamp-2">
                  {activities && activities.length > 0 ? (
                    activities
                      .slice()
                      .reverse()
                      .map((data) => (
    <div className="text-lg">
      <li>
                            <a
                              className="cursor-pointer font-bold text-blue-500 hover:text-blue-600"
                              href={'../users/' + data.userName}
                            >
                              {data.userName}
                            </a>{' '}
                            completed
                            <a
                              className="cursor-pointer text-yellow-500 hover:text-yellow-600"
                              href={'../challenges/' + data.challengeId}
                            >
                              {' '}
                              {data.challengeName}
                            </a>
      </li>
      </div>
                      ))
                  ) : (
  <>
                      <Skeleton
                        containerClassName="col-span-2"
                        className="mb-4"
                        baseColor="#262626"
                        highlightColor="#3a3a3a"
                        count={2}
                      />
  </>
                  )}
                </ul>
              </div>  

              <div className="relative w-full pb-4 pl-4 pr-4">
                {role == 'USER' && (
                  <div className="mb-10">
                    <h1 className="mb-4  text-2xl font-semibold tracking-wide text-neutral-100">
                  Sponsor Messaging
                </h1>
    <div 
                      class="break-inside relative mb-4 flex max-w-[23rem] cursor-pointer flex-col justify-between space-y-2 overflow-hidden rounded-xl bg-blue-800 p-4 pb-9 text-sm text-white"
        onClick={() => setShowUpgradeModal(true)}
    >
                      <div class="mt-2 flex flex-row items-center space-x-3">
                        <img src="../product.png" width="80"></img>
                        <span class="mt-2 text-base text-lg">
                          Upgrade to CTFGuide Pro today for just{' '}
                          <span className="font-semibold">$5/month</span>.
                        </span>
        </div>
                      <div class="flex hidden items-center justify-between">
                    <span></span>
                        <button class="flex items-center justify-center space-x-1 rounded-full bg-white px-4 py-2 text-xs font-medium text-black">
            <span>Upgrade Now</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#000000"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          >
                            <path d="M5 12h13M12 5l7 7-7 7" />
            </svg>
            </button>
        </div>
    </div>
</div>
                )}
                <h1 className="mb-4 text-2xl font-semibold tracking-wide  text-neutral-100">
                 Connect with CTFGuide
                </h1>
                <div class="break-inside relative mb-4 flex max-w-[23rem] flex-col  justify-between overflow-hidden rounded-xl bg-indigo-800 px-6 py-4 text-sm text-white">
                  <a
                    href="https://discord.gg/q3hgRBvgkX"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div class="mr-4 flex  max-w-sm items-center gap-x-8">
            <i class="fab fa-discord  ml-5  h-10 w-10 text-4xl text-white"></i>

            <div>
            <h5 class=" text-xl font-semibold tracking-tight text-white">
              Join our Discord!
            </h5>
            <p class="mb-3 font-normal text-white">
                          Talk to other CTF players and get help with
                          challenges!
            </p>
                        <p class="mx-auto  inline-flex items-center rounded-lg bg-white px-2 py-1 text-center font-bold text-indigo-500 hover:underline">
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

                <div class="break-inside relative mb-4 flex max-w-[23rem] flex-col  justify-between overflow-hidden rounded-xl border border-white/10 bg-black px-6 py-4 text-sm text-white">
       <div>
                    <div class="mr-4 flex  max-w-sm items-center gap-x-6">
                      <svg
                        className="ml-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 50 50"
                        width="100"
                      >
                        <path
                          fill="white"
                          d="M 5.9199219 6 L 20.582031 27.375 L 6.2304688 44 L 9.4101562 44 L 21.986328 29.421875 L 31.986328 44 L 44 44 L 28.681641 21.669922 L 42.199219 6 L 39.029297 6 L 27.275391 19.617188 L 17.933594 6 L 5.9199219 6 z M 9.7167969 8 L 16.880859 8 L 40.203125 42 L 33.039062 42 L 9.7167969 8 z"
                        />
                      </svg>
               <div>
               <h5 class=" text-xl font-semibold tracking-tight text-white">
                 Follow us on X!
               </h5>
               <p class="mb-3 font-normal text-white">
                          Stay updated with the latest CTFGuide news and
                          updates!
               </p>
                        <a
                          href="https://x.com/intent/user?screen_name=ctfguideapp"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="mx-auto  inline-flex items-center rounded-lg bg-white px-2 py-1 text-center  font-bold text-black hover:underline"
                        >
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
          </div>
        </main>
        <div className="flex h-full w-full grow basis-0"></div>
        <Footer />
      </div>

      {showUpgradeModal && (
        <div
          className={`fixed inset-0 z-50 bg-black bg-opacity-70 backdrop-blur-sm ${
            open ? '' : 'hidden'
          }`}
        >
          <div className="modal-content  animate__animated animate__fadeIn h-full  w-full">
            <div className="h-full w-full  bg-neutral-900 bg-opacity-70 py-24 sm:py-32">
              <div className="animate__animated animate__slideInDown mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl sm:text-center">
                  <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Upgrade to CTFGuide{' '}
                    <span className="text-yellow-500">Pro</span>
                  </h2>
                        </div>
                <div className="mx-auto mt-10 max-w-2xl rounded-3xl border-none bg-neutral-800 sm:mt-10 lg:mx-0 lg:flex lg:max-w-none">
                            <div className="p-8 sm:p-10 lg:flex-auto">
                    <h3 className="text-2xl font-bold tracking-tight text-white">
                      Monthly Subscription
                    </h3>
                                <p className="mt-6 text-base leading-7 text-white">
                      Enjoy our core features for free and upgrade to get perks
                      like priority access to terminals, custom container
                      images, customization perks, and more!
                                </p>
                                <div className="mt-10 flex items-center gap-x-4">
                      <h4 className="flex-none text-lg font-semibold leading-6 text-blue-600">
                        What's included
                      </h4>
                                    <div className="h-px flex-auto bg-gray-100" />
                                </div>
                                <ul
                                    role="list"
                                    className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-white sm:grid-cols-2 sm:gap-6"
                                >
                                    {includedFeatures.map((feature) => (
                                        <li key={feature} className="flex gap-x-3">
                          <CheckIcon
                            className="h-6 w-5 flex-none text-blue-600"
                            aria-hidden="true"
                          />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                    <button
                      onClick={() => setShowUpgradeModal(false)}
                      className=" mt-6 bg-neutral-900 px-4 py-1 text-white hover:bg-neutral-700"
                    >
                          No, thanks.
                        </button>
                            </div>

                            <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0 ">
                    <div className="bg-neutral-850 h-full rounded-2xl bg-neutral-700 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center">
              <div className="mx-auto max-w-xs px-8">
                        <p className="text-base font-semibold text-white">
                          Billed monthly
                        </p>
                <p className="mt-6 flex items-baseline justify-center gap-x-2">
                          <span className="text-5xl font-bold tracking-tight text-white">
                            $5
                          </span>
                          <span className="text-sm font-semibold leading-6 tracking-wide text-white">
                            USD
                          </span>
                </p>
                <a
                  href="../settings/billing"
                  className="mt-10 block w-full rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  Subscribe
                </a>
                <p className="mt-6 text-xs leading-5 text-white">
                          Invoices and receipts available for easy company
                          reimbursement
                </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
                        </div>
      )}
      <OnboardingModal isOpen={isOnboardingOpen} onClose={completeOnboarding} />
    </>
  );
}
