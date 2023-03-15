import { EnvelopeIcon, CogIcon } from '@heroicons/react/20/solid'
import { useEffect, useState } from 'react'
import { app } from '../../config/firebaseConfig';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth"





export function DashboardHeader() {

const [username, setUsername] = useState("Loading...");
const [location, setLocation] = useState("Loading...");
const [github, setGithub] = useState("https://github.com");

const [points, setPoints] = useState("...");
const [rank, setRank] = useState("...");



useEffect(() => {



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
        setGithub(data.githubUrl)
        setPoints(data.points)
        setRank(data.leaderboardNum+1)
      })
      .catch((err) => {
        console.log(err);
      });
}, [])

  return (
    <div>
      <div>
        <div style={{ backgroundColor: "#212121" }} className="h-20 w-full object-cover lg:h-20" alt="" />
      </div>
      <div className="mx-auto max-w-7xl ">
        <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
          <div className="flex">
            <img style={{ borderColor: "#ffbf00" }} className="h-24 w-24 rounded-full sm:h-32 sm:w-32" src="../default_pfp.jpeg" alt="" />
          </div>
          <div className="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
            <div className="mt-6 min-w-0 flex-1 sm:hidden md:block">
              <h1 className="truncate text-2xl font-bold text-white mt-8">{username}</h1>
              <p className='text-white'>
              <i class="fas fa-map-marker-alt"></i>  {location}
              </p>

            </div>
            <div className="justify-stretch mt-12 flex  ">
           
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
