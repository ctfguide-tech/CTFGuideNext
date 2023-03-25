import { EyeIcon, PencilIcon } from '@heroicons/react/20/solid';

export function ChallengeCard({challenge}) {
    return (
        <>
            <div className='pl-5 w-full  mt-4'>
                <div className="border-l-4 border-blue-600 px-6 py-2.5 mx-auto rounded-lg hover:outline-neutral-700 bg-[#212121] hover:bg-[#2c2c2c] flex">
                    <div className="text-white text-lg my-auto mr-6">{challenge.title}</div>
                    <div className="bg-neutral-900 border-blue-700 border hover:bg-neutral-800 rounded-md my-auto">
                        <div className="px-3 my-auto mx-auto text-center text-md text-white rounded-lg">
                            {challenge.category[0]}
                        </div>
                    </div>
                    <div className="ml-6 px-3 my-auto text-center text-sm text-white rounded-lg bg-neutral-900 border-blue-500 border hover:bg-neutral-800">
                        {challenge.views} View(s)
                    </div>
                    <div className="ml-6 px-3 my-auto text-center text-sm text-white rounded-lg bg-neutral-900 border-blue-300 border hover:bg-neutral-800">
                        {challenge.attempts} Attempt(s)
                    </div>
                    <div className="ml-6 px-3 my-auto text-center text-sm text-white rounded-lg bg-neutral-900 border-green-500 border hover:bg-neutral-800">
                        {challenge.goodAtmps} Good Attempt(s)
                    </div>
                    <div className='ml-auto flex'>
                    {(challenge.state == "STANDARD_VERIFIED") && <div className="flex pl-5 pr-3 mx-auto text-center py-2.5 mx-auto text-center text-white rounded-lg bg-neutral-900">    
                        <a href={`/challenge?slug=${challenge.slug}`}><EyeIcon className='text-white h-5 mr-2 '/> </a>
                    </div>}
                    {(challenge.state == "STANDARD_PENDING") && 
                    <a href={'../create/edit?slug=' + challenge.slug} className="flex ml-4 mr-2 px-2 py-2.5 mx-auto text-center text-white rounded-lg bg-neutral-900">  
                        <PencilIcon className='text-white h-5 mr-2 '/>
                    </a>}
                    {(challenge.state == "STANDARD_UNVERIFIED" || challenge.state == "STANDARD_PENDING") && <div className="ml-4 mr-2 px-2 py-2.5 mx-auto text-center text-red-500 cursor-pointer rounded-lg bg-neutral-900">
                        Delete
                    </div>}
                    </div>
                </div>
            </div>
        </>
    )
}