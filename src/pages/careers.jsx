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
      position: 'Software Engineer',
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
      personName: 'David Youm',
      position: 'Software Engineer',
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
          <div className="py-12 sm:py-20 w-full text-left bg-black bg-opacity-70">
            <div className='max-w-7xl mx-auto px-4'>
              <p className="text-3xl sm:text-4xl font-bold text-white">
                About 
                <span className="mt-2 text-3xl sm:text-4xl text-blue-600 font-bold tracking-tight">
                  &nbsp;CTFGuide
                </span>
              </p>
              <p className="mt-1 text-lg sm:text-xl text-white">
                The company that's building the modern cybersecurity upskilling platform.
              </p>
            </div>
          </div>
        </div>

      <div  className='max-w-6xl w-full sm:px-2 px-4 mx-auto text-white mt-10 grid lg:grid-cols-6 grid-cols-1 sm:gap-x-8 gap-0'>
        <div className='sm:col-span-2 md:col-span-2 lg:col-span-4 xl:col-span-4'>
          <h1 className='text-2xl font-bold text-blue-500 mb-6'>Our Team</h1>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {team.map((member, index) => (
              <div key={index} className='bg-neutral-800 p-6 '>
                <div>
                  <h3 className='text-xl font-semibold'>{member.personName}</h3>
                  <p className='text-blue-500 text-sm mt-1'>{member.position}</p>
                </div>
              </div>
            ))}
          </div>

          <h1 className='text-2xl font-bold text-blue-500 mt-12 mb-6'>Working with us</h1>
          <p className='text-gray-300 leading-relaxed'>
            We're all about open, collaborative, and inclusive culture. We believe in learning from each other and the power of community.
            <br /><br />
            Our team? Learners, not know-it-alls. We're after people who want to grow, not those who think they've got it all figured out.
          </p>

          <h1 className='text-2xl font-bold text-blue-500 mt-12 mb-6'>Support and community</h1>
          <p className='text-gray-300 leading-relaxed'>
            CTFGuide is supported by our university, generous community contributors, and early believers who see the value in making cybersecurity accessible.
          </p>

          <h1 className='text-2xl font-bold text-blue-500 mt-12 mb-6'>Open Positions</h1>
          <p className='text-sm text-gray-300 mb-6'>
            Applications require you to login with your Google account. You can also email your resume to staff@ctfguide.com.
          </p>
          
          <div className='space-y-4'>
            {listings.map((listing, index) => (
              <div key={index} className='bg-neutral-800 p-6  flex justify-between items-center'>
                <div className='flex flex-col'>
                  <h3 className='text-xl font-semibold'>{listing.roleName}</h3>
                  <div className='flex space-x-4 mt-1'>
                    <span className='text-sm text-gray-300'>{listing.team}</span>
                    <span className='text-sm text-gray-300'>•</span>
                    <span className='text-sm text-gray-300'>{listing.position}</span>
                    <span className='text-sm text-gray-300'>•</span>
                    <span className='text-sm text-gray-300'>{listing.type}</span>
                  </div>
                </div>
                <a 
                  href="https://forms.gle/AQrnizsKoyoG6Y1T7" 
                  className='bg-blue-700 hover:bg-blue-600 duration-100 px-6 py-2  text-sm'
                >
                  Apply
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className='col-span-2 w-full mt-10 lg:mt-0 lg:col-span-2'>
          <div className='w-full'>
            <p className='text-2xl font-bold text-blue-500 mb-6'>Sponsors & Partners</p>

<div className='w-full bg-neutral-800 p-6 '>
  <div className='flex flex-col space-y-3'>
    <div className='flex items-center justify-between'>
      <h3 className='text-xl font-semibold'>STiBaRC</h3>
      <span className='text-white bg-blue-700 px-3 py-1  text-sm'>Compute</span>
    </div>
    <p className='text-gray-300 text-sm leading-relaxed'>
    STiBaRC is a  social media platform created by Joshua Herron, initially started as a joke and a gift to a friend. It has since expanded to include features like a messenger, livestreaming service, record label, and ad system .  
    
      </p>
      <a href="https://stibarc.com" className='text-blue-500 hover:text-blue-600 duration-100'>https://stibarc.com</a>
  </div>


</div>



<div className='w-full mt-4 bg-neutral-800 p-6 '>
  <div className='flex flex-col space-y-3'>
    <div className='flex items-center justify-between'>
      <h3 className='text-xl font-semibold'>PSU Web Dev Club</h3>
      <span className='text-white bg-blue-700 px-3 py-1  text-sm'>Compute</span>
    </div>
    <p className='text-gray-300 text-sm leading-relaxed'>
    The Penn State Web Dev Club is a student-run organization at Penn State University that focuses on building a community for web development enthusiasts. </p>

    
      <a href="https://psuwebdev.org/" className='text-blue-500 hover:text-blue-600 duration-100'>https://psuwebdev.org/</a>
  </div>

  
</div>

<div className='w-full mt-4 bg-neutral-800 p-6 '>
  <div className='flex flex-col space-y-3'>
    <div className='flex items-center justify-between'>
      <h3 className='text-xl font-semibold'>Penn State University</h3>
      <span className='text-white bg-blue-700 px-3 py-1  text-sm'>Capital</span>
    </div>
    <p className='text-gray-300 text-sm leading-relaxed'>
    Penn State University is a public research university in State College, Pennsylvania. It is the flagship institution of the Pennsylvania State System of Higher Education.
    </p>

    <a href="https://www.psu.edu/" className='text-blue-500 hover:text-blue-600 duration-100'>https://www.psu.edu/</a>
  </div>
</div>

<div className='w-full mt-4 bg-neutral-800 p-6 '>
  <div className='flex flex-col space-y-3'>
    <div className='flex items-center justify-between'>
      <h3 className='text-xl font-semibold'>Bullmont Capital</h3>
      <span className='text-white bg-blue-700 px-3 py-1  text-sm'>Capital</span>
    </div>
    <p className='text-gray-300 text-sm leading-relaxed'>
    Bullmont Capital is a venture capital firm that invests in early-stage startups.
    </p>

    <a href="https://bullmontcapital.com/" className='text-blue-500 hover:text-blue-600 duration-100'>https://bullmontcapital.com/</a>
  </div>
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
