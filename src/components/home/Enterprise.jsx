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

export function Enterprise() {
    return (
        <div className="overflow-hidden  py-24 sm:py-32" style={{ backgroundColor: "#161716" }} >
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div class="grid lg:grid-cols-4 md:grid-cols-4 grid-cols-1 mx-auto">
    <div class="col-span-3">
        <h1 class="text-white font-bold text-6xl w-4/5 leading-tight">Supercharge your hiring like never before.</h1>
        <h1 class="text-white  text-4xl mt-5 leading-tight">Evaluate employees in seconds not days.</h1>
        <h1 class="text-white  text-4xl leading-tight">Streamline your onboarding experience.</h1>
        <button class="text-blue-600 text-xl mt-5">Learn more about what we can do for your business.</button>
    </div>
    <div class="col-span-1 mx-auto my-auto md:flex md:items-center md:justify-center">
        <img width="200" src="rocket.png" alt="Rocket image"/>
    </div>
</div>
            </div>


        </div>

    )
}
