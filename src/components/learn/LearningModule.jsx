import { useState, useEffect } from 'react'
import { ProgressBar } from '@tremor/react';

export function LearningModule({lessonId, title, sections, sectionHrefs, imgSrc, link}) {
    const [lessonProgress, setLessonProgress] = useState(null);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/lessons/${lessonId}/progress`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + localStorage.getItem("idToken"),
            },
          })
          .then(res => res.json())
          .then(data => {
            setLessonProgress(data);
          })
          .catch(err => {
            console.log(err);
          });
    }, []);

    return (
        <>
            <a href={link} className='mt-1 pb-10 mt-4 rounded-lg bg-[#212121] hover:bg-[#2c2c2c]'>
                <img className='w-full h-5  rounded-t-lg object-cover ' src={imgSrc}></img>
                <h1 className='text-white text-2xl mx-auto ml-10 mt-7 flex'>{title}<span className='ml-auto px-10 font-semibold'>{lessonProgress ? lessonProgress.totalProgress : 0}%</span></h1>
                    <div className='px-10 mt-4 text-white'>
                    <ProgressBar percentageValue={lessonProgress ? lessonProgress.totalProgress : 0} color="blue" tooltip={true} marginTop="mt-2" />
                    <div className='mt-4'>
                        <a href={sectionHrefs ? sectionHrefs[0] : "./"}>
                            <h1 className='text-white text-md flex w-full'>{sections[0]}<span className='ml-auto text-blue-500 hover:text-blue-600'>View Content →</span></h1>
                        </a>
                        <a href={sectionHrefs ? sectionHrefs[1] : "./"}>
                            <h1 className='text-white text-md flex'>{sections[1]}<span className='ml-auto text-blue-500 hover:text-blue-600'>View Content →</span></h1>
                        </a>
                        <a href={sectionHrefs ? sectionHrefs[2] : "./"}>
                        <h1 className='text-white text-md flex'>{sections[2]}<span className='ml-auto text-blue-500 hover:text-blue-600'>Start Task →</span></h1>
                        </a>
                        <a href={sectionHrefs ? sectionHrefs[3] : "./"}>
                        <h1 className='text-white text-md flex'>{sections[3]}<span className='ml-auto text-blue-500 hover:text-blue-600'>Start Task →</span></h1>
                        </a>
                    </div>
                </div>         
            </a>
        </>
    )
}