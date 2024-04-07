import { useState, useEffect } from 'react';
import ChallengeCard from '../profile/ChallengeCard';

export function Community({ challenges }) {
  const [difficulty, setDifficulty] = useState('all');
  const [category, setCategory] = useState('all');
  const [results, setResults] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const filteredChallenges = challenges
      .filter((challenge) => {
        if (difficulty !== 'all' && challenge.difficulty.toLowerCase() !== difficulty.toLowerCase()) {
          return false;
        }
        if (category !== 'all' && challenge.category[0].toLowerCase() !== category.toLowerCase()) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (category === 'all') {
          return 0;
        }
        if (a.category < b.category) {
          return -1;
        }
        if (a.category > b.category) {
          return 1;
        }
        return 0;
      });

    setResults(filteredChallenges);
  }, [difficulty, category, challenges]);

  const search = (event) => {
    setFilter(event.target.value);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row max-w-7xl gap-4">
        <div className="w-full flex-row-reverse">
          <label
            htmlFor="difficulty"
            className="block text-sm font-medium leading-5 text-gray-200"
          >
            Difficulty
          </label>
          <select
            style={{ backgroundColor: '#212121' }}
            id="difficulty"
            className="mt-1 block w-full rounded border-none text-base leading-6 text-white focus:outline-none sm:text-sm sm:leading-5"
            onChange={(e) => {
              setDifficulty(e.target.value);
            }}
            value={difficulty}
          >
            <option value="all">All</option>
            <option value="beginner">Beginner</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
            <option value="insane">Insane</option>

          </select>
        </div>

        <div className="w-full">
          <label
            htmlFor="sort-category"
            className="block text-sm font-medium leading-5 text-gray-200"
          >
            Category
          </label>
          <select
            style={{ backgroundColor: '#212121' }}
            id="sort-category"
            className="mt-1 block w-full rounded  border-none text-base leading-6 text-white focus:outline-none sm:text-sm sm:leading-5"
            onChange={(e) => {
              setResults(
                [...challenges].sort((a, b) => {
                  if (e.target.value === 'all') {
                    return 0;
                  }
                  if (a.category < b.category) {
                    return -1;
                  }
                  if (a.category > b.category) {
                    return 1;
                  }
                  return 0;
                })
              );
              setCategory(e.target.value);
            }}
            value={category}
          >
            <option value="all">All</option>
            <option value="forensics">forensics</option>
            <option value="cryptography">cryptography</option>
            <option value="web">web</option>
            <option value="reverse engineering">reverse engineering</option>
            <option value="programming">programming</option>
            <option value="pwn">pwn</option>
            <option value="steganography">steganography</option>
            <option value="basic">basic</option>
          </select>
        </div>
        <div className="w-full">
          <label
            htmlFor="search"
            className="block text-sm font-medium border-none leading-5 text-gray-200"
          >
            Search
          </label>
          <input
            id="search"
            style={{ backgroundColor: '#212121' }}
            onChange={search}
            placeholder="Search for a Challenge"
            className="mt-1 block w-full rounded py-2 leading-6 border-none text-white focus:outline-none sm:text-sm sm:leading-5"
          ></input>
        </div>
      </div>
      <div className="mt-6 max-w-7xl text-left">
        <h1 className="text-3xl font-semibold text-white mb-4"> Community Challenges </h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {challenges && (results.length > 0 ? results : challenges)
            .filter((challenge) => {
              if (
                difficulty.toLowerCase() !== 'all' &&
                challenge.difficulty.toLowerCase() !== difficulty.toLowerCase()
              ) {
                return false;
              }
              if (
                filter !== '' &&
                challenge.category.includes(filter.toLowerCase())
              ) {
                return true;
              }
              if (
                filter !== '' &&
                !(
                  challenge.title
                    .toLowerCase()
                    .includes(filter.toLowerCase()) ||
                  challenge.content
                    .toLowerCase()
                    .includes(filter.toLowerCase())
                )
              ) {
                return false;
              }
              return true;
            })
            .map((challenge) => (
              <ChallengeCard challenge={challenge} key={challenge.challengeId} />
            ))
          }
        </div>
      </div>
    </>
  );
}

