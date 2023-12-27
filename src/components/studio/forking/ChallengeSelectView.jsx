import React, { useEffect, useState } from 'react';
import Challenge from '@/components/studio/forking/ChallengeFork';
const ChallengeSelectView = ({ updateChallenge }) => {
    const [challenges, setChallenges] = useState([]);

    useEffect(() => {
        var requestOptions = {
            method: 'GET'
        };

        fetch("http://localhost:3001/challenges", requestOptions)
            .then(response => response.json()) // assuming the response is JSON
            .then(result => {
                setChallenges(result.result)
            })
            .catch(error => console.log('error', error));
    }, []); // Added an empty dependency array to prevent infinite requests

    return (
        <div >
            <h1 className="  text-3xl  text-white"
> Select a challenge to fork</h1>
            <div className=' grid grid-cols-4 text-left mt-4    '>

                {Array.isArray(challenges) && challenges.map((challenge, index) => (
                    <Challenge key={index} data={challenge} updateData={updateChallenge} />
                ))}
            </div>
        </div>
    );
};

export default ChallengeSelectView;