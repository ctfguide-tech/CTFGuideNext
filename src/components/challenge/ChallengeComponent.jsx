import Link from 'next/link';
import { CheckCircleIcon, EyeIcon } from '@heroicons/react/20/solid'

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
            className={classStyle + "min-h-[190px] min-w-[200px] hover:ring-1 hover:ring-blue-600 transition duration-4000 ease-in-out"}
            >
            <div className="h-full relative">
                <div className='flex'>
                    <span className={'px-2 rounded-md font-semibold bg-blue-900 text-sm mr-2 mt-1 ' + badgeColor[difficulty.toLowerCase()]}>{data.difficulty}</span>
                </div>

                <h3 className='text-white text-2xl font-bold truncate mt-2'>{data.title.substring(0, 45)}</h3>
                <p className='text-white truncate text-sm mb-7'>{data.content.substring(0, 40)}</p>
                <p className='rounded-md text-white tracking-wide truncate text-[14px] mt-2 flex'>By: {data.creator}{(data.creator == 'picoctf') ? <CheckCircleIcon className='ml-1 h-4 text-pink-400 mt-0.5'/> : <div></div>}</p>

                <div className='left-0 bottom-1 flex mt-1 w-full flex-wrap'>
                    {data.category.map((category, index) => (
                        <div className='flex'>
                            <p id={index} className="text-white px-2 rounded-md bg-blue-700 text-sm mt-1 mr-3">{category}</p>
                            <p id={index} className='rounded-md bg-blue-700 text-white px-2 text-[12px] mt-2 my-auto'>{data.views} views</p>
                        </div>
                    ))}
                </div>
            </div>
        </Link>
    );
};

export default Challenge;