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
       
        
        // first fetch active terminals
        const fetchActiveTerminals = async () => {
            var raw = "";

            var requestOptions = {
              method: 'GET',
              redirect: 'follow'
            };
            
            fetch(`https://file-system-run-qi6ms4rtoa-ue.a.run.app/Terminal/getAllUserTerminals?jwtToken=${localStorage.getItem("idToken")}`, requestOptions)
              .then(response => response.json())
              .then(result => {
                console.log(result);
                
                

                // handle if empty array
                if (result.length == 0) {
                    
                        try {
                      //      window.alert("no terminals found")
                            fetchTerminalData();
                        } catch (err) {
                            console.log(err);
                            setTerminalUsername('Something went wrong.');
                            setTerminalPassword('Something went wrong.');
                        }

                } else {
                    setTerminalUsername(result[0].userName);
                    setTerminalPassword(result[0].password);
                    document.getElementById("termurl").src = result[0].url;
                    document.getElementById("timer").innerText = result[0].minutesRemaining + " minutes";  
                    let minutes = result[0].minutesRemaining;
                    setInterval(function() {
                        // drop minutes
                        if (minutes == 0) {
                            window.alert("Your terminal session has expired. Please refresh the page to start a new session.")
                            window.location.reload();
                        }
                        minutes = minutes - 1;
                        document.getElementById("timer").innerText = minutes + " minutes";


                    }, 60000)
                 
                }
              })
              .catch(error => console.log('error', error));


              // send request



        }

        
        const fetchTerminalData = async () => {
            try {
                console.log("[debug] Creating new container session because nothing was found.")
                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/json");
                // random 4 digit number
                let code = Math.floor(Math.random() * 9000) + 1000;

                // create a secure random password
                var password = "";
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                for (var i = 0; i < 10; i++)
                password += possible.charAt(Math.floor(Math.random() * possible.length));
                
                var raw = JSON.stringify({
                  "jwtToken": localStorage.getItem("idToken"),
                  "TerminalGroupName": "school-class-session", // temp
                  "TerminalID": `${code}`,
                  "classID": "psu58102", // temp
                  "dockerLocation": "wettyoss/wetty:latest",// temp
                  "injectFileLocation": "", // temp
                  "maxCpuLimit": "500m",// temp
                  "maxMemoryLimit": "512Mi",// temp
                  "minCpuLimit": "250m",// temp
                  "minMemoryLimit": "256Mi",// temp
                  "terminalUsername": localStorage.getItem("username"),
                  "organizationName": "PSU", // temp
                  "terminalPassword": "",
                  "userID": localStorage.getItem("username"),

                });
                
                var requestOptions = {
                  method: 'POST',
                  headers: myHeaders,
                  body: raw,
                  redirect: 'follow'
                };
                
                fetch("https://file-system-run-qi6ms4rtoa-ue.a.run.app/Terminal/createTerminal", requestOptions)
                  .then(response => {
                    response.json();
                

                    fetchActiveTerminals();
                  })
                  .then(result => console.log(result))
                  .catch(error => console.log('error', error));
            } catch (err) {
                console.log(err);
                setTerminalUsername('Something went wrong.');
                setTerminalPassword('Something went wrong.');
            }
        };


        try {
            fetchActiveTerminals();
        } catch(err) {
            console.log(err);
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
                    <div className="hint mb-2 text-gray-400">
                        <span className="text-white ">Terminal <span className='text-blue-500'>build: 1.0.2</span></span> Login as{' '}
                        <span className="text-yellow-400">{terminalUsername}</span> using
                        the password{' '}
                        <span className="text-yellow-400">{terminalPassword}</span>

                        <div
                              className='float-right ml-auto flex  cursor-pointer'>  
                        
                              
                          
                        <a
                            style={{cursor: 'pointer'}}
                            className=" text-gray-300 hover:bg-black"
                        >
                            Container will stop in: <span id="timer"></span>
                        </a>
                        </div>
                    </div>
          
                    <iframe
                        className="w-full bg-white"
                        height="500"
                        id="termurl"
                        src="https://fonty.ctfguide.com/ctfterminal/"
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
