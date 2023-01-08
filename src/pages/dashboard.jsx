import Head from 'next/head'

import { Footer } from '@/components/Footer'

import { StandardNav } from '@/components/StandardNav'
import { DashboardHeader } from '@/components/DashboardHeader'
import { Stats } from '@/components/Stats'
export default function Dashboard() {
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
        <StandardNav />
      <main>
        <DashboardHeader />
      <Stats/>
      </main>
      <Footer />
    </>
  )
}
