export function Likes(props) {
    return (
        <>
            <h1 className='text-white text-4xl mt-5'>Likes</h1>
            {/* Fetch likes from API */}
            <div className="flex flex-col mt-5">
                {props.likes.map((like) => (
                    <div className='bg-["#212121"] hover:bg-["#303030"] border border-blue-400'>
                        <a href={like.challengeUrl} className='mb-4 flex rounded-lg px-5 py-3 text-white align-center'>
                            <h2 className='text-xl font-semibold align-middcenterle'>{like.challenge.title}</h2>

                            <div className='ml-auto flex align-center mt-1'>
                                <p> {like.challenge.category.join(", ")}</p>
                            </div>
                        </a>
                    </div>
                ))}
            </div>
        </>
    )
}