import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { PracticeNav } from '@/components/practice/PracticeNav';

export default function Pratice() {
  function loadChallenges() {
    fetch('https://api.ctfguide.com/challenges/type/all')
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        for (var i = 0; i < data.length; i++) {
          var difficultyColor = 'border-green-500';

          if (data[i].difficulty == 'easy') {
            difficultyColor = 'border-green-500';
          } else if (data[i].difficulty == 'medium') {
            difficultyColor = 'border-yellow-500';
          } else if (data[i].difficulty == 'hard') {
            difficultyColor = 'border-red-500';
          }

          document.getElementById('starter').insertAdjacentHTML(
            'afterend',
            `<div class='card rounded-lg px-4 py-2 w-full border-l-4 ${difficultyColor}' style='background-color: #212121'>
                <h1 class='text-white text-2xl'>${data[i].title}</h1>
                <p class='text-white truncate'>${data[i].problem.substring(
                  0,
                  40
                )}</p>
                <div class='flex mt-2'>

                    <p class='text-white px-2  rounded-lg bg-blue-900 text-sm'>${
                      data[i].category
                    }</p>
                </div>
            </div>`
          );
        }
      })
      .catch((error) => {
        //window.alert(error);
      });
  }
  loadChallenges();

  return (
    <>
      <Head>
        <title>Practice - CTFGuide</title>
        <meta name="description" content="Practice Problems" />
        <style>
          @import
          url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
        </style>
      </Head>
      <StandardNav />
      <main>
        <div className=" w-full " style={{ backgroundColor: '#212121' }}>
          <div className="mx-auto my-auto flex h-28 text-center">
            <h1 className="mx-auto my-auto text-4xl font-semibold text-white">
              Getting started
            </h1>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row">
          <div className="flex w-full max-w-7xl px-8 md:mx-auto md:h-screen md:w-1/5 md:justify-center md:px-16">
            <PracticeNav />
          </div>
          <div className="w-full border-l border-gray-800 px-8 md:w-4/5 xl:px-16">
            Getting started
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
