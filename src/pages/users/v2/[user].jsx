import Head from 'next/head';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import request from '@/utils/request';
import { MarkdownViewer } from '@/components/MarkdownViewer';
import { useRouter } from 'next/router';
import CreatedChallenges from '@/components/profile/v2/CreatedChallenges';
import LikedChallenges from '@/components/profile/v2/LikedChallenges';
import Badges from '@/components/profile/v2/Badges';
import Writeups from '@/components/profile/v2/Writeups';
import FriendCard from '@/components/social/FriendCard';

export default function Create() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('LIKED CHALLENGES');
  const [isBioExpanded, setIsBioExpanded] = useState(false);

  // Follower/Following
  const [displayMode, setDisplayMode] = useState('default');
  const [mutuals, setMutuals] = useState([]);
  const [page, setPage] = useState(0);             // Initial page
  const [totalPages, setTotalPages] = useState(0); // Total pages

  const sampleUser = {
    username: 'testAccount',
    location: '???',
    profileImage: '',
    leaderboardNum: -1,
    bannerImage: '',
    role: 'USER',
    followedBy: [
      {
        createdAt: '2024-06-29T22:08:05.594Z',
        followerId: '8ff3259c-3b52-4131-ada7-9f6c4230ca36',
        followingId: '2c77b4cd-35cb-43a9-887e-2cee93f219d0',
      },
    ],
  };

  const sampleData = {
    mutuals: Array.from({ length: 6 }, () => ({ ...sampleUser })),
    totalEntries: 6,
    lastPage: 1,
    currentPage: 0,
  };

  const toggleBio = () => {
    setIsBioExpanded(!isBioExpanded);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'LIKED CHALLENGES':
        return (
          <>
            <h1 className="text-2xl font-bold text-white">LIKED CHALLENGES</h1>
            {user && <LikedChallenges user={user} />}
          </>
        );
      case 'WRITEUPS':
        return (
          <>
            <h1 className="text-2xl font-bold text-white">WRITEUPS</h1>
            {user && <Writeups user={user} />}
          </>
        );
      case 'CREATED CHALLENGES':
        return (
          <>
            <h1 className="text-2xl font-bold text-white">
              CREATED CHALLENGES
            </h1>
            <CreatedChallenges />
          </>
        );
      case 'BADGES':
        return (
          <>
            <h1 className="text-2xl font-bold text-white">BADGES</h1>
            <Badges />
          </>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    request(
      `${process.env.NEXT_PUBLIC_API_URL}/users/${router.query.user}`,
      'GET',
      null
    )
      .then((data) => {
        console.log(data);
        setUser(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [router.query.user]);

  // Get The User's Following
  useEffect(() => {
    const storedUser = localStorage.getItem('username');
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const endPoint =
            process.env.NEXT_PUBLIC_API_URL +
            '/followers/' +
            user +
            `/mutuals?page=${page}`;
          const result = await request(endPoint, 'GET');
          if (result && result.mutuals) {
            setMutuals(result.mutuals);
            setTotalPages(result.lastPage + 1);
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchData();
    }
  }, [user, page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  const nextPage = () => handlePageChange(page + 1);
  const prevPage = () => handlePageChange(page - 1);

  return (
    <>
      <Head>
        <title>{user && user.username}'s Profile - CTFGuide</title>
        <style>
          @import
          url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
        </style>
      </Head>
      <StandardNav />

      <main className="mx-auto mt-10 max-w-7xl">
        <div className="flex w-full flex-col items-center bg-neutral-800 px-10 py-10 text-xl text-white md:flex-row">
          <div className="flex flex-col items-center md:flex-row">
            {user && (
              <>
                <img
                  src={user.profileImage || ''}
                  alt="Profile Image"
                  className="h-20 w-20 rounded-full"
                />
                <h1 className="ml-4 mr-2 text-3xl font-bold">
                  {user.username}
                </h1>
              </>
            )}
            <div className="ml-4 mr-2 mt-2 bg-yellow-500  px-4 py-1 text-sm font-bold md:mt-0">
              <p>
                <i className="fas fa-crown"></i> pro
              </p>
            </div>
            <div className="mt-2 bg-red-600  px-4 py-1 text-sm font-bold md:mt-0">
              <p>
                <i className="fas fa-code"></i> dev
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-col items-center md:mt-0 md:flex-row lg:ml-auto">
            {/*followers following*/}
            <div className="flex flex-col items-center gap-x-4 px-2 text-lg md:flex-row">
              <p>
                {user && (
                  <>
                    <span
                      className="cursor-pointer font-bold hover:text-gray-300"
                      onClick={() => setDisplayMode('followers')}
                    >
                      {' '}
                      Followers
                    </span>{' '}
                    {user.followers || '0'}
                    <span
                      className="ml-4 cursor-pointer font-bold hover:text-gray-300"
                      onClick={() => setDisplayMode('following')}
                    >
                      {' '}
                      Following
                    </span>{' '}
                    {user.following || '0'}
                  </>
                )}
              </p>

              <div className="mt-2 flex items-center gap-x-2 md:mt-0">
                <button className="rounded-full bg-blue-600 px-4 text-sm">
                  <i class="fas fa-user-plus"></i>
                </button>
                <button className="rounded-full bg-red-600 px-4 text-sm">
                  <i class="fas fa-flag"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* MARKER 1 */}
        <div className="mt-10 grid grid-cols-1 gap-y-4 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-4 lg:gap-x-4 ">
          <div className="w-full border-t-4 border-blue-600 bg-neutral-800">
            <div className="col-span-2 bg-neutral-800 px-4 pt-4 ">
              <h1 className="text-2xl font-bold text-white">ACTIVITY FEED</h1>
              {user && (
                <h1 className="mx-auto my-auto text-neutral-400">
                  Looks like {user.username} hasn't been that active.
                </h1>
              )}
              <hr className="ml-2 mr-2 mt-4 px-4"></hr>
            </div>

            <div className="col-span-2 bg-neutral-800 px-4 pt-4 ">
              <div className="bg-neutral-800">
                <h1 className="text-2xl font-bold text-white">SKILL CHART</h1>
                {user && (
                  <h1 className="mx-auto my-auto text-neutral-400">
                    It seems that {user.username} hasn't solved any challenges
                    yet.
                  </h1>
                )}
              </div>
              <hr className="ml-2 mr-2 mt-4 px-4"></hr>
            </div>

            <div className="gap-y-4 bg-neutral-800 px-4 py-4">
              <h1 className="text-2xl font-bold text-white">NERD STATS</h1>
              {user && (
                <div className="text-xs text-neutral-400">
                  <p>
                    Creation Date :{' '}
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      minute: 'numeric',
                      hour: 'numeric',
                    })}
                  </p>
                  <p>Total Challenges: {user.totalChallenges || '0'}</p>
                  <p>Total Writeups: {user.totalWriteups || '0'}</p>
                  <p>Total Badges: {user.totalBadges || '0'}</p>
                </div>
              )}
            </div>
          </div>

          <div className="col-span-3 border-t-4 border-blue-600">
            {displayMode === 'followers' && (
              <>
                <div className="bg-neutral-800 px-4 py-4">
                  <div className="flex">
                    <span onClick={() => setDisplayMode('default')}>
                      <i class="fas fa-angle-double-left mr-2 py-1.5 text-2xl text-white hover:text-gray-400"></i>
                    </span>
                    <h1 className="mb-4 text-2xl font-bold uppercase text-white">
                      {user.username}'s Followers
                    </h1>
                  </div>

                  {true ? (
                    <div className="gap-4">
                      <div className="flex justify-center p-4">
                        <div className="grid max-w-7xl grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                          {sampleData.mutuals.length > 0 ? (
                            sampleData.mutuals.map((mutual, index) => (
                              <FriendCard
                                key={index}
                                data={mutual}
                                mutual={true}
                              />
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
                    <p className="text-neutral-400">No followers yet.</p>
                  )}
                  {totalPages > 0 && (
                    <div className="flex items-center justify-center gap-x-5 py-4">
                      <button
                        onClick={prevPage}
                        className="w-24 rounded-sm bg-gray-800 px-4 py-2 font-bold text-white hover:bg-gray-700 disabled:opacity-50 "
                        disabled={page === 0}
                      >
                        Previous
                      </button>
                      <span className="text-white">
                        Page {page + 1} of {totalPages}
                      </span>
                      <button
                        onClick={nextPage}
                        className="w-24 rounded-sm bg-gray-800 px-4 py-2 font-bold text-white hover:bg-gray-700 disabled:opacity-50"
                        disabled={page + 1 >= totalPages}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {displayMode === 'following' && (
              <>
                <div className="bg-neutral-800 px-4 py-4">
                  <div className="flex">
                    <span onClick={() => setDisplayMode('default')}>
                      <i class="fas fa-angle-double-left mr-2 py-1.5 text-2xl text-white hover:text-gray-400"></i>
                    </span>
                    <h1 className="mb-4 text-2xl font-bold uppercase text-white">
                      {user.username}'s Following
                    </h1>
                  </div>

                  {true ? (
                    <div className="gap-4">
                      <div className="flex justify-center p-4">
                        <div className="grid max-w-7xl grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                          {sampleData.mutuals.length > 0 ? (
                            sampleData.mutuals.map((mutual, index) => (
                              <FriendCard
                                key={index}
                                data={mutual}
                                mutual={true}
                              />
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
                    <p className="text-neutral-400">No followers yet.</p>
                  )}
                  {totalPages > 0 && (
                    <div className="flex items-center justify-center gap-x-5 py-4">
                      <button
                        onClick={prevPage}
                        className="w-24 rounded-sm bg-gray-800 px-4 py-2 font-bold text-white hover:bg-gray-700 disabled:opacity-50 "
                        disabled={page === 0}
                      >
                        Previous
                      </button>
                      <span className="text-white">
                        Page {page + 1} of {totalPages}
                      </span>
                      <button
                        onClick={nextPage}
                        className="w-24 rounded-sm bg-gray-800 px-4 py-2 font-bold text-white hover:bg-gray-700 disabled:opacity-50"
                        disabled={page + 1 >= totalPages}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {displayMode === 'default' && (
              <>
                <div className="bg-neutral-800 px-4 py-4">
                  {user && (
                    <h1 className="mb-4 text-2xl font-bold uppercase text-white">
                      ABOUT {user.username}
                    </h1>
                  )}

                  <p className="text-neutral-400">{user && user.bio}</p>
                </div>

                <div className="grid grid-cols-1 gap-y-4 pt-4 ">
                  <div>
                    <div className="pb-2 ">
                      <ul className="hidden w-full list-none text-neutral-500 md:flex">
                        {[
                          'LIKED CHALLENGES',
                          'WRITEUPS',
                          'CREATED CHALLENGES',
                          'BADGES',
                        ].map((tab) => (
                          <li
                            key={tab}
                            className={`mr-4 cursor-pointer ${
                              activeTab === tab
                                ? 'border-b-2 border-blue-600 font-semibold text-blue-600'
                                : ''
                            }`}
                            onClick={() => setActiveTab(tab)}
                          >
                            {tab}
                          </li>
                        ))}
                      </ul>
                      <select
                        className="w-1/2 w-full rounded border-none bg-neutral-800 px-4 text-neutral-50 md:hidden"
                        value={activeTab}
                        onChange={(e) => setActiveTab(e.target.value)}
                      >
                        {[
                          'LIKED CHALLENGES',
                          'WRITEUPS',
                          'CREATED CHALLENGES',
                          'BADGES',
                        ].map((tab) => (
                          <option key={tab} value={tab}>
                            {tab}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="border-t-4 border-blue-600 bg-neutral-800 px-4 py-4">
                      {user && renderContent()}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="col-span-2 "></div>
        </div>

        {/* MARKER 2 */}
      </main>

      <div className=" flex h-full w-full grow basis-0"></div>
      <Footer />
    </>
  );
}
