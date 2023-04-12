import {useState} from 'react';
import {MarkDone} from '@/components/learn/MarkDone';
import {FlagIcon, CheckCircleIcon} from '@heroicons/react/20/solid';

export function LearnCoreMaster({title, children = []}) {
    const [navbarOpen, setNavbarOpen] = useState(false);

    return (
        <div style={{}} className="mx-auto h-full overflow-hidden">
            <div className="my-auto ml-4 flex px-4 py-4 pb-7">
                <h1 className="my-auto my-auto mt-3 flex text-2xl">
                    {title}
                    <FlagIcon className="mt-1 ml-2 h-6 text-blue-500"/>
                </h1>

                <div className="my-auto ml-auto mt-3 flex">
                    <MarkDone sublesson={4} section={1} href={'../'}/>

                    <a
                        href="../"
                        className="my-auto ml-4 rounded-md bg-red-600 py-1 px-3 text-sm font-bold text-white hover:bg-red-600"
                    >
                        Exit Lab
                    </a>
                </div>
            </div>
            <div className="grid h-screen max-h-screen resize-x grid-cols-2 gap-0 md:grid-cols-2 lg:grid-cols-2">
                {children}
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
            </div>

        </div>
    );
}
