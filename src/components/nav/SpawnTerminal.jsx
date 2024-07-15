import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

const SpawnTerminal = ({ open, setOpen }) => {

  let proMachines = ["Kali Linux (CTFGuide Pro)"];



  const [requiresUpgrade, setRequiresUpgrade] = useState(false);
  const [activeSub, setActiveSub] = useState("Ubuntu 22.10 LTS");

  function hasPermission(e) {

    // Also handle input change

    setActiveSub(e);

    if (proMachines.includes(e)) {
      setRequiresUpgrade(true)
    } else {
      setRequiresUpgrade(false);
    }

  }

  function deployMachine() {
    window.location.href = '/terminal';
   // setOpen(false);
  }

  return (

    <Transition.Root show={open} as={Fragment}>
      <Dialog className="relative z-10" onClose={setOpen}>
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col divide-y divide-neutral-800 bg-neutral-900 border-l-2 border-neutral-800 shadow-xl">
                    <div className="flex min-h-0 flex-1 flex-col overflow-y-scroll py-6">
                      <div className="px-4 sm:px-6">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="text-base font-semibold leading-6 text-xl text-white">
                            <i className="fas fa-terminal"></i> Launch a machine BETA
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="relative rounded-md bg-red-900 text-red-400 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                              onClick={() => setOpen(false)}
                            >
                              <span className="absolute -inset-2.5" />
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="relative mt-6 flex-1 px-4 sm:px-6 text-white">
                        <h1>Choose an operating system</h1>
                        <div>
                          <select
                            id="os"
                            name="os"
                            onChange={e => hasPermission(e.target.value)}
                            value={activeSub}
                            className="mt-2 block w-full bg-neutral-800 rounded-md py-1.5 pl-3 pr-10 text-white border-neutral-800 sm:text-sm sm:leading-6"
                            
                          >
                            <option>Ubuntu 22.10 LTS</option>
                          </select>
                        </div>


                        { 

                          requiresUpgrade && (
                            <div className='border-l-4 border-blue-600 px-4 py-3 bg-neutral-800 mt-4'>
                              <h1>You need CTFGuide Pro to use this operating system.</h1>
                              <button className='text-sm bg-blue-600 hover:bg-blue-500 px-2 py-1 mt-2 rounded-lg'>
                                Upgrade now for $5/month
                              </button>
                            </div>
                              )
                        }

                        <h1 className="mt-6">Container Interaction (coming soon)</h1>
                        <div className="mt-2 flex w-full mx-auto text-center gap-x-4 blur-sm">
                          <div className='border rounded-lg w-full py-4 cursor-pointer bg-neutral-600/50'>
                            <h1>WebVNC (Disabled)</h1>
                          </div>
                          <div className='border rounded-lg w-full py-4 cursor-pointer hover:bg-neutral-600/50'>
                            <h1>ShellInABox</h1>
                          </div>
                        </div>

                        <h1 className="mt-6">Import Files (coming soon)</h1>
                        <div className="mt-2 flex justify-center rounded-lg blur-sm border border-dashed border-white/25 px-6 py-10 bg-neutral-800">
                          <div className="text-center">
                            <i className="text-4xl text-neutral-200 fas fa-file-archive"></i>
                            <div className="mt-4 flex text-sm leading-6 text-gray-400">
                              <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer rounded-md bg-gray-900 font-semibold text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 hover:text-blue-500"
                              >
                                <span>Upload a file</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" disabled />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs leading-5 text-gray-400">.zip</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 justify-end px-4 py-4">
                      <button
                        type="button"
                        className="rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400"
                        onClick={() => setOpen(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="ml-4 inline-flex justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                        onClick={deployMachine}
                      >
                        Deploy machine
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default SpawnTerminal;