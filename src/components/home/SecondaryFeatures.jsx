'use client'

import { useEffect, useId, useRef } from 'react'
import Image from 'next/image'
import { Tab } from '@headlessui/react'
import clsx from 'clsx'

import { Container } from '@/components/Container'

const features = [
  {
    name: 'AI Grader',
    summary: 'Labs automatically graded using AI.',
    description:
      'We use AI to automatically grade sessions, saving you time and effort.',
    image: '../../aigrader.mp4',
    icon: function ReportingIcon() {
      let id = useId()
      return (
        <>
          <defs>
            <linearGradient
              id={id}
              x1="11.5"
              y1={18}
              x2={36}
              y2="15.5"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset=".194" stopColor="#fff" />
              <stop offset={1} stopColor="#6692F1" />
            </linearGradient>
          </defs>
          <path
            d="m30 15-4 5-4-11-4 18-4-11-4 7-4-5"
            stroke={`url(#${id})`}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )
    },
  },
  {
    name: 'Submission Playback',
    summary:
      'Review recorded student lab sessions.',
    description:
      'We automatically records lab sessions, so you can review them later.',
    image: '../../videoproof.mp4',
    icon: function InventoryIcon() {
      return (
        <>



          <svg xmlns="http://www.w3.org/2000/svg" opacity=".5" fill="#fff"
            viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" />
          </svg>

        </>
      )
    },
  },
  {
    name: 'Virtual Machines',
    summary:
      'Cloud machines streamed to the browser.',
    description:
      'Easily access cloud machines from your browser, no need to install anything.',
    image: '../../terminalproof.mp4',
    icon: function ContactsIcon() {
      return (
        <>



          <svg xmlns="http://www.w3.org/2000/svg" opacity=".5" fill="#fff" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 17.25v-.228a4.5 4.5 0 0 0-.12-1.03l-2.268-9.64a3.375 3.375 0 0 0-3.285-2.602H7.923a3.375 3.375 0 0 0-3.285 2.602l-2.268 9.64a4.5 4.5 0 0 0-.12 1.03v.228m19.5 0a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3m19.5 0a3 3 0 0 0-3-3H5.25a3 3 0 0 0-3 3m16.5 0h.008v.008h-.008v-.008Zm-3 0h.008v.008h-.008v-.008Z" />
          </svg>



        </>
      )
    },
  },
]

function Feature({ feature, isActive, className, ...props }) {
  return (
    <div
      className={clsx(className, !isActive && 'opacity-75 hover:opacity-100')}
      {...props}
    >
      <div
        className={clsx(
          'w-9 rounded-lg',
          isActive ? 'bg-blue-600' : 'bg-neutral-900',
        )}
      >
        <svg aria-hidden="true" className="h-9 w-9" fill="none">
          <feature.icon />
        </svg>
      </div>
      <h3
        className={clsx(
          'mt-6 text-sm font-medium',
          isActive ? 'text-blue-600' : 'text-white',
        )}
      >
        {feature.name}
      </h3>
      <p className="mt-2 font-display text-xl text-white">
        {feature.summary}
      </p>
      <p className="mt-4 text-sm text-white">{feature.description}</p>
    </div>
  )
}

function FeaturesMobile() {
  let observer = useRef(null);

  useEffect(() => {
    if (!observer.current) {
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].intersectionRatio > 0.4) {
          entries[0].target.play();
        } else {
          entries[0].target.pause();
        }
      }, { threshold: [0, 0.5] });
    }
  }, []);

  return (
    <div className="-mx-4 mt-20 flex flex-col gap-y-10 overflow-hidden px-4 sm:-mx-6 sm:px-6 lg:hidden">
      {features.map((feature) => (
        <div key={feature.summary}>
          <Feature feature={feature} className="mx-auto max-w-2xl" isActive />

          <video
            className="mt-4 object-contain rounded-xl shadow-xl h-auto m-auto ring-1 ring-gray-400/10 w-full"
            width={2432}
            height={1442}
            muted
            ref={(el) => setTimeout(() => { el && observer.current.observe(el) })}

            autoSave='true'
            loop
            onLoadedMetadata={(e) => {
              e.target.currentTime = 2; // Skip first two seconds
            }}
          >
            <source src={feature.image}
              type="video/mp4" >
            </source>
          </video>
        </div>
      ))}
    </div>
  )
}

