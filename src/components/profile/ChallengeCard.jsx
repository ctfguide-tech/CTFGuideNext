import React from 'react';
import { CardDecorator } from '../design/CardDecorator';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';

/** 
 * @param {import('react').HTMLAttributes<HTMLDivElement> & { challenge: {id: string, title: string, category: string, difficulty: string, createdAt: string, creator: string, views: number, likes: number} }} props 
 * */
const ChallengeCard = (_props) => {
  const { challenge, ...props } = _props;
  const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;
  const dateFormatted = (date) =>
    new Date(date)
      .toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      })

  const colorBG = {
    'BEGINNER': 'group-hover:bg-blue-500',
    'EASY': 'group-hover:bg-green-500',
    'MEDIUM': 'group-hover:bg-orange-500',
    'HARD': 'group-hover:bg-red-500',
    'INSANE': 'group-hover:bg-purple-500',
  };
  const colorText = {
    'BEGINNER': 'bg-blue-500 text-blue-50',
    'EASY': 'bg-green-500 text-green-50',
    'MEDIUM': 'bg-orange-500 text-orange-50',
    'HARD': 'bg-red-500 text-red-50',
    'INSANE': 'bg-purple-500 text-purple-50',
  };

  return (
    challenge && (
      <Link {...props} className={`group w-full rounded-sm card-container transition-all shadow-sm hover:shadow-lg shadow-black/40 ${props.className ?? ''}`} href={`${baseUrl}/challenges/${challenge.id}`} >
        <CardDecorator position='left' className={`${colorBG[challenge.difficulty || 0]} w-2 transition-colors`}></CardDecorator>
        <div className="bg-neutral-800 group-hover:bg-stone-600 transition-colors pl-8 pr-6 py-4 box-content border-y border-r border-neutral-100/20 rounded-l-lg text-sm leading-8 text-gray-300">
          <h1 className="text-2xl font-semibold text-white">{challenge.title}</h1>
          <h1 className="text-base text-neutral-400 line-clamp-1">{challenge.creator}</h1>
          <h1 className={`text-base px-2 mb-1 leading-6 font-bold capitalize w-fit rounded-sm text-neutral-50 ${colorText[challenge.difficulty || 0]}`}>{challenge.difficulty?.toLowerCase() || <Skeleton />}</h1>
          <div className="flex justify-between">
            <p className="text-neutral-400 flex">
              <i className="text-lg mt-[5px] mr-2 fas fa-solid fa-calendar"></i>
              {dateFormatted(challenge.createdAt)}
            </p>
            <p className="flex text-neutral-200 opacity-70 items-center text-sm">
              <i className="fas fa-solid fa-eye mr-2 text-lg"></i>
              {challenge.views}
              <i className="ml-4 mr-2 text-neutral-300 fas fa-solid fa-heart text-lg"></i>
              {challenge.upvotes}
            </p>
          </div>
        </div>
      </Link >)
    || (
      <div {...props} className={`bg-neutral-800 w-full rounded-sm pl-8 pr-6 py-4 leading-8 ${props.className ?? ''}`}>
        <Skeleton baseColor='#262626' highlightColor='#3a3a3a' width='10rem' />
        <Skeleton baseColor='#262626' highlightColor='#3a3a3a' width='12rem' />
        <Skeleton baseColor='#262626' highlightColor='#3a3a3a' width='4rem' />
        <Skeleton baseColor='#262626' highlightColor='#3a3a3a' />
      </div>)
  )
};

export default ChallengeCard;
