import React from 'react';

const LessonBar = ({ name, progress, type }) => {
    if (type === "lab") {
        return (
            <div className="bg-neutral-700 px-2 py-1 flex">
             <div>
             <h1>
                {name}
             </h1>
             </div>
             <div className="ml-auto">
               {type.toUpperCase()}
             </div>
            </div>
        );
    }

    if (type === "task") {
        return (
            <div className="bg-gradient-to-r from-yellow-600 to-yellow-700/90 px-2 py-1 flex">
             <div>
             <h1>
                {name}
             </h1>
             </div>
             <div className="ml-auto">
               {type.toUpperCase()}
             </div>
            </div>
        );
    }

    if (type === "final") {
        return (
            <div className="bg-gradient-to-r from-green-600 to-green-700/90 px-2 py-1 flex">
             <div>
             <h1>
                {name}
             </h1>
             </div>
             <div className="ml-auto">
               {type.toUpperCase()}
             </div>
            </div>
        );
    }
};

export default LessonBar;
