import Head from 'next/head'

import { Footer } from '@/components/Footer'

import { StandardNav } from '@/components/StandardNav'
import { Container } from '@/components/Container'
import { RoleAsk } from '@/components/onboarding/RoleAsk'
import { ExpAsk } from '@/components/onboarding/ExpAsk'
import { ProjectAsk } from '@/components/onboarding/ProjectAsk'

export default function Onboarding() {
  return (
    <>
      <Head>
        <title>Dashboard - CTFGuide</title>
        <meta
          name="description"
          content="Cybersecurity made easy for everyone"
        />
        <style>
          @import url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
        </style>
      </Head>
      <main>
        
        <Container className="h-flex items-center justify-center h-screen">
            <ProjectAsk/>
        </Container>
   
      </main>
    </>
  )
}
