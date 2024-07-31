import React from 'react';
import { CardDecorator } from '../design/CardDecorator';
import Link from 'next/link';
import Skeleton from 'react-loading-skeleton';
import { Tooltip } from 'react-tooltip';
import FriendCard from '../social/FriendCard';

const Following = ({ followings, pageData, userData }) => {
  const { user, ownUser } = userData;
  const { setDisplayMode, page, totalPages, prevPage, nextPage } = pageData;

  return (
    <>
      <div className="bg-neutral-800 border-t-2 border-blue-600 px-4 py-4">
        <div className="flex">
          <span>
            <i
              class="fas fa-angle-double-left mr-2 py-1.5 text-2xl text-white hover:text-gray-400"
              onClick={() => setDisplayMode('default')}
            ></i>
          </span>
          <h1 className="mb-4 text-2xl font-bold uppercase text-white">
            {user && user.username}'s Following
          </h1>
        </div>

        {followings.length>0 ? (
          <div className="gap-4">
            <div className="flex justify-center p-4">
              <div className="grid max-w-7xl grid-cols-1 gap-1 md:grid-cols-2 lg:grid-cols-3">
                {followings.length > 0 ? (
                  followings.map((following, index) => (
                    <FriendCard key={index} data={following} mutual={true} />
                  ))
                ) : (
                  <p className="col-span-3 text-lg text-white">
                    You have no friends yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-neutral-400">{user && user.username} is not following anyone yet.</p>
        )}  
        {totalPages > 0 && (
          <div className="flex items-center justify-center gap-x-5 py-4">
            <button
              onClick={prevPage}
              className="w-24 rounded-sm bg-neutral-600 px-4 py-2 font-bold text-white hover:bg-neutral-500 disabled:opacity-50 "
              disabled={page === 0}
            >
              Previous
            </button>
            <span className="text-white">
              Page {page + 1} of {totalPages}
            </span>
            <button
              onClick={nextPage}
              className="w-24 rounded-sm bg-neutral-600 px-4 py-2 font-bold text-white hover:bg-neutral-500 disabled:opacity-50"
              disabled={page + 1 >= totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
      

    </>
  );
};

export default Following;
