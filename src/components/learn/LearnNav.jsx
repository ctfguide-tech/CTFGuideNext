
import Container from '@/components/Container';
import { ProgressBar, DonutChart } from '@tremor/react'
import Link from 'next/link';
import { useState, useEffect } from 'react';
import CountUpNumber from './CountUp';
import CountUp from 'react-countup';

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

    const progressArray = [];
    const colorArray=[];
    if (lessonProgress?.sublessons) {
      for (let i = 0; i < lessonProgress?.sublessons.length; i++) {
        progressArray.push({
          "name": `Section ${i + 1}`,
          "progress": lessonProgress.sublessons[i].progresses.length != 0 ? parseInt(lessonProgress.sublessons[i].progresses[0]?.progress) : 0,
        });
        colorArray.push("blue");
        progressArray.push({
          "name": `Section ${i + 1}`,
          "progress": lessonProgress.sublessons[i].progresses.length != 0 ? 100 - parseInt(lessonProgress.sublessons[i].progresses[0]?.progress) : 100,
        });
        colorArray.push("gray");
      }
    }
    // console.log(lessonProgress)
    /**
    if (progressArray.length == 0) {
      progressArray.push({
        "name": 'Section 1',
        "progress": 100
      });
      colorArray.push("gray");
    }
    */

    return (
      <>
      <div className="w-1/5 text-gray-900 flex-none mt-10 border-r mr-6" style={{ borderColor: "#212121" }}>
        <ul className="py-3 mr-2">
          <div style={{backgroundColor:"#212121"}} className="py-4 px-4 rounded-lg">
          <DonutChart
            height="h-36"
            data={ progressArray }
            category="progress"
            dataKey="name"
            colors={colorArray}
            showLabel={false}
            showTooltip={false}
            showAnimation={true}
          />
          <h1 className='text-white mx-auto text-xl text-center mt-2'><CountUp end={lessonProgress ? lessonProgress.totalProgress : 0} duration={3} />%</h1>
          <h1 className='text-white mx-auto text-center'>Lesson Progress</h1>
            {/**<ProgressBar percentageValue={lessonProgress ? lessonProgress.totalProgress : 0} color="blue" tooltip={true} marginTop="mt-2" />*/}
          </div>
              <li className="mt-6 mb-4 py-1"><Link href={navElements[0].href} className="ml-1 px-2 py-2 text-white font-medium text hover:bg-[#212121] active:bg-[#2e2e2e] rounded-md"><i class="far fa-file mr-2"></i>{navElements[0].title}</Link></li>
              <li className="mb-4 py-1"><Link href={navElements[1].href} className="px-2 py-2 text-white font-medium text hover:bg-[#212121] rounded-md"><i class="fas fa-play-circle mr-2"></i>{navElements[1].title}</Link></li>
              <li className="mb-4 py-1"><Link href={navElements[2].href} className="px-2 py-2 text-white font-medium text hover:bg-[#212121] rounded-md"><i class="fas fa-clipboard-check mr-2"></i>{navElements[2].title}</Link></li>
              <li className="py-1"><Link href={navElements[3].href} className="px-2 py-2 text-white font-medium text hover:bg-[#212121] rounded-md"><i class="fas fa-terminal mr-2"></i>{navElements[3].title}</Link></li>
              <li className="ml-5 mt-2 mr-2 py-1"><Link href="./dynamic1" className="px-2 py-2 text-white font-medium text hover:bg-[#212121] rounded-md">Using your terminal</Link></li>
            </ul>
          </div>
        </>
    )
}
