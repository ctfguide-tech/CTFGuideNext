import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Transition, Dialog } from '@headlessui/react';
import { Fragment } from 'react';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import request from '@/utils/request';

export default function Createclass() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL; // change this in deployment

  const [selectedOption, setSelectedOption] = useState('student');
  const [open, setOpen] = useState(false);
  const [domain, setDomain] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [seats, setSeats] = useState(0);
  const [usingPaymentLink, setUsingPaymentLink] = useState(false);
  const [loading, setLoading] = useState(false);

  const createClass = async () => {
    setLoading(true);
    try {
      // this is for now since we are not letting anyone pay
      setSelectedOption('student');

      if (seats <= 0) {
        toast.error('Invalid number of seats');
        return;
      } else if (name.trim().length === 0) {
        toast.error('Please enter a course title');
        return;
      } else if (!selectedOption) {
        toast.error('Please select a payment method');
        return;
      }

      const dataObj = {
        org: domain,
        name,
        description,
        numberOfSeats: seats,
        isPayedFor: true,
        pricingPlan: selectedOption,
        open: true,
      };

      if (usingPaymentLink && selectedOption === 'institution') {
        dataObj['isPayedFor'] = false;
        let url = baseUrl + '/classroom/create';
        const res = await request(url, 'POST', dataObj);
        if (res && res.success) {
          window.location.href = '/groups';
        } else console.log('There was an error when creating the class');
        return;
      }

      const url =
        selectedOption === 'student'
          ? `${baseUrl}/classroom/create`
          : `${baseUrl}/payments/stripe/create-checkout-session`;

      const response = await request(
        url,
        'POST',
        selectedOption === 'student'
          ? { ...dataObj }
          : {
              subType: selectedOption,
              quantity: seats,
              data: { ...dataObj },
              operation: 'createClass',
            }
      );

      if (selectedOption === 'student') {
        window.location.href = '/groups';
      } else {
        const STRIPE_KEY = process.env.NEXT_PUBLIC_APP_STRIPE_KEY;
        const stripe = await loadStripe(STRIPE_KEY);

        const session = await response.json();
        if (session.error)
          return console.log('Creating the stripe session failed');

        const result = await stripe.redirectToCheckout({
          sessionId: session.sessionId,
        });
        if (result.error) console.log(result.error.message);
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Create Class - CTFGuide</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
        </style>
      </Head>
      <StandardNav />
      <div className="min-h-screen bg-neutral-900/30">
        <div className="mx-auto max-w-4xl px-4 py-10">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Create a Classroom</h1>
            <p className="text-neutral-400">Set up your virtual classroom environment on CTFGuide</p>
          </div>

          <div className="bg-neutral-800/40 rounded-xl border border-neutral-700/50 backdrop-blur-sm">
            <div className="p-6">
              {/* Email Domain Section */}
              <div className="space-y-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Email Domain
                  </label>
                  <div className="flex rounded-lg shadow-sm ring-1 ring-inset ring-neutral-700 focus-within:ring-2 focus-within:ring-blue-500 bg-neutral-900/50">
                    <span className="flex select-none items-center pl-3 text-neutral-500 sm:text-sm">
                      johndoe@
                    </span>
                    <input
                      type="text"
                      id="email_domain"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      className="block flex-1 border-0 bg-transparent py-2.5 pl-1 text-white placeholder:text-neutral-400 focus:ring-0 sm:text-sm"
                      placeholder="coolschool.edu"
                    />
                  </div>
                  
                  <div className="mt-3 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <i className="fas fa-info-circle text-blue-400"></i>
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-blue-400">What is this?</h4>
                        <p className="mt-2 text-sm text-neutral-300">
                          This domain helps verify student emails when they join. If your organization doesn't use custom email domains, you can manage access by sharing the join code in class and disabling joins afterward.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Course Name */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Course Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border-0 bg-neutral-900/50 py-2.5 px-3 text-white shadow-sm ring-1 ring-inset ring-neutral-700 focus:ring-2 focus:ring-blue-500"
                    placeholder="Silly Hacking 101"
                  />
                </div>

                {/* Course Description */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Course Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="4"
                    className="w-full rounded-lg border-0 bg-neutral-900/50 py-2.5 px-3 text-white shadow-sm ring-1 ring-inset ring-neutral-700 focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe your course content and objectives..."
                  ></textarea>
                  <p className="mt-2 text-sm text-neutral-400">
                    <i className="fas fa-robot mr-2"></i>
                    AI will use this to suggest relevant content and labs
                  </p>
                </div>

                {/* Student Count */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Expected Number of Students
                  </label>
                  <input
                    type="number"
                    value={seats}
                    onChange={(e) => setSeats(e.target.value)}
                    className="w-full rounded-lg border-0 bg-neutral-900/50 py-2.5 px-3 text-white shadow-sm ring-1 ring-inset ring-neutral-700 focus:ring-2 focus:ring-blue-500"
                    placeholder="Estimated class size"
                  />
                  
                  <div className="mt-3 p-4 rounded-lg bg-neutral-700/20 border border-neutral-600/20">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <i className="fas fa-bolt text-yellow-400"></i>
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-yellow-400">Why do we need this?</h4>
                        <p className="mt-2 text-sm text-neutral-300">
                          This helps us optimize terminal deployment for your class. Don't worry if the estimate isn't exact - we include buffer capacity.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8 flex items-center gap-4">
                <button
                  disabled={loading}
                  onClick={createClass}
                  className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Creating...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-plus mr-2"></i>
                      Create Classroom
                    </>
                  )}
                </button>
                <button
                  onClick={() => window.history.back()}
                  className="text-neutral-400 hover:text-white transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
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
