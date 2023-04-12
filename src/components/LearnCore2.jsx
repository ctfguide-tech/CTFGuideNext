import { MarkDone } from '@/components/learn/MarkDone';
import { FlagIcon, CheckCircleIcon } from '@heroicons/react/20/solid';

export function LearnCore() {
  return (
    <div style={{}} className="mx-auto h-full overflow-hidden">
      <div className="my-auto ml-4 flex px-4 py-4 pb-7">
        <h1 className="my-auto my-auto mt-3 flex text-xl">
          Forensics Interactive Lab
          <FlagIcon className="mt-1 ml-2 h-6 text-blue-500" />
        </h1>

        <div className="my-auto ml-auto mt-3 flex">
          <MarkDone sublesson={8} section={1} href={'../'} />
          <a
            href="../"
            className="my-auto my-auto ml-4 rounded-lg bg-red-600 px-4 py-1 text-white"
          >
            Exit Lab
          </a>
        </div>
      </div>
      <div className="grid h-screen max-h-screen resize-x grid-cols-2 gap-0 md:grid-cols-2 lg:grid-cols-2">
        <div
          id="1"
          style={{ backgroundColor: '#212121' }}
          className="h-100 resize-x px-8 py-4"
        >
          <h1 className="text-2xl font-bold text-white">
            I spy with my little eyes
          </h1>
          <p className="text-white text-blue-500">@pranavramesh @ray</p>
          <h1 className="mt-4 text-xl font-semibold text-white">
            Introduction{' '}
          </h1>
          <p className="text-white">
            As you've probably learned, forensics is an essential part of
            cybersecurity. Rumor has it that you've done pretty stellar on your
            forensics mastery task. Some agents in the FBI heard about your
            skills and need your help.<br></br>
            <br></br>It looks like there's been a notorious hacker that has been
            going around encrypting a bunch of computers.<br></br>
            <br></br>Rumor has it, he likes playing games.
          </p>
          <br></br>We've gotten a load of his payload, but when try running the
          program. It says "I spy something [color]". The color keeps changing
          everytime we try deploying the payload.
          <div
            className="mt-4 bg-black p-4 text-white"
            style={{ fontFamily: 'Arial' }}
          >
            <p>
              undefined@ctfguide:~${' '}
              <span className="text-yellow-400">node hackerman.js</span>
            </p>
            <p>
              undefined@ctfguide:~${' '}
              <span className="text-blue-500">I spy something red.</span>
            </p>
          </div>
          <div className="fixed bottom-0 left-0 right-0 mb-5">
            <div className="mt-4 flex">
              <div className="mx-auto flex grid  grid-cols-2  rounded-lg bg-neutral-900 text-center">
                <div className="w-full rounded-l-lg py-4 px-10 hover:bg-neutral-700">
                  <a className="∂ text-white">
                    <i class="fas fa-chevron-left"></i>
                  </a>
                </div>
                <div
                  onClick={() => {
                    document.getElementById('2').classList.remove('hidden');
                    document.getElementById('1').classList.add('hidden');
                  }}
                  className="w-full rounded-r-lg  py-4 px-10 hover:bg-neutral-700"
                >
                  <p className="ml-4 text-white">
                    <i class="fas fa-chevron-right"></i>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          id="2"
          style={{ backgroundColor: '#212121' }}
          className="hidden h-screen max-h-screen overflow-y-auto px-8 py-4  "
        >
          <h1 className="text-2xl font-bold text-white">
            I spy with my little eyes
          </h1>
          <p className="text-white text-blue-500">@pranavramesh @ray</p>
          <h1 className="mt-4 text-xl font-semibold text-white">
            Understanding the payload{' '}
          </h1>
          <p className="text-white">
            It looks like this payload is just a malicious node.js file.
            Strange. Usually, payloads are super hidden - but in this case we
            have access to the actual payload file.
          </p>
          <br></br>Let's go ahead and take a look at the code of the payload.
          <div
            className="mt-4 bg-black p-4 text-white"
            style={{ fontFamily: 'Arial' }}
          >
            <p>
              undefined@ctfguide:~${' '}
              <span className="text-yellow-400">nano hackerman.js</span>
            </p>
          </div>
          <br></br>
          <p className="text-white">
            The code for this payload seems relatively simple.
          </p>
          <div
            className="mt-4 bg-black p-4 text-white"
            style={{ fontFamily: 'Arial' }}
          >
            <p>
              var colors = ["red", "blue", "green", "yellow", "orange",
              "purple"];<br></br>
              var color = colors[Math.floor(Math.random() * colors.length)];
              <br></br>
              console.log("I spy something " + color);<br></br>
              var key = colors[1] + colors[2] + 21;<br></br>
              // console.log(key)
            </p>
          </div>
          <br></br>
          <p className="text-white">Are you seeing what I'm seeing?!</p>
          <div
            className="mt-4 bg-black p-4 text-white"
            style={{ fontFamily: 'Arial' }}
          >
            <p>
              var key = colors[1] + colors[2] + 21;<br></br>
              // console.log(key)
            </p>
          </div>
          <p className="mt-4 text-white">
            It looks like the decryption key is just the second color + the
            third color + "21". Looking at the array of colors it seems like the
            key is bluegreen21.
          </p>
          {/* boottom footer */}
          <div className="fixed bottom-0 left-0 right-0 mb-5">
            <div className="mt-4 flex">
              <div className="mx-auto flex grid  grid-cols-2  rounded-lg bg-neutral-900 text-center">
                <div
                  className="h-full w-full rounded-l-lg py-4 px-10 hover:bg-neutral-700"
                  onClick={() => {
                    document.getElementById('1').classList.remove('hidden');
                    document.getElementById('2').classList.add('hidden');
                  }}
                >
                  <a className="∂ text-white">
                    <i class="fas fa-chevron-left"></i>
                  </a>
                </div>
                <div
                  className="w-full rounded-r-lg  py-4 px-10 hover:bg-neutral-700"
                  onClick={() => {
                    document.getElementById('3').classList.remove('hidden');
                    document.getElementById('2').classList.add('hidden');
                  }}
                >
                  <p className="ml-4 text-white">
                    <i class="fas fa-chevron-right"></i>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          id="3"
          style={{ backgroundColor: '#212121' }}
          className=" h-100 hidden resize-x px-4 py-4"
        >
          <h1 className="mx-auto mt-4 mt-20 text-center text-6xl font-semibold text-white">
            Nice work!
          </h1>
          <h1 className="mx-auto mt-4 text-center text-xl font-semibold text-white ">
            You've finished this lesson.
          </h1>
          <CheckCircleIcon className="mx-auto mt-6 h-36 text-green-500" />
          <div></div>
        </div>
        <div className="max-h-screen resize-x overflow-hidden bg-black">
          <div className="flex bg-black text-sm text-white">
            <p className="px-2 py-1">
              <span className="text-green-400">◉</span> Connected to
              terminal.ctfguide.com
            </p>
            <div className="ml-auto flex px-2 py-1">
              <p>No time limit!</p>
            </div>
          </div>
          <iframe
            id="terminal"
            className="w-full px-2"
            height="500"
            src="https://terminal.ctfguide.com/wetty/ssh/root?"
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
    </div>
  );
}
