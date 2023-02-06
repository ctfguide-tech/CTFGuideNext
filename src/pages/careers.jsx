import Head from 'next/head'

import { Footer } from '@/components/Footer'

import { StandardNav } from '@/components/StandardNav'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { Stats } from '@/components/dashboard/Stats'
import { Developer } from '@/components/dashboard/Developer'
import { useEffect } from 'react'

export default function Careers(){
/*
      Code to check if onboarding has been complete
    */
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
        const pranav = require("src\images\people\pranavCTF.jpeg")
        const abhi = require("src\images\people\abhi.jpeg")

        {/* Each person will be an object in an array team */}
        const team = [
            
            {
                personName: "Pranav Ramesh" ,
                position: "CEO", 
                image: pranav,
            },
                
            {
                personName: "Abhinav Byreddy",
                position: "Systems Architect",
                image: abhi,
            },

        ]


        <StandardNav/>
        <main>

        
        </main>

        <Footer />
        
        </>




    ) ;{/* End of return */}

}