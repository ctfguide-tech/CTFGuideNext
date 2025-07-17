import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

export default function ViewReport({ open, setOpen, report }) {
  // Parse metadata if it exists and is a string
  const metadata = report?.metadata
    ? typeof report.metadata === 'string'
      ? JSON.parse(report.metadata)
      : report.metadata
    : {};

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-neutral-900 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden bg-neutral-900 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-2xl font-semibold leading-6 text-white"
                    >
                      Report Details
                    </Dialog.Title>
                    <div className="mt-4 text-left">
                      <div className="space-y-4 text-white">
                        <div>
                          <h4 className="font-semibold">Type:</h4>
                          <p>{report?.type}</p>
                        </div>

                        {metadata.reportedUserId && (
                          <div>
                            <h4 className="font-semibold">Reported User ID:</h4>

                            <a
                              href={`/users/${metadata.reportedUserId}`}
                              className="text-blue-400 hover:text-blue-300"
                              target="#blank"
                            >
                              {metadata.reportedUserId}
                            </a>
                          </div>
                        )}

                        {metadata.challengeId && (
                          <div>
                            <h4 className="font-semibold">Challenge ID:</h4>
                            <p>{metadata.challengeId}</p>
                          </div>
                        )}

                        {metadata.url && (
                          <div>
                            <h4 className="font-semibold">URL:</h4>
                            <p>{metadata.url}</p>
                          </div>
                        )}

                        {metadata.severity && (
                          <div>
                            <h4 className="font-semibold">Severity:</h4>
                            <p>
                              <span
                                className={`inline-flex items-center px-2 py-1 text-sm font-medium ${
                                  metadata.severity.toLowerCase() === 'critical'
                                    ? 'bg-red-500/15 text-red-700 dark:text-red-400'
                                    : metadata.severity.toLowerCase() === 'high'
                                    ? 'bg-orange-500/15 text-orange-700 dark:text-orange-400'
                                    : metadata.severity.toLowerCase() ===
                                      'medium'
                                    ? 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400'
                                    : 'bg-blue-500/15 text-blue-700 dark:text-blue-400' // For low severity
                                }`}
                              >
                                {metadata.severity}
                              </span>
                            </p>
                          </div>
                        )}

                        {metadata.featureType && (
                          <div>
                            <h4 className="font-semibold">Feature Type:</h4>
                            <p>{metadata.featureType}</p>
                          </div>
                        )}

                        <div>
                          <h4 className="font-semibold">Description:</h4>
                          <p className="whitespace-pre-wrap">{report?.desc}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold">Submitted:</h4>
                          <p>
                            {report?.createdAt &&
                              new Date(report.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center bg-neutral-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-neutral-700"
                    onClick={() => setOpen(false)}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
