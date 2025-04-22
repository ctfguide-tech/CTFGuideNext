import React from 'react';

export default function ConfigureContainerModal({ open, onClose, container }) {
  if (!open || !container) return null;

  return (
    <div className="fixed  inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="bg-neutral-900 border-t-4 border-blue-500 shadow-lg w-full max-w-3xl mx-4 p-8 relative flex flex-col max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
 
        <h2 className="text-2xl font-bold text-white mb-6">Configure Container</h2>
        <div className="bg-yellow-900/70 border border-yellow-600 text-yellow-200 rounded p-3 mb-6 flex items-center gap-3">
          <i className="fa fa-exclamation-triangle text-yellow-400 text-xl"></i>
          <span className="font-semibold">Editing container configurations is not available yet. Please DM support for changes.</span>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-1">Subdomain</label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 text-white rounded"
              value={container.subdomain || ''}
              readOnly
              disabled
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Container Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 text-white rounded"
              value={container.containerName || ''}
              readOnly
              disabled
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Image Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 text-white rounded"
              value={container.imageName || ''}
              readOnly
              disabled
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Port</label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 text-white rounded"
              value={container.port || ''}
              readOnly
              disabled
            />
          </div>
          {/* Add more configuration fields here as needed */}
          <div>
            <label className="block text-gray-400 text-sm mb-1">Environment Variables</label>
            <textarea
              className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 text-white rounded"
              value={container.env ? JSON.stringify(container.env, null, 2) : ''}
              readOnly
              disabled
              rows={3}
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Command</label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 text-white rounded"
              value={container.command || ''}
              readOnly
              disabled
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-1">Created At</label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 text-white rounded"
              value={container.createdAt ? new Date(container.createdAt).toLocaleString() : ''}
              readOnly
              disabled
            />
          </div>
        </div>
        {/* You can add Save/Update actions here in the future */}
      </div>
    </div>
  );
}
