
import Container from '@/components/Container';
import { ProgressBar  } from '@tremor/react'
import { useState, useEffect } from 'react';
export function LearnNav({navElements}) {
  const [lessonProgress, setLessonProgress] = useState(null);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/lessons/1/progress`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + localStorage.getItem("idToken"),
            },
          })
          .then(res => res.json())
          .then(data => {
            console.log(data)
            setLessonProgress(data);
          })
          .catch(err => {
            console.log(err);
          });
    }, []);
    return (
        <>
      <div className="w-1/5 text-gray-900 flex-none mt-10 border-r mr-6" style={{ borderColor: "#212121" }}>

            <ul className="py-3 mr-2">
          <div style={{backgroundColor:"#212121"}} className="py-4 px-4 rounded-lg">
          <h1 className='text-white mx-auto text-center mb-3'>Lesson Progress</h1>
            <ProgressBar percentageValue={lessonProgress ? lessonProgress.totalProgress : 0} color="blue" tooltip={true} marginTop="mt-2" />

          </div>
              <li className="mt-6 mb-4 py-1"><a href={navElements[0].href} className="ml-1 px-2 py-2 text-white font-medium text"><i class="far fa-file mr-2"></i>{navElements[0].title}</a></li>
              <li className="mb-4 py-1"><a href={navElements[1].href} className="px-2 py-2 text-white font-medium text"><i class="fas fa-play-circle mr-2"></i>{navElements[1].title}</a></li>
              <li className="mb-4 py-1"><a href={navElements[2].href} className="px-2 py-2 text-white font-medium text"><i class="fas fa-clipboard-check mr-2"></i>{navElements[2].title}</a></li>
              <li className="py-1"><a href={navElements[3].href} className="px-2 py-2 text-white font-medium text"><i class="fas fa-terminal mr-2"></i>{navElements[3].title}</a></li>
              <li className="ml-5 mt-2 mr-2 py-1"><a href="./dynamic1" className="px-2 py-2 text-white font-medium text">Using your terminal</a></li>
            </ul>
          </div>
        </>
    )
}
