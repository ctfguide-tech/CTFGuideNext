export function ChallengeCard() {
    return (
        <>
            <div className='max-w-7xl mx-auto mt-4'>
                <div className="px-6 py-2.5 mx-auto  rounded-lg bg-neutral-800 flex">
                    <div className="text-white text-2xl my-auto">Challenge Name</div>
                    <div className='ml-auto flex'>
                    <div className="mr-2  px-6 py-2.5 mx-auto text-center  text-red-500 rounded-lg bg-neutral-900">
                        Delete
                    </div>
                    <div className=" px-6 py-2.5 mx-auto text-center  text-white  rounded-lg bg-neutral-900">
                        Edit
                    </div>
                    </div>
                </div>
            </div>
        </>
    )
}