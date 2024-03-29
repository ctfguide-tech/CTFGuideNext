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
    <div className="overflow-hidden py-24 sm:py-32" style={{ backgroundColor: '#161716' }}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4">
          <div className="col-span-3">
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Level up your classroom with AI enhanced learning.
            </h1>
            <h1 className="text-xl text-white mt-4">
             Use CTFGuide AI to automatically grade real-world cybersecurity scenerios. Full session recordings are available for review.
            </h1>
          </div>
          <div className="col-span-1 mx-auto my-auto md:flex md:items-center md:justify-center">
            <img className="w-48 md:w-64" src="rocket.png" alt="Rocket image" />
          </div>
        </div>
      </div>
    </div>
  );
}
