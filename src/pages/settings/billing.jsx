import { loadStripe } from '@stripe/stripe-js'
import Head from 'next/head'
import { Footer } from '@/components/Footer'
import { useState, useEffect, useContext } from 'react'

import { StandardNav } from '@/components/StandardNav'
import Sidebar from '@/components/settingComponents/sidebar'
import UpgradeBox from '@/components/settingComponents/UpgradeBox'
import FreeBox from '@/components/settingComponents/FreeBox'
import Dropdown from '@/components/settingComponents/dropdown' // Import the new Dropdown component
import { motion } from 'framer-motion'
import { Context } from '@/context'
const STRIPE_KEY = process.env.NEXT_PUBLIC_APP_STRIPE_KEY

export default function Billing () {
  const updateCardInfo = async () => {
    try {
      const test = 'https://billing.stripe.com/p/login/test_dR6dQZdpX3Fh4ne4gg'
      const prod = 'https://billing.stripe.com/p/login/28o4i86t419hh1K3cc'
      window.location.href = test
      /*
      const stripe = await loadStripe(STRIPE_KEY);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payments/stripe/update-card`,
        {
          method: 'POST',
          body: JSON.stringify({ subType: "PRO_MONTHLY" }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${getCookie()}`
          },
        }
      );
      const session = await response.json();

      console.log(session);

      await stripe.redirectToCheckout({
        sessionId: session.sessionId,
      });
      */
    } catch (error) {
      console.log(error)
    }
  }
  const { role } = useContext(Context)

  const cancelSubscription = async () => {
    try {
      const subscriptionType = document.getElementById('paymentType').value
      const url = `${process.env.NEXT_PUBLIC_API_URL}/payments/stripe/cancel`
      const response = await fetch(url, {
        method: 'PUT',
        credentials: 'include',
        body: JSON.stringify({
          subType: subscriptionType
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      // console.log(data.message);
    } catch (err) {
      console.log(err)
    }
  }

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    handleResize() // Check on initial render
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <>
      <Head>
        <title>User Settings</title>
        <meta
          name='description'
          content='Cybersecurity made easy for everyone'
        />
        <style>
          @import
          url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
        </style>
      </Head>

      <StandardNav />

      <div className='mx-auto max-w-6xl md:flex'>
        {isMobile ? <Dropdown tab='../settings/billing' /> : <Sidebar />}

        <div className='max-w-3xl flex-1 px-4 xl:overflow-y-auto'>
          <div className='mx-auto   mr-auto  px-4 py-10 sm:px-6 lg:px-5 lg:py-12'>
            <h1 className='mb-3 text-3xl font-bold tracking-tight text-white'>
              Billing
            </h1>
            {role != 'USER' && (
              <motion.div
                className='flex rounded-lg bg-gradient-to-br from-blue-600 to-purple-400 to-70%'
                whileHover={{ scale: 1.02 }}
              >
                <img
                  className='mb-0 mt-auto w-1/6'
                  src={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/DefaultKana.png`}
                />

                <div className='ml-0  mt-2 grid w-full grid-cols-1 place-items-center px-4 '>
                  <div className='flex w-full  text-lg text-white max-md:my-2 max-md:text-xs'>
                    <div>
                      <p className='font-semibold'>
                        You have an active subscription.
                      </p>
                    </div>

                    <div className='ml-auto px-4 '>
                      <motion.button
                        onClick={updateCardInfo}
                        className='rounded-lg bg-white px-2 py-1 text-sm text-purple-600'
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Manage Subscription
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div className='mt-4 grid w-full grid-cols-2 gap-x-4 max-sm:grid-cols-1'>
              <FreeBox />
              <UpgradeBox />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
