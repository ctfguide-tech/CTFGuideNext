import {useRouter} from 'next/router'
import Head from 'next/head';
import {StandardNav} from '@/components/StandardNav';
import {useEffect, useState, Fragment} from 'react';
import {Transition, Dialog} from '@headlessui/react';
import {XMarkIcon, HeartIcon, ArrowPathIcon} from '@heroicons/react/24/outline';

import Collapsible from 'react-collapsible';
import {Footer} from '@/components/Footer';
import {MarkdownViewer} from "@/components/MarkdownViewer";
import {CheckCircleIcon, CheckIcon, FlagIcon} from '@heroicons/react/20/solid';

export default function Challenge() {
    const router = useRouter()
    const {slug} = router.query

    const NO_PLACE = 'Not placed';

    const [challenge, setChallenge] = useState({});
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [open, setOpen] = useState(false);
    const [submissionMsg, setSubmissionMsg] = useState(false);
    const [hintOpen, setHintOpen] = useState(false);
    const [hints, setHints] = useState([]);
    const [flag, setFlag] = useState('');
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [leaderboards, setLeaderboards] = useState([NO_PLACE, NO_PLACE, NO_PLACE,]);
    const [award, setAward] = useState('');
    const [terminalUsername, setTerminalUsername] = useState('...');
    const [terminalPassword, setTerminalPassword] = useState('...');

    const [userData, setUserData] = useState({
        points: 0, susername: 'Loading...', spassword: 'Loading...',
    });


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
                if (result.username.length < 1) {
                    fetchTerminalData();
                }
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


    return (<>
        <Head>
            <title>{challenge ? challenge.title : ""} - CTFGuide</title>
            <style>
                @import
                url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
            </style>
        </Head>
        <main>
        <div id="terminal" className=" mt-6 max-w-6xl mx-auto">
                    <p className="hint mb-2 text-gray-400">
                        <span className="text-white ">Terminal (Beta)</span> Login as{' '}
                        <span className="text-yellow-400">{terminalUsername}</span> using
                        the password{' '}
                        <span className="text-yellow-400">{terminalPassword}</span>

                        <span onClick={() => {
                            window.location.reload()
                        }}
                              className='float-right ml-auto flex hover:text-neutral-300 cursor-pointer'> <ArrowPathIcon
                            className='h-6 w-6 mr-2'/> Reset Terminal</span>
                        <a
                            style={{cursor: 'pointer'}}
                            className="hidden text-gray-300 hover:bg-black"
                        >
                            Need help?
                        </a>
                    </p>
                    <iframe
                        className="w-full"
                        height="500"
                        src="https://terminal.ctfguide.com/wetty/ssh/root?pass="
                    ></iframe>
                </div>
        </main>


        <p className="mx-auto mt-4 w-3/5 rounded-lg bg-neutral-800 py-0.5 px-4 text-sm text-gray-200">
            ℹ We provide accessible environments for everyone to run cybersecurity
            tools. Abuse and unnecessary computation is prohibited.
        </p>
        <Footer/>
    </>)
}