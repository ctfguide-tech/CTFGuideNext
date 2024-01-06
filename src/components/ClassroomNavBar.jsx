import React from 'react';

const classroomId = 1
export default function ClassroomNavBar() {
    return (
        <div className="flex">
            <div className="w-1/4 bg-gray-200">
                <ul className="flex flex-col">
                    <li className="py-2 px-4 border-b border-gray-300">
                        <a href={`/classroom/${classroomId}`}>Home</a>
                    </li>
                    <li className="py-2 px-4 border-b border-gray-300">
                        <a href ={`/classroom/${classroomId}/grades`}>Grades</a>
                    </li>
                    <li className="py-2 px-4 border-b border-gray-300">
                        <a href={`/classroom/${classroomId}/people`}>People</a>
                    </li>
                    <li className="py-2 px-4 border-b border-gray-300">
                        <a href = {`/classroom/${classroomId}/announcements`}>Announcements</a>
                    </li>
                    <li className="py-2 px-4 border-b border-gray-300">
                        <a href={`/classroom/${classroomId}/announcements`}>Settings</a>
                    </li>
                </ul>
            </div>
            <div className="w-3/4 bg-white">
                {/* Content for each sidebar option */}
            </div>
        </div>
    );
}

// abhi is a sex god