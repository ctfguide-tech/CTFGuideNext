import { Container } from '@/components/Container';

export function Hero() {
  return (
    <Container>
      <div className="isolate " style={{ fontFamily: 'Poppins, sans-serif' }}>
        <div>
          <div
            className=" flex h-screen px-6 lg:px-8"
            style={{ height: '100vh' }}
          >
            <div className="animate__animated animate__fadeIn mx-auto my-auto max-w-3xl pt-10 pb-32 sm:pt-20 sm:pb-40">
              <div>
                <div>
                  <h1 className="mx-auto my-auto text-4xl font-bold tracking-tight text-white sm:text-center sm:text-6xl">
                    Your personal roadmap for cybersecurity.{' '}
                  </h1>
                  <p className="mx-auto my-auto mt-6 text-lg leading-8 text-gray-400 sm:text-center">
                    Data-driven cybersecurity mastery for the adventurous.{' '}
                  </p>
                  <div className="mt-8 flex gap-x-4 sm:justify-center">
                    <a
                      href="./register"
                      className="inline-block rounded-lg border px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm"
                    >
                      Create an account
                      <span className="ml-2 text-white" aria-hidden="true">
                        &rarr;
                      </span>
                    </a>
                    <a
                      href="./login"
                      className="inline-block rounded-lg px-4 py-1.5 text-base font-semibold leading-7 text-white ring-1 ring-white/10 hover:ring-white/20"
                    >
                      Returning user?
                      <span className="ml-2 text-white" aria-hidden="true">
                        &rarr;
                      </span>
                    </a>
                  </div>
                </div>
                <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden truncate blur-3xl sm:top-[calc(100%-30rem)]">
                  <svg
                    className="relative left-[calc(50%+3rem)] h-[21.1875rem] max-w-none -translate-x-1/2 sm:left-[calc(50%+36rem)] sm:h-[42.375rem]"
                    viewBox="0 0 1155 678"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill="url(#ecb5b0c9-546c-4772-8c71-4d3f06d544bc)"
                      fillOpacity=".3"
                      d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
                    />
                    <defs>
                      <linearGradient
                        id="ecb5b0c9-546c-4772-8c71-4d3f06d544bc"
                        x1="1155.49"
                        x2="-78.208"
                        y1=".177"
                        y2="474.645"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#0034e4" />
                        <stop offset={1} stopColor="#000516" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
