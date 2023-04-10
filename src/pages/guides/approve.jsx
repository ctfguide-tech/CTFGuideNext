import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { useRef } from 'react';
import { useScroll } from 'framer-motion';
import { PracticeNav } from '@/components/practice/PracticeNav';
const pages = [
  { name: 'Hub', href: '../practice', current: false },
  { name: 'Getting your challenge approved', href: './create', current: true },
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

            <h1 className="mb-4 mt-5 text-3xl font-bold">
              Getting your challenge approved
            </h1>
            <p className="mb-4 text-lg">
              Every challenge that is uploaded on CTFGuide goes through a
              rigorous approval process. We consider many factors when deciding
              the fate of your challenge.
            </p>

            <h1 className="mb-4 mt-5 text-2xl font-bold text-blue-500">
              Quality Control
            </h1>
            <p className="mb-4 text-lg">
              Generally, we will not approve challenges that are poorly written
              or have poor grammar. We also do not accept challenges that
              require redudant methods to solve. For example, hiding an embeded
              file in an embeded file in an embeded file is just wasting a
              person's time. For security reasons, we do not allow external
              linking to files. If you need to link to a file, you must make
              mention of it in the challenge description - our mod team will
              reach out to you regarding next steps.
            </p>
            <h1 className="mb-4 mt-5 text-2xl font-bold text-blue-500">
              Approval Status
            </h1>
            <p className="mb-4 text-lg">
              If your challenge gets approved or denied, you will recieve an
              email and we'll send you a notification on CTFGuide. If your
              challenge has been denied it will be moved to the "Pending
              Changes" category on your creator dashboard.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
