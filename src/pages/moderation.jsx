import React, { useEffect, useState } from 'react';
import {
  ArrowRightIcon,
  QuestionMarkCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
} from '@heroicons/react/20/solid';

import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import request from '@/utils/request';
import ViewChallenge from '@/components/moderation/ViewChallenge';
import ViewReport from '@/components/moderation/ViewReport';

export default function Moderation() {
  // Challenge states
  const [selectedChallenges, setSelectedChallenges] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [pendingChallenges, setPendingChallenges] = useState([]);
  const [challengeIsOpen, setChallengeIsOpen] = useState(false);
  const [bonusPoints, setBonusPoints] = useState(0);

  // Report states
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportIsOpen, setReportIsOpen] = useState(false);

  // User management states
  const [users, setUsers] = useState([]);
  const [currentUserPage, setCurrentUserPage] = useState(0);
  const [totalUserPages, setTotalUserPages] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  // Recent activity states
  const [recentComments, setRecentComments] = useState([]);
  const [recentWriteups, setRecentWriteups] = useState([]);
  const [recentLessons, setRecentLessons] = useState([]);

  // Platform stats
  const [stats, setStats] = useState(null);

  // Active tab state
  const [activeTab, setActiveTab] = useState('overview');

  // Autocomplete states
  const [userSuggestions, setUserSuggestions] = useState([]);
  const [challengeSuggestions, setChallengeSuggestions] = useState([]);
  const [showUserSuggestions, setShowUserSuggestions] = useState(false);
  const [showChallengeSuggestions, setShowChallengeSuggestions] =
    useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [challengeSearchQuery, setChallengeSearchQuery] = useState('');

  // Notification states
  const [notification, setNotification] = useState(null);

  // Notification helper function
  const showNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotification({ id, message, type });
  };

  // Notification component
  const NotificationModal = () => {
    if (!notification) return null;

    const getNotificationIcon = () => {
      switch (notification.type) {
        case 'success':
          return 'fas fa-check-circle';
        case 'error':
          return 'fas fa-exclamation-circle';
        case 'warning':
          return 'fas fa-exclamation-triangle';
        default:
          return 'fas fa-info-circle';
      }
    };

    const icon = getNotificationIcon();

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 duration-300 animate-in fade-in-0">
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm duration-300 animate-in fade-in-0"
          onClick={() => setNotification(null)}
        />
        <div className="relative rounded-2xl border border-neutral-700 bg-neutral-800/95 p-8 shadow-2xl backdrop-blur-md duration-300 animate-in zoom-in-95">
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400">
              <i className={`${icon} text-xl`}></i>
            </div>
            <div className="min-w-0 flex-1">
              <p className="break-words text-lg font-medium text-white">
                {notification.message}
              </p>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-all duration-200 hover:scale-110 hover:bg-neutral-700/50 hover:text-white active:scale-95"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Fetch functions
  const fetchReports = async () => {
    try {
      console.log('Fetching reports...');
      const response = await request(
        process.env.NEXT_PUBLIC_API_URL + '/reports',
        'GET'
      );
      console.log('Reports response:', response);
      setReports(response || []);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
      setReports([]);
    }
  };

  const fetchPendingChallenges = async () => {
    try {
      console.log('Fetching pending challenges...');
      const response = await request(
        process.env.NEXT_PUBLIC_API_URL + '/pending',
        'GET'
      );
      console.log('Pending challenges response:', response);
      setPendingChallenges(response || []);
    } catch (error) {
      console.error('Failed to fetch pending challenges:', error);
      setPendingChallenges([]);
    }
  };

  const fetchUsers = async (page = 0) => {
    try {
      console.log('Fetching users for page:', page);
      const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/users?page=${page}&size=30&order=createdAt&ordertype=desc`;
      console.log('Fetching from URL:', url);

      const response = await request(url, 'GET');
      console.log('Users API response:', response);

      if (response === null) {
        console.error('Request returned null - likely authentication issue');
        setUsers([]);
        setTotalUserPages(0);
        setTotalUsers(0);
        setCurrentUserPage(0);
        return;
      }

      if (response && response.result) {
        console.log('Setting users data:', response.result.length, 'users');
        setUsers(response.result || []);
        setTotalUserPages((response.lastPage || 0) + 1);
        setTotalUsers(response.totalEntries || 0);
        setCurrentUserPage(page);
      } else {
        console.error('Invalid response format:', response);
        if (response && response.error) {
          console.error('API Error:', response.error);
        }
        setUsers([]);
        setTotalUserPages(0);
        setTotalUsers(0);
        setCurrentUserPage(0);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setUsers([]);
      setTotalUserPages(0);
      setTotalUsers(0);
      setCurrentUserPage(0);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      console.log('Fetching recent activity...');
      const [commentsRes, writeupsRes, lessonsRes] = await Promise.all([
        request(`${process.env.NEXT_PUBLIC_API_URL}/activity/comments`, 'GET'),
        request(`${process.env.NEXT_PUBLIC_API_URL}/activity/writeups`, 'GET'),
        request(`${process.env.NEXT_PUBLIC_API_URL}/activity/lessons`, 'GET'),
      ]);
      console.log('Activity responses:', {
        commentsRes,
        writeupsRes,
        lessonsRes,
      });
      setRecentComments(commentsRes || []);
      setRecentWriteups(writeupsRes || []);
      setRecentLessons(lessonsRes || []);
    } catch (error) {
      console.error('Failed to fetch recent activity:', error);
      setRecentComments([]);
      setRecentWriteups([]);
      setRecentLessons([]);
    }
  };

  const fetchStats = async () => {
    try {
      console.log('Fetching platform stats...');
      const response = await request(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/stats`,
        'GET'
      );
      console.log('Stats response:', response);
      setStats(response);
    } catch (error) {
      console.error('Failed to fetch platform stats', error);
      setStats(null);
    }
  };

  // Autocomplete functions
  const fetchUserSuggestions = async (query) => {
    if (!query || query.length < 2) {
      setUserSuggestions([]);
      setShowUserSuggestions(false);
      return;
    }

    try {
      const response = await request(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/admin/users?search=${encodeURIComponent(query)}&size=10`,
        'GET'
      );

      if (response && response.result) {
        setUserSuggestions(response.result);
        setShowUserSuggestions(true);
      } else {
        setUserSuggestions([]);
        setShowUserSuggestions(false);
      }
    } catch (error) {
      console.error('Failed to fetch user suggestions:', error);
      setUserSuggestions([]);
      setShowUserSuggestions(false);
    }
  };

  const fetchChallengeSuggestions = async (query) => {
    if (!query || query.length < 2) {
      setChallengeSuggestions([]);
      setShowChallengeSuggestions(false);
      return;
    }

    try {
      // Try to fetch both pending and approved challenges
      const [pendingRes, approvedRes] = await Promise.all([
        request(`${process.env.NEXT_PUBLIC_API_URL}/pending`, 'GET'),
        request(
          `${
            process.env.NEXT_PUBLIC_API_URL
          }/challenges?search=${encodeURIComponent(query)}&limit=10`,
          'GET'
        ),
      ]);

      let suggestions = [];

      // Add pending challenges
      if (pendingRes && Array.isArray(pendingRes)) {
        const filteredPending = pendingRes.filter(
          (challenge) =>
            challenge.title.toLowerCase().includes(query.toLowerCase()) ||
            challenge.id.toLowerCase().includes(query.toLowerCase())
        );
        suggestions = [...suggestions, ...filteredPending];
      }

      // Add approved challenges
      if (approvedRes && Array.isArray(approvedRes)) {
        const filteredApproved = approvedRes.filter(
          (challenge) =>
            challenge.title.toLowerCase().includes(query.toLowerCase()) ||
            challenge.id.toLowerCase().includes(query.toLowerCase())
        );
        suggestions = [...suggestions, ...filteredApproved];
      }

      // Remove duplicates and limit to 10
      const uniqueSuggestions = suggestions
        .filter(
          (challenge, index, self) =>
            index === self.findIndex((c) => c.id === challenge.id)
        )
        .slice(0, 10);

      setChallengeSuggestions(uniqueSuggestions);
      setShowChallengeSuggestions(uniqueSuggestions.length > 0);
    } catch (error) {
      console.error('Failed to fetch challenge suggestions:', error);
      setChallengeSuggestions([]);
      setShowChallengeSuggestions(false);
    }
  };

  // Handle autocomplete selection
  const handleUserSelection = (user) => {
    setUserSearchQuery(user.username);
    document.getElementById('usernameInput').value = user.username;
    setShowUserSuggestions(false);
  };

  const handleChallengeSelection = (challenge) => {
    setChallengeSearchQuery(challenge.id);
    document.getElementById('challengeIdInput').value = challenge.id;
    setShowChallengeSuggestions(false);
  };

  // Handle input changes
  const handleUserInputChange = (e) => {
    const value = e.target.value;
    setUserSearchQuery(value);

    if (value.length === 0) {
      setUserSuggestions([]);
      setShowUserSuggestions(false);
    } else {
      fetchUserSuggestions(value);
    }
  };

  const handleChallengeInputChange = (e) => {
    const value = e.target.value;
    setChallengeSearchQuery(value);

    if (value.length === 0) {
      setChallengeSuggestions([]);
      setShowChallengeSuggestions(false);
    } else {
      fetchChallengeSuggestions(value);
    }
  };

  // Handle functions
  const handleSelectChallenge = (id) => {
    setSelectedChallenges((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const resetFields = () => {
    document.getElementById('usernameInput').value = '';
    document.getElementById('reasonInput').value = '';
    setUserSearchQuery('');
    setShowUserSuggestions(false);
    setUserSuggestions([]);
  };

  const resetChallengeFields = () => {
    document.getElementById('challengeIdInput').value = '';
    document.getElementById('challengeReasonInput').value = '';
    setChallengeSearchQuery('');
    setShowChallengeSuggestions(false);
    setChallengeSuggestions([]);
  };

  const handleApproveChallenge = async () => {
    try {
      const response = await request(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/challenges/${selectedId}/approve`,
        'POST',
        { bonusPoints }
      );
      console.log(response);
      fetchPendingChallenges();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteChallenge = async () => {
    const challengeId = document.getElementById('challengeIdInput').value;
    const reason = document.getElementById('challengeReasonInput').value;

    try {
      const response = await request(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/${challengeId}/deleteChallenge`,
        'POST',
        { reason }
      );
      if (response.success) {
        showNotification('Challenge deleted successfully!', 'success');
      } else {
        showNotification('Failed to delete challenge.', 'error');
      }

      resetChallengeFields();
    } catch (err) {
      console.log(err);
      showNotification(
        'An error occurred while deleting the challenge.',
        'error'
      );
    }
  };

  const handleUnapproveChallenge = async () => {
    const challengeId = document.getElementById('challengeIdInput').value;
    const reason = document.getElementById('challengeReasonInput').value;

    try {
      const response = await request(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/${challengeId}/unapproveChallenge`,
        'POST',
        { reason }
      );
      if (response.success) {
        showNotification('Challenge unapproved successfully!', 'success');
      } else {
        showNotification('Failed to unapprove challenge.', 'error');
      }

      resetChallengeFields();
    } catch (err) {
      console.log(err);
      showNotification(
        'An error occurred while unapproving the challenge.',
        'error'
      );
    }
  };

  const handleResyncLeaderboard = async () => {
    try {
      const response = await request(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/syncLeaderboard`,
        'POST'
      );
      if (response.success) {
        showNotification('Leaderboard resynced successfully!', 'success');
      } else {
        showNotification('Failed to resync leaderboard.', 'error');
      }
    } catch (err) {
      console.log(err);
      showNotification(
        'An error occurred while resyncing the leaderboard.',
        'error'
      );
    }
  };

  const handleResetPFP = async () => {
    const username = document.getElementById('usernameInput').value;
    const reason = document.getElementById('reasonInput').value;

    if (!username) {
      showNotification('Please enter a username.', 'warning');
      return;
    }

    try {
      const response = await request(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/${username}/resetPFP`,
        'POST',
        { reason }
      );
      if (response.success) {
        showNotification('Profile picture reset successfully!', 'success');
      } else {
        showNotification('Failed to reset profile picture.', 'error');
      }
      resetFields();
    } catch (error) {
      console.error(error);
      showNotification(
        'An error occurred while resetting the profile picture.',
        'error'
      );
    }
  };

  const deleteBulk = async () => {
    if (selectedChallenges.length === 0) {
      showNotification('No challenges selected.', 'warning');
      return;
    }

    if (!confirm('Are you sure you want to delete the selected challenges?')) {
      return;
    }

    try {
      const response = await request(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/deleteChallenges`,
        'POST',
        { challengeIds: selectedChallenges }
      );
      if (response.success) {
        showNotification(
          'Selected challenges deleted successfully!',
          'success'
        );
        setSelectedChallenges([]);
        fetchPendingChallenges();
      } else {
        showNotification('Failed to delete selected challenges.', 'error');
      }
    } catch (error) {
      console.error(error);
      showNotification(
        'An error occurred while deleting the selected challenges.',
        'error'
      );
    }
  };

  const handleResetBanner = async () => {
    const username = document.getElementById('usernameInput').value;
    const reason = document.getElementById('reasonInput').value;

    if (!username) {
      showNotification('Please enter a username.', 'warning');
      return;
    }

    try {
      const response = await request(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/${username}/resetBanner`,
        'POST',
        { reason }
      );
      if (response.success) {
        showNotification('Banner reset successfully!', 'success');
      } else {
        showNotification('Failed to reset banner.', 'error');
      }
      resetFields();
    } catch (err) {
      console.log(err);
      showNotification(
        'An error occurred while resetting the banner.',
        'error'
      );
    }
  };

  const handleDisableAccount = async () => {
    const username = document.getElementById('usernameInput').value;
    const reason = document.getElementById('reasonInput').value;

    if (!username) {
      showNotification('Please enter a username.', 'warning');
      return;
    }

    try {
      const response = await request(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/${username}/disableAccount`,
        'POST',
        { reason }
      );
      if (response.success) {
        showNotification('Account disabled successfully!', 'success');
      } else {
        showNotification('Failed to disable account.', 'error');
      }
      resetFields();
    } catch (err) {
      console.log(err);
      showNotification(
        'An error occurred while disabling the account.',
        'error'
      );
    }
  };

  const handleResetBio = async () => {
    const username = document.getElementById('usernameInput').value;
    const reason = document.getElementById('reasonInput').value;

    if (!username) {
      showNotification('Please enter a username.', 'warning');
      return;
    }

    try {
      const response = await request(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/${username}/resetBio`,
        'POST',
        { reason }
      );
      if (response.success) {
        showNotification('Bio reset successfully!', 'success');
      } else {
        showNotification('Failed to reset bio.', 'error');
      }
      resetFields();
    } catch (err) {
      console.log(err);
      showNotification('An error occurred while resetting the bio.', 'error');
    }
  };

  const handleEnableAccount = async () => {
    const username = document.getElementById('usernameInput').value;
    const reason = document.getElementById('reasonInput').value;

    if (!username) {
      showNotification('Please enter a username.', 'warning');
      return;
    }

    try {
      const response = await request(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/${username}/enableAccount`,
        'POST',
        { reason }
      );
      if (response.success) {
        showNotification('Account enabled successfully!', 'success');
      } else {
        showNotification('Failed to enable account.', 'error');
      }
      resetFields();
    } catch (err) {
      console.log(err);
      showNotification(
        'An error occurred while enabling the account.',
        'error'
      );
    }
  };

  const handleWarnUser = async () => {
    const username = document.getElementById('usernameInput').value;
    const reason = document.getElementById('reasonInput').value;

    if (!username) {
      showNotification('Please enter a username.', 'warning');
      return;
    }

    try {
      const response = await request(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/${username}/warnUser`,
        'POST',
        { reason }
      );
      if (response.success) {
        showNotification('User warned successfully!', 'success');
      } else {
        showNotification('Failed to warn user.', 'error');
      }
      resetFields();
    } catch (err) {
      console.log(err);
      showNotification('An error occurred while warning the user.', 'error');
    }
  };

  // User pagination handlers
  const handleNextUserPage = () => {
    if (currentUserPage < totalUserPages - 1) {
      fetchUsers(currentUserPage + 1);
    }
  };

  const handlePrevUserPage = () => {
    if (currentUserPage > 0) {
      fetchUsers(currentUserPage - 1);
    }
  };

  // Initial data fetch
  useEffect(() => {
    console.log('=== MODERATION PANEL INITIALIZING ===');
    console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
    console.log('Starting data fetch sequence...');

    const fetchAllData = async () => {
      try {
        console.log('1. Fetching reports...');
        await fetchReports();

        console.log('2. Fetching pending challenges...');
        await fetchPendingChallenges();

        console.log('3. Fetching users...');
        await fetchUsers();

        console.log('4. Fetching recent activity...');
        await fetchRecentActivity();

        console.log('5. Fetching stats...');
        await fetchStats();

        console.log('=== ALL DATA FETCH COMPLETE ===');
      } catch (error) {
        console.error('Error in data fetch sequence:', error);
      }
    };

    fetchAllData();
  }, []);

  // Handle clicking outside autocomplete dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      const userInput = document.getElementById('usernameInput');
      const challengeInput = document.getElementById('challengeIdInput');

      if (
        userInput &&
        !userInput.contains(event.target) &&
        !event.target.closest('.user-suggestions')
      ) {
        setShowUserSuggestions(false);
      }

      if (
        challengeInput &&
        !challengeInput.contains(event.target) &&
        !event.target.closest('.challenge-suggestions')
      ) {
        setShowChallengeSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Tab navigation component
  const TabButton = ({ id, label, icon: Icon, count }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center rounded-lg px-4 py-2 font-medium transition-all duration-200 ${
        activeTab === id
          ? 'bg-blue-600 text-white shadow-lg'
          : 'bg-neutral-800 text-gray-300 hover:bg-neutral-700 hover:text-white'
      }`}
    >
      <Icon className="mr-2 h-5 w-5" />
      {label}
      {count !== undefined && (
        <span
          className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
            activeTab === id ? 'bg-blue-500' : 'bg-neutral-600'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );

  return (
    <>
      <Head>
        <title>CTFGuide Moderation Panel</title>
        <meta name="description" content="Modern Moderation Panel" />
        <style>
          @import
          url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
        </style>
      </Head>
      <div className="flex min-h-screen flex-col bg-neutral-900">
        <StandardNav />
        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8 flex flex-col items-start justify-between sm:flex-row sm:items-center">
              <div>
                <h1 className="mb-2 text-3xl font-bold text-white">
                  Admin Center
                </h1>
                <p className="text-lg text-gray-400">
                  ΥΠΕΡΑΣΠΙΣΗ ΤΟΥ CTFGUIDE ΑΠΟ ΤΟ OPS
                </p>
              </div>
              <div className="mt-4 flex items-center sm:mt-0">
                <i className="fa fa-shield-alt text-4xl text-blue-500"></i>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="mb-8 flex flex-wrap gap-2">
              <TabButton id="overview" label="Overview" icon={ChartBarIcon} />
              <TabButton
                id="users"
                label="Users"
                icon={UserGroupIcon}
                count={totalUsers}
              />
              <TabButton
                id="challenges"
                label="Challenges"
                icon={DocumentTextIcon}
                count={pendingChallenges.length}
              />
              <TabButton
                id="reports"
                label="Reports"
                icon={ExclamationTriangleIcon}
                count={reports.length}
              />
              <TabButton
                id="activity"
                label="Activity"
                icon={DocumentTextIcon}
              />
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Platform Stats */}
                <div className="rounded-xl border border-neutral-700 bg-neutral-800 p-6">
                  <h2 className="mb-4 text-xl font-semibold text-white">
                    Platform Statistics
                  </h2>
                  {stats ? (
                    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <div className="rounded-lg bg-neutral-700 p-4 text-center">
                        <p className="text-2xl font-bold text-white">
                          {stats.userCount}
                        </p>
                        <p className="text-gray-400">Total Users</p>
                      </div>
                      <div className="rounded-lg bg-neutral-700 p-4 text-center">
                        <p className="text-2xl font-bold text-white">
                          {stats.challengeCount}
                        </p>
                        <p className="text-gray-400">Total Challenges</p>
                      </div>
                      <div className="rounded-lg bg-neutral-700 p-4 text-center">
                        <p className="text-2xl font-bold text-white">
                          {stats.verifiedChallengeCount}
                        </p>
                        <p className="text-gray-400">Verified Challenges</p>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <p className="text-red-400">Failed to load statistics</p>
                    </div>
                  )}

                  {/* Recent Sign-Ups Section */}
                  {stats &&
                    stats.recentSignUps &&
                    stats.recentSignUps.length > 0 && (
                      <div className="mt-6">
                        <div className="mb-4 flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-white">
                            Recent Sign-Ups
                          </h3>
                          <div className="text-right">
                            <p className="text-sm text-blue-400">
                              {stats.recentSignUpsCount24h || 0} users joined in
                              last 24h
                            </p>
                            <p className="text-xs text-gray-500">
                              Showing latest{' '}
                              {Math.min(6, stats.recentSignUps.length)} users
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                          {stats.recentSignUps.slice(0, 6).map((user) => (
                            <div
                              key={user.id}
                              className="cursor-pointer rounded-lg bg-neutral-700 p-3 transition-colors duration-200 hover:bg-neutral-600"
                              onClick={() =>
                                window.open(`/users/${user.username}`, '_blank')
                              }
                            >
                              <div className="flex flex-col items-center text-center">
                                <img
                                  src={
                                    user.profileImage ||
                                    'https://robohash.org/' + user.username
                                  }
                                  alt={`${user.username}'s profile`}
                                  className="mb-2 h-12 w-12 rounded-full"
                                />
                                <div className="w-full min-w-0">
                                  <p className="truncate text-sm font-medium text-white">
                                    {user.username}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {new Date(
                                      user.createdAt
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
                  {/* User Actions */}
                  <div className="group rounded-2xl border border-neutral-700/50 bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 p-8 backdrop-blur-sm transition-all duration-300 hover:border-neutral-600/50 hover:shadow-xl hover:shadow-neutral-900/20">
                    <div className="mb-6 flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400">
                        <i className="fas fa-users text-lg"></i>
                      </div>
                      <h3 className="text-xl  text-white">User Management</h3>
                    </div>

                    <div className="space-y-4">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                          <i className="fas fa-user text-gray-400"></i>
                        </div>
                        <input
                          type="text"
                          placeholder="Enter username to manage"
                          className="w-full rounded-xl border-0 bg-neutral-700/80 py-3 pl-12 pr-4 text-white placeholder-gray-400 shadow-inner transition-all duration-200 focus:bg-neutral-700 focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-0"
                          id="usernameInput"
                          value={userSearchQuery}
                          onChange={handleUserInputChange}
                          onFocus={() => {
                            if (userSuggestions.length > 0) {
                              setShowUserSuggestions(true);
                            }
                          }}
                          onBlur={() => {
                            // Delay hiding suggestions to allow clicking
                            setTimeout(
                              () => setShowUserSuggestions(false),
                              200
                            );
                          }}
                          autoComplete="off"
                        />

                        {/* User Suggestions Dropdown */}
                        {showUserSuggestions && userSuggestions.length > 0 && (
                          <div className="user-suggestions absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-y-auto rounded-xl border border-neutral-600 bg-neutral-800 shadow-lg">
                            {userSuggestions.map((user) => (
                              <div
                                key={user.id}
                                className="flex cursor-pointer items-center space-x-3 px-4 py-3 transition-colors duration-200 hover:bg-neutral-700"
                                onClick={() => handleUserSelection(user)}
                              >
                                <img
                                  src={
                                    user.profileImage ||
                                    'https://robohash.org/' + user.username
                                  }
                                  alt={`${user.username}'s profile`}
                                  className="h-8 w-8 rounded-full"
                                />
                                <div className="flex-1">
                                  <p className="font-medium text-white">
                                    {user.username}
                                  </p>
                                  <p className="text-sm text-gray-400">
                                    {user.points || 0} points • Joined{' '}
                                    {new Date(
                                      user.createdAt
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                                {user.disabled && (
                                  <span className="rounded-full bg-red-600 px-2 py-1 text-xs text-white">
                                    Disabled
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="relative">
                        <div className="absolute left-4 top-3">
                          <i className="fas fa-comment-alt text-gray-400"></i>
                        </div>
                        <textarea
                          placeholder="Reason for action (required for audit trail)"
                          className="w-full rounded-xl border-0 bg-neutral-700/80 py-3 pl-12 pr-4 text-white placeholder-gray-400 shadow-inner transition-all duration-200 focus:bg-neutral-700 focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-0"
                          rows="3"
                          id="reasonInput"
                        />
                      </div>

                      <div className="space-y-8">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <button
                            className="group/btn flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-4 py-3 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:from-red-500 hover:to-red-600 hover:shadow-xl hover:shadow-red-500/25 active:scale-95"
                            onClick={handleDisableAccount}
                          >
                            <i className="fas fa-ban transition-transform group-hover/btn:scale-110"></i>
                            <span>Disable Account</span>
                          </button>

                          <button
                            className="group/btn flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-green-600 to-green-700 px-4 py-3 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:from-green-500 hover:to-green-600 hover:shadow-xl hover:shadow-green-500/25 active:scale-95"
                            onClick={handleEnableAccount}
                          >
                            <i className="fas fa-check transition-transform group-hover/btn:scale-110"></i>
                            <span>Enable Account</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <button
                            className="group/btn flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 px-4 py-3 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:from-amber-500 hover:to-orange-500 hover:shadow-xl hover:shadow-amber-500/25 active:scale-95"
                            onClick={handleWarnUser}
                          >
                            <i className="fas fa-exclamation-triangle transition-transform group-hover/btn:scale-110"></i>
                            <span>Warn User</span>
                          </button>

                          <button
                            className="group/btn flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:from-blue-500 hover:to-blue-600 hover:shadow-xl hover:shadow-blue-500/25 active:scale-95"
                            onClick={handleResetPFP}
                          >
                            <i className="fas fa-user-circle transition-transform group-hover/btn:scale-110"></i>
                            <span>Reset Avatar</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <button
                            className="group/btn flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 px-4 py-3 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:from-purple-500 hover:to-purple-600 hover:shadow-xl hover:shadow-purple-500/25 active:scale-95"
                            onClick={handleResetBanner}
                          >
                            <i className="fas fa-image transition-transform group-hover/btn:scale-110"></i>
                            <span>Reset Banner</span>
                          </button>

                          <button
                            className="group/btn flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 py-3 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:from-indigo-500 hover:to-indigo-600 hover:shadow-xl hover:shadow-indigo-500/25 active:scale-95"
                            onClick={handleResetBio}
                          >
                            <i className="fas fa-info-circle transition-transform group-hover/btn:scale-110"></i>
                            <span>Reset Bio</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Challenge Actions */}
                  <div className="group rounded-2xl border border-neutral-700/50 bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 p-8 backdrop-blur-sm transition-all duration-300 hover:border-neutral-600/50 hover:shadow-xl hover:shadow-neutral-900/20">
                    <div className="mb-6 flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600/20 text-emerald-400">
                        <i className="fas fa-flag text-lg"></i>
                      </div>
                      <h3 className="text-xl text-white">
                        Challenge Management
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                          <i className="fas fa-hashtag text-gray-400"></i>
                        </div>
                        <input
                          type="text"
                          placeholder="Enter challenge ID or search by title"
                          className="w-full rounded-xl border-0 bg-neutral-700/80 py-3 pl-12 pr-4 text-white placeholder-gray-400 shadow-inner transition-all duration-200 focus:bg-neutral-700 focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-0"
                          id="challengeIdInput"
                          value={challengeSearchQuery}
                          onChange={handleChallengeInputChange}
                          onFocus={() => {
                            if (challengeSuggestions.length > 0) {
                              setShowChallengeSuggestions(true);
                            }
                          }}
                          onBlur={() => {
                            // Delay hiding suggestions to allow clicking
                            setTimeout(
                              () => setShowChallengeSuggestions(false),
                              200
                            );
                          }}
                          autoComplete="off"
                        />

                        {/* Challenge Suggestions Dropdown */}
                        {showChallengeSuggestions &&
                          challengeSuggestions.length > 0 && (
                            <div className="challenge-suggestions absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-y-auto rounded-xl border border-neutral-600 bg-neutral-800 shadow-lg">
                              {challengeSuggestions.map((challenge) => (
                                <div
                                  key={challenge.id}
                                  className="cursor-pointer px-4 py-3 transition-colors duration-200 hover:bg-neutral-700"
                                  onClick={() =>
                                    handleChallengeSelection(challenge)
                                  }
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                      <p className="font-medium text-white">
                                        {challenge.title}
                                      </p>
                                      <p className="text-sm text-gray-400">
                                        ID: {challenge.id}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        Created by{' '}
                                        {challenge.creator ||
                                          challenge.author ||
                                          'Unknown'}{' '}
                                        •{' '}
                                        {new Date(
                                          challenge.createdAt
                                        ).toLocaleDateString()}
                                      </p>
                                    </div>
                                    <div className="flex flex-col items-end space-y-1">
                                      {challenge.verified ? (
                                        <span className="rounded-full bg-green-600 px-2 py-1 text-xs text-white">
                                          Approved
                                        </span>
                                      ) : (
                                        <span className="rounded-full bg-yellow-600 px-2 py-1 text-xs text-white">
                                          Pending
                                        </span>
                                      )}
                                      {challenge.difficulty && (
                                        <span className="rounded bg-neutral-600 px-2 py-0.5 text-xs text-gray-300">
                                          {challenge.difficulty}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                      </div>

                      <div className="relative">
                        <div className="absolute left-4 top-3">
                          <i className="fas fa-comment-alt text-gray-400"></i>
                        </div>
                        <textarea
                          placeholder="Reason for action (required for audit trail)"
                          className="w-full rounded-xl border-0 bg-neutral-700/80 py-3 pl-12 pr-4 text-white placeholder-gray-400 shadow-inner transition-all duration-200 focus:bg-neutral-700 focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-0"
                          rows="3"
                          id="challengeReasonInput"
                        />
                      </div>

                      <div className="space-y-3">
                        <button
                          className="group/btn flex w-full items-center justify-center space-x-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 font-medium text-white shadow-lg transition-all duration-200 hover:from-red-500 hover:to-red-600 hover:shadow-xl hover:shadow-red-500/25 active:scale-95"
                          onClick={handleDeleteChallenge}
                        >
                          <i className="fas fa-trash-alt transition-transform group-hover/btn:scale-110"></i>
                          <span>Delete Challenge</span>
                          <div className="ml-auto rounded-full bg-red-500/30 px-2 py-1 text-xs">
                            Permanent
                          </div>
                        </button>

                        <button
                          className="group/btn flex w-full items-center justify-center space-x-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-4 font-medium text-white shadow-lg transition-all duration-200 hover:from-amber-500 hover:to-orange-500 hover:shadow-xl hover:shadow-amber-500/25 active:scale-95"
                          onClick={handleUnapproveChallenge}
                        >
                          <i className="fas fa-undo transition-transform group-hover/btn:scale-110"></i>
                          <span>Unapprove Challenge</span>
                          <div className="ml-auto rounded-full bg-amber-500/30 px-2 py-1 text-xs">
                            Reversible
                          </div>
                        </button>

                        <button
                          className="group/btn flex w-full items-center justify-center space-x-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 font-medium text-white shadow-lg transition-all duration-200 hover:from-purple-500 hover:to-indigo-500 hover:shadow-xl hover:shadow-purple-500/25 active:scale-95"
                          onClick={handleResyncLeaderboard}
                        >
                          <i className="fas fa-sync-alt transition-transform group-hover/btn:scale-110"></i>
                          <span>Resync Leaderboard</span>
                          <div className="ml-auto rounded-full bg-purple-500/30 px-2 py-1 text-xs">
                            System
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="rounded-xl border border-neutral-700 bg-neutral-800 p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">
                    User Management
                  </h2>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-400">
                      Page {currentUserPage + 1} of {totalUserPages || 1} (
                      {totalUsers} total users)
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={handlePrevUserPage}
                        disabled={currentUserPage === 0}
                        className="rounded-lg bg-neutral-700 p-2 text-white transition-colors duration-200 hover:bg-neutral-600 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <ChevronLeftIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={handleNextUserPage}
                        disabled={currentUserPage >= totalUserPages - 1}
                        className="rounded-lg bg-neutral-700 p-2 text-white transition-colors duration-200 hover:bg-neutral-600 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <ChevronRightIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {users && users.length > 0 ? (
                    users.map((user) => (
                      <div
                        key={user.id}
                        className="cursor-pointer rounded-lg bg-neutral-700 p-4 transition-colors duration-200 hover:bg-neutral-600"
                        onClick={() =>
                          window.open(`/users/${user.username}`, '_blank')
                        }
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={
                              user.profileImage ||
                              'https://robohash.org/' + user.username
                            }
                            alt={`${user.username}'s profile`}
                            className="h-12 w-12 rounded-full"
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-white">
                              {user.username}
                            </p>
                            <p className="text-sm text-gray-400">
                              {user.points || 0} points
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-8 text-center">
                      <p className="text-gray-400">
                        {totalUsers === 0
                          ? 'Loading users...'
                          : 'No users found'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'challenges' && (
              <div className="rounded-xl border border-neutral-700 bg-neutral-800 p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">
                    Pending Challenges
                  </h2>
                  {selectedChallenges.length > 0 && (
                    <button
                      className="rounded-lg bg-red-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-red-500"
                      onClick={deleteBulk}
                    >
                      <i className="fa fa-trash mr-2"></i>Delete Selected (
                      {selectedChallenges.length})
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {pendingChallenges && pendingChallenges.length > 0 ? (
                    pendingChallenges.map((challenge) => (
                      <div
                        key={challenge.id}
                        onClick={() => {
                          setSelectedId(challenge.id);
                          setChallengeIsOpen(true);
                        }}
                        className="cursor-pointer rounded-lg bg-neutral-700 p-4 transition-colors duration-200 hover:bg-neutral-600"
                      >
                        <div className="flex items-center space-x-3">
                          <input
                            onClick={(e) => e.stopPropagation()}
                            type="checkbox"
                            checked={selectedChallenges.includes(challenge.id)}
                            onChange={() => handleSelectChallenge(challenge.id)}
                            className="h-4 w-4 rounded border-neutral-500 bg-neutral-600 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-white">
                              {challenge.title}
                            </h3>
                            <p className="text-sm text-gray-400">
                              Submitted by{' '}
                              <span className="font-medium">
                                {challenge.creator}
                              </span>
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-400">
                              {new Date(challenge.createdAt).toLocaleString(
                                [],
                                {
                                  hour: 'numeric',
                                  minute: 'numeric',
                                  hour12: true,
                                  month: 'short',
                                  day: 'numeric',
                                }
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center">
                      <p className="text-gray-400">No pending challenges</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="rounded-xl border border-neutral-700 bg-neutral-800 p-6">
                <h2 className="mb-6 text-xl font-semibold text-white">
                  Submitted Reports
                </h2>
                <div className="space-y-3">
                  {reports && reports.length > 0 ? (
                    reports.map((report) => {
                      let metadata = {};
                      try {
                        metadata = JSON.parse(report.metadata || '{}');
                      } catch (e) {
                        console.error('Failed to parse report metadata:', e);
                      }

                      return (
                        <div
                          key={report.id}
                          className={`cursor-pointer rounded-lg p-4 transition-colors duration-200 ${
                            metadata.severity === 'HIGH'
                              ? 'border border-red-800 bg-red-900/30 hover:bg-red-900/40'
                              : metadata.severity === 'MEDIUM'
                              ? 'border border-yellow-800 bg-yellow-900/30 hover:bg-yellow-900/40'
                              : metadata.severity === 'LOW'
                              ? 'border border-blue-800 bg-blue-900/30 hover:bg-blue-900/40'
                              : 'bg-neutral-700 hover:bg-neutral-600'
                          }`}
                          onClick={() => {
                            setSelectedReport(report);
                            setReportIsOpen(true);
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-white">
                                {report.type} REPORT
                                {metadata.severity && (
                                  <span
                                    className={`ml-2 rounded px-2 py-0.5 text-xs font-medium ${
                                      metadata.severity === 'HIGH'
                                        ? 'bg-red-600 text-white'
                                        : metadata.severity === 'MEDIUM'
                                        ? 'bg-yellow-600 text-white'
                                        : metadata.severity === 'LOW'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-neutral-600 text-white'
                                    }`}
                                  >
                                    {metadata.severity}
                                  </span>
                                )}
                              </h3>
                              <p className="mt-1 text-sm text-gray-400">
                                {report.desc && report.desc.length > 100
                                  ? `${report.desc.substring(0, 100)}...`
                                  : report.desc}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-400">
                                Reported by{' '}
                                <span className="font-medium">
                                  {report.userId}
                                </span>
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(report.createdAt).toLocaleString([], {
                                  hour: 'numeric',
                                  minute: 'numeric',
                                  hour12: true,
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="py-8 text-center">
                      <p className="text-gray-400">No reports to show</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-6">
                {/* Recent Comments */}
                <div className="rounded-xl border border-neutral-700 bg-neutral-800 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-white">
                    Recent Comments
                  </h3>
                  <div className="space-y-3">
                    {recentComments && recentComments.length > 0 ? (
                      recentComments.map((comment) => (
                        <div
                          key={comment.id}
                          className="rounded-lg bg-neutral-700 p-4"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="text-sm text-white">
                                {comment.content}
                              </p>
                              <p className="mt-2 text-xs text-gray-400">
                                by{' '}
                                <span className="font-medium">
                                  {comment.user?.username || 'Unknown'}
                                </span>
                                {comment.challenge && (
                                  <span>
                                    {' '}
                                    on{' '}
                                    <span className="font-medium">
                                      {comment.challenge.title}
                                    </span>
                                  </span>
                                )}
                              </p>
                            </div>
                            <p className="text-xs text-gray-500">
                              {new Date(comment.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="py-4 text-center text-gray-400">
                        No recent comments
                      </p>
                    )}
                  </div>
                </div>

                {/* Recent Writeups */}
                <div className="rounded-xl border border-neutral-700 bg-neutral-800 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-white">
                    Recent Writeups
                  </h3>
                  <div className="space-y-3">
                    {recentWriteups && recentWriteups.length > 0 ? (
                      recentWriteups.map((writeup) => (
                        <div
                          key={writeup.id}
                          className="rounded-lg bg-neutral-700 p-4"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-white">
                                {writeup.title}
                              </h4>
                              <p className="mt-1 text-xs text-gray-400">
                                by{' '}
                                <span className="font-medium">
                                  {writeup.user?.username || 'Unknown'}
                                </span>
                                {writeup.challenge && (
                                  <span>
                                    {' '}
                                    for{' '}
                                    <span className="font-medium">
                                      {writeup.challenge.title}
                                    </span>
                                  </span>
                                )}
                              </p>
                            </div>
                            <p className="text-xs text-gray-500">
                              {new Date(writeup.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="py-4 text-center text-gray-400">
                        No recent writeups
                      </p>
                    )}
                  </div>
                </div>

                {/* Recent Lessons */}
                <div className="rounded-xl border border-neutral-700 bg-neutral-800 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-white">
                    Recent Lessons
                  </h3>
                  <div className="space-y-3">
                    {recentLessons && recentLessons.length > 0 ? (
                      recentLessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="rounded-lg bg-neutral-700 p-4"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-white">
                                {lesson.title}
                              </h4>
                              <p className="mt-1 text-sm text-gray-400">
                                {lesson.description}
                              </p>
                              <p className="mt-2 text-xs text-gray-400">
                                by{' '}
                                <span className="font-medium">
                                  {lesson.author || 'Unknown'}
                                </span>
                              </p>
                            </div>
                            <p className="text-xs text-gray-500">
                              {new Date(lesson.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="py-4 text-center text-gray-400">
                        No recent lessons
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        <ViewChallenge
          open={challengeIsOpen}
          setOpen={setChallengeIsOpen}
          selected={selectedId}
        />
        <ViewReport
          open={reportIsOpen}
          setOpen={setReportIsOpen}
          report={selectedReport}
        />
        <Footer />

        {/* Notification Modal */}
        <NotificationModal />
      </div>
    </>
  );
}
