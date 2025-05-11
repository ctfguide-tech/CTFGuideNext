import Head from 'next/head';
import { useState } from 'react';
import { SecondaryFeatures } from '../components/home/SecondaryFeatures';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { Fragment } from 'react';
import Link from 'next/link';
import { Popover, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { Button } from '@/components/Button';
import { Container } from '@/components/Container';
import { Logo } from '@/components/Logo';
import { NavLink } from '@/components/NavLink';

function MobileNavLink({ href, children }) {
  return (
    <Popover.Button as={Link} href={href} className="block w-full p-2">
      {children}
    </Popover.Button>
  );
}

function MobileNavIcon({ open }) {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5 overflow-visible stroke-slate-700"
      fill="none"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <path
        d="M0 1H14M0 7H14M0 13H14"
        className={clsx(
          'origin-center transition',
          open && 'scale-90 opacity-0'
        )}
      />
      <path
        d="M2 2L12 12M12 2L2 12"
        className={clsx(
          'origin-center transition',
          !open && 'scale-90 opacity-0'
        )}
      />
    </svg>
  );
}

function MobileNavigation() {
  return (
    <Popover>
      <Popover.Button
        className="relative z-10 flex h-8 w-8 items-center justify-center [&:not(:focus-visible)]:focus:outline-none"
        aria-label="Toggle Navigation"
      >
        {({ open }) => <MobileNavIcon open={open} />}
      </Popover.Button>
      <Transition.Root>
        <Transition.Child
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="duration-150 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Popover.Overlay className="fixed inset-0 bg-slate-300/50" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="duration-150 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-100 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Popover.Panel
            as="div"
            className="absolute inset-x-0 top-full mt-4 flex origin-top flex-col rounded-2xl bg-neutral-800 p-4 text-lg tracking-tight text-slate-900 shadow-xl ring-1 ring-slate-900/5"
          >
            <MobileNavLink href="#features">Features</MobileNavLink>
            <MobileNavLink href="#pricing">Pricing</MobileNavLink>
            <hr className="m-2 border-neutral-700" />
            <MobileNavLink href="/login">Sign in</MobileNavLink>
            <MobileNavLink href="#pricing">
              <span className="text-blue-400">Get started</span>
            </MobileNavLink>
          </Popover.Panel>
        </Transition.Child>
      </Transition.Root>
    </Popover>
  );
}

