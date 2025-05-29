import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import request from '@/utils/request';
import { MarkdownViewer } from '../MarkdownViewer';
import { getFileName } from '@/utils/file-api';

const ViewChallenge = ({ open, setOpen, selected }) => {

    const [challenge, setChallenge] = useState({
        "title": "Loading...",
        "content": "Loading...",
        "solution": "Loading...",
        "difficulty": "Loading...",
        "snote": "No previous notes"
    });

    const [isLoading, setIsLoading] = useState(false);
    const [files, setFiles] = useState([]);

    useEffect(() => {
        const fetchChallengeData = async () => {
          try {
            const response = await request(`${process.env.NEXT_PUBLIC_API_URL}/challenges/${selected}`, "GET");
            console.log("run");
            console.log(response);
            setChallenge(response.body);
            
            //fetch stupid file info for each fileId, thanks stephen for the helper function
            if (response.body.fileIds && response.body.fileIds.length > 0) {
              const filePromises = response.body.fileIds.map(async (fileId) => {
                const fileName = await getFileName(fileId);
                return {
                  id: fileId,
                  name: fileName,
                  url: `${process.env.NEXT_PUBLIC_TERM_URL}files/get?fileID=${fileId}`
                };
              });
              const fileInfo = await Promise.all(filePromises);
              setFiles(fileInfo);
            }
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
               
                <Dialog.Panel className="pointer-events-auto w-screen max-w-6xl">
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

                        <div className='bg-neutral-800 p-3  gap-x-4 w-full'>

                            <p> <i className="fas fa-exclamation-triangle"></i> Don't forget to make sure the challenge is including an explanation.</p>
                   
                        </div>                          
                          <br></br>
                            <div className='grid grid-cols-3 gap-y-8'>
                        <div className='col-span-3'> 
                        <h1 className='font-bold text-blue-600 mb-1'>Description</h1> 

                        <MarkdownViewer className='bg-neutral-800 p-3 rounded-md' content={challenge && challenge.content} />
                        </div>
                        <div>
                        <h1 className='font-bold text-blue-600 mb-1'>Flag</h1>
                        <p>{challenge && challenge.solution && challenge.solution.keyword || "N/A"}</p>
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
                        <h1 className='font-bold text-blue-600 mb-1'>Environment Container Configuration</h1>
                        <textarea
                          value={challenge && challenge.commands}
                          readOnly
                          className="mt-2 w-full border-none bg-black text-white"
                        ></textarea>

                        <h1 className='font-bold text-blue-600 mb-1 mt-4'>Uploaded Files</h1>
                        <div className="mt-2">
                          {files && files.length > 0 ? (
                            files.map((file, index) => (
                              <div key={index} className="flex items-center justify-between p-2 border-b border-neutral-600">
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
                     
                     <h1 className='font-bold text-blue-600 mb-1 mt-4'>Moderator Notes</h1> 
      
      <textarea placeholder="Challenge creators can see these notes if you request changes!" className='bg-neutral-800 w-full border-neutral-700'>
      {challenge && challenge.snote}
      </textarea>
      
      <br></br><br></br>
      <div className='flex rounded-md'>
<div>      <h1 className='font-bold text-blue-600 mb-1'>Set Base Points</h1> 
</div>
      <div className='ml-auto'><p className='mb-2 text-sm font-bold'><i className="fas fa-info-circle"></i> <span className='text-blue-200'>Beginner: 100</span>,
        <span className='text-green-200'> Easy: 200</span>, 
        <span className='text-yellow-200'> Medium: 300</span>, 
        <span className='text-red-200'> Hard: 400</span>, 
        <span className='text-indigo-200'> Insane: 500</span>
      </p></div>
      </div>
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
                        <XMarkIcon className="h-5 w-5 inline mr-2" aria-hidden="true" />
                        Cancel
                      </button>
                      <button className='ml-4 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500' onClick={() => window.open(`../../challenges/${selected}`, '_blank')}>
                        <i className="fas fa-external-link-alt mr-2"></i>
                        Go to Challenge Page
                      </button>

                      <button className='ml-4 w-auto rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500' onClick={() => window.open(`../../create/edit?id=${selected}`, '_blank')}>
                        <i className="fas fa-edit mr-2"></i>
                        Edit Challenge
                      </button>
 
                      <button
                        onClick={async () => {
                          const reason = document.querySelector('textarea').value;
                          if (reason) {
                            try {
                              await request(`${process.env.NEXT_PUBLIC_API_URL}/challenges/${selected}/deny`, "POST", { reason });
                              alert("Challenge denied successfully!");
                            } catch (error) {
                              console.error(error);
                              alert("Failed to deny challenge!");
                            }
                          } else {
                            alert("Please provide a reason in the moderator notes.");
                          }
                        }}
                        type="button"
                        className="ml-4  justify-center rounded-md bg-yellow-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500"
                      >
                        <i className="fas fa-exclamation-triangle mr-2"></i>
                        Request Changes
                      </button>
                      <button
                      onClick={async () => {
                        setIsLoading(true);
                        const basePoints = document.querySelector('input[type="number"]').value;
                        console.log(basePoints)
                        try {
                          await request(`${process.env.NEXT_PUBLIC_API_URL}/challenges/${selected}/approve`, "POST", { basePoints: basePoints });
                          //reload
                          window.location.reload();
                        } catch (error) {
                          console.error(error);
                        } finally {
                          setIsLoading(false);
                        }
                      }}
                        type="submit"
                        className="ml-4  justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
                      >
                        {isLoading ? (
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                          </svg>
                        ) : (
                          <>
                            <i className="fas fa-check mr-2"></i>
                            Approve
                          </>
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