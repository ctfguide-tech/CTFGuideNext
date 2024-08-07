import Head from 'next/head';

import { Footer } from '@/components/Footer';
import { useEffect } from 'react';
import { Header } from '@/components/Header';
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


  ];

  const listings = [
    {
      team: 'Executive Team',
      position: 'Full-Time',
      roleName: 'Chief Financial Officer',
      listingPosted: 'Feb 8th',
      type: 'Remote',
    },
    {
      team: 'Frontend Team',
      position: 'Part-Time',
      roleName: 'Project Manager',
      listingPosted: 'Feb 8th',
      type: 'Remote',
    },
    {
      team: 'Frontend Team',
      position: 'Full-Time',
      roleName: 'Frontend Developer',
      listingPosted: 'Feb 11th',
      type: 'Remote',
    },
    {
      team: 'Backend Team',
      position: 'Full-Time',
      roleName: 'Backend Developer',
      listingPosted: 'Feb 11th',
      type: 'Remote',
    },
  ];

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

      <Header />
      <main>
        <div className="bg-cover bg-center" style={{ backgroundImage: "url('https://formlabs-media.formlabs.com/filer_public_thumbnails/filer_public/67/16/67160d62-3040-4c77-9eca-a0be6bfa919a/pennstate_render_exterior.jpg__1354x0_q85_subsampling-2.jpg')" }}>
          <div className="py-20 w-full text-left bg-black bg-opacity-70">
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
              <p className="text-4xl font-bold text-white sm:text-4xl">
                careers@
                <span className="mt-2 text-4xl text-blue-600 font-bold tracking-tight sm:text-4xl">
                  CTFGuide
                </span>
              </p>
              <p className="mt-1 text-xl text-white">
                Join the company that's building the modern cybersecurity upskilling platform.
              </p>
            </div>
          </div>
        </div>

      <div  className='max-w-7xl w-full  sm:px-2 px-4 mx-auto text-white mt-10 grid sm:grid-cols-6  grid-cols-1 sm:gap-x-8 gap-0'>
      
         
     
         <div className='col-span-4 '>
        <h1 className='text-2xl font-bold text-blue-500'>Working with us</h1>
        <p className=' mt-4'>
        We're all about open, collaborative, and inclusive culture. We believe in learning from each other and the power of community.
<br></br><br></br>
Our team? Learners, not know-it-alls. We're after people who want to grow, not those who think they've got it all figured out.
<br></br><br></br>
We're remote-friendly, but a lot of us are in State College, PA. Work where you work best - remote, in-office, or a mix of both.

</p>

