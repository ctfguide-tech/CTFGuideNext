import React, { useEffect, useState } from 'react'
import { CardDecorator } from '../design/CardDecorator'
import Link from 'next/link'
import Skeleton from 'react-loading-skeleton'
import { EyeIcon, HeartIcon, PuzzlePieceIcon, ThumbUpIcon, ThumbDownIcon } from '@heroicons/react/20/solid'
import request from '@/utils/request'

/**
 * @param {import('react').HTMLAttributes<HTMLDivElement> & { challenge: {id: string, title: string, category: string, difficulty: string, createdAt: string, creator: string, views: number, likes: number} }} props
 * */
const ChallengeCard = (_props) => {
  const { challenge, ...props } = _props
  const [creatorPfp, setCreatorPfp] = useState('')
  const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL
  // generate code to hit /users endpoint for each challenge creator
  const [creator, setCreator] = useState(null)
  useEffect(() => {
    async function fetchCreatorData (username) {
      const endPoint = `${process.env.NEXT_PUBLIC_API_URL}/users/${username}`
      const result = await request(endPoint, 'GET', null)
      setCreator(result)
      if (result.profileImage) {
        setCreatorPfp(result.profileImage)
      } else {
        setCreatorPfp(`https://robohash.org/${username}.png?set=set1&size=150x150`)
      }
    }
    if (challenge && challenge.creator) {
      fetchCreatorData(challenge.creator)
    }
  }, [challenge])

  const dateFormatted = (date) =>
    new Date(date)
      .toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      })

  const colorBG = {
    BEGINNER: 'group-hover:bg-blue-500',
    EASY: 'group-hover:bg-green-500',
    MEDIUM: 'group-hover:bg-orange-500',
    HARD: 'group-hover:bg-red-500',
    INSANE: 'group-hover:bg-purple-500'
  }
  const colorText = {
    BEGINNER: 'bg-blue-500 text-blue-50',
    EASY: 'bg-green-500 text-green-50',
    MEDIUM: 'bg-orange-500 text-orange-50',
    HARD: 'bg-red-500 text-red-50',
    INSANE: 'bg-purple-500 text-purple-50'
  }
  const colorBorder = {
    BEGINNER: 'border-blue-500',
    EASY: 'border-green-500',
    MEDIUM: 'border-orange-500',
    HARD: 'border-red-500',
    INSANE: 'border-purple-500'
  }

  return (
    challenge && (
      <Link {...props} className={`group w-full  border-l-4 ${colorBorder[challenge.difficulty]} bg-[#212121] px-5 py-6 hover:bg-[#2c2c2c] ${props.className ?? ''}`} href={`${baseUrl}/challenges/${challenge.id}`}>
        <div className='flex justify-between'>
          <h1 className='truncate text-2xl font-bold text-white pr-1'>{challenge.title}</h1>

          <div className='flex items-center text-gray-4000'>
            <span className='text-green-300'><i className='fas fa-arrow-up text-green-300' /> {challenge.upvotes !== undefined ? challenge.upvotes : <Skeleton width={20} />}</span>
            <span className='ml-2 text-red-300'><i className='fas fa-arrow-down text-red-200' />  {challenge.downvotes !== undefined ? challenge.downvotes : <Skeleton width={20} />}</span>
          </div>
        </div>
        <div className='mt-2 flex items-center text-gray-400'>
          <img
            className='h-5 w-5 mr-2 rounded-full'
            src={creatorPfp || 'default-profile-image-url'}
            alt='Profile Picture'
          />
          <span>@{challenge.creator}</span>
          {creator && creator.role === 'ADMIN' && (
            <span className='text-red-500 text-xs ml-1'><i className='fas fa-code fa-fw' /></span>
          )}
          {creator && creator.role === 'PRO' && (
            <span className='text-yellow-500 text-xs ml-1'><i className='fas fa-crown fa-fw' /></span>

          )}
        </div>

        <div className='mt-4 flex items-center'>
          <PuzzlePieceIcon className='h-5 w-5 mr-2 text-white' />
          <span className='text-white'>{challenge.category}</span>
          <span className={`ml-4 px-2  rounded-sm text-sm font-bold capitalize ${colorText[challenge.difficulty || 0]}`}>{challenge.difficulty?.toLowerCase() || <Skeleton />}</span>

          <div className=' ml-auto flex text-gray-400'>
            <EyeIcon className='h-5 w-5 mr-2' />
            <span>{challenge.views !== undefined ? challenge.views : <Skeleton width={20} />}</span>

          </div>
        </div>
      </Link>
    ) || (
      <div {...props} className={`bg-neutral-800 w-full rounded-sm pl-8 pr-6 py-4 leading-8 ${props.className ?? ''}`}>
        <Skeleton baseColor='#262626' highlightColor='#3a3a3a' width='10rem' />
        <Skeleton baseColor='#262626' highlightColor='#3a3a3a' width='12rem' />
        <Skeleton baseColor='#262626' highlightColor='#3a3a3a' width='4rem' />
        <Skeleton baseColor='#262626' highlightColor='#3a3a3a' />
      </div>
    )
  )
}

export default ChallengeCard
