import { CloudIcon, BookOpenIcon, TrophyIcon } from '@heroicons/react/20/solid'

const features = [
    {
        name: 'Cloud Terminals',
        description:
            'Run your cybersecurity tools on the cloud, no need to install anything on your machine.',
        icon: CloudIcon,
    },
    {
        name: 'Practice Problems',
        description: 'Get access to hundreds of challenges uploaded by our community.',
        icon: BookOpenIcon,
    },
    {
        name: 'Competitions',
        description: 'Compete in real-time with other hackers from around the world.',
        icon: TrophyIcon,
    },
]

export function LearningPanel() {
    return (
        <div className="overflow-hidden  py-24 sm:py-32" style={{ backgroundColor: "#161716" }} >
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto grid max-w-2xl grid-cols-1 gap-y-16 gap-x-8 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
                    <div className='  mx-auto my-auto'>
                        <h1 className='font-semibold text-white text-4xl tracking-tight mb-5'> Get AI driven feedback during your sessions.
                        </h1>     
                        <p1 className=" text-white text-xl">We help identify strengths and weaknesses and determine what can be improved on.</p1>
           </div>
                    <div className='text-white text-4xl font-semibold mx-auto'>
                        <img src="./group14.png"></img>
                    </div>


                    <div className='text-white text-4xl font-semibold mx-auto'>
                        <img src="./group21.png"></img>
                    </div>

                    <div className='  mx-auto my-auto'>
                        <div className='flex'>
                            <h1 className='font-semibold text-white text-4xl mb-5'>          Dynamic Roadmaps</h1>
                        </div>
                        
                        <p className=" text-white text-xl">
                        Get a personalized roadmap based on your skill level and learning goals.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
