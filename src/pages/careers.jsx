import Head from 'next/head'

import { Footer } from '@/components/Footer'

import { StandardNav } from '@/components/StandardNav'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { Stats } from '@/components/dashboard/Stats'
import { Developer } from '@/components/dashboard/Developer'
import { useEffect } from 'react'

import { Image } from 'next/image'

export default function Careers(){
/*
      Code to check if onboarding has been complete
    */
   
        {/* Each person will be an object in an array team */}
        const team = [
            
            {
                personName: "Pranav Ramesh" ,
                position: "CEO", 
                image: "../pranavCTF.jpeg",
                width: "200"
            },
                
            {
                personName: "Abhinav Byreddy",
                position: "Systems Architect",
                image: "../abhi.jpeg",
                width: "200"
            }

            
      ]



      useEffect(() => {
        fetch("api.ctfguide.com/dashboard")
          .then((res) => res.json())
  
          .then((data) => {
            if (data.onboardingComplete == false) {
        //      window.location.replace("http://localhost:3000/onboarding?part=1")
            }
          }
          )
      //  .catch((error) => window.location.replace("http://localhost:3000/onboarding?part=1"))
      })
  
 
    return (
        <>
        <Head>
        <title>Careers - CTFGuide</title>
        <meta
          name="description"
          content="Cybersecurity made easy for everyone"
        />
        <style>
          @import url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
        </style>
        </Head>
       


        <StandardNav/>
        <main>
  

          <h1 className='text-3xl text-white'> Our Team </h1>

         
         {
           /*
          sm is for "smaller" devices
          */
         }
          <div className='grid grid-cols-3 gap-4 mx-auto text-center'>
            { 
                team.map((person) => {
                    return (
                        <div className='text-white '>
                            <img className={' rounded-full mx-auto'} width={person.width} src={person.image}></img>
                            <h1>{person.personName}</h1>
                            <h2>{person.position}</h2>
                        </div>
                    )
                })
            }

</div>  
            
        
        </main>

        <Footer />
        
        </>




    ) ;{/* End of return */}

}