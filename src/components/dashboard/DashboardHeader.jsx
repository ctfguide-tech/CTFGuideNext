import { useEffect, useState, useContext } from 'react';
import { Context } from '@/context';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import request from '@/utils/request';
import Link from 'next/link';

export function DashboardHeader() {
  const { username } = useContext(Context);
  const [location, setLocation] = useState('');
  const [join, setJoin] = useState('');
  const [github, setGithub] = useState('');
  const [pfp, setPfp] = useState('');
  const [githubUsername, setGithubUsername] = useState('.');
  const [points, setPoints] = useState('');
  const [rank, setRank] = useState('');
  const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;
  const [role, setRole] = useState('');

  useEffect(() => {
    try {
      request(`${process.env.NEXT_PUBLIC_API_URL}/account`, 'GET', null)
        .then((data) => {
          setLocation(data.location);
          setJoin(data.createdAt.substring(0, 10));
          if (data.githubUrl) {
            setGithub(`https://github.com/${data.githubUrl}`);
            setGithubUsername(data.githubUsername);
          }
          setPoints(data.points);
          setRank(data.leaderboardNum + 1);
          setRole(data.role);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch {}
  }, []);

  // get user's profile picture
  useEffect(() => {
    if (!username) {
      return;
    }
    const fetchData = async () => {
      try {
        const endPoint =
          process.env.NEXT_PUBLIC_API_URL + '/users/' + username + '/pfp';
        const result = await request(endPoint, 'GET', null);
        if (result) {
          console.log(result);
          setPfp(result);
        } else {
          console.log('here:' + username);
          console.log(
            `https://robohash.org/${username}.png?set=set1&size=150x150`
          );
          setPfp(`https://robohash.org/${username}.png?set=set1&size=150x150`);
        }
      } catch (err) {
        console.log('failed to get profile picture');
      }
    };
    fetchData();
  }, [username]);

  function createPopupWin(pageURL, pageTitle, popupWinWidth, popupWinHeight) {
    var left = screen.width;
    var top = screen.height;
    var myWindow = window.open(
      pageURL,
      pageTitle,
      'resizable=yes, width=' +
        popupWinWidth +
        ', height=' +
        popupWinHeight +
        ', top=' +
        top +
        ', left=' +
        left
    );
  }

  return (
    <div>
      <div>
        <div
          style={{
            backgroundSize: 'cover',
            backgroundImage:
              'url("https://images.unsplash.com/photo-1633259584604-afdc243122ea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80")',
          }}
          className="h-20 w-full object-cover lg:h-20 "
          alt=""
        ></div>
      </div>
      <div className="mx-auto max-w-7xl">
        <div className="-mt-12  sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
          <div className="flex justify-center sm:justify-start">
            <Link href={`${baseUrl}/users/${username}`} legacyBehavior>
              {(pfp && (
                <img
                  className="h-32 w-32    rounded-full hover:bg-[#212121] sm:h-32 sm:w-32"
                  src={pfp}
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
            </Link>
          </div>
          <div className="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
            <div className="mt-6 min-w-0 flex-1 sm:hidden md:block  text-center sm:text-left">
              <div className="items-center mt-8 truncate text-3xl sm:text-3xl lg:text-2xl font-bold text-white">
                {username || (
                  <Skeleton
                    baseColor="#262626"
                    highlightColor="#3a3a3a"
                    width="15rem"
                  />
                )}

                {role === 'ADMIN' && (
                  <span className="ml-2 rounded-sm bg-red-600 px-1 text-sm hidden sm:inline">
                    <i className="fas fa-code fa-fw"></i>
                    <span className="hidden sm:inline"> Developer</span>
                  </span>
                )}
                {role === 'PRO' && (
                  <span className="ml-2 rounded-sm bg-gradient-to-br from-orange-400 to-yellow-600 px-1 text-sm hidden sm:inline">
                    <i className="fas fa-crown fa-fw"></i>
                    <span className="hidden sm:inline"> Pro</span>
                  </span>
                )}
              </div>
              <p className="text-white hidden sm:block">
                <i className="fas fa-map-marker-alt mt-2"></i>{' '}
                {location || (
                  <Skeleton
                    width="25rem"
                    baseColor="#262626"
                    highlightColor="#3a3a3a"
                  />
                )}
              </p>
            </div>
            <div className="hidden mt-12 flex justify-center sm:justify-stretch px-4 sm:px-4 md:px-0 lg:px-0 ">
              <div className="mr-4 hidden">
                {github && (
                  <a className="" href={github}>
                    <div className="mb-0 mt-9 rounded-lg bg-[#212121] px-6 py-2 hover:bg-[#262626]">
                      <svg
                        viewBox="0 0 98 96"
                        width="26"
                        height="48"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          className="fill-white"
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
                          fill="#24292f"
                        />
                      </svg>
                    </div>
                  </a>
                )}
              </div>
              <a
                href={`/users/${username}`}
                className="duration-400 mb-0 ml-2 flex cursor-pointer items-center space-x-1 rounded-lg bg-neutral-800 px-10 py-1 transition ease-in-out hover:bg-neutral-800/40 sm:block hidden"
              >
                <p className="mt-0 text-white">
                  <i className="fas fa-user mr-1"></i> View Profile
                </p>
              </a>
              <div
                className="mb-0 ml-4 mt-8 hidden rounded-lg px-10 py-1"
                style={{ backgroundColor: '#212121', borderWidth: '0px' }}
              >
                <h1 className="mx-auto  mt-0 text-center text-xl font-semibold text-white">
                  #{rank}
                </h1>
                <p className="mt-0 text-white">Rank</p>
              </div>
            </div>
          </div>
        </div>
   
      </div>
    </div>
  );
}