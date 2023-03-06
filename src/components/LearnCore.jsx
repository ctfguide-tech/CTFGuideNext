import Link from 'next/link'

import { Container } from '@/components/Container'
import { Logo } from '@/components/Logo'
import { NavLink } from '@/components/NavLink'
import { useState } from 'react'

export function LearnCore() {

    const [navbarOpen, setNavbarOpen] = useState(false);


    return (
        <div style={{}} className="h-full mx-auto py-2 overflow-hidden">

            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-0  mt-2 h-100   resize-x">
                <div style={{backgroundColor: "#212121"}} className="px-4 py-4 h-100 resize-x">
                    <h1 className="text-2xl font-bold text-white">Using your terminal</h1>
                    <p className="text-white text-blue-500">@pranavramesh</p>

                    <h1 className='mt-4 text-xl text-white font-semibold'>Logging into your terminal.</h1>
                    <p className='text-white'>The black box to the right is your terminal. You can login to it using the following credentials:</p>
                    <div className='bg-black text-white p-4 mt-4' style={{fontFamily: "Arial"}}>
                        <p>ctfguide login: <span className='text-yellow-400'>e4</span></p>
                        <p>Password: <span className='text-yellow-400'>e4</span></p>
                    </div>


                    <h1 className='mt-4 text-xl text-white font-semibold'>Let's explore your terminal!</h1>
                    <p className='text-white'>You'll notice that there seems to be no user interface for this operating system. That's because you need to run commands to use this OS. Let's run a command to see what files are in our computer. </p>
                    <div className='bg-black text-white p-4 mt-4' style={{fontFamily: "Arial"}}>
                        <p>undefined@ctfguide:~$ <span className='text-yellow-400'>ls</span></p>
                    </div>



 

                </div>
                <div className='h-screen bg-black overflow-hidden resize-x'>
                <div className='text-white bg-black text-sm flex'>
                    <p className='px-2 py-1'><span className='text-green-400'>◉</span> Connected to terminal.ctfguide.com</p>
                    <div className='ml-auto px-2 py-1 flex'>
                        <p>No time limit!</p>
                    </div>
                    </div>
                <iframe id="terminal" className="w-full" height="500" src="https://terminal.ctfguide.com/wetty/ssh/root?"></iframe>
              
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