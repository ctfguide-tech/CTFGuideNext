import { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import request from '@/utils/request';
import { ExclamationCircleIcon } from '@heroicons/react/20/solid';

export default function ReportForm() {
  const [formData, setFormData] = useState({
    type: 'USER',
    message: '',
    userId: '',
    challengeId: '',
    url: '',
    severity: 'LOW',
    featureType: 'ENHANCEMENT'
  });
  const [status, setStatus] = useState({ show: false, isError: false, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reportTypes = [
    { 
      id: 'USER', 
      label: 'User Report',
      description: 'Report a user for suspicious or inappropriate behavior',
      fields: [
        { name: 'userId', label: 'User ID or Username', type: 'text', required: true },
        { name: 'message', label: 'What did this user do?', type: 'textarea', required: true }
      ]
    },
    { 
      id: 'CHALLENGE', 
      label: 'Challenge Issue',
      description: 'Report issues with challenges, including incorrect flags or broken environments',
      fields: [
        { name: 'challengeId', label: 'Challenge ID', type: 'text', required: true },
        { name: 'message', label: 'What is wrong with this challenge?', type: 'textarea', required: true }
      ]
    },
    { 
      id: 'BUG', 
      label: 'Bug Report',
      description: 'Report technical issues or bugs on the platform',
      fields: [
        { name: 'url', label: 'Where did you find this bug?', type: 'text', required: true },
        { name: 'severity', label: 'Severity', type: 'select', required: true,
          options: [
            { value: 'LOW', label: 'Low - Minor inconvenience' },
            { value: 'MEDIUM', label: 'Medium - Affects functionality' },
            { value: 'HIGH', label: 'High - Critical issue' }
          ]
        },
        { name: 'message', label: 'Describe the bug and steps to reproduce', type: 'textarea', required: true }
      ]
    },
    { 
      id: 'FEATURE', 
      label: 'Feature Request',
      description: 'Suggest new features or improvements',
      fields: [
        { name: 'featureType', label: 'Type of Feature', type: 'select', required: true,
          options: [
            { value: 'ENHANCEMENT', label: 'Enhancement to existing feature' },
            { value: 'NEW', label: 'New feature' },
            { value: 'INTEGRATION', label: 'Third-party integration' }
          ]
        },
        { name: 'message', label: 'Describe your feature request', type: 'textarea', required: true }
      ]
    }
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const currentType = reportTypes.find(type => type.id === formData.type);
      
      const payload = Object.entries(formData).reduce((acc, [key, value]) => {
        if (value && (
          key === 'type' || 
          key === 'message' || 
          currentType.fields.some(field => field.name === key)
        )) {
          acc[key] = value;
        }
        return acc;
      }, {});

      const url = `${process.env.NEXT_PUBLIC_API_URL}/report`;
      const response = await request(url, 'POST', payload);

      if (response?.error) throw new Error(response.error);

      setStatus({
        show: true,
        isError: false,
        message: 'Thank you! Your report has been submitted successfully.'
      });
      
      setFormData(prev => ({ 
        ...prev, 
        message: '', 
        userId: '', 
        challengeId: '', 
        url: '' 
      }));
    } catch (error) {
      setStatus({
        show: true,
        isError: true,
        message: 'Failed to submit report. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setStatus(prev => ({ ...prev, show: false })), 4000);
    }
  };

  const currentReportType = reportTypes.find(type => type.id === formData.type);

  return (
    <div className="min-h-screen">
      <Head>
        <title>Report an Issue - CTFGuide</title>
      </Head>

      <div className="px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Submit a Report
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Help us improve by reporting issues, bugs, or suspicious activity
          </p>
        </div>

        {/* Main Form */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column - Report Type Selection */}
          <div className="bg-[#212121] p-6 rounded-lg">
            <h3 className="text-lg font-medium text-white mb-4">Report Type</h3>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ 
                ...formData, 
                type: e.target.value,
                message: '',
                userId: '',
                challengeId: '',
                url: '',
                severity: 'LOW',
                featureType: 'ENHANCEMENT'
              })}
              className="w-full rounded bg-[#2a2a2a] border-none px-3 py-2 text-white focus:ring-2 focus:ring-blue-500"
            >
              {reportTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>

            {/* Type Description */}
            <div className="mt-4 p-4 bg-[#2a2a2a] rounded-lg">
              <p className="text-sm text-gray-400 mb-4">
                {currentReportType.description}
              </p>
              <h4 className="text-sm font-medium text-gray-200 mb-2">
                What to include:
              </h4>
              <ul className="text-sm text-gray-400 list-disc list-inside">
                {formData.type === 'CHALLENGE' && (
                  <>
                    <li>Challenge ID</li>
                    <li>Challenge Name</li>
                    <li>Issue Description</li>
                  </>
                )}
                {formData.type === 'USER' && (
                  <>
                    <li>User ID</li>
                    <li>Username</li>
                    <li>Issue Description</li>
                  </>
                )}
                {formData.type === 'BUG' && (
                  <>
                    <li>Steps to reproduce</li>
                    <li>Expected behavior</li>
                    <li>Actual behavior</li>
                    <li>Screenshots (if applicable)</li>
                  </>
                )}
                {formData.type === 'FEATURE' && (
                  <>
                    <li>Clear description of the feature</li>
                    <li>Use cases</li>
                    <li>Potential benefits</li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {/* Right Column - Dynamic Form Fields */}
          <div className="lg:col-span-2">
            <div className="bg-[#212121] rounded-lg p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {currentReportType.fields.map(field => (
                  <div key={field.name} className="space-y-1">
                    <label className="block text-sm font-medium text-gray-200">
                      {field.label}
                    </label>
                    {field.type === 'select' ? (
                      <select
                        value={formData[field.name]}
                        onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                        className="w-full rounded bg-[#2a2a2a] border-none px-3 py-2 text-white focus:ring-2 focus:ring-blue-500"
                        required={field.required}
                      >
                        {field.options?.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : field.type === 'textarea' ? (
                      <textarea
                        value={formData[field.name]}
                        onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                        className="w-full rounded bg-[#2a2a2a] border-none px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                        required={field.required}
                        placeholder={`Enter ${field.label.toLowerCase()}...`}
                      />
                    ) : (
                      <input
                        type="text"
                        value={formData[field.name]}
                        onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                        className="w-full rounded bg-[#2a2a2a] border-none px-3 py-2 text-white focus:ring-2 focus:ring-blue-500"
                        required={field.required}
                        placeholder={`Enter ${field.label.toLowerCase()}...`}
                      />
                    )}
                  </div>
                ))}

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Report'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Status Notification */}
      {status.show && (
        <motion.div
          className={`fixed bottom-6 right-6 rounded-md p-4 ${
            status.isError ? 'bg-red-500' : 'bg-green-500'
          }`}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
        >
          <div className="flex items-center">
            <span className="text-white">{status.message}</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}