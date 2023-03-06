import { Callout, Card, Metric, Text } from "@tremor/react";

const Challenge = ({data}) => {
    return (
        <>
        <div className='card rounded-lg px-4 py-2 w-full border-l-4 bg-gray-800'>
            <h1 class='text-white text-2xl'>{data.title}</h1>
            <p class='text-white truncate text-sm mt-1'>{data.problem.substring(0, 40)}</p>
            <div class='flex mt-2'>
            <p class='text-white px-2 rounded-lg bg-blue-900 text-sm mr-2 mt-1'>{data.category}</p>
            </div>
        </div>
        </>
    );
};

export default Challenge;