import { getCookie } from '@/utils/request'
import Head from 'next/head'
import { Footer } from '@/components/Footer'
import { StandardNav } from '@/components/StandardNav'
import Sidebar from '@/components/settingComponents/sidebar'
import { useState, useEffect } from 'react'
import Dropdown from '@/components/settingComponents/dropdown' // Import the new Dropdown component
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function Preferences () {
  function loadPreferences () {
    // WARNING: For GET requests, body is set to null by browsers.

    const xhr = new XMLHttpRequest()

    xhr.addEventListener('readystatechange', function () {
      if (this.readyState === 4) {
        console.log(this.responseText)
        console.log('PREFFF')
        try {
          if (JSON.parse(this.responseText)[0].value == true) {
            document.getElementById('friend-notif').checked = true
          }

          if (JSON.parse(this.responseText)[1].value == true) {
            document.getElementById('challenge-notif').checked = true
          }
        } catch (error) {
          // .alert(error)
        }
      }
    })

    xhr.open('GET', `${process.env.NEXT_PUBLIC_API_URL}/account/preferences`)
    const token = getCookie()
    xhr.setRequestHeader('Authorization', 'Bearer ' + token)
    xhr.withCredentials = true
    xhr.send()
  }

  function savePreferences () {
    document.getElementById('savePreferences').innerHTML = 'Saving...'

    const data = JSON.stringify({
      FRIEND_ACCEPT: document.getElementById('friend-notif').checked,
      CHALLENGE_VERIFY: document.getElementById('challenge-notif').checked
    })

    const xhr = new XMLHttpRequest()

    xhr.addEventListener('readystatechange', function () {
      if (this.readyState === 4) {
        toast.success('Preferences saved')
        document.getElementById('savePreferences').innerHTML = 'Save'
      }
    })

    xhr.open('PUT', `${process.env.NEXT_PUBLIC_API_URL}/account/preferences`)

    xhr.setRequestHeader('Content-Type', 'application/json')
    const token = getCookie()
    xhr.setRequestHeader('Authorization', 'Bearer ' + token)
    xhr.withCredentials = true

    xhr.send(data)
  }
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    loadPreferences()
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

        {isMobile ? <Dropdown tab='../settings/preferences' /> : <Sidebar />}
        <div className='flex-1 px-4 max-w-3xl xl:overflow-y-auto'>
          <div className='mx-auto   mr-auto  px-4 py-10 sm:px-6 lg:px-5 lg:py-12'>
            <h1 className='text-3xl font-bold tracking-tight text-white'>
              Email Preferences
            </h1>

            <div className='mt-6 space-y-8 '>
              <fieldset>
                <legend className='sr-only'>Notifications</legend>
                <div className='space-y-5'>
                  <div className='relative flex items-start'>
                    <div className='flex h-6 items-center'>
                      <input
                        id='friend-notif'
                        aria-describedby='comments-description'
                        name='comments'
                        type='checkbox'
                        className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600'
                      />
                    </div>
                    <div className='ml-3 text-sm leading-6'>
                      <label
                        htmlFor='comments'
                        className='font-medium text-white'
                      >
                        Friend Requests
                      </label>
                      <p
                        id='comments-description'
                        className='text-neutral-400'
                      >
                        Get notified when someones accepts or sends you a
                        friend request.
                      </p>
                    </div>
                  </div>
                  <div className='relative flex items-start'>
                    <div className='flex h-6 items-center'>
                      <input
                        id='challenge-notif'
                        aria-describedby='candidates-description'
                        name='candidates'
                        type='checkbox'
                        className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600'
                      />
                    </div>
                    <div className='ml-3 text-sm leading-6'>
                      <label
                        htmlFor='candidates'
                        className='font-medium text-white'
                      >
                        Creator Notifications
                      </label>
                      <p
                        id='candidates-description'
                        className='text-neutral-400'
                      >
                        Get notified when your challenges get verified.
                      </p>
                    </div>
                  </div>
                </div>
              </fieldset>

              <div className='flex justify-end gap-x-3 pt-8'>
                <button
                  id='savePreferences'
                  onClick={savePreferences}
                  className='rounded-md bg-blue-500 px-4 py-2 text-white'
                >
                  Save Changes
                </button>
              </div>
              <ToastContainer
                position='top-right'
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
            </div>
          </div>
        </div>

      </div>

      <Footer />
    </>
  )
}
