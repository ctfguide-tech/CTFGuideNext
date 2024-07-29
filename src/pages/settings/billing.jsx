import { loadStripe } from '@stripe/stripe-js';
const STRIPE_KEY = process.env.NEXT_PUBLIC_APP_STRIPE_KEY;
import Head from 'next/head';
import { Footer } from '@/components/Footer';
import { useState, useEffect } from 'react';
import { StandardNav } from '@/components/StandardNav';
import Sidebar from '@/components/settingComponents/sidebar';
import UpgradeBox from '@/components/settingComponents/UpgradeBox';
import FreeBox from '@/components/settingComponents/FreeBox';
import Dropdown from '@/components/settingComponents/dropdown'; // Import the new Dropdown component
import { motion } from 'framer-motion';
import { Context } from '@/context';
import { useContext } from 'react';
import { Dialog } from '@headlessui/react';
import Confetti from 'react-confetti';

export default function Billing() {
  const updateCardInfo = async () => {
    try {
      let test = 'https://billing.stripe.com/p/login/test_dR6dQZdpX3Fh4ne4gg';
      let prod = 'https://billing.stripe.com/p/login/28o4i86t419hh1K3cc';
      window.location.href = test;
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
      console.log(error);
    }
  };
  const { role } = useContext(Context);

  const cancelSubscription = async () => {
    try {
      const subscriptionType = document.getElementById('paymentType').value;
      const url = `${process.env.NEXT_PUBLIC_API_URL}/payments/stripe/cancel`;
      const response = await fetch(url, {
        method: 'PUT',
        credentials: 'include',
        body: JSON.stringify({
          subType: subscriptionType,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      // console.log(data.message);
    } catch (err) {
      console.log(err);
    }
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // Check on initial render
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  function SubscribeDialog() {
    const [isOpen, setIsOpen] = useState(true);
    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const subscribed = params.get('subscribed') === 'true';
      console.log('URL Parameter - Subscribed:', subscribed); // Debug log
      setIsSubscribed(subscribed);
    }, []);

    useEffect(() => {
      console.log('State - isSubscribed:', isSubscribed); // Debug log
    }, [isSubscribed]);

    return (
      <>
        {isSubscribed ? (
          <Dialog
            open={isOpen}
            onClose={() => setIsOpen(false)}
            className={`relative z-50 transition-opacity duration-500 ${
              isOpen ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
            <div className="fixed inset-0 w-screen overflow-y-auto">
              <Confetti
                width={window.innerWidth}
                height={window.innerHeight}
                recycle={false}
                numberOfPieces={800}
              />
              <div className="flex min-h-full items-center justify-center p-4">
                <Dialog.Panel className="mx-auto max-w-6xl rounded bg-neutral-900 px-32 text-white">
                  <div className="flex gap-x-10 max-sm:mx-auto">
                    <div className="my-14 w-5/6 max-sm:w-full">
                      <Dialog.Title
                        className={
                          'mt-12 text-3xl font-semibold max-sm:text-2xl'
                        }
                      >
                        Thank you for upgrading to{' '}
                        <br className="max-sm:hidden" />
                        <span className="bg-gradient-to-br from-amber-600 via-yellow-400 via-65% to-amber-600 bg-clip-text text-transparent">
                          CTFGuide Pro!
                        </span>
                      </Dialog.Title>
                      <p className="my-4 text-xl">
                        Your perks are now available!
                      </p>
                      <button
                        onClick={() => setIsOpen(false)}
                        className="mt-4 rounded bg-blue-600 px-24 py-2 text-white hover:bg-blue-400"
                      >
                        Close
                      </button>
                    </div>
                    <div className="mb-0 mt-auto w-1/3 max-sm:hidden">
                      <div className="ml-44 mt-36 rotate-12 text-xl italic">
                        meow
                      </div>
                      <img
                        src={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/FancyKana.png`}
                      />
                    </div>
                  </div>
                </Dialog.Panel>
              </div>
            </div>
          </Dialog>
        ) : null}
      </>
    );
  }

  return (
    <>
      <Head>
        <title>User Settings</title>
        <meta
          name="description"
          content="Cybersecurity made easy for everyone"
        />
        <style>
          @import
          url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
        </style>
      </Head>

      <StandardNav />

      <div className="mx-auto max-w-6xl md:flex">
        {isMobile ? <Dropdown tab="../settings/billing" /> : <Sidebar />}

        <div className="max-w-3xl flex-1 px-4 xl:overflow-y-auto">
          <div className="mx-auto   mr-auto  px-4 py-10 sm:px-6 lg:px-5 lg:py-12">
            <h1 className="mb-3 text-3xl font-bold tracking-tight text-white">
              Billing
            </h1>
            {role != 'USER' && (
              <motion.div
                className="flex rounded-lg bg-gradient-to-br from-blue-600 to-purple-400 to-70%"
                whileHover={{ scale: 1.02 }}
              >
                <img
                  className="mb-0 mt-auto w-1/6"
                  src={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/FancyKana.png`}
                />

                <div className="ml-0  mt-2 grid w-full grid-cols-1 place-items-center px-4 ">
                  <div className="flex w-full  text-lg text-white max-md:my-2 max-md:text-xs">
                    <div>
                      <p className="font-semibold">
                        You have an active subscription.
                      </p>
                    </div>

                    <div className="ml-auto px-4 ">
                      <motion.button
                        onClick={updateCardInfo}
                        className="rounded-lg bg-white px-2 py-1 text-sm text-purple-600"
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

            <SubscribeDialog />

            <div className="mt-4 grid w-full grid-cols-2 gap-x-4 max-sm:grid-cols-1">
              <FreeBox />
              <UpgradeBox />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
