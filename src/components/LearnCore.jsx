import Link from 'next/link'

import { Container } from '@/components/Container'
import { Logo } from '@/components/Logo'
import { NavLink } from '@/components/NavLink'

export function LearnCore() {

    
    return (
        <div className="max-w-6xl mt-12 h-100 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-4">
                <div>
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
                <div>
                <iframe className="w-full" height="500" src="https://terminal.ctfguide.com/wetty/ssh/root?"></iframe>
                 <div className='text-white bg-black text-sm flex'>
                    <p className='px-2 py-1'><span className='text-green-400'>◉</span> Connected to sandbox.ctfguide.com</p>
                    <div className='ml-auto px-2 py-1'>
                        <button className='bg-gray-900 px-3 hover:bg-gray-800'> Invite to terminal</button>
                    </div>
                    </div>
                </div>
                </div>
            
        </div>
    )

}