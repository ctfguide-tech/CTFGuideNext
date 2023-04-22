import Link from 'next/link';
import { CheckCircleIcon } from '@heroicons/react/20/solid';

const Challenge = ({ data, inCarousel }) => {
  const { difficulty } = data;
  const borderColor = {
    beginner: 'border-[#05ad84] ',
    easy: 'border-green-500 ',
    medium: 'border-yellow-500 ',
    hard: 'border-red-500 ',
    insane: 'border-red-500 '
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
    beginner: 'bg-[#05ad84] text-[#212529] ',
    easy: 'bg-[#28a745] text-[#212529] ',
    medium: 'bg-[#f0ad4e] text-[#212529] ',
    hard: 'bg-[#dc3545] ',
    insane: 'bg-[#dc3545] '
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
        <p className="mb-3 truncate text-sm text-white text-center ">
          {data.content.substring(0, 40)}
        </p>
        <p className="  text-[12px] truncate rounded-md  tracking-wide text-white">
          By: {data.creator}
          {data.creator == 'almondmilk' ? (
      <i class="fas fa-check-circle text-blue-500 text-sm ml-2"></i>
          ) : (
            <div></div>
          )}
        </p>

        <div className="left-0 bottom-1  flex w-full flex-wrap">
          {data.category.map((category, index) => (
            <div className="flex">
              <p
                id={index}
                className="mr-3 mt-1 rounded-md  text-[12px] text-white"
              >
               <i class="fas fa-puzzle-piece mr-1"></i> {category}
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
    </Link>
  );
};

export default Challenge;
