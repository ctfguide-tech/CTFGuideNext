import request from '@/utils/request'
import { loadStripe } from '@stripe/stripe-js'
import { useState } from 'react'
const STRIPE_KEY = process.env.NEXT_PUBLIC_APP_STRIPE_KEY
const subscriptionTypes = ['CTFGuidePro', 'CTFGuideProYearly']

export default function UpgradeBox () {
  const [loading, setLoading] = useState(-1)

  const redirectToCheckout = async (subIdx) => {
    setLoading(subIdx)
    try {
      const stripe = await loadStripe(STRIPE_KEY)
      const subscriptionType = subscriptionTypes[subIdx]
      const body = {
        subType: subscriptionType,
        quantity: 1,
        operation: 'subscription',
        data: {}
      }

      const url = `${process.env.NEXT_PUBLIC_API_URL}/payments/stripe/create-checkout-session`
      const session = await request(url, 'POST', body)

      if (session.error) {
        toast.error('Payment session failed')
        console.log('Creating the stripe session failed')
        return
      }

      const result = await stripe.redirectToCheckout({
        sessionId: session.sessionId
      })

      if (result.error) {
        toast.error(result.error.message)
        console.log(result.error.message)
      }
    } catch (error) {
      toast.error('Internal Error on our end please try again later')
    }
    setLoading(-1)
  }

  return (
    <>
      <div className='rounded-lg  bg-neutral-800 shadow'>
        <div className='to-amber-00 w-full rounded-t-lg bg-gradient-to-br from-amber-600 via-yellow-400 via-65% to-amber-600 pb-4 text-center'>
          <h5 className='pt-8 text-xl font-medium text-white'>Pro plan</h5>
          <div className='text-white'>
            <span class='text-3xl font-semibold'>$</span>
            <span class='text-5xl font-extrabold tracking-tight'>5</span>
            <span class='ms-1 text-xl font-normal'>/month</span>
          </div>
          <div className='mx-4 rounded-3xl bg-gray-600/75 py-1 text-sm text-white'>
            Yearly subscribers save $2/month
          </div>
        </div>

        <ul className='my-4 space-y-5 px-8'>
          <li className='flex items-center'>
            <svg
              className='h-4 w-4 flex-shrink-0 text-blue-600'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path d='M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z' />
            </svg>
            <span className='ms-3 text-base font-normal leading-tight text-gray-500 dark:text-gray-400'>
              Acess to challenge catalog
            </span>
          </li>
          <li className='flex'>
            <svg
              className='h-4 w-4 flex-shrink-0 text-blue-600'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path d='M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z' />
            </svg>
            <span className='ms-3 text-base font-normal leading-tight text-gray-500 dark:text-gray-400'>
              Increased terminal time
            </span>
          </li>
          <li className='flex'>
            <svg
              className='h-4 w-4 flex-shrink-0 text-blue-600'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path d='M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z' />
            </svg>
            <span className='ms-3 text-base font-normal leading-tight text-gray-500 dark:text-gray-400'>
              No ads
            </span>
          </li>
          <li className='flex decoration-gray-500'>
            <svg
              className='h-4 w-4 flex-shrink-0 text-blue-600'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path d='M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z' />
            </svg>
            <span className='ms-3 text-base font-normal leading-tight text-gray-500 dark:text-gray-400'>
              Custom banner images
            </span>
          </li>
          <li className='flex decoration-gray-500'>
            <svg
              className='h-4 w-4 flex-shrink-0 text-blue-600'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path d='M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z' />
            </svg>
            <span className='ms-3 text-base font-normal leading-tight text-gray-500 dark:text-gray-400'>
              PRO badge
            </span>
          </li>
          <li className='flex decoration-gray-500'>
            <svg
              className='h-4 w-4 flex-shrink-0 text-blue-600'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path d='M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z' />
            </svg>
            <span className='ms-3 text-base font-normal leading-tight text-gray-500 dark:text-gray-400'>
              Colored username
            </span>
          </li>
          <li className='flex decoration-gray-500'>
            <svg
              className='h-4 w-4 flex-shrink-0 text-blue-600'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path d='M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z' />
            </svg>
            <span className='ms-3 text-base font-normal leading-tight text-gray-500 dark:text-gray-400'>
              Acess to upcoming beta features
            </span>
          </li>
        </ul>
        <div className='px-8 pb-8 pt-4'>

          <button
            onClick={() => redirectToCheckout(0)}
            disabled={loading !== -1}
            className='text-md flex w-full justify-center rounded-lg bg-blue-600  py-2 text-center font-medium text-white '
          >
            {loading !== -1 ? 'Redirecting...' : 'Subscribe'}
          </button>
        </div>
      </div>
    </>
  )
}
