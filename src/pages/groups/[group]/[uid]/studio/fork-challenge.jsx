import Head from 'next/head';
import { useState, useEffect } from 'react';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { MarkdownViewer } from '@/components/MarkdownViewer';
import Editor from '@/components/studio/forking/editor';
import ChallengeSelectView from '@/components/studio/forking/ChallengeSelectView';

const pages = [
  { name: 'Groups', href: '../create', current: false },
  {
    name: 'Course Name',
    href: './',
    current: false,
  },
  { name: 'New Assignment', href: '#', current: false },
  {
    name: 'Fork Challenge',
    href: '#',
    current: true,
  },
];

const styles = {
  h1: { fontSize: '2.4rem' },
  h2: { fontSize: '2rem' },
  h3: { fontSize: '1.8rem' },
  h4: { fontSize: '1.6rem' },
  h5: { fontSize: '1.4rem' },
  h6: { fontSize: '1.2rem' },
};
export default function Createchall() {
  const [activeTab, setActiveTab] = useState('created');
  const [contentPreview, setContentPreview] = useState('');
  const [challengeSelected, setChallengeSelected] = useState(false);
  const [challengeSlug, setChallengeSlug] = useState('');
  const [username, setUsername] = useState('anonymous');
  useEffect(() => {
    setUsername(localStorage.getItem('username'));
  }, []);
  function handleTabClick(tab) {
    setActiveTab(tab);
  }

  function updateSelectionState(status, slug) {
    setChallengeSelected(true);
    setChallengeSlug(slug);

    console.log(`Challenge selected: ${slug}`);
  }

  return (
    <>
      <Head>
        <title>Create - CTFGuide</title>
        <style>
          @import
          url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
        </style>
      </Head>
      <StandardNav />

      <main style={styles}>
        <nav
          className="mx-auto mt-10 flex max-w-7xl text-center"
          aria-label="Breadcrumb"
        >
          <ol role="list" className="flex items-center space-x-4">
            <li>
              <div>
                <a href="#" className=" text-white hover:text-gray-200">
                  <i className="fas fa-home"></i>

                  <span className="sr-only">Home</span>
                </a>
              </div>
            </li>
            {pages.map((page, idx) => (
              <li key={idx}>
                <div className="flex items-center">
                  <svg
                    className="h-5 w-5 flex-shrink-0 text-gray-200"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                  </svg>
                  <a
                    href={page.href}
                    className="ml-4 text-sm font-medium text-gray-100 hover:text-gray-200"
                    aria-current={page.current ? 'page' : undefined}
                  >
                    {page.name}
                  </a>
                </div>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mx-auto mt-10  max-w-7xl ">
          {challengeSelected ? (
            <Editor slug={challengeSlug} assignmentInfo={props} />
          ) : (
            <ChallengeSelectView updateChallenge={updateSelectionState} />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
