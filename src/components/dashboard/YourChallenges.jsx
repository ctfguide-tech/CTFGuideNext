export function YourChallenges(props) {

    return (
        <>
            <h1 className='text-white text-4xl mt-5'>Your Challenges</h1>
            {props.challenges.map((challenge) => (
            <div className='bg-neutral-800 w-full text-white rounded-lg'>
                <h1 className='text-2xl px-2 py-2'>{challenge.slug} </h1>
            </div>
            ))}
        </>
    )
}

