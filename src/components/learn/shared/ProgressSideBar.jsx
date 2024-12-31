import React from 'react';
import ModuleCard from '../modules/cards/ModuleCard';
import LessonBar from '../modules/progress/LessonBar';
const ProgressSideBar = ({ active, progress }) => {
  return (
    <div className="progress-sidebar p-4 bg-neutral-800 rounded-lg">
        <h1 className="text-xl font-bold mb-4">Module Progress</h1>
        <div>
            <h2 className="text-lg font-semibold mb-2">{active}</h2>
            <p className="mb-2">{progress}%</p>
            <div className="w-full bg-neutral-700 rounded-full h-4">
                <div className="bg-green-500 h-4 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
        </div>

        <div className="flex flex-col  mt-10" >
            <LessonBar name="Lesson 1" progress={50} type="lab"/>
            <LessonBar name="Lesson 2" progress={50} type="lab"/>
            <LessonBar name="Lesson 3" progress={50} type="lab"/>
            <LessonBar name="Mastery Task" progress={50} type="task"/>
            <LessonBar name="Lesson 5" progress={50} type="lab"/>
            <LessonBar name="Lesson 6" progress={50} type="lab"/>
            <LessonBar name="Mastery Task" progress={50} type="task"/>
            <LessonBar name="Lesson 8" progress={50} type="lab"/>
            <LessonBar name="Lesson 9" progress={50} type="lab"/>
            <LessonBar name="Lesson 10" progress={50} type="lab"/>
            <LessonBar name="Final Task" progress={50} type="final"/>
        </div>


    </div>
  );
};

export default ProgressSideBar;