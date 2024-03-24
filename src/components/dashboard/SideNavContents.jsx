import { useState } from 'react';
import { useEffect } from 'react';

export function SideNavContent({ }) {

  const [username, setUsername] = useState(null);

  useEffect(() => {
    setUsername(localStorage.getItem('username'))
  }, []);
  
  return (
    <>
      <div
        className="mt-10 mr-6 w-1/6 flex-none border-none text-gray-900 hidden md:block lg:block"
        style={{ borderColor: '#212121' }}
      >
        <ul className="mr-2 py-2">
          <li className="mb-4 py-1">
            <a
              href="../dashboard"
              className="px-2 py-2 text-lg font-medium text-white hover:text-neutral-300"
            >
              <i class="fas fa-chart-line mr-2"></i>Overview
            </a>
          </li>
          <li className="mb-4 py-1">
            <a
              href={`../users/${username}`}
              className="px-2 py-1 text-lg font-medium text-white hover:text-neutral-300"
            >
              <i class="fas fa-user-circle mr-2"></i>Profile
            </a>
          </li>
          <li className="mb-4 py-1 hidden">
            <a
              href="../dashboard/friends"
              className="px-2 py-1 text-lg font-medium text-white hover:text-neutral-300"
            >
              <i class="fas fa-user-friends mr-2"></i>Friends
            </a>
          </li>
          <li className="mb-4 py-1 ">
            <a
              href="../dashboard/likes"
              className="px-2 py-1 text-lg font-medium text-white hover:text-neutral-300"
            >
              <i class="fas fa-heart mr-2"></i>Likes
            </a>
          </li>
          <li className="mb-4 py-1 hidden">
            <a
              href="../dashboard/badges"
              className="px-2 py-1 text-lg font-medium text-white hover:text-neutral-300"
            >
              <i class="fas fa-certificate mr-2"></i>Badges
            </a>
          </li>
          <li className="mb-4 hidden py-1">
            <a
              href="../dashboard/my-challenges"
              className="px-2 py-1 text-lg font-medium text-white hover:text-neutral-300"
            >
              <i class="fas fa-book mr-2"></i>Your Challenges
            </a>
          </li>
          {/*<li className="mb-4 py-1"><a href="../dashboard/my-friends" className="px-2 py-1 text-white hover:text-neutral-300 font-medium text-lg"><i class="fas fa-user-friends mr-2"></i>Friends</a></li>*/}
        </ul>

        <hr className="mx-auto border-none"></hr>

        <a href="/guides/about">
          <div class="mt-6 mr-4 max-w-sm rounded-lg shadow">
            <i class="fas fa-seedling mb-2 h-10 w-10 text-3xl text-green-500 text-green-500"></i>
            <h5 class="mb-2 text-xl font-semibold tracking-tight  text-white">
              New to CTFGuide?
            </h5>
            <p class="mb-3 font-normal  text-gray-400">
              See how you can make the most of your cybersecurity journey!
            </p>
            <p class="inline-flex items-center text-blue-600 hover:underline">
              Show me more
              <svg
                class="ml-2 h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path>
              </svg>
            </p>
          </div>
        </a>


        <a href="https://discord.gg/q3hgRBvgkX">
          <div class="mt-10 mr-4 max-w-sm rounded-lg shadow">
            <i class="fab fa-discord mb-2 h-10 w-10 text-3xl  text-indigo-500"></i>
            <h5 class="mb-2 text-xl font-semibold tracking-tight  text-white">
              Join our Discord!
            </h5>
            <p class="mb-3 font-normal  text-gray-400">
              Talk to other CTF players and get help with challenges!
            </p>
            <p class="inline-flex items-center text-blue-600 hover:underline">
              Invite Link
              <svg
                class="ml-2 h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path>
              </svg>
            </p>
          </div>
        </a>
      </div>
    </>
  );
}
