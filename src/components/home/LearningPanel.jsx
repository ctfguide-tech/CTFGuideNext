import { CloudIcon, BookOpenIcon, TrophyIcon, ClockIcon, Battery50Icon, CheckBadgeIcon, LightBulbIcon } from '@heroicons/react/20/solid'

export function LearningPanel() {
    return (
        <div className="overflow-hidden py-24 sm:py-32" style={{ backgroundColor: "#161716" }} >
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto grid max-w-2xl grid-cols-1 gap-y-16 gap-x-8 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
                    <div className='text-white text-4xl font-semibold mx-auto mr-24'>
                        <img className="mr-24 w-full" src="./group14.png"></img>
                    </div>
                    <div className='mx-auto my-auto'>
                        <h1 className='font-semibold text-white text-4xl tracking-tight mb-5'> Get AI driven feedback during your sessions
                        </h1>     
                        <p1 className=" text-white text-xl">We help identify strengths and weaknesses and determine what can be improved on.</p1>
                        <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-white lg:max-w-none">
                            <div className="relative pl-9">
                                <h1 className="inline text-md font-semibold text-teal-300">
                                <ClockIcon className="absolute top-1 left-1 h-5 w-5 text-teal-300" aria-hidden="true" />
                                    Time
                                </h1>{' '}
                                <dd className="ml-1 inline">How fast can you solve a problem?</dd>
                            </div>
                            <div className="relative pl-9">
                                <h1 className="inline text-md font-semibold text-green-400">
                                <Battery50Icon className="absolute top-1 left-1 h-5 w-5 text-green-400" aria-hidden="true" />
                                    Efficiency
                                </h1>{' '}
                                <dd className="ml-1 inline">How efficient are your actions in the terminal?</dd>
                            </div>
                            <div className="relative pl-9">
                                <h1 className="inline text-md font-semibold text-purple-400">
                                <CheckBadgeIcon className="absolute top-1 left-1 h-5 w-5 text-purple-400" aria-hidden="true" />
                                    Recommendation
                                </h1>{' '}
                                <dd className="ml-1 inline">Based on your performance, what should you practice next?</dd>
                            </div>
                        </dl>
                    </div>
                    <div className='mx-auto my-auto'>
                        <div className='flex'>
                            <h1 className='font-semibold text-white text-4xl mb-5'>          Dynamic Roadmaps</h1>
                        </div>
                        
                        <p className="text-white text-xl">
                        Get a personalized learning roadmap based on your skill level and learning goals.
                        </p>
                    </div>
                    <div className='ml-16 w-full text-white text-4xl font-semibold mx-auto'>
                        <img src="./group21.png"></img>
                    </div>
                </div>
            </div>
        </div>
    )
}
