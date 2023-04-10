import { useState } from 'react';

export function Demo() {
  const [navbarOpen, setNavbarOpen] = useState(false);

  return (
    <div style={{}} className="mx-auto h-full w-full  py-2">
      <ul className="my-auto flex gap-4 px-4 text-white">
        <li className="my-auto font-semibold">
          <img width="40" src="./darkLogo.png"></img>
        </li>
        <li className="my-auto font-semibold">Onboarding</li>

        <div className="my-auto ml-auto flex">
          <li className="my-auto mr-4">Logged in as Pranav</li>
          <img src="./default.png" width="30" className="my-auto"></img>
        </div>
      </ul>
      <div className="h-100 mt-2 grid resize-x grid-cols-1  gap-0 md:grid-cols-2   lg:grid-cols-2">
        <div
          style={{ backgroundColor: '#212121' }}
          className="h-100 resize-x px-4 py-4"
        >
          <iframe
            width="560"
            height="315"
            className="mx-auto"
            src="https://www.youtube.com/embed/HrerCAcOblc"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>

          <h1 className="mt-4 text-xl font-semibold text-white">
            Logging into your terminal.
          </h1>
          <p className="text-white">
            The black box to the right is your terminal. You can login to it
            using the following credentials:
          </p>
          <div
            className="mt-4 bg-black p-4 text-white"
            style={{ fontFamily: 'Arial' }}
          >
            <p>
              ctfguide login: <span className="text-yellow-400">e4</span>
            </p>
            <p>
              Password: <span className="text-yellow-400">e4</span>
            </p>
          </div>

          <h1 className="mt-4 text-xl font-semibold text-white">
            Let's explore your terminal!
          </h1>
          <p className="text-white">
            You'll notice that there seems to be no user interface for this
            operating system. That's because you need to run commands to use
            this OS. Let's run a command to see what files are in our computer.{' '}
          </p>
          <div
            className="mt-4 bg-black p-4 text-white"
            style={{ fontFamily: 'Arial' }}
          >
            <p>
              undefined@ctfguide:~$ <span className="text-yellow-400">ls</span>
            </p>
          </div>

          <h1 className="mt-4 text-xl font-semibold text-white">
            Have a question?
          </h1>
          <textarea
            style={{ backgroundColor: '#161716' }}
            className="mt-2 h-1/4 w-full border-none bg-black text-white text-white"
          >
            We'll use machine learning to answer your question. For example:
            "Why is their new UI"? You can also ask us to simply the wording in
            this lesson. For example: "I don't get the second paragraph, can you
            simplify it?"
          </textarea>

          <button className="mt-4 rounded-lg bg-blue-700 px-2 py-1 text-white ">
            Waiting...
          </button>
          <button className="ml-2 mt-4 rounded-lg px-3 py-1 text-white ">
            Skip
          </button>
        </div>
        <div className="h-screen resize-x overflow-hidden bg-black">
          <div className="flex bg-black text-sm text-white">
            <p className="px-2 py-1">
              <span className="text-red-500">◉</span> Not Connected to
              sandbox.ctfguide.com
            </p>
            <div className="ml-auto flex px-2 py-1">
              <p>⏳ Unlimited</p>
            </div>
          </div>
          <iframe
            id="terminal"
            className="w-full"
            height="500"
            src="https://terminal.ctfguide.com/wetty/ssh/root?2"
          ></iframe>
        </div>

        <div
          style={{ backgroundColor: '#212121' }}
          className="hidden px-4 py-4"
        >
          <h1 className="text-2xl font-bold text-white">Developer Tools</h1>

          <p className="text-white">Terminal Keylogger</p>
          <textarea id="logger" className="mt-4 w-full bg-black text-blue-500">
            ctfguide login:
          </textarea>

          <p className="text-white">External Testing Client</p>
          <textarea id="logger" className="mt-4 w-full bg-black text-blue-500">
            ctfguide login:
          </textarea>
        </div>
      </div>
      <div
        className="w-56 border border-gray-600 bg-gray-900 px-2 py-2 text-sm text-white"
        style={{
          position: 'fixed',
          zIndex: 1,
          marginTop: '500px',
          left: 900,
          top: -370,
        }}
      >
        <h1>
          Type your username (e4) above.
          <br></br>
          <span className="text-white" style={{ fontSize: '.8rem' }}>
            ✅ Mark as complete
          </span>
        </h1>
      </div>
    </div>
  );
}
