import React, { useEffect, useState } from 'react';
import request from '@/utils/request';

const LikedChallenges = ({ user }) => {
    const [likedChallenges, setLikedChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLikedChallenges = async () => {
            try {
                const response = await request(`/api/users/${user}/likes`, 'GET', null);
                setLikedChallenges(response);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLikedChallenges();
    }, [user]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            {likedChallenges ? (
            <ul>
                {likedChallenges.map(challenge => (
                    <li key={challenge.id}>{challenge.name}</li>
                    ))}
                </ul>
            ) : (
                <p className='text-neutral-400'>No challenges liked yet.</p>
            )}
        </div>
    );
};

export default LikedChallenges;