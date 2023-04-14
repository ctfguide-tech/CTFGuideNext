import Head from 'next/head';
import {useState} from 'react';
import {StandardNav} from '@/components/StandardNav';
import {Footer} from '@/components/Footer';

const pages = [{name: 'Creator Dashboard', href: '../create', current: false}, {
    name: 'Challenge Creation',
    href: './',
    current: true
},];

export default function Createchall() {
    const [activeTab, setActiveTab] = useState('created');

    function handleTabClick(tab) {
        setActiveTab(tab);
    }

    function uploadChallenge() {
        // WARNING: For POST requests, body is set to null by browsers.
        var data = JSON.stringify({
            title: document.getElementById('challengeName').innerText,
            content: document.getElementById('content').value,
            category: [document.getElementById('category').value],
            points: 100,
            difficulty: document.getElementById('difficulty').value.toUpperCase(),
            keyword: document.getElementById('solution').value,
            challengeType: 'STANDARD',
            hints: [document.getElementById('hint1').value, document.getElementById('hint2').value, document.getElementById('hint3').value,],
            penalties: [10, 15, 20],
        });

        var xhr = new XMLHttpRequest();

        xhr.addEventListener('readystatechange', function () {
            if (this.readyState === 4 || this.status === 201) {
                window.location.replace('/create');
            }

            if (this.readyState === 4 && this.status != 201) {
                window.alert('Something went wrong.');
            }
        });

        xhr.open('POST', `${process.env.NEXT_PUBLIC_API_URL}/challenges`);
        xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('idToken'));
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.send(data);
    }

    return (<>
            <Head>
                <title>Create - CTFGuide</title>
                <style>
                    @import
                    url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
                </style>
            </Head>
            <StandardNav/>

            <main>


                <nav
                    className="mx-auto mt-10 flex max-w-7xl text-center"
                    aria-label="Breadcrumb"
                >
                    <ol role="list" className="flex items-center space-x-4">
                        <li>
                            <div>
                                <a href="#" className=" text-white hover:text-gray-200">
                                    <i className="fas fa-home"></i>

                                    <span className="sr-only">Home</span>
                                </a>
                            </div>
                        </li>
                        {pages.map((page) => (<li key={page.name}>
                                <div className="flex items-center">
                                    <svg
                                        className="h-5 w-5 flex-shrink-0 text-gray-200"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        aria-hidden="true"
                                    >
                                        <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z"/>
                                    </svg>
                                    <a
                                        href={page.href}
                                        className="ml-4 text-sm font-medium text-gray-100 hover:text-gray-200"
                                        aria-current={page.current ? 'page' : undefined}
                                    >
                                        {page.name}
                                    </a>
                                </div>
                            </li>))}
                    </ol>
                </nav>

                <div
                    id="createChallenges"
                    className="mx-auto mt-10 max-w-7xl text-white"
                >
                    {/*/ Create a new challenge */}

                    <h1
                        id="challengeName"
                        className="w-3/4 rounded-sm shadow-lg bg-neutral-900/90 py-2 px-4 text-3xl font-semibold text-white"
                        contentEditable
                    >
                        Untitled Challenge
                    </h1>

                    <div className=" mt-4 flex flex-shrink-0">
                        <select
                            id="difficulty"
                            name="difficulty"
                            className="mt-1 mb-4  w-1/3 rounded-md border-neutral-900 bg-neutral-900/90 py-2 pl-3 pr-20 text-base  text-white  focus:outline-none sm:text-sm"
                            defaultValue="easy"
                        >
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>

                        <select
                            id="category"
                            name="category"
                            className="ml-4 mt-1 mb-4  w-1/3 rounded-md border-neutral-900  bg-neutral-900/90 py-2 pl-3 pr-20  text-base  text-white  focus:outline-none sm:text-sm"
                            defaultValue="forensics"
                        >
                            <option value="forensics">forensics</option>
                            <option value="cryptography">cryptography</option>
                            <option value="web">web</option>
                            <option value="reverse engineering">reverse engineering</option>
                            <option value="programming">programming</option>
                            <option value="pwn">pwn</option>
                            <option value="steganography">steganography</option>
                            <option value="basic">basic</option>

                            <option value="other">other</option>
                        </select>
                    </div>

                    <div
                        className="mt-5 rounded-sm shadow-lg border border-gray-900 bg-neutral-800/40  shadow-lg ring-1 ring-black ring-opacity-5">
                        <h3 className=" rounded-t-lg bg-blue-800 px-4 py-1.5 text-xl font-medium leading-6 text-white">
                            Challenge Content
                        </h3>
                        <div className="px-5 py-5 ">
              <textarea
                  id="content"
                  className="h-40 w-full rounded-sm shadow-lg  border-none bg-neutral-900 px-5 py-4 text-white"
              ></textarea>
                        </div>
                    </div>

                    <div className="mt-5 rounded-sm shadow-lg 900 bg-neutral-800/40">
                        <h3 className="mt-6 rounded-t-lg bg-blue-800 px-4 py-1.5 text-xl font-medium leading-6 text-white">
                            Challenge Hints
                        </h3>
                        <div className="px-5 py-5">
                            <dt className="truncate text-xl font-medium text-white">
                                Hint 1
                            </dt>
                            <textarea
                                id="hint1"
                                className="mt-1 w-full rounded-sm shadow-lg border-none bg-neutral-900 text-white"
                            >
                No hint set
              </textarea>

                            <dt className="mt-4 truncate text-xl font-medium text-white">
                                Hint 2
                            </dt>
                            <textarea id="hint2" className="mt-1 w-full rounded-sm shadow-lg border-none bg-neutral-900   text-white">No hint set</textarea>

                            <dt className="mt-4 truncate text-xl font-medium text-white">
                                Hint 3
                            </dt>
                            <textarea id="hint3" className="mt-1 w-full rounded-sm shadow-lg border-none bg-neutral-900  text-white">
                                No hint set
                            </textarea>
                        </div>
                    </div>

                    <div className="mt-5 rounded-sm shadow-lg   900 bg-neutral-800/40">
                        <h3 className="mt-6 rounded-t-lg bg-blue-800 px-4 py-1.5 text-xl font-medium leading-6 text-white">
                            Challenge Solution
                        </h3>
                        <div className="px-5 py-5">
                            <textarea
                                id="solution"
                                className="mb-4 mt-1 w-full rounded-sm shadow-lg border-none bg-neutral-900 px-2 py-2  text-white"
                            >Nothing Set</textarea>
                        </div>
                    </div>

                    <button
                        onClick={uploadChallenge}
                        className="mr-2 mt-6 rounded-lg shadow-lg border-green-600 bg-green-900 px-4 py-2 text-2xl text-white hover:bg-green-800"
                    >
                        <i class="fas fa-send"></i> Send for approval
                    </button>

                    <button
                        className="mr-2 mt-6 hidden rounded-sm shadow-lg border-blue-600 bg-blue-700 px-4 py-2 text-2xl text-white hover:bg-blue-800">
                        <i class="fas fa-save"></i> Save as draft
                    </button>
                </div>

                <div
                    id="saved"
                    aria-live="assertive"
                    className="pointer-events-none fixed inset-0 flex hidden items-end px-4 py-6 sm:items-start sm:p-6"
                >
                    <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
                        <div
                            className="pointer-events-auto w-full  max-w-sm overflow-hidden rounded-sm shadow-lg border border-gray-700 shadow-lg ring-1 ring-black ring-opacity-5">
                            <div className="p-4">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <svg
                                            className="h-6 w-6 text-green-400"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                    <div className="ml-3 w-0 flex-1 pt-0.5">
                                        <p className="text-sm font-medium text-white">
                                            All changes saved
                                        </p>
                                        <p className="mt-1 text-sm text-gray-300">
                                            It may take a few minutes for your changes to be visible.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer/>
        </>);
}