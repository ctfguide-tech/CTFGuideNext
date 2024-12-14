import { useState, useEffect } from 'react'
import { Dialog, Popover, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon, ChevronDownIcon, AcademicCapIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline'
import TextLoop from "react-text-loop";
import Link from 'next/link'
import { Logo } from '@/components/Logo'
import Banner from '@/components/home/Banner';
import request from '@/utils/request';

const navigation = [

]



export function Hero() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [visibleCards, setVisibleCards] = useState(0)
  const [activityFeed, setActivityFeed] = useState([])

  useEffect(() => {
    const fetchActivityFeed = async () => {
  
      // use mock data if api is down
      setActivityFeed([
        { userName: 'laphatize', challengeName: 'Excel-lently Hidden', profilePic: 'https://avatars.githubusercontent.com/u/190905122?s=160&v=4' },
        { userName: 'herronjo', challengeName: 'Trading Bananas' , profilePic: 'https://imagedelivery.net/1Dym4oPRvM_5USnDWCdSCw/1bd03d05-1057-48fc-3d3f-b3ed512cb500/public' },
        { userName: 'thunderbird', challengeName: 'Sneaky Cat ' , profilePic: 'https://imagedelivery.net/1Dym4oPRvM_5USnDWCdSCw/3b312b5f-c90d-490d-80d0-e52b367d4400/public' },
        { userName: 'stevestef', challengeName: 'Pretty Obvious', profilePic: 'https://imagedelivery.net/1Dym4oPRvM_5USnDWCdSCw/3e75c7a3-dfe9-47cc-0d46-736187e62400/public' },
      ]);
    };

    fetchActivityFeed();

    const timer = setInterval(() => {
      setVisibleCards((prev) => (prev < activityFeed.length ? prev + 1 : prev))
    }, 1000) // Adjust timing as needed

    return () => clearInterval(timer)
  }, [activityFeed.length])

    return (
      <div className="bg-neutral-900">
        <header className="absolute inset-x-0 top-0 z-50">
        <Banner />

          <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
            <div className="flex lg:flex-1">
            <Link href="../" aria-label="Home">
              <Logo className="h-10 w-auto" />
            </Link>
            
            </div>
            <div className="flex items-center gap-x-5 md:gap-x-8 hidden sm:flex">
              <Popover className="relative">
                {({ open }) => (
                  <>
                    <Popover.Button className="flex items-center gap-x-1 text-white focus:outline-none">
                      Solutions
                      <ChevronDownIcon className={`${open ? 'transform rotate-180' : ''} h-5 w-5 transition-transform duration-150 ease-in-out`} />
                    </Popover.Button>
                    <Transition
                      enter="transition duration-100 ease-out"
                      enterFrom="transform scale-95 opacity-0"
                      enterTo="transform scale-100 opacity-100"
                      leave="transition duration-75 ease-out"
                      leaveFrom="transform scale-100 opacity-100"
                      leaveTo="transform scale-95 opacity-0"
                    >
                      <Popover.Panel className="absolute left-1/2 z-10 mt-3 w-screen max-w-md -translate-x-1/2 transform px-2 sm:px-0">
                        <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                          <div className="relative grid gap-6 bg-neutral-900 bg-blend-overlay px-5 py-6 sm:gap-8 sm:p-8">
                            <Link href="/education" className="block p-3 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-neutral-800">
                              <div className="flex items-start">
                                <AcademicCapIcon className="h-8 w-8 text-blue-500 mr-3 mt-1" />
                                <div>
                                  <p className="text-base font-medium text-white pb-1"><span className='font-semibold'>CTFGuide</span> Education</p>
                                  <p className="text-sm text-white">A platform for learning and training cybersecurity skills in the classroom.</p>
                                </div>
                              </div>
                            </Link>
                            <div className="block p-3 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-neutral-800">
                              <div className="flex items-start">
                                <BuildingOfficeIcon className="h-6 w-6 text-blue-500 mr-3 mt-1" />
                                <div className="flex-grow">
                                  <div className="text-base font-medium text-white flex justify-between items-center">
                                    <span><span className='font-semibold'>CTFGuide</span> Enterprise</span>
                                    <span className='text-xs text-white bg-blue-800 px-2 rounded-full'>Coming Soon</span>
                                  </div>
                                  <p className="text-sm text-white">Train your team to defend against real-world threats.</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Popover.Panel>
                    </Transition>
                  </>
                )}
              </Popover>
              <Link href="/careers" className="text-white">
                 Company 
              </Link>
          
            </div>
            <div className="flex lg:hidden">
              <button
                type="button"
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400"
                onClick={() => setMobileMenuOpen(true)}
              >
                <span className="sr-only">Open main menu</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="hidden lg:flex lg:gap-x-12">
              {navigation.map((item) => (
                <a key={item.name} href={item.href} className="text-sm font-semibold leading-6 text-white">
                  {item.name}
                </a>
              ))}
            </div>
            <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-x-4">
            <a href="./register" className="text-sm font-semibold leading-6 text-white px-4 py-1">
                Create an account 
              </a>


              <a href="./login" className="text-sm font-semibold leading-6 text-white border border-white px-4 py-1 hover:bg-white hover:text-black">
                Log in <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </nav>
          <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
            <div className="fixed inset-0 z-50" />
            <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gray-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-white/10">
              <div className="flex items-center justify-between">
              <Link href="../" aria-label="Home">
              <Logo className="h-10 w-auto" />
            </Link>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-gray-400"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/25">
                  <div className="space-y-2 py-6">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-800"
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                  <div className="py-6">
                    <a
                      href="../login"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white hover:bg-gray-800"
                    >
                      Log in
                    </a>
                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </Dialog>
        </header>
  
        <div className="relative isolate pt-14">
          <div
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/3 rotate-[30deg] bg-gradient-to-tr from-[#0e1354] to-[#1223a6] opacity-40 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
            />
          </div>
          <div className="py-24 sm:py-24 lg:pb-40">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className= "  animate__animated animate__fadeInUp mx-auto max-w-6xl  text-left">
              <div className='grid sm:grid-cols-6 grid-cols-1'>
                <div className='col-span-4 '>
                <h1 className="text-4xl font-normal tracking-normal text-white sm:text-4xl leading-relaxed ">
             
                <div className="mt-10 mb-2 text-3xl  text-white sm:text-2xl flex items-center justify-left">
                <img className=" w-8 text-center ml-0 mr-2 " src="../../../../darkLogocrop.png" />
   
              <h1 className='text-3xl font-normal m'>        <span className="text-white font-semibold"> CTFGuide </span> 
              </h1>
                </div>
                  The platform that <span className="text-blue-600 leading-relaxed">
                    <TextLoop>
                      <span>grows</span>
                      <span>develops</span>
                      <span>trains</span>
                  </TextLoop>
</span> <br></br><span className='mt-3'> cybersecurity talent.</span>
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-300">
                  The social learning platform for all things cybersecurity.
                </p>
                <div className="mt-10 flex items-center  gap-x-6">
                  <a
                    href="../register"
                    className="rounded-md   px-6 py-1.5 text-lg font-semibold text-white border border-white hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
                  >
                    Get started
                  </a>
                  <p onClick={() => window.scrollTo(0, 1500)} className="cursor-pointer text-lg font-semibold leading-6 text-white">
                    Learn more <span aria-hidden="true">→</span>
                  </p>
                  </div>
                </div>

                <div className='col-span-2 mt-10 hidden sm:block'>
                  <div className="space-y-2">
                  {activityFeed.slice(0, visibleCards).map((card, index) => (
  <div
    key={card.userName}
    className='hover:bg-neutral-700 duration-300 bg-neutral-800 cursor-pointer p-4 rounded-lg flex items-center transform transition-all ease-in-out'
    style={{
      opacity: 0,
      animation: `fadeInUp 0.5s ease-out ${index * 0.2}s forwards`,
    }}
  >
    <img src={card.profilePic ? card.profilePic : `https://robohash.org/${card.userName}`} className='w-12 h-12 rounded-full mr-4' alt={card.userName} />
    <div>
      <p className='text-white font-bold'>{card.userName}</p>
      <p className='text-gray-400 text-sm'>
        solved <span className='text-yellow-400'>{card.challengeName}</span>
      </p>
    </div>
  </div>
))}
                  </div>
                </div>
              </div>
              </div>
              <img
             
              />

              <video
              muted
              autoPlay
              width={2432}
              height={1442}
              className="animate__animated animate__fadeInUp mt-16 rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10 sm:mt-28"
         
              >
                <source src="../sample_vid.mp4" type="video/mp4" />

              </video>
            </div>
          </div>
          <div
            className="hidden inset-x-0 top-[calc(100%-13rem)] -z-10  transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#0e1354] to-[#1223a6]  opacity-40 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
              }}
            />
          </div>
        </div>
      </div>
  );
}
