
const NotFound = () => {
    return (
        <div className="grid grid-rows-3 grid-cols-3">
            <div>

            </div>
            
            <div>

            </div>

            <div>

            </div>

            <div>

            </div>
            <div className="not-found ">
                <div className="overflow-hidden py-24 sm:py-32  rounded-lg" style={{ backgroundColor: "#212121" }}>
                    <div className='mx-auto text-center w-full mt-20 mb-20 max-w-6xl'>
                        <p className="mt-2 text-6xl font-bold text-white sm:text-4xl"><span className='mt-2 text-4xl font-bold tracking-tight text-blue-600 sm:text-4xl'>Oops!</span> it looks like that page doesn't exist anymore!</p>
                        <p className="mt-2 text-4xl font-bold text-white sm:text-4xl content-center">Go back to our <span className='mt-2 text-4xl font-bold tracking-tight text-blue-600 sm:text-4xl'>homepage!</span></p>
                    </div>
                </div>
            </div>

            <div>

            </div>
        </div>

    );
}

export default NotFound;