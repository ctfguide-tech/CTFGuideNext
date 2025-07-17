import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import request from '@/utils/request';
import { MarkdownViewer } from '../MarkdownViewer';
import { getFileName } from '@/utils/file-api';

const ViewChallenge = ({ open, setOpen, selected }) => {
  const [challenge, setChallenge] = useState({
    title: 'Loading...',
    content: 'Loading...',
    solution: 'Loading...',
    difficulty: 'Loading...',
    snote: 'No previous notes',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [moderatorNotes, setModeratorNotes] = useState('');
  const [basePoints, setBasePoints] = useState(0);

  useEffect(() => {
    const fetchChallengeData = async () => {
      try {
        const response = await request(
          `${process.env.NEXT_PUBLIC_API_URL}/challenges/${selected}`,
          'GET'
        );
        console.log('run');
        console.log(response);
        setChallenge(response.body);
        setModeratorNotes(response.body.snote || '');
        setBasePoints(response.body.basePoints || 0);
        //fetch stupid file info for each fileId, thanks stephen for the helper function
        if (response.body.fileIds && response.body.fileIds.length > 0) {
          const filePromises = response.body.fileIds.map(async (fileId) => {
            const fileName = await getFileName(fileId);
            return {
              id: fileId,
              name: fileName,
              url: `${process.env.NEXT_PUBLIC_TERM_URL}files/get?fileID=${fileId}`,
            };
          });
          const fileInfo = await Promise.all(filePromises);
          setFiles(fileInfo);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (selected) {
      fetchChallengeData();
    }
  }, [selected]);

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      const response = await request(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/challenges/${selected}/approve`,
        'POST',
        { bonusPoints: basePoints }
      );

      if (response && response.success) {
        alert('Challenge approved successfully!');
        setOpen(false);
        // Optionally refresh the challenges list
        window.location.reload();
      } else {
        alert('Failed to approve challenge!');
      }
    } catch (error) {
      console.error('Error approving challenge:', error);
      alert('Failed to approve challenge!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestChanges = async () => {
    if (!moderatorNotes.trim()) {
      alert('Please provide a reason in the moderator notes.');
      return;
    }

    try {
      const response = await request(
        `${process.env.NEXT_PUBLIC_API_URL}/challenges/${selected}/deny`,
        'POST',
        { reason: moderatorNotes }
      );

      if (response && response.success) {
        alert('Changes requested successfully!');
        setOpen(false);
        // Optionally refresh the challenges list
        window.location.reload();
      } else {
        alert('Failed to request changes!');
      }
    } catch (error) {
      console.error('Error requesting changes:', error);
      alert('Failed to request changes!');
    }
  };

  const handleEditChallenge = () => {
    window.open(`/create/edit?id=${selected}`, '_blank');
  };

  const handleGoToChallenge = () => {
    window.open(`/challenges/${selected}`, '_blank');
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog className="relative z-50" onClose={setOpen}>
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center overflow-y-auto p-2 sm:p-6">
          <Transition.Child
            as={Fragment}
            enter="transform transition ease-in-out duration-200"
            enterFrom="scale-95 opacity-0"
            enterTo="scale-100 opacity-100"
            leave="transform transition ease-in-out duration-200"
            leaveFrom="scale-100 opacity-100"
            leaveTo="scale-95 opacity-0"
          >
            <Dialog.Panel className="relative flex w-full max-w-2xl flex-col rounded border border-neutral-800 bg-neutral-900 shadow-xl sm:max-h-[90vh]">
              {/* Sticky Close Button */}
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-800 bg-neutral-900 px-4 py-3">
                <Dialog.Title className="text-base text-xl font-semibold leading-6 text-white">
                  {challenge.title || 'Loading...'}
                </Dialog.Title>
                <button
                  type="button"
                  className="text-neutral-400 hover:text-white focus:outline-none focus:ring-2"
                  onClick={() => setOpen(false)}
                >
                  <span className="sr-only">Close panel</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto px-4 py-4 text-white sm:px-6">
                <div className="mb-4 w-full gap-x-4 bg-neutral-800 p-3">
                  <p>
                    {' '}
                    <i className="fas fa-exclamation-triangle"></i> Don't forget
                    to make sure the challenge is including an explanation.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-y-8 sm:grid-cols-3">
                  <div className="sm:col-span-3">
                    <h1 className="mb-1 font-bold text-blue-600">
                      Description
                    </h1>
                    <MarkdownViewer
                      className="bg-neutral-800 p-3"
                      content={challenge && challenge.content}
                    />
                  </div>
                  <div>
                    <h1 className="mb-1 font-bold text-blue-600">Flag</h1>
                    <p>
                      {(challenge &&
                        challenge.solution &&
                        challenge.solution.keyword) ||
                        'N/A'}
                    </p>
                  </div>
                  <div>
                    <h1 className="mb-1 font-bold text-blue-600">Difficulty</h1>
                    <p>{challenge && challenge.difficulty}</p>
                  </div>
                  <div>
                    <h1 className="mb-1 font-bold text-blue-600">Creator</h1>
                    <p className="text-blue-200">
                      <a href={'/users/' + (challenge && challenge.creator)}>
                        {challenge && challenge.creator}{' '}
                        <i className="fas fa-external-link-square-alt"></i>
                      </a>
                    </p>
                  </div>
                  <div>
                    <h1 className="mb-1 font-bold text-blue-600">Category</h1>
                    <p>{challenge && challenge.category && challenge.category.join(", ")}</p>
                  </div>
                  <div>
                    <h1 className="mb-1 font-bold text-blue-600">
                      Date of Creation
                    </h1>
                    <p>
                      {challenge &&
                        new Date(challenge.createdAt).toLocaleString([], {
                          hour: 'numeric',
                          minute: 'numeric',
                          hour12: true,
                          month: 'short',
                          day: 'numeric',
                        })}
                    </p>
                  </div>
                  <div>
                    <h1 className="mb-1 font-bold text-blue-600">
                      Last Updated
                    </h1>
                    <p>
                      {challenge &&
                        new Date(challenge.updatedAt).toLocaleString([], {
                          hour: 'numeric',
                          minute: 'numeric',
                          hour12: true,
                          month: 'short',
                          day: 'numeric',
                        })}
                    </p>
                  </div>
                  <div className="sm:col-span-3">
                    <h1 className="mb-1 font-bold text-blue-600">
                      Environment Container Configuration
                    </h1>
                    <textarea
                      value={challenge && challenge.commands}
                      readOnly
                      className="mt-2 w-full border-none bg-black text-white"
                    ></textarea>
                    <h1 className="mb-1 mt-4 font-bold text-blue-600">
                      Uploaded Files
                    </h1>
                    <div className="mt-2">
                      {files && files.length > 0 ? (
                        files.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between border-b border-neutral-600 p-2"
                          >
                            <span className="text-white">{file.name}</span>
                            <a
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-700"
                            >
                              Download
                            </a>
                          </div>
                        ))
                      ) : (
                        <p className="text-neutral-400">No files uploaded</p>
                      )}
                    </div>
                    <h1 className="mb-1 mt-4 font-bold text-blue-600">
                      Moderator Notes
                    </h1>
                    <textarea
                      placeholder="Challenge creators can see these notes if you request changes!"
                      className="w-full border-neutral-700 bg-neutral-800"
                      value={moderatorNotes}
                      onChange={(e) => setModeratorNotes(e.target.value)}
                    />
                    <br />
                    <br />
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <div>
                        <h1 className="mb-1 font-bold text-blue-600">
                          Set Base Points
                        </h1>
                      </div>
                      <div className="sm:ml-auto">
                        <p className="mb-2 text-sm font-bold">
                          <i className="fas fa-info-circle"></i>{' '}
                          <span className="text-blue-200">Beginner: 100</span>,
                          <span className="text-green-200"> Easy: 200</span>,
                          <span className="text-yellow-200"> Medium: 300</span>,
                          <span className="text-red-200"> Hard: 400</span>,
                          <span className="text-indigo-200"> Insane: 500</span>
                        </p>
                      </div>
                    </div>
                    <input
                      type="number"
                      placeholder="0"
                      className="w-full border-neutral-700 bg-neutral-800"
                      value={basePoints}
                      onChange={(e) =>
                        setBasePoints(parseInt(e.target.value) || 0)
                      }
                    />
                  </div>
                </div>
              </div>
              {/* Modal Footer Buttons */}
              <div className="flex flex-col justify-end gap-2 border-t border-neutral-800 bg-neutral-900 px-4 py-4 sm:flex-row">
                <button
                  type="button"
                  className="w-full px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400 sm:w-auto"
                  onClick={() => setOpen(false)}
                >
                  <XMarkIcon
                    className="mr-2 inline h-5 w-5"
                    aria-hidden="true"
                  />
                  Cancel
                </button>
                <button
                  className="w-full bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 sm:w-auto"
                  onClick={handleGoToChallenge}
                >
                  <i className="fas fa-external-link-alt mr-2"></i>
                  Go to Challenge Page
                </button>
                <button
                  className="w-full bg-blue-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 sm:w-auto"
                  onClick={handleEditChallenge}
                >
                  <i className="fas fa-edit mr-2"></i>
                  Edit Challenge
                </button>
                <button
                  className="w-full bg-yellow-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-yellow-500 sm:w-auto"
                  onClick={handleRequestChanges}
                >
                  <i className="fas fa-exclamation-triangle mr-2"></i>
                  Request Changes
                </button>
                <button
                  className="w-full bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:w-auto"
                  onClick={handleApprove}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <svg
                      className="h-5 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <>
                      <i className="fas fa-check mr-2"></i>
                      Approve
                    </>
                  )}
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default ViewChallenge;
