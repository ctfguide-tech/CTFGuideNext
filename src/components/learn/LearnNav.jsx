import { DonutChart } from '@tremor/react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

import request from '@/utils/request';

export function LearnNav({ navElements, lessonNum }) {
  const [lessonProgress, setLessonProgress] = useState(null);

  useEffect(() => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/lessons/${lessonNum}/progress`;
    request(url, 'GET', null)
      .then((data) => {
        console.log(data);
        setLessonProgress(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const progressArray = [];
  const colorArray = [];
  if (lessonProgress?.sublessons) {
    for (let i = 0; i < lessonProgress?.sublessons.length; i++) {
      progressArray.push({
        name: `Section ${i + 1}`,
        progress:
          lessonProgress.sublessons[i].progresses.length != 0
            ? parseInt(lessonProgress.sublessons[i].progresses[0]?.progress)
            : 0,
      });
      colorArray.push('blue');
      progressArray.push({
        name: `Section ${i + 1}`,
        progress:
          lessonProgress.sublessons[i].progresses.length != 0
            ? 100 -
              parseInt(lessonProgress.sublessons[i].progresses[0]?.progress)
            : 100,
      });
      colorArray.push('stone');
    }
  }

  return (
    <>
      <div
        className="mt-10 mr-6 w-1/5 flex-none "
        style={{ borderColor: '#212121' }}
      >
        <ul className="mr-2">
          <div
            style={{ backgroundColor: '#212121' }}
            className="rounded-sm py-4 px-4 border-t-4 border-blue-700"
          >
            <DonutChart
              height="h-36"
              data={progressArray}
              category="progress"
              dataKey="name"
              colors={colorArray}
              showLabel={false}
              showTooltip={false}
              showAnimation={true}
            />
            <h1 className="mx-auto mt-2 text-center text-xl text-white">
      
              %
            </h1>
            <h1 className="mx-auto text-center text-white">Lesson Progress</h1>
            {/**<ProgressBar percentageValue={lessonProgress ? lessonProgress.totalProgress : 0} color="blue" tooltip={true} marginTop="mt-2" />*/}
          </div>
          <li className="mt-6 mb-4 py-1">
            <Link
              href={navElements[0].href}
              className="text ml-1 rounded-md px-2 py-2 font-medium text-white hover:bg-[#212121] active:bg-[#2e2e2e]"
            >
              <i class="far fa-file mr-2"></i>
              {navElements[0].title}
            </Link>
          </li>
          <li className="mb-4 py-1">
            <Link
              href={navElements[1].href}
              className="text rounded-md px-2 py-2 font-medium text-white hover:bg-[#212121]"
            >
              <i class="fas fa-play-circle mr-2"></i>
              {navElements[1].title}
            </Link>
          </li>
          <li className="mb-4 py-1">
            <Link
              href={navElements[2].href}
              className="text rounded-md px-2 py-2 font-medium text-white hover:bg-[#212121]"
            >
              <i class="fas fa-clipboard-check mr-2"></i>
              {navElements[2].title}
            </Link>
          </li>
          <li className="py-1">
            <Link
              href={navElements[3].href}
              className="text rounded-md px-2 py-2 font-medium text-white hover:bg-[#212121]"
            >
              <i class="fas fa-terminal mr-2"></i>
              {navElements[3].title}
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}
