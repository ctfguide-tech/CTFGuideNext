import { useState, useEffect, useRef } from 'react'
import { Dialog, Popover, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon, ChevronDownIcon, AcademicCapIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline'
import TextLoop from "react-text-loop";
import Link from 'next/link'
import { Logo } from '@/components/Logo'
import Banner from '@/components/home/Banner';
import request from '@/utils/request';
import  Bento  from './Bento';
const navigation = [

]



export function Hero() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [expandedCardIndex, setExpandedCardIndex] = useState(-1)
  const [activityFeed, setActivityFeed] = useState([])
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0)
  const heroRef = useRef(null)
  const mediaRef = useRef(null)

  const mediaContent = [
    { 
      type: 'video', 
      src: '../sample_vid.mp4',
      direction: 'right',
      title: 'Interactive Learning Environment',
      description: 'Develop your cybersecurity skills with hands-on challenges in our secure sandboxed environment. Learn by doing with real-world scenarios.'
    },
    { 
      type: 'image', 
      src: '../site.png',
      direction: 'left',
      title: 'Community-Driven Platform',
      description: 'Join a vibrant community of security professionals, students, and enthusiasts. Share knowledge, collaborate on challenges, and grow together.'
    },
    { 
      type: 'image', 
      src: '../site.png',
      direction: 'right',
      title: 'Track Your Progress',
      description: 'Monitor your skill development with detailed analytics and achievement tracking. See your growth and identify areas for improvement.'
    }
  ]

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      
      mediaContent.forEach((_, index) => {
        const element = document.getElementById(`media-${index}`);
        if (!element) return;
        
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top;
        const elementCenter = elementTop + rect.height / 2;
        
        // Calculate opacity and transform based on element position in viewport
        const viewportCenter = windowHeight / 2;
        const distanceFromCenter = Math.abs(elementCenter - viewportCenter);
        const maxDistance = windowHeight * 0.7;
        
        // Create a bell curve effect where elements are most visible in the center
        let visibility = 1 - (distanceFromCenter / maxDistance);
        visibility = Math.max(0, Math.min(1, visibility * 1.5)); // Boost and clamp visibility
        
        element.style.opacity = visibility;
        
        // Calculate slide-in position based on visibility
        const direction = mediaContent[index].direction === 'right' ? 1 : -1;
        element.style.transform = `translateX(${(1 - visibility) * direction * 70}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchActivityFeed = async () => {
      // use mock data if api is down
      setActivityFeed([
        { 
          userName: 'laphatize', 
          challengeName: 'Excel-lently Hidden', 
          profilePic: 'https://avatars.githubusercontent.com/u/190905122?s=160&v=4',
          points: 250,
          leaderboardJump: 3,
          difficulty: 'Medium'
        },
        { 
          userName: 'herronjo', 
          challengeName: 'Trading Bananas', 
          profilePic: 'https://imagedelivery.net/1Dym4oPRvM_5USnDWCdSCw/1bd03d05-1057-48fc-3d3f-b3ed512cb500/public',
          points: 500,
          leaderboardJump: 5,
          difficulty: 'Hard'
        },
        { 
          userName: 'thunderbird', 
          challengeName: 'Sneaky Cat', 
          profilePic: 'https://imagedelivery.net/1Dym4oPRvM_5USnDWCdSCw/3b312b5f-c90d-490d-80d0-e52b367d4400/public',
          points: 150,
          leaderboardJump: 2,
          difficulty: 'Easy'
        },
        { 
          userName: 'stevestef', 
          challengeName: 'Pretty Obvious', 
          profilePic: 'https://imagedelivery.net/1Dym4oPRvM_5USnDWCdSCw/3e75c7a3-dfe9-47cc-0d46-736187e62400/public',
          points: 350,
          leaderboardJump: 4,
          difficulty: 'Medium'
        },
      ]);
    };

    fetchActivityFeed();
  }, []);

  // Handle the wave animation
  useEffect(() => {
    let currentIndex = 0;
    const waveTimer = setInterval(() => {
      setExpandedCardIndex(currentIndex);
      
      // After 1 second, close the current card and move to the next
      setTimeout(() => {
        setExpandedCardIndex(-1);
        currentIndex = (currentIndex + 1) % activityFeed.length;
      }, 1000);
    }, 2000); // Complete cycle every 2 seconds

    return () => clearInterval(waveTimer);
  }, [activityFeed.length]);

    return (
      <div className="bg-neutral-900">
        <header className="fixed inset-x-0 top-0 z-50">
        <Banner />

          <nav className="flex items-center justify-between py-3 lg:px-8 backdrop-blur-md bg-neutral-900/40 border-b border-blue-500/10 shadow-lg shadow-blue-900/5 transition-all duration-300" aria-label="Global">
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
                            <div className="block p-3 -m-3 transition duration-150 ease-in-out rounded-md hover:bg-neutral-800">
                              <div className="flex items-start">
                                <i className="fa fa-bullseye h-8 w-6 text-blue-500 mr-3 mt-1 text-lg" />
                                <div className="flex-grow">
                                  <div className="text-base font-medium text-white flex justify-between items-center">
                                    <span><span className='font-semibold'>CTFGuide</span> Bounties</span>
                                  </div>
                                  <p className="text-sm text-white">Crowd source vulnerability reports for your startup.</p>
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

              <Popover className="relative">
                {({ open }) => (
                  <>
                    <Popover.Button className="flex items-center gap-x-1 text-white focus:outline-none">
                      Resources
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
                      <Popover.Panel className="absolute left-1/2 z-10 mt-3 w-screen max-w-xl -translate-x-1/2 transform px-2 sm:px-0">
                        <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                          <div className="relative bg-neutral-900 bg-blend-overlay p-6">
                          

                            <div className="grid md:grid-cols-2 gap-8">
                              {/* Platform Comparisons */}
                              <div>
                                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center">
                                  <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                  </svg>
                                  Platform Comparisons
                                </h3>
                                <div className="space-y-3">
                                  <Link href="/compare/hackthebox" className="block text-sm text-neutral-300 hover:text-blue-400 transition-colors">
                                    vs. HackTheBox
                                  </Link>
                                  <Link href="/compare/tryhackme" className="block text-sm text-neutral-300 hover:text-blue-400 transition-colors">
                                    vs. TryHackMe
                                  </Link>
                                  <Link href="/compare/ctftime" className="block text-sm text-neutral-300 hover:text-blue-400 transition-colors">
                                    vs. CTFtime
                                  </Link>
                                  <Link href="/compare/ctflearn" className="block text-sm text-neutral-300 hover:text-blue-400 transition-colors">
                                    vs. CTFlearn
                                  </Link>
                                </div>
                              </div>

                              {/* Learning Resources */}
                              <div>
                                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center">
                                  <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                  </svg>
                                  Learning Resources
                                </h3>
                                <div className="space-y-3">
                                  <Link href="/articles" className="block text-sm text-neutral-300 hover:text-blue-400 transition-colors">
                                    Articles & Guides
                                  </Link>
                                  <Link href="/writeups" className="block text-sm text-neutral-300 hover:text-blue-400 transition-colors">
                                    Challenge Writeups
                                  </Link>
                                  <Link href="/community" className="block text-sm text-neutral-300 hover:text-blue-400 transition-colors">
                                    Community Resources
                                  </Link>
                                </div>
                              </div>
                            </div>

                              {/* Featured Article Section */}
                              <div className="mb-8 mt-8">
                              <Link href="/articles/getting-started" className="group block">
                                <div className="relative h-40 overflow-hidden rounded-lg mb-4">
                                  <img 
                                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6h7P6lxlWHzt8fAvwVmx4moLhPZZ5XK7gNQ&s" 
                                    alt="Getting Started with CTFGuide" 
                                    className="object-cover  w-full h-full transform group-hover:scale-105 transition-transform duration-300"
                                  />
                                  <div className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm bg-gradient-to-t from-black/60 to-transparent" />
                                  <div className="absolute bottom-4 left-4  rounded-full px-4 py-1 text-blue-300 text-sm font-bold">
                                    <p className="text-sm text-blue-400 font-semibold">Featured Article</p>
                                    <h3 className="text-lg font-bold text-white">Getting Started with CTFGuide</h3>
                                  </div>
                                </div>
                              </Link>
                            </div>

                            {/* Bottom Banner */}
                            <div className="mt-8 pt-6 border-t border-neutral-800">
                              <Link href="/blog" className="group flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-semibold text-blue-400">CTFGuide Blog</p>
                                  <p className="text-sm text-gray-400">Latest updates, tutorials, and community stories</p>
                                </div>
                                <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transform group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </Link>
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
                Create an account for free
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
  
        <div className="relative">
          <div className="lg:pb-40">
            <div className="mx-auto">
              
              <div className="mx-auto min-h-screen flex flex-col justify-center text-left relative z-[1]">
                <div className='grid sm:grid-cols-6 grid-cols-1 gap-x-8 items-start'>
               
                  <div className='col-span-4'>
                  <div className="absolute top-0 z-[-2] h-screen w-full bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(18,35,166,0.3),rgba(255,255,255,0))]"></div>
                    
                  
                     <span className='hidden ml-24 bg-blue-900/30 backdrop-blur-sm rounded-full px-4 py-1 text-blue-300 text-sm font-bold'><i className='fa fa-bullseye mr-2'></i>Introducing Bounties on CTFGuide</span>
                    <h1 className="px-4 sm:pl-8 md:pl-24 mt-20 sm:mt-32 text-4xl sm:text-5xl lg:text-6xl font-normal tracking-normal text-white mb-6 sm:mb-8">
                      The platform that <span className="text-blue-600 font-extrabold" >
                        <TextLoop>
                          <span>grows</span>
                          <span>develops</span>
                          <span>trains</span>
                        </TextLoop>
                      </span>
                      <br />
                      <span className='bg-gradient-to-r from-blue-400 to-blue-400 text-transparent bg-clip-text'>cybersecurity talent.</span>
                    </h1>

                    <p className="px-4 sm:pl-8 md:pl-24 text-xl sm:text-2xl leading-8 text-gray-300 mb-8">
                      The <span className='font-bold text-white'>free</span> social learning platform for all things cybersecurity.
                    </p>

                    <div className="px-4 sm:pl-8 md:pl-24 flex flex-col sm:flex-row items-start sm:items-center gap-y-4 sm:gap-y-0 sm:gap-x-6">
                      <a
                        href="../register"
                        className="w-full sm:w-auto text-center rounded-md px-6 py-3 sm:py-2 text-lg sm:text-xl font-semibold text-white border border-white hover:bg-white hover:text-black transition-all duration-300"
                      >
                        Get started
                      </a>
                      <p onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })} 
                         className="w-full sm:w-auto text-center sm:text-left cursor-pointer text-lg sm:text-xl font-semibold leading-6 text-white sm:text-white hover:text-black hover:bg-white sm:hover:text-blue-400 sm:hover:bg-transparent transition-all duration-300 border border-white sm:border-0 rounded-md px-6 py-3 sm:p-0">
                        Learn more <span aria-hidden="true">→</span>
                      </p>
                    </div>

                  
                  </div>
            
                  <div className='col-span-2 relative hidden md:block'>
                 
                    <div className="space-y-8 sticky top-24 pr-4 mt-8 lg:pr-24 relative z-10">
                      {activityFeed.map((card, index) => (
                        <div
                          key={card.userName}
                          className="transition-all duration-300 transform-gpu pl-4"
                          style={{ perspective: "1200px" }}
                        >
                          <div 
                            className="h-[110px] bg-neutral-800/50 backdrop-blur-sm rounded-xl overflow-hidden relative shadow-lg border border-neutral-700/40 transition-all duration-300 hover:shadow-blue-900/10 hover:border-blue-500/20"
                            style={{ 
                              transform: "rotateY(-12deg) rotateX(2deg) translateZ(0)", 
                              transformStyle: "preserve-3d",
                              boxShadow: "-5px 5px 15px rgba(0, 0, 0, 0.3), 0 0 0 rgba(59, 130, 246, 0)",
                              transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = "rotateY(-5deg) rotateX(1deg) translateZ(20px) scale(1.03)";
                              e.currentTarget.style.boxShadow = "-10px 10px 30px rgba(0, 0, 0, 0.2), 0 0 20px rgba(59, 130, 246, 0.3)";
                              e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.3)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "rotateY(-12deg) rotateX(2deg) translateZ(0)";
                              e.currentTarget.style.boxShadow = "-5px 5px 15px rgba(0, 0, 0, 0.3), 0 0 0 rgba(59, 130, 246, 0)";
                              e.currentTarget.style.borderColor = "rgba(82, 82, 91, 0.4)";
                            }}
                          >
                            <div 
                              className="absolute inset-0 w-full h-full transition-all duration-500 ease-in-out p-5 transform-gpu"
                              style={{
                                opacity: expandedCardIndex === index ? 0 : 1,
                                transform: expandedCardIndex === index ? 'translateY(-100%)' : 'translateY(0) translateZ(5px)',
                              }}
                            >
                              <div className="flex items-center h-full">
                                <img 
                                  src={card.profilePic ? card.profilePic : `https://robohash.org/${card.userName}`} 
                                  className='w-16 h-16 rounded-full mr-5 hover:scale-110 transition-transform duration-300 border-2 border-blue-500/20 shadow-md' 
                                  alt={card.userName} 
                                />
                                <div>
                                  <p className='text-white font-bold text-xl'>{card.userName}</p>
                                  <p className='text-gray-300 text-base'>
                                    solved <span className='text-yellow-400 animate-pulse font-semibold'>{card.challengeName}</span>
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div 
                              className="absolute inset-0 w-full h-full transition-all duration-500 ease-in-out p-5 transform-gpu"
                              style={{
                                opacity: expandedCardIndex === index ? 1 : 0,
                                transform: expandedCardIndex === index ? 'translateY(0) translateZ(5px)' : 'translateY(100%)',
                              }}
                            >
                              <div className="flex items-center justify-between h-full">
                                <div className="flex items-center space-x-5">
                                  <div className="flex items-center">
                                    <svg className="w-6 h-6 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                    </svg>
                                    <span className="text-white text-2xl font-bold">+{card.points}</span>
                                  </div>
                                  <div className="h-10 w-[1px] bg-neutral-700"></div>
                                  <div>
                                    <div className="flex items-center">
                                      <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                                      <p className="text-green-400 text-sm font-medium">{card.difficulty}</p>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center">
                                  <span className="text-white text-2xl font-bold mr-2">#{card.leaderboardJump}</span>
                                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
           
                </div>
              </div>

              <Bento/>
            </div>
          </div>
        </div>  

        <style jsx>{`
          @keyframes slideIn {
            0% {
              opacity: 0;
              transform: translateY(10px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    );
}

