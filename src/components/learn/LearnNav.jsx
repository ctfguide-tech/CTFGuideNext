import { DonutChart } from '@tremor/react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import CountUp from 'react-countup';

export function LearnNav({ navElements, lessonNum }) {
  const [lessonProgress, setLessonProgress] = useState(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/lessons/${lessonNum}/progress`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('idToken'),
      },
    })
      .then((res) => res.json())
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
      colorArray.push('gray');
    }
  }

  return (
    <>
      <div
        className="mt-10 mr-6 w-1/5 flex-none border-r text-gray-900"
        style={{ borderColor: '#212121' }}
      >
        <ul className="mr-2 py-3">
          <div
            style={{ backgroundColor: '#212121' }}
            className="rounded-lg py-4 px-4"
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
              <CountUp
                end={lessonProgress ? lessonProgress.totalProgress : 0}
                duration={3}
              />
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
