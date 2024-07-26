import React, { useEffect, useState } from 'react';
import request from '@/utils/request';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useRouter } from 'next/router';

const SolvedChallenges = ({ user }) => {
    const router = useRouter();
    const [solvedChallenges, setSolvedChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSolvedChallenges = async () => {
      
                    const response = await request(`${process.env.NEXT_PUBLIC_API_URL}/users/${user.username}/solvedChallenges`, 'GET', null);
                    setSolvedChallenges(response);
                    setLoading(false);
           
           
        };

        setLoading(true);
        fetchSolvedChallenges();
    }, [user]);

    if (loading) return <div className='text-neutral-400'><Skeleton width="100%" baseColor="#363535" highlightColor="#615f5f"  /></div>;
    if (error) return <div className='text-red-400'>API Error: {error}</div>;


    const colorBG = {
        'BEGINNER': 'bg-blue-500',
        'EASY': 'bg-green-500',
        'MEDIUM': 'bg-orange-500',
        'HARD': 'bg-red-500',
        'INSANE': 'bg-purple-500',
      };

    return (
        <div className="mt-4 rounded-sm text-center text-white">
            {solvedChallenges && solvedChallenges.length > 0 ? (
            <div>
                {solvedChallenges.map(challenge => (
                    <div onClick={() => {
                        router.push(`/challenges/${challenge.id}`);
                    }} className='mt-2 hover:bg-neutral-700/40 cursor-pointer list-none text-center text-white flex bg-neutral-700/50 px-4 py-4' key={challenge.id}>
                     
                      <div>
                      {challenge.title} 
                      </div>

                        <div className='ml-auto '>
                        <span className={`text-sm ${colorBG[challenge.difficulty]} px-2 py-1 rounded-sm ml-4 lowercase`}> {challenge.difficulty}</span>&nbsp;&nbsp;<span className={`text-sm bg-neutral-700 px-2 py-1 rounded-sm mr-4`}> {challenge.category}</span>

                       
                                <span className="text-sm text-white">{challenge.upvotes} <i className="fas fa-arrow-up text-green-500"></i></span>
                                <span className="ml-2 text-sm text-white">{challenge.downvotes} <i className="fas fa-arrow-down text-red-500"></i></span>
                            </div>
                    
                    
                    
                    </div>
                    ))}
                </div>
            ) : (
                <div className="align-center duration-4000 col-span-5 mx-auto min-h-[190px] w-full min-w-[200px] rounded-sm border border-2 border-neutral-700 bg-neutral-800 px-4 py-4 text-center transition ease-in-out hover:bg-neutral-700/40">
            <img src={'/CuteKana.png'} width="100" className="mx-auto mt-2 px-1" />
            <h1 className="mx-auto mt-2 text-center text-xl text-white">No Challenges Solved Yet...</h1>
          </div>
            )}
        </div>
    );
};

export default SolvedChallenges;