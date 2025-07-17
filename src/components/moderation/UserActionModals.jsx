import React from 'react';

const UserActionModals = ({
  // Suspend modal props
  showSuspendModal,
  setShowSuspendModal,
  suspendForm,
  setSuspendForm,
  submitSuspension,

  // Role modal props
  showRoleModal,
  setShowRoleModal,
  roleForm,
  setRoleForm,
  submitRoleChange,

  // Common props
  selectedUserForAction,
}) => {
  return (
    <>
      {/* Suspend Modal */}
      {showSuspendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md border border-neutral-700 bg-neutral-800 p-6">
            <h3 className="mb-4 text-lg font-medium text-white">
              Suspend User
            </h3>
            <p className="mb-4 text-neutral-300">
              Suspending user:{' '}
              <span className="font-medium">
                {selectedUserForAction?.username}
              </span>
            </p>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-300">
                  Reason for Suspension
                </label>
                <textarea
                  value={suspendForm.reason}
                  onChange={(e) =>
                    setSuspendForm({ ...suspendForm, reason: e.target.value })
                  }
                  className="h-24 w-full resize-none border border-neutral-600 bg-neutral-700 p-3 text-white focus:border-blue-500 focus:outline-none"
                  placeholder="Enter detailed reason for suspension..."
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-300">
                  Duration (hours)
                </label>
                <input
                  type="number"
                  value={suspendForm.duration}
                  onChange={(e) =>
                    setSuspendForm({ ...suspendForm, duration: e.target.value })
                  }
                  className="w-full border border-neutral-600 bg-neutral-700 p-3 text-white focus:border-blue-500 focus:outline-none"
                  placeholder="Leave empty for indefinite suspension"
                  min="1"
                />
                <p className="mt-1 text-xs text-neutral-400">
                  Leave empty for permanent suspension
                </p>
              </div>
            </div>

            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => setShowSuspendModal(false)}
                className="flex-1 bg-neutral-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-neutral-500"
              >
                Cancel
              </button>
              <button
                onClick={submitSuspension}
                className="flex-1 bg-red-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-red-500"
              >
                Suspend User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role Change Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md border border-neutral-700 bg-neutral-800 p-6">
            <h3 className="mb-4 text-lg font-medium text-white">
              Change User Role
            </h3>
            <p className="mb-4 text-neutral-300">
              Changing role for:{' '}
              <span className="font-medium">
                {selectedUserForAction?.username}
              </span>
            </p>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-300">
                  Select New Role
                </label>
                <select
                  value={roleForm.role}
                  onChange={(e) =>
                    setRoleForm({ ...roleForm, role: e.target.value })
                  }
                  className="w-full border border-neutral-600 bg-neutral-700 p-3 text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="USER">User (Standard Account)</option>
                  <option value="PRO">Pro (Premium Features)</option>
                  <option value="ADMIN">Admin (Full Access)</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => setShowRoleModal(false)}
                className="flex-1 bg-neutral-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-neutral-500"
              >
                Cancel
              </button>
              <button
                onClick={submitRoleChange}
                className="flex-1 bg-blue-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-500"
              >
                Update Role
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserActionModals;
