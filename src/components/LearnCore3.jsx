import { useState } from 'react'
import { MarkDone } from '@/components/learn/MarkDone'

export function LearnCore() {
    return (
        <div style={{}} className="h-full mx-auto overflow-hidden">
            <div className="px-4 py-4 pb-7 flex my-auto">

                <h1 className='my-auto text-xl flex mt-3 my-auto'>Cryptography Interactive Lab</h1>
                
                <div className='ml-auto my-auto mt-3 flex'>
                <MarkDone sublesson={12} section={1} href={"../"}/>
                <a href="../" className='my-auto ml-4 px-4 py-1 text-white bg-red-600 rounded-lg my-auto'>Exit Lab</a>
                 
                </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-0   max-h-screen h-screen  resize-x">
                <div id="1" style={{backgroundColor: "#212121"}} className=" px-4 py-4 h-100 resize-x">
                    <h1 className="text-2xl font-bold text-white">Using John the Ripper to Scan a Text File with Fake Insecure Passwords</h1>
                    <p className="text-white text-blue-500">@pranavramesh</p>

                    <h1 className='mt-4 text-xl text-white font-semibold'>Introduction </h1>
                    <p className='text-white'>
                    We created a text file containing fake insecure passwords. Now, we will use John the Ripper to scan this file and identify any vulnerabilities. John the Ripper is a password cracking tool that can be used for testing password strength and identifying weak passwords. It uses several methods for cracking passwords including dictionary attacks and brute-force attacks.</p>
                 

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
                <h1 className="text-2xl font-bold text-white">Using John the Ripper to Scan a Text File with Fake Insecure Passwords</h1>
                    <p className="text-white text-blue-500">@pranavramesh</p>

                    <h1 className='mt-4 text-xl text-white font-semibold'>Procedure </h1>
                    <p className='text-white'>

                        <ul>
                            <li>Open the terminal on your computer.</li>

                            <li>Navigate to the directory where the text file containing the fake insecure passwords is located.</li>
                       
                        </ul>
                    </p>

                    <br></br>Type the following command to open John the Ripper:
                    <div className='bg-black text-white p-4 mt-4' style={{fontFamily: "Arial"}}>
                        <p>undefined@ctfguide:~$ <span className='text-yellow-400'>john</span></p>


                    </div>

             
                    <br></br>To use John the Ripper to scan the text file, type the following command:


                    <div className='bg-black text-white p-4 mt-4' style={{fontFamily: "Arial"}}>
                        <p>undefined@ctfguide:~$ <span className='text-yellow-400'>john filename.txt
</span></p>




                    </div>

                    <br></br>Replace "filename.txt" with the name of the text file you want to scan.
                    <br></br><br></br> John the Ripper will start scanning the text file and attempting to crack the passwords. This process may take some time depending on the size of the file and the complexity of the passwords.
                    <br></br><br></br> Once John the Ripper has finished scanning the file, it will display a list of any passwords that it was able to crack.







              
                    <br></br><br></br>

                    Review the list of cracked passwords to identify any vulnerabilities in the password policy or user behavior. Take note of any passwords that were cracked and consider ways to improve password security.
                    <h1 className='mt-4 text-xl text-white font-semibold'>Conclusion </h1>
                    <p className='text-white'>
                    John the Ripper is a powerful tool for identifying weak passwords and vulnerabilities in password policies. By scanning a text file containing fake insecure passwords, we were able to use John the Ripper to identify any weaknesses in our password policy. This information can be used to improve password security and protect sensitive information.
                    </p>



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