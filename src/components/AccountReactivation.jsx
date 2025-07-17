import React, { useState, useEffect } from 'react';
import request from '@/utils/request';

const AccountReactivation = ({
  email,
  accountType,
  password,
  deletionInfo,
  onReactivated,
  onCancel,
}) => {
  const [isReactivating, setIsReactivating] = useState(false);
  const [notification, setNotification] = useState(null);
  const [detectedAccountType, setDetectedAccountType] = useState(
    accountType || 'EMAIL'
  );

  // Detect account type on mount
  useEffect(() => {
    if (accountType) {
      setDetectedAccountType(accountType);
    }
  }, [accountType]);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Calculate deletion deadline
  const getDeletionInfo = () => {
    if (!deletionInfo?.scheduledFor) {
      return {
        hasDeadline: false,
        message: 'Your account deletion is pending.',
      };
    }

    try {
      const deadline = new Date(deletionInfo.scheduledFor);
      const now = new Date();
      const timeRemaining = deadline.getTime() - now.getTime();
      const daysRemaining = Math.max(
        0,
        Math.ceil(timeRemaining / (1000 * 60 * 60 * 24))
      );
      const hoursRemaining = Math.max(
        0,
        Math.ceil(timeRemaining / (1000 * 60 * 60))
      );

      if (timeRemaining > 0) {
        return {
          hasDeadline: true,
          deadline: deadline.toLocaleDateString(),
          daysRemaining,
          hoursRemaining,
          message: `You have ${daysRemaining} day(s) to save your account!`,
          urgency:
            daysRemaining <= 1 ? 'high' : daysRemaining <= 3 ? 'medium' : 'low',
        };
      } else {
        return {
          hasDeadline: false,
          message: 'Your deletion deadline has passed.',
        };
      }
    } catch (error) {
      return {
        hasDeadline: false,
        message: 'Your account deletion is pending.',
      };
    }
  };

  const deletionData = getDeletionInfo();

  const handleReactivation = async () => {
    setIsReactivating(true);
    try {
      // Validate that we have password for EMAIL accounts
      if (detectedAccountType === 'EMAIL' && !password) {
        throw new Error(
          'Password is required for email accounts. Please try logging in again.'
        );
      }

      const requestData = {
        email: email,
        accountType: detectedAccountType,
      };

      // Include password for EMAIL accounts
      if (detectedAccountType === 'EMAIL' && password) {
        requestData.password = password;
      }

      const response = await request(
        `${process.env.NEXT_PUBLIC_API_URL}/account/reactivate`,
        'POST',
        requestData
      );

      if (response.success) {
        const successMessage = deletionInfo
          ? 'Account saved successfully! Your deletion has been cancelled.'
          : 'Account reactivated successfully!';
        showNotification(successMessage, 'success');

        // Store the token securely
        if (response.token) {
          localStorage.setItem('token', response.token);
        }

        setTimeout(() => {
          onReactivated?.(response.token);
        }, 1500);
      } else {
        throw new Error(response.error || 'Failed to reactivate account');
      }
    } catch (error) {
      let errorMessage = error.message || 'Failed to reactivate account.';

      // Handle specific error cases
      if (errorMessage.includes('Password is required')) {
        errorMessage =
          'Password verification failed. Please go back and try logging in again.';
      } else if (errorMessage.includes('Invalid password')) {
        errorMessage =
          'The password you entered is incorrect. Please go back and try again.';
      }

      showNotification(errorMessage, 'error');
    } finally {
      setIsReactivating(false);
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
        <div className="relative max-w-md rounded-lg border border-neutral-700 bg-neutral-800 p-6 shadow-xl">
          <div className="flex items-center space-x-3">
            <i className={`${getIcon()} text-lg`}></i>
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

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-neutral-900 p-3">
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="mb-3">
            <div className="h-1 rounded-full bg-blue-500"></div>
          </div>

          {/* Main Card */}
          <div className="rounded-lg border border-neutral-700 bg-neutral-800 p-6 shadow-xl">
            {/* Title */}
            <div className="mb-6 text-center">
              <h1 className="mb-2 text-2xl font-bold text-white">
                {deletionInfo && deletionData.hasDeadline
                  ? 'Save Your Account from Permanent Deletion'
                  : deletionInfo
                  ? 'Account Deletion Request'
                  : 'Account Reactivation'}
              </h1>
              <p className="text-sm text-gray-400">
                {deletionInfo && deletionData.hasDeadline
                  ? `Login before ${deletionData.deadline} to prevent permanent deletion`
                  : deletionInfo
                  ? 'Your account deletion request is pending'
                  : 'Your account is temporarily suspended'}
              </p>
            </div>

            {/* Deletion Deadline Warning - Only show if account deletion is scheduled */}
            {deletionInfo && deletionData.hasDeadline && (
              <div
                className={`mb-4 rounded-lg border p-3 ${
                  deletionData.urgency === 'high'
                    ? 'border-red-500/30 bg-red-900/20'
                    : deletionData.urgency === 'medium'
                    ? 'border-yellow-500/30 bg-yellow-900/20'
                    : 'border-orange-500/30 bg-orange-900/20'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      deletionData.urgency === 'high'
                        ? 'bg-red-500'
                        : deletionData.urgency === 'medium'
                        ? 'bg-yellow-500'
                        : 'bg-orange-500'
                    }`}
                  >
                    <i className="fas fa-exclamation-triangle text-sm text-white"></i>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm font-medium ${
                        deletionData.urgency === 'high'
                          ? 'text-red-400'
                          : deletionData.urgency === 'medium'
                          ? 'text-yellow-400'
                          : 'text-orange-400'
                      }`}
                    >
                      Deleting in {deletionData.daysRemaining} day(s)
                    </p>
                    <p className="text-xs text-gray-300">
                      Scheduled: {deletionData.deadline}
                    </p>
                    {deletionData.daysRemaining <= 3 && (
                      <p className="mt-1 text-xs text-gray-400">
                        {deletionData.daysRemaining}d,{' '}
                        {deletionData.hoursRemaining % 24}h remaining
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Account Info */}
            <div className="mb-4 rounded-lg border border-neutral-600 bg-neutral-700 p-3">
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500">
                  {detectedAccountType === 'GOOGLE' ? (
                    <i className="fab fa-google text-sm text-white"></i>
                  ) : (
                    <i className="fas fa-user text-sm text-white"></i>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-white">{email}</p>
                  <p className="text-xs text-gray-400">
                    {detectedAccountType === 'GOOGLE'
                      ? 'Google Account'
                      : 'Email Account'}
                  </p>
                </div>
                <div className="text-orange-400">
                  <i className="fas fa-pause-circle text-sm"></i>
                </div>
              </div>
            </div>

            {/* Info Cards */}
            <div className="mb-5 space-y-3">
              <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-3">
                <h3 className="mb-1 text-sm font-medium text-orange-400">
                  What happened?
                </h3>
                <p className="text-xs leading-relaxed text-gray-300">
                  {deletionInfo
                    ? 'You requested account deletion and your account has been suspended for 7 days as a safety measure.'
                    : 'Your account has been temporarily suspended but can be reactivated instantly.'}
                </p>
              </div>

              <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-3">
                <h3 className="mb-1 text-sm font-medium text-green-400">
                  {deletionInfo ? 'Your content is still safe!' : 'Good news!'}
                </h3>
                <p className="text-xs leading-relaxed text-gray-300">
                  {deletionInfo
                    ? 'All your challenges, comments, and progress remain visible and intact during this 7-day period. Nothing is transferred to the system account until the deadline passes.'
                    : 'All your data is safe and will be restored immediately upon reactivation.'}
                </p>
              </div>
            </div>

            {/* Ready to Reactivate Notice */}
            <div className="mb-5 rounded-lg border border-blue-500/20 bg-blue-500/5 p-3">
              <div className="flex items-center space-x-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500">
                  <i className="fas fa-check text-sm text-white"></i>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-400">
                    {deletionInfo
                      ? 'Ready to Cancel Deletion'
                      : 'Ready to Reactivate'}
                  </p>
                  <p className="text-xs text-blue-200">
                    {deletionInfo
                      ? 'Click below to immediately cancel your deletion request'
                      : "You're already authenticated - just click the button below"}
                  </p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleReactivation}
                disabled={isReactivating}
                className={`w-full rounded-lg px-4 py-3 font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                  deletionInfo
                    ? 'bg-green-600 hover:bg-green-500'
                    : 'bg-blue-600 hover:bg-blue-500'
                }`}
              >
                {isReactivating ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    {deletionInfo
                      ? 'Cancelling Deletion...'
                      : 'Reactivating...'}
                  </>
                ) : (
                  <>
                    <i
                      className={`${
                        deletionInfo
                          ? 'fas fa-shield-alt'
                          : 'fas fa-play-circle'
                      } mr-2`}
                    ></i>
                    {deletionInfo
                      ? 'Cancel Deletion & Keep My Account'
                      : 'Reactivate Account'}
                  </>
                )}
              </button>

              <button
                onClick={onCancel}
                className="w-full rounded-lg border border-neutral-600 bg-neutral-700 px-4 py-3 font-medium text-white transition-colors hover:bg-neutral-600"
              >
                Back to Login
              </button>
            </div>

            {/* Footer */}
            <div className="mt-5 text-center">
              <p className="text-xs text-gray-500">
                Need help?{' '}
                <a
                  href="mailto:support@ctfguide.com"
                  className="text-blue-400 transition-colors hover:text-blue-300"
                >
                  support@ctfguide.com
                </a>
              </p>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-600">© CTFGuide Corporation 2025</p>
          </div>
        </div>
      </div>

      <NotificationModal />
    </>
  );
};

export default AccountReactivation;
