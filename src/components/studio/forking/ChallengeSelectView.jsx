import React, { useEffect, useState } from 'react';
import Challenge from '@/components/studio/forking/ChallengeFork';
const baseUrl = process.env.NEXT_PUBLIC_API_URL;
import request from "@/utils/request";
const ChallengeSelectView = ({ updateChallenge }) => {
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    const url = `${baseUrl}/challenges`;
    request(url, 'GET', null)
      .then(result => {
        setChallenges(result.result)
      })
      .catch(error => console.log('error', error));
  }, []); // Added an empty dependency array to prevent infinite requests
  console.log(challenges)

  return (
    <div >
      <h1 className="  text-3xl  text-white"
      > Select a challenge to fork</h1>
      <div className=' grid grid-cols-4 text-left mt-4  gap-x-4  gap-y-4  '>

        {challenges.map((challenge, index) => (
          <Challenge key={index} data={challenge} updateData={updateChallenge} />
        ))}
      </div>
    </div>
  );
};

export default ChallengeSelectView;
