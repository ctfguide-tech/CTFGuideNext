import { useEffect, useState } from 'react'

export function DashboardHeader() {

  const [username, setUsername] = useState("Loading...");
  const [location, setLocation] = useState("Loading...");
  const [join, setJoin] = useState("");
  const [github, setGithub] = useState("https://github.com");

  const [points, setPoints] = useState("...");
  const [rank, setRank] = useState("...");

  useEffect(() => {
      try {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/account`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("idToken"),
          },
        })
          .then((res) => res.json())
          .then((data) => {
            setUsername(data.username)
            setLocation(data.location)
            setJoin(data.createdAt.substring(0, 10))
            setGithub(`https://github.com/${data.githubUrl}`)
            setPoints(data.points)
            setRank(data.leaderboardNum+1)
          })
          .catch((err) => {
            console.log(err);
          });
      } catch {

      }
  }, [])

  return (
    <div>
      <div>
        <div style={{ backgroundColor: "#212121" }} className="h-20 w-full object-cover lg:h-20" alt="" />
      </div>
      <div className="mx-auto max-w-7xl ">
        <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
          <div className="flex">
            <a href="./settings">
              <img style={{ borderColor: "#ffbf00" }} className="hover:bg-[#212121] h-24 w-24 rounded-full sm:h-32 sm:w-32" src={`https://robohash.org/` + username + `.png?set=set1&size=150x150`} alt="" />
            </a>
          </div>
          <div className="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
            <div className="mt-6 min-w-0 flex-1 sm:hidden md:block">
              <h1 className="truncate text-2xl font-bold text-white mt-8">{username}</h1>
              <p className='text-white'>
              <i class="mt-2 fas fa-map-marker-alt"></i>  {location}
              </p>
            </div>
            <div className="justify-stretch mt-12 flex  ">
           
            <div className="mr-4">
              <a href={github}>
                <div className="bg-[#212121] hover:bg-[#262626] px-6 py-1 mt-9 rounded-lg mb-0">
                  <svg viewBox="0 0 98 96" width="26" height="48" xmlns="http://www.w3.org/2000/svg"><path className='fill-white' fill-rule="evenodd" clip-rule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" fill="#24292f"/></svg>
                </div>
              </a>
            </div>

            <div className="px-10 py-1 mt-8 rounded-lg mb-0" style={{ backgroundColor: "#212121", borderWidth: "0px" }}>
              <h1 className='text-white mx-auto text-center text-xl mt-0 mb-0 font-semibold'>{points}</h1>
              <p className='mt-0 text-white'>Points</p>
            </div>

            <div className="ml-4 px-10 py-1 mt-8 rounded-lg mb-0" style={{ backgroundColor: "#212121", borderWidth: "0px" }}>
              <h1 className='text-white  mx-auto text-center text-xl mt-0 font-semibold'>#{rank}</h1>
              <p className='mt-0 text-white'>Rank</p>
            </div>
            
            </div>
            
          </div>
        </div>
        <div className="mt-6 hidden min-w-0 flex-1 sm:block md:hidden">
          <h1 className="truncate text-2xl font-bold text-gray-900">{username}</h1>
        </div>
      </div>
    </div>
  )
}
