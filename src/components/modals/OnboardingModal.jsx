import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState, useEffect, useRef } from 'react'
import { GraduationCap, Code, Terminal } from 'lucide-react'
import { keyframes } from '@emotion/react'
import request from '@/utils/request'; 

const moveGrid = keyframes`
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-24px);
  }
`

export default function OnboardingModal({ isOpen, onClose }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedSkill, setSelectedSkill] = useState(null)
  const [selectedFrequency, setSelectedFrequency] = useState('casual')
  const [hoursPerWeek, setHoursPerWeek] = useState(8)
  const [selectedTime, setSelectedTime] = useState('Morning')
  const [selectedStyle, setSelectedStyle] = useState('flexible')
  const [reminders, setReminders] = useState(true)
  const [browserNotifications, setBrowserNotifications] = useState(true)
  const [isSliderActive, setIsSliderActive] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [contentHeight, setContentHeight] = useState(0)
  const page1Ref = useRef(null)
  const page2Ref = useRef(null)

  useEffect(() => {
    let timeout;
    if (!isSliderActive) {
      timeout = setTimeout(() => {
        setShowTooltip(false)
      }, 800)
    } else {
      setShowTooltip(true)
    }
    return () => clearTimeout(timeout)
  }, [isSliderActive])

  useEffect(() => {
    const updateHeight = () => {
      const currentRef = currentPage === 1 ? page1Ref.current : page2Ref.current;
      if (currentRef) {
        // Store original styles
        const originalPosition = currentRef.style.position;
        const originalWidth = currentRef.style.width;
        
        // Temporarily adjust for measurement
        currentRef.style.position = 'relative';
        currentRef.style.width = '100%';
        
        const height = currentRef.offsetHeight;
        
        // Restore original styles
        currentRef.style.position = originalPosition;
        currentRef.style.width = originalWidth;
        
        setContentHeight(height);
      }
    };

    const timeoutId = setTimeout(updateHeight, 50);
    window.addEventListener('resize', updateHeight);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateHeight);
    };
  }, [currentPage]);

  const handleSkillSelect = (skill) => {
    setSelectedSkill(skill)
    setCurrentPage(2)
  }

  const handleFrequencySelect = (frequency) => {
    setSelectedFrequency(frequency)
  }

  const handleTimePreference = (time) => {
    setSelectedTime(time)
  }

  const handleLearningStyle = (style) => {
    setSelectedStyle(style)
  }

  // save changes
  const saveChanges = async () => {
    const data = {
      skill: selectedSkill,
      hoursPerWeek,
      timePreference: selectedTime,
      learningStyle: selectedStyle
    };

    try {
      const response = await request(
        `${process.env.NEXT_PUBLIC_API_URL}/account/savePreferences`,
        'POST',
        data
      );
      
      if (response) {
        console.log('Preferences saved successfully');
      } else {
        console.error('Failed to save preferences');
      }
    } catch (error) {
      console.error('An error occurred while saving preferences:', error);
    }
  };
  

  const getTooltipConfig = (hours) => {
    if (hours <= 3) {
      return {
        emoji: '🌱',
        color: 'bg-emerald-500',
        message: 'Starting small!',
        arrowColor: 'bg-emerald-500'
      }
    } else if (hours <= 7) {
      return {
        emoji: '⭐',
        color: 'bg-blue-500',
        message: 'Good balance!',
        arrowColor: 'bg-blue-500'
      }
    } else if (hours <= 12) {
      return {
        emoji: '🚀',
        color: 'bg-purple-500',
        message: 'Ambitious!',
        arrowColor: 'bg-purple-500'
      }
    } else if (hours <= 16) {
      return {
        emoji: '🔥',
        color: 'bg-orange-500',
        message: 'Dedicated!',
        arrowColor: 'bg-orange-500'
      }
    } else {
      return {
        emoji: '💪',
        color: 'bg-red-500',
        message: 'Beast mode!',
        arrowColor: 'bg-red-500'
      }
    }
  }

  const timeConfig = {
    Morning: {
      emoji: '🌅',
      gradient: 'from-amber-400 to-orange-500',
      hoverGradient: 'from-amber-500 to-orange-600'
    },
    Afternoon: {
      emoji: '☀️',
      gradient: 'from-blue-400 to-blue-500',
      hoverGradient: 'from-blue-500 to-blue-600'
    },
    Evening: {
      emoji: '🌆',
      gradient: 'from-orange-400 to-red-500',
      hoverGradient: 'from-orange-500 to-red-600'
    },
    'Late Night': {
      emoji: '🌙',
      gradient: 'from-gray-900 to-black',
      hoverGradient: 'from-indigo-500 to-violet-600'
    }
  }

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setBrowserNotifications(permission === "granted");
      
      if (permission === "granted") {
        new Notification("CTFGuide Notifications Enabled", {
          body: "You'll receive practice reminders here!"
        });
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      setBrowserNotifications(false);
    }
  };

  const handleBrowserNotifications = async (checked) => {
    if (checked) {
      await requestNotificationPermission();
    } else {
      setBrowserNotifications(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel 
                className="w-full max-w-7xl transform overflow-hidden rounded-2xl bg-neutral-800 mx-auto px-20 py-14 text-left align-middle shadow-xl transition-all relative"
                style={{ minHeight: Math.max(contentHeight + 112, 400) }}
              >
                <div className="absolute inset-0 pointer-events-none">
                  <div className="h-full w-full" 
                    style={{
                      backgroundImage: `
                        linear-gradient(to right, rgba(55, 65, 81, 0.1) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(55, 65, 81, 0.1) 1px, transparent 1px)
                      `,
                      backgroundSize: '24px 24px',
                      maskImage: 'linear-gradient(to top, black, transparent)',
                      WebkitMaskImage: 'linear-gradient(to top, black, transparent)',
                      animation: `${moveGrid} 2s linear infinite`
                    }}
                  />
                </div>
                <div className="relative">
                  <Transition
                    show={currentPage === 1}
                    enter="transition-all duration-300 ease-out delay-300"
                    enterFrom="opacity-0 translate-x-8"
                    enterTo="opacity-100 translate-x-0"
                    leave="transition-all duration-300 ease-in"
                    leaveFrom="opacity-100 translate-x-0"
                    leaveTo="opacity-0 -translate-x-8"
                    className="absolute w-full"
                  >
                    <div ref={page1Ref}>
                      <div className='pb-10'>
                        <Dialog.Title as="h1" className="text-2xl leading-6 text-white">
                          Welcome to CTFGuide!
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-neutral-300">
                           Let's try to make the best out of your learning experience.
                          </p>

                            <div className=''>
                                <h1 className='text-white text-lg mt-4'>What would you say your skill level is?</h1>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                              <div 
                                onClick={() => handleSkillSelect('beginner')}
                                className="group relative bg-gradient-to-br from-green-600 to-green-800 p-4 rounded-lg hover:from-green-500 hover:to-green-700 transition-all duration-300 cursor-pointer overflow-hidden"
                              >
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000" />
                                </div>
                                <div className="relative">
                                  <div className="flex items-center gap-2 mb-2">
                                    <GraduationCap className="w-5 h-5 text-white" />
                                    <h2 className="text-lg font-semibold text-white">Beginner</h2>
                                  </div>
                                  <p className="text-sm text-neutral-200 mt-2">New to cybersecurity? Start here to learn CTF basics and fundamental concepts.</p>
                                </div>
                              </div>

                              <div 
                                onClick={() => handleSkillSelect('intermediate')}
                                className="group relative bg-gradient-to-br from-blue-600 to-blue-800 p-4 rounded-lg hover:from-blue-500 hover:to-blue-700 transition-all duration-300 cursor-pointer overflow-hidden"
                              >
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000" />
                                </div>
                                <div className="relative">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Code className="w-5 h-5 text-white" />
                                    <h2 className="text-lg font-semibold text-white">Intermediate</h2>
                                  </div>
                                  <p className="text-sm text-neutral-200 mt-2">Familiar with CTFs? Enhance your skills with more complex challenges and tools.</p>
                                </div>
                              </div>

                              <div 
                                onClick={() => handleSkillSelect('advanced')}
                                className="group relative bg-gradient-to-br from-purple-600 to-purple-800 p-4 rounded-lg hover:from-purple-500 hover:to-purple-700 transition-all duration-300 cursor-pointer overflow-hidden"
                              >
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000" />
                                </div>
                                <div className="relative">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Terminal className="w-5 h-5 text-white" />
                                    <h2 className="text-lg font-semibold text-white">Advanced</h2>
                                  </div>
                                  <p className="text-sm text-neutral-200 mt-2">Expert-level challenges covering advanced exploitation, forensics, and reverse engineering.</p>
                                </div>
                              </div>
                            </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end space-x-3 hidden">
                          <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none"
                            onClick={onClose}
                          >
                            Let's get started!
                          </button>
                        </div>
                      </div>
                    </div>
                  </Transition>

                  <Transition
                    show={currentPage === 2}
                    enter="transition-all duration-300 ease-out delay-300"
                    enterFrom="opacity-0 translate-x-8"
                    enterTo="opacity-100 translate-x-0"
                    leave="transition-all duration-300 ease-in"
                    leaveFrom="opacity-100 translate-x-0"
                    leaveTo="opacity-0 -translate-x-8"
                    className="absolute w-full"
                  >
                    <div ref={page2Ref}>
                      <div>
                        <Dialog.Title as="h1" className="text-2xl leading-6 text-white">
                          Set Your Learning Schedule
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-neutral-300">
                            Based on your {selectedSkill} skill level, let's create a personalized practice schedule.
                          </p>

                          <div className='mt-8'>
                            <div className="space-y-8">
                              {/* Time Commitment Slider */}
                              <div>
                                <h2 className='text-white text-lg mb-4'>How many hours can you commit per week?</h2>
                                <div className="relative ">
                                  <input 
                                    type="range" 
                                    min="1" 
                                    max="20" 
                                    value={hoursPerWeek}
                                    className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-neutral-700"
                                    onChange={(e) => setHoursPerWeek(parseInt(e.target.value))}
                                    onMouseDown={() => setIsSliderActive(true)}
                                    onMouseUp={() => setIsSliderActive(false)}
                                    onMouseLeave={() => setIsSliderActive(false)}
                                    onTouchStart={() => setIsSliderActive(true)}
                                    onTouchEnd={() => setIsSliderActive(false)}
                                    style={{
                                      background: `linear-gradient(to right, #3b82f6 ${((hoursPerWeek - 1)/(20 - 1)) * 100}%, #404040 ${((hoursPerWeek - 1)/(20 - 1)) * 100}%)`
                                    }}
                                  />
                                  <div 
                                    className={`absolute -top-14 transform -translate-x-1/2 transition-opacity duration-500 ${
                                      showTooltip ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                                    } pointer-events-none z-50`}
                                    style={{ 
                                      left: `${((hoursPerWeek-1)/19) * 100}%`,
                                      transition: 'left 0s, opacity 0.5s, transform 0.5s'
                                    }}
                                  >
                                    <div className={`bg-blue-500 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-lg `}>
                                      <div className="flex items-center gap-2">
                                        <span className="text-xl animate-bounce">
                                          {getTooltipConfig(hoursPerWeek).emoji}
                                        </span>
                                        <div className="flex flex-col ">
                                          <span className="font-medium">{hoursPerWeek} {hoursPerWeek === 1 ? 'hour' : 'hours'}</span>
                                          <span className="text-xs opacity-90">{getTooltipConfig(hoursPerWeek).message}</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className={`w-2 h-2 bg-blue-500 rotate-45 absolute -bottom-1 left-1/2 transform -translate-x-1/2`}></div>
                                  </div>
                                  <div className="flex justify-between text-sm text-neutral-400 mt-4">
                                    <span>1 hour</span>
                                    <span>10 hours</span>
                                    <span>20 hours</span>
                                  </div>
                                </div>
                              </div>

                              {/* Preferred Practice Times */}
                              <div>
                                <h2 className='text-white text-lg mb-4'>When do you prefer to practice?</h2>
                                <div className="flex flex-wrap gap-3">
                                  {['Morning', 'Afternoon', 'Evening', 'Late Night'].map((time) => (
                                    <button
                                      key={time}
                                      onClick={() => handleTimePreference(time)}
                                      className={`
                                        px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 
                                        flex items-center gap-2 shadow-lg transform hover:scale-105
                                        ${selectedTime === time 
                                          ? `bg-gradient-to-r ${timeConfig[time].gradient} text-white` 
                                          : 'bg-neutral-700 text-neutral-300 ' + timeConfig[time].hoverGradient
                                        }
                                      `}
                                    >
                                      <span className="text-lg">{timeConfig[time].emoji}</span>
                                      {time}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Learning Style */}
                              <div>
                                <h2 className='text-white text-lg mb-4'>Choose your learning style</h2>
                                <div className="grid grid-cols-2 gap-4">
                                  <div 
                                    onClick={() => handleLearningStyle('structured')}
                                    className={`group relative p-4 rounded-lg border-2 transition-all duration-300 cursor-not-allowed opacity-75 ${
                                      'border-neutral-700'
                                    }`}
                                  >
                                    <div className="absolute top-2 right-2">
                                      <span className="bg-neutral-600 text-xs font-medium text-neutral-200 px-2 py-1 rounded-full">Coming Soon</span>
                                    </div>
                                    <div className="relative">
                                      <h3 className="text-white font-medium">Structured Learning</h3>
                                      <p className="text-sm text-neutral-400 mt-1">Follow a guided curriculum with clear progression</p>
                                    </div>
                                  </div>

                                  <div 
                                    onClick={() => handleLearningStyle('flexible')}
                                    className={`group relative p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer overflow-hidden ${
                                      selectedStyle === 'flexible' 
                                        ? 'border-blue-500 bg-blue-500/10' 
                                        : 'border-neutral-700 hover:border-neutral-600'
                                    }`}
                                  >
                                    <div className={`absolute inset-0 transition-opacity duration-300 ${
                                      selectedStyle === 'flexible' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                    }`}>
                                      <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000" />
                                    </div>
                                    <div className="relative">
                                      <h3 className="text-white font-medium">Flexible Learning</h3>
                                      <p className="text-sm text-neutral-400 mt-1">Choose challenges based on your interests</p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Reminder Preferences */}
                              <div>
                                <h2 className='text-white text-lg mb-4'>Would you like practice reminders?</h2>
                                <div className="flex items-center space-x-4">
                                  <label className="flex items-center space-x-2">
                                    <input 
                                      type="checkbox" 
                                      className="form-checkbox h-5 w-5 text-blue-600 rounded bg-neutral-700 border-neutral-600"
                                      onChange={(e) => setReminders(e.target.checked)}
                                    />
                                    <span className="text-neutral-300">Email reminders</span>
                                  </label>
                                  <label className="flex items-center space-x-2">
                                    <input 
                                      type="checkbox" 
                                      className="form-checkbox h-5 w-5 text-blue-600 rounded bg-neutral-700 border-neutral-600"
                                      checked={browserNotifications}
                                      onChange={(e) => handleBrowserNotifications(e.target.checked)}
                                    />
                                    <span className="text-neutral-300">Browser notifications</span>
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="relative mt-8 mb-6  overflow-hidden rounded-lg">
                        <div className="absolute inset-0">
                          <div className="" 
                            style={{
                              backgroundImage: `
                                linear-gradient(to right, rgba(55, 65, 81, 0.1) 1px, transparent 1px),
                                linear-gradient(to bottom, rgba(55, 65, 81, 0.1) 1px, transparent 1px)
                              `,
                              backgroundSize: '24px 24px',
                              maskImage: 'linear-gradient(to bottom, transparent, black)',
                              WebkitMaskImage: 'linear-gradient(to bottom, transparent, black)'
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-neutral-800 via-neutral-800/80 to-transparent" />
                        </div>
                      </div>

                      <div className="mt-8 flex justify-end space-x-3">
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-neutral-600 px-4 py-2 text-sm font-medium text-neutral-300 hover:bg-neutral-700 focus:outline-none transition-colors duration-300"
                          onClick={() => setCurrentPage(1)}
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none transition-colors duration-300"
                          onClick={async() => {
                            await saveChanges();
                            onClose();
                          }}
                        >
                          Start Learning
                        </button>
                      </div>
                    </div>
                  </Transition>
                </div>

                {/* Dynamic height transition wrapper */}
                <div 
                  className="transition-[height] duration-300 delay-300"
                  style={{ height: `${contentHeight}px` }}
                >
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}