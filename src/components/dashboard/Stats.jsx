import { useState, useEffect } from 'react';

const cities = [
  {
    name: 'New York',
    sales: 9800,
  },
  {
    name: 'London',
    sales: 4567,
  },
  {
    name: 'Hong Kong',
    sales: 3908,
  },
  {
    name: 'San Francisco',
    sales: 2400,
  },
  {
    name: 'Singapore',
    sales: 1908,
  },
  {
    name: 'Zurich',
    sales: 1398,
  },
];

const valueFormatter = (number) =>
  `$ ${Intl.NumberFormat('us').format(number).toString()}`;

export function Stats() {
  const [streak, setStreak] = useState('');
  const [rank, setRank] = useState('');
  const [points, setPoints] = useState('');

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/account`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('idToken'),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setStreak(data.streak);
        setRank(data.leaderboardNum);
        setPoints(data.points);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <div className="mx-auto hidden">
        <h1
          className="mt-2 text-xl tracking-tight text-white    "
          style={{ color: '#595959' }}
        >
          {' '}
          AT A GLANCE
        </h1>
        <div className="mx-auto mb-4 mt-2 grid gap-4 rounded-lg text-center sm:grid-cols-1  md:grid-cols-3 lg:grid-cols-3">
          <div
            style={{ backgroundColor: '#212121', borderColor: '#3b3a3a' }}
            className=" stext-center mx-auto w-full rounded-lg px-4 py-2 text-white  "
          >
            <h1 className="bg-gradient-to-br from-indigo-400 to-blue-900 bg-clip-text text-3xl text-transparent">
              {streak} days
            </h1>
            <h1 className="text-xl">Streak</h1>
          </div>

          <div
            style={{ backgroundColor: '#212121', borderColor: '#3b3a3a' }}
            className=" mx-auto w-full rounded-lg px-4 py-2 text-center text-white "
          >
            <h1 className="bg-gradient-to-br from-orange-400 to-yellow-900 bg-clip-text text-3xl text-transparent">
              {rank}
            </h1>
            <h1 className="text-xl ">Rank</h1>
          </div>

          <div
            style={{ backgroundColor: '#212121', borderColor: '#3b3a3a' }}
            className=" mx-auto w-full rounded-lg px-4 py-2 text-center text-white "
          >
            <h1 className="bg-gradient-to-br from-red-400 to-blue-900 bg-clip-text text-3xl text-transparent">
              {points}
            </h1>

            <h1 className="text-xl">Points</h1>
          </div>
        </div>
      </div>
    </>
  );
}
