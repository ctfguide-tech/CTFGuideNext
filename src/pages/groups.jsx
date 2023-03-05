import Head from 'next/head'
import Link from 'next/link'
import { StandardNav } from '@/components/StandardNav'
import { Button } from '@/components/Button'

export default function ComingSoon() {
  return (
    <>
      <Head>
        <title>Coming Soon - CTFGuide</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
        </style>
      </Head>
      <StandardNav />
      <div className="flex min-h-full flex-col py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <Link href="../">
            <img
              className="mx-auto h-20 w-auto"
              src="../darkLogo.png"
              alt="CTFGuide"
            />
          </Link>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">Coming Soon!</h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div style={{ backgroundColor: "#212121" }} className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <p className="text-gray-300 text-center">Learn and training with a guided group. Coming soon...</p>
            <div className="mt-6">
              <Button href="../practice" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue focus:bg-blue-700">
                Keep on practicing!
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
