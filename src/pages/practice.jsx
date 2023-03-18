import Head from 'next/head'
import Link from 'next/link'
import { Button } from '@/components/Button'
import { TextField } from '@/components/Fields'
import { Logo } from '@/components/Logo'
import { Alert } from '@/components/Alert'
import { Container } from '@/components/Container'
import { StandardNav } from '@/components/StandardNav'
import { Footer } from '@/components/Footer'
import { PracticeNav } from '@/components/practice/PracticeNav'
import { Community } from '@/components/practice/community'
import { useState, useEffect } from 'react'
import { LearningModule } from '@/components/learn/LearningModule'
export default function Pratice() {
    function loadChallenges() {
        fetch('https://api.ctfguide.com/challenges/type/all')
            .then(response => response.json())
            .then(data => {
                for ( var i = 0; i < data.length; i++ ) {
                var difficultyColor = "border-green-500";
                
                if (data[i].difficulty == "easy") {
                    difficultyColor = "border-green-500";
                } else if (data[i].difficulty == "medium") {
                    difficultyColor = "border-yellow-500";
                } else if (data[i].difficulty == "hard") {
                    difficultyColor = "border-red-500";
                }

                document.getElementById("starter").insertAdjacentHTML('afterend', `<div class='card rounded-lg px-4 py-2 w-full border-l-4 ${difficultyColor}' style='background-color: #212121'>
                <h1 class='text-white text-2xl'>${data[i].title}</h1>
                <p class='text-white truncate'>${data[i].problem.substring(0, 40)}</p>
                <div class='flex mt-2'>

                    <p class='text-white px-2  rounded-lg bg-blue-900 text-sm'>${data[i].category}</p>
                </div>
            </div>`)
                }
            })
            .catch(error => {
                console.log(error)
        });
    }
    loadChallenges();
    const [streak, setStreak] = useState("");
    const [rank, setRank] = useState("");
    const [points, setPoints] = useState("")
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
                    setStreak(data.streak)
                    setRank(data.leaderboardNum + 1)
                    setPoints(data.points)
                })
                .catch((err) => {
                    console.log(err);
                });

                // fetch user challenge data
           
    const fetchData = async () => {
        const response = await fetch(`${localStorage.getItem("userChallengesUrl")}`);
        const data = await response.json();
        console.log(data)

        const response2 = await fetch(`https://PastNaturalLine.laphatize.repl.co?data=${JSON.stringify(data)}`);
        const data2 = await response2.text();
        document.getElementById("insight").innerHTML = "Heads up! If you haven't solved a challenge - this response will be incorrect. " + data2;
       
        
      };
      fetchData();

    
    }, []);

    return (
        <>
            <Head>
                <title>Practice - CTFGuide</title>
                <meta
                    name="description"
                    content="Practice Problems"
                />
                <style>
                    @import url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
                </style>
            </Head>
            <StandardNav />
            <main>
                <div className=" w-full " style={{ backgroundColor: "#212121" }}>
                    <div className="flex mx-auto text-center h-28 my-auto">
                        <h1 className='text-4xl text-white mx-auto my-auto font-semibold'>Hub</h1>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row">
                    <div className="w-full md:w-1/5 flex md:h-screen max-w-7xl md:mx-auto md:justify-center px-8 md:px-16">
                        <PracticeNav />
                    </div>


                    <div className='w-full md:w-4/5 px-8 xl:px-16 border-l border-neutral-800'>
                
                  
                    <div className='mx-auto'>
                    <h1 className="text-2xl text-white tracking-tight mt-10 " style={{ color: "#595959" }}> YOUR PERFORMANCE</h1>
                    <div className='mx-auto text-center grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 mb-4 mt-2  gap-4 rounded-lg'>
                        <div style={{ backgroundColor: "#212121", borderColor: "#3b3a3a" }} className=' px-4 py-2 mx-auto w-full stext-center text-white rounded-lg  '>

                            <h1 className='text-3xl text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-blue-900'>{streak} days</h1>
                            <h1 className='text-xl'>Streak</h1>
                        </div>

                        <div style={{ backgroundColor: "#212121", borderColor: "#3b3a3a" }} className=' hidden px-4 py-2 mx-auto w-full text-center text-white rounded-lg '>
                            <h1 className='text-3xl text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-yellow-900'>{rank}</h1>
                            <h1 className='text-xl '>Rank</h1>
                        </div>

                        <div style={{ backgroundColor: "#212121", borderColor: "#3b3a3a" }} className=' px-4 py-2 mx-auto w-full text-center text-white rounded-lg '>
                            <h1 className='text-3xl text-transparent bg-clip-text bg-gradient-to-br from-red-400 to-blue-900'>{points}</h1>

                            <h1 className='text-xl'>Points</h1>
                        </div>
                    </div>

                    <h1 className="text-2xl text-white tracking-tight mt-10 " style={{ color: "#595959" }}> GUIDES</h1>

                    <div className="grid grid-cols-3 gap-x-5 mt-4 ">
                        <a href="../guides/createctf" className='cursor-pointer text-white bg-neutral-700 hover:bg-neutral-800 font-semibold rounded-lg px-3 py-2 w-full  backdrop-blur-lg py-4'  >
                           
                            <h1 className='text-2xl text-neutral-100 flex'>Creating CTF's  <i className="fas fa-book ml-auto"></i></h1>
                            <p className='text-neutral-300 text-sm'>Not all CTF's are made the same. Let's take a look at what makes a good CTF.</p>
                        </a>

                        <a href="../guides/createctf"  className='cursor-pointer text-white bg-neutral-700 hover:bg-neutral-800 font-semibold rounded-lg px-3 py-2 w-full  backdrop-blur-lg py-4'  >
                           
                           <h1 className='text-2xl text-neutral-100 flex'>Solving CTF's  <i className="fas fa-book ml-auto"></i></h1>
                           <p className='text-neutral-300 text-sm'>Never solved a CTF before? We've made a basic how-to guide just for you.</p>
                       </a>

                       <a href="../guides/createctf"  className='cursor-pointer text-white bg-neutral-700 hover:bg-neutral-800 font-semibold rounded-lg px-3 py-2 w-full  backdrop-blur-lg py-4'  >
                           
                           <h1 className='text-2xl text-neutral-100 flex'>Solving CTF's  <i className="fas fa-book ml-auto"></i></h1>
                           <p className='text-neutral-300 text-sm'>Never solved a CTF before? We've made a basic how-to guide just for you.</p>
                       </a>
                      
                    </div>


                    <h1 className="text-2xl text-white tracking-tight mt-10 truncate" style={{ color: "#595959" }}> INSIGHTS</h1>
                   
                   <div>
                    <p className='mt-1 text-white text-xl text-neutral-400' id="insight"><i class="fas fa-spinner fa-spin mr-2"></i>
 Generating insights, this can take up to 10 seconds.</p>
                   </div>
                   <h1 className="text-2xl text-white tracking-tight mt-10 " style={{ color: "#595959" }}> SUGGESTED LESSONS</h1>
                    <div className='mt-2 text-center grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-3 mb-4 mt-2  gap-4 rounded-lg'>
                    <LearningModule lessonId={1} title={"Linux Basics"} sections={["What is Linux?", "Command Basics", "Mastery Task", "Logging into a Server"]} imgSrc={"https://camo.githubusercontent.com/81045db2ee0ac7dc57a361737aec02c91af299e8122a4b92748b2acb0b0a89d0/687474703a2f2f6a61736f6e6c6f6e672e6769746875622e696f2f67656f5f7061747465726e2f6578616d706c65732f6469616d6f6e64732e706e67"} link={"../learn/ch1/preview"} sectionHrefs={["../learn/ch1/preview", "../learn/ch1/video1", "../learn/ch1/activity1", "../learn/ch1/dynamic1"]}/>
                        <LearningModule lessonId={2} title={"Forensics"} sections={["What is Forensics?", "Cyberchef 101", "Mastery Task", "I spy with my little eyes..."]} imgSrc={"https://camo.githubusercontent.com/f38cb60cf74f6e673504cbde590a1481018dd3bcb83d4307b3f20bb2a4a992f7/687474703a2f2f6a61736f6e6c6f6e672e6769746875622e696f2f67656f5f7061747465726e2f6578616d706c65732f636f6e63656e747269635f636972636c65732e706e67"} link={"../learn/ch2/preview"} sectionHrefs={["../learn/ch1/preview", "../learn/ch1/video1", "../learn/ch1/activity1", "../learn/ch1/dynamic1"]}/>
                        <LearningModule lessonId={3} title={"Cryptography"} sections={["What is Cryptography?", "PKI Introduction", "Knees deep into TLS", "Password Dump"]} imgSrc={"https://camo.githubusercontent.com/2885763d225b252ff5409416061b0fd287b206fed23a6f96fb7bd5e315782579/687474703a2f2f6a61736f6e6c6f6e672e6769746875622e696f2f67656f5f7061747465726e2f6578616d706c65732f63686576726f6e732e706e67"} link={"../learn/ch3/preview"} sectionHrefs={["../learn/ch1/preview", "../learn/ch1/video1", "../learn/ch1/activity1", "../learn/ch1/dynamic1"]}/>     

                        </div>
                </div>

                    </div>

                    

                   
                </div>
            </main>
            <Footer />
        </>
    )
}
