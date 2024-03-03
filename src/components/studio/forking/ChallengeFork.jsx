import Link from 'next/link';
import { CheckCircleIcon } from '@heroicons/react/20/solid';
import { useState, useEffect } from 'react';

const Challenge = ({ data, inCarousel, updateData }) => {
  const [view, setView] = useState(true);

  const { difficulty } = data;
  const borderColor = {
    beginner: 'border-[#05ad84] ',
    easy: 'border-green-500 ',
    medium: 'border-yellow-500 ',
    hard: 'border-red-500 ',
    insane: 'border-red-500 ',
  };

  let classStyle = 'card rounded-lg px-6 py-4 w-full border-l-4 bg-[#222222] ';
  if (borderColor[difficulty.toLowerCase()]) {
    classStyle += borderColor[difficulty.toLowerCase()];
  }

  if (inCarousel) {
    classStyle += ' m-4 ';
    classStyle += ' w-[300px] ';
  }

  useEffect(() => {
    const name = localStorage.getItem('username');
    if (data.private && name !== data.creator) {
      setView(false);
    } else {
      setView(true);
    }
  }, []);

  const badgeColor = {
    beginner: 'bg-[#05ad84] text-[#212529] ',
    easy: 'bg-[#28a745] text-[#212529] ',
    medium: 'bg-[#f0ad4e] text-[#212529] ',
    hard: 'bg-[#dc3545] ',
    insane: 'bg-[#dc3545] ',
  };

  if (!view) {
    return <></>;
  }

  return (
    <div
      onClick={() => {
        updateData(true, {title: data.title, creator:data.creator, id: data.id});
      }}
      className={
        classStyle +
        'duration-4000 min-h-[190px] min-w-[200px] transition ease-in-out hover:bg-neutral-800/40'
      }
    >
      <div className="relative h-full">
        <div className="flex">
          <span
            className={
              'mb-1 mr-2 mt-1 cursor-pointer rounded-md px-2 text-sm font-semibold text-white ' +
              badgeColor[difficulty.toLowerCase()]
            }
          >
            {data.difficulty}
          </span>
        </div>

        <h3 className="mt-2 truncate text-2xl font-bold text-white">
          {data.title.substring(0, 45)}
        </h3>
        <p className="mb-3 truncate text-sm text-white  ">
          {data.content.substring(0, 40)}
        </p>
        <p className=" hidden truncate rounded-md text-[12px]  tracking-wide text-white">
          By: {data.creator}
          {data.creator == 'almondmilk' ? (
            <i class="fas fa-check-circle ml-2 text-sm text-blue-500"></i>
          ) : (
            <div></div>
          )}
        </p>

        <div className="bottom-1 left-0  flex w-full flex-wrap">
          {data.category.map((category, index) => (
            <div className="flex">
              <p
                id={index}
                className="mr-3 mt-1 overflow-hidden  truncate text-ellipsis rounded-md text-[12px] text-white"
              >
                <i class="fas fa-puzzle-piece mr-1"></i>{' '}
                {category === 'reverse engineering' ? 'RE' : category}
              </p>
              <p
                id={index}
                className="my-auto mt-1 rounded-md px-2 text-[12px] text-white"
              >
                <i class="far fa-eye mr-1"></i> {data.views}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Challenge;
