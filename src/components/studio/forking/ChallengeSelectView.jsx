import React, { useEffect, useState } from 'react';
import Challenge from '@/components/studio/forking/ChallengeFork';
const baseUrl = process.env.NEXT_PUBLIC_API_URL;
import request from "@/utils/request";
const ChallengeSelectView = ({ updateChallenge }) => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = `${baseUrl}/challenges/challengesFromForking`;
    request(url, 'GET', null)
      .then(result => {
        if(result.success) {
          setChallenges(result.body)
        }
        setLoading(false);
      })
      .catch(error => console.log('error', error));
  }, []); // Added an empty dependency array to prevent infinite requests

  return (
    <div >
      <h1 className="  text-3xl  text-white"
      > Select a challenge to fork</h1>
      {
        loading && <div className="text-white" style={{margin: "-100px"}}>
          <i className="fas fa-spinner fa-pulse"
            style={{color: "gray", fontSize: "50px", marginLeft: "50%", marginTop: "20%", marginBottom: "20%"}}>
          </i>
        </div>
      }
      <div className=' grid grid-cols-4 text-left mt-4  gap-x-4  gap-y-4  '>

        {challenges.map((challenge, index) => (
          <span style={{cursor: "pointer"}}><Challenge key={index} data={challenge} updateData={updateChallenge} /></span>
        ))}
      </div>
    </div>
  );
};

export default ChallengeSelectView;