<h1 className='text-2xl font-bold mt-10 text-blue-500'>Backed by the best</h1>
<p className='mt-4'> CTFGuide is funded by the best of the best. We're backed by investors like Penn State University and Bullmont Capital.</p>

        <h1 className='mt-10 text-2xl font-bold text-blue-500'>Open Positions</h1>
        <p className='text-sm'>
          Applications require you to login with your Google account. You can also email your resume to staff@ctfguide.com.
        </p>
         <div className='mt-4 bg-neutral-800 p-4  flex justify-between items-center'>
          <div className='flex flex-col'>
          <h1 className='text-xl font-bold'>Frontend SWE</h1> 
          <p className='text-sm'>Remote</p>
          </div>

          <div className='ml-auto'>
          <a href="https://forms.gle/AQrnizsKoyoG6Y1T7" className='bg-blue-700 hover:bg-blue-600 duration-100 px-4 py-2 rounded-md '>Apply</a>
          </div>
         </div>

         <div className='mt-2 bg-neutral-800 p-4  flex justify-between items-center'>
          <div className='flex flex-col'>
          <h1 className='text-xl font-bold'>Content Writer</h1> 
          <p className='text-sm'>Remote</p>
          </div>

          <div className='ml-auto'>
          <a href="https://forms.gle/AQrnizsKoyoG6Y1T7" className='bg-blue-700 hover:bg-blue-600 duration-100 px-4 py-2 rounded-md '>Apply</a>
          </div>
         </div>

         <div className='mt-2 bg-neutral-800 p-4  flex justify-between items-center'>
          <div className='flex flex-col'>
          <h1 className='text-xl font-bold'>Infrastructure Engineer</h1> 
          <p className='text-sm'>Remote</p>
          </div>

          <div className='ml-auto'>
          <a href="https://forms.gle/AQrnizsKoyoG6Y1T7" className='bg-blue-700 hover:bg-blue-600 duration-100 px-4 py-2 rounded-md '>Apply</a>
          </div>
         </div>
        </div>

        <div className='col-span-2 w-full mt-10 sm:mt-0 sm:px-2 px-1 '>
          <p className='text-2xl font-bold text-blue-500'>Our Team</p>
          <div className='mt-4 flex flex-col gap-1 w-full text-lg  '>
          <div className='w-full bg-neutral-800 py-4 px-4 flex'>
            <p>Pranav Ramesh</p>
            <p className='text-white bg-blue-700 px-4  rounded-md ml-auto'>Founder, CEO</p>
            </div>
          <div className='w-full bg-neutral-800 py-4 px-4 flex'>
            <p>Abhi Byreddy</p>
            <p className='text-white bg-blue-700 px-4  rounded-md ml-auto'>Co-Founder, COO</p>
            </div>
            <div className='w-full bg-neutral-800 py-4 px-4 flex'>
            <p>Jiaming Wang</p>
            <p className='text-white bg-blue-700 px-4  rounded-md ml-auto'>CTO</p>
            </div>
            <div className='w-full bg-neutral-800 py-4 px-4 flex'>
            <p>Mish Adelanwa</p>
            <p className='text-white bg-blue-700 px-4  rounded-md ml-auto'>Advisor</p>
            </div>
            <div className='w-full bg-neutral-800 py-4 px-4 flex'>
            <p>Stephen Stefantos</p>
            <p className='text-white bg-blue-700 px-4  rounded-md ml-auto'>SWE</p>
            </div>
                
            <div className='w-full bg-neutral-800 py-4 px-4 flex'>
            <p>Kshitij Kochhar</p>
            <p className='text-white bg-blue-700 px-4  rounded-md ml-auto'>SWE</p>
            </div>
            <div className='w-full bg-neutral-800 py-4 px-4 flex'>
            <p>Kristopher Hicks</p>
            <p className='text-white bg-blue-700 px-4  rounded-md ml-auto'>SWE</p>
            </div>
                   <div className='w-full bg-neutral-800 py-4 px-4 flex'>
            <p>Josh Herron</p>
            <p className='text-white bg-blue-700 px-2  rounded-md ml-auto'>Infrastructure</p>
            </div>
            <div className='w-full bg-neutral-800 py-4 px-4 flex'>
            <p>Anindya Das</p>
            <p className='text-white bg-blue-700 px-2  rounded-md ml-auto'>SWE Intern</p>
            </div>
            <div className='w-full bg-neutral-800 py-4 px-4 flex'>
            <p>Sai Rangineeni</p>
            <p className='text-white bg-blue-700 px-2  rounded-md ml-auto'>SWE Intern</p>
            </div>
            <div className='w-full bg-neutral-800 py-4 px-4 flex'>
            <p>Ben Haulk</p>
            <p className='text-white bg-blue-700 px-2  rounded-md ml-auto'>SWE Intern</p>
            </div>
            <div className='w-full bg-neutral-800 py-4 px-4 flex'>
            <p>Travis Peck</p>
            <p className='text-white bg-blue-700 px-2  rounded-md ml-auto'>SWE Intern</p>
            </div>
            <div className='w-full bg-neutral-800 py-4 px-4 flex'>
            <p>Ishan Voleti</p>
            <p className='text-white bg-blue-700 px-2  rounded-md ml-auto'>SWE Intern</p>
            </div>
          </div>
          </div>
   

        
      </div>
      


      </main>

      <div className="flex h-[12vh] w-full grow basis-0"></div>

      <Footer />
    </>
  );
  {
    /* End of return */
  }
}
