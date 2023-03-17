import { Callout, Card, Metric, Text } from "@tremor/react";
import Link from 'next/link';

const Challenge = ({data, inCarousel}) => {
    const { difficulty } = data;
    const borderColor = {
        'easy': 'border-green-500 ',
        'medium': 'border-yellow-500 ',
        'hard': 'border-red-500 ',
    };

    let classStyle = 'card rounded-lg px-6 py-4 w-full border-l-4 bg-[#222222] ';
    if(borderColor[difficulty.toLowerCase()]) {
        classStyle += borderColor[difficulty.toLowerCase()];
    }
    if(inCarousel) {
        classStyle += " m-4 ";
        classStyle += " w-[300px] ";
    }

    const badgeColor = {
        'easy': 'bg-[#28a745] text-[#212529] ',
        'medium': 'bg-[#f0ad4e] text-[#212529] ',
        'hard': 'bg-[#dc3545] ',
    }

    return (
        <Link 
            href={{
                pathname: "/challenge",
                query: {
                    slug: data.slug
                }
            }}
            className={classStyle + "min-h-[190px] min-w-[200px]"}
            >
            <div className="h-full relative">
                <span className={'text-white px-2 rounded-lg font-semibold bg-blue-900 text-sm mr-2 mt-1 ' + badgeColor[difficulty.toLowerCase()]}>{data.difficulty}</span>

                <h3 className='text-white text-2xl font-bold truncate mt-2'>{data.title.substring(0, 45)}</h3>
                <p className='text-white truncate text-sm mt-1'>{data.content.substring(0, 40)}</p>
                <div className='absolute left-0 bottom-1 flex mt-2 w-full flex-wrap'>
                    {data.category.map((category, index) => (
                        <p id={index} className='text-white px-2 rounded-lg bg-blue-900 text-sm mt-1 mr-1'>{category}</p>
                    ))}
                </div>
            </div>
        </Link>
    );
};

export default Challenge;