import { Container } from '@/components/Container';

export function ExpAsk() {
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
                What's your experience with cybersecurity?{' '}
              </h1>
              <div className="mt-4 grid grid-cols-4 gap-4">
                <button className="flex flex-col items-center justify-center rounded-lg border border-blue-600 bg-blue-900 px-14 py-3 hover:bg-blue-800">
                  <h1 className="text text-white">No experience</h1>
                </button>

                <button className="flex flex-col items-center justify-center rounded-lg border border-green-600 bg-green-900 py-3 hover:bg-green-800">
                  <h1 className="text text-white">
                    I've done some programming, but not much cybersecurity.
                  </h1>
                </button>

                <button className="flex flex-col items-center justify-center rounded-lg border border-red-600 bg-red-900 px-6 py-3 hover:bg-red-800">
                  <h1 className="text text-white">
                    I've done some CTF competitions before.
                  </h1>
                </button>

                <button className="flex flex-col items-center justify-center rounded-lg border border-yellow-600 bg-yellow-900 py-3 hover:bg-yellow-800">
                  <h1 className="text text-white">
                    I've exploited production software before. I'm looking to
                    fine-tune my skills.
                  </h1>
                </button>
              </div>

              <div className="mt-10 w-full rounded-full bg-blue-900  ">
                <div
                  className="rounded-full bg-blue-700 p-0.5 text-center text-xs font-medium leading-none text-blue-100"
                  style={{ width: '45%' }}
                >
                  {' '}
                  25%
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
