import Head from 'next/head'
import Link from 'next/link'

export default function Register() {
  return (
    <>
      <Head>
        <title>Sign Up - CTFGuide</title>
      </Head>
    
      <div style={{ fontFamily: "Poppins, sans-serif", height: "100vh" }} className="flex min-h-full animate__animated animate__fadeIn">
      <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className=" mx-auto w-full max-w-sm lg:w-96">
          <div>
            <Link to="../" className="my-auto flex">
              <img
                className="h-10 w-10 zimg"
                src="../../CTFGuide trans dark.png"
                alt="CTFGuide"
              />
              <h1 className='text-white text-xl my-auto'>CTFGuide</h1>
            </Link>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">Register</h2>
            <p className="mt-2 text-sm text-gray-600">
              Or{' '}
              <a href="./login" className="font-medium text-blue-600 hover:text-blue-500">
                login to your account
              </a>
            </p>
          </div>

          <div className="mt-8">
            <div>
              <div hidden>
                <p className="text-sm font-medium text-white">Sign up with</p>

                <div className="mt-2 grid grid-cols-1 gap-3 hidden">


                  <div>
                    <a
                      style={{ backgroundColor: "#212121" }}
                      href="#"
                      className="inline-flex w-full justify-center rounded-md   py-2 px-4 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50"
                    >
                      <span className="sr-only">Sign up with Google</span>
                      <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                        <clipPath id="p.0"> <path d="m0 0l20.0 0l0 20.0l-20.0 0l0 -20.0z" clipRule="nonzero" /> </clipPath> <g clipPath="url(#p.0)"> <path fill="currentColor" fillOpacity="0.0" d="m0 0l20.0 0l0 20.0l-20.0 0z" fillRule="evenodd" /> <path fill="currentColor" d="m19.850197 8.270351c0.8574047 4.880001 -1.987587 9.65214 -6.6881847 11.218641c-4.700598 1.5665016 -9.83958 -0.5449295 -12.08104 -4.963685c-2.2414603 -4.4187555 -0.909603 -9.81259 3.1310139 -12.6801605c4.040616 -2.867571 9.571754 -2.3443127 13.002944 1.2301085l-2.8127813 2.7000687l0 0c-2.0935059 -2.1808972 -5.468274 -2.500158 -7.933616 -0.75053835c-2.4653416 1.74962 -3.277961 5.040613 -1.9103565 7.7366734c1.3676047 2.6960592 4.5031037 3.9843292 7.3711267 3.0285425c2.868022 -0.95578575 4.6038647 -3.8674583 4.0807285 -6.844941z" fillRule="evenodd" /> <path fill="currentColor" d="m10.000263 8.268785l9.847767 0l0 3.496233l-9.847767 0z" fillRule="evenodd" /> </g>
                      </svg>
                    </a>
                  </div>

                 
                </div>
              </div>

              <div className="hidden relative mt-6">

                <div className="relative flex justify-center text-sm">
                  <span className=" px-2 text-gray-500">Or use your email</span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="space-y-6">
                <div id="error" className="hidden text-white bg-blue-900 animate_animated animate__fadeIn border border-blue-500 px-2 py-2 rounded-lg">
                  <p className="text-white text-sm text-center">There was an error when trying to log you in.</p>
                </div>


                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      style={{ backgroundColor: "#212121", borderStyle: "none" }}
                      id="email-address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="block w-full appearance-none rounded-md text-white  px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="password" className="block text-sm font-medium text-white">
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      style={{ backgroundColor: "#212121", borderStyle: "none" }}
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="block w-full appearance-none text-white rounded-md  px-3 py-2  shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="password" className="block text-sm font-medium text-white">
                   Confirm Password
                  </label>
                  <div className="mt-1">
                    <input
                      style={{ backgroundColor: "#212121", borderStyle: "none" }}
                      id="cpassword"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="block w-full appearance-none text-white rounded-md  px-3 py-2  shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      style={{ backgroundColor: "#212121", borderStyle: "none" }}
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-white">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                      Forgot your password?
                    </a>
                  </div>
                </div>

                <div>
                  <button
                    
                    id="registerBtn"
                    className="flex w-full justify-center rounded-md border border-transparent bg-blue-700 hover:shadow-lg hover:shadow-blue-500/00 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none "
                  >
                    Create an account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative  w-0 flex-1 lg:block">
        <img
          className="absolute inset-0 h-full w-full object-cover "
          src="https://images.unsplash.com/photo-1633259584604-afdc243122ea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
          alt=""
        />


      </div>


    </div>
    </>
  )
}
