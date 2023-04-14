export function GoToCreate() {
  return (
    <>
      <div className="mb-5 mt-12 grid grid-cols-1 gap-x-4 md:grid-cols-2">
        <div
          style={{
            backgroundImage:
              "url('http://jasonlong.github.io/geo_pattern/examples/xes.png')",
          }}
          class="mb-2 flex cursor-pointer rounded-lg px-4 py-3 shadow-md shadow-blue-500/40 hover:shadow-blue-500/80 md:mb-0"
        >
          <div className="">
            <h1 className="text-2xl font-semibold text-white md:text-3xl">
              Welcome!
            </h1>
            <h1 className="text-md text-white">
              These challenges were created by the CTFGuide community!
            </h1>
          </div>
        </div>
        <a
          href="../create"
          style={{
            backgroundImage:
              "url('http://jasonlong.github.io/geo_pattern/examples/xes.png')",
          }}
          class="flex cursor-pointer rounded-lg px-4 py-3 shadow-md shadow-blue-500/40 hover:shadow-blue-500/80"
        >
          <button>
            <div className="">
              <h1 className="text-2xl font-semibold text-white md:text-3xl">
                Want to contribute?
              </h1>
              <div className="flex">
                <h1 className="text-md mr-2 text-white">
                  Head over to the Creators Dashboard
                </h1>
                <div class="fas fa-arrow-right mt-1 text-white"></div>
              </div>
            </div>
          </button>
        </a>
      </div>
    </>
  );
}

export function ProblemSetCards() {
  return (
    <>
      <div className="  mx-auto mb-12 mt-12 text-center">
    
      </div>
    </>
  );
}
