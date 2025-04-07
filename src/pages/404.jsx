import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const NotFound = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const [pathname, setPathname] = useState('');

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  return (
    <>
      <Head>
        <title>Page Not Found!</title>
        <meta name="description" content="Cybersecurity made easy for everyone" />
        <style>
          {`@import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');`}
        </style>
      </Head>
      <div className="grid h-screen place-items-center bg-center">
        <div className="text-blue-600 mx-auto text-center">
          <div className='grid-cols-1 grid'>
            <div className='p-2'>
              <img
                width="150"
                src={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/ctfguide404WithLogo.png`}
                className='mx-auto text-center mt-5'
                alt="CTF Guide 404"
              />
              <h1 className='text-white text-xl mt-4'>Uh, oh. We looked everywhere and couldn't find that page.</h1>
              <div className='bg-black text-white text-left px-4 py-4 mt-4 mb-4'>
                <div>
                  root@ctfguide:/home/cat/cat_stuff: <span className='text-yellow-400'>cd {pathname}</span> <br />
                  bash: cd: {pathname}: <span className='text-red-500'>No such file or directory</span>
                </div>
                <br />
                <div className='text-center mt-4 mb-4'>
                  <a className='hidden hover:text-blue-500 cursor-pointer' onClick={() => router.back()}>[Previous Page]</a>
                  <a className='ml-2 hover:text-blue-500 cursor-pointer' href="https://twitter.com/ctfguideapp">[Check our Twitter]</a>
                  <a className='ml-2 hover:text-blue-500 cursor-pointer' href="https://discord.gg/cTp4w9u8F2">[Join our Discord]</a>
                </div>
              </div>

              <span
                onClick={() => router.back()}
                className="cursor-pointer text-neutral-200 hover:text-neutral-400 mr-4 text-2xl"
              >
                <i className="fas fa-arrow-left"></i> Go Back
              </span>

              <img
                width="500"
                src={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/Kana404.png`}
                className='mx-auto mt-10 text-center hidden lg:block'
                alt="Kana 404"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;