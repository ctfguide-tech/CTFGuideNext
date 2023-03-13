import Head from 'next/head'
import Link from 'next/link'
import { Button } from '@/components/Button'
import { TextField } from '@/components/Fields'
import { Logo } from '@/components/Logo'
import { Alert } from '@/components/Alert'
import { Container } from '@/components/Container'
import { StandardNav } from '@/components/StandardNav'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function Pratice() {
    const [challenge, setChallenge] = useState({});
    const [userData, setUserData] = useState({
        points: 0,
        susername: 'Loading...',
        spassword: 'Loading...',
    })
    const router = useRouter();
    const data = router.query;

    console.log(data);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Need to be fixed in here
                const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/challenges');
                //const response = await fetch("https://api.ctfguide.com/challenges/" + '/challenges');
                const { result } = await response.json();
                setChallenge(result[0]);
            } catch (err) {
                throw err;
            }
        };
        fetchData();
    }, []);

    const submitFlag = () => {

    };
    return (
        <>
        <Head>
        <title>Practice  - CTFGuide</title>
        <style>
        @import url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
        </style>
        </Head>
        
        
        <StandardNav />
        <main>
        
        <div className=" w-full " style={{ backgroundColor: "#212121" }}>
            <div className="flex mx-auto text-center h-28 my-auto">
            <h1 className='text-4xl text-white mx-auto my-auto font-semibold'>{challenge.slug}</h1>
            </div>
        </div>
        
        
        
        <div className='max-w-6xl mx-auto text-left mt-6'>
            <h1 className='text-white text-3xl font-semibold'> Challenge Description </h1>

        {/* ***************************************** */}
        <div>

            <div className="flex items-center justify-between">

            <div className="flex w-full my-auto">
                <h1 id="challengeName" className="mt-5 w-1/2 text-4xl text-white mb-4 font-semibold">
                    {challenge.title}
                </h1>

                <div style={{ backgroundColor: "#212121" }} className="ml-auto  w-1/6 my-auto  rounded-lg px-2 py-1">
                <div className="text-sm mt-1   rounded-lg px-1 py-1 rounded-lg flex" >


                    <div className="c-avatar" >

                    <img width="70" className="rounded-full mx-auto c-avatar__image" src="https://avatars.githubusercontent.com/u/67762433?v=4"></img>


                    </div>

                    <div className=" pl-3">
                    <div className="text-white text-lg font-bold">raym0nd <i className="fas fa-tools"></i></div>
                    <div className=" text-sm" style={{ color: "#8c8c8c" }}> Author</div>

                    </div>

                </div>
                </div>
            </div>


            </div>

        </div>
        <p id="challengeDetails" style={{ color: "#8c8c8c" }} className="w-5/6 text-white text-lg">
            {challenge.content}
        </p>
        <div className="flex ">
            <div className="mt-4 rounded-lg">
                <div className="text-sm    rounded-lg   rounded-lg flex" >
                    <div style={{ color: "#8c8c8c" }} className="mb-4">

                    <input id="enteredFlag" style={{ backgroundColor: "#212121" }} placeholder="Flag Here" className="mx-auto text-white  focus-outline-none  outline-none px-4 py-1 rounded-lg mr-2 bg-black border border-gray-700"></input>
                    <button id="enterFlagBTN" onClick={submitFlag} className="  bg-green-700   rounded-lg  hover:bg-green-900 text-green-300 px-4 py-1">Submit Flag</button>
                    <button onClick={() => setOpen(true)} className="mt-4  bg-black  rounded-lg  bg-yellow-700 text-yellow-300 hover:bg-yellow-900 text-white px-4 py-1 ml-2">Stuck?</button>
                    </div>

                </div>
            </div>
        </div>
        <div className="mt-6 grid lg:grid-cols-3 gap-10 sm:grid-cols-1">

            <div style={{ backgroundColor: "#212121" }} className="w-full py-3 card mx-auto text-center">
            <div className="card-body">
                <h1 className="text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-yellow-400  text-2xl font-semibold">#1</h1>
                <p className="text-white text-lg">Laphatize</p>

            </div>
            </div>

            <div style={{ backgroundColor: "#212121" }} className="w-full py-3 card mx-auto text-center">
            <div className="card-body">
                <h1 className="text-white text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-indigo-500 " >#2</h1>
                <p className="text-white text-lg">Raymond</p>

            </div>
            </div>

            <div style={{ backgroundColor: "#212121" }} className="w-full py-3 card mx-auto text-center">
            <div className="card-body">
                <h1 className="text-white text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-green-500">#3</h1>
                <p className="text-white text-lg">Joshua</p>

            </div>
            </div>

        </div>

        <div id="terminal" className=" mt-6 ">
            <p className="text-gray-400 mb-2 hint"><span className="text-white ">Terminal (Beta)</span> Login as <span className="text-yellow-400">{userData.susername}</span> using the password <span className="text-yellow-400">{userData.spassword}</span><a style={{ cursor: 'pointer' }} className="hidden hover:bg-black text-gray-300">Need help?</a></p>
            <iframe className="w-full" height="500" src="https://terminal.ctfguide.com/wetty/ssh/root?pass=" ></iframe>
        </div>
        <div className="mt-5 rounded-lg px-5 ">
            <h1 className="text-white text-3xl font-semibold">Comments</h1>
            <textarea id="comment" style={{ backgroundColor: "#212121" }} className="border-none mt-4 text-white focus-outline-none outline-none block w-full bg-black rounded-lg"></textarea>

            <button onClick={() => {}} id="commentButton" style={{ backgroundColor: "#212121" }} className="mt-4 border border-gray-700 bg-black hover:bg-gray-900 rounded-lg text-white px-4 py-1">Post Comment</button>
            <h1 id="commentError" className="hidden text-red-400 text-xl px-2 py-1 mt-4">Error posting comment! This could be because it was less than 5 characters or greater than 250 characters. </h1>
            {

                // challenge.data.map((item) => (

                // <div className="mt-4 bg-black rounded-lg  " style={{ backgroundColor: "#212121" }} >
                //     <h1 className="text-white px-5 pt-4 text-xl">@{item.username}</h1>
                //     <p className="px-5 text-white pb-4 space-y-10"><span className="mb-5">{item.comment}</span><br className="mt-10"></br><a onClick={() => {
                //     var xhttp = new XMLHttpRequest();
                //     xhttp.onreadystatechange = function () {
                //         if (this.status === 200 && this.readyState === 4) {
                //         window.alert("Thank you for reporting this challenge. Our moderation team will look into this.")
                //         }

                //         if (this.status != 200 && this.readyState === 4) {
                //         window.alert("Error reporting comment. Please try again later. ")
                //         }
                //     }
                //     xhttp.open("GET", `${process.env.REACT_APP_API_URL}/challenges/report?commentID=${item.id}&uid=${localStorage.getItem("token")}&challengeID=${window.location.href.split("/")[4]}`);
                //     xhttp.send();
                //     }} className="mt-4 text-red-600 hover:text-red-500  ">Report Comment</a></p>
                // </div>

                // ))

            }


            </div>  
        </div>
        {/* ***************************************** */}
        
        <hr className='max-w-4xl mx-auto mt-10 border-slate-800'></hr>
        
        <div className='max-w-6xl mx-auto text-left mt-6'>
            <h1 className='text-white text-3xl font-semibold'> 📦  Recently Created </h1>
            <div className="grid grid-cols-4 gap-4 gap-y-6 mt-4">
            <div className='card rounded-lg px-4 py-2 w-full border-l-4 border-green-500' style={{ backgroundColor: "#212121" }}>
            <h1 className='text-white text-2xl'>Scrambled Eggs</h1>
            <p className='text-white'>Decrypt my breakfast please</p>
            <div className='flex mt-2'>
            
            <p className='text-white px-2  rounded-lg bg-blue-900 text-sm'>decryption</p>
            <p className='ml-2 text-white px-2 rounded-lg bg-blue-900 text-sm'>cryptography</p>
            </div>
            
            
            
            </div>
            <div className='card rounded-lg px-4 py-2 w-full border-l-4 border-red-500' style={{ backgroundColor: "#212121" }}>
            <h1 className='text-white text-2xl'>Scrambled Eggs</h1>
            <p className='text-white'>Decrypt my breakfast please</p>
            <div className='flex mt-2'>
            
            <p className='text-white px-2  rounded-lg bg-blue-900 text-sm'>decryption</p>
            <p className='ml-2 text-white px-2 rounded-lg bg-blue-900 text-sm'>cryptography</p>
            </div>
            
            </div>
            <div className='card rounded-lg px-4 py-2 w-full border-l-4 border-yellow-500' style={{ backgroundColor: "#212121" }}>
            <h1 className='text-white text-2xl'>Scrambled Eggs</h1>
            <p className='text-white'>Decrypt my breakfast please</p>
            <div className='flex mt-2'>
            
            <p className='text-white px-2  rounded-lg bg-blue-900 text-sm'>decryption</p>
            <p className='ml-2 text-white px-2 rounded-lg bg-blue-900 text-sm'>cryptography</p>
            </div>
            </div>
            <div className='card rounded-lg px-4 py-2 w-full border-l-4 border-red-500' style={{ backgroundColor: "#212121" }}>
            <h1 className='text-white text-2xl'>Scrambled Eggs</h1>
            <p className='text-white'>Decrypt my breakfast please</p>
            <div className='flex mt-2'>
            
            <p className='text-white px-2  rounded-lg bg-blue-900 text-sm'>decryption</p>
            <p className='ml-2 text-white px-2 rounded-lg bg-blue-900 text-sm'>cryptography</p>
            </div>
            
            </div>
            <div className='card rounded-lg px-4 py-2 w-full border-l-4 border-yellow-500' style={{ backgroundColor: "#212121" }}>
            <h1 className='text-white text-2xl'>Scrambled Eggs</h1>
            <p className='text-white'>Decrypt my breakfast please</p>
            <div className='flex mt-2'>
            
            <p className='text-white px-2  rounded-lg bg-blue-900 text-sm'>decryption</p>
            <p className='ml-2 text-white px-2 rounded-lg bg-blue-900 text-sm'>cryptography</p>
            </div>
            </div>
            <div className='card rounded-lg px-4 py-2 w-full border-l-4 border-red-500' style={{ backgroundColor: "#212121" }}>
            <h1 className='text-white text-2xl'>Scrambled Eggs</h1>
            <p className='text-white'>Decrypt my breakfast please</p>
            <div className='flex mt-2'>
            
            <p className='text-white px-2  rounded-lg bg-blue-900 text-sm'>decryption</p>
            <p className='ml-2 text-white px-2 rounded-lg bg-blue-900 text-sm'>cryptography</p>
            </div>
            
            </div>
            <div className='card rounded-lg px-4 py-2 w-full border-l-4 border-yellow-500' style={{ backgroundColor: "#212121" }}>
            <h1 className='text-white text-2xl'>Scrambled Eggs</h1>
            <p className='text-white'>Decrypt my breakfast please</p>
            <div className='flex mt-2'>
            
            <p className='text-white px-2  rounded-lg bg-blue-900 text-sm'>decryption</p>
            <p className='ml-2 text-white px-2 rounded-lg bg-blue-900 text-sm'>cryptography</p>
            </div>
            </div>
            <div className='card rounded-lg px-4 py-2 w-full border-l-4 border-red-500' style={{ backgroundColor: "#212121" }}>
            <h1 className='text-white text-2xl'>Scrambled Eggs</h1>
            <p className='text-white'>Decrypt my breakfast please</p>
            <div className='flex mt-2'>
            
            <p className='text-white px-2  rounded-lg bg-blue-900 text-sm'>decryption</p>
            <p className='ml-2 text-white px-2 rounded-lg bg-blue-900 text-sm'>cryptography</p>
            </div>
            
            </div>
            <div className='card rounded-lg px-4 py-2 w-full border-l-4 border-yellow-500' style={{ backgroundColor: "#212121" }}>
            <h1 className='text-white text-2xl'>Scrambled Eggs</h1>
            <p className='text-white'>Decrypt my breakfast please</p>
            <div className='flex mt-2'>
            
            <p className='text-white px-2  rounded-lg bg-blue-900 text-sm'>decryption</p>
            <p className='ml-2 text-white px-2 rounded-lg bg-blue-900 text-sm'>cryptography</p>
            </div>
            </div>
            
            
            </div>
        </div>
        
        
        </main>
        
        </>
    )
}
    