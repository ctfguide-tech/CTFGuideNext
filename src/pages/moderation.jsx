import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import {
  ArrowRightIcon,
  QuestionMarkCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  ChevronDownIcon,
  ArrowPathIcon,
} from '@heroicons/react/20/solid';

import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import request from '@/utils/request';
import ViewChallenge from '@/components/moderation/ViewChallenge';
import ViewReport from '@/components/moderation/ViewReport';
import UserActionModals from '@/components/moderation/UserActionModals';

export default function Moderation() {
  // Challenge states
  const [selectedChallenges, setSelectedChallenges] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [pendingChallenges, setPendingChallenges] = useState([]);
  const [challengeIsOpen, setChallengeIsOpen] = useState(false);
  const [bonusPoints, setBonusPoints] = useState(0);

  // Report states - CONSOLIDATED
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportIsOpen, setReportIsOpen] = useState(false);
  const [reportStats, setReportStats] = useState(null);
  const [reportFilters, setReportFilters] = useState({
    type: '',
    status: '',
    page: 0,
  });

  // User management states
  const [users, setUsers] = useState([]);
  const [currentUserPage, setCurrentUserPage] = useState(0);
  const [totalUserPages, setTotalUserPages] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [userSearchFilter, setUserSearchFilter] = useState('');

  // Suspended accounts states
  const [suspendedAccounts, setSuspendedAccounts] = useState([]);
  const [suspendedAccountsPage, setSuspendedAccountsPage] = useState(0);
  const [totalSuspendedAccounts, setTotalSuspendedAccounts] = useState(0);
  const [suspendedAccountsPagination, setSuspendedAccountsPagination] =
    useState(null);
  const [suspendedSearchFilter, setSuspendedSearchFilter] = useState('');

  // Suspension history states
  const [suspensionHistory, setSuspensionHistory] = useState([]);
  const [suspensionHistoryPage, setSuspensionHistoryPage] = useState(0);
  const [totalSuspensionHistory, setTotalSuspensionHistory] = useState(0);
  const [suspensionHistoryPagination, setSuspensionHistoryPagination] =
    useState(null);
  const [suspensionHistorySearchFilter, setSuspensionHistorySearchFilter] =
    useState('');
  const [suspensionHistoryStatusFilter, setSuspensionHistoryStatusFilter] =
    useState('all');
  const [suspensionHistoryLoading, setSuspensionHistoryLoading] =
    useState(false);

  // Platform stats
  const [stats, setStats] = useState(null);

  // Active tab state
  const [activeTab, setActiveTab] = useState('overview');
  const [activeAccountsTab, setActiveAccountsTab] = useState('suspended');
  const [activeHistoryTab, setActiveHistoryTab] = useState('suspended');
  const [systemStatus, setSystemStatus] = useState('online');
  const [lastStatusCheck, setLastStatusCheck] = useState(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Account deletion states
  const [pendingDeletions, setPendingDeletions] = useState([]);
  const [deletionStats, setDeletionStats] = useState(null);
  const [deletionsSearchFilter, setDeletionsSearchFilter] = useState('');

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

  // Modal states for suspend and role (keeping these as they may still be used)
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUserForAction, setSelectedUserForAction] = useState(null);
  const [suspendForm, setSuspendForm] = useState({ reason: '', duration: '' });
  const [roleForm, setRoleForm] = useState({ role: 'USER' });

  // User management modal states
  const [showUserManagementPopup, setShowUserManagementPopup] = useState(false);
  const [selectedUserForManagement, setSelectedUserForManagement] =
    useState(null);

  // Grouped warnings states
  const [groupedWarnings, setGroupedWarnings] = useState([]);
  const [groupedWarningsPage, setGroupedWarningsPage] = useState(1);
  const [groupedWarningsTotal, setGroupedWarningsTotal] = useState(0);
  const [groupedWarningsLoading, setGroupedWarningsLoading] = useState(false);
  const groupedWarningsPerPage = 10;
  const [expandedWarningUsers, setExpandedWarningUsers] = useState(new Set());

  // Grouped suspensions states
  const [groupedSuspensions, setGroupedSuspensions] = useState([]);
  const [groupedSuspensionsPage, setGroupedSuspensionsPage] = useState(1);
  const [groupedSuspensionsTotal, setGroupedSuspensionsTotal] = useState(0);
  const [groupedSuspensionsLoading, setGroupedSuspensionsLoading] =
    useState(false);
  const groupedSuspensionsPerPage = 10;
  const [expandedSuspensionUsers, setExpandedSuspensionUsers] = useState(
    new Set()
  );

  // Combined history total (unique users)
  const [historyTotalUsers, setHistoryTotalUsers] = useState(0);

  // Performance optimization states
  const [dataCache, setDataCache] = useState(new Map());
  const [lastFetchTimes, setLastFetchTimes] = useState(new Map());
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  // Function to check if data is cached and fresh
  const isDataFresh = useCallback(
    (key) => {
      const lastFetch = lastFetchTimes.get(key);
      if (!lastFetch) return false;
      return Date.now() - lastFetch < CACHE_DURATION;
    },
    [lastFetchTimes]
  );

  // Function to update cache
  const updateCache = useCallback((key, data) => {
    setDataCache((prev) => new Map(prev).set(key, data));
    setLastFetchTimes((prev) => new Map(prev).set(key, Date.now()));
  }, []);

  // Function to get cached data
  const getCachedData = useCallback(
    (key) => {
      return dataCache.get(key);
    },
    [dataCache]
  );

  // Optimized function to calculate total unique users in history
  const calculateHistoryTotalUsers = useCallback(
    async (forceRefresh = false) => {
      const cacheKey = 'historyTotalUsers';

      // Return cached data if fresh and not forcing refresh
      if (!forceRefresh && isDataFresh(cacheKey)) {
        const cached = getCachedData(cacheKey);
        if (cached !== undefined) {
          setHistoryTotalUsers(cached);
          return;
        }
      }

      try {
        // Use smaller limits for better performance
        const [warningsResponse, suspensionsResponse] = await Promise.all([
          request(
            `${process.env.NEXT_PUBLIC_API_URL}/admin/warnings?page=1&limit=100`,
            'GET'
          ),
          request(
            `${process.env.NEXT_PUBLIC_API_URL}/admin/suspension-history-enhanced?page=0&size=100&search=&status=all`,
            'GET'
          ),
        ]);

        const warnings = warningsResponse?.warnings || [];
        const suspensions = suspensionsResponse?.history || [];

        // Group by user with optimized processing
        const groupedWarnings = groupWarningsByUser(warnings);
        const groupedSuspensions = groupSuspensionsByUser(suspensions);

        // Calculate total unique users
        const totalUsers = groupedWarnings.length + groupedSuspensions.length;
        setHistoryTotalUsers(totalUsers);

        // Cache the result
        updateCache(cacheKey, totalUsers);
      } catch (error) {
        console.error('Error calculating history total users:', error);
        setHistoryTotalUsers(0);
      }
    },
    [isDataFresh, getCachedData, updateCache]
  );

  // Recent activity states
  const [recentActivity, setRecentActivity] = useState({
    comments: [],
    writeups: [],
    lessons: [],
  });
  const [loadingActivity, setLoadingActivity] = useState(false);
  const activityLoadedRef = useRef(false);
  const [activeActivityTab, setActiveActivityTab] = useState('comments');

  // New modal states for custom actions
  const [showReactivateModal, setShowReactivateModal] = useState(false);
  const [reactivateForm, setReactivateForm] = useState({ reason: '' });
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [selectedUserForReactivation, setSelectedUserForReactivation] =
    useState(null);

  // Notification helper function
  const showNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotification({ id, message, type });
  };

  // Helper function to get username and reason from various sources
  const getUsernameAndReason = (prefilledUsername = null) => {
    let username = prefilledUsername || userSearchQuery || '';
    let reason = '';

    // Try to get values from DOM elements if they exist
    const usernameElement = document.getElementById('username-input');
    const reasonElement = document.getElementById('reason-input');
    const popupReasonElement = document.getElementById('popupReasonInput');

    if (usernameElement && usernameElement.value) {
      username = usernameElement.value;
    }
    if (reasonElement && reasonElement.value) {
      reason = reasonElement.value;
    }
    if (popupReasonElement && popupReasonElement.value) {
      reason = popupReasonElement.value;
    }

    // Ensure username and reason are strings before calling trim
    const safeUsername = typeof username === 'string' ? username.trim() : '';
    const safeReason = typeof reason === 'string' ? reason.trim() : '';

    return { username: safeUsername, reason: safeReason };
  };

  // Helper function for challenge operations
  const getChallengeIdAndReason = () => {
    let challengeId = challengeSearchQuery;
    let reason = '';

    const challengeElement = document.getElementById('challenge-input');
    const reasonElement = document.getElementById('challenge-reason-input');

    if (challengeElement && challengeElement.value) {
      challengeId = challengeElement.value;
    }
    if (reasonElement && reasonElement.value) {
      reason = reasonElement.value;
    }

    return { challengeId: challengeId?.trim(), reason: reason?.trim() };
  };

  // Notification component
  const NotificationModal = () => {
    if (!notification) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 duration-300 animate-in fade-in-0">
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm duration-300 animate-in fade-in-0"
          onClick={() => setNotification(null)}
        />
        <div className="relative border border-neutral-700 bg-neutral-800/95 p-8 shadow-2xl backdrop-blur-md duration-300 animate-in zoom-in-95">
          <div className="flex items-center space-x-4">
            <div className="min-w-0 flex-1">
              <p className="break-words text-lg font-medium text-white">
                {notification.message}
              </p>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="flex h-8 w-8 items-center justify-center text-gray-400 transition-all duration-200 hover:bg-neutral-700/50 hover:text-white"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ENHANCED AUTOCOMPLETE FUNCTIONS
  const fetchUserSuggestions = async (query) => {
    if (query.length < 1) {
      setUserSuggestions([]);
      return;
    }

    try {
      const response = await request(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/admin/users?search=${encodeURIComponent(query)}&limit=15`,
        'GET'
      );
      const q = query.toLowerCase();
      const users = (response.users || []).filter((user) => {
        return (
          (user.username && user.username.toLowerCase().includes(q)) ||
          (user.email && user.email.toLowerCase().includes(q)) ||
          (user.name && user.name.toLowerCase().includes(q))
        );
      });
      setUserSuggestions(users);
    } catch (error) {
      console.error('Failed to fetch user suggestions:', error);
      setUserSuggestions([]);
    }
  };

  const fetchChallengeSuggestions = async (query) => {
    if (query.length < 2) {
      setChallengeSuggestions([]);
      return;
    }

    try {
      // Fetch both pending and approved challenges
      const [pendingResponse, approvedResponse] = await Promise.all([
        request(`${process.env.NEXT_PUBLIC_API_URL}/pending`, 'GET'),
        request(
          `${
            process.env.NEXT_PUBLIC_API_URL
          }/challenges?search=${encodeURIComponent(query)}&limit=10`,
          'GET'
        ),
      ]);

      const pendingChallenges = (pendingResponse || [])
        .filter((challenge) =>
          challenge.title.toLowerCase().includes(query.toLowerCase())
        )
        .map((challenge) => ({ ...challenge, status: 'Pending' }));

      const approvedChallenges = (approvedResponse?.challenges || []).map(
        (challenge) => ({ ...challenge, status: 'Approved' })
      );

      const allChallenges = [...pendingChallenges, ...approvedChallenges];
      setChallengeSuggestions(allChallenges.slice(0, 10));
    } catch (error) {
      console.error('Failed to fetch challenge suggestions:', error);
      setChallengeSuggestions([]);
    }
  };

  const handleUserInputChange = (e) => {
    const value = e.target.value;
    setUserSearchQuery(value);

    if (value.length >= 1) {
      // Clear previous timeout
      clearTimeout(window.userSearchTimeout);

      // Set new timeout for debouncing
      window.userSearchTimeout = setTimeout(() => {
        // Fetch suggestions from API, but also filter by email if needed
        fetchUserSuggestions(value);
        setShowUserSuggestions(true);
      }, 300);
    } else {
      setUserSuggestions([]);
      setShowUserSuggestions(false);
    }
  };

  const handleChallengeInputChange = (e) => {
    const value = e.target.value;
    setChallengeSearchQuery(value);

    if (value.length >= 1) {
      // Clear previous timeout
      clearTimeout(window.challengeSearchTimeout);

      // Set new timeout for debouncing
      window.challengeSearchTimeout = setTimeout(() => {
        fetchChallengeSuggestions(value);
        setShowChallengeSuggestions(true);
      }, 300);
    } else {
      setChallengeSuggestions([]);
      setShowChallengeSuggestions(false);
    }
  };

  const handleUserSelection = (user) => {
    setUserSearchQuery(user.username);
    setShowUserSuggestions(false);
    setUserSuggestions([]);
  };

  const handleChallengeSelection = (challenge) => {
    setChallengeSearchQuery(challenge.title);
    setShowChallengeSuggestions(false);
    setChallengeSuggestions([]);
  };

  // UNIFIED FETCH FUNCTIONS
  const fetchReports = async (filters = {}) => {
    try {
      console.log('Fetching reports with filters:', filters);

      const queryParams = new URLSearchParams();
      if (filters.type) queryParams.append('type', filters.type);
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.page) queryParams.append('page', filters.page.toString());

      const url = `${process.env.NEXT_PUBLIC_API_URL}/reports${
        queryParams.toString() ? '?' + queryParams.toString() : ''
      }`;
      const response = await request(url, 'GET');

      console.log('Reports response:', response);

      // Handle different response formats
      let reportsData = [];
      if (Array.isArray(response)) {
        reportsData = response;
      } else if (response && Array.isArray(response.reports)) {
        reportsData = response.reports;
      } else if (response && response.data && Array.isArray(response.data)) {
        reportsData = response.data;
      }

      setReports(reportsData);
      return response;
    } catch (error) {
      console.error('Failed to fetch reports:', error);
      setReports([]);
      return { reports: [] };
    }
  };

  const fetchReportStats = async () => {
    try {
      const response = await request(
        `${process.env.NEXT_PUBLIC_API_URL}/reports/stats`,
        'GET'
      );
      setReportStats(response);
    } catch (error) {
      console.error('Failed to fetch report stats:', error);
      setReportStats(null);
    }
  };

  // Fetch functions
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

  const fetchUsers = async (page = 0, searchQuery = '') => {
    try {
      const response = await request(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/admin/users?page=${page}&size=25&search=${encodeURIComponent(
          searchQuery
        )}&sort=createdAt:desc`,
        'GET'
      );
      if (response.result || response.users) {
        // Sort users by createdAt descending (newest first)
        const usersSorted = (response.result || response.users).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setUsers(usersSorted);
        setTotalUsers(response.totalEntries || 0);
        setTotalUserPages(Math.min(response.lastPage + 1 || 0, 1000));
        setCurrentUserPage(page);
      } else {
        setUsers([]);
        setTotalUsers(0);
        setTotalUserPages(0);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      showNotification('Failed to fetch users. Please try again.', 'error');
      setUsers([]);
    }
  };

  const fetchSuspendedAccounts = async (page = 0, searchQuery = '') => {
    try {
      console.log(
        'Fetching suspended accounts for page:',
        page,
        'with search:',
        searchQuery
      );

      const queryParams = new URLSearchParams();
      queryParams.append('page', page.toString());
      queryParams.append('size', '20');
      if (searchQuery.trim()) {
        queryParams.append('search', searchQuery.trim());
      }

      const url = `${
        process.env.NEXT_PUBLIC_API_URL
      }/admin/suspended-accounts?${queryParams.toString()}`;
      console.log('Fetching from URL:', url);

      const response = await request(url, 'GET');
      console.log('Suspended accounts API response:', response);

      if (response === null) {
        console.error('Request returned null - likely authentication issue');
        setSuspendedAccounts([]);
        setSuspendedAccountsPagination(null);
        setTotalSuspendedAccounts(0);
        setSuspendedAccountsPage(0);
        return;
      }

      if (response && response.success) {
        console.log(
          'Setting suspended accounts data:',
          response.users.length,
          'accounts'
        );
        console.log('Sample user data:', response.users[0]);
        setSuspendedAccounts(response.users || []);
        setSuspendedAccountsPagination(response.pagination);
        setTotalSuspendedAccounts(response.pagination?.totalCount || 0);
        setSuspendedAccountsPage(page);
      } else {
        console.error('Invalid response format:', response);
        if (response && response.error) {
          console.error('API Error:', response.error);
        }
        setSuspendedAccounts([]);
        setSuspendedAccountsPagination(null);
        setTotalSuspendedAccounts(0);
        setSuspendedAccountsPage(0);
      }
    } catch (error) {
      console.error('Failed to fetch suspended accounts:', error);
      setSuspendedAccounts([]);
      setSuspendedAccountsPagination(null);
      setTotalSuspendedAccounts(0);
      setSuspendedAccountsPage(0);
    }
  };

  const fetchSuspensionHistory = async (
    page = 0,
    searchQuery = '',
    statusFilter = 'all'
  ) => {
    try {
      setSuspensionHistoryLoading(true);
      const response = await request(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/admin/suspension-history-enhanced?page=${page}&size=20&search=${encodeURIComponent(
          searchQuery
        )}&status=${statusFilter}`,
        'GET'
      );

      if (response && response.success) {
        setSuspensionHistory(response.history || []);
        setSuspensionHistoryPagination(response.pagination);
        setSuspensionHistoryPage(page);
      } else {
        console.error('Failed to fetch suspension history:', response);
        setSuspensionHistory([]);
        setSuspensionHistoryPagination(null);
      }
    } catch (error) {
      console.error('Error fetching suspension history:', error);
      setSuspensionHistory([]);
      setSuspensionHistoryPagination(null);
    } finally {
      setSuspensionHistoryLoading(false);
    }
  };

  const handleProcessDeletion = async (requestId) => {
    try {
      const response = await request(
        `${process.env.NEXT_PUBLIC_API_URL}/account-deletion/admin/process/${requestId}`,
        'POST'
      );

      if (response.success) {
        showNotification('Account deletion processed automatically', 'success');
        await fetchPendingDeletions();
        await fetchDeletionStats();
      } else {
        throw new Error(response.error || 'Failed to process deletion');
      }
    } catch (error) {
      console.error('Error processing deletion:', error);
      showNotification(`Failed to process deletion: ${error.message}`, 'error');
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

  // Fetch account deletion requests
  const fetchPendingDeletions = async (searchQuery = '') => {
    try {
      console.log('Fetching pending deletions with search:', searchQuery);

      const queryParams = new URLSearchParams();
      if (searchQuery.trim()) {
        queryParams.append('search', searchQuery.trim());
      }

      const url = `${
        process.env.NEXT_PUBLIC_API_URL
      }/account-deletion/admin/pending${
        queryParams.toString() ? '?' + queryParams.toString() : ''
      }`;

      const response = await request(url, 'GET');
      console.log('Pending deletions response:', response);
      if (response.success) {
        setPendingDeletions(response.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch pending deletions:', error);
      setPendingDeletions([]);
    }
  };

  // Fetch deletion statistics
  const fetchDeletionStats = async () => {
    try {
      console.log('Fetching deletion stats...');
      const response = await request(
        `${process.env.NEXT_PUBLIC_API_URL}/account-deletion/admin/stats`,
        'GET'
      );
      console.log('Deletion stats response:', response);
      if (response.success) {
        setDeletionStats(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch deletion stats:', error);
      setDeletionStats(null);
    }
  };

  // Autocomplete functions
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
    const usernameInput = document.getElementById('username-input');
    const reasonInput = document.getElementById('reason-input');
    const popupReasonInput = document.getElementById('popupReasonInput');

    if (usernameInput) usernameInput.value = '';
    if (reasonInput) reasonInput.value = '';
    if (popupReasonInput) popupReasonInput.value = '';

    setUserSearchQuery('');
    setShowUserSuggestions(false);
    setUserSuggestions([]);
  };

  const resetChallengeFields = () => {
    const challengeInput = document.getElementById('challenge-input');
    const challengeReasonInput = document.getElementById(
      'challenge-reason-input'
    );

    if (challengeInput) challengeInput.value = '';
    if (challengeReasonInput) challengeReasonInput.value = '';

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
    const { challengeId, reason } = getChallengeIdAndReason();

    if (!challengeId) {
      showNotification('Please enter a challenge ID to delete.', 'error');
      return;
    }

    if (!reason) {
      showNotification(
        'Please provide a reason for deleting this challenge.',
        'error'
      );
      return;
    }

    try {
      const response = await request(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/challenges/${challengeId}/delete`,
        'POST',
        { reason }
      );
      showNotification(
        `Challenge ${challengeId} has been deleted successfully.`,
        'success'
      );

      // Clear inputs
      setChallengeSearchQuery('');
      const reasonElement = document.getElementById('challenge-reason-input');
      if (reasonElement) reasonElement.value = '';
    } catch (error) {
      console.error('Failed to delete challenge:', error);
      showNotification(
        `Failed to delete challenge ${challengeId}. Please try again.`,
        'error'
      );
    }
  };

  const handleUnapproveChallenge = async () => {
    const { challengeId, reason } = getChallengeIdAndReason();

    if (!challengeId) {
      showNotification('Please enter a challenge ID to unapprove.', 'error');
      return;
    }

    if (!reason) {
      showNotification(
        'Please provide a reason for unapproving this challenge.',
        'error'
      );
      return;
    }

    try {
      const response = await request(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/challenges/${challengeId}/unapprove`,
        'POST',
        { reason }
      );
      showNotification(
        `Challenge ${challengeId} has been unapproved successfully.`,
        'success'
      );

      // Clear inputs
      setChallengeSearchQuery('');
      const reasonElement = document.getElementById('challenge-reason-input');
      if (reasonElement) reasonElement.value = '';
    } catch (error) {
      console.error('Failed to unapprove challenge:', error);
      showNotification(
        `Failed to unapprove challenge ${challengeId}. Please try again.`,
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

  const handleResetPFP = async (prefilledUsername = null) => {
    const { username, reason } = getUsernameAndReason(prefilledUsername);

    if (!username) {
      showNotification(
        'Please enter a username to reset profile picture.',
        'error'
      );
      return;
    }

    if (!reason) {
      showNotification(
        'Please provide a reason for resetting the profile picture.',
        'error'
      );
      return;
    }

    try {
      const response = await request(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${username}/reset-pfp`,
        'POST',
        { reason }
      );
      showNotification(
        `Profile picture reset for ${username} successfully.`,
        'success'
      );

      // Refresh users list
      fetchUsers(currentUserPage, userSearchFilter);

      // Clear inputs
      setUserSearchQuery('');
      const reasonElement = document.getElementById('reason-input');
      const popupReasonElement = document.getElementById('popupReasonInput');
      if (reasonElement) reasonElement.value = '';
      if (popupReasonElement) popupReasonElement.value = '';
    } catch (error) {
      console.error('Failed to reset profile picture:', error);
      showNotification(
        `Failed to reset profile picture for ${username}. Please try again.`,
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

  const handleResetBanner = async (prefilledUsername = null) => {
    const { username, reason } = getUsernameAndReason(prefilledUsername);

    if (!username) {
      showNotification('Please enter a username to reset banner.', 'error');
      return;
    }

    if (!reason) {
      showNotification(
        'Please provide a reason for resetting the banner.',
        'error'
      );
      return;
    }

    try {
      const response = await request(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${username}/reset-banner`,
        'POST',
        { reason }
      );
      showNotification(`Banner reset for ${username} successfully.`, 'success');

      // Refresh users list
      fetchUsers(currentUserPage, userSearchFilter);

      // Clear inputs
      setUserSearchQuery('');
      const reasonElement = document.getElementById('reason-input');
      const popupReasonElement = document.getElementById('popupReasonInput');
      if (reasonElement) reasonElement.value = '';
      if (popupReasonElement) popupReasonElement.value = '';
    } catch (error) {
      console.error('Failed to reset banner:', error);
      showNotification(
        `Failed to reset banner for ${username}. Please try again.`,
        'error'
      );
    }
  };

  const handleDisableAccount = async (prefilledUsername = null) => {
    const { username, reason } = getUsernameAndReason(prefilledUsername);

    if (!username) {
      showNotification('Please enter a username to disable.', 'error');
      return;
    }

    if (!reason) {
      showNotification(
        'Please provide a reason for disabling this account.',
        'error'
      );
      return;
    }

    try {
      const response = await request(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${username}/disable`,
        'POST',
        { reason }
      );
      showNotification(
        `Account ${username} has been disabled successfully.`,
        'success'
      );

      // Refresh users list
      fetchUsers(currentUserPage, userSearchFilter);

      // Clear inputs
      setUserSearchQuery('');
      const reasonElement = document.getElementById('reason-input');
      const popupReasonElement = document.getElementById('popupReasonInput');
      if (reasonElement) reasonElement.value = '';
      if (popupReasonElement) popupReasonElement.value = '';
    } catch (error) {
      console.error('Failed to disable account:', error);
      showNotification(
        `Failed to disable account ${username}. Please try again.`,
        'error'
      );
    }
  };

  const handleResetBio = async (prefilledUsername = null) => {
    const { username, reason } = getUsernameAndReason(prefilledUsername);

    if (!username) {
      showNotification('Please enter a username to reset bio.', 'error');
      return;
    }

    if (!reason) {
      showNotification(
        'Please provide a reason for resetting the bio.',
        'error'
      );
      return;
    }

    try {
      const response = await request(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${username}/reset-bio`,
        'POST',
        { reason }
      );
      showNotification(`Bio reset for ${username} successfully.`, 'success');

      // Refresh users list
      fetchUsers(currentUserPage, userSearchFilter);

      // Clear inputs
      setUserSearchQuery('');
      const reasonElement = document.getElementById('reason-input');
      const popupReasonElement = document.getElementById('popupReasonInput');
      if (reasonElement) reasonElement.value = '';
      if (popupReasonElement) popupReasonElement.value = '';
    } catch (error) {
      console.error('Failed to reset bio:', error);
      showNotification(
        `Failed to reset bio for ${username}. Please try again.`,
        'error'
      );
    }
  };

  const handleEnableAccount = async (prefilledUsername = null) => {
    const { username, reason } = getUsernameAndReason(prefilledUsername);

    if (!username) {
      showNotification('Please enter a username to enable.', 'error');
      return;
    }

    if (!reason) {
      showNotification(
        'Please provide a reason for enabling this account.',
        'error'
      );
      return;
    }

    try {
      const response = await request(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${username}/enable`,
        'POST',
        { reason }
      );
      showNotification(
        `Account ${username} has been enabled successfully.`,
        'success'
      );

      // Refresh users list
      fetchUsers(currentUserPage, userSearchFilter);

      // Clear inputs
      setUserSearchQuery('');
      const reasonElement = document.getElementById('reason-input');
      const popupReasonElement = document.getElementById('popupReasonInput');
      if (reasonElement) reasonElement.value = '';
      if (popupReasonElement) popupReasonElement.value = '';
    } catch (error) {
      console.error('Failed to enable account:', error);
      showNotification(
        `Failed to enable account ${username}. Please try again.`,
        'error'
      );
    }
  };

  // Removed duplicate handleWarnUser function - using the new one with userId parameter

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

  // Reactivation modal handlers
  const handleReactivateAccount = async (userId, username) => {
    setSelectedUserForAction({ userId, username });
    setReactivateForm({ reason: '' });
    setShowReactivateModal(true);
  };

  const submitReactivation = async () => {
    const reason =
      reactivateForm.reason.trim() || 'Administrative reactivation';

    try {
      const response = await request(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${selectedUserForAction.userId}/reactivate`,
        'POST',
        { reason }
      );

      if (response && response.success) {
        showNotification(
          `Account ${selectedUserForAction.username} has been reactivated successfully.`,
          'success'
        );
        setShowReactivateModal(false);
        fetchSuspendedAccounts(suspendedAccountsPage, suspendedSearchFilter);
      } else {
        throw new Error(response?.error || 'Failed to reactivate account');
      }
    } catch (error) {
      console.error('Failed to reactivate account:', error);
      showNotification(
        `Failed to reactivate account: ${error.message}`,
        'error'
      );
    }
  };

  // Handle user suspension - open modal
  const handleSuspendUser = async (userId, username) => {
    setSelectedUserForAction({ userId, username });
    setSuspendForm({ reason: '', duration: '' });
    setShowSuspendModal(true);
  };

  // Submit suspension form
  const submitSuspension = async () => {
    if (!suspendForm.reason.trim()) {
      showNotification('Please enter a reason for suspension.', 'error');
      return;
    }

    const duration = suspendForm.duration
      ? parseInt(suspendForm.duration)
      : null;

    try {
      const response = await request(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${selectedUserForAction.userId}/suspend`,
        'POST',
        { reason: suspendForm.reason, duration }
      );

      if (response && response.success) {
        showNotification(
          `User ${selectedUserForAction.username} has been suspended successfully.`,
          'success'
        );
        setShowSuspendModal(false);
        fetchSuspendedAccounts(suspendedAccountsPage, suspendedSearchFilter);
      } else {
        throw new Error(response?.error || 'Failed to suspend user');
      }
    } catch (error) {
      console.error('Failed to suspend user:', error);
      showNotification(`Failed to suspend user: ${error.message}`, 'error');
    }
  };

  const handleWarnUser = async (prefilledUsername = null) => {
    const { username, reason } = getUsernameAndReason(prefilledUsername);

    if (!username) {
      showNotification('Please enter a username to warn.', 'error');
      return;
    }

    if (!reason) {
      showNotification(
        'Please provide a reason for warning this user.',
        'error'
      );
      return;
    }

    try {
      const response = await request(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${username}/warn`,
        'POST',
        { reason }
      );

      if (response && response.success) {
        showNotification(
          `Warning issued to ${username} successfully.`,
          'success'
        );

        // Refresh users list
        fetchUsers(currentUserPage, userSearchFilter);

        // Refresh warning history
        fetchWarningsPage(warningsPage);

        // Trigger notification check for the warned user
        window.dispatchEvent(
          new CustomEvent('warningIssued', {
            detail: { username, reason },
          })
        );

        // Clear inputs
        setUserSearchQuery('');
        const reasonElement = document.getElementById('reason-input');
        const popupReasonElement = document.getElementById('popupReasonInput');
        if (reasonElement) reasonElement.value = '';
        if (popupReasonElement) popupReasonElement.value = '';
      } else {
        throw new Error(response?.error || 'Failed to issue warning');
      }
    } catch (error) {
      console.error('Failed to issue warning:', error);
      showNotification(
        `Failed to issue warning to ${username}. Please try again.`,
        'error'
      );
    }
  };

  // Handle role change - open modal
  const handleRoleChange = async (userId, username) => {
    setSelectedUserForAction({ userId, username });
    setRoleForm({ role: 'USER' });
    setShowRoleModal(true);
  };

  // Submit role change form
  const submitRoleChange = async () => {
    try {
      const response = await request(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${selectedUserForAction.userId}/role`,
        'POST',
        { role: roleForm.role }
      );

      if (response && response.success) {
        showNotification(
          `User ${selectedUserForAction.username} role updated to ${roleForm.role}.`,
          'success'
        );
        setShowRoleModal(false);
        fetchSuspendedAccounts(suspendedAccountsPage, suspendedSearchFilter);
      } else {
        throw new Error(response?.error || 'Failed to update role');
      }
    } catch (error) {
      console.error('Failed to update role:', error);
      showNotification(`Failed to update role: ${error.message}`, 'error');
    }
  };

  // View user history
  const handleViewUserHistory = async (userId, username) => {
    try {
      const response = await request(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}/history`,
        'GET'
      );

      if (response) {
        const { suspensions, warnings } = response;

        let historyText = `=== ${username} History ===\n\n`;

        if (suspensions.length > 0) {
          historyText += 'SUSPENSION HISTORY:\n';
          suspensions.forEach((s, i) => {
            historyText += `${i + 1}. ${new Date(
              s.createdAt
            ).toLocaleString()}\n`;
            historyText += `   Reason: ${s.reason}\n`;
            historyText += `   By: ${s.suspendedBy}\n`;
            historyText += `   Status: ${s.isActive ? 'Active' : 'Resolved'}\n`;
            if (s.reactivatedBy) {
              historyText += `   Reactivated by: ${
                s.reactivatedBy
              } on ${new Date(s.reactivatedAt).toLocaleString()}\n`;
              historyText += `   Reactivation reason: ${s.reactivationReason}\n`;
            }
            historyText += '\n';
          });
        }

        if (warnings.length > 0) {
          historyText += 'WARNING HISTORY:\n';
          warnings.forEach((w, i) => {
            historyText += `${i + 1}. ${new Date(
              w.createdAt
            ).toLocaleString()}\n`;
            historyText += `   Reason: ${w.reason}\n`;
            historyText += `   By: ${w.warnedBy}\n\n`;
          });
        }

        if (suspensions.length === 0 && warnings.length === 0) {
          historyText += 'No suspension or warning history found.';
        }

        alert(historyText);
      }
    } catch (error) {
      console.error('Failed to fetch user history:', error);
      showNotification(
        `Failed to fetch user history: ${error.message}`,
        'error'
      );
    }
  };

  const reactivateAccount = async (userId, reason = '') => {
    try {
      const response = await request(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/reactivate-account/${userId}`,
        'POST',
        { reason }
      );

      if (response && response.success) {
        // Refresh the suspended accounts list
        fetchSuspendedAccounts(suspendedAccountsPage);
        // Show success notification
        showNotification(
          'Account reactivated successfully! The user has been notified.',
          'success'
        );
        return { success: true, message: response.message };
      } else {
        throw new Error(response?.error || 'Failed to reactivate account');
      }
    } catch (error) {
      console.error('Failed to reactivate account:', error);
      showNotification(
        `Failed to reactivate account: ${error.message}`,
        'error'
      );
      return { success: false, error: error.message };
    }
  };

  // Report management handlers - FIXED
  const handleUpdateReportStatus = async (
    reportId,
    status,
    resolution = ''
  ) => {
    try {
      const response = await request(
        `${process.env.NEXT_PUBLIC_API_URL}/reports/${reportId}/status`,
        'PUT',
        { status, resolution }
      );

      if (response && response.success) {
        showNotification('Report status updated successfully', 'success');
        await fetchReports(reportFilters);
        await fetchReportStats();
      } else {
        throw new Error(response?.error || 'Failed to update report status');
      }
    } catch (error) {
      console.error('Error updating report status:', error);
      showNotification(
        error.message || 'Failed to update report status',
        'error'
      );
    }
  };

  // Fetch all data function
  // Optimized initial data fetch - only load essential data
  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('1. Fetching stats...');
      await fetchStats();

      console.log('2. Fetching report stats...');
      await fetchReportStats();

      console.log('3. Fetching deletion stats...');
      await fetchDeletionStats();

      console.log('4. Calculating history total users...');
      await calculateHistoryTotalUsers();

      console.log('=== ESSENTIAL DATA FETCH COMPLETE ===');
      setIsInitialLoadComplete(true);
    } catch (error) {
      console.error('Error in essential data fetch sequence:', error);
      setError('Failed to load essential data. Please refresh the page.');
    } finally {
      setIsLoading(false);
    }
  };

  // Lazy load function for non-essential data
  const fetchLazyData = async () => {
    try {
      console.log('1. Fetching reports...');
      await fetchReports();

      console.log('2. Fetching pending challenges...');
      await fetchPendingChallenges();

      console.log('3. Fetching users...');
      await fetchUsers(0, '');

      console.log('4. Fetching recent activity...');
      await fetchRecentActivity();

      console.log('5. Fetching pending deletions...');
      await fetchPendingDeletions();

      console.log('=== LAZY DATA FETCH COMPLETE ===');
    } catch (error) {
      console.error('Error in lazy data fetch sequence:', error);
    }
  };

  // Initial data fetch with instant tab numbers
  useEffect(() => {
    console.log('=== MODERATION PANEL INITIALIZING ===');
    console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
    console.log('Starting data fetch sequence...');

    // Load essential data immediately for instant tab numbers
    const loadEssentialData = async () => {
      try {
        // Load all essential data in parallel for fastest possible load
        await Promise.all([
          fetchStats(),
          fetchReportStats(),
          fetchDeletionStats(),
          calculateHistoryTotalUsers(),
        ]);

        setIsInitialLoadComplete(true);
        console.log('=== ESSENTIAL DATA LOADED INSTANTLY ===');
      } catch (error) {
        console.error('Error loading essential data:', error);
        setError('Failed to load essential data. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    };

    loadEssentialData();
  }, []);

  // Handle clicking outside autocomplete dropdowns and escape key
  useEffect(() => {
    const handleClickOutside = (event) => {
      const userInput = document.getElementById('username-input');
      const challengeInput = document.getElementById('challenge-input');

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

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setShowUserManagementPopup(false);
        setShowUserSuggestions(false);
        setShowChallengeSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Load data when tab becomes active
  useEffect(() => {
    if (activeTab === 'reports' && reports.length === 0) {
      fetchReports(reportFilters);
    }
    if (
      activeTab === 'accounts' &&
      activeAccountsTab === 'suspended' &&
      suspendedAccounts.length === 0
    ) {
      fetchSuspendedAccounts(0, suspendedSearchFilter);
    }
    if (activeTab === 'users' && users.length === 0) {
      setCurrentUserPage(0);
      fetchUsers(0, '');
    }
    if (
      activeTab === 'accounts' &&
      activeAccountsTab === 'deleted' &&
      pendingDeletions.length === 0
    ) {
      fetchPendingDeletions(deletionsSearchFilter);
    }
    if (
      activeTab === 'accounts' &&
      activeAccountsTab === 'history' &&
      suspensionHistory.length === 0
    ) {
      fetchSuspensionHistory(
        0,
        suspensionHistorySearchFilter,
        suspensionHistoryStatusFilter
      );
    }
    if (
      activeTab === 'warnings' &&
      activeHistoryTab === 'suspended' &&
      suspensionHistory.length === 0
    ) {
      fetchSuspensionHistory(
        0,
        suspensionHistorySearchFilter,
        suspensionHistoryStatusFilter
      );
    }
  }, [activeTab, activeAccountsTab, activeHistoryTab]);

  // System status monitoring - client side only
  useEffect(() => {
    // Only run on client side to avoid hydration errors
    if (typeof window !== 'undefined') {
      // Set initial timestamp
      setLastStatusCheck(new Date());

      // Initial check
      checkSystemStatus();

      // Check every 30 seconds
      const statusInterval = setInterval(checkSystemStatus, 30000);

      return () => clearInterval(statusInterval);
    }
  }, []);

  // Optimized tab navigation component with instant switching
  const TabButton = ({ id, label, icon: Icon, count }) => (
    <button
      onClick={() => {
        setActiveTab(id);

        // Lazy load non-essential data if not already loaded
        if (!isInitialLoadComplete) {
          fetchLazyData();
        }

        // Instant tab switching with background data refresh
        setTimeout(() => {
          if (id === 'accounts') {
            // Fetch all accounts-related data
            fetchSuspendedAccounts(
              suspendedAccountsPage,
              suspendedSearchFilter
            );
            fetchPendingDeletions(deletionsSearchFilter);
            fetchDeletionStats();
          } else if (id === 'users') {
            fetchUsers(currentUserPage, userSearchFilter);
          } else if (id === 'challenges') {
            fetchPendingChallenges();
          } else if (id === 'reports') {
            fetchReports(reportFilters);
            fetchReportStats();
          } else if (id === 'warnings') {
            // Fetch all history-related data with caching
            fetchGroupedSuspensions(groupedSuspensionsPage);
            fetchGroupedWarnings(groupedWarningsPage);
            calculateHistoryTotalUsers();
          } else if (id === 'activity') {
            fetchRecentActivity();
          } else if (id === 'overview') {
            // Only fetch essential data for overview
            fetchAllData();
          }
        }, 0); // Use setTimeout to ensure tab switch is instant
      }}
      className={`flex items-center border-b-2 px-1 py-4 text-sm font-medium transition-all duration-200 ${
        activeTab === id
          ? 'border-blue-500 text-blue-400'
          : 'border-transparent text-gray-400 hover:border-gray-600 hover:text-gray-300'
      }`}
    >
      <Icon className="mr-2 h-4 w-4" />
      {label}
      {count !== undefined && (
        <span
          className={`ml-2 px-2 py-0.5 text-xs ${
            activeTab === id
              ? 'bg-blue-500/20 text-blue-400'
              : 'bg-neutral-600 text-gray-300'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );

  // Check system status
  const checkSystemStatus = async () => {
    try {
      setIsLoadingStatus(true);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/health`,
        {
          method: 'GET',
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        setSystemStatus('online');
      } else if (response.status >= 500) {
        setSystemStatus('degraded');
      } else {
        setSystemStatus('degraded');
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        setSystemStatus('offline');
      } else {
        setSystemStatus('degraded');
      }
      console.warn('System status check failed:', error.message);
    } finally {
      setIsLoadingStatus(false);
      if (typeof window !== 'undefined') {
        setLastStatusCheck(new Date());
      }
    }
  };

  // Load recent activity when activity tab is accessed
  useEffect(() => {
    if (
      activeTab === 'activity' &&
      !loadingActivity &&
      !activityLoadedRef.current
    ) {
      fetchRecentActivity();
      activityLoadedRef.current = true;
    }
  }, [activeTab]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMobileMenu && !event.target.closest('.mobile-menu-container')) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMobileMenu]);

  // Fetch recent activity data
  const fetchRecentActivity = async () => {
    if (loadingActivity) return;

    setLoadingActivity(true);
    try {
      const [commentsRes, writeupsRes, lessonsRes] = await Promise.all([
        request(`${process.env.NEXT_PUBLIC_API_URL}/activity/comments`, 'GET'),
        request(`${process.env.NEXT_PUBLIC_API_URL}/activity/writeups`, 'GET'),
        request(`${process.env.NEXT_PUBLIC_API_URL}/activity/lessons`, 'GET'),
      ]);

      let comments = [];
      let writeups = [];
      let lessons = [];

      if (commentsRes && !commentsRes.error) {
        comments = Array.isArray(commentsRes) ? commentsRes : [];
      } else {
        console.error('Comments API error:', commentsRes?.error);
      }

      if (writeupsRes && !writeupsRes.error) {
        writeups = Array.isArray(writeupsRes) ? writeupsRes : [];
      } else {
        console.error('Writeups API error:', writeupsRes?.error);
      }

      if (lessonsRes && !lessonsRes.error) {
        lessons = Array.isArray(lessonsRes) ? lessonsRes : [];
      } else {
        console.error('Lessons API error:', lessonsRes?.error);
      }

      setRecentActivity({ comments, writeups, lessons });
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      setRecentActivity({ comments: [], writeups: [], lessons: [] });
    } finally {
      setLoadingActivity(false);
    }
  };

  // Manual refresh function
  const refreshActivity = async () => {
    activityLoadedRef.current = false;
    await fetchRecentActivity();
  };

  // Handle showing deletion details in modal
  const handleViewDeletionDetails = (deletion) => {
    setSelectedDetails({
      type: 'deletion',
      data: deletion,
    });
    setShowDetailsModal(true);
  };

  const [warnings, setWarnings] = useState([]);
  const [warningsLoading, setWarningsLoading] = useState(false);
  const [warningsPage, setWarningsPage] = useState(1);
  const [warningsTotal, setWarningsTotal] = useState(0);
  const warningsPerPage = 20;

  const fetchWarnings = async () => {
    setWarningsLoading(true);
    try {
      const response = await request(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/warnings`,
        'GET'
      );
      if (response && !response.error) {
        setWarnings(response.warnings || []);
        setWarningsTotal(response.total || 0);
      }
    } catch (error) {
      console.error('Error fetching warnings:', error);
    } finally {
      setWarningsLoading(false);
    }
  };

  const fetchWarningsPage = async (page) => {
    setWarningsLoading(true);
    try {
      console.log('Fetching warnings page:', page);
      const response = await request(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/warnings?page=${page}&limit=${warningsPerPage}`,
        'GET'
      );
      console.log('Warnings response:', response);
      if (response && !response.error) {
        setWarnings(response.warnings || []);
        setWarningsTotal(response.total || 0);
        setWarningsPage(page);
      } else {
        console.error('Warnings API error:', response?.error);
      }
    } catch (error) {
      console.error('Error fetching warnings:', error);
    } finally {
      setWarningsLoading(false);
    }
  };

  // Optimized function to group warnings by user
  const groupWarningsByUser = useCallback((warnings) => {
    if (!warnings || warnings.length === 0) return [];

    const userMap = new Map();

    // Process warnings in chunks for better performance
    const chunkSize = 100;
    for (let i = 0; i < warnings.length; i += chunkSize) {
      const chunk = warnings.slice(i, i + chunkSize);

      chunk.forEach((warning) => {
        const userId = warning.user?.id || warning.userId;
        const username = warning.user?.username || 'Unknown';

        if (!userMap.has(userId)) {
          userMap.set(userId, {
            userId,
            username,
            user: warning.user,
            warnings: [],
            totalWarnings: 0,
          });
        }

        const userWarnings = userMap.get(userId);
        userWarnings.warnings.push(warning);
        userWarnings.totalWarnings++;
      });
    }

    // Convert to array and sort by most recent warning (descending)
    const result = Array.from(userMap.values());

    // Optimize sorting for large datasets
    return result.sort((a, b) => {
      if (a.warnings.length === 0 && b.warnings.length === 0) return 0;
      if (a.warnings.length === 0) return 1;
      if (b.warnings.length === 0) return -1;

      const aLatest = Math.max(
        ...a.warnings.map((w) => new Date(w.createdAt).getTime())
      );
      const bLatest = Math.max(
        ...b.warnings.map((w) => new Date(w.createdAt).getTime())
      );
      return bLatest - aLatest;
    });
  }, []);

  // Optimized function to group suspensions by user
  const groupSuspensionsByUser = useCallback((suspensions) => {
    if (!suspensions || suspensions.length === 0) return [];

    const userMap = new Map();

    // Process suspensions in chunks for better performance
    const chunkSize = 100;
    for (let i = 0; i < suspensions.length; i += chunkSize) {
      const chunk = suspensions.slice(i, i + chunkSize);

      chunk.forEach((suspension) => {
        const userId = suspension.user?.id || suspension.userId;
        const username = suspension.user?.username || 'Unknown';

        if (!userMap.has(userId)) {
          userMap.set(userId, {
            userId,
            username,
            user: suspension.user,
            suspensions: [],
            totalSuspensions: 0,
          });
        }

        const userSuspensions = userMap.get(userId);
        userSuspensions.suspensions.push(suspension);
        userSuspensions.totalSuspensions++;
      });
    }

    // Convert to array and sort by most recent suspension (descending)
    const result = Array.from(userMap.values());

    // Optimize sorting for large datasets
    return result.sort((a, b) => {
      if (a.suspensions.length === 0 && b.suspensions.length === 0) return 0;
      if (a.suspensions.length === 0) return 1;
      if (b.suspensions.length === 0) return -1;

      const aLatest = Math.max(
        ...a.suspensions.map((s) => new Date(s.suspendedAt).getTime())
      );
      const bLatest = Math.max(
        ...b.suspensions.map((s) => new Date(s.suspendedAt).getTime())
      );
      return bLatest - aLatest;
    });
  }, []);

  // Optimized function to fetch grouped warnings
  const fetchGroupedWarnings = useCallback(
    async (page = 1, forceRefresh = false) => {
      const cacheKey = `groupedWarnings_${page}`;

      // Return cached data if fresh and not forcing refresh
      if (!forceRefresh && isDataFresh(cacheKey)) {
        const cached = getCachedData(cacheKey);
        if (cached) {
          setGroupedWarnings(cached.paginatedGrouped);
          setGroupedWarningsTotal(cached.total);
          setGroupedWarningsPage(page);
          return;
        }
      }

      try {
        setGroupedWarningsLoading(true);

        // Use smaller limit for better performance
        const response = await request(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/warnings?page=1&limit=200`,
          'GET'
        );

        const warnings = response?.warnings || [];

        // Group by user
        const grouped = groupWarningsByUser(warnings);

        // Paginate the grouped results
        const startIndex = (page - 1) * groupedWarningsPerPage;
        const endIndex = startIndex + groupedWarningsPerPage;
        const paginatedGrouped = grouped.slice(startIndex, endIndex);

        setGroupedWarnings(paginatedGrouped);
        setGroupedWarningsTotal(grouped.length);
        setGroupedWarningsPage(page);

        // Cache the result
        updateCache(cacheKey, {
          paginatedGrouped,
          total: grouped.length,
        });
      } catch (error) {
        console.error('Error fetching grouped warnings:', error);
        setGroupedWarnings([]);
        setGroupedWarningsTotal(0);
      } finally {
        setGroupedWarningsLoading(false);
      }
    },
    [isDataFresh, getCachedData, updateCache]
  );

  // Optimized function to fetch grouped suspensions
  const fetchGroupedSuspensions = useCallback(
    async (page = 1, forceRefresh = false) => {
      const cacheKey = `groupedSuspensions_${page}`;

      // Return cached data if fresh and not forcing refresh
      if (!forceRefresh && isDataFresh(cacheKey)) {
        const cached = getCachedData(cacheKey);
        if (cached) {
          setGroupedSuspensions(cached.paginatedGrouped);
          setGroupedSuspensionsTotal(cached.total);
          setGroupedSuspensionsPage(page);
          return;
        }
      }

      try {
        setGroupedSuspensionsLoading(true);

        // Use smaller limit for better performance
        const response = await request(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/suspension-history-enhanced?page=0&size=200&search=&status=all`,
          'GET'
        );

        const suspensions = response?.history || [];

        // Group by user
        const grouped = groupSuspensionsByUser(suspensions);

        // Paginate the grouped results
        const startIndex = (page - 1) * groupedSuspensionsPerPage;
        const endIndex = startIndex + groupedSuspensionsPerPage;
        const paginatedGrouped = grouped.slice(startIndex, endIndex);

        setGroupedSuspensions(paginatedGrouped);
        setGroupedSuspensionsTotal(grouped.length);
        setGroupedSuspensionsPage(page);

        // Cache the result
        updateCache(cacheKey, {
          paginatedGrouped,
          total: grouped.length,
        });
      } catch (error) {
        console.error('Error fetching grouped suspensions:', error);
        setGroupedSuspensions([]);
        setGroupedSuspensionsTotal(0);
      } finally {
        setGroupedSuspensionsLoading(false);
      }
    },
    [isDataFresh, getCachedData, updateCache]
  );

  // Function to toggle warning user expansion
  const toggleWarningUserExpansion = (userId) => {
    const newExpanded = new Set(expandedWarningUsers);
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId);
    } else {
      newExpanded.add(userId);
    }
    setExpandedWarningUsers(newExpanded);
  };

  // Function to toggle suspension user expansion
  const toggleSuspensionUserExpansion = (userId) => {
    const newExpanded = new Set(expandedSuspensionUsers);
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId);
    } else {
      newExpanded.add(userId);
    }
    setExpandedSuspensionUsers(newExpanded);
  };

  useEffect(() => {
    if (activeTab === 'warnings') {
      if (activeHistoryTab === 'suspended') {
        fetchGroupedSuspensions(1);
      } else if (activeHistoryTab === 'warnings') {
        fetchGroupedWarnings(1);
      }
    }
  }, [activeTab, activeHistoryTab]);

  const handleReactivateClick = (user) => {
    setSelectedUserForReactivation(user);
    setReactivateForm({ reason: '' });
    setShowReactivateModal(true);
  };

  const submitReactivationModal = async () => {
    if (!selectedUserForReactivation) return;

    try {
      const result = await reactivateAccount(
        selectedUserForReactivation.id,
        reactivateForm.reason
      );

      if (result.success) {
        setShowReactivateModal(false);
        setSelectedUserForReactivation(null);
        setReactivateForm({ reason: '' });
      }
    } catch (error) {
      console.error('Error in reactivation modal:', error);
    }
  };

  // Loading component
  const LoadingSpinner = () => (
    <div className="flex min-h-screen items-center justify-center bg-neutral-900">
      <div className="text-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
        <p className="mt-4 text-lg text-gray-400">
          Loading Moderation Panel...
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Please wait while we load essential data
        </p>
      </div>
    </div>
  );

  // Error component
  const ErrorDisplay = ({ message, onRetry }) => (
    <div className="flex min-h-screen items-center justify-center bg-neutral-900">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-600/20">
          <ExclamationTriangleIcon className="h-8 w-8 text-red-400" />
        </div>
        <h2 className="mt-4 text-xl font-semibold text-white">
          Error Loading Data
        </h2>
        <p className="mt-2 text-gray-400">{message}</p>
        <button
          onClick={onRetry}
          className="mt-4 rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    </div>
  );

  // Show loading spinner during initial load
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Show error if there's an error
  if (error) {
    return <ErrorDisplay message={error} onRetry={() => fetchAllData()} />;
  }

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
            <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div className="flex h-12 w-12 items-center justify-center bg-blue-600/20 text-blue-400">
                    <i className="fas fa-shield-alt text-xl"></i>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white sm:text-3xl">
                      Admin Center
                    </h1>
                    <p className="text-sm text-gray-400 sm:text-base">
                      Platform Moderation & Management
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-neutral-700 px-3 py-2">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`h-2 w-2 ${
                        systemStatus === 'online'
                          ? 'animate-pulse bg-green-400'
                          : systemStatus === 'degraded'
                          ? 'animate-pulse bg-yellow-400'
                          : 'animate-pulse bg-red-400'
                      }`}
                    ></div>
                    <span className="text-sm text-gray-300">
                      System{' '}
                      {systemStatus.charAt(0).toUpperCase() +
                        systemStatus.slice(1)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {lastStatusCheck
                        ? lastStatusCheck.toLocaleTimeString()
                        : 'Checking...'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="mb-8">
              {/* Mobile Dropdown */}
              <div className="mobile-menu-container sm:hidden">
                <div className="relative">
                  <button
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                    className="flex w-full items-center justify-between border border-neutral-600 bg-neutral-800 px-4 py-3 text-left text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <div className="flex items-center space-x-3">
                      {activeTab === 'overview' && (
                        <ChartBarIcon className="h-5 w-5 text-blue-400" />
                      )}
                      {activeTab === 'activity' && (
                        <ClockIcon className="h-5 w-5 text-blue-400" />
                      )}
                      {activeTab === 'users' && (
                        <UserGroupIcon className="h-5 w-5 text-blue-400" />
                      )}
                      {activeTab === 'challenges' && (
                        <DocumentTextIcon className="h-5 w-5 text-blue-400" />
                      )}
                      {activeTab === 'reports' && (
                        <ExclamationTriangleIcon className="h-5 w-5 text-blue-400" />
                      )}
                      {activeTab === 'accounts' && (
                        <UserGroupIcon className="h-5 w-5 text-blue-400" />
                      )}
                      {activeTab === 'warnings' && (
                        <ExclamationTriangleIcon className="h-5 w-5 text-blue-400" />
                      )}
                      <span className="font-medium">
                        {activeTab === 'overview' && 'Overview'}
                        {activeTab === 'activity' && 'Recent Activity'}
                        {activeTab === 'users' && `Users (${totalUsers})`}
                        {activeTab === 'challenges' &&
                          `Challenges (${pendingChallenges.length})`}
                        {activeTab === 'reports' &&
                          `Reports (${
                            reportStats?.totalReports || reports.length
                          })`}
                        {activeTab === 'accounts' &&
                          `Accounts (${
                            totalSuspendedAccounts + pendingDeletions.length
                          })`}
                        {activeTab === 'warnings' &&
                          `History (${historyTotalUsers})`}
                      </span>
                    </div>
                    <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                  </button>
                  {showMobileMenu && (
                    <div className="absolute left-0 right-0 top-full z-50 border border-neutral-600 bg-neutral-800 shadow-lg">
                      <div className="py-2">
                        <button
                          onClick={() => {
                            setActiveTab('overview');
                            fetchAllData();
                            setShowMobileMenu(false);
                          }}
                          className="flex w-full items-center space-x-3 px-4 py-3 text-left text-white hover:bg-neutral-700 focus:bg-neutral-700 focus:outline-none"
                        >
                          <ChartBarIcon className="h-5 w-5 text-blue-400" />
                          <span>Overview</span>
                        </button>
                        <button
                          onClick={() => {
                            setActiveTab('activity');
                            fetchRecentActivity();
                            setShowMobileMenu(false);
                          }}
                          className="flex w-full items-center space-x-3 px-4 py-3 text-left text-white hover:bg-neutral-700 focus:bg-neutral-700 focus:outline-none"
                        >
                          <ClockIcon className="h-5 w-5 text-gray-400" />
                          <span>Recent Activity</span>
                        </button>
                        <button
                          onClick={() => {
                            setActiveTab('users');
                            fetchUsers(currentUserPage, userSearchFilter);
                            setShowMobileMenu(false);
                          }}
                          className="flex w-full items-center space-x-3 px-4 py-3 text-left text-white hover:bg-neutral-700 focus:bg-neutral-700 focus:outline-none"
                        >
                          <UserGroupIcon className="h-5 w-5 text-gray-400" />
                          <span>Users ({totalUsers})</span>
                        </button>
                        <button
                          onClick={() => {
                            setActiveTab('challenges');
                            fetchPendingChallenges();
                            setShowMobileMenu(false);
                          }}
                          className="flex w-full items-center space-x-3 px-4 py-3 text-left text-white hover:bg-neutral-700 focus:bg-neutral-700 focus:outline-none"
                        >
                          <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                          <span>Challenges ({pendingChallenges.length})</span>
                        </button>
                        <button
                          onClick={() => {
                            setActiveTab('reports');
                            fetchReports(reportFilters);
                            fetchReportStats();
                            setShowMobileMenu(false);
                          }}
                          className="flex w-full items-center space-x-3 px-4 py-3 text-left text-white hover:bg-neutral-700 focus:bg-neutral-700 focus:outline-none"
                        >
                          <ExclamationTriangleIcon className="h-5 w-5 text-gray-400" />
                          <span>
                            Reports (
                            {reportStats?.totalReports || reports.length})
                          </span>
                        </button>
                        <button
                          onClick={() => {
                            setActiveTab('accounts');
                            // Fetch all accounts-related data
                            fetchSuspendedAccounts(
                              suspendedAccountsPage,
                              suspendedSearchFilter
                            );
                            fetchPendingDeletions(deletionsSearchFilter);
                            fetchDeletionStats();
                            setShowMobileMenu(false);
                          }}
                          className="flex w-full items-center space-x-3 px-4 py-3 text-left text-white hover:bg-neutral-700 focus:bg-neutral-700 focus:outline-none"
                        >
                          <UserGroupIcon className="h-5 w-5 text-gray-400" />
                          <span>
                            Accounts (
                            {totalSuspendedAccounts + pendingDeletions.length})
                          </span>
                        </button>
                        <button
                          onClick={() => {
                            setActiveTab('warnings');
                            // Fetch all history-related data
                            fetchGroupedSuspensions(groupedSuspensionsPage);
                            fetchGroupedWarnings(groupedWarningsPage);
                            calculateHistoryTotalUsers();
                            setShowMobileMenu(false);
                          }}
                          className="flex w-full items-center space-x-3 px-4 py-3 text-left text-white hover:bg-neutral-700 focus:bg-neutral-700 focus:outline-none"
                        >
                          <ExclamationTriangleIcon className="h-5 w-5 text-gray-400" />
                          <span>History ({historyTotalUsers})</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Desktop Tabs */}
              <div className="hidden sm:block">
                <div className="border-b border-neutral-700">
                  <nav className="flex space-x-8">
                    <TabButton
                      id="overview"
                      label="Overview"
                      icon={ChartBarIcon}
                    />
                    <TabButton
                      id="activity"
                      label="Recent Activity"
                      icon={ClockIcon}
                    />
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
                      count={reportStats?.totalReports || reports.length}
                    />
                    <TabButton
                      id="accounts"
                      label="Accounts"
                      icon={UserGroupIcon}
                      count={totalSuspendedAccounts + pendingDeletions.length}
                    />
                    <TabButton
                      id="warnings"
                      label="History"
                      icon={ExclamationTriangleIcon}
                      count={historyTotalUsers}
                    />
                  </nav>
                </div>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'activity' && (
              <div className="space-y-6">
                {/* Activity Tab Navigation */}
                <div className="border-b border-neutral-700">
                  <nav className="flex flex-wrap space-x-2 sm:space-x-8">
                    <button
                      onClick={() => {
                        setActiveActivityTab('comments');
                        fetchRecentActivity();
                      }}
                      className={`border-b-2 px-1 py-2 text-xs font-medium transition-colors duration-200 sm:py-4 sm:text-sm ${
                        activeActivityTab === 'comments'
                          ? 'border-blue-500 text-blue-400'
                          : 'border-transparent text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      Comments
                      <span
                        className={`ml-1 px-1 py-0.5 text-xs font-medium sm:ml-2 sm:px-2 sm:py-1 ${
                          recentActivity.comments.length > 0
                            ? 'bg-blue-600/20 text-blue-400'
                            : 'bg-gray-600/20 text-gray-400'
                        }`}
                      >
                        {recentActivity.comments.length || 0}
                      </span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveActivityTab('writeups');
                        fetchRecentActivity();
                      }}
                      className={`border-b-2 px-1 py-2 text-xs font-medium transition-colors duration-200 sm:py-4 sm:text-sm ${
                        activeActivityTab === 'writeups'
                          ? 'border-green-500 text-green-400'
                          : 'border-transparent text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      Writeups
                      <span
                        className={`ml-1 px-1 py-0.5 text-xs font-medium sm:ml-2 sm:px-2 sm:py-1 ${
                          recentActivity.writeups.length > 0
                            ? 'bg-green-600/20 text-green-400'
                            : 'bg-gray-600/20 text-gray-400'
                        }`}
                      >
                        {recentActivity.writeups.length || 0}
                      </span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveActivityTab('lessons');
                        fetchRecentActivity();
                      }}
                      className={`border-b-2 px-1 py-2 text-xs font-medium transition-colors duration-200 sm:py-4 sm:text-sm ${
                        activeActivityTab === 'lessons'
                          ? 'border-purple-500 text-purple-400'
                          : 'border-transparent text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      Lessons
                      <span
                        className={`ml-1 px-1 py-0.5 text-xs font-medium sm:ml-2 sm:px-2 sm:py-1 ${
                          recentActivity.lessons.length > 0
                            ? 'bg-purple-600/20 text-purple-400'
                            : 'bg-gray-600/20 text-gray-400'
                        }`}
                      >
                        {recentActivity.lessons.length || 0}
                      </span>
                    </button>
                  </nav>
                </div>

                {/* Activity Content */}
                <div className="border border-neutral-700/50 bg-neutral-800/80 p-4 backdrop-blur-sm sm:p-8">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        Recent{' '}
                        {activeActivityTab.charAt(0).toUpperCase() +
                          activeActivityTab.slice(1)}
                      </h2>
                      <p className="text-sm text-gray-400">
                        Latest {activeActivityTab} across the platform
                      </p>
                    </div>
                    <button
                      onClick={refreshActivity}
                      className="flex items-center space-x-2 border border-blue-500/30 bg-blue-600/10 px-3 py-2 text-blue-400 transition-all duration-200 hover:border-blue-500/50 hover:bg-blue-600/20 sm:px-4"
                    >
                      <i className="fas fa-sync-alt text-sm"></i>
                      <span className="hidden sm:inline">Refresh</span>
                    </button>
                  </div>

                  {loadingActivity ? (
                    <div className="flex justify-center py-12">
                      <div className="text-gray-400">
                        Loading recent {activeActivityTab}...
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Comments Content */}
                      {activeActivityTab === 'comments' && (
                        <div>
                          {recentActivity.comments.length === 0 ? (
                            <div className="border border-neutral-600/50 bg-neutral-700/30 p-8 text-center">
                              <i className="fas fa-comments mb-4 text-4xl text-gray-500"></i>
                              <h3 className="text-lg font-medium text-white">
                                No recent comments
                              </h3>
                              <p className="mt-2 text-gray-400">
                                No comments have been posted recently.
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {recentActivity.comments.map((comment) => (
                                <div
                                  key={comment.id}
                                  className="cursor-pointer border border-neutral-600/50 bg-neutral-700/30 p-4 transition-all duration-200 hover:border-blue-500/50"
                                  onClick={() =>
                                    window.open(
                                      `/challenges/${
                                        comment.challengeSlug ||
                                        comment.challengeId ||
                                        ''
                                      }?tab=comments`,
                                      '_blank'
                                    )
                                  }
                                >
                                  <div className="flex items-start space-x-3">
                                    <img
                                      className="h-10 w-10 rounded border border-neutral-600 bg-neutral-700 object-cover"
                                      src={
                                        comment.profilePicture
                                          ? comment.profilePicture
                                          : `https://robohash.org/${comment.username}.png?set=set1&size=150x150`
                                      }
                                      alt={comment.username}
                                      onError={(e) => {
                                        e.target.src = `https://robohash.org/${comment.username}.png?set=set1&size=150x150`;
                                        e.target.onerror = null;
                                      }}
                                    />
                                    <div className="min-w-0 flex-1">
                                      <div className="mb-1 flex items-center space-x-2">
                                        <span className="font-medium text-white hover:text-blue-400">
                                          {comment.username}
                                        </span>
                                        <span className="text-sm text-gray-400">
                                          {new Date(
                                            comment.createdAt
                                          ).toLocaleDateString()}{' '}
                                          {new Date(
                                            comment.createdAt
                                          ).toLocaleTimeString([], {
                                            hour: 'numeric',
                                            minute: 'numeric',
                                            hour12: true,
                                          })}
                                        </span>
                                      </div>
                                      <div className="mb-2 text-sm text-blue-400">
                                        on {comment.challengeTitle}
                                      </div>
                                      <div className="text-gray-300">
                                        {comment.content}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Writeups Content */}
                      {activeActivityTab === 'writeups' && (
                        <div>
                          {recentActivity.writeups.length === 0 ? (
                            <div className="border border-neutral-600/50 bg-neutral-700/30 p-8 text-center">
                              <i className="fas fa-file-alt mb-4 text-4xl text-gray-500"></i>
                              <h3 className="text-lg font-medium text-white">
                                No recent writeups
                              </h3>
                              <p className="mt-2 text-gray-400">
                                No writeups have been posted recently.
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {recentActivity.writeups.map((writeup) => (
                                <div
                                  key={writeup.id}
                                  className="cursor-pointer border border-neutral-600/50 bg-neutral-700/30 p-4 transition-all duration-200 hover:border-green-500/50"
                                  onClick={() =>
                                    window.open(
                                      `/challenges/${
                                        writeup.challengeSlug ||
                                        writeup.challengeId ||
                                        ''
                                      }?tab=writeups`,
                                      '_blank'
                                    )
                                  }
                                >
                                  <div className="flex items-start space-x-3">
                                    <img
                                      className="h-10 w-10 rounded border border-neutral-600 bg-neutral-700 object-cover"
                                      src={
                                        writeup.profilePicture
                                          ? writeup.profilePicture
                                          : `https://robohash.org/${writeup.username}.png?set=set1&size=150x150`
                                      }
                                      alt={writeup.username}
                                      onError={(e) => {
                                        e.target.src = `https://robohash.org/${writeup.username}.png?set=set1&size=150x150`;
                                        e.target.onerror = null;
                                      }}
                                    />
                                    <div className="min-w-0 flex-1">
                                      <div className="mb-1 flex items-center space-x-2">
                                        <span className="font-medium text-white hover:text-green-400">
                                          {writeup.username}
                                        </span>
                                        <span className="text-sm text-gray-400">
                                          {new Date(
                                            writeup.createdAt
                                          ).toLocaleDateString()}{' '}
                                          {new Date(
                                            writeup.createdAt
                                          ).toLocaleTimeString([], {
                                            hour: 'numeric',
                                            minute: 'numeric',
                                            hour12: true,
                                          })}
                                        </span>
                                      </div>
                                      <div className="mb-2 text-sm text-green-400">
                                        for {writeup.challengeTitle}
                                      </div>
                                      <div className="text-gray-300">
                                        {writeup.content}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Lessons Content */}
                      {activeActivityTab === 'lessons' && (
                        <div>
                          {recentActivity.lessons.length === 0 ? (
                            <div className="border border-neutral-600/50 bg-neutral-700/30 p-8 text-center">
                              <i className="fas fa-graduation-cap mb-4 text-4xl text-gray-500"></i>
                              <h3 className="text-lg font-medium text-white">
                                No recent lessons
                              </h3>
                              <p className="mt-2 text-gray-400">
                                No lessons have been created recently.
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {recentActivity.lessons.map((lesson) => (
                                <div
                                  key={lesson.id}
                                  className="cursor-pointer border border-neutral-600/50 bg-neutral-700/30 p-4 transition-all duration-200 hover:border-purple-500/50"
                                  onClick={() =>
                                    window.open(
                                      `/learn/lessons/${lesson.id}`,
                                      '_blank'
                                    )
                                  }
                                >
                                  <div className="flex items-start space-x-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded bg-purple-600/20">
                                      <i className="fas fa-graduation-cap text-purple-400"></i>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <div className="mb-1 flex items-center space-x-2">
                                        <span className="font-medium text-white hover:text-purple-400">
                                          {lesson.title}
                                        </span>
                                        <span className="text-sm text-gray-400">
                                          {new Date(
                                            lesson.createdAt
                                          ).toLocaleDateString()}{' '}
                                          {new Date(
                                            lesson.createdAt
                                          ).toLocaleTimeString([], {
                                            hour: 'numeric',
                                            minute: 'numeric',
                                            hour12: true,
                                          })}
                                        </span>
                                      </div>
                                      <div className="mb-2 flex items-center space-x-2">
                                        <span className="text-sm text-purple-400">
                                          by {lesson.author}
                                        </span>
                                        <span
                                          className={`border px-2 py-0.5 text-xs ${
                                            lesson.status === 'PUBLISHED'
                                              ? 'border-green-500/30 bg-green-600/10 text-green-400'
                                              : lesson.status === 'DRAFT'
                                              ? 'border-yellow-500/30 bg-yellow-600/10 text-yellow-400'
                                              : 'border-gray-500/30 bg-gray-600/10 text-gray-400'
                                          }`}
                                        >
                                          {lesson.status}
                                        </span>
                                      </div>
                                      <div className="text-gray-300">
                                        {lesson.description}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Enhanced Platform Statistics Dashboard */}
                <div className="border border-neutral-700/50 bg-neutral-800/80 p-8 backdrop-blur-sm">
                  <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h2 className="text-2xl font-bold text-white">
                          Platform Analytics
                        </h2>
                        <p className="text-sm text-gray-400">
                          Real-time platform statistics and insights
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex h-3 w-3 animate-pulse bg-green-400"></div>
                      <span className="text-sm font-medium text-green-400">
                        Live
                      </span>
                    </div>
                  </div>

                  {stats ? (
                    <>
                      {/* Primary Stats Grid */}
                      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {/* Total Users */}
                        <div className="group relative overflow-hidden border border-blue-500/20 bg-blue-600/10 p-6 transition-all duration-300 hover:border-blue-500/40">
                          <div className="text-center">
                            <p className="text-3xl font-bold text-white">
                              {stats?.userCount?.toLocaleString() || '0'}
                            </p>
                            <p className="text-sm font-medium text-blue-400">
                              Total Users
                            </p>
                          </div>
                          <div className="mt-4 flex items-center space-x-2">
                            <div className="h-1 w-full bg-blue-500/20">
                              <div className="h-1 w-3/4 bg-blue-400"></div>
                            </div>
                          </div>
                        </div>

                        {/* New Joiners (24h) */}
                        <div className="group relative overflow-hidden border border-green-500/20 bg-green-600/10 p-6 transition-all duration-300 hover:border-green-500/40">
                          <div className="text-center">
                            <p className="text-3xl font-bold text-white">
                              {stats?.recentSignUpsCount24h || 0}
                            </p>
                            <p className="text-sm font-medium text-green-400">
                              New Joiners (24h)
                            </p>
                          </div>
                          <div className="mt-4 flex items-center justify-center">
                            <div className="flex items-center space-x-1 text-xs text-green-400">
                              <span>
                                +
                                {(
                                  (stats?.recentSignUpsCount24h || 0) / 7
                                ).toFixed(1)}
                                % vs avg
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Total Challenges */}
                        <div className="group relative overflow-hidden border border-purple-500/20 bg-purple-600/10 p-6 transition-all duration-300 hover:border-purple-500/40">
                          <div className="text-center">
                            <p className="text-3xl font-bold text-white">
                              {stats?.challengeCount?.toLocaleString() || '0'}
                            </p>
                            <p className="text-sm font-medium text-purple-400">
                              Total Challenges
                            </p>
                          </div>
                          <div className="mt-4 flex items-center space-x-2">
                            <div className="h-1 w-full bg-purple-500/20">
                              <div className="h-1 w-2/3 bg-purple-400"></div>
                            </div>
                          </div>
                        </div>

                        {/* Verified Challenges */}
                        <div className="group relative overflow-hidden border border-emerald-500/20 bg-emerald-600/10 p-6 transition-all duration-300 hover:border-emerald-500/40">
                          <div className="text-center">
                            <p className="text-3xl font-bold text-white">
                              {stats?.verifiedChallengeCount?.toLocaleString() ||
                                '0'}
                            </p>
                            <p className="text-sm font-medium text-emerald-400">
                              Verified Challenges
                            </p>
                          </div>
                          <div className="mt-4 flex items-center justify-center">
                            <div className="flex items-center space-x-1 text-xs text-emerald-400">
                              <span>
                                {(
                                  ((stats?.verifiedChallengeCount || 0) /
                                    (stats?.challengeCount || 1)) *
                                  100
                                ).toFixed(1)}
                                % verified
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Secondary Stats Grid */}
                      <div className="mb-8 grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-6">
                        {/* Pending Challenges */}
                        <div className="border border-yellow-500/20 bg-yellow-600/10 p-4 text-center transition-all duration-300 hover:border-yellow-500/40">
                          <p className="text-xl font-bold text-white">
                            {pendingChallenges.length}
                          </p>
                          <p className="text-xs font-medium text-yellow-400">
                            Pending
                          </p>
                        </div>

                        {/* Reports */}
                        <div className="border border-red-500/20 bg-red-600/10 p-4 text-center transition-all duration-300 hover:border-red-500/40">
                          <p className="text-xl font-bold text-white">
                            {reportStats?.totalReports || reports.length}
                          </p>
                          <p className="text-xs font-medium text-red-400">
                            Reports
                          </p>
                        </div>

                        {/* Suspended Accounts */}
                        <div className="border border-orange-500/20 bg-orange-600/10 p-4 text-center transition-all duration-300 hover:border-orange-500/40">
                          <p className="text-xl font-bold text-white">
                            {totalSuspendedAccounts}
                          </p>
                          <p className="text-xs font-medium text-orange-400">
                            Suspended
                          </p>
                        </div>

                        {/* Account Deletions */}
                        <div className="border border-pink-500/20 bg-pink-600/10 p-4 text-center transition-all duration-300 hover:border-pink-500/40">
                          <p className="text-xl font-bold text-white">
                            {pendingDeletions.length}
                          </p>
                          <p className="text-xs font-medium text-pink-400">
                            Deletions
                          </p>
                        </div>

                        {/* Verification Rate */}
                        <div className="border border-indigo-500/20 bg-indigo-600/10 p-4 text-center transition-all duration-300 hover:border-indigo-500/40">
                          <p className="text-xl font-bold text-white">
                            {(
                              ((stats?.verifiedChallengeCount || 0) /
                                (stats?.challengeCount || 1)) *
                              100
                            ).toFixed(0)}
                            %
                          </p>
                          <p className="text-xs font-medium text-indigo-400">
                            Verified
                          </p>
                        </div>

                        {/* Weekly Projection */}
                        <div className="border border-cyan-500/20 bg-cyan-600/10 p-4 text-center transition-all duration-300 hover:border-cyan-500/40">
                          <p className="text-xl font-bold text-white">
                            {(stats?.recentSignUpsCount24h || 0) * 7}
                          </p>
                          <p className="text-xs font-medium text-cyan-400">
                            Weekly User Est.
                          </p>
                        </div>
                      </div>

                      {/* Recent Activity Section */}
                      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                        {/* Recent Joiners */}
                        <div className="border border-neutral-600/50 bg-neutral-700/30 p-6 backdrop-blur-sm">
                          <div className="mb-6 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="flex h-10 w-10 items-center justify-center bg-green-500/20 text-green-400">
                                <i className="fas fa-users text-lg"></i>
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-white">
                                  Recent Joiners
                                </h3>
                                <p className="text-sm text-gray-400">
                                  Latest members to join the platform
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-green-400">
                                {stats?.recentSignUpsCount24h || 0} in last 24h
                              </p>
                              <p className="text-xs text-gray-500">
                                Showing latest{' '}
                                {Math.min(6, stats?.recentSignUps?.length || 0)}
                              </p>
                            </div>
                          </div>

                          {stats?.recentSignUps &&
                          stats?.recentSignUps.length > 0 ? (
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                              {stats?.recentSignUps.slice(0, 6).map((user) => (
                                <div
                                  key={user.id}
                                  className="group cursor-pointer border border-neutral-600/50 bg-neutral-600/30 p-4 transition-all duration-300 hover:scale-105 hover:border-green-500/50 hover:bg-neutral-600/50"
                                  onClick={() =>
                                    window.open(
                                      `/users/${user.username}`,
                                      '_blank'
                                    )
                                  }
                                >
                                  <div className="flex flex-col items-center text-center">
                                    <div className="relative mb-3">
                                      <img
                                        src={
                                          user.profileImage ||
                                          'https://robohash.org/' +
                                            user.username
                                        }
                                        alt={`${user.username}'s profile`}
                                        className="h-12 w-12 border-2 border-green-500/30 transition-all duration-300 group-hover:border-green-500/60"
                                      />
                                      <div className="absolute -right-1 -top-1 h-4 w-4 bg-green-500 ring-2 ring-neutral-800"></div>
                                    </div>
                                    <div className="w-full min-w-0">
                                      <p className="truncate text-sm font-medium text-white transition-colors group-hover:text-green-400">
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
                          ) : (
                            <div className="py-8 text-center">
                              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center bg-neutral-600/50">
                                <i className="fas fa-user-plus text-2xl text-gray-400"></i>
                              </div>
                              <p className="text-gray-400">
                                No recent sign-ups
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Recent Logins */}
                        <div className="border border-neutral-600/50 bg-neutral-700/30 p-6 backdrop-blur-sm">
                          <div className="mb-6 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="flex h-10 w-10 items-center justify-center bg-green-500/20 text-green-400">
                                <i className="fas fa-sign-in-alt text-lg"></i>
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-white">
                                  Recent Logins
                                </h3>
                                <p className="text-sm text-gray-400">
                                  Users active in last 24h
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-green-400">
                                {stats?.recentLogins?.length || 0} users
                              </span>
                            </div>
                          </div>

                          {stats?.recentLogins?.length > 0 ? (
                            <div className="grid grid-cols-2 gap-4">
                              {stats?.recentLogins
                                .slice(0, 4)
                                .map((user, index) => (
                                  <div
                                    key={user.uid || index}
                                    className="group cursor-pointer border border-neutral-600/50 bg-neutral-600/30 p-4 transition-all duration-300 hover:border-green-500/50 hover:bg-neutral-600/50"
                                    onClick={() =>
                                      window.open(
                                        `/users/${user.username}`,
                                        '_blank'
                                      )
                                    }
                                  >
                                    <div className="flex items-center space-x-3">
                                      <div className="relative">
                                        <img
                                          src={
                                            user.profileImage &&
                                            user.profileImage !== ''
                                              ? user.profileImage
                                              : `https://robohash.org/${user.username}?set=set1&size=48x48`
                                          }
                                          alt={user.username}
                                          className="h-12 w-12 border-2 border-green-500/30 object-cover transition-all duration-300 group-hover:border-green-500/60"
                                          onError={(e) => {
                                            e.target.src = `https://robohash.org/${user.username}?set=set1&size=48x48`;
                                          }}
                                        />
                                        <div className="absolute -right-1 -top-1 h-3 w-3 bg-green-500 ring-1 ring-neutral-800"></div>
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium text-white transition-colors group-hover:text-green-400">
                                          {user.username}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                          {new Date(
                                            user.lastLogin
                                          ).toLocaleTimeString()}
                                        </p>
                                        {user.role === 'ADMIN' && (
                                          <span className="mt-1 inline-block bg-red-600/20 px-1 py-0.5 text-xs font-medium text-red-400">
                                            ADMIN
                                          </span>
                                        )}
                                        {user.role === 'PRO' && (
                                          <span className="mt-1 inline-block bg-yellow-600/20 px-1 py-0.5 text-xs font-medium text-yellow-400">
                                            PRO
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          ) : (
                            <div className="py-8 text-center">
                              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center bg-neutral-600/50">
                                <i className="fas fa-sign-in-alt text-2xl text-gray-400"></i>
                              </div>
                              <p className="text-gray-400">No recent logins</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="py-16 text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center bg-red-600/20">
                        <i className="fas fa-exclamation-triangle text-2xl text-red-400"></i>
                      </div>
                      <h3 className="mb-2 text-lg font-medium text-white">
                        Failed to load statistics
                      </h3>
                      <p className="mb-4 text-gray-400">
                        Unable to fetch platform analytics data
                      </p>
                      <button
                        onClick={fetchStats}
                        className="bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-500"
                      >
                        <i className="fas fa-sync-alt mr-2"></i>
                        Retry
                      </button>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  {/* User Actions */}
                  <div className="border border-neutral-700 bg-neutral-800 p-6 transition-all duration-200 hover:border-neutral-600">
                    <div className="mb-6">
                      <h3 className="text-xl text-white">User Management</h3>
                    </div>

                    <div className="space-y-4">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Enter username to manage"
                          className="w-full border-0 bg-neutral-700/80 px-4 py-3 text-white placeholder-gray-400 shadow-inner transition-all duration-200 focus:bg-neutral-700 focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-0"
                          id="username-input"
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
                          <div className="user-suggestions absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-y-auto border border-neutral-600 bg-neutral-800 shadow-lg">
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
                                  className="h-8 w-8"
                                />
                                <div className="flex-1">
                                  <p className="font-medium text-white">
                                    {user.username}
                                  </p>
                                  <p className="text-xs text-gray-400">{user.email || ''}</p>
                                  <p className="text-xs text-gray-500">
                                    {user.points || 0} points • Joined{' '}
                                    {new Date(
                                      user.createdAt
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                                {user.disabled && (
                                  <span className="bg-red-600 px-2 py-1 text-xs text-white">
                                    Disabled
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="relative">
                        <textarea
                          placeholder="Reason for action (required for audit trail)"
                          className="w-full border-0 bg-neutral-700/80 px-4 py-3 text-white placeholder-gray-400 shadow-inner transition-all duration-200 focus:bg-neutral-700 focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-0"
                          rows="3"
                          id="reason-input"
                        />
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <button
                            className="flex items-center justify-center space-x-2 border border-red-600/30 bg-red-600/10 px-4 py-3 text-sm font-medium text-red-400 transition-all duration-200 hover:border-red-500/50 hover:bg-red-600/20"
                            onClick={handleDisableAccount}
                          >
                            <span>Disable Account</span>
                          </button>

                          <button
                            className="flex items-center justify-center space-x-2 border border-green-600/30 bg-green-600/10 px-4 py-3 text-sm font-medium text-green-400 transition-all duration-200 hover:border-green-500/50 hover:bg-green-600/20"
                            onClick={handleEnableAccount}
                          >
                            <span>Enable Account</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <button
                            className="flex items-center justify-center space-x-2 border border-yellow-600/30 bg-yellow-600/10 px-4 py-3 text-sm font-medium text-yellow-400 transition-all duration-200 hover:border-yellow-500/50 hover:bg-yellow-600/20"
                            onClick={handleWarnUser}
                          >
                            <i className="fas fa-exclamation-triangle"></i>
                            <span>Warn User</span>
                          </button>

                          <button
                            className="flex items-center justify-center space-x-2 border border-neutral-600 bg-neutral-700 px-4 py-3 text-sm font-medium text-white transition-all duration-200 hover:border-neutral-500 hover:bg-neutral-600"
                            onClick={handleResetPFP}
                          >
                            <span>Reset Avatar</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <button
                            className="flex items-center justify-center space-x-2 border border-neutral-600 bg-neutral-700 px-4 py-3 text-sm font-medium text-white transition-all duration-200 hover:border-neutral-500 hover:bg-neutral-600"
                            onClick={handleResetBanner}
                          >
                            <span>Reset Banner</span>
                          </button>

                          <button
                            className="flex items-center justify-center space-x-2 border border-neutral-600 bg-neutral-700 px-4 py-3 text-sm font-medium text-white transition-all duration-200 hover:border-neutral-500 hover:bg-neutral-600"
                            onClick={handleResetBio}
                          >
                            <span>Reset Bio</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Challenge Actions */}
                  <div className="border border-neutral-700 bg-neutral-800 p-6 transition-all duration-200 hover:border-neutral-600">
                    <div className="mb-6">
                      <h3 className="text-xl text-white">
                        Challenge Management
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Enter challenge ID or search by title"
                          className="w-full border-0 bg-neutral-700/80 px-4 py-3 text-white placeholder-gray-400 shadow-inner transition-all duration-200 focus:bg-neutral-700 focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-0"
                          id="challenge-input"
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
                            <div className="challenge-suggestions absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-y-auto border border-neutral-600 bg-neutral-800 shadow-lg">
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
                                        <span className="bg-green-600 px-2 py-1 text-xs text-white">
                                          Approved
                                        </span>
                                      ) : (
                                        <span className="bg-yellow-600 px-2 py-1 text-xs text-white">
                                          Pending
                                        </span>
                                      )}
                                      {challenge.difficulty && (
                                        <span className="bg-neutral-600 px-2 py-0.5 text-xs text-gray-300">
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
                        <textarea
                          placeholder="Reason for action (required for audit trail)"
                          className="w-full border-0 bg-neutral-700/80 px-4 py-3 text-white placeholder-gray-400 shadow-inner transition-all duration-200 focus:bg-neutral-700 focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-0"
                          rows="3"
                          id="challenge-reason-input"
                        />
                      </div>

                      <div className="space-y-3">
                        <button
                          className="flex w-full items-center justify-center space-x-3 border border-red-600/30 bg-red-600/10 px-6 py-4 font-medium text-red-400 transition-all duration-200 hover:border-red-500/50 hover:bg-red-600/20"
                          onClick={handleDeleteChallenge}
                        >
                          <i className="fas fa-exclamation-triangle"></i>
                          <span>Delete Challenge</span>
                          <div className="ml-auto bg-red-500/30 px-2 py-1 text-xs text-red-300">
                            Permanent
                          </div>
                        </button>

                        <button
                          className="flex w-full items-center justify-center space-x-3 border border-yellow-600/30 bg-yellow-600/10 px-6 py-4 font-medium text-yellow-400 transition-all duration-200 hover:border-yellow-500/50 hover:bg-yellow-600/20"
                          onClick={handleUnapproveChallenge}
                        >
                          <span>Unapprove Challenge</span>
                          <div className="ml-auto bg-yellow-500/30 px-2 py-1 text-xs text-yellow-300">
                            Reversible
                          </div>
                        </button>

                        <button
                          className="flex w-full items-center justify-center space-x-3 border border-blue-600/30 bg-blue-600/10 px-6 py-4 font-medium text-blue-400 transition-all duration-200 hover:border-blue-500/50 hover:bg-blue-600/20"
                          onClick={handleResyncLeaderboard}
                        >
                          <span>Resync Leaderboard</span>
                          <div className="ml-auto bg-blue-500/30 px-2 py-1 text-xs text-blue-300">
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
              <div className="space-y-6">
                {/* User Management Section */}
                <div className="space-y-6 border border-neutral-700/50 bg-neutral-800/50 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-600/20 p-2">
                        <UserGroupIcon className="h-6 w-6 text-blue-400" />
                      </div>
                      <h2 className="text-xl font-semibold text-white">
                        User Management
                      </h2>
                    </div>
                    <button
                      onClick={() =>
                        fetchUsers(currentUserPage, userSearchFilter)
                      }
                      className="flex items-center space-x-2 border border-blue-500/30 bg-blue-600/10 px-3 py-2 text-blue-400 transition-all duration-200 hover:border-blue-500/50 hover:bg-blue-600/20 sm:px-4"
                    >
                      <i className="fas fa-sync-alt text-sm"></i>
                      <span className="hidden sm:inline">Refresh</span>
                    </button>
                  </div>

                  {/* Search Bar */}
                  <div className="relative">
                    <div className="absolute left-4 top-3">
                      <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search users by username, email, or name..."
                      className="w-full border-0 bg-neutral-700/80 py-3 pl-12 pr-4 text-white placeholder-gray-400 shadow-inner transition-all duration-200 focus:bg-neutral-700 focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-0"
                      value={userSearchFilter}
                      onChange={(e) => {
                        setUserSearchFilter(e.target.value);
                        handleUserInputChange(e); // trigger suggestions
                        clearTimeout(window.userSearchTimeout2);
                        window.userSearchTimeout2 = setTimeout(() => {
                          setCurrentUserPage(0);
                          fetchUsers(0, e.target.value);
                        }, 500);
                      }}
                      onFocus={() => {
                        if (userSuggestions.length > 0) {
                          setShowUserSuggestions(true);
                        }
                      }}
                      onBlur={() => {
                        setTimeout(() => setShowUserSuggestions(false), 200);
                      }}
                      autoComplete="off"
                    />
                    {/* User Suggestions Dropdown */}
                    {showUserSuggestions && userSuggestions.length > 0 && (
                      <div className="user-suggestions absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-y-auto border border-neutral-600 bg-neutral-800 shadow-lg">
                        {userSuggestions.map((user) => (
                          <div
                            key={user.id}
                            className="flex cursor-pointer items-center space-x-3 px-4 py-3 transition-colors duration-200 hover:bg-neutral-700"
                            onClick={() => {
                              setUserSearchFilter(user.username);
                              setShowUserSuggestions(false);
                              setUserSuggestions([]);
                              setCurrentUserPage(0);
                              fetchUsers(0, user.username);
                            }}
                          >
                            <img
                              src={
                                user.profileImage ||
                                'https://robohash.org/' + user.username
                              }
                              alt={`${user.username}'s profile`}
                              className="h-8 w-8"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-white">
                                {user.username}
                              </p>
                              <p className="text-xs text-gray-400">{user.email || ''}</p>
                              <p className="text-xs text-gray-500">
                                {user.points || 0} points • Joined{' '}
                                {new Date(user.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            {user.disabled && (
                              <span className="bg-red-600 px-2 py-1 text-xs text-white">
                                Disabled
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Users Grid */}
                  {users.length > 0 ? (
                    <>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                        {users.map((user) => (
                          <div
                            key={user.id}
                            className="group relative border border-neutral-700/50 bg-neutral-800/80 p-4 transition-all duration-200 hover:border-neutral-600 hover:bg-neutral-800"
                          >
                            {/* 3-dot menu - Always visible */}
                            <button
                              onClick={() => {
                                setSelectedUserForManagement(user);
                                setShowUserManagementPopup(true);
                                // Pre-fill the username in the main input and focus on reason field
                                setTimeout(() => {
                                  const usernameInput =
                                    document.getElementById('username-input');
                                  const reasonInput =
                                    document.getElementById('popupReasonInput');
                                  if (usernameInput) {
                                    usernameInput.value = user.username;
                                  }
                                  if (reasonInput) {
                                    reasonInput.focus();
                                  }
                                }, 100);
                              }}
                              className="absolute right-2 top-2 p-1.5 text-gray-400 transition-all duration-200 hover:bg-neutral-700 hover:text-white"
                              title="Manage User"
                            >
                              <EllipsisVerticalIcon className="h-4 w-4" />
                            </button>

                            <div className="flex flex-col items-center space-y-3">
                              <img
                                src={
                                  user.profileImage ||
                                  `https://robohash.org/${user.username}`
                                }
                                alt={`${user.username}'s profile`}
                                className="h-12 w-12 border-2 border-neutral-600"
                              />
                              <div className="text-center">
                                <h3 className="truncate text-sm font-medium text-white">
                                  {user.username}
                                </h3>
                                <p className="truncate text-xs text-gray-400">
                                  {user.points || 0} points
                                </p>
                                <p className="truncate text-xs text-gray-500">
                                  {new Date(
                                    user.createdAt
                                  ).toLocaleDateString()}
                                </p>
                                {user.role && user.role !== 'USER' && (
                                  <span
                                    className={`mt-1 inline-block px-2 py-0.5 text-xs font-medium ${
                                      user.role === 'ADMIN'
                                        ? 'bg-red-600/20 text-red-400'
                                        : user.role === 'PRO'
                                        ? 'bg-purple-600/20 text-purple-400'
                                        : 'bg-gray-600/20 text-gray-400'
                                    }`}
                                  >
                                    {user.role}
                                  </span>
                                )}
                                {user.status && user.status !== 'ACTIVE' && (
                                  <span
                                    className={`mt-1 inline-block px-2 py-0.5 text-xs font-medium ${
                                      user.status === 'DISABLED'
                                        ? 'bg-red-600/20 text-red-400'
                                        : user.status === 'DELETED'
                                        ? 'bg-gray-600/20 text-gray-400'
                                        : user.status === 'SUSPENDED'
                                        ? 'bg-orange-600/20 text-orange-400'
                                        : 'bg-yellow-600/20 text-yellow-400'
                                    }`}
                                  >
                                    {user.status}
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() =>
                                  window.open(
                                    `/users/${user.username}`,
                                    '_blank'
                                  )
                                }
                                className="w-full border border-blue-600/30 bg-blue-600/10 px-3 py-1.5 text-xs font-medium text-blue-400 transition-all duration-200 hover:border-blue-500/50 hover:bg-blue-600/20"
                              >
                                View Profile
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Pagination Controls - Bottom */}
                      <div className="border-t border-neutral-700 pt-4">
                        <div className="flex items-center justify-between">
                          {/* Pagination Info */}
                          <div className="text-sm text-gray-400">
                            Page {currentUserPage + 1} of {totalUserPages} (
                            {totalUsers} total users)
                          </div>

                          {/* Pagination Controls */}
                          {totalUserPages > 1 && (
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => {
                                  setCurrentUserPage(0);
                                  fetchUsers(0, userSearchFilter);
                                }}
                                disabled={currentUserPage === 0}
                                className="border border-neutral-600 bg-neutral-700 px-3 py-2 text-sm text-white transition-all duration-200 hover:border-neutral-500 hover:bg-neutral-600 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                First
                              </button>
                              <button
                                onClick={() => {
                                  const newPage = Math.max(
                                    0,
                                    currentUserPage - 1
                                  );
                                  setCurrentUserPage(newPage);
                                  fetchUsers(newPage, userSearchFilter);
                                }}
                                disabled={currentUserPage === 0}
                                className="flex items-center space-x-1 border border-neutral-600 bg-neutral-700 px-3 py-2 text-sm text-white transition-all duration-200 hover:border-neutral-500 hover:bg-neutral-600 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <ChevronLeftIcon className="h-4 w-4" />
                                <span>Previous</span>
                              </button>

                              {/* Page numbers */}
                              {Array.from(
                                { length: Math.min(5, totalUserPages) },
                                (_, i) => {
                                  const pageStart = Math.max(
                                    0,
                                    Math.min(
                                      currentUserPage - 2,
                                      totalUserPages - 5
                                    )
                                  );
                                  const pageNum = pageStart + i;
                                  if (pageNum >= totalUserPages) return null;

                                  return (
                                    <button
                                      key={pageNum}
                                      onClick={() => {
                                        setCurrentUserPage(pageNum);
                                        fetchUsers(pageNum, userSearchFilter);
                                      }}
                                      className={`border px-3 py-2 text-sm transition-all duration-200 ${
                                        pageNum === currentUserPage
                                          ? 'border-blue-600/50 bg-blue-600/20 text-blue-400'
                                          : 'border-neutral-600 bg-neutral-700 text-white hover:border-neutral-500 hover:bg-neutral-600'
                                      }`}
                                    >
                                      {pageNum + 1}
                                    </button>
                                  );
                                }
                              )}

                              <button
                                onClick={() => {
                                  const newPage = Math.min(
                                    totalUserPages - 1,
                                    currentUserPage + 1
                                  );
                                  setCurrentUserPage(newPage);
                                  fetchUsers(newPage, userSearchFilter);
                                }}
                                disabled={currentUserPage >= totalUserPages - 1}
                                className="flex items-center space-x-1 border border-neutral-600 bg-neutral-700 px-3 py-2 text-sm text-white transition-all duration-200 hover:border-neutral-500 hover:bg-neutral-600 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <span>Next</span>
                                <ChevronRightIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  const lastPage = totalUserPages - 1;
                                  setCurrentUserPage(lastPage);
                                  fetchUsers(lastPage, userSearchFilter);
                                }}
                                disabled={currentUserPage >= totalUserPages - 1}
                                className="border border-neutral-600 bg-neutral-700 px-3 py-2 text-sm text-white transition-all duration-200 hover:border-neutral-500 hover:bg-neutral-600 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                Last
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="border border-neutral-700/50 bg-neutral-800/30 p-8 text-center">
                      <UserGroupIcon className="mx-auto h-12 w-12 text-gray-500" />
                      <h3 className="mt-4 text-lg font-medium text-gray-400">
                        No users found
                      </h3>
                      <p className="mt-2 text-sm text-gray-500">
                        {userSearchFilter
                          ? 'Try adjusting your search criteria.'
                          : 'No users available to display.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'suspended' && (
              <div className="space-y-6">
                {/* Search and Controls */}
                <div className="border border-neutral-700 bg-neutral-800 p-6">
                  <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-xl font-semibold text-white">
                      Suspended Accounts
                    </h2>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-400">
                        Page {suspendedAccountsPage + 1} of{' '}
                        {suspendedAccountsPagination?.totalPages || 1} (
                        {totalSuspendedAccounts} suspended accounts)
                      </span>
                    </div>
                  </div>

                  {/* Search Bar */}
                  <div className="relative mb-4">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search suspended accounts by username, email, or reason..."
                      className="w-full border border-neutral-600 bg-neutral-700 py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={suspendedSearchFilter}
                      onChange={(e) => {
                        const value = e.target.value;
                        setSuspendedSearchFilter(value);
                        // Clear previous timeout
                        clearTimeout(window.suspendedSearchFilterTimeout);
                        // Debounce search
                        window.suspendedSearchFilterTimeout = setTimeout(() => {
                          fetchSuspendedAccounts(0, value);
                        }, 500);
                      }}
                    />
                  </div>

                  {/* Pagination Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          fetchSuspendedAccounts(
                            Math.max(0, suspendedAccountsPage - 1),
                            suspendedSearchFilter
                          )
                        }
                        disabled={suspendedAccountsPage === 0}
                        className="bg-neutral-700 p-2 text-white transition-colors duration-200 hover:bg-neutral-600 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <ChevronLeftIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() =>
                          fetchSuspendedAccounts(
                            suspendedAccountsPage + 1,
                            suspendedSearchFilter
                          )
                        }
                        disabled={
                          suspendedAccountsPage >=
                          (suspendedAccountsPagination?.totalPages || 1) - 1
                        }
                        className="bg-neutral-700 p-2 text-white transition-colors duration-200 hover:bg-neutral-600 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <ChevronRightIcon className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      onClick={() =>
                        fetchSuspendedAccounts(
                          suspendedAccountsPage,
                          suspendedSearchFilter
                        )
                      }
                      className="bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-500"
                    >
                      Refresh
                    </button>
                  </div>
                </div>

                {/* Suspended Accounts List */}
                <div className="border border-neutral-700 bg-neutral-800 p-6">
                  <div className="space-y-4">
                    {suspendedAccounts && suspendedAccounts.length > 0 ? (
                      suspendedAccounts.map((user) => (
                        <div
                          key={user.id}
                          className="border border-orange-600/30 bg-orange-900/10 p-6 transition-all duration-200 hover:border-orange-500/50"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-4">
                              <img
                                src={
                                  user.profilePicture
                                    ? user.profilePicture
                                    : `https://robohash.org/${user.username}.png?set=set1&size=150x150`
                                }
                                alt={`${user.username}'s profile`}
                                className="h-16 w-16 object-cover"
                                onError={(e) => {
                                  e.target.src = `https://robohash.org/${user.username}.png?set=set1&size=150x150`;
                                  e.target.onerror = null;
                                }}
                              />
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <h3 className="text-lg font-semibold text-white">
                                    {user.username}
                                  </h3>
                                  <span className="bg-orange-600/20 px-2 py-1 text-xs font-medium text-orange-400">
                                    SUSPENDED
                                  </span>
                                  <span className="bg-blue-600/20 px-2 py-1 text-xs font-medium text-blue-400">
                                    {user.accountType || 'USER'}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-400">
                                  {user.firstName && user.lastName
                                    ? `${user.firstName} ${user.lastName}`
                                    : user.firstName ||
                                      user.lastName ||
                                      'No name provided'}{' '}
                                  • {user.email}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Account created:{' '}
                                  {user.createdAt
                                    ? new Date(
                                        user.createdAt
                                      ).toLocaleDateString()
                                    : 'Unknown'}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Suspended:{' '}
                                  {user.suspensionInfo?.suspendedAt
                                    ? new Date(
                                        user.suspensionInfo.suspendedAt
                                      ).toLocaleDateString()
                                    : user.disableInfo?.disabledAt
                                    ? new Date(
                                        user.disableInfo.disabledAt
                                      ).toLocaleDateString()
                                    : user.updatedAt
                                    ? new Date(
                                        user.updatedAt
                                      ).toLocaleDateString()
                                    : 'Unknown'}
                                </p>
                                {user.suspensionInfo?.reason && (
                                  <p className="mt-1 text-xs text-orange-400">
                                    Reason: {user.suspensionInfo.reason}
                                  </p>
                                )}
                                {!user.suspensionInfo?.reason &&
                                  user.bio &&
                                  user.bio.includes('[DISABLED:') && (
                                    <p className="mt-1 text-xs text-orange-400">
                                      Reason:{' '}
                                      {user.bio.match(
                                        /\[DISABLED:([^\]]+)\]/
                                      )?.[1] || 'Not specified'}
                                    </p>
                                  )}
                                {!user.suspensionInfo?.reason &&
                                  (!user.bio ||
                                    !user.bio.includes('[DISABLED:')) && (
                                    <p className="mt-1 text-xs text-orange-400">
                                      Reason: No reason provided
                                    </p>
                                  )}
                              </div>
                            </div>
                            <div className="flex flex-col space-y-2">
                              <button
                                onClick={() =>
                                  window.open(
                                    `/users/${user.username}`,
                                    '_blank'
                                  )
                                }
                                className="border border-blue-600/30 bg-blue-600/10 px-3 py-2 text-sm font-medium text-blue-400 transition-colors hover:border-blue-500/50 hover:bg-blue-600/20"
                              >
                                View Profile
                              </button>
                              <button
                                onClick={async () => {
                                  const reason = prompt(
                                    'Enter reason for reactivation (optional):'
                                  );
                                  if (reason !== null) {
                                    const result = await reactivateAccount(
                                      user.id,
                                      reason
                                    );
                                    if (result.success) {
                                      showNotification(
                                        'Account reactivated successfully!',
                                        'success'
                                      );
                                      fetchSuspendedAccounts(
                                        suspendedAccountsPage,
                                        suspendedSearchFilter
                                      );
                                    } else {
                                      showNotification(
                                        `Failed to reactivate account: ${result.error}`,
                                        'error'
                                      );
                                    }
                                  }
                                }}
                                className="border border-green-600/30 bg-green-600/10 px-3 py-2 text-sm font-medium text-green-400 transition-colors hover:border-green-500/50 hover:bg-green-600/20"
                              >
                                Reactivate
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedUserForManagement(user);
                                  setShowUserManagementPopup(true);
                                }}
                                className="border border-neutral-600 bg-neutral-700 px-3 py-2 text-sm font-medium text-white transition-colors hover:border-neutral-500 hover:bg-neutral-600"
                              >
                                Edit
                              </button>
                            </div>
                          </div>

                          {user.disableInfo && (
                            <div className="mt-4 border border-neutral-600 bg-neutral-700/50 p-4">
                              <h4 className="mb-2 font-medium text-orange-400">
                                Disable Information:
                              </h4>
                              <div className="space-y-2 text-sm">
                                <p className="text-gray-300">
                                  <strong>Reason:</strong>{' '}
                                  {user.disableInfo.reason}
                                </p>
                                {user.disableInfo.disabledAt && (
                                  <p className="text-gray-300">
                                    <strong>Disabled At:</strong>{' '}
                                    {new Date(
                                      user.disableInfo.disabledAt
                                    ).toLocaleString()}
                                  </p>
                                )}
                                <p className="text-gray-300">
                                  <strong>Self-disabled:</strong>{' '}
                                  {user.disableInfo.disabled ? 'Yes' : 'No'}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="py-8 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-600/20">
                          <i className="fas fa-user-slash text-2xl text-orange-400"></i>
                        </div>
                        <h3 className="text-lg font-medium text-white">
                          {suspendedSearchFilter
                            ? 'No suspended accounts found'
                            : 'No suspended accounts'}
                        </h3>
                        <p className="mt-2 text-gray-400">
                          {suspendedSearchFilter
                            ? 'Try adjusting your search criteria.'
                            : 'All accounts are currently active.'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'challenges' && (
              <div className="border border-neutral-700 bg-neutral-800 p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">
                    Pending Challenges
                  </h2>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={fetchPendingChallenges}
                      className="flex items-center space-x-2 border border-blue-500/30 bg-blue-600/10 px-3 py-2 text-blue-400 transition-all duration-200 hover:border-blue-500/50 hover:bg-blue-600/20 sm:px-4"
                    >
                      <i className="fas fa-sync-alt text-sm"></i>
                      <span className="hidden sm:inline">Refresh</span>
                    </button>
                    {selectedChallenges.length > 0 && (
                      <button
                        className="bg-red-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-red-500"
                        onClick={deleteBulk}
                      >
                        <i className="fa fa-trash mr-2"></i>Delete Selected (
                        {selectedChallenges.length})
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {pendingChallenges && pendingChallenges.length > 0 ? (
                    pendingChallenges.map((challenge) => (
                      <div
                        key={challenge.id}
                        className="bg-neutral-700 p-4 transition-colors duration-200 hover:bg-neutral-600"
                      >
                        <div className="flex items-center space-x-3">
                          <input
                            onClick={(e) => e.stopPropagation()}
                            type="checkbox"
                            checked={selectedChallenges.includes(challenge.id)}
                            onChange={() => handleSelectChallenge(challenge.id)}
                            className="h-4 w-4 border-neutral-500 bg-neutral-600 text-blue-600 focus:ring-blue-500"
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
                          <div className="flex items-center space-x-3">
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
                            <button
                              onClick={() => {
                                setSelectedId(challenge.id);
                                setChallengeIsOpen(true);
                              }}
                              className="border border-blue-600/30 bg-blue-600/10 px-3 py-2 text-sm font-medium text-blue-400 transition-colors hover:border-blue-500/50 hover:bg-blue-600/20"
                            >
                              Edit
                            </button>
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
              <div className="space-y-6">
                {/* Report Statistics */}
                {reportStats && (
                  <div className="border border-neutral-700 bg-neutral-800 p-6">
                    <h2 className="mb-4 text-xl font-semibold text-white">
                      Report Statistics
                    </h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                      <div className="bg-neutral-700 p-4 text-center">
                        <p className="text-2xl font-bold text-white">
                          {reportStats.totalReports || 0}
                        </p>
                        <p className="text-gray-400">Total Reports</p>
                      </div>
                      <div className="bg-neutral-700 p-4 text-center">
                        <p className="text-2xl font-bold text-yellow-400">
                          {reportStats.statusStats?.pending || 0}
                        </p>
                        <p className="text-gray-400">Pending</p>
                      </div>
                      <div className="bg-neutral-700 p-4 text-center">
                        <p className="text-2xl font-bold text-blue-400">
                          {reportStats.statusStats?.in_review || 0}
                        </p>
                        <p className="text-gray-400">In Review</p>
                      </div>
                      <div className="bg-neutral-700 p-4 text-center">
                        <p className="text-2xl font-bold text-green-400">
                          {reportStats.statusStats?.resolved || 0}
                        </p>
                        <p className="text-gray-400">Resolved</p>
                      </div>
                      <div className="bg-neutral-700 p-4 text-center">
                        <p className="text-2xl font-bold text-white">
                          {reportStats.recentCount || 0}
                        </p>
                        <p className="text-gray-400">This Week</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Report Filters */}
                <div className="border border-neutral-700 bg-neutral-800 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-white">
                    Filter Reports
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <select
                      value={reportFilters.type}
                      onChange={(e) => {
                        const newFilters = {
                          ...reportFilters,
                          type: e.target.value,
                          page: 0,
                        };
                        setReportFilters(newFilters);
                        fetchReports(newFilters);
                      }}
                      className="border border-neutral-600 bg-neutral-700 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">All Types</option>
                      <option value="USER">User Reports</option>
                      <option value="CHALLENGE">Challenge Issues</option>
                      <option value="COMMENT">Comment Reports</option>
                      <option value="BUG">Bug Reports</option>
                      <option value="FEATURE">Feature Requests</option>
                    </select>

                    <select
                      value={reportFilters.status}
                      onChange={(e) => {
                        const newFilters = {
                          ...reportFilters,
                          status: e.target.value,
                          page: 0,
                        };
                        setReportFilters(newFilters);
                        fetchReports(newFilters);
                      }}
                      className="border border-neutral-600 bg-neutral-700 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value="">All Statuses</option>
                      <option value="PENDING">Pending</option>
                      <option value="IN_REVIEW">In Review</option>
                      <option value="RESOLVED">Resolved</option>
                      <option value="REJECTED">Rejected</option>
                    </select>

                    <button
                      onClick={() => fetchReports(reportFilters)}
                      className="bg-blue-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-500"
                    >
                      <i className="fas fa-search mr-2"></i>
                      Search
                    </button>
                  </div>
                </div>

                {/* All Reports */}
                <div className="border border-neutral-700 bg-neutral-800 p-6">
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white">
                      All Reports
                    </h2>
                    <button
                      onClick={() => {
                        if (activeHistoryTab === 'suspended') {
                          fetchGroupedSuspensions(groupedSuspensionsPage, true); // forceRefresh = true
                        } else if (activeHistoryTab === 'warnings') {
                          fetchGroupedWarnings(groupedWarningsPage, true); // forceRefresh = true
                        }
                      }}
                      disabled={groupedWarningsLoading || groupedSuspensionsLoading}
                      className="flex items-center gap-2 bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                    >
                      <ArrowPathIcon className="h-4 w-4" />
                      <span className="hidden sm:inline">Refresh</span>
                    </button>
                  </div>

                  {reports.length > 0 ? (
                    <div className="space-y-4">
                      {reports.map((report) => {
                        const getStatusColor = (status) => {
                          switch (status) {
                            case 'PENDING':
                              return 'bg-yellow-900/20 text-yellow-400 border-yellow-600/20';
                            case 'IN_REVIEW':
                              return 'bg-blue-900/20 text-blue-400 border-blue-600/20';
                            case 'RESOLVED':
                              return 'bg-green-900/20 text-green-400 border-green-600/20';
                            case 'REJECTED':
                              return 'bg-red-900/20 text-red-400 border-red-600/20';
                            default:
                              return 'bg-gray-900/20 text-gray-400 border-gray-600/20';
                          }
                        };

                        return (
                          <div
                            key={report.id}
                            className="border border-neutral-600 bg-neutral-700/50 p-6"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3">
                                  <span
                                    className={`inline-flex border px-3 py-1 text-sm font-medium ${getStatusColor(
                                      report.status
                                    )}`}
                                  >
                                    {report.status}
                                  </span>
                                  <span className="text-sm text-gray-400">
                                    {report.type} Report by{' '}
                                    {report.user?.username || 'Unknown'}
                                  </span>
                                </div>

                                <p className="mt-2 text-white">{report.desc}</p>

                                {report.metadata &&
                                  Object.keys(report.metadata).length > 0 && (
                                    <div className="mt-3 text-sm text-gray-400">
                                      {report.metadata.challengeId && (
                                        <p>
                                          Challenge ID:{' '}
                                          {report.metadata.challengeId}
                                        </p>
                                      )}
                                      {report.metadata.commentId && (
                                        <p>
                                          Comment ID:{' '}
                                          {report.metadata.commentId}
                                        </p>
                                      )}
                                      {report.metadata.reportedUserId && (
                                        <p>
                                          Reported User:{' '}
                                          {report.metadata.reportedUserId}
                                        </p>
                                      )}
                                    </div>
                                  )}

                                {report.resolution && (
                                  <div className="mt-3 bg-neutral-600/30 p-3">
                                    <p className="text-sm text-gray-300">
                                      <strong>Resolution:</strong>{' '}
                                      {report.resolution}
                                    </p>
                                  </div>
                                )}
                              </div>

                              <div className="ml-4 flex flex-col space-y-2">
                                {report.status === 'PENDING' && (
                                  <>
                                    <button
                                      onClick={() =>
                                        handleUpdateReportStatus(
                                          report.id,
                                          'IN_REVIEW'
                                        )
                                      }
                                      className="bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-500"
                                    >
                                      Start Review
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleUpdateReportStatus(
                                          report.id,
                                          'RESOLVED',
                                          'Resolved by moderator'
                                        )
                                      }
                                      className="bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-green-500"
                                    >
                                      Mark Resolved
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleUpdateReportStatus(
                                          report.id,
                                          'REJECTED',
                                          'Invalid report'
                                        )
                                      }
                                      className="bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-red-500"
                                    >
                                      Reject
                                    </button>
                                  </>
                                )}
                                {report.status === 'IN_REVIEW' && (
                                  <>
                                    <button
                                      onClick={() =>
                                        handleUpdateReportStatus(
                                          report.id,
                                          'RESOLVED',
                                          'Resolved after review'
                                        )
                                      }
                                      className="bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-green-500"
                                    >
                                      Mark Resolved
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleUpdateReportStatus(
                                          report.id,
                                          'REJECTED',
                                          'Rejected after review'
                                        )
                                      }
                                      className="bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-red-500"
                                    >
                                      Reject
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>

                            <div className="mt-4 flex justify-between text-sm text-gray-400">
                              <span>
                                Submitted:{' '}
                                {new Date(
                                  report.createdAt
                                ).toLocaleDateString()}
                              </span>
                              {report.resolvedAt && (
                                <span>
                                  Resolved:{' '}
                                  {new Date(
                                    report.resolvedAt
                                  ).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-700">
                        <i className="fas fa-inbox text-2xl text-gray-400"></i>
                      </div>
                      <h3 className="text-lg font-medium text-white">
                        No reports found
                      </h3>
                      <p className="mt-2 text-gray-400">
                        No reports match your current filters.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'deletions' && (
              <div className="space-y-6">
                {/* Deletion Statistics */}
                {deletionStats && (
                  <div className="border border-neutral-700 bg-neutral-800 p-6">
                    <h2 className="mb-4 text-xl font-semibold text-white">
                      Account Deletion Statistics
                    </h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="bg-neutral-700 p-4 text-center">
                        <p className="text-2xl font-bold text-white">
                          {deletionStats.stats?.pending || 0}
                        </p>
                        <p className="text-gray-400">Pending</p>
                      </div>
                      <div className="bg-neutral-700 p-4 text-center">
                        <p className="text-2xl font-bold text-white">
                          {deletionStats.stats?.processing || 0}
                        </p>
                        <p className="text-gray-400">Processing</p>
                      </div>
                      <div className="bg-neutral-700 p-4 text-center">
                        <p className="text-2xl font-bold text-white">
                          {deletionStats.stats?.completed || 0}
                        </p>
                        <p className="text-gray-400">Completed</p>
                      </div>
                      <div className="bg-neutral-700 p-4 text-center">
                        <p className="text-2xl font-bold text-white">
                          {deletionStats.stats?.cancelled || 0}
                        </p>
                        <p className="text-gray-400">Cancelled</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Search and Controls */}
                <div className="border border-neutral-700 bg-neutral-800 p-6">
                  <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-xl font-semibold text-white">
                      Account Deletions
                    </h2>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-400">
                        {pendingDeletions.length} deletion requests
                      </span>
                    </div>
                  </div>

                  {/* Search Bar */}
                  <div className="relative mb-4">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search deletion requests by username, email, or reason..."
                      className="w-full border border-neutral-600 bg-neutral-700 py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={deletionsSearchFilter}
                      onChange={(e) => {
                        const value = e.target.value;
                        setDeletionsSearchFilter(value);
                        // Clear previous timeout
                        clearTimeout(window.deletionsSearchFilterTimeout);
                        // Debounce search
                        window.deletionsSearchFilterTimeout = setTimeout(() => {
                          fetchPendingDeletions(value);
                        }, 500);
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() =>
                        fetchPendingDeletions(deletionsSearchFilter)
                      }
                      className="bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-500"
                    >
                      Refresh
                    </button>
                  </div>
                </div>

                {/* Pending Deletions */}
                <div className="border border-neutral-700 bg-neutral-800 p-6">
                  <h2 className="mb-6 text-xl font-semibold text-white">
                    Deletion Requests
                  </h2>

                  {pendingDeletions.length > 0 ? (
                    <div className="space-y-4">
                      {pendingDeletions.map((deletion) => (
                        <div
                          key={deletion.id}
                          className="border border-neutral-600 bg-neutral-700/50 p-6"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <div className="flex h-12 w-12 items-center justify-center bg-red-600/20">
                                  <i className="fas fa-user-times text-xl text-red-400"></i>
                                </div>
                                <div>
                                  <h3 className="font-semibold text-white">
                                    {deletion.user?.username || 'Unknown User'}
                                  </h3>
                                  <p className="text-sm text-gray-400">
                                    Account created:{' '}
                                    {new Date(
                                      deletion.user?.createdAt
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>

                              <div className="mt-4">
                                <h4 className="text-sm font-medium text-gray-300">
                                  Reason for leaving:
                                </h4>
                                <p className="mt-1 text-white">
                                  {deletion.reason}
                                </p>
                              </div>

                              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-400">
                                    Requested:
                                  </span>
                                  <span className="ml-2 text-white">
                                    {new Date(
                                      deletion.createdAt
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-400">
                                    Scheduled for:
                                  </span>
                                  <span className="ml-2 text-white">
                                    {deletion.scheduledFor
                                      ? new Date(
                                          deletion.scheduledFor
                                        ).toLocaleDateString()
                                      : 'Date unavailable'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="ml-4 flex flex-col space-y-2">
                              <button
                                onClick={() =>
                                  handleProcessDeletion(deletion.id)
                                }
                                className="border border-red-600/30 bg-red-600/10 px-4 py-2 text-sm font-medium text-red-400 transition-colors duration-200 hover:border-red-500/50 hover:bg-red-600/20"
                              >
                                <i className="fas fa-trash mr-1"></i>
                                Auto-Process Deletion
                              </button>
                              <button
                                onClick={() =>
                                  window.open(
                                    `/users/${deletion.user?.username}`,
                                    '_blank'
                                  )
                                }
                                className="border border-neutral-600 bg-neutral-700 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:border-neutral-500 hover:bg-neutral-600"
                              >
                                <i className="fas fa-user mr-1"></i>
                                View Profile
                              </button>
                              <button
                                onClick={() =>
                                  handleViewDeletionDetails(deletion)
                                }
                                className="border border-blue-600/30 bg-blue-600/10 px-4 py-2 text-sm font-medium text-blue-400 transition-colors duration-200 hover:border-blue-500/50 hover:bg-blue-600/20"
                              >
                                <i className="fas fa-info-circle mr-1"></i>
                                View Details
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center bg-neutral-700">
                        <i className="fas fa-check-circle text-2xl text-green-400"></i>
                      </div>
                      <h3 className="text-lg font-medium text-white">
                        No pending deletions
                      </h3>
                      <p className="mt-2 text-gray-400">
                        All account deletion requests have been processed.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'accounts' && (
              <div className="space-y-6">
                {/* Accounts Tab Navigation */}
                <div className="border-b border-neutral-700">
                  <nav className="flex flex-wrap space-x-2 sm:space-x-8">
                    <button
                      onClick={() => {
                        setActiveAccountsTab('suspended');
                        fetchSuspendedAccounts(
                          suspendedAccountsPage,
                          suspendedSearchFilter
                        );
                      }}
                      className={`border-b-2 px-1 py-2 text-xs font-medium transition-colors duration-200 sm:py-4 sm:text-sm ${
                        activeAccountsTab === 'suspended'
                          ? 'border-blue-500 text-blue-400'
                          : 'border-transparent text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      Suspended
                      <span
                        className={`ml-1 px-1 py-0.5 text-xs font-medium sm:ml-2 sm:px-2 sm:py-1 ${
                          totalSuspendedAccounts > 0
                            ? 'bg-red-600/20 text-red-400'
                            : 'bg-gray-600/20 text-gray-400'
                        }`}
                      >
                        {totalSuspendedAccounts || 0}
                      </span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveAccountsTab('disabled');
                        // No data to refresh for disabled tab currently
                      }}
                      className={`border-b-2 px-1 py-2 text-xs font-medium transition-colors duration-200 sm:py-4 sm:text-sm ${
                        activeAccountsTab === 'disabled'
                          ? 'border-blue-500 text-blue-400'
                          : 'border-transparent text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      Disabled
                      <span className="ml-1 bg-gray-600/20 px-1 py-0.5 text-xs font-medium text-gray-400 sm:ml-2 sm:px-2 sm:py-1">
                        0
                      </span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveAccountsTab('deleted');
                        fetchPendingDeletions(deletionsSearchFilter);
                      }}
                      className={`border-b-2 px-1 py-2 text-xs font-medium transition-colors duration-200 sm:py-4 sm:text-sm ${
                        activeAccountsTab === 'deleted'
                          ? 'border-blue-500 text-blue-400'
                          : 'border-transparent text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      Deletion Requests
                      <span
                        className={`ml-1 px-1 py-0.5 text-xs font-medium sm:ml-2 sm:px-2 sm:py-1 ${
                          pendingDeletions.length > 0
                            ? 'bg-orange-600/20 text-orange-400'
                            : 'bg-gray-600/20 text-gray-400'
                        }`}
                      >
                        {pendingDeletions.length || 0}
                      </span>
                    </button>
                  </nav>
                </div>

                {/* Suspended Accounts Content */}
                {activeAccountsTab === 'suspended' && (
                  <div className="space-y-6">
                    {/* Search and Controls */}
                    <div className="border border-neutral-700 bg-neutral-800 p-6">
                      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-xl font-semibold text-white">
                          Suspended Accounts
                        </h2>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-400">
                            Page {suspendedAccountsPage + 1} of{' '}
                            {suspendedAccountsPagination?.totalPages || 1} (
                            {totalSuspendedAccounts} suspended accounts)
                          </span>
                        </div>
                      </div>

                      {/* Search Bar */}
                      <div className="relative mb-4">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          placeholder="Search suspended accounts by username, email, or reason..."
                          className="w-full border border-neutral-600 bg-neutral-700 py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={suspendedSearchFilter}
                          onChange={(e) => {
                            const value = e.target.value;
                            setSuspendedSearchFilter(value);
                            // Clear previous timeout
                            clearTimeout(window.suspendedSearchFilterTimeout);
                            // Debounce search
                            window.suspendedSearchFilterTimeout = setTimeout(
                              () => {
                                fetchSuspendedAccounts(0, value);
                              },
                              500
                            );
                          }}
                        />
                      </div>

                      {/* Pagination */}
                      {suspendedAccountsPagination &&
                        suspendedAccountsPagination.totalPages > 1 && (
                          <div className="flex items-center justify-between">
                            <button
                              onClick={() =>
                                fetchSuspendedAccounts(
                                  Math.max(0, suspendedAccountsPage - 1),
                                  suspendedSearchFilter
                                )
                              }
                              disabled={suspendedAccountsPage === 0}
                              className="bg-neutral-700 px-4 py-2 text-sm text-white transition-colors duration-200 hover:bg-neutral-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Previous
                            </button>
                            <span className="text-sm text-gray-400">
                              Page {suspendedAccountsPage + 1} of{' '}
                              {suspendedAccountsPagination.totalPages}
                            </span>
                            <button
                              onClick={() =>
                                fetchSuspendedAccounts(
                                  Math.min(
                                    suspendedAccountsPagination.totalPages - 1,
                                    suspendedAccountsPage + 1
                                  ),
                                  suspendedSearchFilter
                                )
                              }
                              disabled={
                                suspendedAccountsPage >=
                                suspendedAccountsPagination.totalPages - 1
                              }
                              className="bg-neutral-700 px-4 py-2 text-sm text-white transition-colors duration-200 hover:bg-neutral-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Next
                            </button>
                          </div>
                        )}
                    </div>

                    {/* Suspended Accounts List */}
                    <div className="border border-neutral-700 bg-neutral-800 p-6">
                      <h2 className="mb-6 text-xl font-semibold text-white">
                        Suspended Users ({totalSuspendedAccounts})
                      </h2>

                      {suspendedAccounts.length > 0 ? (
                        <div className="space-y-4">
                          {suspendedAccounts.map((user) => (
                            <div
                              key={user.id}
                              className="border border-orange-600/30 bg-orange-900/10 p-6 transition-all duration-200 hover:border-orange-500/50"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="h-16 w-16 overflow-hidden">
                                    {user.profileImage &&
                                    user.profileImage.trim() !== '' ? (
                                      <img
                                        src={user.profileImage}
                                        alt={`${user.username}'s profile`}
                                        className="h-full w-full object-cover"
                                        onError={(e) => {
                                          e.target.style.display = 'none';
                                          e.target.nextSibling.style.display =
                                            'flex';
                                        }}
                                      />
                                    ) : null}
                                    <div
                                      className={`flex h-full w-full items-center justify-center text-lg font-bold text-white ${
                                        user.profileImage &&
                                        user.profileImage.trim() !== ''
                                          ? 'hidden'
                                          : 'flex'
                                      }`}
                                      style={{
                                        backgroundColor: '#ff6b35',
                                        backgroundImage: `url(https://robohash.org/${user.username}.png?set=set1&size=150x150)`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                      }}
                                    >
                                      {user.username
                                        .substring(0, 2)
                                        .toUpperCase()}
                                    </div>
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                      <h3 className="text-lg font-semibold text-white">
                                        {user.username}
                                      </h3>
                                      <span className="bg-orange-600/20 px-2 py-1 text-xs font-medium text-orange-400">
                                        SUSPENDED
                                      </span>
                                      <span className="bg-blue-600/20 px-2 py-1 text-xs font-medium text-blue-400">
                                        {user.accountType || 'USER'}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-400">
                                      {user.firstName && user.lastName
                                        ? `${user.firstName} ${user.lastName}`
                                        : user.firstName ||
                                          user.lastName ||
                                          'No name provided'}{' '}
                                      • {user.email}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      Account created:{' '}
                                      {user.createdAt
                                        ? new Date(
                                            user.createdAt
                                          ).toLocaleDateString()
                                        : 'Unknown'}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      Suspended:{' '}
                                      {user.suspensionInfo?.suspendedAt
                                        ? new Date(
                                            user.suspensionInfo.suspendedAt
                                          ).toLocaleDateString()
                                        : user.disableInfo?.disabledAt
                                        ? new Date(
                                            user.disableInfo.disabledAt
                                          ).toLocaleDateString()
                                        : user.updatedAt
                                        ? new Date(
                                            user.updatedAt
                                          ).toLocaleDateString()
                                        : 'Unknown'}
                                    </p>
                                    {user.suspensionInfo?.reason && (
                                      <p className="mt-1 text-xs text-orange-400">
                                        Reason: {user.suspensionInfo.reason}
                                      </p>
                                    )}
                                    {!user.suspensionInfo?.reason &&
                                      user.bio &&
                                      user.bio.includes('[DISABLED:') && (
                                        <p className="mt-1 text-xs text-orange-400">
                                          Reason:{' '}
                                          {user.bio.match(
                                            /\[DISABLED:([^\]]+)\]/
                                          )?.[1] || 'Not specified'}
                                        </p>
                                      )}
                                    {!user.suspensionInfo?.reason &&
                                      (!user.bio ||
                                        !user.bio.includes('[DISABLED:')) && (
                                        <p className="mt-1 text-xs text-orange-400">
                                          Reason: No reason provided
                                        </p>
                                      )}
                                  </div>
                                </div>
                                <div className="flex flex-col space-y-2">
                                  <button
                                    onClick={() =>
                                      window.open(
                                        `/users/${user.username}`,
                                        '_blank'
                                      )
                                    }
                                    className="border border-blue-600/30 bg-blue-600/10 px-3 py-2 text-sm font-medium text-blue-400 transition-colors hover:border-blue-500/50 hover:bg-blue-600/20"
                                  >
                                    View Profile
                                  </button>
                                  <button
                                    onClick={() => handleReactivateClick(user)}
                                    className="border border-green-600/30 bg-green-600/10 px-3 py-2 text-sm font-medium text-green-400 transition-colors hover:border-green-500/50 hover:bg-green-600/20"
                                  >
                                    Reactivate
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedUserForManagement(user);
                                      setShowUserManagementPopup(true);
                                    }}
                                    className="border border-neutral-600 bg-neutral-700 px-3 py-2 text-sm font-medium text-white transition-colors hover:border-neutral-500 hover:bg-neutral-600"
                                  >
                                    Edit
                                  </button>
                                </div>
                              </div>

                              {user.disableInfo && (
                                <div className="mt-4 border border-neutral-600 bg-neutral-700/50 p-4">
                                  <h4 className="mb-2 font-medium text-orange-400">
                                    Disable Information:
                                  </h4>
                                  <div className="space-y-2 text-sm">
                                    <p className="text-gray-300">
                                      <strong>Reason:</strong>{' '}
                                      {user.disableInfo.reason}
                                    </p>
                                    {user.disableInfo.disabledAt && (
                                      <p className="text-gray-300">
                                        <strong>Disabled At:</strong>{' '}
                                        {new Date(
                                          user.disableInfo.disabledAt
                                        ).toLocaleString()}
                                      </p>
                                    )}
                                    <p className="text-gray-300">
                                      <strong>Self-disabled:</strong>{' '}
                                      {user.disableInfo.disabled ? 'Yes' : 'No'}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-8 text-center">
                          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center bg-neutral-700">
                            <i className="fas fa-user-check text-2xl text-green-400"></i>
                          </div>
                          <h3 className="text-lg font-medium text-white">
                            No suspended accounts
                          </h3>
                          <p className="mt-2 text-gray-400">
                            All user accounts are in good standing.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Disabled Accounts Content */}
                {activeAccountsTab === 'disabled' && (
                  <div className="space-y-6">
                    <div className="border border-neutral-700 bg-neutral-800 p-6">
                      <h2 className="mb-6 text-xl font-semibold text-white">
                        Disabled Accounts
                      </h2>
                      <div className="py-8 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center bg-neutral-700">
                          <i className="fas fa-user-slash text-2xl text-gray-400"></i>
                        </div>
                        <h3 className="text-lg font-medium text-white">
                          No disabled accounts
                        </h3>
                        <p className="mt-2 text-gray-400">
                          This feature is not yet implemented.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Deletion Requests Content */}
                {activeAccountsTab === 'deleted' && (
                  <div className="space-y-6">
                    {/* Deletion Statistics */}
                    {deletionStats && (
                      <div className="border border-neutral-700 bg-neutral-800 p-6">
                        <h2 className="mb-4 text-xl font-semibold text-white">
                          Account Deletion Statistics
                        </h2>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                          <div className="bg-neutral-700 p-4 text-center">
                            <p className="text-2xl font-bold text-white">
                              {deletionStats.stats?.pending || 0}
                            </p>
                            <p className="text-gray-400">Pending</p>
                          </div>
                          <div className="bg-neutral-700 p-4 text-center">
                            <p className="text-2xl font-bold text-white">
                              {deletionStats.stats?.processing || 0}
                            </p>
                            <p className="text-gray-400">Processing</p>
                          </div>
                          <div className="bg-neutral-700 p-4 text-center">
                            <p className="text-2xl font-bold text-white">
                              {deletionStats.stats?.completed || 0}
                            </p>
                            <p className="text-gray-400">Completed</p>
                          </div>
                          <div className="bg-neutral-700 p-4 text-center">
                            <p className="text-2xl font-bold text-white">
                              {deletionStats.stats?.cancelled || 0}
                            </p>
                            <p className="text-gray-400">Cancelled</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Search and Controls */}
                    <div className="border border-neutral-700 bg-neutral-800 p-6">
                      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-xl font-semibold text-white">
                          Account Deletions
                        </h2>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-400">
                            {pendingDeletions.length} deletion requests
                          </span>
                        </div>
                      </div>

                      {/* Search Bar */}
                      <div className="relative mb-4">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          placeholder="Search deletion requests by username, email, or reason..."
                          className="w-full border border-neutral-600 bg-neutral-700 py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={deletionsSearchFilter}
                          onChange={(e) => {
                            const value = e.target.value;
                            setDeletionsSearchFilter(value);
                            // Clear previous timeout
                            clearTimeout(window.deletionsSearchFilterTimeout);
                            // Debounce search
                            window.deletionsSearchFilterTimeout = setTimeout(
                              () => {
                                fetchPendingDeletions(value);
                              },
                              500
                            );
                          }}
                        />
                      </div>

                      <button
                        onClick={() =>
                          fetchPendingDeletions(deletionsSearchFilter)
                        }
                        className="bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-blue-500"
                      >
                        Refresh
                      </button>
                    </div>

                    {/* Pending Deletions */}
                    <div className="border border-neutral-700 bg-neutral-800 p-6">
                      <h2 className="mb-6 text-xl font-semibold text-white">
                        Deletion Requests
                      </h2>

                      {pendingDeletions.length > 0 ? (
                        <div className="space-y-4">
                          {pendingDeletions.map((deletion) => (
                            <div
                              key={deletion.id}
                              className="border border-neutral-600 bg-neutral-700/50 p-6"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-3">
                                    <div className="flex h-12 w-12 items-center justify-center bg-red-600/20">
                                      <i className="fas fa-user-times text-xl text-red-400"></i>
                                    </div>
                                    <div>
                                      <h3 className="font-semibold text-white">
                                        {deletion.user?.username ||
                                          'Unknown User'}
                                      </h3>
                                      <p className="text-sm text-gray-400">
                                        Account created:{' '}
                                        {new Date(
                                          deletion.user?.createdAt
                                        ).toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="mt-4">
                                    <h4 className="text-sm font-medium text-gray-300">
                                      Reason for leaving:
                                    </h4>
                                    <p className="mt-1 text-white">
                                      {deletion.reason}
                                    </p>
                                  </div>

                                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="text-gray-400">
                                        Requested:
                                      </span>
                                      <span className="ml-2 text-white">
                                        {new Date(
                                          deletion.createdAt
                                        ).toLocaleDateString()}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-gray-400">
                                        Status:
                                      </span>
                                      <span className="ml-2 bg-yellow-600/20 px-2 py-1 text-xs text-yellow-400">
                                        {deletion.status}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="ml-4 flex flex-col space-y-2">
                                  <button
                                    onClick={() =>
                                      handleProcessDeletion(deletion.id)
                                    }
                                    className="border border-red-600/30 bg-red-600/10 px-4 py-2 text-sm font-medium text-red-400 transition-colors duration-200 hover:border-red-500/50 hover:bg-red-600/20"
                                  >
                                    <i className="fas fa-trash mr-1"></i>
                                    Auto-Process Deletion
                                  </button>
                                  <button
                                    onClick={() =>
                                      window.open(
                                        `/users/${deletion.user?.username}`,
                                        '_blank'
                                      )
                                    }
                                    className="border border-neutral-600 bg-neutral-700 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:border-neutral-500 hover:bg-neutral-600"
                                  >
                                    <i className="fas fa-user mr-1"></i>
                                    View Profile
                                  </button>
                                  <button
                                    onClick={() => {
                                      alert(
                                        `Deletion requested by: ${
                                          deletion.user?.username
                                        }\nReason: ${
                                          deletion.reason
                                        }\nRequested: ${new Date(
                                          deletion.createdAt
                                        ).toLocaleString()}\nStatus: ${
                                          deletion.status
                                        }`
                                      );
                                    }}
                                    className="border border-blue-600/30 bg-blue-600/10 px-4 py-2 text-sm font-medium text-blue-400 transition-colors duration-200 hover:border-blue-500/50 hover:bg-blue-600/20"
                                  >
                                    <i className="fas fa-info-circle mr-1"></i>
                                    View Details
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-8 text-center">
                          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center bg-neutral-700">
                            <i className="fas fa-check-circle text-2xl text-green-400"></i>
                          </div>
                          <h3 className="text-lg font-medium text-white">
                            No pending deletions
                          </h3>
                          <p className="mt-2 text-gray-400">
                            All account deletion requests have been processed.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Suspension History Content */}
                {activeAccountsTab === 'history' && (
                  <div className="space-y-6">
                    {/* Search and Filters */}
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-1 items-center space-x-4">
                        <div className="relative max-w-md flex-1">
                          <input
                            type="text"
                            placeholder="Search suspension history by username, email, or reason..."
                            value={suspensionHistorySearchFilter}
                            onChange={(e) =>
                              setSuspensionHistorySearchFilter(e.target.value)
                            }
                            className="w-full border border-neutral-600 bg-neutral-700 px-4 py-2 pl-10 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                          />
                          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        </div>
                        <select
                          value={suspensionHistoryStatusFilter}
                          onChange={(e) =>
                            setSuspensionHistoryStatusFilter(e.target.value)
                          }
                          className="border border-neutral-600 bg-neutral-700 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                        >
                          <option value="all">All Statuses</option>
                          <option value="active">Active Suspensions</option>
                          <option value="reactivated">Reactivated</option>
                        </select>
                      </div>
                      {suspensionHistoryPagination && (
                        <div className="text-sm text-gray-400">
                          Page {suspensionHistoryPage + 1} of{' '}
                          {suspensionHistoryPagination.totalPages} (
                          {suspensionHistoryPagination.totalCount} total
                          entries)
                        </div>
                      )}
                    </div>

                    {/* Suspension History Content */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-white">
                        Suspension History (
                        {suspensionHistoryPagination?.totalCount || 0})
                      </h3>

                      {suspensionHistoryLoading ? (
                        <div className="p-8 text-center">
                          <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                          <p className="mt-2 text-gray-400">
                            Loading suspension history...
                          </p>
                        </div>
                      ) : suspensionHistory.length === 0 ? (
                        <div className="p-8 text-center">
                          <div className="text-lg text-gray-400">
                            No suspension history found
                          </div>
                          <p className="mt-2 text-gray-400">
                            {suspensionHistorySearchFilter ||
                            suspensionHistoryStatusFilter !== 'all'
                              ? 'Try adjusting your search criteria.'
                              : 'No suspension history available.'}
                          </p>
                        </div>
                      ) : (
                        <>
                          {/* Desktop Table View */}
                          <div className="hidden md:block">
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead>
                                  <tr className="border-b border-gray-700">
                                    <th className="p-4 text-left font-medium text-gray-300">
                                      USER
                                    </th>
                                    <th className="p-4 text-left font-medium text-gray-300">
                                      STATUS
                                    </th>
                                    <th className="p-4 text-left font-medium text-gray-300">
                                      ACCOUNT TYPE
                                    </th>
                                    <th className="p-4 text-left font-medium text-gray-300">
                                      EMAIL
                                    </th>
                                    <th className="p-4 text-left font-medium text-gray-300">
                                      DATES
                                    </th>
                                    <th className="p-4 text-left font-medium text-gray-300">
                                      REASON
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {suspensionHistory.map((entry) => (
                                    <tr
                                      key={entry.id}
                                      className="border-b border-gray-800 transition-colors hover:bg-gray-800/50"
                                    >
                                      <td className="p-4">
                                        <div className="flex items-center space-x-3">
                                          <div className="flex h-10 w-10 items-center justify-center">
                                            <img
                                              src={
                                                entry.user?.profilePicture
                                                  ? entry.user.profilePicture
                                                  : `https://robohash.org/${
                                                      entry.user?.username ||
                                                      'user'
                                                    }.png?set=set1&size=150x150`
                                              }
                                              alt={entry.user?.username || 'U'}
                                              className="h-10 w-10 rounded object-cover"
                                              onError={(e) => {
                                                e.target.src = `https://robohash.org/${
                                                  entry.user?.username || 'user'
                                                }.png?set=set1&size=150x150`;
                                                e.target.onerror = null;
                                              }}
                                            />
                                          </div>
                                          <div>
                                            <div className="font-medium text-white">
                                              {entry.user?.username ||
                                                'Unknown'}
                                            </div>
                                            <div className="text-sm text-gray-400">
                                              {entry.user?.firstName &&
                                              entry.user?.lastName
                                                ? `${entry.user.firstName} ${entry.user.lastName}`
                                                : entry.user?.firstName ||
                                                  entry.user?.lastName ||
                                                  'No name provided'}
                                            </div>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="p-4">
                                        <span
                                          className={`px-2 py-1 text-xs font-medium ${
                                            entry.user?.status === 'ACTIVE'
                                              ? 'bg-green-600/20 text-green-400'
                                              : 'bg-orange-600/20 text-orange-400'
                                          }`}
                                        >
                                          {entry.user?.status === 'ACTIVE'
                                            ? 'ACTIVE'
                                            : 'SUSPENDED'}
                                        </span>
                                      </td>
                                      <td className="p-4">
                                        <span className="bg-blue-600/20 px-2 py-1 text-xs font-medium text-blue-400">
                                          {entry.user?.accountType || 'USER'}
                                        </span>
                                      </td>
                                      <td className="p-4 text-white">
                                        {entry.user?.email || 'No email'}
                                      </td>
                                      <td className="p-4 text-gray-300">
                                        <div>
                                          Created:{' '}
                                          {entry.user?.createdAt
                                            ? new Date(
                                                entry.user.createdAt
                                              ).toLocaleDateString()
                                            : 'Unknown'}
                                        </div>
                                        <div>
                                          Suspended:{' '}
                                          {entry.suspendedAt
                                            ? new Date(
                                                entry.suspendedAt
                                              ).toLocaleDateString()
                                            : 'Unknown'}
                                        </div>
                                        {entry.reactivatedAt && (
                                          <div className="text-green-400">
                                            Reactivated:{' '}
                                            {new Date(
                                              entry.reactivatedAt
                                            ).toLocaleDateString()}
                                          </div>
                                        )}
                                      </td>
                                      <td className="p-4">
                                        {entry.reason && (
                                          <p className="whitespace-pre-wrap break-words text-white">
                                            {entry.reason}
                                          </p>
                                        )}
                                        {entry.reactivationReason && (
                                          <p className="mt-1 text-sm text-green-400">
                                            <span className="font-medium">
                                              Reactivation reason:
                                            </span>{' '}
                                            {entry.reactivationReason}
                                          </p>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          {/* Mobile Card View */}
                          <div className="md:hidden">
                            <div className="space-y-4 p-4">
                              {suspensionHistory.map((entry) => (
                                <div
                                  key={entry.id}
                                  className="rounded border border-gray-700 bg-gray-800 p-4"
                                >
                                  <div className="flex items-start space-x-3">
                                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center">
                                      <img
                                        src={
                                          entry.user?.profilePicture
                                            ? entry.user.profilePicture
                                            : `https://robohash.org/${
                                                entry.user?.username || 'user'
                                              }.png?set=set1&size=150x150`
                                        }
                                        alt={entry.user?.username || 'U'}
                                        className="h-12 w-12 rounded object-cover"
                                        onError={(e) => {
                                          e.target.src = `https://robohash.org/${
                                            entry.user?.username || 'user'
                                          }.png?set=set1&size=150x150`;
                                          e.target.onerror = null;
                                        }}
                                      />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <div className="font-medium text-white">
                                        {entry.user?.username || 'Unknown'}
                                      </div>
                                      <div className="text-sm text-gray-400">
                                        {entry.user?.firstName &&
                                        entry.user?.lastName
                                          ? `${entry.user.firstName} ${entry.user.lastName}`
                                          : entry.user?.firstName ||
                                            entry.user?.lastName ||
                                            'No name provided'}
                                      </div>
                                      <div className="mt-2 flex flex-wrap items-center gap-2">
                                        <span
                                          className={`px-2 py-1 text-xs font-medium ${
                                            entry.user?.status === 'ACTIVE'
                                              ? 'bg-green-600/20 text-green-400'
                                              : 'bg-orange-600/20 text-orange-400'
                                          }`}
                                        >
                                          {entry.user?.status === 'ACTIVE'
                                            ? 'ACTIVE'
                                            : 'SUSPENDED'}
                                        </span>
                                        <span className="bg-blue-600/20 px-2 py-1 text-xs font-medium text-blue-400">
                                          {entry.user?.accountType || 'USER'}
                                        </span>
                                      </div>
                                      <div className="mt-2 text-xs text-gray-400">
                                        <div>
                                          Created:{' '}
                                          {entry.user?.createdAt
                                            ? new Date(
                                                entry.user.createdAt
                                              ).toLocaleDateString()
                                            : 'Unknown'}
                                        </div>
                                        <div>
                                          Suspended:{' '}
                                          {entry.suspendedAt
                                            ? new Date(
                                                entry.suspendedAt
                                              ).toLocaleDateString()
                                            : 'Unknown'}
                                        </div>
                                        {entry.reactivatedAt && (
                                          <div className="text-green-400">
                                            Reactivated:{' '}
                                            {new Date(
                                              entry.reactivatedAt
                                            ).toLocaleDateString()}
                                          </div>
                                        )}
                                      </div>
                                      <div className="mt-2 text-white">
                                        {entry.reason && (
                                          <p className="whitespace-pre-wrap break-words text-white">
                                            {entry.reason}
                                          </p>
                                        )}
                                        {entry.reactivationReason && (
                                          <p className="mt-1 text-sm text-green-400">
                                            <span className="font-medium">
                                              Reactivation reason:
                                            </span>{' '}
                                            {entry.reactivationReason}
                                          </p>
                                        )}
                                      </div>
                                      <div className="mt-2 text-xs text-gray-400">
                                        <div>
                                          By: {entry.suspendedBy || 'Unknown'}
                                        </div>
                                        {entry.reactivatedBy && (
                                          <div>
                                            Reactivated by:{' '}
                                            {entry.reactivatedBy}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      )}

                      {/* Pagination */}
                      {suspensionHistoryPagination &&
                        suspensionHistoryPagination.totalPages > 1 && (
                          <div className="flex items-center justify-between">
                            <button
                              onClick={() =>
                                fetchSuspensionHistory(
                                  Math.max(0, suspensionHistoryPage - 1),
                                  suspensionHistorySearchFilter,
                                  suspensionHistoryStatusFilter
                                )
                              }
                              disabled={suspensionHistoryPage === 0}
                              className="bg-neutral-700 px-4 py-2 text-sm text-white transition-colors duration-200 hover:bg-neutral-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Previous
                            </button>
                            <span className="text-sm text-gray-400">
                              Page {suspensionHistoryPage + 1} of{' '}
                              {suspensionHistoryPagination.totalPages}
                            </span>
                            <button
                              onClick={() =>
                                fetchSuspensionHistory(
                                  Math.min(
                                    suspensionHistoryPagination.totalPages - 1,
                                    suspensionHistoryPage + 1
                                  ),
                                  suspensionHistorySearchFilter,
                                  suspensionHistoryStatusFilter
                                )
                              }
                              disabled={
                                suspensionHistoryPage >=
                                suspensionHistoryPagination.totalPages - 1
                              }
                              className="bg-neutral-700 px-4 py-2 text-sm text-white transition-colors duration-200 hover:bg-neutral-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Next
                            </button>
                          </div>
                        )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'warnings' && (
              <div className="space-y-6">
                {/* History Section Header */}
                <div className="border border-neutral-700 bg-neutral-800 p-6">
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-white">
                      History
                    </h2>
                    <button
                      onClick={() => {
                        if (activeHistoryTab === 'suspended') {
                          fetchGroupedSuspensions(groupedSuspensionsPage, true); // forceRefresh = true
                        } else if (activeHistoryTab === 'warnings') {
                          fetchGroupedWarnings(groupedWarningsPage, true); // forceRefresh = true
                        }
                      }}
                      disabled={groupedWarningsLoading || groupedSuspensionsLoading}
                      className="flex items-center gap-2 bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                    >
                      <ArrowPathIcon className="h-4 w-4" />
                      <span className="hidden sm:inline">Refresh</span>
                    </button>
                  </div>

                  {/* History Sub-tabs */}
                  <div className="mb-6 border-b border-neutral-600">
                    <div className="flex space-x-8">
                      <button
                        onClick={() => {
                          setActiveHistoryTab('suspended');
                          fetchGroupedSuspensions(groupedSuspensionsPage);
                        }}
                        className={`border-b-2 px-1 py-2 text-sm font-medium transition-all duration-200 ${
                          activeHistoryTab === 'suspended'
                            ? 'border-orange-500 text-orange-400'
                            : 'border-transparent text-gray-400 hover:border-gray-600 hover:text-gray-300'
                        }`}
                      >
                        Suspended ({groupedSuspensionsTotal || 0})
                      </button>
                      <button
                        onClick={() => {
                          setActiveHistoryTab('warnings');
                          fetchGroupedWarnings(groupedWarningsPage);
                        }}
                        className={`border-b-2 px-1 py-2 text-sm font-medium transition-all duration-200 ${
                          activeHistoryTab === 'warnings'
                            ? 'border-blue-500 text-blue-400'
                            : 'border-transparent text-gray-400 hover:border-gray-600 hover:text-gray-300'
                        }`}
                      >
                        Warnings ({groupedWarningsTotal || 0})
                      </button>
                    </div>
                  </div>

                  {/* Grouped Suspensions Tab */}
                  {activeHistoryTab === 'suspended' && (
                    <>
                      {/* Smart Search Bar for Suspended */}
                      <div className="relative mb-6 max-w-md">
                        <div className="absolute left-3 top-2.5">
                          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          placeholder="Search suspended users by username..."
                          className="w-full border-0 bg-neutral-700/80 py-2 pl-10 pr-4 text-white placeholder-gray-400 shadow-inner transition-all duration-200 focus:bg-neutral-700 focus:ring-2 focus:ring-orange-500/50 focus:ring-offset-0"
                          value={suspendedSearchFilter}
                          onChange={(e) => {
                            setSuspendedSearchFilter(e.target.value);
                            handleUserInputChange(e); // trigger suggestions
                            clearTimeout(window.suspendedSearchTimeout2);
                            window.suspendedSearchTimeout2 = setTimeout(() => {
                              fetchGroupedSuspensions(1, e.target.value);
                            }, 500);
                          }}
                          onFocus={() => {
                            if (userSuggestions.length > 0) {
                              setShowUserSuggestions(true);
                            }
                          }}
                          onBlur={() => {
                            setTimeout(
                              () => setShowUserSuggestions(false),
                              200
                            );
                          }}
                          autoComplete="off"
                        />
                        {/* User Suggestions Dropdown */}
                        {showUserSuggestions && userSuggestions.length > 0 && (
                          <div className="user-suggestions absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-y-auto border border-neutral-600 bg-neutral-800 shadow-lg">
                            {userSuggestions.map((user) => (
                              <div
                                key={user.id}
                                className="flex cursor-pointer items-center space-x-3 px-4 py-3 transition-colors duration-200 hover:bg-neutral-700"
                                onClick={() => {
                                  setSuspendedSearchFilter(user.username);
                                  setShowUserSuggestions(false);
                                  setUserSuggestions([]);
                                  fetchGroupedSuspensions(1, user.username);
                                }}
                              >
                                <img
                                  src={
                                    user.profileImage ||
                                    'https://robohash.org/' + user.username
                                  }
                                  alt={`${user.username}'s profile`}
                                  className="h-8 w-8"
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
                                  <span className="bg-red-600 px-2 py-1 text-xs text-white">
                                    Disabled
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      {groupedSuspensionsLoading ? (
                        <div className="p-8 text-center">
                          <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                          <p className="mt-2 text-gray-400">
                            Loading grouped suspensions...
                          </p>
                        </div>
                      ) : groupedSuspensions.length === 0 ? (
                        <div className="p-8 text-center">
                          <div className="text-lg text-gray-400">
                            No suspensions found
                          </div>
                        </div>
                      ) : (
                        <>
                          {/* Desktop View */}
                          <div className="hidden md:block">
                            <div className="space-y-4">
                              {groupedSuspensions.map((userSuspensions) => (
                                <div
                                  key={userSuspensions.userId}
                                  className="border border-gray-700 bg-gray-800 p-4"
                                >
                                  {/* User Header */}
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                      <img
                                        src={
                                          userSuspensions.user?.profilePicture
                                            ? userSuspensions.user
                                                .profilePicture
                                            : `https://robohash.org/${userSuspensions.username}.png?set=set1&size=150x150`
                                        }
                                        alt={userSuspensions.username}
                                        className="h-12 w-12 rounded object-cover"
                                        onError={(e) => {
                                          e.target.src = `https://robohash.org/${userSuspensions.username}.png?set=set1&size=150x150`;
                                          e.target.onerror = null;
                                        }}
                                      />
                                      <div>
                                        <div className="text-lg font-semibold text-white">
                                          {userSuspensions.username}
                                        </div>
                                        <div className="text-sm text-gray-400">
                                          {userSuspensions.user?.email ||
                                            'No email'}
                                        </div>
                                        <div className="mt-1 flex space-x-2">
                                          <span className="bg-orange-600/20 px-2 py-1 text-xs font-medium text-orange-400">
                                            {userSuspensions.totalSuspensions}{' '}
                                            Suspensions
                                          </span>
                                          <span
                                            className={`px-2 py-1 text-xs font-medium ${
                                              userSuspensions.user?.status ===
                                              'ACTIVE'
                                                ? 'bg-green-600/20 text-green-400'
                                                : 'bg-red-600/20 text-red-400'
                                            }`}
                                          >
                                            {userSuspensions.user?.status ===
                                            'ACTIVE'
                                              ? 'ACTIVE'
                                              : 'SUSPENDED'}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() =>
                                        toggleSuspensionUserExpansion(
                                          userSuspensions.userId
                                        )
                                      }
                                      className="flex items-center space-x-2 bg-gray-700 px-3 py-2 text-white transition-colors hover:bg-gray-600"
                                    >
                                      <span>
                                        {expandedSuspensionUsers.has(
                                          userSuspensions.userId
                                        )
                                          ? 'Hide'
                                          : 'Show'}{' '}
                                        Details
                                      </span>
                                      <svg
                                        className={`h-4 w-4 transition-transform ${
                                          expandedSuspensionUsers.has(
                                            userSuspensions.userId
                                          )
                                            ? 'rotate-180'
                                            : ''
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M19 9l-7 7-7-7"
                                        />
                                      </svg>
                                    </button>
                                  </div>

                                  {/* Expanded Details */}
                                  {expandedSuspensionUsers.has(
                                    userSuspensions.userId
                                  ) && (
                                    <div className="mt-4 space-y-4">
                                      {/* Suspensions */}
                                      {userSuspensions.suspensions.length >
                                        0 && (
                                        <div>
                                          <h4 className="mb-2 text-sm font-medium text-orange-400">
                                            Suspensions (
                                            {userSuspensions.suspensions.length}
                                            )
                                          </h4>
                                          <div className="space-y-2">
                                            {userSuspensions.suspensions.map(
                                              (suspension) => (
                                                <div
                                                  key={suspension.id}
                                                  className="border-l-2 border-orange-500 bg-gray-700/50 p-3"
                                                >
                                                  <div className="text-sm text-white">
                                                    {suspension.reason}
                                                  </div>
                                                  <div className="mt-1 text-xs text-gray-400">
                                                    {new Date(
                                                      suspension.suspendedAt
                                                    ).toLocaleDateString()}{' '}
                                                    at{' '}
                                                    {new Date(
                                                      suspension.suspendedAt
                                                    ).toLocaleTimeString()}{' '}
                                                    by{' '}
                                                    {suspension.suspendedBy ||
                                                      'Unknown'}
                                                  </div>
                                                  {suspension.reactivatedAt && (
                                                    <div className="mt-1 text-xs text-green-400">
                                                      Reactivated:{' '}
                                                      {new Date(
                                                        suspension.reactivatedAt
                                                      ).toLocaleDateString()}{' '}
                                                      at{' '}
                                                      {new Date(
                                                        suspension.reactivatedAt
                                                      ).toLocaleTimeString()}
                                                    </div>
                                                  )}
                                                </div>
                                              )
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Mobile View */}
                          <div className="md:hidden">
                            <div className="space-y-4">
                              {groupedSuspensions.map((userSuspensions) => (
                                <div
                                  key={userSuspensions.userId}
                                  className="border border-gray-700 bg-gray-800 p-4"
                                >
                                  {/* User Header */}
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                      <img
                                        src={
                                          userSuspensions.user?.profilePicture
                                            ? userSuspensions.user
                                                .profilePicture
                                            : `https://robohash.org/${userSuspensions.username}.png?set=set1&size=150x150`
                                        }
                                        alt={userSuspensions.username}
                                        className="h-10 w-10 rounded object-cover"
                                        onError={(e) => {
                                          e.target.src = `https://robohash.org/${userSuspensions.username}.png?set=set1&size=150x150`;
                                          e.target.onerror = null;
                                        }}
                                      />
                                      <div>
                                        <div className="font-semibold text-white">
                                          {userSuspensions.username}
                                        </div>
                                        <div className="text-sm text-gray-400">
                                          {userSuspensions.user?.email ||
                                            'No email'}
                                        </div>
                                        <div className="mt-1 flex space-x-2">
                                          <span className="bg-orange-600/20 px-2 py-1 text-xs font-medium text-orange-400">
                                            {userSuspensions.totalSuspensions}{' '}
                                            Suspensions
                                          </span>
                                          <span
                                            className={`px-2 py-1 text-xs font-medium ${
                                              userSuspensions.user?.status ===
                                              'ACTIVE'
                                                ? 'bg-green-600/20 text-green-400'
                                                : 'bg-red-600/20 text-red-400'
                                            }`}
                                          >
                                            {userSuspensions.user?.status ===
                                            'ACTIVE'
                                              ? 'ACTIVE'
                                              : 'SUSPENDED'}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() =>
                                        toggleSuspensionUserExpansion(
                                          userSuspensions.userId
                                        )
                                      }
                                      className="flex items-center space-x-1 bg-gray-700 px-2 py-1 text-xs text-white transition-colors hover:bg-gray-600"
                                    >
                                      <span>
                                        {expandedSuspensionUsers.has(
                                          userSuspensions.userId
                                        )
                                          ? 'Hide'
                                          : 'Show'}
                                      </span>
                                      <svg
                                        className={`h-3 w-3 transition-transform ${
                                          expandedSuspensionUsers.has(
                                            userSuspensions.userId
                                          )
                                            ? 'rotate-180'
                                            : ''
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M19 9l-7 7-7-7"
                                        />
                                      </svg>
                                    </button>
                                  </div>

                                  {/* Expanded Details */}
                                  {expandedSuspensionUsers.has(
                                    userSuspensions.userId
                                  ) && (
                                    <div className="mt-4 space-y-3">
                                      {/* Suspensions */}
                                      {userSuspensions.suspensions.length >
                                        0 && (
                                        <div>
                                          <h4 className="mb-2 text-sm font-medium text-orange-400">
                                            Suspensions (
                                            {userSuspensions.suspensions.length}
                                            )
                                          </h4>
                                          <div className="space-y-2">
                                            {userSuspensions.suspensions.map(
                                              (suspension) => (
                                                <div
                                                  key={suspension.id}
                                                  className="border-l-2 border-orange-500 bg-gray-700/50 p-2"
                                                >
                                                  <div className="text-sm text-white">
                                                    {suspension.reason}
                                                  </div>
                                                  <div className="mt-1 text-xs text-gray-400">
                                                    {new Date(
                                                      suspension.suspendedAt
                                                    ).toLocaleDateString()}{' '}
                                                    at{' '}
                                                    {new Date(
                                                      suspension.suspendedAt
                                                    ).toLocaleTimeString()}{' '}
                                                    by{' '}
                                                    {suspension.suspendedBy ||
                                                      'Unknown'}
                                                  </div>
                                                  {suspension.reactivatedAt && (
                                                    <div className="mt-1 text-xs text-green-400">
                                                      Reactivated:{' '}
                                                      {new Date(
                                                        suspension.reactivatedAt
                                                      ).toLocaleDateString()}{' '}
                                                      at{' '}
                                                      {new Date(
                                                        suspension.reactivatedAt
                                                      ).toLocaleTimeString()}
                                                    </div>
                                                  )}
                                                </div>
                                              )
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Pagination */}
                          {groupedSuspensionsTotal >
                            groupedSuspensionsPerPage && (
                            <div className="flex items-center justify-between border-t border-gray-700 p-6">
                              <div className="text-sm text-gray-400">
                                Showing{' '}
                                {(groupedSuspensionsPage - 1) *
                                  groupedSuspensionsPerPage +
                                  1}{' '}
                                to{' '}
                                {Math.min(
                                  groupedSuspensionsPage *
                                    groupedSuspensionsPerPage,
                                  groupedSuspensionsTotal
                                )}{' '}
                                of {groupedSuspensionsTotal} users
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() =>
                                    fetchGroupedSuspensions(
                                      groupedSuspensionsPage - 1
                                    )
                                  }
                                  disabled={
                                    groupedSuspensionsPage === 1 ||
                                    groupedSuspensionsLoading
                                  }
                                  className="flex h-10 w-10 items-center justify-center bg-gray-800 text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15 19l-7-7 7-7"
                                    />
                                  </svg>
                                </button>
                                <span className="px-3 py-2 font-medium text-white">
                                  Page {groupedSuspensionsPage} of{' '}
                                  {Math.ceil(
                                    groupedSuspensionsTotal /
                                      groupedSuspensionsPerPage
                                  )}
                                </span>
                                <button
                                  onClick={() =>
                                    fetchGroupedSuspensions(
                                      groupedSuspensionsPage + 1
                                    )
                                  }
                                  disabled={
                                    groupedSuspensionsPage >=
                                      Math.ceil(
                                        groupedSuspensionsTotal /
                                          groupedSuspensionsPerPage
                                      ) || groupedSuspensionsLoading
                                  }
                                  className="flex h-10 w-10 items-center justify-center bg-gray-800 text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 5l7 7-7 7"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}

                  {/* Grouped Warnings Tab */}
                  {activeHistoryTab === 'warnings' && (
                    <>
                      {/* Smart Search Bar for Warnings */}
                      <div className="relative mb-6 max-w-md">
                        <div className="absolute left-3 top-2.5">
                          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          placeholder="Search warned users by username..."
                          className="w-full border-0 bg-neutral-700/80 py-2 pl-10 pr-4 text-white placeholder-gray-400 shadow-inner transition-all duration-200 focus:bg-neutral-700 focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-0"
                          value={suspendedSearchFilter}
                          onChange={(e) => {
                            setSuspendedSearchFilter(e.target.value);
                            handleUserInputChange(e); // trigger suggestions
                            clearTimeout(window.warningsSearchTimeout2);
                            window.warningsSearchTimeout2 = setTimeout(() => {
                              fetchGroupedWarnings(1, e.target.value);
                            }, 500);
                          }}
                          onFocus={() => {
                            if (userSuggestions.length > 0) {
                              setShowUserSuggestions(true);
                            }
                          }}
                          onBlur={() => {
                            setTimeout(
                              () => setShowUserSuggestions(false),
                              200
                            );
                          }}
                          autoComplete="off"
                        />
                        {/* User Suggestions Dropdown */}
                        {showUserSuggestions && userSuggestions.length > 0 && (
                          <div className="user-suggestions absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-y-auto border border-neutral-600 bg-neutral-800 shadow-lg">
                            {userSuggestions.map((user) => (
                              <div
                                key={user.id}
                                className="flex cursor-pointer items-center space-x-3 px-4 py-3 transition-colors duration-200 hover:bg-neutral-700"
                                onClick={() => {
                                  setSuspendedSearchFilter(user.username);
                                  setShowUserSuggestions(false);
                                  setUserSuggestions([]);
                                  fetchGroupedWarnings(1, user.username);
                                }}
                              >
                                <img
                                  src={
                                    user.profileImage ||
                                    'https://robohash.org/' + user.username
                                  }
                                  alt={`${user.username}'s profile`}
                                  className="h-8 w-8"
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
                                  <span className="bg-red-600 px-2 py-1 text-xs text-white">
                                    Disabled
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      {groupedWarningsLoading ? (
                        <div className="p-8 text-center">
                          <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                          <p className="mt-2 text-gray-400">
                            Loading grouped warnings...
                          </p>
                        </div>
                      ) : groupedWarnings.length === 0 ? (
                        <div className="p-8 text-center">
                          <div className="text-lg text-gray-400">
                            No warnings found
                          </div>
                        </div>
                      ) : (
                        <>
                          {/* Desktop View */}
                          <div className="hidden md:block">
                            <div className="space-y-4">
                              {groupedWarnings.map((userWarnings) => (
                                <div
                                  key={userWarnings.userId}
                                  className="border border-gray-700 bg-gray-800 p-4"
                                >
                                  {/* User Header */}
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                      <img
                                        src={
                                          userWarnings.user?.profilePicture
                                            ? userWarnings.user.profilePicture
                                            : `https://robohash.org/${userWarnings.username}.png?set=set1&size=150x150`
                                        }
                                        alt={userWarnings.username}
                                        className="h-12 w-12 rounded object-cover"
                                        onError={(e) => {
                                          e.target.src = `https://robohash.org/${userWarnings.username}.png?set=set1&size=150x150`;
                                          e.target.onerror = null;
                                        }}
                                      />
                                      <div>
                                        <div className="text-lg font-semibold text-white">
                                          {userWarnings.username}
                                        </div>
                                        <div className="text-sm text-gray-400">
                                          {userWarnings.user?.email ||
                                            'No email'}
                                        </div>
                                        <div className="mt-1 flex space-x-2">
                                          <span className="bg-blue-600/20 px-2 py-1 text-xs font-medium text-blue-400">
                                            {userWarnings.totalWarnings}{' '}
                                            Warnings
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() =>
                                        toggleWarningUserExpansion(
                                          userWarnings.userId
                                        )
                                      }
                                      className="flex items-center space-x-2 bg-gray-700 px-3 py-2 text-white transition-colors hover:bg-gray-600"
                                    >
                                      <span>
                                        {expandedWarningUsers.has(
                                          userWarnings.userId
                                        )
                                          ? 'Hide'
                                          : 'Show'}{' '}
                                        Details
                                      </span>
                                      <svg
                                        className={`h-4 w-4 transition-transform ${
                                          expandedWarningUsers.has(
                                            userWarnings.userId
                                          )
                                            ? 'rotate-180'
                                            : ''
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M19 9l-7 7-7-7"
                                        />
                                      </svg>
                                    </button>
                                  </div>

                                  {/* Expanded Details */}
                                  {expandedWarningUsers.has(
                                    userWarnings.userId
                                  ) && (
                                    <div className="mt-4 space-y-4">
                                      {/* Warnings */}
                                      {userWarnings.warnings.length > 0 && (
                                        <div>
                                          <h4 className="mb-2 text-sm font-medium text-blue-400">
                                            Warnings (
                                            {userWarnings.warnings.length})
                                          </h4>
                                          <div className="space-y-2">
                                            {userWarnings.warnings.map(
                                              (warning) => (
                                                <div
                                                  key={warning.id}
                                                  className="border-l-2 border-blue-500 bg-gray-700/50 p-3"
                                                >
                                                  <div className="text-sm text-white">
                                                    {warning.reason}
                                                  </div>
                                                  <div className="mt-1 text-xs text-gray-400">
                                                    {new Date(
                                                      warning.createdAt
                                                    ).toLocaleDateString()}{' '}
                                                    at{' '}
                                                    {new Date(
                                                      warning.createdAt
                                                    ).toLocaleTimeString()}{' '}
                                                    by{' '}
                                                    {warning.warnedBy
                                                      ?.username || 'Unknown'}
                                                  </div>
                                                </div>
                                              )
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Mobile View */}
                          <div className="md:hidden">
                            <div className="space-y-4">
                              {groupedWarnings.map((userWarnings) => (
                                <div
                                  key={userWarnings.userId}
                                  className="border border-gray-700 bg-gray-800 p-4"
                                >
                                  {/* User Header */}
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                      <img
                                        src={
                                          userWarnings.user?.profilePicture
                                            ? userWarnings.user.profilePicture
                                            : `https://robohash.org/${userWarnings.username}.png?set=set1&size=150x150`
                                        }
                                        alt={userWarnings.username}
                                        className="h-10 w-10 rounded object-cover"
                                        onError={(e) => {
                                          e.target.src = `https://robohash.org/${userWarnings.username}.png?set=set1&size=150x150`;
                                          e.target.onerror = null;
                                        }}
                                      />
                                      <div>
                                        <div className="font-semibold text-white">
                                          {userWarnings.username}
                                        </div>
                                        <div className="text-sm text-gray-400">
                                          {userWarnings.user?.email ||
                                            'No email'}
                                        </div>
                                        <div className="mt-1 flex space-x-2">
                                          <span className="bg-blue-600/20 px-2 py-1 text-xs font-medium text-blue-400">
                                            {userWarnings.totalWarnings}{' '}
                                            Warnings
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() =>
                                        toggleWarningUserExpansion(
                                          userWarnings.userId
                                        )
                                      }
                                      className="flex items-center space-x-1 bg-gray-700 px-2 py-1 text-xs text-white transition-colors hover:bg-gray-600"
                                    >
                                      <span>
                                        {expandedWarningUsers.has(
                                          userWarnings.userId
                                        )
                                          ? 'Hide'
                                          : 'Show'}
                                      </span>
                                      <svg
                                        className={`h-3 w-3 transition-transform ${
                                          expandedWarningUsers.has(
                                            userWarnings.userId
                                          )
                                            ? 'rotate-180'
                                            : ''
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M19 9l-7 7-7-7"
                                        />
                                      </svg>
                                    </button>
                                  </div>

                                  {/* Expanded Details */}
                                  {expandedWarningUsers.has(
                                    userWarnings.userId
                                  ) && (
                                    <div className="mt-4 space-y-3">
                                      {/* Warnings */}
                                      {userWarnings.warnings.length > 0 && (
                                        <div>
                                          <h4 className="mb-2 text-sm font-medium text-blue-400">
                                            Warnings (
                                            {userWarnings.warnings.length})
                                          </h4>
                                          <div className="space-y-2">
                                            {userWarnings.warnings.map(
                                              (warning) => (
                                                <div
                                                  key={warning.id}
                                                  className="border-l-2 border-blue-500 bg-gray-700/50 p-2"
                                                >
                                                  <div className="text-sm text-white">
                                                    {warning.reason}
                                                  </div>
                                                  <div className="mt-1 text-xs text-gray-400">
                                                    {new Date(
                                                      warning.createdAt
                                                    ).toLocaleDateString()}{' '}
                                                    at{' '}
                                                    {new Date(
                                                      warning.createdAt
                                                    ).toLocaleTimeString()}{' '}
                                                    by{' '}
                                                    {warning.warnedBy
                                                      ?.username || 'Unknown'}
                                                  </div>
                                                  {warning.reactivatedAt && (
                                                    <div className="mt-1 text-xs text-green-400">
                                                      Reactivated:{' '}
                                                      {new Date(
                                                        warning.reactivatedAt
                                                      ).toLocaleDateString()}{' '}
                                                      at{' '}
                                                      {new Date(
                                                        warning.reactivatedAt
                                                      ).toLocaleTimeString()}
                                                    </div>
                                                  )}
                                                </div>
                                              )
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Pagination */}
                          {groupedWarningsTotal > groupedWarningsPerPage && (
                            <div className="flex items-center justify-between border-t border-gray-700 p-6">
                              <div className="text-sm text-gray-400">
                                Showing{' '}
                                {(groupedWarningsPage - 1) *
                                  groupedWarningsPerPage +
                                  1}{' '}
                                to{' '}
                                {Math.min(
                                  groupedWarningsPage * groupedWarningsPerPage,
                                  groupedWarningsTotal
                                )}{' '}
                                of {groupedWarningsTotal} users
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() =>
                                    fetchGroupedWarnings(
                                      groupedWarningsPage - 1
                                    )
                                  }
                                  disabled={
                                    groupedWarningsPage === 1 ||
                                    groupedWarningsLoading
                                  }
                                  className="flex h-10 w-10 items-center justify-center bg-gray-800 text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15 19l-7-7 7-7"
                                    />
                                  </svg>
                                </button>
                                <span className="px-3 py-2 font-medium text-white">
                                  Page {groupedWarningsPage} of{' '}
                                  {Math.ceil(
                                    groupedWarningsTotal /
                                      groupedWarningsPerPage
                                  )}
                                </span>
                                <button
                                  onClick={() =>
                                    fetchGroupedWarnings(
                                      groupedWarningsPage + 1
                                    )
                                  }
                                  disabled={
                                    groupedWarningsPage >=
                                      Math.ceil(
                                        groupedWarningsTotal /
                                          groupedWarningsPerPage
                                      ) || groupedWarningsLoading
                                  }
                                  className="flex h-10 w-10 items-center justify-center bg-gray-800 text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  <svg
                                    className="h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 5l7 7-7 7"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}
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

        {/* User Management Popup Modal */}
        {showUserManagementPopup && selectedUserForManagement && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md border border-neutral-700 bg-neutral-800 p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">
                  Manage User: {selectedUserForManagement.username}
                </h3>
                <button
                  onClick={() => {
                    setShowUserManagementPopup(false);
                    setSelectedUserForManagement(null);
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-300">
                    Username
                  </label>
                  <input
                    type="text"
                    value={selectedUserForManagement.username}
                    readOnly
                    className="w-full border border-neutral-600 bg-neutral-700 px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-300">
                    Reason for action (required for audit trail)
                  </label>
                  <textarea
                    id="popupReasonInput"
                    placeholder="Enter reason for action..."
                    className="h-24 w-full resize-none border border-neutral-600 bg-neutral-700 p-3 text-white focus:border-blue-500 focus:outline-none"
                    rows="3"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      handleDisableAccount(selectedUserForManagement.username);
                      setShowUserManagementPopup(false);
                      setSelectedUserForManagement(null);
                    }}
                    className="flex items-center justify-center space-x-2 border border-red-600/30 bg-red-600/10 px-4 py-2 text-sm font-medium text-red-400 transition-all duration-200 hover:border-red-500/50 hover:bg-red-600/20"
                  >
                    <span>Disable Account</span>
                  </button>

                  <button
                    onClick={() => {
                      handleEnableAccount(selectedUserForManagement.username);
                      setShowUserManagementPopup(false);
                      setSelectedUserForManagement(null);
                    }}
                    className="flex items-center justify-center space-x-2 border border-green-600/30 bg-green-600/10 px-4 py-2 text-sm font-medium text-green-400 transition-all duration-200 hover:border-green-500/50 hover:bg-green-600/20"
                  >
                    <span>Enable Account</span>
                  </button>

                  <button
                    onClick={() => {
                      handleWarnUser(selectedUserForManagement.username);
                      setShowUserManagementPopup(false);
                      setSelectedUserForManagement(null);
                    }}
                    className="flex items-center justify-center space-x-2 border border-yellow-600/30 bg-yellow-600/10 px-4 py-2 text-sm font-medium text-yellow-400 transition-all duration-200 hover:border-yellow-500/50 hover:bg-yellow-600/20"
                  >
                    <i className="fas fa-exclamation-triangle"></i>
                    <span>Warn User</span>
                  </button>

                  <button
                    onClick={() => {
                      handleResetPFP(selectedUserForManagement.username);
                      setShowUserManagementPopup(false);
                      setSelectedUserForManagement(null);
                    }}
                    className="flex items-center justify-center space-x-2 border border-neutral-600 bg-neutral-700 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:border-neutral-500 hover:bg-neutral-600"
                  >
                    <span>Reset Avatar</span>
                  </button>

                  <button
                    onClick={() => {
                      handleResetBanner(selectedUserForManagement.username);
                      setShowUserManagementPopup(false);
                      setSelectedUserForManagement(null);
                    }}
                    className="flex items-center justify-center space-x-2 border border-neutral-600 bg-neutral-700 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:border-neutral-500 hover:bg-neutral-600"
                  >
                    <span>Reset Banner</span>
                  </button>

                  <button
                    onClick={() => {
                      handleResetBio(selectedUserForManagement.username);
                      setShowUserManagementPopup(false);
                      setSelectedUserForManagement(null);
                    }}
                    className="flex items-center justify-center space-x-2 border border-neutral-600 bg-neutral-700 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:border-neutral-500 hover:bg-neutral-600"
                  >
                    <span>Reset Bio</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Action Modals - Suspend and Role only */}
        <UserActionModals
          showSuspendModal={showSuspendModal}
          setShowSuspendModal={setShowSuspendModal}
          suspendForm={suspendForm}
          setSuspendForm={setSuspendForm}
          submitSuspension={submitSuspension}
          showRoleModal={showRoleModal}
          setShowRoleModal={setShowRoleModal}
          roleForm={roleForm}
          setRoleForm={setRoleForm}
          submitRoleChange={submitRoleChange}
          selectedUserForAction={selectedUserForAction}
        />

        {/* Reactivation Modal */}
        {showReactivateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md border border-neutral-700 bg-neutral-800 p-6">
              <h3 className="mb-4 text-lg font-medium text-white">
                Reactivate Account
              </h3>
              <p className="mb-4 text-neutral-300">
                Reactivating account for:{' '}
                <span className="font-medium">
                  {selectedUserForReactivation?.username}
                </span>
              </p>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-300">
                    Reason for Reactivation (Optional)
                  </label>
                  <textarea
                    value={reactivateForm.reason}
                    onChange={(e) =>
                      setReactivateForm({
                        ...reactivateForm,
                        reason: e.target.value,
                      })
                    }
                    className="h-24 w-full resize-none border border-neutral-600 bg-neutral-700 p-3 text-white focus:border-green-500 focus:outline-none"
                    placeholder="Enter reason for reactivation (optional)..."
                  />
                  <p className="mt-1 text-xs text-neutral-400">
                    Leave empty for "Administrative reactivation"
                  </p>
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                <button
                  onClick={() => setShowReactivateModal(false)}
                  className="flex-1 bg-neutral-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-neutral-500"
                >
                  Cancel
                </button>
                <button
                  onClick={submitReactivationModal}
                  className="flex-1 bg-green-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-green-500"
                >
                  Reactivate Account
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Details Modal */}
        {showDetailsModal && selectedDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-2xl border border-neutral-700 bg-neutral-800 p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">
                  {selectedDetails.type === 'deletion'
                    ? 'Deletion Request Details'
                    : 'Details'}
                </h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>

              {selectedDetails.type === 'deletion' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-neutral-300">
                        User
                      </label>
                      <p className="mt-1 text-white">
                        {selectedDetails.data.user?.username || 'Unknown User'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-300">
                        Status
                      </label>
                      <span className="mt-1 inline-block bg-yellow-600/20 px-2 py-1 text-xs text-yellow-400">
                        {selectedDetails.data.status}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-300">
                        Requested Date
                      </label>
                      <p className="mt-1 text-white">
                        {new Date(
                          selectedDetails.data.createdAt
                        ).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-300">
                        Account Created
                      </label>
                      <p className="mt-1 text-white">
                        {selectedDetails.data.user?.createdAt
                          ? new Date(
                              selectedDetails.data.user.createdAt
                            ).toLocaleDateString()
                          : 'Unknown'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-300">
                      Reason for Deletion
                    </label>
                    <div className="mt-2 rounded border border-neutral-600 bg-neutral-700 p-3">
                      <p className="text-white">
                        {selectedDetails.data.reason || 'No reason provided'}
                      </p>
                    </div>
                  </div>

                  {selectedDetails.data.scheduledFor && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-300">
                        Scheduled for Deletion
                      </label>
                      <p className="mt-1 text-white">
                        {new Date(
                          selectedDetails.data.scheduledFor
                        ).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="bg-neutral-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-neutral-500"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
