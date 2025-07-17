import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import request from '@/utils/request';

export default function ReportPage() {
  const [activeTab, setActiveTab] = useState('create');
  const [myReports, setMyReports] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Form data for creating reports
  const [formData, setFormData] = useState({
    type: 'USER',
    message: '',
    userId: '',
    challengeId: '',
    commentId: '',
    commentContent: '',
    reason: 'inappropriate',
    url: '',
    severity: 'LOW',
    featureType: 'ENHANCEMENT',
  });

  const reportTypes = [
    {
      id: 'USER',
      label: 'User Report',
      description: 'Report a user for suspicious or inappropriate behavior',
      icon: 'fas fa-user-slash',
      fields: [
        {
          name: 'userId',
          label: 'User ID or Username',
          type: 'text',
          required: true,
        },
        {
          name: 'message',
          label: 'What did this user do?',
          type: 'textarea',
          required: true,
        },
      ],
    },
    {
      id: 'CHALLENGE',
      label: 'Challenge Issue',
      description:
        'Report issues with challenges, including incorrect flags or broken environments',
      icon: 'fas fa-flag',
      fields: [
        {
          name: 'challengeId',
          label: 'Challenge ID',
          type: 'text',
          required: true,
        },
        {
          name: 'message',
          label: 'What is wrong with this challenge?',
          type: 'textarea',
          required: true,
        },
      ],
    },
    {
      id: 'COMMENT',
      label: 'Comment Report',
      description: 'Report inappropriate or spam comments',
      icon: 'fas fa-comment-slash',
      fields: [
        {
          name: 'commentId',
          label: 'Comment ID',
          type: 'text',
          required: true,
        },
        {
          name: 'reason',
          label: 'Reason',
          type: 'select',
          required: true,
          options: [
            { value: 'inappropriate', label: 'Inappropriate content' },
            { value: 'spam', label: 'Spam' },
            { value: 'harassment', label: 'Harassment' },
            { value: 'offensive', label: 'Offensive language' },
            { value: 'other', label: 'Other' },
          ],
        },
        {
          name: 'message',
          label: 'Additional details',
          type: 'textarea',
          required: true,
        },
      ],
    },
    {
      id: 'BUG',
      label: 'Bug Report',
      description: 'Report technical issues or bugs on the platform',
      icon: 'fas fa-bug',
      fields: [
        {
          name: 'url',
          label: 'Where did you find this bug?',
          type: 'text',
          required: true,
        },
        {
          name: 'severity',
          label: 'Severity',
          type: 'select',
          required: true,
          options: [
            { value: 'LOW', label: 'Low - Minor inconvenience' },
            { value: 'MEDIUM', label: 'Medium - Affects functionality' },
            { value: 'HIGH', label: 'High - Critical issue' },
          ],
        },
        {
          name: 'message',
          label: 'Describe the bug and steps to reproduce',
          type: 'textarea',
          required: true,
        },
      ],
    },
    {
      id: 'FEATURE',
      label: 'Feature Request',
      description: 'Suggest new features or improvements',
      icon: 'fas fa-lightbulb',
      fields: [
        {
          name: 'featureType',
          label: 'Type of Feature',
          type: 'select',
          required: true,
          options: [
            { value: 'ENHANCEMENT', label: 'Enhancement to existing feature' },
            { value: 'NEW', label: 'New feature' },
            { value: 'INTEGRATION', label: 'Third-party integration' },
          ],
        },
        {
          name: 'message',
          label: 'Describe your feature request',
          type: 'textarea',
          required: true,
        },
      ],
    },
  ];

  useEffect(() => {
    if (activeTab === 'my-reports') {
      fetchMyReports();
    }
  }, [activeTab]);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const fetchMyReports = async () => {
    try {
      setLoading(true);
      const response = await request(
        `${process.env.NEXT_PUBLIC_API_URL}/reports/my`,
        'GET'
      );

      if (Array.isArray(response)) {
        setMyReports(response);
      } else {
        setMyReports([]);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      setMyReports([]);
      showNotification('Failed to load your reports', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const currentType = reportTypes.find((type) => type.id === formData.type);

      // Validate required fields
      const requiredFields = currentType.fields.filter(
        (field) => field.required
      );
      for (const field of requiredFields) {
        if (!formData[field.name] || formData[field.name].trim() === '') {
          throw new Error(`${field.label} is required`);
        }
      }

      if (!formData.message || formData.message.trim() === '') {
        throw new Error('Message is required');
      }

      const payload = Object.entries(formData).reduce((acc, [key, value]) => {
        if (
          value &&
          (key === 'type' ||
            key === 'message' ||
            currentType.fields.some((field) => field.name === key))
        ) {
          acc[key] = value;
        }
        return acc;
      }, {});

      console.log('Submitting report with payload:', payload);

      const response = await request(
        `${process.env.NEXT_PUBLIC_API_URL}/report`,
        'POST',
        payload
      );

      console.log('Report submission response:', response);

      if (response?.error) {
        throw new Error(response.error);
      }

      if (!response?.success && !response?.message) {
        throw new Error('Unexpected response from server');
      }

      showNotification('Report submitted successfully!', 'success');

      // Reset form
      setFormData((prev) => ({
        ...prev,
        message: '',
        userId: '',
        challengeId: '',
        commentId: '',
        commentContent: '',
        url: '',
      }));
    } catch (error) {
      console.error('Error submitting report:', error);
      showNotification(error.message || 'Failed to submit report', 'error');
    } finally {
      setLoading(false);
    }
  };

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

  const currentReportType = reportTypes.find(
    (type) => type.id === formData.type
  );

  // Notification component
  const NotificationModal = () => {
    if (!notification) return null;

    const getIcon = () => {
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

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 duration-300 animate-in fade-in-0">
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setNotification(null)}
        />
        <div className="relative rounded-2xl border border-neutral-700 bg-neutral-800/95 p-8 shadow-2xl backdrop-blur-md">
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400">
              <i className={`${getIcon()} text-xl`}></i>
            </div>
            <div className="flex-1">
              <p className="text-lg font-medium text-white">
                {notification.message}
              </p>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-all duration-200 hover:bg-neutral-700/50 hover:text-white"
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
      <Head>
        <title>Submit a Report - CTFGuide</title>
        <meta
          name="description"
          content="Report issues, bugs, or inappropriate content on CTFGuide"
        />
        <style>
          @import
          url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
        </style>
      </Head>
      <div className="flex min-h-screen flex-col bg-neutral-900">
        <StandardNav />
        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="mb-4 text-3xl font-bold text-white">
                Submit a Report
              </h1>
              <p className="text-lg text-gray-400">
                Help us improve by reporting issues, bugs, or suspicious
                activity
              </p>
            </div>

            {/* Tab Navigation */}
            <div className="mb-8 flex justify-center">
              <div className="flex space-x-2 rounded-xl bg-neutral-800 p-2">
                <button
                  onClick={() => setActiveTab('create')}
                  className={`rounded-lg px-6 py-2 font-medium transition-all duration-200 ${
                    activeTab === 'create'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-neutral-700 hover:text-white'
                  }`}
                >
                  <i className="fas fa-plus mr-2"></i>
                  Create Report
                </button>
                <button
                  onClick={() => setActiveTab('my-reports')}
                  className={`rounded-lg px-6 py-2 font-medium transition-all duration-200 ${
                    activeTab === 'my-reports'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-neutral-700 hover:text-white'
                  }`}
                >
                  <i className="fas fa-list mr-2"></i>
                  My Reports
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'create' && (
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Report Type Selection */}
                <div className="rounded-xl border border-neutral-700 bg-neutral-800 p-6">
                  <h3 className="mb-6 text-lg font-semibold text-white">
                    Report Type
                  </h3>

                  <div className="space-y-3">
                    {reportTypes.map((type) => (
                      <div
                        key={type.id}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            type: type.id,
                            message: '',
                            userId: '',
                            challengeId: '',
                            commentId: '',
                            url: '',
                            severity: 'LOW',
                            featureType: 'ENHANCEMENT',
                            reason: 'inappropriate',
                          })
                        }
                        className={`cursor-pointer rounded-lg border p-4 transition-all duration-200 ${
                          formData.type === type.id
                            ? 'border-blue-600 bg-blue-600/10'
                            : 'border-neutral-600 bg-neutral-700/50 hover:border-neutral-500'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                              formData.type === type.id
                                ? 'bg-blue-600/20 text-blue-400'
                                : 'bg-neutral-600/50 text-gray-400'
                            }`}
                          >
                            <i className={`${type.icon} text-lg`}></i>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-white">
                              {type.label}
                            </h4>
                            <p className="text-sm text-gray-400">
                              {type.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Report Form */}
                <div className="lg:col-span-2">
                  <div className="rounded-xl border border-neutral-700 bg-neutral-800 p-8">
                    <div className="mb-6 flex items-center space-x-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400">
                        <i className={`${currentReportType.icon} text-xl`}></i>
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-white">
                          {currentReportType.label}
                        </h2>
                        <p className="text-gray-400">
                          {currentReportType.description}
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {currentReportType.fields.map((field) => (
                        <div key={field.name}>
                          <label className="mb-2 block text-sm font-medium text-gray-300">
                            {field.label}{' '}
                            {field.required && (
                              <span className="text-red-400">*</span>
                            )}
                          </label>

                          {field.type === 'select' ? (
                            <select
                              value={formData[field.name]}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  [field.name]: e.target.value,
                                })
                              }
                              className="w-full rounded-lg border border-neutral-600 bg-neutral-700 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                              required={field.required}
                            >
                              {field.options?.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          ) : field.type === 'textarea' ? (
                            <textarea
                              value={formData[field.name]}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  [field.name]: e.target.value,
                                })
                              }
                              className="w-full rounded-lg border border-neutral-600 bg-neutral-700 px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                              placeholder={`Enter ${field.label.toLowerCase()}...`}
                              rows={4}
                              required={field.required}
                            />
                          ) : (
                            <input
                              type="text"
                              value={formData[field.name]}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  [field.name]: e.target.value,
                                })
                              }
                              className="w-full rounded-lg border border-neutral-600 bg-neutral-700 px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                              placeholder={`Enter ${field.label.toLowerCase()}...`}
                              required={field.required}
                            />
                          )}
                        </div>
                      ))}

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors duration-200 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {loading ? 'Submitting...' : 'Submit Report'}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'my-reports' && (
              <div className="rounded-xl border border-neutral-700 bg-neutral-800">
                <div className="border-b border-neutral-700 p-6">
                  <h2 className="text-xl font-semibold text-white">
                    My Reports
                  </h2>
                  <p className="mt-2 text-gray-400">
                    Track the status of your submitted reports
                  </p>
                </div>

                <div className="p-6">
                  {loading ? (
                    <div className="py-8 text-center">
                      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                      <p className="mt-4 text-gray-400">
                        Loading your reports...
                      </p>
                    </div>
                  ) : myReports.length > 0 ? (
                    <div className="space-y-4">
                      {myReports.map((report) => (
                        <div
                          key={report.id}
                          className="rounded-lg border border-neutral-600 bg-neutral-700/50 p-6"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <span
                                  className={`inline-flex rounded-full border px-3 py-1 text-sm font-medium ${getStatusColor(
                                    report.status
                                  )}`}
                                >
                                  {report.status}
                                </span>
                                <span className="text-sm text-gray-400">
                                  {report.type} Report
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
                                        Comment ID: {report.metadata.commentId}
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
                                <div className="mt-3 rounded-lg bg-neutral-600/30 p-3">
                                  <p className="text-sm text-gray-300">
                                    <strong>Resolution:</strong>{' '}
                                    {report.resolution}
                                  </p>
                                </div>
                              )}
                            </div>

                            <div className="text-right text-sm text-gray-400">
                              <p>Submitted</p>
                              <p>
                                {new Date(
                                  report.createdAt
                                ).toLocaleDateString()}
                              </p>
                              {report.resolvedAt && (
                                <>
                                  <p className="mt-2">Resolved</p>
                                  <p>
                                    {new Date(
                                      report.resolvedAt
                                    ).toLocaleDateString()}
                                  </p>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-700">
                        <i className="fas fa-inbox text-2xl text-gray-400"></i>
                      </div>
                      <h3 className="text-lg font-medium text-white">
                        No reports yet
                      </h3>
                      <p className="mt-2 text-gray-400">
                        You haven't submitted any reports. Click "Create Report"
                        to submit your first report.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
        <Footer />
        

        {/* Notification Modal */}
        <NotificationModal />
      </div>
    </>
  );
}
