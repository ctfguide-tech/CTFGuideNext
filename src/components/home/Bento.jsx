import { useEffect, useRef } from 'react';

export default function Bento() {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (sectionRef.current) {
      sectionRef.current.classList.add('animate-border');
    }
  }, []);

    return (
      <div className="bg-black/50 py-12 sm:py-32 -mb-12">
        <div className="mx-auto px-4 sm:px-6 lg:px-24">
          <h2 className="text-base/7 font-semibold text-neutral-400">All in one place</h2>
          <p className="mt-2 max-w-7xl text-pretty text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white">
            The only cybersecurity learning platform you need
          </p>
          <div className="mt-8 sm:mt-10 lg:mt-16 grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-6 lg:grid-rows-2">
            <div className="flex p-px lg:col-span-4">
              <div className="overflow-hidden rounded-lg bg-neutral-800/60 ring-white/15 max-lg:rounded-t-[2rem] lg:rounded-tl-[2rem]">
                <video
                  alt=""
                  src="../challenges.mp4"
                  className="object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
                <div className="p-6 sm:p-8 lg:p-10">
                  <h3 className="text-sm sm:text-md font-semibold text-neutral-400">Practice Problems</h3>
                  <p className="mt-2 text-lg sm:text-xl font-medium tracking-tight text-white">Challenges to test your skills</p>
                  <p className="mt-2 max-w-lg text-sm sm:text-md text-neutral-400">
                    Get access to hundreds of challenges uploaded by our community. Perfect for all skill levels.
                  </p>
                </div>
              </div>
            </div>  
            <div className="flex p-px lg:col-span-2"> 
              <div className="overflow-hidden rounded-lg bg-neutral-800/60 ring-white/15 lg:rounded-tr-[2rem]">
           
                <video
                  alt=""
                  src="../chatdemo.mp4"
                  className="object-cover"
                  autoPlay
                  muted
                  loop
                />
                <div className="p-6 sm:p-8 lg:p-10">
                  <h3 className="text-sm sm:text-lg font-semibold text-neutral-400">Chat</h3>
                  <p className="mt-2 text-lg sm:text-xl font-medium tracking-tight text-white">Connect with other users</p>
                  <p className="mt-2 max-w-lg text-sm sm:text-lg text-neutral-400">
                    Chat with other users to get help, share ideas, and discuss challenges.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex p-px lg:col-span-2">
              <div className="overflow-hidden rounded-lg bg-neutral-800/60 ring-white/15 max-lg:rounded-tl-[2rem] lg:rounded-bl-[2rem]">
                <video
                  alt=""
                  src="../lbdemo.mp4"
                  className="h-80 object-cover object-left"
                  autoPlay
                  muted
                  loop
                />
                <div className="p-6 sm:p-8 lg:p-10">
                  <h3 className="text-sm sm:text-lg font-semibold text-neutral-400">Leaderboard</h3>
                  <p className="mt-2 text-lg sm:text-xl font-medium tracking-tight text-white">Compete with other users</p>
                  <p className="mt-2 max-w-lg text-sm sm:text-lg text-neutral-400">
                    See how you rank against other users.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex p-px lg:col-span-4">
              
              <div className="overflow-hidden rounded-lg bg-neutral-800/60 ring-white/15 lg:rounded-br-[2rem]">
                <video
                  alt=""
                  src="./termdemo.mp4"
                  className="object-cover"
                  autoPlay
                  muted
                  loop
                />
                <div className="p-6 sm:p-8 lg:p-10">
                  <h3 className="text-sm sm:text-lg font-semibold text-neutral-400">Web Containers</h3>
                  <p className="mt-2 text-lg sm:text-xl font-medium tracking-tight text-white">Browser based virtual machines for solving problems</p>
                  <p className="mt-2 max-w-lg text-sm sm:text-lg text-neutral-400">
                      Solve problems in a browser based virtual machine.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
        ref={sectionRef}
        className="relative mx-auto mt-20 py-10 text-center overflow-hidden"
      >
        <div className="border-beam"></div>
        <div className="meteor-shower"></div>
        <div className="text-center relative z-10 p-4 sm:p-8">
          <h1 className="mx-auto mb-4 sm:mb-8 text-center text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
            Ready to embark on your hacking journey?
          </h1>
          <p className="mx-auto mb-6 sm:mb-12 max-w-2xl text-lg sm:text-xl text-gray-300">
            Join our community of cybersecurity enthusiasts and start sharpening your skills today!
          </p>
          <a
            href="./register"
            className="inline-block px-6 sm:px-8 py-2.5 sm:py-3.5 text-xl sm:text-2xl font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors duration-300"
          >
            Create Your Account
          </a>
        </div>
      </div>
    </div>
    )
  }
  