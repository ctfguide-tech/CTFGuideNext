import React, { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen, faBolt, faComments, faTrophy, faPenFancy, faLightbulb } from '@fortawesome/free-solid-svg-icons';

const features = [
  {
    name: 'Challenge Writeups',
    description: 'Detailed solutions and explanations for various challenges.',
    icon: faBookOpen,
  },
  {
    name: 'Dynamic Labs',
    description: 'Engage with interactive and dynamic lab environments instead of static CTFs.',
    icon: faBolt,
  },
  {
    name: 'Comments',
    description: 'Share your thoughts and collaborate through comments on each challenge.',
    icon: faComments,
  },
  {
    name: 'Leaderboard',
    description: 'See where you stand among peers with our real-time leaderboard.',
    icon: faTrophy,
  },
  {
    name: 'Share your own write ups',
    description: 'Contribute your own solutions and help the community grow.',
    icon: faPenFancy,
  },
  {
    name: 'Hints',
    description: 'Stuck on a problem? Access hints to help guide your solving process.',
    icon: faLightbulb,
  },
]

export default function GP() {
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, []);

  return (
    <div className="bg-neutral-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl sm:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">CTFGuide Practice Range</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Never run out of practice material.</p>
          <p className="mt-6 text-lg leading-8 text-white">
            Access community uploaded challenges, writeups, and dynamic labs to help you improve your skills and prepare for competitions.
          </p>
        </div>
      </div>
      <div className="relative overflow-hidden pt-16">
        <div ref={imgRef} className="mx-auto max-w-7xl px-6 lg:px-8">
          {isVisible && (
            <img
              src="../site.png"
              alt="App screenshot"
              className="mb-[-12%] rounded-xl shadow-2xl ring-1 ring-neutral-800"
              width={2432}
              height={1442}
            />
          )}
          <div className="relative" aria-hidden="true">
            <div className="absolute -inset-x-20 bottom-0 bg-gradient-to-t from-neutral-900 pt-[7%]" />
          </div>
        </div>
      </div>
      <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
        <dl className="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 text-base leading-7 text-white sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
          {features.map((feature) => (
            <div key={feature.name} className="relative pl-9">
              <dt className="inline font-semibold text-white">
                <FontAwesomeIcon icon={feature.icon} className="absolute left-1 top-1 h-5 w-5 text-blue-600" aria-hidden="true" />
                {feature.name}
              </dt>{' '}
              <dd className="inline">{feature.description}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}

