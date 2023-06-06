import {
  CloudIcon,
  BookOpenIcon,
  TrophyIcon,
  ArrowRightIcon,
} from '@heroicons/react/20/solid';

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

export function Enterprise() {
  return (
    <div
      className="overflow-hidden  py-24 sm:py-32"
      style={{ backgroundColor: '#161716' }}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="mx-auto grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4">
          <div class="col-span-3">
            <h1 class="w-4/5 text-5xl font-bold leading-tight text-white">
              Supercharge your hiring like never before.
            </h1>
            <h1 class="mt-5 text-3xl leading-tight text-white">
              Evaluate employees in seconds, not days.
            </h1>
            <h1 class="text-3xl leading-tight text-white">
              Streamline your onboarding experience.
            </h1>
           
          </div>
          <div class="col-span-1 mx-auto my-auto md:flex md:items-center md:justify-center">
            <img width="200" src="rocket.png" alt="Rocket image" />
          </div>
        </div>
      </div>
    </div>
  );
}
