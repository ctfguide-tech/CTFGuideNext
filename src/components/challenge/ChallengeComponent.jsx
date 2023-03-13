import { Callout, Card, Metric, Text } from "@tremor/react";
import Link from 'next/link';

const Challenge = ({data}) => {
    const { difficulty } = data;
    const borderColor = {
        'easy': 'border-green-500 ',
        'medium': 'border-yellow-500 ',
        'high': 'border-red-500 ',
    };

    let classStyle = 'card rounded-lg px-4 py-2 w-full border-l-4 bg-gray-800 ';
    if(borderColor[difficulty]) {
        classStyle += borderColor[difficulty];
    }

    return (
        <Link 
            href={{
                pathname: "/challenge",
                query: {
                    id: data.id,
                },
            }}
            className={classStyle + "h-[200px]"}
            >
            <div className="h-full relative">
                <h3 className='text-white text-2xl'>{data.title}</h3>
                <p className='text-white truncate text-sm mt-1'>{data.problem.substring(0, 40)}</p>
                <div className='absolute left-0 bottom-0 flex mt-2'>
                    <p className='text-white px-2 text-sm mr-2 mt-1'>{data.difficulty}</p>
                    <p className='text-white px-2 rounded-lg bg-blue-900 text-sm mr-2 mt-1'>{data.category}</p>
                </div>
            </div>
        </Link>
    );
};

export default Challenge;