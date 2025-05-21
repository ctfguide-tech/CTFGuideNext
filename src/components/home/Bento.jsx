import { useState, useEffect, useRef } from 'react';

export default function Bento() {
  const sectionRef = useRef(null);
  const [activeVideo, setActiveVideo] = useState(0);
  const videoRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const boxRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];


  useEffect(() => {
    if (sectionRef.current) {
      sectionRef.current.classList.add('animate-border');
    }

    // Set up video sequence
    videoRefs.forEach((ref, index) => {
      if (ref.current) {
        ref.current.pause();
        ref.current.currentTime = 0;
        
        ref.current.addEventListener('ended', () => {
          const nextIndex = (index + 1) % videoRefs.length;
          setActiveVideo(nextIndex);
        });
      }
    });

    // Start playing the first video
    if (videoRefs[0].current) {
      videoRefs[0].current.play();
    }

    return () => {
      // Cleanup event listeners
      videoRefs.forEach((ref) => {
        if (ref.current) {
          ref.current.removeEventListener('ended', () => {});
        }
      });
    };
  }, []);

  useEffect(() => {
    // Play the active video and pause others
    videoRefs.forEach((ref, index) => {
      if (ref.current) {
        if (index === activeVideo) {
          // No need to change opacity for visibility - keep the video fully visible
          ref.current.style.opacity = 1;
          ref.current.play().catch(err => console.log('Video play error:', err));
        } else {
          // Ensure videos are visible but paused
          ref.current.style.opacity = 1; // Keep full visibility
          ref.current.pause();
        }
      }
    });

    // Add focus style to active box
    boxRefs.forEach((ref, index) => {
      if (ref.current) {
        if (index === activeVideo) {
          ref.current.classList.add('box-highlight');
        } else {
          ref.current.classList.remove('box-highlight');
        }
      }
    });
  }, [activeVideo]);



  return (
    <div className="bg-black/50 py-12 sm:py-32 -mb-12">
      <div className="mx-auto px-4 sm:px-6 lg:px-24">
        <h2 className="text-base/7 font-semibold text-neutral-400">All in one place</h2>
        <p className="mt-2 max-w-7xl text-pretty text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white">
          The only cybersecurity learning platform you need
        </p>
        
        {/* Progress indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {[0, 1, 2, 3].map(index => (
            <button
              key={index}
              onMouseEnter={() => setActiveVideo(index)}
              onMouseLeave={() => setActiveVideo(null)}
              aria-label={`View video ${index + 1}`}
            />
          ))}
        </div>
        
        <div className="mt-8 sm:mt-10 lg:mt-16 grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-6 lg:grid-rows-2">
          <div className="flex p-px lg:col-span-3 hover:border-t-4 hover:border-blue-500 hover:bg-neutral-900/80 transition-all duration-100">
            <div ref={boxRefs[0]}  style={{
            }}>
              <video
                ref={videoRefs[0]}
                alt=""
                src="../challenges.mp4"
                className="object-cover"
                playsInline
                muted
                onMouseEnter={() => setActiveVideo(0)}
                onMouseLeave={() => setActiveVideo(null)}              />
              <div className="p-6 sm:p-8 lg:p-10">
                <h3 className="text-lg sm:text-xl font-semibold text-neutral-400">Practice Problems</h3>
                <p className="mt-2 text-lg sm:text-xl font-medium tracking-tight text-white">Challenges to test your skills</p>
                <p className="mt-2 max-w-lg text-sm sm:text-md text-neutral-400">
                  Get access to hundreds of challenges uploaded by our community. Perfect for all skill levels.
                </p>
              </div>
            </div>
          </div>  
          <div className="flex p-px lg:col-span-3 hover:border-t-4 hover:border-blue-500 hover:bg-neutral-900/80 transition-all duration-100"
          onMouseEnter={() => setActiveVideo(1)}
          onMouseLeave={() => setActiveVideo(null)}
          > 
              <div ref={boxRefs[1]} >
              <video
                ref={videoRefs[1]}
                alt=""
                src="../chatdemo.mp4"
                className="object-cover"
                playsInline
                muted
          
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
          <div className="flex p-px lg:col-span-3 hover:border-t-4 hover:border-blue-500 hover:bg-neutral-900/80 transition-all duration-100"
          onMouseEnter={() => setActiveVideo(3)}
          onMouseLeave={() => setActiveVideo(null)}
          > 
            <div ref={boxRefs[3]} >
              <video
                ref={videoRefs[3]}
                alt=""
                src="./termdemo.mp4"
                className="object-cover"
                playsInline
                muted
                onMouseEnter={() => setActiveVideo(3)}
                onMouseLeave={() => setActiveVideo(null)}
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
          <div className="flex p-px lg:col-span-3 hover:border-t-4 hover:border-blue-500 hover:bg-neutral-900/80 transition-all duration-100"
          onMouseEnter={() => setActiveVideo(2)}
          onMouseLeave={() => setActiveVideo(null)}
          > 
              <div ref={boxRefs[2]} style={{
            }}>
              <video
                ref={videoRefs[2]}
                alt=""
                src="../lbdemo.mp4"
                className="object-cover"
                playsInline
                muted

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
  