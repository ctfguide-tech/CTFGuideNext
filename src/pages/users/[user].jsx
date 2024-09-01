import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import { Context } from '@/context';
import { useContext } from 'react';
import dynamic from 'next/dynamic';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import request from '@/utils/request';
import { MarkdownViewer } from '@/components/MarkdownViewer';
import { useRouter } from 'next/router';
import CreatedChallenges from '@/components/profile/v2/CreatedChallenges';
import SolvedChallenges from '@/components/profile/v2/SolvedChallenges';
import Badges from '@/components/profile/v2/Badges';
import Writeups from '@/components/profile/v2/Writeups';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import ActivityCalendar from 'react-activity-calendar';
import { Pie } from 'react-chartjs-2';
import Followers from '@/components/profile/Followers';
import Following from '@/components/profile/Following';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
//toast
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CusTooltip from '@/components/profile/BadgeOnhover';
import { useSwipeable } from 'react-swipeable';

// Register the necessary chart component
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ArcElement
);

const mockActivityData = [
  { date: '2024-01-01', count: 0, level: 0 },
  { date: '2024-12-21', count: 0, level: 0 },
];

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

// Custom Multi-colored Circular Progress Bar Component
const MultiColorCircularProgressBar = ({ segments }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <circle
        cx="60"
        cy="60"
        r={radius}
        fill="none"
        stroke="#444"
        strokeWidth="10"
      />
      {segments.map((segment, index) => {
        const segmentLength = (segment.value / 100) * circumference;
        const strokeDasharray = `${segmentLength} ${
          circumference - segmentLength
        }`;
        const strokeDashoffset = offset;
        offset -= segmentLength;

        return (
          <circle
            key={index}
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={segment.color}
            strokeWidth="10"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 60 60)"
          />
        );
      })}
    </svg>
  );
};

