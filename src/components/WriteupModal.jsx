import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import request from '@/utils/request';
import MarkdownViewer from '@/components/MarkdownViewer';

const WriteupModal = ({ isOpen, onClose, writeup }) => {
  const [upvotes, setUpvotes] = useState(writeup?.upvotes || 0);
  const [downvotes, setDownvotes] = useState(writeup?.downvotes || 0);
  const [authorPfp, setAuthorPfp] = useState('');



  useEffect(() => {
    async function fetchAuthorPfp(username) {
      try {
        const endPoint = `${process.env.NEXT_PUBLIC_API_URL}/users/${username}/pfp`;
        const result = await request(endPoint, "GET", null);
        setAuthorPfp(result || `https://robohash.org/${username}.png?set=set1&size=150x150`);
      } catch (err) {
        console.log('failed to get profile picture');
      }
    }

    if (writeup && writeup.user && writeup.user.username) {
      fetchAuthorPfp(writeup.user.username);
    }
  }, [writeup]);

  const upvoteWriteup = async (writeupId) => {
    try {
      const response = await request(`${process.env.NEXT_PUBLIC_API_URL}/writeups/${writeupId}/upvote`, 'POST', { "message": "Upvoted writeup" });
      if (response.success) {
        setUpvotes(response.upvotes);
        setDownvotes(response.downvotes);
      } else {
        console.error("Failed to upvote:", response.message);
      }
    } catch (error) {
      console.error("Error upvoting writeup:", error);
    }
  };

  const downvoteWriteup = async (writeupId) => {
    try {
      const response = await request(`${process.env.NEXT_PUBLIC_API_URL}/writeups/${writeupId}/downvote`, 'POST', { "message": "Downvoted writeup" });
      if (response.success) {
        setUpvotes(response.upvotes);
        setDownvotes(response.downvotes);
      } else {
        console.error("Failed to downvote:", response.message);
      }
    } catch (error) {
      console.error("Error downvoting writeup:", error);
    }
  };

  if (!writeup || !writeup.challenge) {
    return null; // or a loading spinner, or some other fallback UI
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        <div className="relative bg-neutral-800 text-white w-full rounded max-w-3xl mx-auto p-6">
          <h1 className="text-3xl">{writeup.title} <span className="text-lg text-white">for {writeup.challenge.title}</span></h1>
          <div className="flex items-center">
            <img src={authorPfp} alt="Author's profile picture" className="h-8 w-8 bg-neutral-700 rounded-full mr-2" />
            <p className="text-lg">
              Authored by <a href={`/users/${writeup.user.username}`} className={`text-blue-500 hover:underline ${writeup.user.role === 'PRO' ? 'bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent' : ''}`}>
                {writeup.user.username}
              </a>
            </p>
          </div>
          <div className="mt-4">
            { hasVideo &&
            <div className='text-white bg-neutral-900/50 border border-neutral-800/50 rounded-lg p-4 mt-2'>
              <iframe width="100%" height="315" src={`https://www.youtube.com/embed/${getEmbedUrl(videoLink)}`} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
            }
      

            <MarkdownViewer content={writeup.content} />
          </div>
          <div className="mt-4 text-right">
            <button className="px-2 rounded-full bg-green-700 hover:bg-green-600" onClick={() => upvoteWriteup(writeup.id)}>
              <i className="fas fa-arrow-up"></i> {upvotes}
            </button>
            <button className="px-2 rounded-full bg-red-700 hover:bg-red-600 ml-2" onClick={() => downvoteWriteup(writeup.id)}>
              <i className="fas fa-arrow-down"></i> {downvotes}
            </button>
          </div>
          <button className="mt-6 bg-neutral-700 hover:bg-neutral-600 px-4 py-2 rounded-sm" onClick={onClose}>Close</button>
        </div>
      </div>
    </Dialog>
  );
};

export default WriteupModal;