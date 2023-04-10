import { Container } from '@/components/Container';

export function RoleAsk() {
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
                What's your role?{' '}
              </h1>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <button className="flex flex-col items-center justify-center rounded-lg border border-blue-600 bg-blue-900 px-14 py-3 hover:bg-blue-800">
                  <h1 className="text-2xl text-white">Educator</h1>
                </button>

                <button className="flex flex-col items-center justify-center rounded-lg border border-green-600 bg-green-900 px-14 py-3 hover:bg-green-800">
                  <h1 className="text-2xl text-white">Individual</h1>
                </button>
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
