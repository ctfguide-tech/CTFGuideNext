import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { useRef } from 'react';
import { useScroll } from 'framer-motion';
import { PracticeNav } from '@/components/practice/PracticeNav';
const pages = [
  { name: 'Hub', href: '../practice', current: false },
  { name: "Creating CTF's", href: './create', current: true },
];

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
          @import
          url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
        </style>
      </Head>
      <StandardNav />

      <main>
        <div className=" w-full " style={{ backgroundColor: '#212121' }}>
          <div className="mx-auto my-auto flex h-28 text-center">
            <h1 className="mx-auto my-auto text-4xl font-semibold text-white">
              Guides
            </h1>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row">
          <div className="flex w-full max-w-7xl px-8 md:mx-auto md:h-screen md:w-1/5 md:justify-center md:px-16">
            <PracticeNav />
          </div>

          <div className="w-full border-l border-gray-800 px-8 text-neutral-200 md:w-4/5 xl:px-16">
            <nav
              className="mx-auto  mt-10 flex text-center"
              aria-label="Breadcrumb"
            >
              <ol role="list" className="flex items-center space-x-4">
                <li>
                  <div>
                    <a
                      href="../dashboard"
                      className=" text-white hover:text-gray-200"
                    >
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

            <h1 className="mb-4 mt-5 text-3xl font-bold">Creating CTF’s</h1>
            <p className="mb-4">
              If you're interested in hosting a CTF, there are several key
              elements you should keep in mind to ensure a successful and
              engaging event. Here are some tips on how to make a good CTF
            </p>
            <div className="my-auto mb-4 flex rounded-lg bg-neutral-800 px-4 py-4">
              <h1>
                <i className="far fa-lightbulb mr-4 mt-1 rounded-full bg-neutral-700 px-3.5 text-4xl text-yellow-500"></i>
              </h1>
              Unlike wargames, during a CTF, players can't skip a boring task
              and decide not to solve it if it's not fun. In order to win a CTF,
              teams are forced to solve every single challenge, because if other
              teams already solved or are likely to solve them, they would have
              a higher score. This means that a single bad challenge can ruin an
              otherwise fun competition, and requires CTF organizers to take
              deep care on the quality of the task design and implementation.
            </div>

            <h1 className="text-semibold mb-4 mt-10 text-2xl">
              Always keep these 7 ideas in mind when making challenges.
            </h1>
            <ol className="mb-4 ml-4 list-disc">
              <li className="mb-2">
                <span className="text-lg text-blue-500 ">
                  Define your goals
                </span>
              </li>
              <li className="mb-2">
                <span className="text-lg text-blue-500 ">
                  Choose your format
                </span>{' '}
              </li>
              <li className="mb-2">
                <span className="text-lg text-blue-500 ">
                  Create engaging challenges
                </span>{' '}
              </li>
              <li className="mb-2">
                <span className="text-lg text-blue-500 ">
                  Test your challenges
                </span>{' '}
              </li>
              <li className="mb-2">
                <span className="text-lg text-blue-500 ">
                  Set clear rules and guidelines
                </span>{' '}
              </li>
              <li className="mb-2">
                <span className="text-lg text-blue-500 ">
                  Host a debriefing session
                </span>{' '}
              </li>
            </ol>
            <p className="mb-4 text-lg">
              You can create a challenge by heading to the create dashboard and
              clicking on the “Create Challenge” button on the left menu. From
              there you will be greeted with a form where you fill in all the
              parameters of the CTF.
            </p>
            <p className="mb-4 text-lg">
              After you’ve done so, you can submit the challenge for approval.
              If you’re challenge gets approved you will get a notification on
              the website and will also receive an email.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
