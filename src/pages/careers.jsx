import Head from 'next/head';

import {Footer} from '@/components/Footer';
import {useEffect} from 'react';
import {Header} from '@/components/Header';
import PersonCard from '@/components/PersonCard';

export default function Careers() {
    /*
          Code to check if onboarding has been complete
        */

    {
        /* Each person will be an object in an array team */
    }
    const team = [
        {
            personName: 'Pranav Ramesh',
            position: 'Founder, CEO',
            image: '../pranavCTF.jpeg',
            width: '200',
            height: '200',
            bio: "Pranav comes from a competitive cyber background, winning respected CTF's like UD's Bluehen CTF. Pranav has advocated for widespread cybersecurity education in highschools and universities; he started the first cyber student org in Garnet Valley."
        },
        {
            personName: 'Abhi Byreddy',
            position: 'Co-Founder',
            image: '../mish.jpg',
            width: '200',
            height: '200',
            bio: "Abhi is an engineer that comes from an architectural background that focuses on cloud infrastructure and systems. He seeks to lead the CTFGuide team towards their goals with his experience in the stack and in management. He currently studies Computer Science at Penn State.\n"
        },
        {
            personName: 'Jiaming Wang',
            position: 'CTO',
            image: '../mish.jpg',
            width: '200',
            height: '200',
            bio: "From leading a robotics team to participating in reverse engineering challenges, Jiaming has picked up a diverse set of skills to bring to CTFGuide. Currently studying electrical engineering and computer science, he is always up for new experiences."
        },
        {
            personName: 'Srihari Raman',
            position: 'CFO',
            image: '../srihari.jpg',
            width: '200',
            height: '200',
            bio: "Srihari is a data-oriented business leader that joined the CTF team in early 2022. With his experience in data analysis, machine learning, and management, Srihari has supported the CTF team in making key marketing and financial decisions. He is currently a Data Science and Business Administration combined major at Northeastern University."
        },

        {
            personName: 'Mish Adelanwa',
            position: 'Advisor',
            image: '../mish.jpg',
            width: '200',
            height: '200',
            bio: "Mishael Adelanwa, a current Bunton-Waller fellow at Penn State University and an innovative investor with an eye for emerging technologies, invested in CTFGuide in a Pre Seed Round in January 2023. Adept at identifying and supporting promising ventures, Mishael brings expertise and curiosity to the world of blockchain technology and cybersecurity."
        },


        {
            personName: 'Kshitij Kochhar',
            position: 'Software Engineer',
            image: '../kkochhar.jpg',
            width: '200',
            height: '200',
            bio: "Kshitij is a current Computer Science student at the University of Maryland who specializes in full-stack development. Outside of coding he enjoys going to the Gym, playing Tennis, and hanging out with friends."
        },

        {
            personName: 'Almond Milk',
            position: 'Content',
            image: '../mish.jpg',
            width: '200',
            height: '200',
            bio: "Almond Force is a team dedicated to providing the cyber security and IT community with training on different platforms and events such as CTFs, Hack the Box, TryHackMe, and more! The team's founder is Almond Milk, and we strive to grow enough to where we can release content as our full-time career."
        },
        {
            personName: 'Brody Pearlman',
            position: 'Business',
            image: '../mish.jpg',
            width: '200',
            height: '200',
        },
        {
            personName: 'Jackson Ferris',
            position: 'Cybersecurity',
            image: '../mish.jpg',
            width: '200',
            height: '200',
        },
    ];

    const listings = [
        {
            team: 'Web Team',
            position: 'Full-Time',
            roleName: 'UI/UX Team Lead',
            listingPosted: 'Feb 8th',
            type: 'Remote',
        },
        {
            team: 'Engineering Back-End',
            position: 'Full-Time',
            roleName: 'Data Analyst/Engineer',
            listingPosted: 'Feb 11th',
            type: 'Remote',
        },
    ];

    // useEffect(() => {
    //   try {
    //    // fetch('api.ctfguide.com/dashboard')
    //
    //    fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard`)
    //
    //    .then((res) => res.json())
    //
    //       .then((data) => {
    //         if (data.onboardingComplete === false) {
    //         }
    //       });
    //   } catch (error) {}
    // });

    return (
        <>
            <Head>
                <title>Careers - CTFGuide</title>
                <meta
                    name="description"
                    content="Cybersecurity made easy for everyone"
                />
                <style>
                    @import
                    url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
                </style>
            </Head>

            <Header/>
            <main>
                <div className="mx-auto mt-20 mb-20 w-full max-w-6xl text-center">
                    <p className="mt-2 text-4xl font-bold text-white sm:text-4xl">
                        Meet the team behind{' '}
                        <span className="mt-2 text-4xl font-bold tracking-tight text-blue-500 sm:text-4xl">
              CTFGuide
            </span>
                    </p>
                    <p className="mt-2 text-2xl font-bold  text-white ">
                        We're dedicated to providing a space where students can learn,
                        teachers can teach, and professionals can compete in the
                        ever-emerging field of Cybersecurity
                    </p>
                </div>

                {/*
         sm is for "smaller" devices
         */}
                <div
                    className="mb-12 mx-auto grid max-w-7xl grid-cols-1 gap-4 text-center md:grid-cols-3 lg:grid-cols-3">
                    {team.map((person) => {
                        return (
                            <PersonCard person={person}/>
                        );
                    })}
                </div>

                <div
                    className="overflow-hidden py-24 sm:py-32"
                    style={{backgroundColor: '#212121'}}
                >
                    <div>
                        <p className="text-center text-3xl font-bold text-white sm:text-4xl">
                            Looking for a Job?
                        </p>
                    </div>

                    <div id="listings" className="mx-auto mt-4 max-w-6xl">
                        {listings.map((job) => {
                            return (
                                <div
                                    className="card my-auto rounded-lg text-white "
                                    style={{backgroundColor: '#161716'}}
                                >
                                    <div className="my-auto mx-auto mt-6 grid px-6 py-5">
                                        <div>
                                            <h1 className=" text-xl">{job.team}</h1>
                                            <h1 className="text-3xl font-semibold">{job.roleName}</h1>
                                            <p>Remote - Full Time</p>
                                        </div>

                                        <div className="ml-auto">
                                            <a
                                                href="https://ctfguide.freshteam.com/jobs"
                                                className=" text-md justify-center rounded-full border border-transparent bg-blue-700 py-1 px-4 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                            >
                                                Apply
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/*
          <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
            Email
          </label>
          <div className="mt-1">
            <input
              style={{ backgroundColor: "#161716", borderWidth: "0px" }}
              id="email"
              name="email"
              type="text"
              autoComplete="email"
              required
              className="text-white block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            />
          </div>

        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
            First Name
          </label>
          <div className="mt-1">
            <input
              style={{ backgroundColor: "#161716", borderWidth: "0px" }}
              id="FirstName"
              name="FirstName"
              type="text"
              autoComplete="FirstName"
              required
              className="text-white block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
            Last Name
          </label>
          <div className="mt-1">
            <input
              style={{ backgroundColor: "#161716", borderWidth: "0px" }}
              id="LastName"
              name="LastName"
              type="text"
              autoComplete="LastName"
              required
              className="text-white block w-full appearance-none rounded-md border border-gray-300 px-3 py- placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>

      </div>

      <div id="entity2">
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl py-3">Tell us about yourself!</h1>
        <textarea className='w-full h-full rounded-md px-4 py-3 text-white' style={{ backgroundColor: "#161716", borderWidth: "0px" }}></textarea>

      </div>


    </div>
    */}
                </div>
            </main>

            <Footer/>
        </>
    );
    {
        /* End of return */
    }
}
