import Head from 'next/head';

import { Footer } from '@/components/Footer';
import { StandardNav } from '@/components/StandardNav';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { useEffect } from 'react';
import { useState } from 'react';
import { SideNavContent } from '@/components/dashboard/SideNavContents';


export default function Dashboard() {
  const [likes, setLikes] = useState([]);
  const [username, setUsername] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${localStorage.getItem('userLikesUrl')}`);
        const data = await response.json();
        console.log(data);
        setLikes(data);
        setUsername(localStorage.getItem('username'));
        likes.map((like) => console.log(like.challenge.slug));
      } catch {}
    };
    fetchData();
    setLikes([]);
  }, []);

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
      <StandardNav />
      <main>
        <DashboardHeader />

        <div className="mx-auto flex h-screen max-w-7xl ">
          {/* Sidebar */}
          <SideNavContent username={username}/>

          {/* Main content area */}
          <div className="flex-1 mt-5">
            <h1 className="mt-5 text-3xl text-white">My Likes</h1>
            {/* Fetch likes from API */}

            {likes.length === 0 && (
              <div className="mt-3">
                <h1 className="rounded-sm border border-white/10 bg-neutral-800/50 px-6 py-3 text-lg text-white">
                  🤔 Hmm, looks like you haven't liked a challenge yet!
                </h1>
              </div>
            )}

            <div className="mt-5 flex flex-col">
              {likes.map((like) => (
                <div>
                  <a
                    href={`/challenges/${like.challenge.slug}`}
                    className="align-center mb-4 flex rounded-sm border-l-4 border-blue-700 bg-[#212121] px-5 py-3 text-white hover:border-blue-800 hover:bg-[#262626]"
                  >
                    <h2 className="align-middcenterle text-xl font-semibold">
                      {like.challenge.title}
                    </h2>

                    <div className="align-center ml-auto flex">
                      <div className="rounded-md bg-blue-700 px-3 py-1">
                        <p> {like.challenge.category.join(', ')}</p>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
     

        </div>
      </main>
      <Footer />
    </>
  );
}
