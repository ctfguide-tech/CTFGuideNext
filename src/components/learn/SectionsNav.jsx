import { useEffect, useState } from 'react';
import Container from '@/components/Container';
import { ProgressBar } from '@tremor/react';
import { CategoryBar, Card, Flex, Text } from '@tremor/react';

export function SectionsNav({ currentPage, cpv, colors, sublesson }) {
  const [lessonProgress, setLessonProgress] = useState(null);

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/lessons/sublesson/${sublesson}/progress`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('idToken'),
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setLessonProgress(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  console.log(lessonProgress);
  if (lessonProgress?.completion) {
    for (let i = 0; i < lessonProgress.completion.length; i++) {
      if (lessonProgress[i]) {
        colors[i] = 'green';
      }
    }
    // colors[currentPage - 1] = "blue";
  }

  return (
    <>
      <div
        className="mt-6 mr-6 mb-6 w-full flex-none border-r text-gray-900"
        style={{ borderColor: '#212121' }}
      >
        <div
          style={{ backgroundColor: '#212121' }}
          className="rounded-lg py-4 px-4"
        >
          <h1 className="mx-auto mb-3 text-center text-white">
            Section Progress
          </h1>
          <ProgressBar
            percentageValue={lessonProgress && lessonProgress.progress}
            color="blue"
            // categoryPercentageValues={cpv}
            // colors={colors}
            // percentageValue={lessonProgress && lessonProgress.progress}
          />
        </div>
      </div>
    </>
  );
}
