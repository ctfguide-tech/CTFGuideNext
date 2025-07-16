import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import Sidebar from '@/components/settingComponents/sidebar';
import Dropdown from '@/components/settingComponents/dropdown';
import request, { getCookie } from '@/utils/request';
import { useRouter } from 'next/router';

export default function AccountManagement() {
  const [deletionStatus, setDeletionStatus] = useState(null);
  const [userStatus, setUserStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [disableConfirmationStep, setDisableConfirmationStep] = useState(1); // 1: info, 2: confirmation
  const [disableReason, setDisableReason] = useState('');
  const [deleteFormData, setDeleteFormData] = useState({
    reason: '',
    password: '',
    confirmText: '',
  });
  const [deleteConfirmationStep, setDeleteConfirmationStep] = useState(1); // 1: form, 2: final confirmation
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  // Optimized handlers to prevent re-renders
  const handleDisableModalClose = useCallback(() => {
    setShowDisableModal(false);
    setDisableConfirmationStep(1);
    setDisableReason('');
  }, []);

  const handleDeleteModalClose = useCallback(() => {
    setShowDeleteModal(false);
    setDeleteFormData({ reason: '', password: '', confirmText: '' });
    setDeleteConfirmationStep(1);
  }, []);

  const handleDisableReasonChange = useCallback((e) => {
    setDisableReason(e.target.value);
  }, []);

  const handleDeleteReasonChange = useCallback((e) => {
    setDeleteFormData((prev) => ({
      ...prev,
      reason: e.target.value,
    }));
  }, []);

  const handleDeletePasswordChange = useCallback((e) => {
    setDeleteFormData((prev) => ({
      ...prev,
      password: e.target.value,
    }));
  }, []);

  const handleDeleteConfirmTextChange = useCallback((e) => {
    setDeleteFormData((prev) => ({
      ...prev,
      confirmText: e.target.value,
    }));
  }, []);

  useEffect(() => {
    fetchAccountData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // Check on initial render
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const fetchAccountData = async () => {
    try {
      const [deletionResponse, accountResponse] = await Promise.all([
        request(
          `${process.env.NEXT_PUBLIC_API_URL}/account-deletion/status`,
          'GET'
        ),
        request(`${process.env.NEXT_PUBLIC_API_URL}/account`, 'GET'),
      ]);

      // Only set deletion status if there's actually a pending deletion request
      if (
        deletionResponse.success &&
        deletionResponse.data &&
        deletionResponse.data.hasRequest
      ) {
        setDeletionStatus(deletionResponse.data);
      } else {
        setDeletionStatus(null); // Clear any existing deletion status
      }

      if (accountResponse) {
        setUserStatus(accountResponse);
      }
    } catch (error) {
      console.error('Error fetching account data:', error);
      setDeletionStatus(null); // Clear deletion status on error
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleDisableAccount = async () => {
    setIsSubmitting(true);
    try {
      const response = await request(
        `${process.env.NEXT_PUBLIC_API_URL}/account/disable`,
        'POST',
        { reason: disableReason }
      );

      if (response.success) {
        showNotification(
          'Account disabled successfully. You can reactivate by logging in again.',
          'success'
        );
        setShowDisableModal(false);
        setDisableConfirmationStep(1);
        setDisableReason('');
        // Redirect to login after a delay
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        throw new Error(response.error || 'Failed to disable account');
      }
    } catch (error) {
      showNotification(error.message || 'Failed to disable account.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    // Step 1: Validate inputs
    if (deleteConfirmationStep === 1) {
      if (deleteFormData.reason.trim().length < 10) {
        showNotification(
          'Please provide a reason of at least 10 characters.',
          'error'
        );
        return;
      }

      // Only require password for EMAIL accounts
      if (userStatus?.accountType === 'EMAIL' && !deleteFormData.password) {
        showNotification('Please enter your password to confirm.', 'error');
        return;
      }

      // Verify password for EMAIL accounts before proceeding
      if (userStatus?.accountType === 'EMAIL') {
        setIsSubmitting(true);
        try {
          // Custom fetch for password verification to avoid auto-logout on 401
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/account/verify-password`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getCookie()}`,
              },
              credentials: 'include',
              body: JSON.stringify({ password: deleteFormData.password }),
            }
          );

          const testResponse = await response.json();

          if (!response.ok || !testResponse.success) {
            // Password verification failed - show error and stay in modal
            showNotification(
              'Incorrect password. Please enter your current account password.',
              'error'
            );
            setIsSubmitting(false);
            return; // Don't proceed to step 2
          }

          // Password is correct, proceed to confirmation step
          setDeleteConfirmationStep(2);
          setIsSubmitting(false);
        } catch (error) {
          // Network or other error during password verification
          showNotification(
            'Error verifying password. Please try again.',
            'error'
          );
          setIsSubmitting(false);
          return; // Don't proceed to step 2
        }
      } else {
        // For Google accounts, go directly to confirmation
        setDeleteConfirmationStep(2);
      }
      return; // Exit function after step 1
    }

    // Step 2: Final confirmation - create deletion request
    if (deleteFormData.confirmText !== 'DELETE MY ACCOUNT') {
      showNotification(
        'Please type "DELETE MY ACCOUNT" exactly to confirm.',
        'error'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const requestData = {
        reason: deleteFormData.reason,
      };

      // Only include password for EMAIL accounts
      if (userStatus?.accountType === 'EMAIL') {
        requestData.password = deleteFormData.password;
      }

      const response = await request(
        `${process.env.NEXT_PUBLIC_API_URL}/account-deletion/request`,
        'POST',
        requestData
      );

      if (response.success) {
        showNotification(
          'Account deletion scheduled for 7 days. Your account will be suspended and you will be logged out.',
          'warning'
        );
        setShowDeleteModal(false);
        setDeleteFormData({ reason: '', password: '', confirmText: '' });
        setDeleteConfirmationStep(1);

        // Only log out AFTER successful deletion request creation
        setTimeout(() => {
          localStorage.removeItem('token');
          document.cookie =
            'idToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
          window.location.href = '/login';
        }, 3000); // Give user time to read the message
      } else {
        // Deletion request failed - show error but don't log out
        throw new Error(response.error || 'Failed to submit deletion request');
      }
    } catch (error) {
      let errorMessage = 'Failed to submit deletion request.';

      // Handle specific error cases for better UX
      if (error.message) {
        if (error.message.includes('Invalid password')) {
          errorMessage =
            'Incorrect password. Please go back and enter your current account password.';
        } else if (
          error.message.includes('Password verification is required')
        ) {
          errorMessage =
            'Please enter your password to confirm account deletion.';
        } else {
          errorMessage = error.message;
        }
      }

      showNotification(errorMessage, 'error');
      // Don't log out on error - user stays in modal to try again
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelDeletion = async () => {
    try {
      const response = await request(
        `${process.env.NEXT_PUBLIC_API_URL}/account-deletion/cancel`,
        'POST'
      );

      if (response.success) {
        showNotification(
          'Account deletion cancelled successfully. Your account will remain active.',
          'success'
        );
        fetchAccountData();
      } else {
        throw new Error(response.error || 'Failed to cancel deletion request');
      }
    } catch (error) {
      showNotification(
        error.message || 'Failed to cancel deletion request.',
        'error'
      );
    }
  };

  const NotificationModal = () => {
    if (!notification) return null;

    const getIcon = () => {
      switch (notification.type) {
        case 'success':
          return 'fas fa-check-circle text-green-400';
        case 'error':
          return 'fas fa-exclamation-circle text-red-400';
        case 'warning':
          return 'fas fa-exclamation-triangle text-yellow-400';
        default:
          return 'fas fa-info-circle text-blue-400';
      }
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setNotification(null)}
        />
        <div className="relative max-w-md rounded-2xl border border-neutral-700 bg-neutral-800/95 p-8 shadow-2xl backdrop-blur-md">
          <div className="flex items-center space-x-4">
            <i className={`${getIcon()} text-xl`}></i>
            <div className="flex-1">
              <p className="text-white">{notification.message}</p>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-gray-400 transition-colors hover:text-white"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const DisableAccountModal = useMemo(() => {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleDisableModalClose();
            }
          }}
        />
        <div
          className="relative w-full max-w-lg rounded-lg border border-neutral-700 bg-neutral-800 p-6 shadow-xl sm:max-w-xl md:max-w-2xl md:p-8"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="mb-6 flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/20 md:h-12 md:w-12">
                <i className="fas fa-pause-circle text-lg text-orange-400 md:text-xl"></i>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white md:text-xl">
                  Disable Account
                </h3>
                <p className="mt-1 text-xs text-gray-400 md:text-sm">
                  {disableConfirmationStep === 1
                    ? 'Step 1: Information'
                    : 'Step 2: Confirmation'}
                </p>
              </div>
            </div>
            <button
              onClick={handleDisableModalClose}
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-neutral-700 hover:text-white"
            >
              <i className="fas fa-times text-sm md:text-base"></i>
            </button>
          </div>

          {disableConfirmationStep === 1 ? (
            // Step 1: Information and reason
            <>
              <div className="mb-6 space-y-4">
                {/* Information Card */}
                <div className="rounded-lg border border-orange-500/30 bg-orange-900/20 p-4">
                  <h4 className="mb-3 flex items-center text-sm font-semibold text-orange-300 md:text-base">
                    <i className="fas fa-info-circle mr-2 text-orange-400"></i>
                    What happens when you disable your account:
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-orange-400"></div>
                      <p className="text-xs leading-relaxed text-gray-200 md:text-sm">
                        Your profile will be hidden from other users
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-orange-400"></div>
                      <p className="text-xs leading-relaxed text-gray-200 md:text-sm">
                        Your challenges and content will remain but be
                        temporarily unavailable
                      </p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-orange-400"></div>
                      <p className="text-xs leading-relaxed text-gray-200 md:text-sm">
                        You can reactivate by logging in again
                      </p>
                    </div>
                  </div>
                </div>

                {/* Reason Input */}
                <div className="space-y-3">
                  <label className="flex items-center text-sm font-semibold text-white md:text-base">
                    <i className="fas fa-comment-alt mr-2 text-orange-400"></i>
                    Why are you disabling your account?
                    <span className="ml-1 text-orange-400">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      value={disableReason}
                      onChange={handleDisableReasonChange}
                      placeholder="Let us know why you're taking a break from CTFGuide..."
                      className="w-full resize-none rounded-lg border border-neutral-600 bg-neutral-700 px-3 py-3 text-sm text-white placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20 md:px-4 md:py-4"
                      rows="4"
                      maxLength="500"
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-gray-500 md:bottom-3 md:right-3">
                      {disableReason.length}/500
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
                <button
                  onClick={handleDisableModalClose}
                  className="flex-1 rounded-lg border border-neutral-600 bg-neutral-700 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-600 md:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (!disableReason.trim()) {
                      showNotification(
                        'Please provide a reason for disabling your account.',
                        'error'
                      );
                      return;
                    }
                    setDisableConfirmationStep(2);
                  }}
                  className="flex-1 rounded-lg bg-orange-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-orange-500 md:text-base"
                >
                  Continue
                </button>
              </div>
            </>
          ) : (
            // Step 2: Final confirmation
            <>
              <div className="mb-6 space-y-4">
                {/* Warning Card */}
                <div className="rounded-lg border border-red-500/40 bg-red-900/20 p-4">
                  <h4 className="mb-3 flex items-center text-sm font-semibold text-red-300 md:text-base">
                    <i className="fas fa-exclamation-triangle mr-2 text-red-400"></i>
                    Final Confirmation
                  </h4>
                  <p className="mb-3 text-xs leading-relaxed text-red-100 md:text-sm">
                    Are you sure you want to disable your account? This will log
                    you out immediately and hide your profile from other users.
                  </p>
                  <div className="rounded-lg bg-neutral-800/60 p-3 backdrop-blur-sm">
                    <p className="text-xs text-gray-300 md:text-sm">
                      <span className="font-semibold text-white">Reason:</span>{' '}
                      {disableReason}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
                <button
                  onClick={() => setDisableConfirmationStep(1)}
                  className="flex-1 rounded-lg border border-neutral-600 bg-neutral-700 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-600 md:text-base"
                >
                  <i className="fas fa-arrow-left mr-2"></i>
                  Back
                </button>
                <button
                  onClick={handleDisableAccount}
                  disabled={isSubmitting}
                  className="flex-1 rounded-lg bg-red-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60 md:text-base"
                >
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Disabling...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check mr-2"></i>
                      Yes, Disable My Account
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }, [
    disableConfirmationStep,
    disableReason,
    isSubmitting,
    handleDisableModalClose,
    handleDisableReasonChange,
  ]);

  const DeleteAccountModal = useMemo(() => {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleDeleteModalClose();
            }
          }}
        />
        <div
          className="relative w-full max-w-lg rounded-lg border border-neutral-700 bg-neutral-800 p-6 shadow-xl sm:max-w-xl md:max-w-2xl md:p-8"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="mb-6 flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/20 md:h-12 md:w-12">
                <i className="fas fa-trash-alt text-lg text-red-400 md:text-xl"></i>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white md:text-xl">
                  {deleteConfirmationStep === 1
                    ? 'Delete Account'
                    : 'Confirm Account Deletion'}
                </h3>
                <p className="mt-1 text-xs text-gray-400 md:text-sm">
                  {deleteConfirmationStep === 1
                    ? 'Permanently delete your account'
                    : 'Final confirmation required'}
                </p>
              </div>
            </div>
            <button
              onClick={handleDeleteModalClose}
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-neutral-700 hover:text-white"
            >
              <i className="fas fa-times text-sm md:text-base"></i>
            </button>
          </div>

          {deleteConfirmationStep === 1 ? (
            // Step 1: Initial form with reason and password
            <div className="mb-6 space-y-4">
              <div className="rounded-lg border border-red-600/30 bg-red-900/20 p-4">
                <h4 className="mb-2 text-sm font-medium text-red-400 md:text-base">
                  What happens when you delete your account:
                </h4>
                <ul className="space-y-2 text-xs text-gray-300 md:text-sm">
                  <li className="flex items-start">
                    <span className="mr-2 mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-400"></span>
                    Your account will be suspended for 7 days
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-400"></span>
                    You can cancel by logging in during this time
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-400"></span>
                    After 7 days, your account will be permanently deleted
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-400"></span>
                    Your challenges will be transferred to CTFGuide
                  </li>
                </ul>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white">
                  Why are you deleting your account?{' '}
                  <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={deleteFormData.reason}
                  onChange={handleDeleteReasonChange}
                  placeholder="Please tell us why you're leaving (minimum 10 characters)..."
                  className="w-full resize-none rounded-lg border border-neutral-600 bg-neutral-700 px-3 py-2 text-sm text-white placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                  rows="3"
                  maxLength="500"
                />
                <div className="mt-1 text-right text-xs text-gray-500">
                  {deleteFormData.reason.length}/500
                </div>
              </div>

              {/* Password field - only show for EMAIL accounts */}
              {userStatus?.accountType === 'EMAIL' && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-white">
                    Confirm your password{' '}
                    <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="password"
                    value={deleteFormData.password}
                    onChange={handleDeletePasswordChange}
                    placeholder="Enter your current password"
                    className="w-full rounded-lg border border-neutral-600 bg-neutral-700 px-3 py-2 text-sm text-white placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                  />
                </div>
              )}

              {/* Google Account Notice */}
              {userStatus?.accountType === 'GOOGLE' && (
                <div className="rounded-lg border border-blue-600/30 bg-blue-900/20 p-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src="../../google.png"
                      alt="Google"
                      className="h-5 w-5 md:h-6 md:w-6"
                    />
                    <div>
                      <h4 className="text-sm font-medium text-blue-400 md:text-base">
                        Google Account
                      </h4>
                      <p className="text-xs text-blue-200 md:text-sm">
                        You are using a Google Account, no password confirmation
                        is needed.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Step 2: Final confirmation
            <div className="mb-6 space-y-4">
              <div className="rounded-lg border border-yellow-600/30 bg-yellow-900/20 p-4">
                <h4 className="mb-3 text-sm font-medium text-yellow-400 md:text-base">
                  ⚠️ Final Warning - Account Suspension
                </h4>
                <div className="space-y-2 text-xs text-gray-300 md:text-sm">
                  <p>
                    <strong>Your account will be suspended for 7 days.</strong>
                  </p>
                  <p>During this time:</p>
                  <ul className="ml-4 mt-2 space-y-1">
                    <li>• You won't be able to access your account</li>
                    <li>• You can cancel deletion by logging in</li>
                    <li>
                      • After 7 days, your account will be permanently deleted
                    </li>
                  </ul>
                </div>
              </div>

              <div className="rounded-lg border border-red-600/30 bg-red-900/20 p-4">
                <h4 className="mb-2 text-sm font-medium text-red-400 md:text-base">
                  Deletion reason:
                </h4>
                <p className="text-xs italic text-gray-300 md:text-sm">
                  "{deleteFormData.reason}"
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white">
                  Type "DELETE MY ACCOUNT" to confirm{' '}
                  <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={deleteFormData.confirmText}
                  onChange={handleDeleteConfirmTextChange}
                  placeholder="Type: DELETE MY ACCOUNT"
                  className="w-full rounded-lg border border-neutral-600 bg-neutral-700 px-3 py-2 text-sm text-white placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
            {deleteConfirmationStep === 1 ? (
              <>
                <button
                  onClick={handleDeleteModalClose}
                  className="flex-1 rounded-lg border border-neutral-600 bg-neutral-700 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-600 md:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isSubmitting}
                  className="flex-1 rounded-lg bg-red-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50 md:text-base"
                >
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Verifying...
                    </>
                  ) : (
                    'Continue'
                  )}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setDeleteConfirmationStep(1)}
                  className="flex-1 rounded-lg border border-neutral-600 bg-neutral-700 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-600 md:text-base"
                >
                  Back
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isSubmitting}
                  className="flex-1 rounded-lg bg-red-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50 md:text-base"
                >
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Deleting Account...
                    </>
                  ) : (
                    'Delete My Account'
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }, [
    deleteFormData,
    userStatus,
    isSubmitting,
    handleDeleteModalClose,
    handleDeleteReasonChange,
    handleDeletePasswordChange,
    handleDeleteConfirmTextChange,
    deleteConfirmationStep,
  ]);

  if (loading) {
    return (
      <>
        <Head>
          <title>Account Management - CTFGuide</title>
        </Head>
        <StandardNav />
        <div className="min-h-screen bg-neutral-900">
          <div className="flex animate-pulse items-center justify-center py-20">
            <div className="text-white">Loading...</div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Account Management - CTFGuide</title>
        <meta
          name="description"
          content="Manage your CTFGuide account settings and preferences"
        />
      </Head>

      <StandardNav />

      <div className="min-h-screen bg-neutral-900">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
            <div className="lg:w-64">
              {isMobile ? (
                <Dropdown tab="../settings/account-management" />
              ) : (
                <Sidebar />
              )}
            </div>

            <div className="flex-1">
              <div className="mb-6 lg:mb-8">
                <h1 className="text-2xl font-bold text-white sm:text-3xl">
                  Account Management
                </h1>
                <p className="mt-2 text-sm text-gray-400 sm:text-base">
                  Manage dangerous account actions. These changes are permanent
                  and cannot be undone.
                </p>
              </div>

              {/* Current Account Status */}
              {userStatus?.status === 'SUSPENDED' && (
                <div className="mb-6 rounded-lg border border-orange-600/30 bg-orange-900/20 p-4 sm:p-6">
                  <div className="flex items-start space-x-3">
                    <i className="fas fa-pause-circle mt-1 text-orange-400"></i>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-orange-400 sm:text-base">
                        Account Currently Disabled
                      </h3>
                      <p className="mt-1 text-sm text-orange-200 sm:text-base">
                        Your account is temporarily disabled and hidden from
                        other users.
                      </p>
                      <p className="mt-2 text-xs text-orange-300 sm:text-sm">
                        You can reactivate your account at any time by clicking
                        the button below.
                      </p>
                      <button
                        onClick={async () => {
                          try {
                            const response = await request(
                              `${process.env.NEXT_PUBLIC_API_URL}/account/enable`,
                              'POST'
                            );
                            if (response.success) {
                              showNotification(
                                'Account reactivated successfully!',
                                'success'
                              );
                              fetchAccountData();
                            }
                          } catch (error) {
                            showNotification(
                              'Failed to reactivate account.',
                              'error'
                            );
                          }
                        }}
                        className="mt-4 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-500"
                      >
                        Reactivate Account
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Current Deletion Status */}
              {deletionStatus && deletionStatus.hasRequest && (
                <div className="mb-6 rounded-lg border border-yellow-600/30 bg-yellow-900/20 p-4 sm:p-6">
                  <div className="flex items-start space-x-3">
                    <i className="fas fa-exclamation-triangle mt-1 text-yellow-400"></i>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-yellow-400 sm:text-base">
                        Pending Account Deletion
                      </h3>
                      <p className="mt-1 text-sm text-yellow-200 sm:text-base">
                        Your account deletion request is scheduled for{' '}
                        {deletionStatus.scheduledFor
                          ? new Date(
                              deletionStatus.scheduledFor
                            ).toLocaleDateString()
                          : 'a date to be determined'}
                      </p>
                      <p className="mt-2 text-xs text-green-300 sm:text-sm">
                        <strong>Good news:</strong> Simply logging in will
                        automatically cancel this deletion request!
                      </p>
                      {deletionStatus.reason && (
                        <p className="mt-2 text-xs text-yellow-300 sm:text-sm">
                          <strong>Reason:</strong> {deletionStatus.reason}
                        </p>
                      )}
                      {deletionStatus.canCancel && (
                        <button
                          onClick={handleCancelDeletion}
                          className="mt-4 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-500"
                        >
                          Cancel Deletion Request
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Account Actions */}
              <div className="space-y-4 sm:space-y-6">
                {/* Temporarily Disable Account */}
                <div
                  className="cursor-pointer rounded-lg border border-neutral-600 bg-neutral-700/50 p-4 transition-all hover:border-neutral-500 hover:bg-neutral-700/70 sm:p-6"
                  onClick={() => setShowDisableModal(true)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-white sm:text-lg">
                        Temporarily Disable Account
                      </h3>
                      <p className="mt-1 text-sm text-gray-400 sm:text-base">
                        Temporarily disable your account. You can reactivate it
                        anytime by logging back in.
                      </p>
                      <ul className="mt-3 space-y-2 text-xs text-gray-500 sm:text-sm">
                        <li className="flex items-start">
                          <span className="mr-2 mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400"></span>
                          Your profile will be hidden from other users
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2 mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400"></span>
                          Your challenges and content will remain but be
                          temporarily unavailable
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2 mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400"></span>
                          You can reactivate by logging in again
                        </li>
                      </ul>
                    </div>
                    <div className="ml-4 flex items-center">
                      <i className="fas fa-chevron-right text-gray-400"></i>
                    </div>
                  </div>
                </div>

                {/* Delete Account Permanently */}
                <div
                  className={`cursor-pointer rounded-lg border border-red-600/30 bg-red-900/20 p-4 transition-all hover:border-red-500/50 hover:bg-red-900/30 sm:p-6 ${
                    deletionStatus ? 'cursor-not-allowed opacity-50' : ''
                  }`}
                  onClick={() => !deletionStatus && setShowDeleteModal(true)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-red-400 sm:text-lg">
                        Delete Account Permanently
                      </h3>
                      <p className="mt-1 text-sm text-gray-400 sm:text-base">
                        Permanently delete your account and all associated data.
                        This action cannot be undone.
                      </p>
                      <ul className="mt-3 space-y-2 text-xs text-gray-500 sm:text-sm">
                        <li className="flex items-start">
                          <span className="mr-2 mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400"></span>
                          All your challenges will be transferred to CTFGuide
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2 mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400"></span>
                          Your profile, progress, and personal data will be
                          deleted
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2 mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400"></span>
                          This action cannot be reversed
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2 mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400"></span>
                          You have a 7-day grace period to cancel
                        </li>
                      </ul>
                    </div>
                    <div className="ml-4 flex items-center">
                      <i className="fas fa-chevron-right text-gray-400"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Modals */}
      {showDisableModal && DisableAccountModal}
      {showDeleteModal && DeleteAccountModal}
      <NotificationModal />
    </>
  );
}
