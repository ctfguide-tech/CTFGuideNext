export function GoToCreate() {
    return (
        <>
            <div className='grid md:grid-cols-2 grid-cols-1 gap-x-4 mb-5 mt-12'>
                <div style={{ backgroundImage: "url('http://jasonlong.github.io/geo_pattern/examples/xes.png')" }} class="mb-2 md:mb-0 shadow-md shadow-blue-500/40 hover:shadow-blue-500/80 flex px-4 py-3 rounded-lg cursor-pointer">
                    <div className=''>
                        <h1 className='text-2xl md:text-3xl text-white font-semibold'>Welcome!</h1>
                        <h1 className='text-md text-white'>These challenges were created by the CTFGuide community!</h1>
                    </div>
                </div>
                <a href="../create" style={{ backgroundImage: "url('http://jasonlong.github.io/geo_pattern/examples/xes.png')" }} class="shadow-md shadow-blue-500/40 hover:shadow-blue-500/80 flex px-4 py-3 rounded-lg cursor-pointer">
                    <button>
                        <div className=''>
                            <h1 className='text-2xl md:text-3xl text-white font-semibold'>Want to contribute?</h1>
                                <div className="flex">
                                    <h1 className='text-md text-white mr-2'>Head over to the Creators Dashboard</h1><div class="text-white fas fa-arrow-right mt-1"></div>
                                </div>
                        </div>
                    </button>
                </a>
            </div>
        </>
    )
}

export function ProblemSetCards() {
    return (
        <>
        <div className='  mb-12 mt-12 mx-auto text-center'>
            <a href="../learn"  style={{ backgroundImage: "url('https://camo.githubusercontent.com/92d956b92e76d7be2da5dcdc55bf806f719ecab7643713fc6f13d1a303bf26f3/687474703a2f2f6a61736f6e6c6f6e672e6769746875622e696f2f67656f5f7061747465726e2f6578616d706c65732f74657373656c6c6174696f6e2e706e67')", backgroundSize: "cover" }} class="mx-auto text-center  background-cover shadow-md shadow-blue-500/40 hover:shadow-blue-500/80 flex px-4 py-3 rounded-lg cursor-pointer">
                <button>
                    <div className=''>
                        <h1 className='text-3xl text-white font-semibold'>Don't know where to start?</h1>
                        <div className="flex">
                            <h1 className='text-md text-white mr-2'>Touch up on some concepts in a Learning Module</h1><div class="text-white fas fa-arrow-right mt-1"></div>
                        </div>
                    </div>
                </button>
            </a>
        </div>
        </>
    )
}