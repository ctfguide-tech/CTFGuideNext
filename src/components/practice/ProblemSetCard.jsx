import React, { useState, useEffect } from 'react';

export default function ProblemSetCard({ categoryName }) {
  const [components, setComponents] = useState([]);
  const [cryptoChallenges, setCryptoChallenges] = useState([]);

  useEffect(() => {
    try {
      fetch(
        process.env.NEXT_PUBLIC_API_URL + `/challenges?category=${categoryName}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (result) {
            const { result } = data;
            setComponents(result);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } catch {}
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_API_URL +
            `/challenges?category=${categoryName}`
        );
        const { result } = await response.json();
        setCryptoChallenges(result);
        console.log(cryptoChallenges);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const filterData = (category) => {
    return components.filter((component) => {
      return component.category.some((categoryName) => {
        return categoryName.toLowerCase() === category.toLowerCase();
      });
    });
  };

  const badgeColor = {
    easy: 'bg-[#28a745] text-[#212529] ',
    medium: 'bg-[#f0ad4e] text-[#212529] ',
    hard: 'bg-[#dc3545] ',
  };

  const borderColor = {
    easy: 'border-[#28a745] text-[#212529] ',
    medium: 'border-[#f0ad4e] text-[#212529] ',
    hard: 'border-[#dc3545] ',
  };

  return (
    <>
      <div className="w-full overflow-x-scroll pb-4">
        <div className="mt-3 flex gap-x-5" style={{ width: 'fit-content' }}>
          {' '}
          {cryptoChallenges &&
            cryptoChallenges.map((data) => (
              <a href={`/challenge?slug=${data.slug}`} className="">
                <div
                  className={
                    'ml-4 min-h-[190px] w-full min-w-[200px] flex-shrink-0 cursor-pointer rounded-lg border-t-8 bg-neutral-800 px-3 py-2 py-4 font-semibold  text-white backdrop-blur-lg hover:bg-neutral-800 ' +
                    borderColor[data.difficulty.toLowerCase()]
                  }
                >
                  {/* difficulty in red, green or yellow */}
                  <span
                    className={
                      'mr-2 mt-1 rounded-lg bg-blue-900 px-2 text-sm font-semibold text-white ' +
                      badgeColor[data.difficulty.toLowerCase()]
                    }
                  >
                    {data.difficulty}
                  </span>

                  <h3 className="mt-2  truncate text-2xl font-bold text-white">
                    {data.title.substring(0, 45)}
                  </h3>
                  <p className="text-md mt-1 truncate text-white">
                    {data.content.substring(0, 40)}
                  </p>
                </div>
              </a>
            ))}
        </div>
      </div>
    </>
  );
}
