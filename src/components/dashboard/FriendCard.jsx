import Link from 'next/link';

export function FriendCard({ username, bio, badges, followers, following }) {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (

      <div
        className="py-4 mt-5 text-white text-center border border-neutral-500"
      >
        <Link href={`/users/${username}`}>
          <img
            style={{ borderColor: '#212121' }}
            className="mx-auto h-22 w-22 rounded-full border bg-neutral-900 hover:bg-[#212121]"
            src={`https://robohash.org/${username}.png?set=set1&size=150x150`}
            alt=""
          />
        </Link>
        <h1 className="mt-4 text-xl font-bold text-blue-500">{username}</h1>
        <h2>Followers: {followers}</h2>
        <h2>Following: {following}</h2>
        {bio &&
          <hr className='mt-4 border-gray-500 w-4/5 mx-auto'></hr>
        }
        <p className="mt-4 text-lg px-2 leading-relaxed text-gray-300">
        
        </p>
      </div>
  );
};