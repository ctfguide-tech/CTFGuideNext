import { useState, useEffect } from 'react';
import { ProgressBar } from '@tremor/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
export function LearningModule({
  lessonId,
  title,
  sections,
  sectionHrefs,
  imgSrc,
  link,
}) {
  const [lessonProgress, setLessonProgress] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/lessons/${lessonId}/progress`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        setLessonProgress(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <div className="mt-1 mt-4 rounded-lg bg-[#212121] pb-10 ">
        <img
          className="h-5 w-full  rounded-t-lg object-cover "
          src={imgSrc}
        ></img>
        <h1 className="mx-auto ml-10 mt-7 flex text-2xl text-white">
          {title}
          <span className="ml-auto px-10 font-semibold">
            {lessonProgress ? lessonProgress.totalProgress : 0}%
          </span>
        </h1>
        <div className="mt-4 px-10 text-white">
          <ProgressBar
            percentageValue={lessonProgress ? lessonProgress.totalProgress : 0}
            color="blue"
            tooltip={true}
            marginTop="mt-2"
          />
          <div className="mt-4">
            <h1 className="text-md flex w-full text-white">
              {sections[0]}
              <span
                onClick={() => {
                  router.push(sectionHrefs[0]);
                }}
                className="ml-auto cursor-pointer text-blue-500 hover:text-blue-600"
              >
                View Content →
              </span>
            </h1>
            <h1 className="text-md flex text-white">
              {sections[1]}
              <span
                onClick={() => {
                  router.push(sectionHrefs[1]);
                }}
                className="ml-auto cursor-pointer text-blue-500 hover:text-blue-600"
              >
                View Content →
              </span>
            </h1>
            <h1 className="text-md flex text-white">
              {sections[2]}
              <span
                onClick={() => {
                  router.push(sectionHrefs[2]);
                }}
                className="ml-auto cursor-pointer text-blue-500 hover:text-blue-600"
              >
                Start Task →
              </span>
            </h1>
            <h1 className="text-md flex text-white">
              {sections[3]}
              <span
                onClick={() => {
                  router.push(sectionHrefs[3]);
                }}
                className="ml-auto cursor-pointer text-blue-500 hover:text-blue-600"
              >
                Start Task →
              </span>
            </h1>
          </div>
        </div>
      </div>
    </>
  );
}
