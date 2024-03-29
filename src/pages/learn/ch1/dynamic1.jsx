import Head from 'next/head';

import {Footer} from '@/components/Footer';

import {StandardNav} from '@/components/StandardNav';
import {useEffect, useState} from 'react';
import {LearnNav} from '@/components/learn/LearnNav';
import {LearnCore} from '@/components/LearnCore';
import {MarkDone} from '@/components/learn/MarkDone';
import {LearnCoreMaster} from "@/components/LearnCoreMaster";
import {CheckCircleIcon} from "@heroicons/react/20/solid";

export default function Dashboard() {
    const [open, setOpen] = useState(true);
    const [markdown, setMarkdown] = useState('');
    const [terminalUsername, setTerminalUsername] = useState('...');
    const [terminalPassword, setTerminalPassword] = useState('...');
      // Start Terminal
  useEffect(() => {

    const fetchTerminalData = async () => {
      try {
        const endPoint = 'https://terminal-gateway.ctfguide.com/createvm';
        const requestOptions = {
          method: 'GET',
        };
        const response = await fetch(endPoint, requestOptions);
        const result = await response.json();

        setTerminalUsername(result.username);
        setTerminalPassword(result.password);
      } catch (err) {
        console.log(err);
        setTerminalUsername('Something went wrong.');
        setTerminalPassword('Something went wrong.');
      }
    };

    try {
      fetchTerminalData();
    } catch (err) {
      console.log(err);
      setTerminalUsername('Something went wrong.');
      setTerminalPassword('Something went wrong.');
    }
  }, []);
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('https://gist.githubusercontent.com/rt2zz/e0a1d6ab2682d2c47746950b84c0b6ee/raw/83b8b4814c3417111b9b9bef86a552608506603e/markdown-sample.md');
            const data = await response.text();
            setMarkdown(data);
        };
        fetchData();
    }, []);

    return (<>
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

        <div className="mx-auto">
            <div className="text-white">
                {/* Load in markdown from a github url */}
                <LearnCoreMaster title="Linux Basics Interactive Lab">

                    <div id="1" style={{backgroundColor: '#212121'}} className="h-100 resize-x px-8 py-4">
                        <h1 className="text-2xl font-bold text-white">Using your terminal</h1>
                        <p className="text-white text-blue-500">@pranavramesh</p>

                        <h1 className="mt-4 text-xl font-semibold text-white">
                            Logging into your terminal.
                        </h1>
                        <p className="text-white">
                            The black box to the right is your terminal. You can login to it
                            using the following credentials:
                        </p>
                        <div className="mt-4 bg-black p-4 text-white" style={{fontFamily: 'Arial'}}>
                            <p>
                                ctfguide login: <span className="text-yellow-400">{terminalUsername}</span>
                            </p>
                            <p>
                                Password: <span className="text-yellow-400">{terminalPassword}</span>
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
                            style={{fontFamily: 'Arial'}}
                        >
                            <p>
                                {terminalUsername}@ctfguide:~$ <span className="text-yellow-400">ls</span>
                            </p>
                        </div>

                        <p className="mt-4 text-white">
                            Looks like there's nothing in this directory! Let's make a folder.{' '}
                        </p>
                        <div
                            className="mt-4 bg-black p-4 text-white"
                            style={{fontFamily: 'Arial'}}
                        >
                            <p>
                                {terminalUsername}@ctfguide:~${' '}
                                <span className="text-yellow-400">mkdir chapter1</span>
                            </p>
                        </div>

                        <div className="fixed bottom-0 left-0 right-0 mb-5">
                            <div className="mt-4 flex">
                                <div
                                    className="mx-auto flex grid  grid-cols-2  rounded-lg bg-neutral-900 text-center">
                                    <div className="w-full rounded-l-lg py-4 px-10 hover:bg-neutral-700">
                                        <a className="∂ text-white">
                                            <i className="fas fa-chevron-left"></i>
                                        </a>
                                    </div>
                                    <div onClick={() => {
                                        document.getElementById('2').classList.remove('hidden');
                                        document.getElementById('1').classList.add('hidden');
                                    }}
                                         className="w-full rounded-r-lg  py-4 px-10 hover:bg-neutral-700"
                                    >
                                        <p className="ml-4 text-white">
                                            <i className="fas fa-chevron-right"></i>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        id="2"
                        style={{backgroundColor: '#212121'}}
                        className="hidden h-screen max-h-screen overflow-y-auto px-8 py-4"
                    >
                        <h1 className="text-2xl font-bold text-white">Using your terminal</h1>
                        <p className="text-white text-blue-500">@pranavramesh</p>

                        <h1 className="mt-4 text-xl font-semibold text-white">
                            Let's explore your terminal! (Continued)
                        </h1>
                        <p className="text-white">
                            Nice, you've made a folder. Let's run the ls command to see if it
                            shows up now.
                        </p>
                        <div
                            className="mt-4 bg-black p-4 text-white"
                            style={{fontFamily: 'Arial'}}
                        >
                            <p>
                                {terminalUsername}@ctfguide:~$ <span className="text-yellow-400">ls</span>
                            </p>
                        </div>

                        <p className="mt-4 text-white">
                            Let's navigate into that folder now!
                        </p>
                        <div
                            className="mt-2 bg-black p-4 text-white"
                            style={{fontFamily: 'Arial'}}
                        >
                            <p>
                                {terminalUsername}@ctfguide:~${' '}
                                <span className="text-yellow-400">cd chapter1</span>
                            </p>
                        </div>

                        <p className="mt-4 text-white">
                            Cool, we're now in the{' '}
                            <span className="rounded-lg bg-black px-2 text-sm text-white">
              /chapter1
            </span>{' '}
                            folder. Let's create a file now!
                        </p>

                        <h1 className="mt-4 text-xl font-semibold text-white">
                            Creating files
                        </h1>

                        <p className="mt-1 text-white">
                            To create a file, we use the{' '}
                            <span className="rounded-lg bg-black px-2 text-sm text-white">
              touch
            </span>{' '}
                            command. But this command will only create a blank file with the
                            name that you supply in the parameter.
                        </p>

                        <p className="mt-4 text-white">
                            However, lets say you want to make a text file. How would you go
                            about doing so? Well, lucky for you there's a pretty handy tool
                            called <span className="text-purple-500">Nano</span>.
                        </p>

                        <div className="mt-4 flex rounded-lg bg-neutral-900 px-4 py-4">
                            <div className="rounded-full bg-white px-3 py-3">
                                <img
                                    width={100}
                                    className=""
                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Gnu-nano.svg/1200px-Gnu-nano.svg.png"
                                ></img>
                            </div>
                            <div className="ml-4 mt-1">
                                <h1 className="text-2xl  text-purple-500">GNU Nano</h1>
                                <p>
                                    GNU nano is a text editor for Unix-like operating systems, such
                                    as Linux. It is designed to be easy to use and user-friendly,
                                    especially for beginners.
                                </p>
                            </div>
                        </div>

                        <p className="mt-4 text-white">
                            Lets create a text file called NanoFun.txt
                        </p>
                        <div
                            className="mt-2 bg-black p-4 text-white"
                            style={{fontFamily: 'Arial'}}
                        >
                            <p>
                                {terminalUsername}@ctfguide:~${' '}
                                <span className="text-yellow-400">nano NanoFun.txt</span>
                            </p>
                        </div>

                        <p className="mt-4 text-white">
                            This should replace your window with the Nano editor. Your friend,
                            Ray, asks you to write his journal entry for him as he broke his
                            arms.
                        </p>

                        <div
                            className="mt-2 bg-black pb-10 text-white"
                            style={{fontFamily: 'Arial'}}
                        >
                            <p className="grid grid-cols-3 bg-white text-black">
                                <span className="col-span-1 px-2"> GNU nano 5.4 </span>
                                <span className="ml-20 text-center">New Buffer</span>
                            </p>

                            <span className="text-yellow-400">
                                I love Linux so much that I replaced my mom's operating system
                                with it. She is now very mad at me. :(
                            </span>
                        </div>

                        <p className="mt-4 text-white">
                            To save the file, press{' '}
                            <span className="rounded-lg bg-black px-2 text-sm text-white">Ctrl + X</span>{' '}
                            and then press{' '}
                            <span className="rounded-lg bg-black px-2 text-sm text-white">Y</span>{' '}
                            to confirm the save.
                        </p>

                        <p className="mt-4 text-white">
                            You can view a the file by running the command{' '}
                            <span className="rounded-lg bg-black px-2 text-sm text-white">cat /NanoFun.txt</span>
                            .
                        </p>

                        {/* bottom footer */}

                        <div className="fixed bottom-0 left-0 right-0 mb-5">
                            <div className="mt-4 flex">
                                <div
                                    className="mx-auto flex grid  grid-cols-2  rounded-lg bg-neutral-900 text-center">
                                    <div
                                        className="h-full w-full rounded-l-lg py-4 px-10 hover:bg-neutral-700"
                                        onClick={() => {
                                            document.getElementById('1').classList.remove('hidden');
                                            document.getElementById('2').classList.add('hidden');
                                        }}
                                    >
                                        <a className="∂ text-white">
                                            <i className="fas fa-chevron-left"></i>
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
                                            <i className="fas fa-chevron-right"></i>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        id="3"
                        style={{backgroundColor: '#212121'}}
                        className=" h-100 hidden resize-x px-4 py-4"
                    >
                        <h1 className="mx-auto mt-4 mt-20 text-center text-6xl font-semibold text-white">
                            Nice work!
                        </h1>
                        <h1 className="mx-auto mt-4 text-center text-xl font-semibold text-white ">
                            You've finished this lesson.
                        </h1>
                        <CheckCircleIcon className="mx-auto mt-6 h-36 text-green-500"/>
                        <div></div>
                    </div>


                    {/*<div style={{backgroundColor: '#212121'}} className=" px-4 py-4">*/}
                    {/*    <h1 className="text-2xl font-bold text-white">Developer Tools</h1>*/}

                    {/*    <p className="text-white">Terminal Keylogger</p>*/}
                    {/*    <textarea id="logger"*/}
                    {/*              className="mt-4 w-full bg-black text-blue-500">ctfguide login:</textarea>*/}

                    {/*    <p className="text-white">External Testing Client</p>*/}
                    {/*    <textarea id="logger" className="mt-4 w-full bg-black text-blue-500">ctfguide login:</textarea>*/}
                    {/*</div>*/}
                </LearnCoreMaster>
                <div className="ml-6"></div>
            </div>
        </div>
    </>);
}
