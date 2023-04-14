import Link from 'next/link';
import { CheckCircleIcon, EyeIcon } from '@heroicons/react/20/solid';

const Challenge = ({ data, inCarousel }) => {
  const { difficulty } = data;
  const borderColor = {
    easy: 'border-green-500 ',
    medium: 'border-yellow-500 ',
    hard: 'border-red-500 ',
  };

  let classStyle = 'card rounded-lg px-6 py-4 w-full border-l-4 bg-[#222222] ';
  if (borderColor[difficulty.toLowerCase()]) {
    classStyle += borderColor[difficulty.toLowerCase()];
  }
  if (inCarousel) {
    classStyle += ' m-4 ';
    classStyle += ' w-[300px] ';
  }

  const badgeColor = {
    easy: 'bg-[#28a745] text-[#212529] ',
    medium: 'bg-[#f0ad4e] text-[#212529] ',
    hard: 'bg-[#dc3545] ',
  };

  return (
    <Link
      href={{
        pathname: `/challenges/${data.slug}`
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
              'mr-2 mt-1 rounded-md text-white mb-1 px-2 text-sm font-semibold ' +
              badgeColor[difficulty.toLowerCase()]
            }
          >
            {data.difficulty}
          </span>
        </div>

        <h3 className="mt-2 truncate text-2xl font-bold text-white">
          {data.title.substring(0, 45)}
        </h3>
        <p className="mb-7 truncate text-sm text-white">
          {data.content.substring(0, 40)}
        </p>
        <p className="mt-2 flex truncate rounded-md text-[14px] tracking-wide text-white">
          By: {data.creator}
          {data.creator == 'picoctf' ? (
            <CheckCircleIcon className="ml-1 mt-0.5 h-4 text-pink-400" />
          ) : (
            <div></div>
          )}
        </p>

        <div className="left-0 bottom-1 mt-1 flex w-full flex-wrap">
          {data.category.map((category, index) => (
            <div className="flex">
              <p
                id={index}
                className="mr-3 mt-2 rounded-md bg-blue-700 px-2 text-[12px] text-white"
              >
                {category}
              </p>
              <p
                id={index}
                className="my-auto mt-2 rounded-md bg-blue-700 px-2 text-[12px] text-white"
              >
                {data.views} views
              </p>
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default Challenge;
