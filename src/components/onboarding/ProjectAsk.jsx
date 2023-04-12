import { Container } from '@/components/Container';

export function ProjectAsk() {
  return (
    <>
      <div className="flex h-screen items-center justify-center">
        <Container style={{ backgroundColor: '#161716' }} className=" ">
          <h1 className="text-center text-xl  text-white">Onboarding</h1>

          <div
            style={{ backgroundColor: '#161716' }}
            className="mx-auto mt-4 max-w-6xl"
          >
            <div className="my-auto mx-auto px-4  text-center">
              <h1 className="text-3xl font-semibold text-white">
                {' '}
                Let's fine-tune your learning flow.{' '}
              </h1>
              <div className="mt-4 grid grid-cols-2 gap-10">
                <div className="mx-auto w-full text-center">
                  <h1 className="text-xl text-white">
                    Upload your portfolio and write-ups.
                  </h1>
                  <div className="mt-4 flex w-full items-center justify-center">
                    <label
                      for="dropzone-file"
                      className="h-30border-2 dark:hover:bg-bray-800 flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border  border-dashed  border-gray-300 border-gray-800  dark:border-gray-600 "
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          aria-hidden="true"
                          className="mb-3 h-10 w-10 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          ></path>
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span>{' '}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          SVG, PNG, JPG or GIF (MAX. 800x400px)
                        </p>
                      </div>
                      <input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="border-l-4  border-blue-800 px-4 py-1">
                  <h1 className="text-left text-xl font-semibold text-white">
                    Why are we asking this?
                  </h1>
                  <p className="text-left text-white">
                    We use artificial intelligence to analyze your write-ups &
                    projects to better understand your interests and personalize
                    your learning experience based of this data.
                  </p>

                  <h1 className="mt-4 text-left text-xl font-semibold text-white">
                    Do we store these files?
                  </h1>
                  <p className="text-left text-white">
                    Nope, we temporarily store them to analyze and then delete
                    it immediately afterward..
                  </p>
                </div>
              </div>

              <div className="mt-10 w-full rounded-full bg-blue-900  ">
                <div
                  className="rounded-full bg-blue-700 p-0.5 text-center text-xs font-medium leading-none text-blue-100"
                  style={{ width: '50%' }}
                >
                  {' '}
                  50%
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
