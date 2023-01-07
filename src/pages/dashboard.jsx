import Head from 'next/head'

import { Footer } from '@/components/Footer'

import { StandardNav } from '@/components/StandardNav'
import { DashboardHeader } from '@/components/DashboardHeader'
export default function Dashboard() {
  return (
    <>
      <Head>
        <title>Dashboard - CTFGuide</title>
        <meta
          name="description"
          content="Cybersecurity made easy for everyone"
        />
      </Head>
        <StandardNav />
      <main>
        <DashboardHeader />
    
      </main>
      <Footer />
    </>
  )
}
