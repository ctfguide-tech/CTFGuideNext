import Head from 'next/head';
import { useState, useEffect } from 'react';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { ChallengeCard } from '@/components/create/ChallengeCard';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import Typography from '@mui/material/Typography';
import Popover from '@mui/material/Popover';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import request from "@/utils/request";
import Menu from '@/components/editor/Menu';
import Skeleton from 'react-loading-skeleton';
import { Popover as HeadlessPopover } from '@headlessui/react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

export default function Create() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('unverified');
  const [challenges, setChallenges] = useState([]);
  const [hasChallenges, setHasChallenges] = useState(false);
  const [username, setUsername] = useState('');
  const [date, setDate] = useState('');
  const [title, setTitle] = useState('Unverified Challenges');
  const [infoText, setInfoText] = useState(
    'You cannot edit unverified challenges. Please wait for admins to approve these!'
  );

  const [isCreating, setIsCreating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);

  const [moduleState, setModuleState] = useState('unverified');

  const [writeupState, setWriteupState] = useState('all');
  const [allWriteups, setAllWriteups] = useState([]);

  const [modules, setModules] = useState([]);

  const [moduleFilter, setModuleFilter] = useState('all');

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    if (success === 'true') {
      document.getElementById('saved').classList.remove('hidden');
    }

    const deleted = urlParams.get('wdeleted');
    if (deleted === 'true') {
      toast.success('Writeup deleted successfully');
    }
  }, []);

  const [writeups, setWriteups] = useState([]);

  useEffect(() => {
    setLoading(true);
    try {
      request(`${process.env.NEXT_PUBLIC_API_URL}/stats/creator`, "GET", null)
        .then((data) => {
          setStats([
            {
              id: 1,
              name: 'Challenges Created',
              value: data.challengesCreated,
            },
            {
              id: 2,
              name: 'Challenge Views',
              value: data.challengeViews,
            },
            {
              id: 3,
              name: 'Challenge Attempts',
              value: data.challengeAttempts,
            },
            {
              id: 4,
              name: 'Challenge Solves',
              value: data.challengeSolves,
            }
          ]);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } catch {
      setLoading(false);
    }
  }, []);

  const [stats, setStats] = useState([
    { id: 1, name: 'Challenges Created', value: '0' },
    { id: 2, name: 'Challenge Views', value: '0' },
    { id: 3, name: 'Challenge Attempts', value: '0' },
    { id: 4, name: 'Challenge Solves', value: '0' },
  ]);

  const [solvedChallenges, setSolvedChallenges] = useState([]);
  useEffect(() => {
    setLoading(true);
    try {
      request(`${process.env.NEXT_PUBLIC_API_URL}/account`, "GET", null)
        .then((data) => {
          setUsername(data.username);
          fetchWriteups(data.username);
          setDate(data.createdAt);
          request(`${process.env.NEXT_PUBLIC_API_URL}/users/${data.username}/solvedChallenges`, "GET", null).then(challenges => {
            setSolvedChallenges(challenges);
            setLoading(false);
          });
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });

      fetchChallenges("unverified");
      fetchModules("unverified");
    } catch (error) {
      setLoading(false);
    }
  }, [activeTab]);

  const fetchWriteups = async (username) => {
    try {
      const response = await request(`${process.env.NEXT_PUBLIC_API_URL}/users/${username}/writeups`, "GET", null);
      if (Array.isArray(response) && response.length > 0) {
        setAllWriteups(response);
        setWriteups(response);
      } else {
        setAllWriteups([]);
        setWriteups([]);
      }
    } catch (error) { }
  };

  const fetchChallenges = async (selection) => {
    let response = [];
    try {
      switch (selection) {
        case 'unverified':
          setTitle('Unverified');
          setInfoText(
            'Please wait for admins to approve unverified challenges!'
          );
          response = await request(`${process.env.NEXT_PUBLIC_API_URL}/account/challenges?state=unverified`, "GET", null);
          break;
        case 'pending':
          setTitle('Pending Changes');
          setInfoText('These challenges are awaiting changes!');
          response = await request(`${process.env.NEXT_PUBLIC_API_URL}/account/challenges?state=pending`, "GET", null);
          break;
        case 'published':
          setTitle('Published');
          setInfoText(
            'These challenges are live! Share them with your friends!'
          );
          response = await request(`${process.env.NEXT_PUBLIC_API_URL}/account/challenges?state=published`, "GET", null);
          break;
        default:
          setTitle('Unverified');
          response = await request(`${process.env.NEXT_PUBLIC_API_URL}/account/challenges?state=verified`, "GET", null);
      }
    } catch (error) { }

    if (Array.isArray(response) && response.length > 0) {
      setChallenges(response);
      setHasChallenges(true);
    } else {
      setChallenges([]);
      setHasChallenges(false);
    }
  };

  function InfoPopup({ activeTab }) {
    return (
      <PopupState variant="popover" popupId="demo-popup-popover">
        {(popupState) => (
          <div>
            <div
              variant=""
              className='mt-3'
              {...bindTrigger(popupState)}
            >
              <div className="flex ml-3 mr-1">
                <FontAwesomeIcon
                  className="h-4 text-white"
                  icon={faInfoCircle}

                />
              </div>
            </div>
            <Popover
              {...bindPopover(popupState)}
              anchorOrigin={{
                vertical: 'center',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'center',
                horizontal: 'left',
              }}
              sx={{
                '& .MuiPaper-root': {
                  backgroundColor: '#323232',
                  border: '1px solid #363636',
                },
              }}
            >
              <Typography
                className="bg-[#212121] text-xs text-white hidden"
                sx={{ p: 1, fontFamily: 'Poppins, sans-serif' }}
              >
                {infoText}
              </Typography>
            </Popover>
          </div>
        )}
      </PopupState>
    );
  }

  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const handleOpenModal = (content) => {
    setModalContent(content);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setModalContent('');
  };

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await request(`${process.env.NEXT_PUBLIC_API_URL}/account/notifications`, "GET", null);
        const challengeNotifications = response.filter(notification => notification.type === 'CHALLENGE');
        setNotifications(challengeNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  const [showCreatorMode, setShowCreatorMode] = useState(null);

  const [isEnableModalOpen, setIsEnableModalOpen] = useState(false);
  const [isDisableModalOpen, setIsDisableModalOpen] = useState(false);

  const handleEnableCreatorMode = async () => {
    try {
      await request(`${process.env.NEXT_PUBLIC_API_URL}/account/creatorMode`, 'POST', { creatorMode: true });
      setIsEnableModalOpen(false);
      // Additional logic to enable creator mode
      setCreatorMode(true);
      setShowCreatorMode(true);
      toast.success('Creator mode enabled successfully');
    } catch (error) {
      console.error('Error enabling creator mode:', error);
      toast.error('Failed to enable creator mode');
    }
  };

  const handleDisableCreatorMode = async () => {
    try {
      await request(`${process.env.NEXT_PUBLIC_API_URL}/account/creatorMode`, 'POST', { creatorMode: false });
      setIsDisableModalOpen(false);
      setCreatorMode(false);
      setShowCreatorMode(true);
      toast.success('Creator mode disabled successfully');
    } catch (error) {
      console.error('Error disabling creator mode:', error);
    }
  };

  const [creatorMode, setCreatorMode] = useState(false);

  useEffect(() => {
    const fetchCreatorMode = async () => {
      try {
        const response = await request(`${process.env.NEXT_PUBLIC_API_URL}/account`, "GET", null);
        setCreatorMode(response.creatorMode);
      } catch (error) {
        console.error('Error fetching creator mode:', error);
      }
    };

    fetchCreatorMode();
  }, []);

  const fetchModules = async (selection) => {
    try {
      const response = await request(
        `${process.env.NEXT_PUBLIC_API_URL}/lessons`, 
        "GET", 
        null
      );

      if (response && response.lessons) {
        // Filter modules based on selection
        const filteredModules = response.lessons.filter(module => {
          if (selection === 'unverified') {
            return !module.published;
          } else if (selection === 'published') {
            return module.published;
          }
          return true;
        });

        setModules(filteredModules);
        setModuleState(selection);
      } else {
        setModules([]);
      }
    } catch (error) {
      console.error('Error fetching modules:', error);
      setModules([]);
    }
  };

  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState({ title: '', videoId: '' });

  const tutorials = [
    {
      title: 'Challenge Creation',
      description: 'Learn how to create engaging CTF challenges',
      icon: 'fas fa-flag',
      iconColor: 'text-blue-400/80',
      gradient: 'from-blue-600/20 via-blue-800/20',
      videoId: 'YOUR_YOUTUBE_VIDEO_ID_1'
    },
    {
      title: 'Writeup Mastery',
      description: 'Master the art of creating helpful writeups',
      icon: 'fas fa-pen-fancy',
      iconColor: 'text-purple-400/80',
      gradient: 'from-purple-600/20 via-purple-800/20',
      videoId: 'YOUR_YOUTUBE_VIDEO_ID_2'
    },
    {
      title: 'Learning Modules',
      description: 'Design educational content for CTF learners',
      icon: 'fas fa-book',
      iconColor: 'text-green-400/80',
      gradient: 'from-green-600/20 via-green-800/20',
      videoId: 'YOUR_YOUTUBE_VIDEO_ID_3'
    }
  ];

  const filterWriteups = (state) => {
    setWriteupState(state);
    if (state === 'all') {
      setWriteups(allWriteups);
    } else {
      const filtered = allWriteups.filter(writeup => {
        if (state === 'draft') return writeup.draft;
        if (state === 'published') return !writeup.draft;
        return true;
      });
      setWriteups(filtered);
    }
  };

  const renderModules = () => {
    const filteredModules = modules.filter(module => {
      if (moduleFilter === 'published') return module.published;
      if (moduleFilter === 'draft') return !module.published;
      return true;
    });

    return (
      <div className="mt-4">
        <div className="flex space-x-4 mb-4">
          <button
            className={`px-4 py-2 rounded ${
              moduleFilter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setModuleFilter('all')}
          >
            All
          </button>
          <button
            className={`px-4 py-2 rounded ${
              moduleFilter === 'published' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setModuleFilter('published')}
          >
            Published
          </button>
          <button
            className={`px-4 py-2 rounded ${
              moduleFilter === 'draft' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setModuleFilter('draft')}
          >
            Drafts
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredModules.map((module) => (
            <div
              key={module.id}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{module.title}</h3>
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    module.published
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {module.published ? 'Published' : 'Draft'}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-2">
                {module.description || 'No description provided'}
              </p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>
                  Last updated: {new Date(module.updatedAt).toLocaleDateString()}
                </span>
                <Link
                  href={`/create/learn/editor?id=${module.id}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredModules.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No {moduleFilter !== 'all' ? moduleFilter : ''} modules found
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>Creator Studio - CTFGuide</title>
      </Head>
      <StandardNav />
      <main className="min-h-screen bg-gradient-to-b from-neutral-900/50 via-neutral-900/30 to-neutral-800/20 backdrop-blur-xl">
        {/* Secondary Navigation */}
        <div className="border-b border-[#232323] bg-[#161616]/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-8 h-16">
              <Link 
                href="/create"
                className={`text-sm font-medium border-b-2 h-full flex items-center transition-colors ${
                  true  // Replace with actual route check
                    ? 'border-blue-500 text-white' 
                    : 'border-transparent text-neutral-400 hover:text-white hover:border-[#333333]'
                }`}
              >
                Home
              </Link>
              <Link 
                href="/create/compute"
                className={`text-sm font-medium border-b-2 h-full flex items-center transition-colors ${
                  false  // Replace with actual route check
                    ? 'border-blue-500 text-white' 
                    : 'border-transparent text-neutral-400 hover:text-white hover:border-[#333333]'
                }`}
              >
                <i className="fas fa-server mr-2"></i>
                Docker Containers <span className="text-xs text-blue-400 px-1 ml-2  rounded bg-blue-900 text-white ">BETA</span>
              </Link>
              <Link 
                href="/create/earnings"
                className={`text-sm font-medium border-b-2 h-full flex items-center transition-colors ${
                  false  // Replace with actual route check
                    ? 'border-blue-500 text-white' 
                    : 'border-transparent text-neutral-400 hover:text-white hover:border-[#333333]'
                }`}
              >
                <i className="fas fa-wallet mr-2"></i>
                Earnings
              </Link>
           
              <Link 
                href="/create/settings"
                className={`hidden text-sm font-medium border-b-2 h-full flex items-center transition-colors ${
                  false  // Replace with actual route check
                    ? 'border-blue-500 text-white' 
                    : 'border-transparent text-neutral-400 hover:text-white hover:border-[#333333]'
                }`}
              >
                <i className="fas fa-cog mr-2"></i>
                Creator Settings
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Header Section with Creator Mode Toggle and Tutorial Cards */}
          <div className="bg-[#161616] rounded-2xl border border-[#232323] shadow-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-2xl font-bold text-white">Creator Studio</h1>
                <p className="text-neutral-400 mt-1">Manage your challenges, modules, and writeups</p>
              </div>
              <div className="flex items-center gap-3">
                <div className={`flex items-center ${creatorMode ? 'text-green-400' : 'text-neutral-400'}`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${creatorMode ? 'bg-green-400' : 'bg-neutral-400'}`}></div>
                  <span className="text-sm">Creator Mode</span>
                </div>
                <button
                  onClick={() => creatorMode ? setIsDisableModalOpen(true) : setIsEnableModalOpen(true)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                    ${creatorMode 
                      ? 'bg-[#1c1c1c] text-neutral-400 hover:bg-[#232323] hover:text-white border border-[#2a2a2a]' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'}
                  `}
                >
                  {creatorMode ? 'Switch to Viewer' : 'Switch to Creator'}
                </button>
              </div>
            </div>

            {/* Tutorial Cards */}
            <div className="hidden grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {tutorials.map((tutorial, index) => (
                <div 
                  key={index}
                  className="group bg-[#1c1c1c] rounded-xl border border-[#2a2a2a] overflow-hidden hover:border-[#333333] transition-all duration-300 cursor-pointer"
                  onClick={() => {
                    setCurrentVideo({
                      title: tutorial.title,
                      videoId: tutorial.videoId
                    });
                    setIsVideoModalOpen(true);
                  }}
                >
                  <div className={`aspect-video w-full overflow-hidden relative bg-gradient-to-br ${tutorial.gradient} to-[#1c1c1c] p-6 flex items-end`}>
                    <div className="absolute top-6 left-6">
                      <i className={`${tutorial.icon} text-2xl ${tutorial.iconColor}`}></i>
                    </div>
                    <h3 className="text-lg text-white font-medium">{tutorial.title}</h3>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-neutral-400 mb-3">{tutorial.description}</p>
                    <span className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 group-hover:translate-x-1 transition-transform">
                      Watch Tutorial
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-[#161616] rounded-2xl border border-[#232323] shadow-2xl p-8 mb-8">
            <h2 className="text-2xl font-semibold text-white mb-6">Creator Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div 
                  key={stat.id} 
                  className="bg-[#1c1c1c] rounded-xl p-6 border border-[#2a2a2a] hover:border-[#333333] transition-all duration-300 hover:transform hover:-translate-y-1"
                >
                  <dt className="text-neutral-400 text-sm font-medium">{stat.name}</dt>
                  <dd className="text-3xl font-semibold text-white mt-2">{stat.value}</dd>
                </div>
              ))}
            </div>
          </div>

          {/* Content Sections Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Challenges Section */}
            <div className="bg-[#161616] rounded-2xl border border-[#232323] shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-[#232323]">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">Challenges</h2>
                  <a href="/create/new" className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition-all duration-300 hover:transform hover:-translate-y-0.5">
                    New Challenge
                  </a>
                </div>
              </div>
              <div className="p-4">
                <div className="flex space-x-2 mb-4">
                  <button 
                    onClick={() => fetchChallenges('unverified')}
                    className={`px-4 py-2 text-sm rounded-lg transition-all duration-300 ${
                      title === 'Unverified' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-[#1c1c1c] text-neutral-400 hover:bg-[#232323] hover:text-white'
                    }`}
                  >
                    Unverified
                  </button>
                  <button 
                    onClick={() => fetchChallenges('pending')}
                    className={`px-4 py-2 text-sm rounded-lg transition-all duration-300 ${
                      title === 'Pending Changes' 
                        ? 'bg-blue-600/90 text-white shadow-lg shadow-blue-600/20' 
                        : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    Pending
                  </button>
                  <button 
                    onClick={() => fetchChallenges('published')}
                    className={`px-4 py-2 text-sm rounded-lg transition-all duration-300 ${
                      title === 'Published' 
                        ? 'bg-blue-600/90 text-white shadow-lg shadow-blue-600/20' 
                        : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    Published
                  </button>
                </div>
                {hasChallenges ? (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-800/50 pr-2">
                    {challenges.map((challenge) => (
                      <div 
                        key={challenge.id}
                        className="flex items-center justify-between p-4 bg-[#1c1c1c] rounded-xl border border-[#2a2a2a] hover:border-[#333333] transition-all duration-300 hover:transform hover:-translate-y-0.5"
                      >
                        <div>
                          <h3 className="text-white font-medium">{challenge.title}</h3>
                          <p className="text-sm text-neutral-400 mt-1">
                            Last updated {new Date(challenge.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex space-x-3">
                          <a 
                            href={`/create/edit?id=${challenge.id}`}
                            className="text-blue-400 hover:text-blue-300 transition-colors p-2 hover:bg-blue-600/10 rounded-lg"
                          >
                            <i className="fas fa-pencil-alt"></i>
                          </a>
                          <a 
                            href={`/challenges/${challenge.id}`}
                            target="_blank"
                            className="text-neutral-400 hover:text-neutral-300 transition-colors p-2 hover:bg-white/10 rounded-lg"
                          >
                            <i className="fas fa-external-link-alt"></i>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-[#1c1c1c] rounded-xl border border-[#2a2a2a]">
                    <i className="fas fa-folder-open text-4xl text-neutral-600 mb-3"></i>
                    <p className="text-neutral-400">No challenges found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Learn Modules Section */}
            <div className="bg-[#161616] rounded-2xl border border-[#232323] shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-[#232323]">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">Learn Modules</h2>
                  <a href="/create/learn/editor" className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition-all duration-300 hover:transform hover:-translate-y-0.5">
                    Open Studio
                  </a>
                </div>
              </div>
              <div className="p-4">
                <div className="flex space-x-2 mb-4">
                  <button 
                    onClick={() => fetchModules('unverified')}
                    className={`px-4 py-2 text-sm rounded-lg transition-all duration-300 ${
                      moduleState === 'unverified' 
                        ? 'bg-blue-600/90 text-white shadow-lg shadow-blue-600/20' 
                        : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    Unverified
                  </button>
                  <button 
                    onClick={() => fetchModules('published')}
                    className={`px-4 py-2 text-sm rounded-lg transition-all duration-300 ${
                      moduleState === 'published' 
                        ? 'bg-blue-600/90 text-white shadow-lg shadow-blue-600/20' 
                        : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    Published
                  </button>
                </div>

                {modules.length > 0 ? (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-800/50 pr-2">
                    {modules.map((module) => (
                      <div 
                        key={module.id}
                        className="flex items-center justify-between p-4 bg-[#1c1c1c] rounded-xl border border-[#2a2a2a] hover:border-[#333333] transition-all duration-300 hover:transform hover:-translate-y-0.5"
                      >
                        <div>
                          <h3 className="text-white font-medium">{module.title}</h3>
                          <p className="text-sm text-neutral-400 mt-1">
                            Last updated {new Date(module.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex space-x-3">
                     
                          <a 
                            href={`/learn/${module.id}`}
                            target="_blank"
                            className="text-neutral-400 hover:text-neutral-300 transition-colors p-2 hover:bg-white/10 rounded-lg"
                          >
                            <i className="fas fa-external-link-alt"></i>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-[#1c1c1c] rounded-xl border border-[#2a2a2a]">
                    <i className="fas fa-book text-4xl text-neutral-600 mb-3"></i>
                    <p className="text-neutral-400">No modules found</p>
                  </div>
                )}
              </div>
            </div>

            {/* Writeups Section */}
            <div className="bg-[#161616] rounded-2xl border border-[#232323] shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-[#232323]">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">Writeups</h2>
                  <button 
                    onClick={() => setIsCreating(true)}
                    className="bg-blue-600/90 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-lg transition-all duration-300 hover:transform hover:-translate-y-0.5 backdrop-blur-xl"
                  >
                    New Writeup
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex space-x-2 mb-4">
                  <button 
                    onClick={() => filterWriteups('all')}
                    className={`px-4 py-2 text-sm rounded-lg transition-all duration-300 ${
                      writeupState === 'all' 
                        ? 'bg-blue-600/90 text-white shadow-lg shadow-blue-600/20' 
                        : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    All
                  </button>
                  <button 
                    onClick={() => filterWriteups('draft')}
                    className={`px-4 py-2 text-sm rounded-lg transition-all duration-300 ${
                      writeupState === 'draft' 
                        ? 'bg-blue-600/90 text-white shadow-lg shadow-blue-600/20' 
                        : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    Drafts
                  </button>
                  <button 
                    onClick={() => filterWriteups('published')}
                    className={`px-4 py-2 text-sm rounded-lg transition-all duration-300 ${
                      writeupState === 'published' 
                        ? 'bg-blue-600/90 text-white shadow-lg shadow-blue-600/20' 
                        : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    Published
                  </button>
                </div>

                {writeups.length > 0 ? (
                  <div className="space-y-3 h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-800/50 p-4">
                    {writeups.map((writeup) => (
                      <div 
                        key={writeup.id}
                        className="flex items-center justify-between p-3 bg-neutral-800/30 rounded-lg hover:bg-neutral-800/50 transition-colors"
                      >
                        <div>
                          <h3 className="text-white font-medium">{writeup.title}</h3>
                          <p className="text-sm text-neutral-400">
                            {writeup.draft ? (
                              <span className="text-yellow-500">Draft</span>
                            ) : (
                              <span className="text-green-500">Published</span>
                            )}
                            {' · '}
                            Last updated {new Date(writeup.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <a 
                            href={`/create/editor?cid=${writeup.id}`}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            <i className="fas fa-pencil-alt"></i>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-[#1c1c1c] rounded-xl border border-[#2a2a2a]">
                    <i className="fas fa-pen-fancy text-4xl text-neutral-700 mb-3"></i>
                    <p className="text-neutral-400">No writeups yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Keep existing modals and notifications */}
      <Menu open={isCreating} setOpen={setIsCreating} solvedChallenges={solvedChallenges} />
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: '#1a1a1a',
          border: '1px solid #333',
          borderRadius: '8px',
          boxShadow: 24,
          p: 4,
        }}>
          <Typography variant="h6" component="h2" sx={{ color: 'white', mb: 2 }}>
            {modalContent}
          </Typography>
        </Box>
      </Modal>
      <ToastContainer position="bottom-right" theme="dark" />

      <Transition appear show={isEnableModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsEnableModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#161616] border border-[#232323] p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-white">
                    Enable Creator Mode
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-neutral-400">
                      Are you sure you want to enable creator mode? This will allow you to see metrics on challenges.
                    </p>
                  </div>

                  <div className="mt-4 flex space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-lg border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none"
                      onClick={handleEnableCreatorMode}
                    >
                      Enable
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-lg border border-[#232323] bg-[#1c1c1c] px-4 py-2 text-sm font-medium text-neutral-400 hover:bg-[#232323] focus:outline-none"
                      onClick={() => setIsEnableModalOpen(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={isDisableModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsDisableModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#161616] border border-[#232323] p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-white">
                    Disable Creator Mode
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-neutral-400">
                      Are you sure you want to disable creator mode? You won't be able to create new content until you enable it again.
                    </p>
                  </div>

                  <div className="mt-4 flex space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-lg border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none"
                      onClick={handleDisableCreatorMode}
                    >
                      Disable
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-lg border border-[#232323] bg-[#1c1c1c] px-4 py-2 text-sm font-medium text-neutral-400 hover:bg-[#232323] focus:outline-none"
                      onClick={() => setIsDisableModalOpen(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Video Modal */}
      <Transition appear show={isVideoModalOpen} as={Fragment}>
        <Dialog 
          as="div" 
          className="relative z-50" 
          onClose={() => setIsVideoModalOpen(false)}
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
            <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-[#161616] border border-[#232323] p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex justify-between items-center mb-4">
                    <Dialog.Title as="h3" className="text-lg font-medium text-white">
                      {currentVideo.title}
                    </Dialog.Title>
                    <button
                      onClick={() => setIsVideoModalOpen(false)}
                      className="text-neutral-400 hover:text-white transition-colors"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                  
                  <div className="relative aspect-video w-full">
                    <iframe
                      className="absolute inset-0 w-full h-full rounded-lg"
                      src={`https://www.youtube.com/embed/${currentVideo.videoId}?autoplay=1`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}