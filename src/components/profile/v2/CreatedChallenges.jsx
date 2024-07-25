import React, { useEffect, useState } from 'react';
import request from '@/utils/request';
import ChallengeCard from '@/components/profile/ChallengeCard';

const CreatedChallenges = ({ user }) => {
  const [createdChallenges, setCreatedChallenges] = useState([]);
  const [displayedChallenges, setDisplayedChallenges] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const challengesPerPage = 4;

  useEffect(() => {
    if (!user) {
      return;
    }

    const fetchData = async () => {
      try {
        const challengeEndPoint = `${process.env.NEXT_PUBLIC_API_URL}/users/${user.username}/challenges`;
        const challengeResult = await request(challengeEndPoint, 'GET', null);
        if (!challengeResult || challengeResult.length === 0) {
          setHasMore(false);
          return;
        }
        const publicChallenges = challengeResult.filter(
          (challenge) => challenge.state === 'STANDARD_VERIFIED'
        );
        setCreatedChallenges(publicChallenges);
        setDisplayedChallenges(publicChallenges.slice(0, challengesPerPage));
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [user]);

  const loadMore = () => {
    const nextPage = page + 1;
    const newChallenges = createdChallenges.slice(0, nextPage * challengesPerPage);
    setDisplayedChallenges(newChallenges);
    setPage(nextPage);
    if (newChallenges.length === createdChallenges.length) {
      setHasMore(false);
    }
  };

  return (
    <div className="mt-4 rounded-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 justify-between gap-4">
        {displayedChallenges.length > 0 ? (
          displayedChallenges.map((challenge) => (
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
      {hasMore && displayedChallenges.length < createdChallenges.length && (
        <div className="">
           <button onClick={loadMore} className="mt-4  text-center mx-auto text-white rounded">
          Load More
        </button>
        </div>
      )}
    </div>
  );
};

export default CreatedChallenges;