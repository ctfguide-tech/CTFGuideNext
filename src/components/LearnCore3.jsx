import { MarkDone } from '@/components/learn/MarkDone';
import { FlagIcon, CheckCircleIcon } from '@heroicons/react/20/solid';

export function LearnCore() {
  return (
    <div style={{}} className="mx-auto h-full overflow-hidden">
      <div className="my-auto ml-4 flex px-4 py-4 pb-7">
        <h1 className="my-auto my-auto mt-3 flex text-xl">
          Cryptography Interactive Lab
          <FlagIcon className="mt-1 ml-2 h-6 text-blue-500" />
        </h1>

        <div className="my-auto ml-auto mt-3 flex">
          <MarkDone sublesson={12} section={1} href={'../'} />
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
            Using John the Ripper to Scan a Text File with Fake Insecure
            Passwords
          </h1>
          <p className="text-white text-blue-500">@pranavramesh</p>

          <h1 className="mt-4 text-xl font-semibold text-white">
            Introduction{' '}
          </h1>
          <p className="text-white">
            We created a text file containing fake insecure passwords. Now, we
            will use John the Ripper to scan this file and identify any
            vulnerabilities. John the Ripper is a password cracking tool that
            can be used for testing password strength and identifying weak
            passwords. It uses several methods for cracking passwords including
            dictionary attacks and brute-force attacks.
          </p>

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
            Using John the Ripper to Scan a Text File with Fake Insecure
            Passwords
          </h1>
          <p className="text-white text-blue-500">@pranavramesh</p>
          <h1 className="mt-4 text-xl font-semibold text-white">Procedure </h1>
          <p className="text-white">
            <ul>
              <li>Open the terminal on your computer.</li>

              <li>
                Navigate to the directory where the text file containing the
                fake insecure passwords is located.
              </li>
            </ul>
          </p>
          <br></br>Type the following command to open John the Ripper:
          <div
            className="mt-4 bg-black p-4 text-white"
            style={{ fontFamily: 'Arial' }}
          >
            <p>
              undefined@ctfguide:~${' '}
              <span className="text-yellow-400">john</span>
            </p>
          </div>
          <br></br>To use John the Ripper to scan the text file, type the
          following command:
          <div
            className="mt-4 bg-black p-4 text-white"
            style={{ fontFamily: 'Arial' }}
          >
            <p>
              undefined@ctfguide:~${' '}
              <span className="text-yellow-400">john filename.txt</span>
            </p>
          </div>
          <br></br>Replace "filename.txt" with the name of the text file you
          want to scan.
          <br></br>
          <br></br> John the Ripper will start scanning the text file and
          attempting to crack the passwords. This process may take some time
          depending on the size of the file and the complexity of the passwords.
          <br></br>
          <br></br> Once John the Ripper has finished scanning the file, it will
          display a list of any passwords that it was able to crack.
          <br></br>
          <br></br>
          Review the list of cracked passwords to identify any vulnerabilities
          in the password policy or user behavior. Take note of any passwords
          that were cracked and consider ways to improve password security.
          <h1 className="mt-4 text-xl font-semibold text-white">Conclusion </h1>
          <p className="text-white">
            John the Ripper is a powerful tool for identifying weak passwords
            and vulnerabilities in password policies. By scanning a text file
            containing fake insecure passwords, we were able to use John the
            Ripper to identify any weaknesses in our password policy. This
            information can be used to improve password security and protect
            sensitive information.
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
