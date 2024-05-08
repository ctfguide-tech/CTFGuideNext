import { CloudIcon, BookOpenIcon, TrophyIcon } from '@heroicons/react/20/solid';
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import VisibilitySensor from 'react-visibility-sensor';

const features = [
  {
    name: 'Cloud Terminals',
    description:
      'Run your cybersecurity tools on the cloud, no need to install anything on your machine.',
    icon: CloudIcon,
  },
  {
    name: 'Practice Problems',
    description:
      'Get access to hundreds of challenges uploaded by our community.',
    icon: BookOpenIcon,
  },
  {
    name: 'Competitions',
    description:
      'Compete in real-time with other hackers from around the world.',
    icon: TrophyIcon,
  },
];

export function FeaturesPanel() {
  const imageRef = useRef(null);

  const handleVisibilityChange = (isVisible) => {
    if (isVisible) {
      imageRef.current.style.visibility = 'visible';
    }
  };

  return (
    <div
      className="overflow-hidden  py-24 sm:py-32"
      style={{ backgroundColor: '#212121' }}
    >
      <div className="mx-auto px-20 lg:px-20">
        <div className="flex justify-center items-center flex-col lg:flex-row gap-y-16 gap-x-10 sm:gap-y-20 lg:mx-0 w-full">
          <div className="lg:pr-8 lg:pt-4 max-w-2xl shrink grow-0">
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              A different take on ethical hacking
            </p>
            <p className="mt-6 text-lg leading-8 text-white">
              Our approach puts a strong emphasis on hands-on learning and
              community engagement, providing a dynamic and supportive
              environment for you to hone your skills.{' '}
            </p>
            <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-white lg:max-w-full">
              {features.map((feature) => (
                <div key={feature.name} className="relative pl-9">
                  <dt className="inline font-semibold text-white">
                    <feature.icon
                      className="absolute top-1 left-1 h-5 w-5 text-blue-600"
                      aria-hidden="true"
                    />
                    {feature.name}
                  </dt>{' '}
                  <dd className="inline">{feature.description}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className='flex h-auto flex-1 lg:min-w-[475px] max-w-3xl'>
            <img
              ref={imageRef}
              src="./mock2.png"
              alt="Product screenshot"
              className="object-contain rounded-xl shadow-xl h-auto m-auto ring-1 ring-gray-400/10 w-full"
              width={2432}
              height={1442}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
