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

<div className="mx-auto grid max-w-7xl ">
                
                <div className="mt-10">
              
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


      <h1 className="text-xl text-gray-300"> SITE FEED</h1>

      <div className="mx-auto mb-4 mt-1 w-full gap-4 gap-y-6 rounded-lg">
        <div
          style={{ backgroundColor: '#212121', borderColor: '#3b3a3a' }}
          className=" mx-auto w-full rounded-lg px-4 py-2 pt-2 pb-5 text-white  "
        >
          <h1 className="mt-2 text-xl font-semibold text-white">
            {' '}
            CTFGuide V3 is out now!
          </h1>

          <p> 
            {' '}
            After months of development, we are excited to release the new
            version of CTFGuide. There's a lot to unpack here!
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
              The first thing that you probably noticed, is the freshened UI.
              You'll notice that pages are a lot more wider and have a more
              friendly font.
            </p>

            <img
              src="./blog1.svg"
              className="mx-auto mt-4 mb-5 rounded-lg bg-neutral-800 py-10 px-10"
            />

            <p className="mx-auto text-center text-sm text-neutral-300">
              Old CTFGuide UI (Left) and New CTFGuide UI (Right)
            </p>

            <p className="mt-8">
              A common problem we'd have was that we artificially limited the
              amount of space we could design with. This limit is no longer
              there, meaning you should feel like the UI is more spread out.
              <br></br>
              <br></br>
              We've also introduced a lot of new features including badges,
              likes, & learn. These features will aid everyone's unique learning
              journey and we're super pumped.
              <br></br> <br></br>
              <b>Badges</b> - Badges are a way for you to show off your
              achievements on CTFGuide. You can earn badges by completing
              certain tasks on the site.
              <br></br> <br></br>
              <b>Likes</b> - Likes are a way for you to show appreciation for a
              creator or a certain area of Cybersecurity.
              <br></br> <br></br>
              <b>Learn</b> - We're super excited about this feature. We'll be
              adding a lot of content to this section in the coming weeks.
              You'll find a lot of interesting content shared from our team
              members, as well as content from other members in the Cyber
              community!
              <br></br> <br></br>
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
