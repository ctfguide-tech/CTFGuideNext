import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { useState } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { loadStripe } from '@stripe/stripe-js';
const STRIPE_KEY = process.env.NEXT_PUBLIC_APP_STRIPE_KEY;

const subscriptionTypes = ['CTFGuidePro', 'CTFGuideProYearly'];
export default function Subscribe() {
  const [loading, setLoading] = useState(-1);

  const redirectToCheckout = async (subIdx) => {
    setLoading(subIdx);
    try {
      const stripe = await loadStripe(STRIPE_KEY);
      const subscriptionType = subscriptionTypes[subIdx];

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payments/stripe/create-checkout-session`,
        {
          method: 'POST',
          body: JSON.stringify({
            subType: subscriptionType,
            quantity: 1,
            operation: 'subscription',
            data: {},
          }),
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        }
      );

      const session = await response.json();
      if (session.error) {
        toast.error('Payment session failed');
        console.log('Creating the stripe session failed');
        return;
      }

      const result = await stripe.redirectToCheckout({
        sessionId: session.sessionId,
      });

      if (result.error) {
        toast.error(result.error.message);
        console.log(result.error.message);
      }
    } catch (error) {
      toast.error('Internal Error on our end please try again later');
    }
    setLoading(-1);
  };

  return (
    <>
      <Head>
        <title>Subscribe - CTFGuide</title>
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
      <div className="mx-auto max-w-6xl py-9 text-white">
        <h1 className="text-center text-5xl font-bold">
          CTFGuide <span className="text-blue-600">Pro</span>
        </h1>
        <h2 className="text-center text-xl font-semibold">
          Get started with a CTFGuide Pro subscription that works for you.
        </h2>
      </div>
      <div className="mx-auto grid max-w-6xl grid-cols-2 grid-rows-1 gap-4">
        <div className="mb-2 rounded border-2 border-blue-600 bg-neutral-800/50 px-3 py-3 text-white">
          <h1 className="text-center text-2xl font-bold">
            CTFGuide Pro Monthly
          </h1>
          <h2 className="text-center text-lg ">
            • Access to more powerful, virtualized Kubernetes containers
          </h2>
          <h2 className="text-center text-lg ">• Customized images</h2>
          <h2 className="text-center text-lg ">
            • Blue name colors on comments, profile page, etc
          </h2>
          <h2 className="text-center text-lg ">
            • A cool badge on your profile to show your support!
          </h2>
          <h2 className="pl-4 pt-8">
            <span className="text-left text-2xl font-bold">Billed: $4.99</span>
            <span className="text-left text-lg text-slate-400">/mo</span>
          </h2>
          <h2 className="pl-4">
            <span className="text-left text-lg text-slate-400">
              Prices are marked in USD
            </span>
          </h2>
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading !== -1}
              onClick={() => redirectToCheckout(0)}
              className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {loading === 0 ? 'Redirecting...' : 'Subscribe'}
            </button>
          </div>
        </div>

        <div className="mb-2 rounded border-2 border-yellow-600 bg-neutral-800/50 px-3 py-3 text-white">
          <h1 className="pr-5 text-center text-2xl font-bold">
            CTFGuide Pro Yearly
          </h1>
          <h2 className="text-center text-lg ">
            • Everything that Monthly gives
          </h2>
          <h2 className="text-center text-lg ">
            • Gold name colors on comments, profile page, etc
          </h2>
          <h2 className="text-center text-lg ">
            • A <span className="text-yellow-600">even cooler</span> badge on
            your profile to show your support!
          </h2>
          <br></br>
          <br></br>
          <br></br>
          <h2 className="pl-4 pt-5">
            <span className="text-left text-2xl font-bold">Billed: $54.99</span>
            <span className="text-left text-lg text-slate-400">/yr</span>
          </h2>
          <h2 className="pl-4">
            <span className="text-left text-lg text-slate-400">
              Prices are marked in USD
            </span>
          </h2>
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading !== -1}
              onClick={() => redirectToCheckout(1)}
              className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {loading === 1 ? 'Redirecting...' : 'Subscribe'}
            </button>
          </div>
        </div>
      </div>
      <div className="pt-8">
        <div
          className="mx-auto max-w-6xl "
          style={{ backgroundColor: '#212121' }}
        >
          <h1 className="pl-4 text-2xl font-bold text-white">
            Frequently asked questions
          </h1>
          <ul className="text-white">
            <li>
              <details>
                <summary className="pl-5 text-xl font-bold">
                  How do I cancel my subscription?
                </summary>
                <p className="pl-5 text-lg font-semibold text-blue-600">
                  Instructions on how to cancel your subscription.
                </p>
              </details>
            </li>
            <li>
              <details>
                <summary className="pl-5 text-xl font-bold">
                  How do refunds work?
                </summary>
                <p className="pl-5 text-lg font-semibold text-blue-600">
                  Information about the refund process.
                </p>
              </details>
            </li>
          </ul>
        </div>
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Footer />
    </>
  );
}