export default function Create() {
  const bioRef = useRef(null);
  const toolKitRef = useRef(null);
  const saveRef = useRef(null);
  const bioContainerRef = useRef(null);
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('LIKED CHALLENGES');
  const [isBioExpanded, setIsBioExpanded] = useState(false);
  const [followerNum, setFollowerNum] = useState(0);
  const [followingNum, setFollowingNum] = useState(0);
  const [activityData, setActivityData] = useState(mockActivityData);
  const [completedChallenges, setCompletedChallenges] = useState(null);
  let [totalCompletedChallenges, setTotalCompletedChallenges] = useState(0);
  const [unsavedNotif, setOpenBio] = useState(false);
  const [banner, bannerState] = useState(false);
  const [inputText, setInputText] = useState('');
  const [currentUsersBio, setCurrentUsersBio] = useState(null);

  const [completionData, setCompletionData] = useState([
    {
      name: 'Beginner',
      amount: 0,
      color: 'bg-blue-500',
    },
    {
      name: 'Easy',
      amount: 0,
      color: 'bg-green-500',
    },
    {
      name: 'Medium',
      amount: 0,
      color: 'bg-orange-500',
    },
    {
      name: 'Hard',
      amount: 0,
      color: 'bg-red-500',
    },
    {
      name: 'Insane',
      amount: 0,
      color: 'bg-purple-500',
    },
  ]);

  const [displayMode, setDisplayMode] = useState('default');
  const [mutuals, setMutuals] = useState([]);
  const [ownUser, setOwnUser] = useState(false);
  const [followedUser, setFollowedUser] = useState(false);
  const [followers, setFollowers] = useState(0);
  const [followerPage, setFollowerPage] = useState(0); // Initial page
  const [totalFollowerPages, setTotalFollowerPages] = useState(0); // Total pages

  const [following, setFollowing] = useState(0);
  const [followingPage, setFollowingPage] = useState(0); // Initial page
  const [totalFollowingPages, setTotalFollowingPages] = useState(0); // Total pages

  const [categoryChallenges, setCategoryChallenges] = useState([]);
  const [rank, setRank] = useState(null);

  const [currentSwipeView, setCurrentSwipeView] = useState('skillChart');

  const handlers = useSwipeable({
    onSwipedLeft: () => setCurrentSwipeView('difficultyBreakdown'),
    onSwipedRight: () => setCurrentSwipeView('skillChart'),
  });

  function closeUnsavedNotif() {
    bannerState(false);
    setIsBioExpanded(false);
  }

  const handleInputChange = (event) => {
    setInputText(event.target.value);
    if (event.target.value !== '') {
      bannerState(true);
    } else {
      bannerState(false);
    }
  };

  const handleBioChange = (event) => {
    handleInputChange(event);
    setCurrentUsersBio(event.target.value);
  };

  function openBioEditor() {
    if (isBioExpanded === false) {
      setIsBioExpanded(true);
      console.log(isBioExpanded);
    }
  }

  function closeBioEditor() {
    setIsBioExpanded(false);
    console.log(isBioExpanded);
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'SOLVED CHALLENGES':
        return (
          <>
            <h1 className="text-xl font-bold text-white">SOLVED CHALLENGES</h1>
            {user && <SolvedChallenges user={user} />}
          </>
        );
      case 'WRITEUPS':
        return (
          <>
            <h1 className="text-xl font-bold text-white">WRITEUPS</h1>
            {user && <Writeups user={user} />}
          </>
        );
      case 'CREATED CHALLENGES':
        return (
          <>
            <h1 className="text-xl font-bold text-white">CREATED CHALLENGES</h1>
            <CreatedChallenges user={user} />
          </>
        );
      case 'BADGES':
        return (
          <>
            <h1 className="text-xl font-bold text-white">BADGES</h1>
            {user && <Badges user={user} />}
          </>
        );
      default:
        return null;
    }
  };

  const handleClickOutside = (event) => {
    if (
      bioRef.current &&
      !bioRef.current.contains(event.target) &&
      toolKitRef.current &&
      !toolKitRef.current.contains(event.target) &&
      (!saveRef.current ||
        (saveRef.current && !saveRef.current.contains(event.target)))
    ) {
    //  setIsBioExpanded(false);
      bannerState(false);
    }
  };

  useEffect(() => {
    if (router.query.user) {
      request(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${router.query.user}`,
        'GET',
        null
      )
        .then((data) => {
          setUser(data);
          const storedUser = localStorage.getItem('username');
          if (storedUser && storedUser === router.query.user) {
            setOwnUser(true);
            console.log('USER IS OWN USER');
          } else {
            fetchIsFollowing();
            setOwnUser(false);
            console.log('USER IS NOT OWN USER');
          }
          setActiveTab('SOLVED CHALLENGES');
          renderContent();
        })
        .catch((err) => {
          console.log(err);
        });

      request(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${router.query.user}/rank`,
        'GET',
        null
      )
        .then((data) => {
          if (data.rank == 'User not found in the ranking') {
            setRank('???');
          } else {
            setRank(data.rank);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [router.query.user]);

  useEffect(() => {
    const fetchActivityData = async () => {
      try {
        const response = await request(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${router.query.user}/activity`,
          'GET',
          null
        );
        //setActivityData(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchChallenges = async () => {
      try {
        const resp = await request(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${router.query.user}/completedChallenges`,
          'GET',
          null
        );
        if (resp) {
          setCompletedChallenges(resp);
          console.log('setting resp');
        }
        setTotalCompletedChallenges(
          resp.beginnerChallenges.length +
            resp.easyChallenges.length +
            resp.mediumChallenges.length +
            resp.hardChallenges.length +
            resp.insaneChallenges.length
        );
        console.log('completed challenges: ', completedChallenges);
        setCompletionData([
          {
            name: 'Beginner',
            amount: resp.beginnerChallenges.length,
            color: 'bg-blue-500',
          },
          {
            name: 'Easy',
            amount: resp.easyChallenges.length,
            color: 'bg-green-500',
          },
          {
            name: 'Medium',
            amount: resp.mediumChallenges.length,
            color: 'bg-orange-500',
          },
          {
            name: 'Hard',
            amount: resp.hardChallenges.length,
            color: 'bg-red-500',
          },
          {
            name: 'Insane',
            amount: resp.insaneChallenges.length,
            color: 'bg-purple-500',
          },
        ]);
      } catch (err) {
        console.log(err);
      }
    };
    const fetchCategories = async () => {
      try {
        const response = await request(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${router.query.user}/completedCategory`,
          'GET',
          null
        );
        if (response) {
          const categories = [
            {
              name: 'Forensics',
              completed: response.forensicsChallenges.length,
            },
            {
              name: 'Crypto',
              completed: response.cryptographyChallenges.length,
            },
            {
              name: 'RE',
              completed: response.reverseEngineeringChallenges.length,
            },
            { name: 'Web', completed: response.webChallenges.length },
            { name: 'Pwn', completed: response.pwnChallenges.length },
            {
              name: 'Pgrming',
              completed: response.programmingChallenges.length,
            },
            { name: 'Basic', completed: response.basicChallenges.length },
            { name: 'Other', completed: response.otherChallenges.length },
          ];
          setCategoryChallenges(categories);
        } else {
          setCategoryChallenges([]);
        }
      } catch (err) {
        console.log(err);
        setCategoryChallenges([]);
      }
    };

    const fetchUserData = async () => {
      try {
        const response = await request(
          `${process.env.NEXT_PUBLIC_API_URL}/account`,
          'GET',
          null
        );
        const userData = await response;

        // Set the fetched data into the state
        setCurrentUsersBio(userData.bio || 'Hmmm, this user has no bio yet.');
      } catch (err) {
        console.error('Failed to fetch user data', err);
      }
    };
    fetchUserData();
    fetchCategories();
    fetchChallenges();
    fetchActivityData();

    if (isBioExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [router.query.user, isBioExpanded]);

  const insertText = (text) => {
    const textarea = bioRef.current;
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const newValue =
      textarea.value.substring(0, startPos) +
      text +
      textarea.value.substring(endPos, textarea.value.length);
    setCurrentUsersBio(newValue);
    textarea.focus();
    textarea.selectionEnd = startPos + text.length;
    bannerState(true);
  };

  const magicSnippet = () => {
    const id = Math.random().toString(36).substring(7);
    insertText(`[Click to run: ${id}](https://ctfguide.com/magic/)`);
  };

  function bioViewCheck() {
    if (useContext(Context).username === (user && user.username)) {
      return true;
    } else {
      return false;
    }
  }

  const renderEditButton = () => {
    return (
      <>
        {!isBioExpanded && (
          <button
            className="pointer-events-none flex flex-col  justify-start"
            onClick={openBioEditor}
            data-tooltip-id="edit-bio"
            data-tooltip-content="Edit Bio"
            data-tooltip-place="top-end"
          >
            <i class="fas fa-edit pointer-events-auto mr-4 mt-2 text-xl text-white hover:text-gray-400"></i>
          </button>
        )}
      </>
    );
  };

  const renderUsersBio = () => {
    return (
      <>
        <div id="bioDiv">
          <div className="w-full cursor-pointer text-left focus:outline-none">
            {isBioExpanded ? (
              <>
                <div className=" sm:col-span-full">
                  <div className="mt-2 rounded-lg bg-neutral-800 text-white">
                    <div
                      className="mb-2 flex w-full justify-between "
                      ref={toolKitRef}
                    >
                      <div className="flex space-x-2 rounded-md bg-neutral-900">
                        <button
                          onClick={() => insertText('**Enter bold here**')}
                          className="toolbar-button ml-2 mr-1 pr-2 text-white"
                        >
                          <i className="fas fa-bold text-sm"></i>
                        </button>

                        <button
                          onClick={() => insertText('*Enter italic here*')}
                          className="toolbar-button mr-1 px-2 text-white"
                        >
                          <i className="fas fa-italic text-sm"></i>
                        </button>

                        <button
                          onClick={() => insertText('# Enter Heading here')}
                          className="toolbar-button mr-1 px-2 text-white"
                        >
                          <i className="fas fa-heading text-sm"></i>
                        </button>

                        <button
                          onClick={() => insertText('[Name](url)')}
                          className="toolbar-button mr-1 px-2 text-white"
                        >
                          <i className="fas fa-link text-sm"></i>
                        </button>

                        <button
                          onClick={() => insertText('```Enter Code here```')}
                          className="toolbar-button mr-1 px-2 text-white"
                        >
                          <i className="fas fa-code text-sm"></i>
                        </button>

                        <button
                          onClick={() => magicSnippet()}
                          className="toolbar-button mr-1 px-2 text-white"
                        >
                          <i className="fas fa-terminal text-sm"></i>
                        </button>
                      </div>
                      <button
                        onClick={closeBioEditor}
                        className="toolbar-button mr-1 rounded-md bg-neutral-900 px-2 text-white "
                      >
                        <i className="text-sm ">Close Editor</i>
                      </button>
                    </div>
                    <textarea
                      id="bio"
                      name="bio"
                      rows={4}
                      value={currentUsersBio}
                      onChange={handleBioChange}
                      className=" block w-full rounded-md border-0 border-none bg-neutral-700 text-white shadow-sm placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:py-1.5 sm:text-sm sm:leading-6"
                      ref={bioRef}
                      style={{ maxHeight: '200px', overflowY: 'auto' }}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                {user && (
                  <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    <MarkdownViewer content={currentUsersBio} style={{ maxHeight: '200px', overflowY: 'auto', important: true }} />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </>
    );
  };

  const saveBio = async () => {
    const data = {
      bio: currentUsersBio || '',
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
  };

  async function loadStreakChart() {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/activity/${router.query.user}`;
    const response = await request(url, 'GET', null);
    console.log(response);
    setActivityData(response.body);
  }

  async function fetchIsFollowing() {
    try {
      const endPoint = `${process.env.NEXT_PUBLIC_API_URL}/followers/${router.query.user}/isFollowing`;
      const result = await request(endPoint, 'GET');
      setFollowedUser(result.isFollowing);
      console.log('FOLLOW STATUS: ' + result.isFollowing);
    } catch (err) {
      console.error(err);
    }
  }

  const handleFollowUser = async () => {
    if (user) {
      try {
        const endPoint = `${process.env.NEXT_PUBLIC_API_URL}/followers/${user.username}/follow`;
        const result = await request(endPoint, 'POST');
        toast.success('You are now following this user.');
        setFollowedUser(true);
        console.log(result);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleUnfollowUser = async () => {
    try {
      const endPoint = `${process.env.NEXT_PUBLIC_API_URL}/followers/${user.username}/unfollow`;
      const result = await request(endPoint, 'DELETE');
      toast.success('You are no longer following this user.');
      setFollowedUser(false);
      console.log(result);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (router.query.user) loadStreakChart();
    setDisplayMode('default');
  }, [router.query.user]);

  // Get the Username from Local Storage
  useEffect(() => {
    const storedUser = localStorage.getItem('username');
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  // Followers useEffect
  useEffect(() => {
    if (user && user.username) {
      const fetchFollowers = async () => {
        try {
          const endPoint =
            process.env.NEXT_PUBLIC_API_URL +
            '/followers/' +
            user.username +
            `/followers?page=${followerPage}`;
          const result = await request(endPoint, 'GET');
          if (result && result.followers) {
            setTotalFollowerPages(result.lastPage + 1);
            setFollowers(result.followers);
            setFollowerNum(result.totalEntries);
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchFollowers();
    }
  }, [user, followerPage, followedUser]);

  // Following useEffect
  useEffect(() => {
    if (user && user.username) {
      const fetchFollowing = async () => {
        try {
          const endPoint =
            process.env.NEXT_PUBLIC_API_URL +
            '/followers/' +
            user.username +
            `/following?page=${followingPage}`;
          const result = await request(endPoint, 'GET');
          if (result && result.following) {
            setTotalFollowingPages(result.lastPage + 1);
            setFollowing(result.following);
            setFollowingNum(result.totalEntries);
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchFollowing();
    }
  }, [user, followingPage]);

  const userData = { user, ownUser: true };

  // Follower
  const handleFollowerPageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalFollowerPages) {
      setFollowerPage(newPage);
    }
  };
  const nextFollowerPage = () => handleFollowerPageChange(followerPage + 1);
  const prevFollowerPage = () => handleFollowerPageChange(followerPage - 1);
  const followerPageData = {
    setDisplayMode,
    page: followerPage,
    totalPages: totalFollowerPages,
    prevPage: prevFollowerPage,
    nextPage: nextFollowerPage,
  };

  // Following
  const handleFollowingPageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalFollowingPages) {
      setFollowingPage(newPage);
    }
  };
  const nextFollowingPage = () => handleFollowingPageChange(followingPage + 1);
  const prevFollowingPage = () => handleFollowingPageChange(followingPage - 1);
  const followingPageData = {
    setDisplayMode,
    page: followingPage,
    totalPages: totalFollowingPages,
    prevPage: prevFollowingPage,
    nextPage: nextFollowingPage,
  };

  const radarData = {
    labels: categoryChallenges.map((category) => category.name),
    datasets: [
      {
        label: 'Completed Challenges',
        data: categoryChallenges.map((category) => category.completed),
        backgroundColor: 'rgba(34, 202, 236, 0.2)',
        borderColor: 'rgba(34, 202, 236, 1)',
        pointBackgroundColor: 'rgba(34, 202, 236, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(34, 202, 236, 1)',
        borderWidth: 2,
      },
    ],
  };

  const radarOptions = {
    scales: {
      r: {
        angleLines: {
          display: true,
          color: '#444',
        },
        grid: {
          color: '#444',
        },
        pointLabels: {
          color: '#fff',
          font: {
            size: 14,
          },
        },
        ticks: {
          beginAtZero: true,
          min: 0,
          max: 10,
          stepSize: 2,
          showLabelBackdrop: false,
          color: '#fff',
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.raw} challenges`;
          },
        },
      },
    },
  };

  const pieData = {
    labels: completionData.map((item) => item.name),
    datasets: [
      {
        data: completionData.map((item) => item.amount),
        backgroundColor: [
          '#3b82f6',
          '#10b981',
          '#f59e0b',
          '#ef4444',
          '#8b5cf6',
        ],
        hoverBackgroundColor: [
          '#2563eb',
          '#059669',
          '#d97706',
          '#dc2626',
          '#7c3aed',
        ],
        borderWidth: 0,
        borderRadius: 0,
        cutout: '70%', // This makes it a donut chart
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: {
        display: false, // Hide the legend
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value} challenges`;
          },
        },
      },
    },
  };

  const updatedCompletionData = completionData.map((item) => ({
    ...item,
  }));

  const totalChallenges = completionData.reduce(
    (acc, item) => acc + item.amount,
    0
  );
  const solvedChallenges = totalCompletedChallenges;

  const segments = completionData.map((item) => ({
    value: (item.amount / totalChallenges) * 100,
    color:
      item.color.split('-')[1] === 'blue'
        ? '#3b82f6'
        : item.color.split('-')[1] === 'green'
        ? '#10b981'
        : item.color.split('-')[1] === 'orange'
        ? '#f59e0b'
        : item.color.split('-')[1] === 'red'
        ? '#ef4444'
        : item.color.split('-')[1] === 'purple'
        ? '#8b5cf6'
        : '#fff',
  }));

  const getNameColor = (role) => {
    if (role == 'PRO')
      return 'mt-8 flex items-center truncate text-2xl text-transparent font-bold bg-clip-text bg-gradient-to-br from-amber-600 via-yellow-400 via-75% to-amber-600';
    if (role == 'ADMIN')
      return 'mt-8 font-bold flex items-center truncate text-2xl text-red-600';
    return 'mt-8 flex items-center truncate text-2xl font-bold text-white';
  };

  const getRankColor = (rank) => {
    if (rank === 1)
      return 'ml-2 text-transparent text-2xl font-bold bg-clip-text bg-gradient-to-br from-amber-600 via-yellow-400 via-75% to-amber-600';
    if (rank === 2)
      return 'ml-2 text-transparent text-2xl font-bold bg-clip-text bg-gradient-to-br from-gray-600 via-gray-400 via-65% to-gray-600';
    if (rank === 3)
      return 'ml-2 text-transparent text-2xl font-bold bg-clip-text bg-gradient-to-br from-orange-900 via-orange-400 via-65% to-orange-900';
    return 'text-2xl ml-2 text-white';
  };

  return (
    <>
      <Head>
        <title>{user && user.username}'s Profile - CTFGuide</title>
        <style>
          @import
          url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
        </style>
      </Head>
      <StandardNav />
      <div>
        <div>
          <div
            style={{
              backgroundSize: 'cover',
              backgroundPosition: 'center', // Center the background image
              backgroundImage: `url(${
                user && user.bannerImage
                  ? user.bannerImage
                  : 'https://images.unsplash.com/photo-1633259584604-afdc243122ea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
              })`,
            }}
            className="h-20 w-full object-cover lg:h-56"
            alt=""
          ></div>
        </div>
        <div className="mx-auto max-w-7xl ">
          <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5 sm:justify-start justify-center text-center sm:text-left">
            <div className="flex w-40 justify-center mx-auto sm:mx-0">
              {
                <a href={ownUser ? '../settings' : '#'}>
                  {(user && (
                    <img
                      className="rounded-full hover:bg-[#212121] sm:h-32 sm:w-32 h-24 w-24"
                      src={
                        user.profileImage ||
                        'https://robohash.org/' + user.username
                      }
                      alt=""
                    />
                  )) || (
                    <Skeleton
                      circle={true}
                      height={128}
                      width={128}
                      baseColor="#262626"
                      highlightColor="#3a3a3a"
                    />
                  )}
                </a>
              }
            </div>
            <div className="sm:mt-12 w-full">
              <div className="">
                <div className="">
                  <div className=" flex w-full flex-col sm:flex-row items-center sm:items-start">
                    <div>
                      <h1 className={`${getNameColor(user && user.role)}`}>
                        {(user && user.username) || (
                          <Skeleton
                            baseColor="#262626"
                            highlightColor="#3a3a3a"
                            width="15rem"
                          />
                        )}
                        {user && rank && (
                          <span className={getRankColor(rank)}>
                            #{rank}
                          </span>
                        )}

                        {user && user.role === 'ADMIN' && (
                          <span className="ml-2 rounded-sm bg-red-600 px-1 text-sm text-white">
                            <i className="fas fa-code fa-fw"></i> Developer
                          </span>
                        )}

                        {user && user.role === 'PRO' && (
                          <span className="ml-2 rounded-sm bg-gradient-to-br from-orange-400 to-yellow-600 px-1 text-sm text-white">
                            <i className="fas fa-crown fa-fw"></i> Pro
                          </span>
                        )}
                        {!ownUser && followedUser && (
                          <button 
                            className="border rounded-sm border-neutral-500 ml-2 px-1 text-sm text-white hover:bg-neutral-600"
                            onClick={handleUnfollowUser}>
                              <i
                              className="fas fa-user-slash text-xs"
                            ></i>
                            {' '}
                            Unfollow
                          </button>
                        )}
                        {!ownUser && !followedUser && (
                          <button 
                            className="border rounded-sm border-neutral-500 ml-2 px-1 text-sm text-white hover:bg-neutral-600"
                            onClick={handleFollowUser}>
                              <i
                              className="fas fa-user-plus text-xs"
                            ></i>
                            {' '}
                            Follow
                          </button>
                        )}
                      </h1>
                      <p className="text-white">
                        <i className="fas fa-map-marker-alt mt-2"></i>{' '}
                        {(user && user.location) || (
                          <Skeleton
                            width="25rem"
                            baseColor="#262626"
                            highlightColor="#3a3a3a"
                          />
                        )}
                      </p>
                    </div>
                    <div className="sm:ml-auto mt-4 sm:mt-14 flex text-white justify-center sm:justify-end">
                      <p className="text-center sm:text-right w-full sm:w-auto">
                        {user && (
                          <>
                            <span
                              className={`border border-neutral-500 rounded-sm px-2 py-1 cursor-pointer font-bold hover:bg-neutral-600 ${
                                displayMode === 'followers' ? 'bg-neutral-500' : ''
                              }`}
                              onClick={() => setDisplayMode('followers')}
                            >
                              Followers
                              {' '}
                            {followerNum || '0'}
                            </span>
                            <span
                              className={`border border-neutral-500 rounded-sm px-2 py-1 ml-4 cursor-pointer font-bold hover:bg-neutral-600 ${
                                displayMode === 'following' ? 'bg-neutral-500' : ''
                              }`}
                              onClick={() => setDisplayMode('following')}
                            >
                              Following
                              {' '}
                            {followingNum || '0'}
                            </span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main layout for larger screens */}
      <main className="hidden md:block mx-auto mb-20 mt-10 max-w-7xl">
        <div className="mt-10 grid grid-cols-1 gap-y-4 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-4 lg:gap-x-4 ">
          <div className="h-40 w-full border-t-4 border-blue-600 bg-neutral-800">
            <div className="col-span-2 bg-neutral-800 px-4 pt-4">
              <div className="bg-neutral-800">
                <h1 className="text-xl font-bold text-white">SKILL CHART</h1>
                {categoryChallenges.length > 0 &&
                categoryChallenges.some(
                  (category) => category.completed > 0
                ) ? (
                  <Radar data={radarData} options={radarOptions} />
                ) : (
                  <h1 className="mx-auto my-auto text-neutral-400">
                    It seems that {user && user.username} hasn't solved any
                    challenges yet.
                  </h1>
                )}
              </div>
              <hr className="mt-4 border-neutral-700 px-4"></hr>
            </div>

            <div className="col-span-2 bg-neutral-800 px-4 pt-4 ">
              <div className="bg-neutral-800 text-white">
                <h1 className="text-xl font-bold text-white">
                  DIFFICULTY BREAKDOWN
                </h1>
                {solvedChallenges > 0 ? (
                  <div className="mt-4 flex items-center justify-center">
                    <div className="w-1/2">
                      <MultiColorCircularProgressBar segments={segments} />
                      <p className=" mt-2 text-center text-white">
                        {solvedChallenges} Solved
                      </p>
                    </div>
                    <div className="ml-4 w-1/2">
                      {completionData.map((item, index) => (
                        <div key={index} className="mb-2 flex justify-between">
                          <span
                            className={`text-${item.color.split('-')[1]}-500`}
                            title={`${item.name}: ${item.amount} challenges`}
                          >
                            {item.name}
                          </span>
                          <span className="text-white">{item.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-neutral-400">
                    Hmm, {user && user.username} hasn't solved any challenges
                    yet.
                  </p>
                )}
              </div>
              <hr className="mt-4 border-neutral-700 px-4"></hr>
            </div>

            <div className="h-full gap-y-4 bg-neutral-800 px-4 py-4">
              <h1 className="text-xl font-bold text-white">NERD STATS</h1>
              {user && (
                <div className="text-xs text-neutral-400">
                  <p>
                    Creation Date :{' '}
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      minute: 'numeric',
                      hour: 'numeric',
                    })}
                  </p>
                  <p>Total Challenges: {user.totalChallenges || '0'}</p>
                  <p>Total Writeups: {user.totalWriteups || '0'}</p>
                  <p>Total Badges: {user.totalBadges || '0'}</p>
                </div>
              )}
            </div>
          </div>
          <div className="col-span-3 border-t-2 border-blue-600">
            {displayMode === 'followers' && (
              <Followers
                followers={followers}
                pageData={followerPageData}
                userData={userData}
              />
            )}
            {displayMode === 'following' && (
              <Following
                followings={following}
                pageData={followingPageData}
                userData={userData}
              />
            )}

            {displayMode === 'default' && (
              <>
                <div className="col-span-3 border-t-2 border-blue-600">
                  <div className="bg-neutral-800 px-4 py-4 ">
                    <div className="mb-2 flex w-full justify-between  ">
                      <div className="flex space-x-2  rounded-md">
                        {user && (
                          <h1 className="mb-1 text-xl font-bold uppercase text-white">
                            ABOUT {user.username}
                          </h1>
                        )}
                      </div>
                      {bioViewCheck() ? renderEditButton() : ''}
                    </div>
                    {user && user.bio != null ? (
                      <p className="text-neutral-400">
                        {bioViewCheck()
                          ? renderUsersBio()
                          : user && <MarkdownViewer content={user.bio || "Nothing to see here..."} style={{ maxHeight: '200px', overflowY: 'auto', important: true }} />}
                      </p>
                    ) : (
                      <p className="text-neutral-400">
                        {bioViewCheck()
                          ? renderUsersBio()
                          : user && (
                              <MarkdownViewer content="Nothing to see here..." style={{ maxHeight: '200px', overflowY: 'auto', important: true }} />
                            )}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-y-4 pt-4 ">
                  <div>
                    <div className="pb-2 ">
                      <ul className="hidden w-full list-none text-neutral-500 md:flex">
                        {[
                          'SOLVED CHALLENGES',
                          'WRITEUPS',
                          'CREATED CHALLENGES',
                          'BADGES',
                        ].map((tab) => (
                          <li
                            key={tab}
                            className={`mr-4 cursor-pointer ${
                              activeTab === tab
                                ? ' border-blue-600 font-semibold text-blue-600'
                                : ''
                            }`}
                            onClick={() => setActiveTab(tab)}
                          >
                            {tab}
                          </li>
                        ))}
                      </ul>
                      <select
                        className="w-1/2 w-full rounded border-none bg-neutral-800 px-4 text-neutral-50 md:hidden"
                        value={activeTab}
                        onChange={(e) => setActiveTab(e.target.value)}
                      >
                        {[
                          'LIKED CHALLENGES',
                          'WRITEUPS',
                          'CREATED CHALLENGES',
                          'BADGES',
                        ].map((tab) => (
                          <option key={tab} value={tab}>
                            {tab}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="border-t-4 border-blue-600 bg-neutral-800 px-4 py-4">
                      {user != undefined && renderContent()}
                    </div>

                    <div className="w-full">
                      <div className="text-white">
                        <div className="mt-4 w-full border-t-4 border-blue-600 bg-neutral-800 px-4 py-4">
                          <h2 className="mb-4 text-xl font-bold text-white">
                            ACTIVITY CALENDAR
                          </h2>
                          <div className="flex justify-center">
                            {activityData && (
                              <ActivityCalendar
                                data={activityData}
                                showMonthLabels={true} // Ensure month labels are shown
                                theme={{
                                  light: [
                                    '#1f1f1f',
                                    '#c0d7ff',
                                    '#93bfff',
                                    '#66a7ff',
                                    '#3a8fff',
                                  ],
                                  dark: [
                                    '#1f1f1f',
                                    '#c0d7ff',
                                    '#93bfff',
                                    '#66a7ff',
                                    '#3a8fff',
                                  ],
                                  level4: '#3a8fff',
                                }}
                              />
                            )}{' '}
                          </div>{' '}
                        </div>{' '}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
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
        </div>
      
      
      </main>

      {/* Mobile layout */}
      <main className="block md:hidden mx-auto mb-20 mt-10 max-w-7xl px-6">
        <div className="mt-10 grid grid-cols-1 gap-y-4">
          <div className="border-t-4 border-blue-600">
            <div className="bg-neutral-800 px-4 py-4 ">
              <div className="mb-2 flex w-full justify-between  ">
                <div className="flex space-x-2  rounded-md">
                  {user && (
                    <h1 className="mb-1 text-xl font-bold uppercase text-white">
                      ABOUT {user.username}
                    </h1>
                  )}
                </div>
                {bioViewCheck() ? renderEditButton() : ''}
              </div>
              {user && user.bio != null ? (
                <p className="text-neutral-400">
                  {bioViewCheck()
                    ? renderUsersBio()
                    : user && <MarkdownViewer content={user.bio || "Nothing to see here..."} style={{ maxHeight: '200px', overflowY: 'auto', important: true }} />}
                </p>
              ) : (
                <p className="text-neutral-400">
                  {bioViewCheck()
                    ? renderUsersBio()
                    : user && (
                        <MarkdownViewer content="Nothing to see here..." style={{ maxHeight: '200px', overflowY: 'auto', important: true }} />
                      )}
                </p>
              )}
            </div>
          </div>
          <div className="h-40 w-full border-t-4 border-blue-600 bg-neutral-800" {...handlers}>
            {currentSwipeView === 'skillChart' ? (
              <div className="bg-neutral-800 px-4 pt-4">
                <h1 className="text-xl font-bold text-white">SKILL CHART</h1>
                {categoryChallenges.length > 0 &&
                categoryChallenges.some(
                  (category) => category.completed > 0
                ) ? (
                  <div className="">
                  <Radar data={radarData} options={{ ...radarOptions }}   />
                  </div>
                ) : (
                  <h1 className="mx-auto my-auto text-neutral-400">
                    It seems that {user && user.username} hasn't solved any
                    challenges yet.
                  </h1>
                )}
                <hr className="mt-4 border-neutral-700 px-4"></hr>
              </div>
            ) : (
              <div className="bg-neutral-800 px-4 pt-4">
                <h1 className="text-xl font-bold text-white">
                  DIFFICULTY BREAKDOWN
                </h1>
                {solvedChallenges > 0 ? (
                  <div className="mt-4 flex items-center justify-center">
                    <div className="w-1/2">
                      <MultiColorCircularProgressBar segments={segments} />
                      <p className=" mt-2 text-center text-white">
                        {solvedChallenges} Solved
                      </p>
                    </div>
                    <div className="ml-4 w-1/2">
                      {completionData.map((item, index) => (
                        <div key={index} className="mb-2 flex justify-between">
                          <span
                            className={`text-${item.color.split('-')[1]}-500`}
                            title={`${item.name}: ${item.amount} challenges`}
                          >
                            {item.name}
                          </span>
                          <span className="text-white">{item.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-neutral-400">
                    Hmm, {user && user.username} hasn't solved any challenges
                    yet.
                  </p>
                )}
                <hr className="mt-4 border-neutral-700 px-4"></hr>
              </div>
            )}
          </div>

          <div className="">
            {displayMode === 'followers' && (
              <Followers
                followers={followers}
                pageData={followerPageData}
                userData={userData}
              />
            )}
            {displayMode === 'following' && (
              <Following
                followings={following}
                pageData={followingPageData}
                userData={userData}
              />
            )}

            {displayMode === 'default' && (
              <>
                <div className="mt-4 hidden">
                  <div className="pb-2 ">
                    <ul className="hidden w-full list-none text-neutral-500 md:flex">
                      {[
                        'SOLVED CHALLENGES',
                        'WRITEUPS',
                        'CREATED CHALLENGES',
                        'BADGES',
                      ].map((tab) => (
                        <li
                          key={tab}
                          className={`mr-4 cursor-pointer ${
                            activeTab === tab
                              ? ' border-blue-600 font-semibold text-blue-600'
                              : ''
                          }`}
                          onClick={() => setActiveTab(tab)}
                        >
                          {tab}
                        </li>
                      ))}
                    </ul>
                    <select
                      className="w-1/2 w-full rounded border-none bg-neutral-800 px-4 text-neutral-50 md:hidden"
                      value={activeTab}
                      onChange={(e) => setActiveTab(e.target.value)}
                    >
                      {[
                        'LIKED CHALLENGES',
                        'WRITEUPS',
                        'CREATED CHALLENGES',
                        'BADGES',
                      ].map((tab) => (
                        <option key={tab} value={tab}>
                          {tab}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="border-t-4 hiborder-blue-600 bg-neutral-800 px-4 py-4">
                    {user != undefined && renderContent()}
                  </div>

                  <div className="w-full">
                    <div className="text-white">
                      <div className="mt-4 w-full border-t-4 border-blue-600 bg-neutral-800 px-4 py-4">
                        <h2 className="mb-4 text-xl font-bold text-white">
                          ACTIVITY CALENDAR
                        </h2>
                        <div className="flex justify-center">
                          {activityData && (
                            <ActivityCalendar
                              data={activityData}
                              showMonthLabels={true} // Ensure month labels are shown
                              theme={{
                                light: [
                                  '#1f1f1f',
                                  '#c0d7ff',
                                  '#93bfff',
                                  '#66a7ff',
                                  '#3a8fff',
                                ],
                                dark: [
                                  '#1f1f1f',
                                  '#c0d7ff',
                                  '#93bfff',
                                  '#66a7ff',
                                  '#3a8fff',
                                ],
                                level4: '#3a8fff',
                              }}
                            />
                          )}{' '}
                        </div>{' '}
                      </div>{' '}
                    </div>
                  </div>
                </div>
              </>
            )}
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
        </div>
      </main>

      {/* are you even surprised atp?  */}
      {displayMode === 'followers' || displayMode === 'following' ? (
        <>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
        </>
      ) : null}

      <div className="mt-4"></div>

      <div className="flex h-full w-full grow basis-0"></div>
      <Footer />

      {banner && (
        <div
          ref={saveRef}
          style={{ backgroundColor: '#212121' }}
          id="savebanner"
          className="fixed inset-x-0 bottom-0 flex flex-col justify-between gap-x-8 gap-y-4 p-6 ring-1 ring-gray-900/10 md:flex-row md:items-center lg:px-8"
          hidden={!unsavedNotif}
        >
          <p className="max-w-4xl text-2xl leading-6 text-white">
            You have unsaved changes.
          </p>
          <div className="flex flex-none items-center gap-x-5">
            <button
              onClick={saveBio}
              type="button"
              className="rounded-sm bg-green-700 px-3 py-2 text-xl font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
            >
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