function FeaturesDesktop() {
  let observer = useRef(null);
  let selectedVideo = useRef(null);

  useEffect(() => {
    if (!observer.current) {
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].intersectionRatio > 0.4) {
          selectedVideo.current?.play();
        } else {
          selectedVideo.current?.pause();
        }
      }, { threshold: [0, 0.5] });
    }
  }, []);

  let previousVideo = null;
  const restartVideo = (id) => {
    if (typeof window === "undefined") {
      return;
    }
    const vid = document.getElementById(id);
    if (!vid || previousVideo == vid) {
      return;
    }
    selectedVideo.current = vid;
    vid.currentTime = 0;
    if (previousVideo !== null) {
      vid.play();
      previousVideo.pause();
      previousVideo.currentTIme = 0;
    }

    previousVideo = vid;
  };

  return (
    <Tab.Group as="div" ref={(el) => setTimeout(() => el && observer.current?.observe(el) || restartVideo("video-0"))} className="hidden lg:mt-20 lg:block" onChange={(id) => restartVideo("video-" + id.toString())}>
      {({ selectedIndex }) => {
        return (
          <>
            <Tab.List className="grid grid-cols-3 gap-x-8">
              {features.map((feature, featureIndex) => (
                <Feature
                  key={feature.summary}
                  feature={{
                    ...feature,
                    name: (
                      <Tab className="ui-not-focus-visible:outline-none focus-outline-none focus:outline-none outline-none">
                        <span className="absolute inset-0" />
                        {feature.name}
                      </Tab>
                    ),
                  }}
                  isActive={selectedIndex === featureIndex}
                  className="relative"
                />
              ))}
            </Tab.List>
            <Tab.Panels className="relative mt-20 overflow-hidden rounded-4xl bg-neutral-800 px-14 py-16 xl:px-16">
              <div className="-mx-5 flex">
                {features.map((feature, featureIndex) => (
                  <Tab.Panel
                    static
                    key={feature.summary}
                    className={clsx(
                      'px-5 transition duration-500 ease-in-out ui-not-focus-visible:outline-none',
                      featureIndex !== selectedIndex && 'opacity-60',
                    )}
                    style={{ transform: `translateX(-${selectedIndex * 100}%)` }}
                    aria-hidden={featureIndex !== selectedIndex}
                  >
                    <div className="w-[52.75rem] overflow-hidden rounded-xl bg-neutral-900 shadow-lg shadow-slate-900/5 ring-1 ring-slate-500/10">

                      <video className='w-full'
                        muted
                        width={1055}
                        height={810}
                        autoSave='true'
                        loop
                        onLoadedMetadata={(e) => {
                          e.target.currentTime = 2; // Skip first two seconds
                        }}
                        id={"video-" + featureIndex.toString()}
                      >
                        <source src={feature.image}
                          type="video/mp4" >
                        </source>
                      </video>



                    </div>
                  </Tab.Panel>
                ))}
              </div>
              <div className="pointer-events-none absolute inset-0 rounded-4xl ring-1 ring-inset ring-slate-900/10" />
            </Tab.Panels>
          </>
        )
      }}
    </Tab.Group>
  )
}

export function SecondaryFeatures() {
  return (
    <section
      id="secondary-features"
      aria-label="Features for simplifying everyday business tasks"
      className="pb-14 pt-20 sm:pb-20 sm:pt-32 lg:pb-32"
    >
      <Container>
        <div className="mx-auto max-w-6xl md:text-center">
          <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl">
            We're the best platform for teaching cybersecurity.
          </h2>

        </div>
        <div className='max-w-7xl mx-auto'>
          <FeaturesMobile />
          <FeaturesDesktop />
        </div>
      </Container>
    </section>
  )
}
