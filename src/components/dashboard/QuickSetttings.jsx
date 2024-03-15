import { useState, useEffect } from 'react';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import request from "@/utils/request";

export function QuickSettings() {
  const [open, setOpen] = useState(false); // AI banner
  useEffect(() => {
    // Markeitng CTFGuide AI
    if (!localStorage.getItem('marketing_ctfguideai')) {
      setOpen(true);
      localStorage.setItem('marketing_ctfguideai', true);
    }
    try {
      request(`${process.env.NEXT_PUBLIC_API_URL}/account`, "GET", null)
        .then((data) => {
          if(document.getElementById('bio')) {
            document.getElementById('bio').value = data.bio;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch(err) {
      window.alert('You are not logged in')
    }
  }, []);

  return (
    <>

      <div className="mx-auto grid max-w-7xl">
        <div className="mt-10 hidden">
          <h1 className="mt-2 text-xl text-gray-300"> GETTING STARTED</h1>
          <div className="mt-3 grid grid-cols-3 gap-x-6">
            <div className="">
              <a href='/guides/about'>
                <div className="  relative isolate overflow-hidden  rounded-md bg-black/10 bg-neutral-900 pb-4 shadow-2xl ring-1 ring-white/10 hover:ring-white/40">
                  <div className="relative mx-auto max-w-7xl  px-5">
                    <div
                      className="absolute -bottom-8 -left-96 -z-10 transform-gpu blur-3xl sm:-bottom-64 sm:-left-40 lg:-bottom-32 lg:left-8 xl:-left-10"
                      aria-hidden="true"
                    >
                      <div
                        className="aspect-[1266/975] w-[79.125rem] bg-gradient-to-tr from-[#081e75] to-[#0737f2] opacity-30"
                        style={{
                          clipPath:
                          'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                        }}
                      />
                    </div>
                    <div className="mx-auto  lg:mx-0 lg:max-w-3xl">
                      <div className="mt-4 text-lg leading-8 text-gray-300">
                        <h1 className="flex text-xl text-neutral-100 mb-1">
                          About CTFGuide{' '}
                          <i className="fas fa-book ml-auto text-[#3b82f6] mt-1.5"></i>
                        </h1>
                        <p className="text-sm text-neutral-300">
                          Wondering what CTFGuide is? Let's take a look at
                          what we're all about.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </div>

            <div className="">
              <a href='/guides/create'>
                <div className="  relative isolate overflow-hidden  rounded-md bg-black/10 bg-neutral-900 pb-4 shadow-2xl ring-1 ring-white/10 hover:ring-white/40">
                  <div className="relative mx-auto max-w-7xl  px-5">
                    <div
                      className="absolute -bottom-8 -left-96 -z-10 transform-gpu blur-3xl sm:-bottom-64 sm:-left-40 lg:-bottom-32 lg:left-8 xl:-left-10"
                      aria-hidden="true"
                    >
                      <div
                        className="aspect-[1266/975] w-[79.125rem] bg-gradient-to-tr from-[#081e75] to-[#0737f2] opacity-30"
                        style={{
                          clipPath:
                          'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                        }}
                      />
                    </div>
                    <div className="mx-auto  lg:mx-0 lg:max-w-3xl">
                      <div className="mt-4 text-lg leading-8 text-gray-300">
                        <h1 className="flex text-xl text-neutral-100 mb-1">
                          Creating CTF's{' '}
                          <i className="fas fa-pen ml-auto text-[#3b82f6] mt-1.5"></i>
                        </h1>
                        <p className="text-sm text-neutral-300">
                          Not all CTF's are made the same. Let's take a
                          look at what makes a good CTF.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </div>

            <div className="">
              <a href='/guides/solve'>
                <div className="  relative isolate overflow-hidden  rounded-md bg-black/10 bg-neutral-900 pb-4 shadow-2xl ring-1 ring-white/10 hover:ring-white/40">
                  <div className="relative mx-auto max-w-7xl  px-5">
                    <div
                      className="absolute -bottom-8 -left-96 -z-10 transform-gpu blur-3xl sm:-bottom-64 sm:-left-40 lg:-bottom-32 lg:left-8 xl:-left-10"
                      aria-hidden="true"
                    >
                      <div
                        className="aspect-[1266/975] w-[79.125rem] bg-gradient-to-tr from-[#081e75] to-[#0737f2] opacity-30"
                        style={{
                          clipPath:
                          'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                        }}
                      />
                    </div>
                    <div className="mx-auto  lg:mx-0 lg:max-w-3xl">
                      <div className="mt-4 text-lg leading-8 text-gray-300">
                        <h1 className="flex text-xl text-neutral-100 mb-1">
                          Solving CTF's{' '}
                          <i className="fas fa-hammer ml-auto text-[#3b82f6] mt-1.5"></i>
                        </h1>
                        <p className="text-sm text-neutral-300">
                          Never solved a CTF before? We've made a basic
                          how-to guide just for you.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>

          <h1 className="mt-4 text-xl text-gray-300"> YOUR INSIGHTS</h1>
          <div>
            <div className="mt-3 w-full pb-4 mb-4">
              <div className="grid grid-cols-1 gap-x-10">
                <div
                  href="../challenges/1"
                  className="w-1/3 w-full flex-shrink-0 cursor-pointer rounded-sm  bg-neutral-800/50 to-blue-900 px-5   py-4 font-semibold text-white backdrop-blur-lg hover:bg-neutral-800"
                >
                  <h1 className="flex text-xl text-neutral-100 ">
                    Hmmm, looks like we have no insights for you yet...
                  </h1>
                  <p className="text-sm text-neutral-300">
                    CTFGuide can give you insights based on your past
                    CTF solves. But, it does require you to solve
                    several problems first.
                  </p>
                    <div onClick={() => window.location.href = "/practice/community"}>
                    <p className='flex tracking-loose text-blue-500 mt-2 hover:underline'>
                      Let's get hacking<ArrowRightIcon className='ml-1.5 h-5 mt-0.5'/>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <h1 className="text-xl text-gray-300 mt-10"> SITE FEED</h1>

    
      <div className="mx-auto mb-4 mt-1 w-full gap-4 gap-y-6 rounded-lg">
              <div
                style={{ backgroundColor: '#212121', borderColor: '#3b3a3a' }}
                className=" mx-auto w-full rounded-lg px-4 py-2 pt-2 pb-5 text-white  "
              >
                <h1 className="mt-2 text-xl font-semibold text-white">
                  {' '}
                  v.1.2 Patch Notes
                </h1>

                <p> 
                  {' '}
                  A lot of changes in this one!
                </p>
                <p
                  id="feed1readmore"
                  className=" mt-4 cursor-pointer italic text-blue-500 hover:text-blue-500 hover:underline"
                  onClick={() => {
                    document.getElementById('feed1rest').classList.remove('hidden');
                    document.getElementById('feed1readmore').classList.add('hidden');
                  }}
                >
                  Read More
                </p>

                <div id="feed1rest" className="mt-2 hidden">

                  <div className="mt-1">

                    <span className='font-semibold text-blue-500'>  CTFGuide Education</span><br></br>
                    <div className='grid grid-cols-6 gap-x-4'>
                      <div className='col-span-4'>
                        We're excited to introduce CTFGuide EDU, the world's first cybersecurity LMS powered by AI. We've been working on this for a while and we're super excited to finally release it. 

                        <br></br>
                        <br></br>

                        CTFGuide EDU allows for teachers to create custom lab environments for students. Student submissions can be played back in real-time, allowing for teachers to see exactly how a student solved a problem. Submissions are also automatically graded by our AI, allowing for teachers to focus on teaching, rather than grading.

                      </div>
                      <div className='col-span-2'>
                        <iframe height="200" src="https://www.youtube-nocookie.com/embed/m0I__kMTziU?si=fI-qPfCgP3LAPAZ0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; auto-play;" 
                          className="mx-auto  w-full max-w-4xl rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10"
                          allowfullscreen autoplay></iframe>
                      </div>
                    </div>
                    <br></br>
                    <br></br>

                    This feature required us to rework a lot of our internal API's meaning we've temporarily disabled some features. We're working on getting these features back up and running as soon as possible.
                    <br></br>
                    <br></br>
                    <span className='text-yellow-500 font-semibold'>Temporarily Disabled Features:</span> <br></br>
                    • Hints <br></br>
                    • Terminals on challenges <br></br>
                    • Comments <br></br>
                    • Likes <br></br>
                    • Create <br></br>
                    <br></br>
                    <span className='text-yellow-500 font-semibold'>The following features are not working and will be fixed in the next patch:</span> <br></br>
                    • Saving Progress on Learn <br></br>
                    • Hub feature on Practice
                    <br></br><br></br>
                    <span className='font-semibold text-blue-500'>  A word about Learn...</span><br></br>
                    This entire feature is being replaced. We're partnering with The Pennsylvania State University to bring you a new and improved learning experience. We're excited to share more about this in the coming months.
                    <br></br> <br></br>
                  </div>
                  <p
                    id="feed1readless"
                    className=" mt-4 cursor-pointer italic text-blue-500 hover:text-blue-500 hover:underline"
                    onClick={() => {
                      document.getElementById('feed1rest').classList.add('hidden');
                      document
                        .getElementById('feed1readmore')
                        .classList.remove('hidden');
                    }}
                  >
                    See Less
                  </p>
                </div>
              </div>
              <Transition.Root show={open} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={setOpen}>
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
                  </Transition.Child>

                  <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0" >

                      <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                      >

                        <Dialog.Panel className="w-full max-w-6xl relative transform overflow-hidden rounded-lg shadow-lg shadow-neutral-800  bg-gradient-to-r from-neutral-900 to-black  px-4  text-left  transition-all ">
                          <div>


                            <div className="mt-3  sm:mt-5 w-full">
                              <h1 className='text-6xl mb-2 text-white text-center mt-12'>Introducing <span className="font-semibold rainbow_text_animated">CTFGuide AI</span>  </h1>
                              <h2 className='text-2xl mb-8 text-white text-center'>The world's first <b>AI powered</b> teaching tool for cybersecurity.</h2>
                              <iframe width="auto" height="500" src="https://www.youtube-nocookie.com/embed/m0I__kMTziU?si=fI-qPfCgP3LAPAZ0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; auto-play;" 
                                className="mx-auto  mt-4 w-full max-w-4xl rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10"
                                allowfullscreen autoplay></iframe>


                            </div>
                            <div className='text-center mt-10 mb-10'>
                              <a href="../groups" className='text-xl px-4 py-2 text-center cursor-pointer font-semibold bg-blue-800 hover:bg-blue-800/50 rounded-lg text-white w-40'>Try the Demo</a>
                              <a onClick={() => { setOpen(false) }} className='ml-4 text-xl cursor-pointer text-center  px-4  py-2 text-white w-40' >Maybe later...</a>

                            </div>
                          </div>

                        </Dialog.Panel>
                      </Transition.Child>
                    </div>
                  </div>
                </Dialog>
              </Transition.Root>
            </div>
  

    </>
  );
}
