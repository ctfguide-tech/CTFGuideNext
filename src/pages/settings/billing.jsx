import { loadStripe } from '@stripe/stripe-js';
const STRIPE_KEY = process.env.NEXT_PUBLIC_APP_STRIPE_KEY;
import Head from 'next/head';
import { Footer } from '@/components/Footer';
import { StandardNav } from '@/components/StandardNav';
import Sidebar from '@/components/settingComponents/sidebar';
import FreeBox from '@/components/billing/FreeBox';
import UpgradeBox from '@/components/billing/UpgradeBox';
import PaidBox from '@/components/billing/PaidBox';

export default function Billing() {
  const redirectToCheckout = async (event) => {
    try {
      const stripe = await loadStripe(STRIPE_KEY);
      const subscriptionType = document.getElementById('paymentType').value;
      console.log(subscriptionType);

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
          credentials: 'include',
        }
      );

      const session = await response.json();
      if (session.error) {
        console.log('Creating the stripe session failed');
        return;
      }

      const result = await stripe.redirectToCheckout({
        sessionId: session.sessionId,
      });

      if (result.error) {
        console.log(result.error.message);
      }
    } catch (error) {
      console.log(error);
    }
    g;
  };

  const updateCardInfo = async () => {
    try {
      const stripe = await loadStripe(STRIPE_KEY);
      const subscriptionType = document.getElementById('paymentType').value;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payments/stripe/update-card`,
        {
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify({
            subType: subscriptionType,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const session = await response.json();

      await stripe.redirectToCheckout({
        sessionId: session.sessionId,
      });
    } catch (error) {
      console.log(error);
    }
  };

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
      console.log(data.message);
    } catch (err) {
      console.log(err);
    }
  };

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

      <div className="mx-auto flex max-w-6xl">
        <Sidebar />

        <div className="ml-8 max-w-3xl py-10">
          <h1 className="mb-3 text-3xl font-bold tracking-tight text-white">
            Billing
          </h1>
          <div className="flex max-2xl:grid max-2xl:grid-cols-1">
            <div className="max-2xl:mb-8 2xl:mr-8">
              <FreeBox />
            </div>
            <div className="max-2xl:mb-8 2xl:mr-8">
              <UpgradeBox />
            </div>
          </div>
          <div className="w-[1332px] max-2xl:w-[650px]">
            <p className="mt-8 rounded-xl bg-neutral-800 p-3 text-xl text-white drop-shadow-lg max-2xl:w-auto max-2xl:text-lg">
              CTFGuide currently has a very generous grant from Google Cloud
              Platform, which allows us to provide free compute to our users.
              However, this grant is limited, and we may have to start charging
              for compute in the future. If we do, we will give you a 30 day
              notice before we start charging for compute.
            </p>
          </div>

          <div className="hidden items-center justify-between text-white">
            <hr className="mb-2 mt-2 border-neutral-600 text-white" />
            <h1 className="mt-4 text-center text-4xl">
              Upgrade to{' '}
              <span className="font-bold text-blue-500">CTFGuide Pro</span>
            </h1>
            <div className="grid grid-cols-2 gap-4">
              <div
                className="hover mt-4 rounded border border-neutral-700 px-4 py-4 text-white"
                style={{ cursor: 'pointer' }}
              >
                <h1 className="text-center text-3xl">Monthly</h1>
                <h1 className="text-center text-xl">$4.99/month</h1>
              </div>
              <div
                className="hover mt-4 rounded border border-neutral-700 px-4 py-4 text-white"
                style={{ cursor: 'pointer' }}
              >
                <h1 className="text-center text-3xl">Annually</h1>
                <h1 className="text-center text-xl">$35.88/year</h1>
              </div>
            </div>
            <h1 className="mb-1 mt-4 text-center text-xl">What do you get?</h1>
            <div className="px-2 py-1 text-center">
              <p>Access to exclusive learning content.</p>
            </div>
            <div className="mt-1 px-2 py-1 text-center">
              <p>Show of an exclusive CTFGuide Pro badge</p>
            </div>
            <div className="mt-1 px-2 py-1 text-center">
              <p>Animated profile pictures**</p>
            </div>
            <div className="mt-1 px-2 py-1 text-center">
              <p>Increased container time</p>
            </div>
            <div className="mt-1 px-2 py-1 text-center">
              <p>AI Tutor**</p>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              * For the features marked with a star, it means it has not been
              released yet. For every month you have CTFGuide Pro, if the
              feature has not been implemented yet, you'll be given an
              additional free month of Pro.
            </p>
          </div>

          <div className="hidden">
            <hr className="mt-4 border-neutral-500"></hr>
            <h1 className="mt-4 text-white"> Dev Testing</h1>

            <select
              id="paymentType"
              className="mt-4 border-none bg-neutral-800 py-1 text-white"
            >
              <option value="CTFGuidePro">CTFGuidePro</option>
              <option value="CTFGuideStudentEDU">CTFGuideStudentsEDU</option>
              <option value="CTFGuideInstitutionEDU">
                CTFGuideInstitutionEDU
              </option>
            </select>

            <br></br>
            <button
              onClick={redirectToCheckout}
              className="text-md mt-4 rounded-lg bg-blue-600 px-2 py-1 text-white"
            >
              Stripe Checkout Demo
            </button>
            <br></br>

            <button
              onClick={updateCardInfo}
              className="text-md mt-4 rounded-lg bg-blue-600 px-2 py-1 text-white"
            >
              Update card infomation
            </button>
            <button
              onClick={cancelSubscription}
              className="text-md mt-4 rounded-lg bg-blue-600 px-2 py-1 text-white"
            >
              cancel subscription
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
