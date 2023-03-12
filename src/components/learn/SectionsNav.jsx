import { useEffect, useState } from 'react'
import Container from '@/components/Container';
import { ProgressBar  } from '@tremor/react'
import { CategoryBar, Card, Flex, Text } from "@tremor/react";

export function SectionsNav({currentPage, cpv, colors, sublesson}) {
  const [lessonProgress, setLessonProgress] = useState(null);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/lessons/sublesson/${sublesson}/progress`, {
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

    console.log(lessonProgress)
    if (lessonProgress?.completion) {
        for (let i = 0; i < lessonProgress.completion.length; i++) {
            if (lessonProgress[i]) {
                colors[i] = "green";
            }
        }
        // colors[currentPage - 1] = "blue";
    }

    return (
        <>
        <div className="w-full text-gray-900 flex-none mt-6 border-r mr-6 mb-6" style={{ borderColor: "#212121" }}>
            <div style={{backgroundColor:"#212121"}} className="py-4 px-4 rounded-lg">
                <h1 className='text-white mx-auto text-center mb-3'>Section Progress</h1>
                <CategoryBar
                categoryPercentageValues={cpv}
                colors={colors}
                percentageValue={lessonProgress && lessonProgress.progress}
                />
            </div>
        </div>
        </>
    )
}
