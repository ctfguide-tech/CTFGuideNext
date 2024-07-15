import FriendCard from '../components/social/FriendCard';
import Head from 'next/head';
import { Footer } from '@/components/Footer';
import { StandardNav } from '@/components/StandardNav';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { useEffect, useState } from 'react';
import request from '@/utils/request';

export default function Dashboard() {
  const [user, setUser] = useState('');
  const [mutuals, setMutuals] = useState([]);
  const [page, setPage] = useState(0); // Initial page
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
    mutuals: Array.from({ length: 12 }, () => ({ ...sampleUser })),
    totalEntries: 12,
    lastPage: 1,
    currentPage: 0,
  };

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
        <title>Dashboard - CTFGuide</title>
        <meta
          name="description"
          content="Cybersecurity made easy for everyone"
        />
        <style>
          @import
          url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
        </style>
      </Head>

      <div className="flex min-h-screen flex-col">
        <StandardNav />
        <DashboardHeader />
        <h1 className="flex justify-center pt-5 text-4xl font-bold text-white">
          Your Friends
        </h1>
        <main className="flex justify-center p-10">
          <div className="grid max-w-7xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {mutuals.length > 0 ? (
              mutuals.map((mutual, index) => (
                <FriendCard key={index} data={mutual} mutual={true} />
              ))
            ) : (
              <p className="col-span-3 text-lg text-white">
                You have no friends yet.
              </p>
            )}
          </div>
        </main>
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
        <div className="flex h-full w-full grow basis-0"></div>
        <Footer />
      </div>
    </>
  );
}
