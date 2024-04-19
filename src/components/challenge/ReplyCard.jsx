import React from 'react';
import { Tooltip } from 'react-tooltip';
import Markdown from 'react-markdown';
import { useEffect, useState, Fragment } from 'react';
import request from '../../utils/request';

const ReplyCard = ({ likedComment, commentId, challengeId,
  message, username, createAt, proUser, ownUser, pfp, likeCount,
  children, allComments, ownPfp, ownUsername, fetchComments }) => {

  // const [likes, setLikes] = useState(likeList.length);
  const [liked, setLiked] = useState(likedComment);
  const [likes, setLikes] = useState(likeCount);

  const [content, setContent] = useState(message);
  const [editMode, setEditMode] = useState(false);
  const [tempContent, setTempContent] = useState(content);
  const [banner, setBanner] = useState(false);
  const [time, setTime] = useState(createAt);

  const [replyMode, setReplyMode] = useState(false);
  const [reply, setReply] = useState(`[@${username}](/users/${username})`);
  


  proUser = false;


  const submitComment = async () => {
    const endPoint = process.env.NEXT_PUBLIC_API_URL + '/challenges/' + challengeId + '/comments/' + commentId + '/reply';
    const result = await request(endPoint, 'POST', { content: reply });

    document.getElementById('comment').value = '';
    setReplyMode(false);
    window.location.reload();

    if (!result || result.error) {
      console.log('Error occured while adding the comment');
    }
  };

  const commentChange = (event) => {
    setReply(event.target.value);
  };

  function replyModeOn() {
    setReplyMode(true);
  }

  function replyModeOff() {
    setReplyMode(false);
  }

  async function saveEdit() {
    setContent(document.getElementById('commentArea').value);
    cancelEdit();
    try {
      const endpoint = process.env.NEXT_PUBLIC_API_URL + '/challenges/' + challengeId + '/comments/' + commentId + '/edit';
      const body = {
        content: document.getElementById('commentArea').value,
      };
      const data = await request(endpoint, 'POST', body);
      if (!data) {
        console.log("Failed to edit comment");
      }
      setTime(new Date());

    } catch {
      console.log("Failed to edit comment");
    }
  }

  function editComment() {
    setEditMode(true);
  }

  function cancelEdit() {
    setEditMode(false);
    setBanner(false);
  }

  const openBanner = () => {
    setBanner(true);
    setTempContent(event.target.value);
  }

  const likeComment = async () => {
    try {
      const endpoint = process.env.NEXT_PUBLIC_API_URL + '/challenges/' + challengeId + '/comments/' + commentId + '/like';
      await request(endpoint, 'POST', {});
      if (liked) {
        setLikes(likes - 1);
        setLiked(false);
      } else {
        setLikes(likes + 1);
        setLiked(true);
      }
    } catch {
      console.log("Failed to like comment");
    }
  };

  function formatTimeAgo(createAt) {
    const currentDate = new Date();
    const createdAtDate = new Date(createAt);
    const differenceMs = currentDate - createdAtDate;

    const differenceSeconds = Math.floor(differenceMs / 1000);

    const minutes = Math.floor(differenceSeconds / 60);
    const hours = Math.floor(differenceSeconds / 3600);
    const days = Math.floor(differenceSeconds / (3600 * 24));

    if (minutes < 60) {
      if (minutes == 0) {
        return 'Just now';
      }
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (hours < 24) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
  }


  return (
    <>
      <div
        className={`ml-24 mt-2 flex`}
        style={{ backgroundColor: '#212121' }}
      >
        {/* Profile Picture */}
        <div className="ml-8 pt-5 relative flex items-start">
          <img
            className="border border-blue-400/50 mr-2 h-16 w-16 rounded-full"
            src={pfp}
            alt=""
          />
        </div>
        <div className=" w-full" style={{ backgroundColor: '#212121' }} >
          {/* Username + Badge + Time */}
          <div className="grid grid-cols-2">
            <div className="flex">
              {proUser ?
                (<div className="flex">
                  <h1 className="pl-8 pt-4 text-xl bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-700 text-transparent bg-clip-text">
                    {username}
                  </h1>
                  <img
                    style={{ borderColor: '#ffbf00' }}
                    className="ml-2 mt-5 h-6 w-6 rounded-md"
                    src={'https://cdn.discordapp.com/attachments/1153450172056096798/1225922833222336522/CTFGuideGold.png?ex=6622e49b&is=66106f9b&hm=b05807871ea7aa8e2de06f8525b69e5244269a20314511cfeed44d4a4ae73f4e&'}
                    alt=""
                  />
                </div>)
                :
                (<h1 className="pl-8 pt-4 text-xl text-white">
                  {username}
                </h1>)
              }
              <h1 className="px-2 pt-5 text-md text-white">
                {formatTimeAgo(time)}
              </h1>
            </div>
            {/* Report Button */}
            <div className="flex justify-end w-fill">
              <i class="text-white fas fa-solid fa-flag p-4"> </i>{' '}
            </div>
          </div>

          {/* Content Area */}
          {editMode ?
            (
              <div className="ml-4 pr-10 ">
                <textarea
                  id="commentArea"
                  style={{ backgroundColor: '#212121' }}
                  readOnly={false}
                  onChange={openBanner}
                  value={tempContent}
                  className="rounded-md px-5 text-white overflow-y-auto max-h-40 w-full resize-none"
                ></textarea>
              </div>
            )
            :
            (
              <div className=" ml-4 pt-2 px-5 pb-4 text-white overflow-y-auto max-h-40">
                <Markdown>
                  {content}
                </Markdown>
              </div>
            )
          }
          <div className="flex pt-2">

            {/*  Like Button */}
            <button
              onClick={likeComment}
              className="ml-6 -mt-1 mb-4 px-2 flex items-center justify-center rounded-md hover:bg-neutral-700"
            >
              {liked ?
                <h1 className="text-md text-white">
                  <i class="text-white text-lg fas fa-thumbs-up "> </i>{' '}
                  {likes} Like
                </h1>
                :
                <h1 className="text-md text-white">
                  <i class="text-white text-lg far fa-thumbs-up "> </i>{' '}
                  {likes} Like
                </h1>
              }
            </button>

            {/* ADD FUNCT */}
            {/* Reply Button */}
            <button
              onClick={replyModeOn}
              className="ml-2 -mt-1 mb-4 px-2 flex items-center justify-center rounded-md hover:bg-neutral-700"
            >
              <h1 className=" text-md text-white">
                <i class="text-white text-lg fas fa-reply"> </i>{' '}
                Reply
              </h1>
            </button>

            {/* ADD FUNCT */}
            {/* Edit Button */}
            {ownUser && (!editMode ?
              (
                <button
                  onClick={editComment}
                  className="ml-2 -mt-1 mb-4 px-2 flex items-center justify-center rounded-md hover:bg-neutral-700"
                >
                  <h1 className=" text-md text-white">
                    <i class="text-white text-lg fas fa-edit"> </i>{' '}
                    Edit
                  </h1>
                </button>
              )
              :
              (
                <button
                  onClick={cancelEdit}
                  className="ml-2 -mt-1 mb-4 px-2 flex items-center justify-center rounded-md hover:bg-neutral-700"
                >
                  <h1 className="text-md text-white">
                    <i class="text-white text-lg fas fa-times"> </i>{' '}
                    Cancel
                  </h1>
                </button>
              )
            )}
          </div>
        </div>
        {
          banner && (
            <div
              style={{ backgroundColor: '#212121' }}
              id="savebanner"
              className="fixed inset-x-0 bottom-0 flex flex-col justify-between gap-y-4 gap-x-8 p-6 ring-1 ring-gray-900/10 md:flex-row md:items-center lg:px-8"
            >
              <p className="max-w-4xl text-2xl leading-6 text-white">
                You have unsaved changes.
              </p>
              <div className="flex flex-none items-center gap-x-5">
                <button
                  onClick={saveEdit}
                  type="button"
                  className="rounded-md bg-green-700 px-3 py-2 text-xl font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
                >
                  Save Changes
                </button>
                <button
                  onClick={cancelEdit}
                  type="button"
                  className="text-xl font-semibold leading-6 text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          )
        }
      </div>

      {/* REPLY COMMENT */}
      {replyMode &&
        <div className={`flex mt-4 rounded-lg bg-black `}
          style={{ backgroundColor: '#212121' }}>
          <div className="ml-8 py-5 relative flex items-start">
            <img
              className="border border-blue-400/50 mr-2 h-16 w-16 rounded-full"
              src={ownPfp}
              alt=""
            />
          </div>
          <div className="w-full">
            {/* Username + Badge + Time */}
            <div className="flex grid grid-cols-2">
              <div className="flex">
                {proUser ?
                  (<div className="flex">
                    <h1 className="pl-8 pt-4 text-xl bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-700 text-transparent bg-clip-text">
                      {ownUsername}
                    </h1>
                    <img
                      style={{ borderColor: '#ffbf00' }}
                      className="ml-2 mt-5 h-6 w-6 rounded-md"
                      src={'https://cdn.discordapp.com/attachments/1153450172056096798/1225922833222336522/CTFGuideGold.png?ex=6622e49b&is=66106f9b&hm=b05807871ea7aa8e2de06f8525b69e5244269a20314511cfeed44d4a4ae73f4e&'}
                      alt=""
                    />
                  </div>)
                  :
                  (<h1 className="pl-8 pt-4 text-xl text-white">
                    {ownUsername}
                  </h1>)
                }
              </div>
            </div>
            <div>
            <div className="pt-2 ml-4 pr-10 ">
                <textarea
                  id="comment"
                  style={{ backgroundColor: '#212121' }}
                  readOnly={false}
                  onChange={commentChange}
                  className="rounded-md px-5 text-white overflow-y-auto max-h-40 w-full resize-none"
                >{`[@${username}](/users/${username})`}</textarea>
              </div>
            </div>
            <button
              onClick={replyModeOff}
              id="CancelReplyButton"
              className="ml-4 mt-2 mb-4 rounded-lg  border border-gray-700  px-4 py-1 text-white hover:bg-gray-900"
            >
              Cancel
            </button>
            <button
              onClick={submitComment}
              id="PostReplyButton"
              className="ml-4 mt-2 mb-4 rounded-lg bg-blue-800/50 border border-gray-700  px-4 py-1 text-white hover:bg-gray-900"
            >
              Post
            </button>
          </div>
        </div>
      }
    </>
  )
};

export default ReplyCard;