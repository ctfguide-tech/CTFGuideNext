import React from 'react';
import { Tooltip } from 'react-tooltip';

const ChallengeCard = ({ id, title, category, difficulty, createdAt, creator, views, likes }) => {

    const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;

    let color;
    const colors = ['blue-600', 'green-600', 'orange-600', 'red-600', 'purple-400'];

    if (!difficulty) difficulty = 'BEGINNER';

    if (difficulty === 'BEGINNER') {
        color = colors[0];
    } else if (difficulty === 'EASY') {
        color = colors[1];
    } else if (difficulty === 'MEDIUM') {
        color = colors[2];
    } else if (difficulty === 'HARD') {
        color = colors[3];
    } else if (difficulty === 'INSANE') {
        color = colors[4];
    } else {
        color = colors[0];
    }


    return (
        <div className={`bg-${color} rounded-md`}>
            <a href={`${baseUrl}/challenges/${id}`}>
            <div className="ml-1 relative isolate overflow-hidden rounded-md bg-neutral-900 pb-2 ring-1 ring-white/10 hover:ring-neutral-600">
                <div className="relative mx-auto max-w-7xl px-5">
                    <div
                        className="absolute -bottom-8 -left-96 -z-10 transform-gpu blur-3xl sm:-bottom-64 sm:-left-40 lg:-bottom-32 lg:left-8 xl:-left-10"
                        aria-hidden="true"
                    >
                        <div
                            className="aspect-[1266/975] w-[79.125rem] bg-gradient-to-tr from-[#081e75] to-[#0737f2] opacity-30"
                            style={{
                                clipPath:
                                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                            }}
                        />
                    </div>
                    <div className="mx-auto lg:mx-0 lg:max-w-3xl">
                        <div className="mt-4 text-lg leading-8 text-gray-300">
                            <h1 className="text-2xl font-semibold text-white">{title}</h1>
                            <h1 className="text-xl text-white">Creator: {creator}</h1>
                            <div className="grid grid-cols-2">
                                <p className="text-white font-bold text-lg ">
                                    <i class="fas fa-solid fa-eye mt-2"> </i>{' '}
                                    {views}
                                    <i class="text-red-400 fas fa-solid fa-heart mt-2 ml-2 "> </i>{' '}
                                    {likes}

                                </p>
                                <p className="text-white font-bold text-lg flex justify-end">
                                    <i class="fas fa-solid fa-calendar mt-1.5 mr-1"> </i>{' '}
                                    {new Date(createdAt).toLocaleDateString('en-US', {
                                        month: '2-digit',
                                        day: '2-digit',
                                        year: 'numeric',
                                    })}
                                </p>
                            </div>
                            <h1 className={`text-xl font-bold text-${color}`}>{difficulty.charAt(0) + difficulty.slice(1).toLowerCase()}</h1>
                        </div>
                    </div>
                </div>
            </div>
            </a>
        </div>
    )
};

export default ChallengeCard;