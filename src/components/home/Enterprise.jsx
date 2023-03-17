import { CloudIcon, BookOpenIcon, TrophyIcon, ArrowRightIcon } from '@heroicons/react/20/solid'

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

export function Enterprise() {
    return (
        <div className="overflow-hidden  py-24 sm:py-32" style={{ backgroundColor: "#161716" }} >
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div class="grid lg:grid-cols-4 md:grid-cols-4 grid-cols-1 mx-auto">
    <div class="col-span-3">
        <h1 class="text-white font-bold text-5xl w-4/5 leading-tight">Supercharge your hiring like never before.</h1>
        <h1 class="text-white text-3xl mt-5 leading-tight">Evaluate employees in seconds, not days.</h1>
        <h1 class="text-white text-3xl leading-tight">Streamline your onboarding experience.</h1>
        <a href="https://enterprise.ctfguide.com" class="text-blue-500 text-xl mt-5 flex">Learn more about what we can do for your business<ArrowRightIcon className='h-6 mt-1 ml-1'/></a>
    </div>
    <div class="col-span-1 mx-auto my-auto md:flex md:items-center md:justify-center">
        <img width="200" src="rocket.png" alt="Rocket image"/>
    </div>
</div>
            </div>


        </div>

    )
}