const Education = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [studentCount, setStudentCount] = useState(1);

  const calculateTotalCost = () => {
    return studentCount * 10;
  };

  return (
    <>
      <Head>
        <title>CTFGuide EDU</title>
        <meta
          name="description"
          content="CTFGuide - The all-in-one platform for teaching cybersecurity"
        />
        <style>
          @import
          url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
        </style>
      </Head>

      <header className="py-4 " style={{ fontFamily: 'Poppins, sans-serif' }}>
      <Container>
        <nav className="relative z-50 flex justify-between">
          <div className="flex items-center md:gap-x-12">
            <Link href="../" aria-label="Home">
            <div className="mx-auto my-auto flex">
      <img className="mx-auto w-12 text-center spin-on-hover" src="../../../../darkLogo.png" />
      <h1
        className="my-auto text-xl  text-white"
        style={{ fontFamily: 'Poppins, sans-serif' }}
      >
        <span className="text-white font-bold"> CTFGuide </span> Education
      </h1>
    </div>
            </Link>
            
          </div>
          
          <div className="flex items-center gap-x-5 md:gap-x-8">
            <div>
              <NavLink className="text-white" href="/login">
                Sign in
              </NavLink>
            </div>
            <Button href="#pricing" color="blue">
              <span>
                Get started <span className="hidden lg:inline">today</span>
              </span>
            </Button>
            <div className="-mr-1 md:hidden"></div>
          </div>
        </nav>
      </Container>
    </header>

    <div className='bg-blue-600 text-white text-center p-2'>
      <p>CTFGuide EDU is not the same as CTFGuide GP. If you're a solo learner, you can <a href="/register" className='text-white font-semibold'>sign up for CTFGuide GP</a> for free.</p>
    </div>

      <main>
      <div className="bg-neutral-900 border-t border-neutral-800">
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-blue-100/20">
        <div className="mx-auto max-w-7xl pb-24 pt-10 sm:pb-32 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-40">
          <div className="px-6 lg:px-0 lg:pt-4">
            <div className="mx-auto max-w-2xl">
              <div className="max-w-lg">
            
                 
            
                <div className="mt-10 text-4xl font-bold  text-white sm:text-3xl flex items-center justify-left">
                <img className=" w-10 text-center ml-0 mr-4 " src="../../../../darkLogocrop.png" />
   
              <h1 className='text-4xl font-normal'>        <span className="text-white font-semibold"> CTFGuide </span> Education
              </h1>
                </div>
                <p className="mt-2 text-lg  text-white">
                  CTFGuide EDU is a platform for universities to teach cybersecurity to students and professionals.
                </p>
                <div className="mt-10 flex items-center gap-x-6">
                  <a
                    href="#pricing"
                    className="rounded-md bg-blue-600 px-4 py-2 w-1/2 text-center text-lg font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  > 
                    Get started
                  </a>
                 
                </div>
              </div>
            </div>
          </div>
          <div className="mt-20 sm:mt-24 md:mx-auto md:max-w-2xl lg:mx-0 lg:mt-0 lg:w-screen">
            <div
              className="absolute inset-y-0 right-1/2 -z-10 -mr-10 w-[200%] skew-x-[-30deg] bg-neutral-900 shadow-xl shadow-blue-600/10 ring-1 ring-blue-50 md:-mr-20 lg:-mr-36"
              aria-hidden="true"
            />
            <div className="shadow-lg md:rounded-3xl">
              <div className="bg-blue-600 [clip-path:inset(0)] md:[clip-path:inset(0_round_theme(borderRadius.3xl))]">
                <div
                  className="absolute -inset-y-px left-1/2 -z-10 ml-10 w-[200%] skew-x-[-30deg] bg-blue-200 opacity-20 ring-1 ring-inset ring-neutral-900 md:ml-20 lg:ml-36"
                  aria-hidden="true"
                />
                <div className="relative px-6 pt-8 sm:pt-16 md:pl-16 md:pr-0">
                  <div className="mx-auto max-w-2xl md:mx-0 md:max-w-none">
                    <div className=" overflow-hidden rounded-tl-xl">
                      <img
                        src="../../graphics/cyber-101.png"
                        alt="CTFGuide UI"
                       
                      />
                    </div>
                  </div>
                  <div
                    className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/10 md:rounded-3xl"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-neutral-900 sm:h-32" />
      </div>
    </div>

        <SecondaryFeatures />
        <div id="pricing" className="bg-gradient-to-b from-neutral-900 to-neutral-800 py-24">
  <div className="mx-auto max-w-7xl px-6 lg:px-8">
    <div className="mx-auto max-w-2xl text-center mb-16">
      <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
        Simple, Transparent Pricing
      </h2>
      <p className="mt-4 text-lg text-gray-300">
        Empower your students with cutting-edge cybersecurity education
      </p>
    </div>
    <div className="mt-16 flex flex-col lg:flex-row items-center justify-center gap-12">
      <div className="w-full lg:w-1/3 rounded-2xl bg-neutral-700 p-10 text-center shadow-xl transform transition-all duration-300 hover:scale-105">
        <h3 className="text-3xl font-semibold text-white mb-4">Free Plan</h3>
        <div className="mt-6">
          <span className="text-6xl font-bold text-white">$0</span>
        </div>
        <p className="mt-2 text-gray-200">forever</p>
        <ul className="mt-8 space-y-5 text-left">
          {[
            'Unlimited students',
            'Full cybersecurity curriculum',
            'Community support'
          ].map((feature, index) => (
            <li key={index} className="flex items-start">
              <svg className="h-6 w-6 flex-shrink-0 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="ml-3 text-white text-lg">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="w-full lg:w-1/3 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-10 text-center shadow-xl transform transition-all duration-300 hover:scale-105">
        <h3 className="text-3xl font-semibold text-white mb-4">CTFGuide EDU</h3>
        <div className="mt-6">
          <span className="text-6xl font-bold text-white">$10</span>
          <span className="text-2xl text-gray-200">/student</span>
        </div>
        <p className="mt-2 text-gray-200">per semester</p>
        <ul className="mt-8 space-y-5 text-left">
          {[
            'Everything in Free plan',
            'AI-powered grading and feedback',
            'Priority support'
          ].map((feature, index) => (
            <li key={index} className="flex items-start">
              <svg className="h-6 w-6 flex-shrink-0 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="ml-3 text-white text-lg">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="w-full lg:w-1/3 rounded-2xl bg-neutral-700 p-10 text-center shadow-xl">
        <h3 className="text-3xl font-semibold text-white mb-4">Cost Estimate Calculator</h3>
        <div className="mt-8">
          <label htmlFor="studentCount" className="block text-lg font-medium text-gray-200 mb-2">
            Number of Students
          </label>
          <input
            type="number"
            id="studentCount"
            name="studentCount"
            min="1"
            value={studentCount}
            onChange={(e) => setStudentCount(Math.max(1, parseInt(e.target.value) || 1))}
            className="mt-1 block w-full rounded-lg border-2 border-gray-600 bg-neutral-800 text-white text-xl py-3 px-4 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
        </div>
        <div className="mt-10">
          <p className="text-xl text-gray-300">Total Cost per Semester:</p>
          <p className="text-5xl font-bold text-white mt-2">${calculateTotalCost()}</p>
        </div>
      </div>
    </div>
    <div className="mt-16 flex justify-center">
      <a
        href="mailto:staff@ctfguide.com"
        className="rounded-full bg-blue-600 px-8 py-4 text-center text-xl font-semibold text-white shadow-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-neutral-800 transition-all duration-300 ease-in-out transform hover:scale-105"
      >
        Contact Sales
      </a>
    </div>
  </div>
</div>

        <Footer/>
      </main>
    </>
  );
};

export default Education;