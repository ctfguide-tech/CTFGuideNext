import {
  ClockIcon,
  Battery50Icon,
  CheckBadgeIcon,
} from '@heroicons/react/20/solid';

export function LearningPanel() {
  return (
    <div
      className="overflow-hidden py-24 sm:py-32"
      style={{ backgroundColor: '#161716' }}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-y-40 gap-x-8 sm:gap-y-40 lg:visible sm:visible md:visible  lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="col-span-1 mx-auto mr-24 text-4xl font-semibold text-white">
            <video
              muted
              autoPlay
              width={2432}
              height={1442}
              className=" rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10  mt-4 "
         
              >
                <source src="https://github.com/ctfguide-tech/CTFGuideNext/raw/main/public/video2.mp4" type="video/mp4" />

              </video>
          </div>
          <div className="mx-auto my-auto">
            <h1 className="mb-5 text-2xl font-semibold tracking-tight text-white">
              {' '}
              Get AI driven feedback during your sessions
            </h1>
            <p1 className=" text-xl text-white">
              We help identify strengths and weaknesses and determine what can
              be improved on.
            </p1>
            <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-white lg:max-w-none">
              <div className="relative pl-9">
                <h1 className="text-md inline font-semibold text-teal-300">
                  <ClockIcon
                    className="absolute top-1 left-1 h-5 w-5 text-teal-300"
                    aria-hidden="true"
                  />
                  Time
                </h1>{' '}
                <dd className="ml-1 inline">
                  How fast can you solve a problem?
                </dd>
              </div>
              <div className="relative pl-9">
                <h1 className="text-md inline font-semibold text-green-400">
                  <Battery50Icon
                    className="absolute top-1 left-1 h-5 w-5 text-green-400"
                    aria-hidden="true"
                  />
                  Efficiency
                </h1>{' '}
                <dd className="ml-1 inline">
                  How efficient are your actions in the terminal?
                </dd>
              </div>
              <div className="relative pl-9">
                <h1 className="text-md inline font-semibold text-purple-400">
                  <CheckBadgeIcon
                    className="absolute top-1 left-1 h-5 w-5 text-purple-400"
                    aria-hidden="true"
                  />
                  Recommendation
                </h1>{' '}
                <dd className="ml-1 inline">
                  Based on your performance, what should you practice next?
                </dd>
              </div>
            </dl>
          </div>
          <div className=" mx-auto my-auto mt-10">
            <div className="">
              <h1 className="mb-5 text-4xl font-semibold text-white">
                {' '}
                Dynamic Roadmaps
              </h1>
            </div>

            <p className="text-xl  text-white">
              Get a personalized learning roadmap based on your skill level and
              learning goals.
            </p>
          </div>
          <div className=" mx-auto text-center ml-16 w-full text-4xl font-semibold text-white">
            <img  src="./group24.png"></img>
          </div>
        </div>
      </div>
    </div>
  );
}
