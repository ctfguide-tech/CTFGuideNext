export function GoToCreate() {
    return (
        <>
            <div className='grid grid-cols-2 gap-x-4 mb-5 mt-12'>
                <div style={{ backgroundImage: "url('http://jasonlong.github.io/geo_pattern/examples/xes.png')" }} class="shadow-md shadow-blue-500/40 hover:shadow-blue-500/80 flex px-4 py-3 rounded-lg cursor-pointer">
                    <div className=''>
                        <h1 className='text-3xl text-white font-semibold'>Welcome!</h1>
                        <h1 className='text-md text-white'>These challenges were created by the CTFGuide community!</h1>
                    </div>
                </div>
                <a href="../create" style={{ backgroundImage: "url('http://jasonlong.github.io/geo_pattern/examples/xes.png')" }} class="shadow-md shadow-blue-500/40 hover:shadow-blue-500/80 flex px-4 py-3 rounded-lg cursor-pointer">
                    <button>
                        <div className=''>
                            <h1 className='text-3xl text-white font-semibold'>Want to contribute?</h1>
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
        <div className='grid grid-cols-2 gap-x-4 mb-12 mt-12'>
            <a href="../learn" style={{ backgroundImage: "url('http://jasonlong.github.io/geo_pattern/examples/xes.png')" }} class="shadow-md shadow-blue-500/40 hover:shadow-blue-500/80 flex px-4 py-3 rounded-lg cursor-pointer">
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