import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { useRef } from "react";
import { useScroll } from "framer-motion";
import { PracticeNav } from '@/components/practice/PracticeNav';
const pages = [
  { name: 'Hub', href: '../practice', current: false },
  { name: "Creating CTF's", href: './create', current: true },
]

export default function CTFGuide() {
  const ref = useRef(null);
  const { scrollXProgress } = useScroll({ container: ref });
  return (
    <>
      <Head>
        <title>Learn - CTFGuide</title>
        <meta
          name="description"
          content="Cybersecurity made easy for everyone"
        />
        <style>
          @import url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
        </style>
      </Head>
      <StandardNav />

      <main>
        <div className=" w-full " style={{ backgroundColor: "#212121" }}>
          <div className="flex mx-auto text-center h-28 my-auto">
            <h1 className='text-4xl text-white mx-auto my-auto font-semibold'>Guides</h1>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row">
          <div className="w-full md:w-1/5 flex md:h-screen max-w-7xl md:mx-auto md:justify-center px-8 md:px-16">
            <PracticeNav />
          </div>

          <div className='w-full md:w-4/5 px-8 xl:px-16 border-l border-gray-800 text-neutral-200'>

          <nav className="flex  mx-auto text-center mt-10" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-4">
        <li>
          <div>
            <a href="../dashboard" className=" text-white hover:text-gray-200">
                <i className="fas fa-home"></i>

              <span className="sr-only">Home</span>
            </a>
          </div>
        </li>
        {pages.map((page) => (
          <li key={page.name}>
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

          <h1 className="text-3xl font-bold mb-4 mt-5">Creating CTF’s</h1>
          <p className="mb-4">If you're interested in hosting a CTF, there are several key elements you should keep in mind to ensure a successful and engaging event. Here are some tips on how to make a good CTF</p>
          <div className='bg-neutral-800 px-4 py-4 mb-4 flex my-auto rounded-lg'>

            <h1><i className="far fa-lightbulb text-yellow-500 text-4xl px-3.5 mr-4 mt-1 bg-neutral-700 rounded-full"></i></h1>
          Unlike wargames, during a CTF, players can't skip a boring task and decide not to solve it if it's not fun. In order to win a CTF, teams are forced to solve every single challenge, because if other teams already solved or are likely to solve them, they would have a higher score. This means that a single bad challenge can ruin an otherwise fun competition, and requires CTF organizers to take deep care on the quality of the task design and implementation.
       
          </div>
          
          <h1 className='text-semibold text-2xl mb-4 mt-10'>Always keep these 7 ideas in mind when making challenges.</h1>
          <ol className="list-disc mb-4 ml-4">
            <li className="mb-2"><span className='text-blue-500 text-lg '>Define your goals</span></li>
            <li className="mb-2"><span className='text-blue-500 text-lg '>Choose your format</span>  </li>
            <li className="mb-2"><span className='text-blue-500 text-lg '>Create engaging challenges</span>  </li>
            <li className="mb-2"><span className='text-blue-500 text-lg '>Test your challenges</span>  </li>
            <li className="mb-2"><span className='text-blue-500 text-lg '>Set clear rules and guidelines</span>  </li>
            <li className="mb-2"><span className='text-blue-500 text-lg '>Host a debriefing session</span> </li>
          </ol>
          <p className="mb-4 text-lg">You can create a challenge by heading to the create dashboard and clicking on the “Create Challenge” button on the left menu. From there you will be greeted with a form where you fill in all the parameters of the CTF.</p>
          <p className="mb-4 text-lg">After you’ve done so, you can submit the challenge for approval. If you’re challenge gets approved you will get a notification on the website and will also receive an email.</p>
       
          </div>

 
        </div>
      </main>
      <Footer />


    </>
  );
}
