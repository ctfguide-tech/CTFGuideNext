export function Likes(props) {
  return (
    <>
      <h1 className="mt-5 text-4xl text-white">Likes</h1>
      {/* Fetch likes from API */}
      <div className="mt-5 flex flex-col">
        {props.likes.map((like) => (
          <div className='border border-blue-400 bg-["#212121"] hover:bg-["#303030"]'>
            <a
              href={like.challengeUrl}
              className="align-center mb-4 flex rounded-lg px-5 py-3 text-white"
            >
              <h2 className="align-middcenterle text-xl font-semibold">
                {like.challenge.title}
              </h2>

              <div className="align-center ml-auto mt-1 flex">
                <p> {like.challenge.category.join(', ')}</p>
              </div>
            </a>
          </div>
        ))}
      </div>
    </>
  );
}
