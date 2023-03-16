import { EyeIcon, PencilIcon, DocumentMagnifyingGlassIcon } from '@heroicons/react/20/solid';

export function ChallengeCard({challenge}) {
    return (
        <>
            <div className='max-w-7xl mx-auto mt-4'>
                <div className="px-6 py-2.5 mx-auto rounded-lg outline outline-neutral-800 hover:outline-neutral-700 bg-[#212121] hover:bg-[#2c2c2c] flex">
                    <div className="text-white text-2xl my-auto mr-6">{challenge.title}</div>
                    <div className="bg-neutral-900 border-blue-700 border hover:bg-neutral-800 rounded-md">
                        <div className="px-3 py-2.5 mx-auto text-center text-md text-white rounded-lg">
                            {challenge.category[0]}
                        </div>
                    </div>
                    <div className="ml-6 px-1.5 py-2.5 text-center text-sm text-white rounded-lg bg-neutral-900 border-blue-500 border hover:bg-neutral-800">
                        {challenge.views} View(s)
                    </div>
                    <div className="ml-6 px-1.5 py-2.5 text-center text-sm text-white rounded-lg bg-neutral-900 border-blue-300 border hover:bg-neutral-800">
                        {challenge.attempts} Attempt(s)
                    </div>
                    <div className="ml-6 px-1.5 py-2.5 text-center text-sm text-white rounded-lg bg-neutral-900 border-green-500 border hover:bg-neutral-800">
                        {challenge.goodAtmps} Good Attempt(s)
                    </div>
                    <div className='ml-auto flex'>
                    {(challenge.state == "STANDARD_VERIFIED") && <div className="flex mr-2 px-6 py-2.5 mx-auto text-center text-white rounded-lg bg-neutral-900">
                        <EyeIcon className='text-white h-5 mr-2'/> View
                    </div>}
                    {(challenge.state == "STANDARD_PENDING") && <div className="flex mr-2 px-6 py-2.5 mx-auto text-center text-white rounded-lg bg-neutral-900">
                        <PencilIcon className='text-white h-5 mr-2'/> Edit
                    </div>}
                    {(challenge.state == "STANDARD_UNVERIFIED" || challenge.state == "STANDARD_PENDING") && <div className="mr-2 px-6 py-2.5 mx-auto text-center text-red-500 rounded-lg bg-neutral-900">
                        Delete
                    </div>}
                    </div>
                </div>
            </div>
        </>
    )
}