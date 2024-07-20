import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import request from '@/utils/request';

const ViewChallenge = ({ open, setOpen, selected }) => {

    const [challenge, setChallenge] = useState({
        "title": "Loading...",
        "content": "Loading...",
        "solution": "Loading...",
        "difficulty": "Loading..."
    });

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchChallengeData = async () => {
          try {
            const response = await request(`${process.env.NEXT_PUBLIC_API_URL}/challenges/${selected}`, "GET");
            console.log("run");
            console.log(response);
            setChallenge(response.body);
          } catch (error) {
            console.error(error);
          }
        };
      
        fetchChallengeData();
      }, [selected]);

  return (

    <Transition.Root show={open} as={Fragment}>
      <Dialog className="relative z-10" onClose={setOpen}>
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-100 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-100 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
               
                <Dialog.Panel className="pointer-events-auto w-screen max-w-xl">
                  <div className="flex h-full flex-col divide-y divide-neutral-800 bg-neutral-900 border-l-2 border-neutral-800 shadow-xl">
                    <div className="flex min-h-0 flex-1 flex-col overflow-y-scroll py-6">
                      <div className="px-4 sm:px-6">
                        <div className="flex items-start justify-between">
                        { challenge && <Dialog.Title className="text-base font-semibold leading-6 text-xl text-white">
  { challenge.title || "Loading..." }
</Dialog.Title> }
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="relative rounded-md  text-neutral-400  focus:outline-none focus:ring-2 "
                              onClick={() => setOpen(false)}
                            >
                              <span className="absolute -inset-2.5" />
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className=" mt-6  px-4 sm:px-6 text-white">


                            <div className='grid grid-cols-3 gap-y-8'>
                        <div className='col-span-3'> 
                        <h1 className='font-bold text-blue-600 mb-1'>Description</h1> 
                        <p>{challenge && challenge.content}</p>
                        </div>
                        <div>
                        <h1 className='font-bold text-blue-600 mb-1'>Flag</h1>
                        <p>{challenge && challenge.solution || "N/A"}</p>
                        </div>
                        <div>
                        <h1 className='font-bold text-blue-600 mb-1'>Difficulty</h1> 
                        <p>{challenge && challenge.difficulty}</p>
                        </div>

                        <div>
                        <h1 className='font-bold text-blue-600 mb-1'>Creator</h1> 
                        <p className='text-blue-200'><a href={"/users/" + (challenge && challenge.creator)}>{challenge && challenge.creator} <i className="fas fa-external-link-square-alt"></i></a></p></div>


                                             
                        <div>
                       <h1 className='font-bold text-blue-600 mb-1'>Category</h1> 
                        <p>{challenge && challenge.category}</p>
                        
                        </div> 

                        <div>
                       <h1 className='font-bold text-blue-600 mb-1'>Date of Creation</h1> 
                        <p>{challenge && new Date(challenge.createdAt).toLocaleString([], { hour: 'numeric', minute: 'numeric', hour12: true, month: 'short', day: 'numeric' })}</p>
                        
                        </div>

                        <div>
                       <h1 className='font-bold text-blue-600 mb-1'>Last Updated</h1> 
                        <p>{challenge && new Date(challenge.updatedAt).toLocaleString([], { hour: 'numeric', minute: 'numeric', hour12: true, month: 'short', day: 'numeric' })}</p>
                        
                        </div>
                        <div className='col-span-3'>
                     
                     <h1 className='font-bold text-blue-600 mb-1'>Moderator Notes</h1> 
      
      <textarea placeholder="Challenge creators can see these notes if you request changes!" className='bg-neutral-800 w-full border-neutral-700'>
      
      </textarea>
      

      <br></br><br></br>
      <h1 className='font-bold text-blue-600 mb-1'>Set Bonus Points</h1> 
      <input type="number" placeholder="0" className='bg-neutral-800 w-full border-neutral-700' />

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
                        type="submit"
                        className="ml-4 inline-flex justify-center rounded-md bg-yellow-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500"
                      >
                        Request Changes
                      </button>
                      <button
                      onClick={async () => {
                        setIsLoading(true);
                        const basePoints = document.querySelector('input[type="number"]').value;
                        console.log(basePoints)
                        try {
                          await request(`${process.env.NEXT_PUBLIC_API_URL}/challenges/${selected}/approve`, "POST", { basePoints: basePoints });
                        } catch (error) {
                          console.error(error);
                        } finally {
                          setIsLoading(false);
                        }
                      }}
                        type="submit"
                        className="ml-4 inline-flex justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
                      >
                        {isLoading ? (
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                          </svg>
                        ) : (
                          "Approve"
                        )}
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

export default ViewChallenge;