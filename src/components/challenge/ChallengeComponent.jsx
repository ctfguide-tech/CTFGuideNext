import { Callout, Card, Metric, Text } from "@tremor/react";
import Link from 'next/link';

const Challenge = ({data, inCarousel}) => {
    const { difficulty } = data;
    const borderColor = {
        'easy': 'border-green-500 ',
        'medium': 'border-yellow-500 ',
        'hard': 'border-red-500 ',
    };

    let classStyle = 'card rounded-lg px-4 py-4 w-full border-l-4 bg-[#222222] ';
    if(borderColor[difficulty]) {
        classStyle += borderColor[difficulty];
    }
    if(inCarousel) {
        classStyle += " m-4 ";
    }

    return (
        <Link 
            href={{
                pathname: "/challenge",
                query: {
                    id: data.id,
                },
            }}
            className={classStyle + "min-h-[200px]"}
            >
            <div className="h-full relative">
                <span className='text-white px-2 rounded-lg bg-blue-900 text-sm mr-2 mt-1 mb-4'>{data.difficulty}</span>

                <h3 className='text-white text-2xl font-bold truncate'>{data.title.substring(0, 45)}</h3>
                <p className='text-white truncate text-sm mt-1'>{data.problem.substring(0, 40)}</p>
                <div className='absolute left-0 bottom-1 flex mt-2 w-full flex-wrap'>
                    {data.category.replace(/\s/g, '').split(',').map((category, index) => (
                        <p id={index} className='text-white px-2 rounded-lg bg-blue-900 text-sm mt-1 mr-1'>{category}</p>
                    ))}
                </div>
            </div>
        </Link>
    );
};

export default Challenge;