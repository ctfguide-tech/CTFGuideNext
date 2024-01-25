import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { RocketLaunchIcon } from '@heroicons/react/20/solid';
import { MagnifyingGlassCircleIcon } from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
export function QuickSettings() {
  const [banner, bannerState] = useState(false);

  const router = useRouter();

  useEffect(() => {
    try {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/account`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('idToken'),
        },
      })
        .then((res) => res.json())
        .then((data) => {
   
          document.getElementById('bio').value = data.bio;
        })
        .catch((err) => {
     

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
                          <a href="/practice/community">
                            <p className='flex tracking-loose text-blue-500 mt-2 hover:underline'>
                                Let's get hacking<ArrowRightIcon className='ml-1.5 h-5 mt-0.5'/>
                            </p>
                          </a>
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
            Bruh, why is the website acting weird?
          </h1>

          <p> 
            {' '}
            Our team has been focusing on our EDU features. We've disabled certain features because we're currently testing some things on production.
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

          <div id="feed1rest" className="mt-4 hidden">
            <p>
              You may also see some out of date content - but don't worry this will all be fixed soon.

              Yell at us here: <a href="https://discord.gg/6Cf9A2ZK68" className="text-blue-500 cursor-pointer hover:underline">Discord server invite</a>
              
            </p>

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
      </div>
    </>
  );
}
