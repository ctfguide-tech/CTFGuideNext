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
   
          <h2 className="mt-6 text-center text-5xl font-bold tracking-tight text-white"><i class="fas fa-gamepad"></i></h2>

          <h2 className="mt-1 text-center text-3xl font-bold tracking-tight text-white">CTF.live</h2>

          <h2 className="mt-2 text-center text-2xl font-bold tracking-tight text-white">This feature is coming soon.</h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div style={{ backgroundColor: "#212121" }} className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <p className="text-gray-300 text-center">Compete in live CTF games with friends.</p>
            <div className="mt-6">
              <Button href="../dashboard" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-blue focus:bg-blue-700">
                Return to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
