import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { BellIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function NotificationsModal({ open, setOpen, notifications }) {
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
          <div className="fixed inset-0 bg-neutral-900/75 transition-opacity" />
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-neutral-900 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md text-gray-400 hover:text-gray-300 focus:outline-none"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div>
                  <div className="mt-3 text-center sm:mt-0 sm:text-left">
                    <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-white mb-4">
                      All Notifications
                    </Dialog.Title>
                    <div className="mt-2 max-h-[60vh] overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification, index) => (
                          <div 
                            key={index}
                            className="mb-4 rounded-lg bg-neutral-800 p-4 hover:bg-neutral-700 transition-colors"
                          >
                            <div className="flex items-start">
                              <div className="flex-shrink-0">
                                <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                                  <BellIcon className="h-5 w-5 text-blue-500" />
                                </div>
                              </div>
                              <div className="ml-4 flex-1">
                                <p className="text-sm text-gray-200">{notification.message}</p>
                                <p className="text-xs text-gray-500 mt-2">{notification.receivedTime}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12">
                          <BellIcon className="mx-auto h-12 w-12 text-gray-500" />
                          <p className="mt-2 text-gray-500">No notifications to display</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
} 