
import { useState, Fragment } from 'react';
import { Dialog, Popover, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, ChevronDownIcon, PhoneIcon, PlayCircleIcon } from '@heroicons/react/24/outline';
import {
  ArrowPathIcon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
} from '@heroicons/react/24/outline';

import TextLoop from "react-text-loop";
// Assuming Logo and Banner components are properly imported or defined elsewhere
import { Logo } from '@/components/Logo';
import { MagnifyingGlassPlusIcon } from '@heroicons/react/24/solid';
import { BoltIcon, CheckCircleIcon, DocumentCheckIcon, MagnifyingGlassCircleIcon, ShieldCheckIcon, TrophyIcon } from '@heroicons/react/20/solid';

const navigation = [
  { name: 'Individuals', href: '../practice', hasFlyout: false},
  { name: 'Enterprise', href: '#', hasFlyout: true }, // Modified for demonstration
  { name: 'Education', href: '../careers', hasFlyout: false },
  { name: 'Research', href: '../careers', hasFlyout: false },
  { name: 'Open Source', href: 'https://github.com/ctfguide-tech', hasFlyout: false },
];

const solutions = [
  { name: 'Candidate Discovery', description: 'Get the best cybersecurity talent applying for roles at your company.', href: '#', icon:  MagnifyingGlassCircleIcon},
  { name: 'Candidate Screening', description: 'Automatically screen thousands of potential applicants based of your parameters.', href: '#', icon: DocumentCheckIcon },
  { name: 'Upskilling Platform', description: "Boost your team's cybersecurity capabilities to secure the upper hand in the fight against cyber threats", href: '#', icon: BoltIcon },
  { name: 'Phishing Prevention', description: 'The world\'s best phishing prevention platform. We outperform KnowBe4 & Phished.', href: '#', icon: ShieldCheckIcon },
  { name: 'Internal Competitions', description: 'Host CTF competitions for your cybersecurity teams. We provide all the infrastructure.', href: '#', icon: TrophyIcon },
];



export function Hero() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSolutions, setShowSolutions] = useState(true);

  return (
    <div className="bg-black animate__animated animate__fadeIn">
      <header className="absolute inset-x-0 top-0 z-50">
 
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <div href="../" aria-label="Home">
              <a><Logo className="h-10 w-auto" /></a>
            </div>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => {
              if (item.hasFlyout) {
                return (
                  <Popover className="relative" key={item.name}>
                    <Popover.Button className="text-sm font-semibold text-white leading-6 flex items-center">
                      {item.name}
                      <ChevronDownIcon className="ml-2 h-3 w-3" aria-hidden="true" />
                    </Popover.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="opacity-0 translate-y-1"
                      enterTo="opacity-100 translate-y-0"
                      leave="transition ease-in duration-150"
                      leaveFrom="opacity-100 translate-y-0"
                      leaveTo="opacity-0 translate-y-1"
                    >
                <Popover.Panel className="absolute z-10 mt-3 transform -translate-x-1/2 left-1/2 w-screen max-w-xl">
  <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
    <div className="relative grid  bg-neutral-900   w-full">
      {solutions.map((solution) => (
        <a
          key={solution.name}
          href={solution.href}
          className="w-full flex items-start rounded-lg py-4 px-4 pr-5 mx-auto hover:bg-neutral-800 "
        >
          <div className="ml-4">
          <div className='flex items-center'>
              <solution.icon className="h-9 w-9 text-white" aria-hidden="true" />
              <div className='ml-3'>
                <p className="text-base font-medium text-white">{solution.name}</p>
                <p className="mt-1 text-sm text-neutral-300">{solution.description}</p>
              </div>
            </div>
    
          </div>
          
        </a>
      ))}
    </div>
  </div>
</Popover.Panel>

                    </Transition>
                  </Popover>
                );
              } else {
                return (
                  <div key={item.name}>
                    <a href={item.href} className="text-sm font-semibold leading-6 text-white z-40">{item.name}</a>
                  </div>
                );
              }
            })}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <div href="../login">
              <a className="text-sm font-semibold leading-6 text-white">
                Log in <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
        </nav>
        <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
          <div className="fixed inset-0 z-50" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gray-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-white/10">
            <div className="flex items-center justify-between">
              <div href="../" aria-label="Home">
                <Logo className="h-10 w-auto" />
              </div>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-400"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/25">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-800"
                    >
  
                        NO
                      </a>
                  ))}
                </div>
                <div className="py-6">
                  <a
                    href="../login"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white hover:bg-gray-800"
                  >
                    Log in
                  </a>
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>

      <div className="relative isolate pt-14">
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/3 rotate-[30deg] bg-gradient-to-tr from-[#0e1354] to-[#1223a6] opacity-40 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
        <div className="py-24 sm:py-32 lg:pb-40">
          <div className="mx-auto max-w-7xl px-6 lg:px-2">
            <div className="mx-auto max-w-7xl text-center">
              <h1 className="text-4xl font-bold tracking-normal text-white sm:text-6xl leading-relaxed ">
                We use AI to {" "}
                <TextLoop>
                  <span><span className='text-blue-600'>empower</span> cybersecurity educators.</span>
                  <span><span className='text-blue-600'>discover</span> top cybersecurity talent. </span>
                  <span><span className='text-blue-600'>strengthen</span> cybersecurity teams.</span>
                </TextLoop>

              </h1>
              <p className="mt-6 text-xl leading-8 text-gray-300">
                Addressing the human element in cybersecurity.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <a
                  href="../register"
                  className="rounded-md   px-6 py-1.5 text-lg font-semibold text-white border border-white hover:bg-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
                >
                  Get started
                </a>
                <p onClick={() => window.scrollTo(0, 1500)} className="cursor-pointer text-lg font-semibold leading-6 text-white">
                  Learn more <span aria-hidden="true">→</span>
                </p>
              </div>
            </div>
            <img

            />

            <video
              muted
              autoPlay
              width={2432}
              height={1442}
              className="mt-16 rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10 sm:mt-24"

            >
              <source src="../sample_vid.mp4" type="video/mp4" />

            </video>
          </div>
        </div>
        <div
          className="hidden inset-x-0 top-[calc(100%-13rem)] -z-10  transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#0e1354] to-[#1223a6]  opacity-40 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
      </div>


    </div>
  );
}


      