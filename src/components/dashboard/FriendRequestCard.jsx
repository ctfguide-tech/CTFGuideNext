import Link from 'next/link';

export function FriendRequestCard({ username, followers, following, onAccept, onDecline }) {
    return (
        <div className='mx-auto mt-6 border border-neutral-500 w-5/6'>
            <div className="py-8 text-neutral-500 text-center flex items-center w-full text-white">
                <Link href={`/users/${username}`}>
                    <img
                        style={{ borderColor: '#212121', height: "100px", width: "100px" }}
                        className="mx-5 h-15 w-15 rounded-full border bg-black hover:bg-[#212121]"
                        src={`https://robohash.org/${username}.png?set=set1&size=150x150`}
                        alt=""
                    />
                </Link>
                <h1 className="mt-2 mx-5 text-l font-bold text-white">{username}</h1>
                <h2 className="mt-2 mx-5 text-l font-bold text-white">Followers: {followers}</h2>
                <h2 className="mt-2 mx-5 text-l font-bold text-white">Following: {following}</h2>
                <button
                    className="mt-2 mx-5 px-2 py-2 text-l font-bold text-white bg-green-500 hover:bg-green-700"
                    onClick={onAccept}>Accept
                </button>
                <button
                    className="mt-2 mx-5 px-2 py-2 text-l font-bold text-white bg-red-500 hover:bg-red-700"
                    onClick={onDecline}>Deny
                </button>
            </div>
        </div>
    );
};