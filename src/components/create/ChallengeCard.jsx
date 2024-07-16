import { EyeIcon, PencilIcon } from '@heroicons/react/20/solid';

export function ChallengeCard({ challenge }) {
  return (
    <div className="mt-4 w-full pl-5">
      <div className="mx-auto flex flex-col rounded-lg border-l-4 border-green-500 bg-[#212121] p-6 hover:bg-[#2c2c2c] hover:outline-neutral-700">
        <div className="flex justify-between">
          <div className="text-2xl font-bold text-white">
            {challenge.title}
          </div>
          <div className="text-sm text-gray-400">
            {new Date(challenge.date).toLocaleDateString()}
          </div>
        </div>
        <div className="mt-2 flex items-center text-gray-400">
          <span className="mr-2">@{challenge.author}</span>
        </div>
        <div className="mt-4 text-gray-300">
          {challenge.description}
        </div>
        <div className="mt-4 flex items-center">
          <div className="flex items-center text-white">
            <span className="mr-2">
              <EyeIcon className="h-5 text-white" />
            </span>
            {challenge.views}
          </div>
          <div className="ml-4 flex items-center text-white">
            <span className="mr-2">
              <PencilIcon className="h-5 text-white" />
            </span>
            {challenge.attempts}
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <div className="flex items-center text-white">
            <span className="mr-2">
              <EyeIcon className="h-5 text-white" />
            </span>
            {challenge.goodAtmps}
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <div className="flex items-center text-white">
            <span className="mr-2">
              <EyeIcon className="h-5 text-white" />
            </span>
            {challenge.category}
          </div>
          <div className="ml-4 flex items-center text-white">
            <span className="mr-2">
              <PencilIcon className="h-5 text-white" />
            </span>
            {challenge.difficulty}
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <div className="flex items-center text-white">
            <span className="mr-2">
              <EyeIcon className="h-5 text-white" />
            </span>
            {challenge.likes}
          </div>
        </div>
      </div>
    </div>
  );
}