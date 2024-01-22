import Head from 'next/head';
import { useState } from 'react'


const Education = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <>
            <Head>
                <title>CTFGuide AI for Education Waitlist</title>
                <meta
                    name="description"
                    content="CTFGuide AI for Education Waitlist"
                />
                <style>
                    @import
                    url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
                </style>
            </Head>

            <div className="bg-neutral-900 h-screen h-full">
                <div className="relative isolate pt-14">
                    <div
                        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                        aria-hidden="true"
                    >
                        <div
                            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-700 to-blue-9s00 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                            style={{
                                clipPath:
                                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                                backdropFilter: 'blur(3px)',
                                backgroundColor: 'rgba(0, 0, 255, 0.2)',
                            }}
                        />
                    </div>
                <div className="py-24 sm:py-32 lg:pb-40">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-3xl text-center">
                            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                                CTFGuide AI for Education
                            </h1>
                            <p className="mt-6 text-lg leading-8 text-gray-300">
                            A powerful LMS built for cybersecurity supercharged with AI.  Create custom lab environments for students to work on and have AI grade their work automatically.

                            </p>
                            <h1 className=' mt-10 italic text-xl  text-white'>Launching Feb 15th 2024</h1>

                            <div className="mt-4 flex items-center justify-center gap-x-6">

                                <a href="https://forms.gle/zhL8DdtQJir2nd2M9" className="text-sm font-semibold text-xl  border  px-5 py-1   rounded-full text-white">
                                    Join Waitlist <span aria-hidden="true">→</span>
                                </a>
                            </div>
                        </div>
         
                        <iframe width="800" height="460" src="https://www.youtube-nocookie.com/embed/m0I__kMTziU?si=fI-qPfCgP3LAPAZ0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; auto-play; " 
                            className="mx-auto text-center mt-16 rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10 sm:mt-24 "
                            allowfullscreen ></iframe>


                    </div>
                </div>
       
            </div>
        </div>
                </>
        );
};

export default Education;
