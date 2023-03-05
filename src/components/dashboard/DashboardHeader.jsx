import { EnvelopeIcon, CogIcon } from '@heroicons/react/20/solid'
import { useEffect, useState } from 'react'
import { app } from '../../config/firebaseConfig';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth"





export function DashboardHeader() {

const [username, setUsername] = useState("Loading...");
const [location, setLocation] = useState("Loading...");
const [github, setGithub] = useState("https://github.com");


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
                {location}
              </p>

            </div>
            <div className="justify-stretch mt-12 flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4 ">
              <a
                href={github}
                style={{ backgroundColor: "#212121", borderWidth: "0px" }}
                type="button"
                className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-2  text-sm font-medium text-white shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >

                  <i class="fab fa-github text-xl"></i>
    
              </a>
              <button
                style={{ backgroundColor: "#212121", borderWidth: "0px" }}
                type="button"
                className="hidden inline-flex justify-center rounded-md border border-gray-300 bg-white px-2 text-sm font-medium text-white shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
            <i class="fas fa-link text-lg"></i>
              </button>
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
