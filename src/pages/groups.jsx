import Head from 'next/head';
import Link from 'next/link';
import { StandardNav } from '@/components/StandardNav';
import { Button } from '@/components/Button';
import { Footer } from '@/components/Footer';

export default function ComingSoon() {
  return (
    <>
      <Head>
        <title>Coming Soon - CTFGuide</title>
        <style>
          @import
          url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
        </style>
      </Head>
      <StandardNav />
      <div className="flex min-h-screen ">
  <div className="m-auto flex flex-col py-12 sm:px-6 lg:px-8">
    <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
      <h1 className="text-center text-6xl">🚧</h1>
      <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
        This feature is still under construction.
      </h2>
    </div>

    <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
      <div className="py-8 px-4 shadow sm:rounded-lg sm:px-10 grid grid-cols-2 justify-items-center my-auto">
        <div>
          <img width="250" src="./group1.png"></img>
        </div>
        <div>
          <p className="mt-12 text-center text-xl text-gray-300 my-auto">
            A group based system for CTF teams. Create a group, invite your teammates, and start practicing together.
          </p>
          <div className="mt-6 mx-auto text-center">
            <a
              href="../practice"
              className="focus:shadow-outline-blue w-full rounded bg-blue-600 py-2 px-4 font-bold text-white hover:bg-blue-700 focus:bg-blue-700 focus:outline-none"
            >
              Return to Practice
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

      <Footer />
    </>
  );
}
