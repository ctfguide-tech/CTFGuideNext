import React from 'react';
import { Tooltip } from 'react-tooltip';
import Markdown from 'react-markdown';




const CommentCard = ({ message, username, createAt, proUser, ownUser, pfp }) => {

  proUser = false;

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

    <div
      className="flex mt-4 rounded-lg bg-black  "
      style={{ backgroundColor: '#212121' }}
    >
      {/* Profile Picture */}
      <div className="ml-8 relative flex items-top">
        <img
          style={{ borderColor: '#ffbf00' }}
          className="mt-4 mr-4 h-16 w-16 rounded-full"
          src={pfp}
          alt=""
        />
      </div>
      <div className="w-full">
        {/* Username + Badge + Time */}
        <div className="flex grid grid-cols-2">
          <div className="flex">
            {proUser ?
              (<div className="flex">
                <h1 className="pl-5 pt-4 text-xl bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-700 text-transparent bg-clip-text">
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
              (<h1 className="pl-5 pt-4 text-xl text-white">
                {username}
              </h1>)
            }
            <h1 className="px-2 pt-5 text-md text-white">
              {formatTimeAgo(createAt)}
            </h1>
          </div>
          {/* Report Button */}
          <div className="flex justify-end w-fill">
            <i class="text-white fas fa-solid fa-flag p-4"> </i>{' '}
          </div>
        </div>

        {/* Content Area */}
        <div className=" ml-4 px-5 pb-4 text-white overflow-y-auto max-h-40">
          <Markdown>
            {message}
          </Markdown>
        </div>
        <div className="flex  ">
          
          {/* ADD FUNCT */}
          {/*  Like Button */}
          <i class="text-white text-lg far fa-thumbs-up  pl-6 -mt-1 pb-4 "> </i>{' '}
          <h1 className="pl-2 text-md text-white">
            Like
          </h1>

          {/* ADD FUNCT */}
          {/* Reply Button */}
          <i class="text-white text-lg fas fa-reply -mt-1 ml-4 "> </i>{' '}
          <h1 className="pl-2 text-md text-white">
            Reply
          </h1>

          {/* ADD FUNCT */}
          {/* Edit Button */}
          {ownUser &&
            <div className="flex">
              <i class="text-white text-lg fas fa-edit -mt-1 ml-4"> </i>{' '}
              <h1 className="pl-2 text-md text-white">
                Edit
              </h1>
            </div>
          }
        </div>
      </div>
    </div>
  )
};

export default CommentCard;