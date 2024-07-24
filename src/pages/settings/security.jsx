import Head from 'next/head'
import { Footer } from '@/components/Footer'
import { StandardNav } from '@/components/StandardNav'
import Sidebar from '@/components/settingComponents/sidebar'
import { useState, useContext, useEffect } from 'react'
import request from '@/utils/request'
// const STRIPE_KEY = process.env.NEXT_PUBLIC_APP_STRIPE_KEY;
import { Context } from '@/context'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Dropdown from '@/components/settingComponents/dropdown' // Import the new Dropdown component

export default function Security () {
  const { accountType } = useContext(Context)
  const [inputText, setInputText] = useState('')
  const [isGoogle, setIsGoogle] = useState(true)

  useEffect(() => {
    setIsGoogle(accountType === 'GOOGLE')
  }, [accountType])

  const user = {}

  const handleInputChange = (event) => {
    setInputText(event.target.value)
  }

  async function saveSecurity () {
    document.getElementById('saveSecurity').innerText = 'Saving...'
    const oldPassword = document.getElementById('oldPassword').value
    const newPassword = document.getElementById('password').value
    const confirmPassword = document.getElementById('confirm-password').value

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      document.getElementById('saveSecurity').innerText = 'Save'
      return
    }

    let valid = false
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long.')
    } else if (!/[A-Z]/.test(newPassword)) {
      toast.error('Password must contain at least one uppercase letter.')
    } else if (!/[a-z]/.test(newPassword)) {
      toast.error('Password must contain at least one lowercase letter.')
    } else if (!/[0-9]/.test(newPassword)) {
      toast.error('Password must contain at least one number.')
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      toast.error('Password must contain at least one special character.')
    } else {
      valid = true
    }

    if (!valid) {
      document.getElementById('saveSecurity').innerText = 'Save'
      return
    }

    const url = `${process.env.NEXT_PUBLIC_API_URL}/account/change-password`
    const response = await request(url, 'POST', { oldPassword, password: newPassword })
    if (!response || !response.success) {
      toast.error('Something went wrong!')
    } else {
      toast.success('Your password has been updated')
    }

    try {
      document.getElementById('saveSecurity').innerText = 'Save'

      document.getElementById('password').value = ''
      document.getElementById('confirm-password').value = ''
      document.getElementById('oldPassword').value = ''
    } catch (error) {
      document.getElementById('saveSecurity').innerText = 'Save'
      window.alert(error)
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
        {isMobile ? <Dropdown tab='../settings/security' /> : <Sidebar />}
        <div className='flex-1 px-4 max-w-3xl xl:overflow-y-auto'>
          <div className='mx-auto   mr-auto  px-4 py-10 sm:px-6 lg:px-5 lg:py-12'>     <h1 className='text-3xl font-bold tracking-tight text-white'>
            Security
                                                                                       </h1>

            <div className='mt-6 space-y-8 '>
              <div className='flex grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6'>
                <div className='sm:col-span-6'>
                  <h2 className='text-xl font-medium text-white'>
                    Password Management
                  </h2>
                  <p className='mt-1 text-sm text-white'>
                    Change your password
                  </p>
                  {isGoogle && (

                    <div className='bg-neutral-800 p-4 rounded-md mt-4'>

                      <div className='flex justify-center items-center gap-x-4'>
                        <img src='../../google.png' alt='Google' className='w-10 h-10' />
                        <h3 className='text-white'>
                          You are using a Google Account. <b> You will not be able to set a password for your account.</b>
                        </h3>
                      </div>

                    </div>
                  )}

                </div>

                <div className='sm:col-span-3'>

                  <label
                    htmlFor=''
                    className='block text-sm font-medium leading-6 text-white'
                  >
                    New Password
                  </label>
                  <input
                    type='password'
                    name='password'
                    disabled={isGoogle}
                    id='password'
                    autoComplete='given-name'
                    className={`mt-2 block w-full rounded-md border-none bg-neutral-800  py-1.5 text-white shadow-sm  sm:text-sm sm:leading-6 ${isGoogle ? 'cursor-not-allowed' : ''}`}
                  />
                </div>

                <div className='sm:col-span-3'>
                  <label
                    htmlFor='last-name'
                    className='block text-sm font-medium leading-6 text-white'
                  >
                    Confirm Password
                  </label>
                  <input
                    type='password'
                    name='confirm-password'
                    id='confirm-password'
                    autoComplete='family-name'
                    disabled={isGoogle}
                    className={`mt-2 block w-full rounded-md border-none bg-neutral-800  py-1.5 text-white shadow-sm  sm:text-sm sm:leading-6 ${isGoogle ? 'cursor-not-allowed' : ''}`}
                  />
                </div>

                <div className='sm:col-span-3'>
                  <label
                    htmlFor=''
                    className='block text-sm font-medium leading-6 text-white'
                  >
                    Current Password
                  </label>
                  <input
                    type='password'
                    name='password'
                    id='oldPassword'
                    disabled={isGoogle}
                    autoComplete='given-name'
                    className={`mt-2 block w-full rounded-md border-none bg-neutral-800  py-1.5 text-white shadow-sm  sm:text-sm sm:leading-6 ${isGoogle ? 'cursor-not-allowed' : ''}`}
                  />
                </div>
              </div>
              <div className='flex justify-end'>

                <button
                  id='saveSecurity'
                  onClick={saveSecurity}
                  className='rounded-md bg-blue-500 px-4 py-2 text-white'
                  disabled={isGoogle}
                >
                  Save Changes
                </button>

              </div>

            </div>
          </div>
        </div>
      </div>

      <ToastContainer
        position='bottom-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='dark'
      />
      <Footer />
    </>
  )
}
