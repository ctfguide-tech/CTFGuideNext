import Head from 'next/head';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import request from '@/utils/request';
import { MarkdownViewer } from '@/components/MarkdownViewer';
import { useRouter } from 'next/router';
import CreatedChallenges from '@/components/profile/v2/CreatedChallenges';
import LikedChallenges from '@/components/profile/v2/LikedChallenges';
import Badges from '@/components/profile/v2/Badges';
import Writeups from '@/components/profile/v2/Writeups';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import ActivityCalendar from 'react-activity-calendar';
import { DonutChart } from '@tremor/react';
import Followers from '@/components/profile/Followers';
import Following from '@/components/profile/Following';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

// Register the necessary chart components
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const mockActivityData = [
    { date: '2024-01-01', count: 0, level: 0 },
    { date: '2024-12-21', count: 0, level: 0 },
];

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
export default function Create() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('LIKED CHALLENGES');
    const [isBioExpanded, setIsBioExpanded] = useState(false);
    const [followerNum, setFollowerNum] = useState(0);
    const [followingNum, setFollowingNum] = useState(0);
    const [activityData, setActivityData] = useState(mockActivityData);
    const [completedChallenges, setCompletedChallenges] = useState(null);
    let [totalCompletedChallenges, setTotalCompletedChallenges] = useState(0);
    const [completionData, setCompletionData] = useState([
        {
            name: 'Beginner',
            amount: 0,
            color: 'bg-blue-500',
        },
        {
            name: 'Easy',
            amount: 0,
            color: 'bg-green-500',
        },
        {
            name: 'Medium',
            amount: 0,
            color: 'bg-orange-500',
        },
        {
            name: 'Hard',
            amount: 0,
            color: 'bg-red-500',
        },
        {
            name: 'Insane',
            amount: 0,
            color: 'bg-purple-500',
        },
    ]);

    const [displayMode, setDisplayMode] = useState('default');
    const [mutuals, setMutuals] = useState([]);

    const [followers, setFollowers] = useState(0);
    const [followerPage, setFollowerPage] = useState(0); // Initial page
    const [totalFollowerPages, setTotalFollowerPages] = useState(0); // Total pages

    const [following, setFollowing] = useState(0);
    const [followingPage, setFollowingPage] = useState(0); // Initial page
    const [totalFollowingPages, setTotalFollowingPages] = useState(0); // Total pages

    const [categoryChallenges, setCategoryChallenges] = useState([]);
    const [rank, setRank] = useState(null);

    const toggleBio = () => {
        setIsBioExpanded(!isBioExpanded);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'LIKED CHALLENGES':
                return (
                    <>
                        <h1 className="text-xl font-bold text-white">LIKED CHALLENGES</h1>
                        {user != undefined && <LikedChallenges user={user} />}
                    </>
                );
            case 'WRITEUPS':
                return (
                    <>
                        <h1 className="text-xl font-bold text-white">WRITEUPS</h1>
                        {user && <Writeups user={user} />}
                    </>
                );
            case 'CREATED CHALLENGES':
                return (
                    <>
                        <h1 className="text-xl font-bold text-white">
                            CREATED CHALLENGES
                        </h1>
                        <CreatedChallenges />
                    </>
                );
            case 'BADGES':
                return (
                    <>
                        <h1 className="text-xl font-bold text-white">BADGES</h1>
                        <Badges />
                    </>
                );
            default:
                return null;
        }
    };

    useEffect(() => {
        if (router.query.user) {
            request(`${process.env.NEXT_PUBLIC_API_URL}/users/${router.query.user}`, 'GET', null)
                .then((data) => {
                    setUser(data);
                })
                .catch((err) => {
                    console.log(err);
                });

            request(`${process.env.NEXT_PUBLIC_API_URL}/users/${router.query.user}/rank`, 'GET', null)
                .then((data) => {
                    setRank(data.rank);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [router.query.user]);

    useEffect(() => {
        const fetchActivityData = async () => {
            try {
                const response = await request(
                    `${process.env.NEXT_PUBLIC_API_URL}/users/${router.query.user}/activity`,
                    'GET',
                    null
                );
                //setActivityData(response.data);
            } catch (err) {
                console.log(err);
            }
        };

        const fetchChallenges = async () => {
            try {
                const resp = await request(
                    `${process.env.NEXT_PUBLIC_API_URL}/users/${router.query.user}/completedChallenges`,
                    'GET',
                    null
                );
                if (resp) {
                    setCompletedChallenges(resp);
                    console.log('setting resp');
                }
                setTotalCompletedChallenges(
                    resp.beginnerChallenges.length +
                    resp.easyChallenges.length +
                    resp.mediumChallenges.length +
                    resp.hardChallenges.length +
                    resp.insaneChallenges.length
                );
                console.log('completed challenges: ', completedChallenges);
                setCompletionData([
                    {
                        name: 'Beginner',
                        amount: resp.beginnerChallenges.length,
                        color: 'bg-blue-500',
                    },
                    {
                        name: 'Easy',
                        amount: resp.easyChallenges.length,
                        color: 'bg-green-500',
                    },
                    {
                        name: 'Medium',
                        amount: resp.mediumChallenges.length,
                        color: 'bg-orange-500',
                    },
                    {
                        name: 'Hard',
                        amount: resp.hardChallenges.length,
                        color: 'bg-red-500',
                    },
                    {
                        name: 'Insane',
                        amount: resp.insaneChallenges.length,
                        color: 'bg-purple-500',
                    },
                ]);
            } catch (err) {
                console.log(err);
            }
        };
        const fetchCategories = async () => {
            try {
                const response = await request(`${process.env.NEXT_PUBLIC_API_URL}/users/${router.query.user}/completedCategory`, 'GET', null);
                if (response) {
                    const categories = [
                        { name: 'Forensics', completed: response.forensicsChallenges.length },
                        { name: 'Crypto', completed: response.cryptographyChallenges.length },
                        { name: 'RE', completed: response.reverseEngineeringChallenges.length },
                        { name: 'Web', completed: response.webChallenges.length },
                        { name: 'Pwn', completed: response.pwnChallenges.length },
                        { name: 'Pgrming', completed: response.programmingChallenges.length },
                        { name: 'Basic', completed: response.basicChallenges.length },
                        { name: 'Other', completed: response.otherChallenges.length },
                    ];
                    setCategoryChallenges(categories);
                } else {
                    setCategoryChallenges([]);
                }
            } catch (err) {
                console.log(err);
                setCategoryChallenges([]);
            }
        };

        fetchCategories();
        fetchChallenges();
        fetchActivityData();
    }, [router.query.user]);

    async function loadStreakChart() {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/activity/${router.query.user}`;
        const response = await request(url, 'GET', null);
        console.log(response);
        setActivityData(response.body);
    }

    useEffect(() => {
        if (router.query.user) loadStreakChart();
    }, [router.query.user]);

    // Get the Username from Local Storage
    useEffect(() => {
        const storedUser = localStorage.getItem('username');
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    // Followers useEffect
    useEffect(() => {
        if (user && user.username) {
            const fetchFollowers = async () => {
                try {
                    const endPoint =
                        process.env.NEXT_PUBLIC_API_URL +
                        '/followers/' +
                        user.username +
                        `/followers?page=${followerPage}`;
                    const result = await request(endPoint, 'GET');
                    if (result && result.followers) {
                        setTotalFollowerPages(result.lastPage + 1);
                        setFollowers(result.followers);
                        setFollowerNum(result.totalEntries);
                    }
                } catch (err) {
                    console.error(err);
                }
            };
            fetchFollowers();
        }
    }, [user, followerPage]);

    // Following useEffect
    useEffect(() => {
        if (user && user.username) {
            const fetchFollowing = async () => {
                try {
                    const endPoint =
                        process.env.NEXT_PUBLIC_API_URL +
                        '/followers/' +
                        user.username +
                        `/following?page=${followingPage}`;
                    const result = await request(endPoint, 'GET');
                    if (result && result.following) {
                        setTotalFollowingPages(result.lastPage + 1);
                        setFollowing(result.following);
                        setFollowingNum(result.totalEntries);
                    }
                } catch (err) {
                    console.error(err);
                }
            };
            fetchFollowing();
        }
    }, [user, followingPage]);

    const userData = { user, ownUser: true };

    // Follower
    const handleFollowerPageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalFollowerPages) {
            setFollowerPage(newPage);
        }
    };
    const nextFollowerPage = () => handleFollowerPageChange(followerPage + 1);
    const prevFollowerPage = () => handleFollowerPageChange(followerPage - 1);
    const followerPageData = {
        setDisplayMode,
        page: followerPage,
        totalPages: totalFollowerPages,
        prevPage: prevFollowerPage,
        nextPage: nextFollowerPage,
    };

    // Following
    const handleFollowingPageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalFollowingPages) {
            setFollowingPage(newPage);
        }
    };
    const nextFollowingPage = () => handleFollowingPageChange(followingPage + 1);
    const prevFollowingPage = () => handleFollowingPageChange(followingPage - 1);
    const followingPageData = {
        setDisplayMode,
        page: followingPage,
        totalPages: totalFollowingPages,
        prevPage: prevFollowingPage,
        nextPage: nextFollowingPage,
    };

    const radarData = {
        labels: categoryChallenges.map(category => category.name),
        datasets: [
            {
                label: 'Completed Challenges',
                data: categoryChallenges.map(category => category.completed),
                backgroundColor: 'rgba(34, 202, 236, 0.2)',
                borderColor: 'rgba(34, 202, 236, 1)',
                pointBackgroundColor: 'rgba(34, 202, 236, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(34, 202, 236, 1)',
                borderWidth: 2,
            },
        ],
    };

    const radarOptions = {
        scales: {
            r: {
                angleLines: {
                    display: true,
                    color: '#444',
                },
                grid: {
                    color: '#444',
                },
                pointLabels: {
                    color: '#fff',
                    font: {
                        size: 14,
                    },
                },
                ticks: {
                    beginAtZero: true,
                    min: 0,
                    max: 10,
                    stepSize: 2,
                    showLabelBackdrop: false,
                    color: '#fff',
                },
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `${context.label}: ${context.raw}`;
                    },
                },
            },
        },
    };

    return (
        <>
            <Head>
                <title>{user && user.username}'s Profile - CTFGuide</title>
                <style>
                    @import
                    url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
                </style>
            </Head>
            <StandardNav />
            <div>
                <div>
                    <div
                        style={{
                            backgroundSize: 'cover',
                            backgroundImage:
                                'url("https://images.unsplash.com/photo-1633259584604-afdc243122ea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80")',
                        }}
                        className="h-20 w-full object-cover lg:h-56"
                        alt=""
                    ></div>
                </div>
                <div className="mx-auto max-w-7xl ">
                    <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
                        <div className="flex w-40">
                            <a href="../settings">
                                {(user && (
                                    <img
                                        className="rounded-full hover:bg-[#212121] sm:h-32 sm:w-32"
                                        src={
                                            user.profileImage ||
                                            'https://robohash.org/' + user.username
                                        }
                                        alt=""
                                    />
                                )) || (
                                        <Skeleton
                                            circle={true}
                                            height={128}
                                            width={128}
                                            baseColor="#262626"
                                            highlightColor="#3a3a3a"
                                        />
                                    )}
                            </a>
                        </div>
                        <div className="mt-4 w-full">
                            <div className="">
                                <div className="mt-6 ">
                                    <div className="mt-6  flex w-full">
                                        <div>
                                            <h1 className="f mt-8 truncate text-2xl font-bold text-white">
                                                {(user && user.username) || (
                                                    <Skeleton
                                                        baseColor="#262626"
                                                        highlightColor="#3a3a3a"
                                                        width="15rem"
                                                    />
                                                )}
                                                {user && rank && (
                                                    <span className="ml-2 text-2xl  text-neutral-400">
                                                        #{rank}
                                                    </span>
                                                )}

                                                {user && user.role === 'ADMIN' && (
                                                    <span className="bg-red-600 px-1 text-sm ml-4">
                                                        <i className="fas fa-code fa-fw"></i> developer
                                                    </span>
                                                )}

                                                {user && user.role === 'PRO' && (
                                                    <span className="bg-gradient-to-br from-orange-400 to-yellow-600 px-1 text-sm ml-4">
                                                        <i className="fas fa-crown fa-fw"></i> pro
                                                    </span>
                                                )}
                                            </h1>
                                            <p className="text-white  ">
                                                <i className="fas fa-map-marker-alt mt-2"></i>{' '}
                                                {(user && user.location) || (
                                                    <Skeleton
                                                        width="25rem"
                                                        baseColor="#262626"
                                                        highlightColor="#3a3a3a"
                                                    />
                                                )}
                                            </p>
                                        </div>
                                        <div className="ml-auto  mt-14 flex text-white">
                                            <p>
                                                {user && (
                                                    <>
                                                        <span
                                                            className="cursor-pointer font-bold hover:text-gray-400"
                                                            onClick={() => setDisplayMode('followers')}
                                                        >
                                                            {' '}
                                                            Followers
                                                        </span>{' '}
                                                        {followerNum || '0'}
                                                        <span
                                                            className="ml-4 cursor-pointer font-bold hover:text-gray-400"
                                                            onClick={() => setDisplayMode('following')}
                                                        >
                                                            {' '}
                                                            Following
                                                        </span>{' '}
                                                        {followingNum || '0'}
                                                    </>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="mx-auto mt-10 max-w-7xl">
                <div className="mt-10 grid grid-cols-1 gap-y-4 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-4 lg:gap-x-4 ">
                    <div className="h-40 w-full border-t-4 border-blue-600 bg-neutral-800">

                        <div className="col-span-2 bg-neutral-800 px-4 pt-4">
                            <div className="bg-neutral-800">
                                <h1 className="text-xl font-bold text-white">SKILL CHART</h1>
                                {categoryChallenges.length > 0 ? (
                                    <Radar data={radarData} options={radarOptions} />
                                ) : (
                                    <h1 className="mx-auto my-auto text-neutral-400">
                                        It seems that {user && user.username} hasn't solved any challenges yet.
                                    </h1>
                                )}
                            </div>
                            <hr className="mt-4 border-neutral-700 px-4"></hr>
                        </div>

                        <div className="col-span-2 bg-neutral-800 px-4 pt-4 ">
                            <div className="bg-neutral-800">
                                <h1 className="text-xl font-bold text-white mb-4">
                                    DIFFICULTY BREAKDOWN
                                </h1>
                                {completionData && (
                                    <DonutChart
                                        className="mt-10"
                                        data={completionData}
                                        category="amount"
                                        index="name"
                                        label={`${totalCompletedChallenges} challenges`}
                                        showTooltip={true}
                                    />
                                )}
                            </div>
                            <hr className="mt-4 border-neutral-700 px-4"></hr>
                        </div>


                        <div className="h-full gap-y-4 bg-neutral-800 px-4 py-4">
                            <h1 className="text-xl font-bold text-white">NERD STATS</h1>
                            {user && (
                                <div className="text-xs text-neutral-400">
                                    <p>
                                        Creation Date :{' '}
                                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric',
                                            minute: 'numeric',
                                            hour: 'numeric',
                                        })}
                                    </p>
                                    <p>Total Challenges: {user.totalChallenges || '0'}</p>
                                    <p>Total Writeups: {user.totalWriteups || '0'}</p>
                                    <p>Total Badges: {user.totalBadges || '0'}</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="col-span-3 border-t-4 border-blue-600">
                        {displayMode === 'followers' && (
                            <Followers
                                followers={followers}
                                pageData={followerPageData}
                                userData={userData}
                            />
                        )}
                        {displayMode === 'following' && (
                            <Following
                                followings={following}
                                pageData={followingPageData}
                                userData={userData}
                            />
                        )}

                        {displayMode === 'default' && (
                            <>

                                <div className="bg-neutral-800 px-4 py-4">
                                    {user && (
                                        <h1 className="mb-4 text-xl font-bold uppercase text-white">
                                            ABOUT {user.username}
                                        </h1>
                                    )}
                                    <p className="text-neutral-400">
                                        {user && <MarkdownViewer content={user.bio} />}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-y-4 pt-4 ">
                                    <div>
                                        <div className="pb-2 ">
                                            <ul className="hidden w-full list-none text-neutral-500 md:flex">
                                                {[
                                                    'LIKED CHALLENGES',
                                                    'WRITEUPS',
                                                    'CREATED CHALLENGES',
                                                    'BADGES',
                                                ].map((tab) => (
                                                    <li
                                                        key={tab}
                                                        className={`mr-4 cursor-pointer ${activeTab === tab
                                                                ? ' border-blue-600 font-semibold text-blue-600'
                                                                : ''
                                                            }`}
                                                        onClick={() => setActiveTab(tab)}
                                                    >
                                                        {tab}
                                                    </li>
                                                ))}
                                            </ul>
                                            <select
                                                className="w-1/2 w-full rounded border-none bg-neutral-800 px-4 text-neutral-50 md:hidden"
                                                value={activeTab}
                                                onChange={(e) => setActiveTab(e.target.value)}
                                            >
                                                {[
                                                    'LIKED CHALLENGES',
                                                    'WRITEUPS',
                                                    'CREATED CHALLENGES',
                                                    'BADGES',
                                                ].map((tab) => (
                                                    <option key={tab} value={tab}>
                                                        {tab}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="border-t-4 border-blue-600 bg-neutral-800 px-4 py-4">
                                            {user != undefined && renderContent()}
                                        </div>

                                        <div className="w-full">
                                            <div className="text-white">
                                                <div className="mt-4 w-full border-t-4 border-blue-600 bg-neutral-800 px-4 py-4">
                                                    <h2 className="mb-4 text-xl font-bold text-white">
                                                        ACTIVITY CALENDAR
                                                    </h2>
                                                    <div className="flex justify-center">
                                                        <ActivityCalendar
                                                            data={activityData}
                                                            showMonthLabels={true} // Ensure month labels are shown
                                                            theme={{
                                                                light: [
                                                                    '#1f1f1f',
                                                                    '#c0d7ff',
                                                                    '#93bfff',
                                                                    '#66a7ff',
                                                                    '#3a8fff',
                                                                ],
                                                                dark: [
                                                                    '#1f1f1f',
                                                                    '#c0d7ff',
                                                                    '#93bfff',
                                                                    '#66a7ff',
                                                                    '#3a8fff',
                                                                ],
                                                                level4: '#3a8fff',
                                                            }}
                                                        />{' '}
                                                    </div>{' '}
                                                </div>{' '}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}



                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}
