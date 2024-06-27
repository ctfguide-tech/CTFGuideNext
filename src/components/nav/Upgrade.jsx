import { CheckIcon } from '@heroicons/react/20/solid';
import request from "@/utils/request";

const includedFeatures = [
    'Priority machine access',
    'Machines with GUI',
    'Access to more operating systems',
    'Longer machine times',
    'CTFGuide Pro flair on your profile, comments, and created content'
];

import { loadStripe } from '@stripe/stripe-js';
const STRIPE_KEY = process.env.NEXT_PUBLIC_APP_STRIPE_KEY;

export default function Upgrade({ open, setOpen }) {
  const hideModal = () => setOpen(false);

  const redirectToCheckout = async (isYearly) => {
    try {

      const stripe = await loadStripe(STRIPE_KEY);

      const body = {
        subType: isYearly ? "CTFGuideProYearly" : "CTFGuidePro",
        quantity: 1,
        operation: 'subscription',
        data: {},
      }

      const session = await request(`${process.env.NEXT_PUBLIC_API_URL}/payments/stripe/create-checkout-session`, "POST", body);

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
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-50 ${open ? '' : 'hidden'}`}>
    <div className="modal-content  w-full h-full animate__animated  animate__fadeIn">
            <div className="bg-neutral-900 bg-opacity-70  w-full h-full py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 animate__animated animate__slideInDown">
                    <div className="mx-auto max-w-3xl sm:text-center">
                         <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Upgrade to CTFGuide <span className='text-yellow-500'>Pro</span></h2>
                    
                        </div>
                        <div className="mx-auto mt-10 max-w-2xl rounded-3xl sm:mt-10 lg:mx-0 lg:flex lg:max-w-none bg-neutral-800 border-none">
                            <div className="p-8 sm:p-10 lg:flex-auto">
                                <h3 className="text-2xl font-bold tracking-tight text-white">Monthly Subscription</h3>
                                <p className="mt-6 text-base leading-7 text-white">
                                Enjoy our core features for free and upgrade to get perks like priority access to terminals, custom container images, customization perks, and more!  

                                </p>
                                <div className="mt-10 flex items-center gap-x-4">
                                    <h4 className="flex-none text-lg font-semibold leading-6 text-blue-600">What's included</h4>
                                    <div className="h-px flex-auto bg-gray-100" />
                                </div>
                                <ul
                                    role="list"
                                    className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-white sm:grid-cols-2 sm:gap-6"
                                >
                                    {includedFeatures.map((feature) => (
                                        <li key={feature} className="flex gap-x-3">
                                            <CheckIcon className="h-6 w-5 flex-none text-blue-600" aria-hidden="true" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <button onClick={hideModal} className=" mt-6 px-4 py-1 bg-neutral-900 hover:bg-neutral-700 text-white">
                          No, thanks.
                        </button>
                            </div>

                            <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0 ">
            <div className="rounded-2xl bg-neutral-850 h-full text-center ring-1 ring-inset ring-gray-900/5 bg-neutral-700 lg:flex lg:flex-col lg:justify-center">
              <div className="mx-auto max-w-xs px-8">
                <p className="text-base font-semibold text-white">Billed monthly</p>
                <p className="mt-6 flex items-baseline justify-center gap-x-2">
                  <span className="text-5xl font-bold tracking-tight text-white">$5</span>
                  <span className="text-sm font-semibold leading-6 tracking-wide text-white">USD</span>
                </p>
                <a
                  onClick={() => redirectToCheckout(false)}
                  href="#"
                  className="mt-10 block w-full rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  Subscribe
                </a>
                <p className="mt-6 text-xs leading-5 text-white">
                  Invoices and receipts available for easy company reimbursement
                </p>
              </div>
            </div>
          </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

