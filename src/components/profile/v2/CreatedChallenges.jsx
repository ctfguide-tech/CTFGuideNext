import React, { useEffect, useState } from 'react';
import request from '@/utils/request';
import ChallengeCard from '@/components/profile/ChallengeCard';

const CreatedChallenges = ({ user }) => {
  const [createdChallenges, setCreatedChallenges] = useState([]);
  console.log("cc user", user);
  useEffect(() => {
    if (!user) {
      return;
    }

    const fetchData = async () => {
      try {
        const challengeEndPoint = `${process.env.NEXT_PUBLIC_API_URL}/users/${user}/challenges`;
        const challengeResult = await request(challengeEndPoint, 'GET', null);
        if (!challengeResult) {
          setCreatedChallenges([]);
          return;
        }
        const publicChallenges = challengeResult.filter(
          (challenge) => challenge.private === false
        );
        setCreatedChallenges(publicChallenges);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div className="mt-4 rounded-sm">
        {createdChallenges.length > 0 ? (
          createdChallenges.map((challenge) => (
            <ChallengeCard
              challenge={challenge}
              key={challenge.challengeId}
            />
          ))
        ) : (
          <div className="align-center duration-4000 col-span-5 mx-auto min-h-[190px] w-full min-w-[200px] rounded-sm border border-2 border-neutral-700 bg-neutral-800 px-4 py-4 text-center transition ease-in-out hover:bg-neutral-700/40">
            <img src={'../../CuteKana.png'} width="100" className="mx-auto mt-2 px-1" />
            <h1 className="mx-auto mt-2 text-center text-xl text-white">No Challenges Created Yet...</h1>
          </div>
        )}
      </div>

  );
};

export default CreatedChallenges;