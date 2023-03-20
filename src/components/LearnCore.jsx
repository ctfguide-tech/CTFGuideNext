import Link from 'next/link'

import { Container } from '@/components/Container'
import { Logo } from '@/components/Logo'
import { NavLink } from '@/components/NavLink'
import { useState } from 'react'
import { MarkDone } from '@/components/learn/MarkDone'

export function LearnCore() {

    const [navbarOpen, setNavbarOpen] = useState(false);


    return (
        <div style={{}} className="h-full mx-auto overflow-hidden">
            <div className="px-4 py-4 pb-7 flex my-auto">

                <h1 className='my-auto text-xl flex mt-3 my-auto'>Linux Basics Interactive Lab</h1>
                
                <div className='ml-auto my-auto mt-3 flex'>
                <MarkDone sublesson={4} section={1} href={"../"}/>
                <a href="../" className='my-auto ml-4 px-4 py-1 text-white bg-red-600 rounded-lg my-auto'>Exit Lab</a>
                 
                </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-0   max-h-screen h-screen  resize-x">
                <div id="1" style={{backgroundColor: "#212121"}} className=" px-4 py-4 h-100 resize-x">
                    <h1 className="text-2xl font-bold text-white">Using your terminal</h1>
                    <p className="text-white text-blue-500">@pranavramesh</p>

                    <h1 className='mt-4 text-xl text-white font-semibold'>Logging into your terminal.</h1>
                    <p className='text-white'>The black box to the right is your terminal. You can login to it using the following credentials:</p>
                    <div className='bg-black text-white p-4 mt-4' style={{fontFamily: "Arial"}}>
                        <p>ctfguide login: <span className='text-yellow-400'>username</span></p>
                        <p>Password: <span className='text-yellow-400'>oldPassword</span></p>
                    </div>


                    <h1 className='mt-4 text-xl text-white font-semibold'>Let's explore your terminal!</h1>
                    <p className='text-white'>You'll notice that there seems to be no user interface for this operating system. That's because you need to run commands to use this OS. Let's run a command to see what files are in our computer. </p>
                    <div className='bg-black text-white p-4 mt-4' style={{fontFamily: "Arial"}}>
                        <p>undefined@ctfguide:~$ <span className='text-yellow-400'>ls</span></p>
                    </div>

                    <p className='text-white mt-4'>Looks like there's nothing in this directory! Let's make a folder. </p>
                    <div className='bg-black text-white p-4 mt-4' style={{fontFamily: "Arial"}}>
                        <p>undefined@ctfguide:~$ <span className='text-yellow-400'>mkdir chapter1</span></p>
                    </div>

                    <div className='fixed bottom-0 left-0 right-0 mb-5'>
                    <div className='mt-4 flex'>
                        <div className='flex mx-auto text-center  bg-neutral-900  grid grid-cols-2 rounded-lg'>
                        <div className='hover:bg-neutral-700 rounded-l-lg py-4 px-10 w-full'>
                        <a  className='text-white ∂'><i class="fas fa-chevron-left"></i></a>
                            </div>
                            <div  onClick={() => { document.getElementById('2').classList.remove('hidden');document.getElementById('1').classList.add('hidden')}} className='hover:bg-neutral-700 rounded-r-lg  py-4 px-10 w-full'>
                        <p  className='text-white ml-4'><i class="fas fa-chevron-right"></i></p>
                        </div>
                        </div>
                    </div>
                    </div>


 

                </div>

                <div id="2" style={{backgroundColor: "#212121"}} className="overflow-y-auto max-h-screen h-screen hidden px-4 py-4  ">
                    <h1 className="text-2xl font-bold text-white">Using your terminal</h1>
                    <p className="text-white text-blue-500">@pranavramesh</p>

                    <h1 className='mt-4 text-xl text-white font-semibold'>Let's explore your terminal! (Continued)</h1>
                    <p className='text-white'>Nice, you've made a folder. Let's run the ls command to see if it shows up now.</p>
                    <div className='bg-black text-white p-4 mt-4' style={{fontFamily: "Arial"}}>
                        <p>undefined@ctfguide:~$ <span className='text-yellow-400'>ls</span></p>
                    </div>

                    <p className='text-white mt-4'>Let's navigate into that folder now!</p>
                    <div className='bg-black text-white p-4 mt-2' style={{fontFamily: "Arial"}}>
                        <p>undefined@ctfguide:~$ <span className='text-yellow-400'>cd chapter1</span></p>
                    </div>

                    <p className='text-white mt-4'>Cool, we're now in the <span className='text-white text-sm bg-black rounded-lg px-2'>/chapter1</span> folder. Let's create a file now!</p>
    

                    <h1 className='text-white text-xl font-semibold mt-4'>Creating files</h1>

                    <p className='text-white mt-1'>To create a file, we use the <span className='text-white text-sm bg-black rounded-lg px-2'>touch</span> command. But this command will only create a blank file with the name that you supply in the parameter.</p>

                    <p className='text-white mt-4'>However, lets say you want to make a text file. How would you go about doing so? Well, lucky for you there's a pretty handy tool called <span className='text-purple-500'>Nano</span>.</p>

                    <div class="bg-neutral-900 rounded-lg px-4 py-4 mt-4 flex">
                        <div className='bg-white rounded-full px-3 py-3'>
                        <img width={100} className="" src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Gnu-nano.svg/1200px-Gnu-nano.svg.png"></img>
                        </div>
                        <div className='ml-4 mt-1'>
                       <h1 className='text-2xl  text-purple-500'>GNU Nano</h1>
                       <p>
                       GNU nano is a text editor for Unix-like operating systems, such as Linux. It is designed to be easy to use and user-friendly, especially for beginners.
                       </p>
                       </div>
                    </div>

                    <p className='text-white mt-4'>Lets create a text file called NanoFun.txt</p>
                    <div className='bg-black text-white p-4 mt-2' style={{fontFamily: "Arial"}}>
                        <p>undefined@ctfguide:~$ <span className='text-yellow-400'>nano NanoFun.txt</span></p>
                    </div>

                    <p className='text-white mt-4'>This should replace your window with the Nano editor. Your friend, Ray, asks you to write his journal entry for him as he broke his arms.</p>

                    <div className='bg-black text-white pb-10 mt-2' style={{fontFamily: "Arial"}}>
                        <p className='bg-white text-black grid grid-cols-3'>
                          <span className='col-span-1 px-2'>   GNU nano 5.4  </span><span className='ml-20 text-center'>New Buffer</span>
                        </p>
                     
                        
                        <span className='text-yellow-400'>I love Linux so much that I replaced my mom's operating system with it. She is now very mad at me. :(</span>
                    </div>

                    <p className='text-white mt-4'>To save the file, press <span className='text-white text-sm bg-black rounded-lg px-2'>Ctrl + X</span> and then press <span className='text-white text-sm bg-black rounded-lg px-2'>Y</span> to confirm the save.</p>

                    <p className='text-white mt-4'>You can view a the file by running the command <span className='text-white text-sm bg-black rounded-lg px-2'>cat /NanoFun.txt</span>.</p>

                    {/* boottom footer */}

                    <div className='fixed bottom-0 left-0 right-0 mb-5'>
                    <div className='mt-4 flex'>
                        <div className='flex mx-auto text-center  bg-neutral-900  grid grid-cols-2 rounded-lg'>
                        <div className='hover:bg-neutral-700 rounded-l-lg py-4 px-10 w-full h-full' onClick={() => { document.getElementById('1').classList.remove('hidden');document.getElementById('2').classList.add('hidden')}}>
                        <a  className='text-white ∂'><i class="fas fa-chevron-left"></i></a>
                            </div>
                            <div className='hover:bg-neutral-700 rounded-r-lg  py-4 px-10 w-full' onClick={() => { document.getElementById('3').classList.remove('hidden');document.getElementById('2').classList.add('hidden')}}>
                        <p  className='text-white ml-4'><i class="fas fa-chevron-right"></i></p>
                        </div>
                        </div>
                    </div>
                    </div>



 

                </div>

                <div id="3" style={{backgroundColor: "#212121"}} className=" hidden px-4 py-4 h-100 resize-x">
                    <h1 className='text-white text-6xl font-semibold mt-4 mx-auto text-center mt-20'>Nice work.</h1>
                    <h1 className='text-white text-xl font-semibold mt-4 mx-auto text-center '>You've finished this lesson.</h1>
<div>
    </div>

 

                </div>
                <div className='max-h-screen bg-black overflow-hidden resize-x'>
                <div className='text-white bg-black text-sm flex'>
                    <p className='px-2 py-1'><span className='text-green-400'>◉</span> Connected to terminal.ctfguide.com</p>
                    <div className='ml-auto px-2 py-1 flex'>
                        <p>No time limit!</p>
                    </div>
                    </div>
                <iframe id="terminal" className="w-full px-2" height="500" src="https://terminal.ctfguide.com/wetty/ssh/root?"></iframe>
              
                </div>
                
                <div style={{backgroundColor: "#212121"}} className="px-4 py-4 hidden">
                    <h1 className="text-2xl font-bold text-white">Developer Tools</h1>
                 
          
                    <p className='text-white'>Terminal Keylogger</p>
                    <textarea id="logger" className='w-full bg-black mt-4 text-blue-500'>
                            ctfguide login:
                    </textarea>

                    <p className='text-white'>External Testing Client</p>
                    <textarea id="logger" className='w-full bg-black mt-4 text-blue-500'>
                            ctfguide login:
                    </textarea>
                    
                
                </div>



                </div>

            
        </div>
    )

}