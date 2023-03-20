export function CreatorDashboard() {
    const dummyData = [
        {
            week: 1,
            views: 0,
            attempts: 0,
            successes: 0
        },
        {
            week: 2,
            views: 456,
            attempts: 35,
            successes: 5
        },
        {
            week: 3,
            views: 2348,
            attempts: 378,
            successes: 45
        },
        {
            week: 4,
            views: 0,
            attempts: 0,
            successes: 0
        },
    ]
    return (
        <>


        <div className="w-full" style={{ backgroundColor: "#212121" }}>
                    <div className="flex mx-auto text-center h-28 my-auto">
                        <h1 className='text-4xl text-white mx-auto my-auto font-semibold'>Creator Dashboard</h1>
                    </div>
                </div>        
        </>
    )
}