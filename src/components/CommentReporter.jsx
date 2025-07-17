import React, { useState } from 'react';
import request from '@/utils/request';

const CommentReporter = ({ commentId, commentContent, challengeId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [notification, setNotification] = useState(null);

  const reportReasons = [
    { value: 'SPAM', label: 'Spam or unwanted commercial content' },
    { value: 'HARASSMENT', label: 'Harassment or bullying' },
    { value: 'INAPPROPRIATE', label: 'Inappropriate content' },
    { value: 'MISINFORMATION', label: 'False or misleading information' },
    { value: 'SPOILER', label: 'Contains spoilers or solution hints' },
    { value: 'OFF_TOPIC', label: 'Off-topic or irrelevant' },
    { value: 'OTHER', label: 'Other (please specify)' },
  ];

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSubmitReport = async () => {
    if (!selectedReason) {
      showNotification('Please select a reason for reporting', 'error');
      return;
    }

    if (selectedReason === 'OTHER' && !customReason.trim()) {
      showNotification('Please provide a custom reason', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const reportData = {
        type: 'COMMENT',
        desc:
          selectedReason === 'OTHER'
            ? customReason
            : reportReasons.find((r) => r.value === selectedReason)?.label,
        metadata: {
          commentId,
          challengeId,
          reason: selectedReason,
          commentContent: commentContent?.substring(0, 200) || '', // First 200 chars for context
        },
      };

      const response = await request(
        `${process.env.NEXT_PUBLIC_API_URL}/reports`,
        'POST',
        reportData
      );

      if (response.success) {
        showNotification(
          'Comment reported successfully. Thank you for helping keep our community safe.',
          'success'
        );
        setIsOpen(false);
        setSelectedReason('');
        setCustomReason('');
      } else {
        throw new Error(response.error || 'Failed to submit report');
      }
    } catch (error) {
      console.error('Error reporting comment:', error);
      showNotification(
        error.message || 'Failed to submit report. Please try again.',
        'error'
      );
    } finally {
      setIsSubmitting(false);
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
        <div className="relative max-w-md rounded-2xl border border-neutral-700 bg-neutral-800/95 p-6 shadow-2xl backdrop-blur-md">
          <div className="flex items-center space-x-3">
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

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-sm text-gray-400 transition-colors duration-200 hover:text-red-400"
        title="Report this comment"
      >
        <i className="fas fa-flag mr-1"></i>
        Report
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative w-full max-w-md rounded-2xl border border-neutral-700 bg-neutral-800 p-6 shadow-2xl backdrop-blur-md">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                Report Comment
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 transition-colors hover:text-white"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <p className="mb-4 text-sm text-gray-400">
              Help us keep the community safe by reporting inappropriate
              content.
            </p>

            <div className="mb-4 space-y-3">
              {reportReasons.map((reason) => (
                <label
                  key={reason.value}
                  className="flex cursor-pointer items-center"
                >
                  <input
                    type="radio"
                    name="reportReason"
                    value={reason.value}
                    checked={selectedReason === reason.value}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="border-neutral-600 bg-neutral-700 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-white">
                    {reason.label}
                  </span>
                </label>
              ))}
            </div>

            {selectedReason === 'OTHER' && (
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Please describe the issue..."
                className="mb-4 w-full rounded-lg border border-neutral-600 bg-neutral-700 px-3 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                rows="3"
              />
            )}

            <div className="flex space-x-3">
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 rounded-lg border border-neutral-600 bg-neutral-700 px-4 py-2 text-white transition-colors hover:bg-neutral-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReport}
                disabled={isSubmitting}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Submitting...
                  </>
                ) : (
                  'Submit Report'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <NotificationModal />
    </>
  );
};

export default CommentReporter;
