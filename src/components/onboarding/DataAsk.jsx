import { Container } from '@/components/Container'
import { useEffect } from 'react';
import { useRouter } from 'next/router'

export function DataAsk({ props }) {
    const router = useRouter()

    useEffect(() => {
        if (router.query.part == "1") {
        if (router.query.error) {
            document.getElementById("error").classList.remove("hidden");
            document.getElementById("error").innerHTML = router.query.error;
        }
        }
    });

    function submitData() {
        // Generate JSON to send

        var username = document.getElementById("username").value;
        var birthday = document.getElementById("birthday").value;
        var firstname = document.getElementById("fullname").value.split(" ")[0];
        var lastname = document.getElementById("fullname").value.split(" ")[1];
        
        const parts = birthday.split("-");
        const newDateStr = `${parts[1]}-${parts[2]}-${parts[0]}`;
        localStorage.setItem("username", document.getElementById("username").value);
        localStorage.setItem("birthday", newDateStr);
        localStorage.setItem("firstname", document.getElementById("fullname").value.split(" ")[0]);
        localStorage.setItem("lastname", document.getElementById("fullname").value.split(" ")[1]);


        if (!username || !birthday || !firstname || !lastname) {
            return window.alert("Please fill out all fields.");
        } else { 
            window.location.replace("./onboarding?part=2");
        }

        //window.location.replace("./onboarding?part=2");
    }

 

    return (
        <>


            <div className='flex justify-center items-center h-screen'>
                <Container style={{ backgroundColor: "#161716" }} className=" ">

                     <img src="../onboarding.png" width={60} className="mx-auto"></img>
                    <h1 className='text-white text-2xl mt-2 text-center font-semibold'>Onboarding</h1>
                    <hr style={{borderColor: "#212121"}} className='mt-4 ml-6 mr-6'></hr>

                    <div style={{ backgroundColor: "#161716" }} className='max-w-6xl mt-4 mx-auto'>

                        <div className="my-auto mx-auto px-4 ">
                    
                            <h1 className='text-white text-xl '> You seem new around here, tell us about yourself. </h1>
                           
                            <div id="error" className='hidden bg-red-900 mt-2 mb-2 text-white text-center rounded-lg px-2 py-1'>
                              Error - Something went wrong.
                            </div>
                            <div className=' mt-4'>
                                <div className="isolate -space-y-px rounded-md shadow-sm">
                                    <div style={{borderColor: "#212121"}}  className="relative rounded-md rounded-b-none border  px-3 py-2 focus-within:z-10 focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                                        <label htmlFor="name" className="block text-xs font-medium text-white">
                                            Username
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            id="username"
                                            style={{backgroundColor: "#212121"}}
                                            className="mt-2 py-1 rounded block w-full border-0 p-0 text-white placeholder-gray-500  focus:ring-0 sm:text-sm px-4"
                                            placeholder="This is what people on CTFGuide will know you as."
                                        />
                                    </div>
                                    <div style={{borderColor: "#212121"}}  className="relative rounded-md rounded-t-none rounded-b-none border  px-3 py-2 focus-within:z-10 focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                                        <label htmlFor="name" className="block text-xs font-medium text-white">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            id="fullname"
                                            style={{backgroundColor: "#212121"}}
                                            className="mt-2 py-1 rounded block w-full border-0 p-0 text-white placeholder-gray-500  focus:ring-0 sm:text-sm px-4"
                                            placeholder="This is private to the public by default."
                                        />
                                    </div>
                                
                                    <div style={{borderColor: "#212121"}}  className="relative rounded-md rounded-t-none border px-3 py-2 focus-within:z-10 focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                                        <label htmlFor="job-title" className="block text-xs font-medium text-white">
                                            Birthday
                                        </label>
                                
                                        <input id="birthday" type="date" style={{backgroundColor: "#212121"}} className="mt-2 py-1 rounded block w-full border-0 p-0 text-white placeholder-gray-500 focus:ring-0 sm:text-sm px-4"></input>
                                     
                                    </div>
                                </div>

                            <div className='mx-auto text-center mx-auto'>
                                <button onClick={submitData} className='button mt-8 w-2/3 mx-auto bg-blue-800 hover:bg-blue-900 text-white py-2 rounded'>Next Step</button>
                                </div>
                            </div>

                        


                        </div>
                    </div>









                </Container>
            </div>
        </>
    )
}
