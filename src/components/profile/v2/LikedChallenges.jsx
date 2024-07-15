import React, { useEffect, useState } from 'react';
import request from '@/utils/request';

const LikedChallenges = ({ user }) => {
    const [likedChallenges, setLikedChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLikedChallenges = async () => {
            try {
                console.log("udata", user)
                console.log("username", user.username);
                if (user.username) {
                    const response = await request(`${process.env.NEXT_PUBLIC_API_URL}/users/${user.username}/likes`, 'GET', null);
                
                    setLikedChallenges(response.data);
                
                        } else {
                            setError("User failure. Got back username of " + user.username);
                        }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLikedChallenges();
        console.log("challenges: " , likedChallenges);
    }, [user]);

    if (loading) return <div className='text-neutral-400'>Loading...</div>;
    if (error) return <div className='text-red-400'>API Error: {error}</div>;

    return (
        <div className="mt-4 rounded-sm">
            {likedChallenges ? (
            <ul>
                {likedChallenges.map(challenge => (
                    <li key={challenge.id}>{challenge.name}</li>
                    ))}
                </ul>
            ) : (
                <div className="align-center duration-4000 col-span-5 mx-auto min-h-[190px] w-full min-w-[200px] rounded-sm border border-2 border-neutral-700 bg-neutral-800 px-4 py-4 text-center transition ease-in-out hover:bg-neutral-700/40">
            <img src={'/CuteKana.png'} width="100" className="mx-auto mt-2 px-1" />
            <h1 className="mx-auto mt-2 text-center text-xl text-white">No Challenges Liked Yet...</h1>
          </div>
            )}
        </div>
    );
};

export default LikedChallenges;