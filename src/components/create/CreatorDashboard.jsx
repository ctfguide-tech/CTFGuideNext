import Link from "next/link";

export function CreatorDashboard() {
    return (
        <>
        <div className="bg-[#212121] w-2/3 mx-auto mt-10">
            <Link href={"./create/new"} className='mt-1 pb-10 mt-4 rounded-lg bg-[#212121] hover:bg-[#2c2c2c]'>
                <img className='w-full h-5 rounded-t-lg object-cover' src={"http://jasonlong.github.io/geo_pattern/examples/tessellation.png"}></img>
                <h1 className='text-white text-2xl mx-auto ml-10 mt-7 flex'>
                    <div className="text-4xl font-bold mt-7 mb-10 my-auto">Creator Dashboard 🛠️</div>
                </h1>
                <div className="grid grid-cols-9 mt-0 flex items-center ml-auto my-auto">
                    <h1 className='col-end-1 col-span-2 text-white text-md mx-auto ml-10 mt-7 mb-7 flex'>Create community challenges! See Guidelines for creation policies.
                    </h1>
                    {/**
                     * <div className="col-end-1 col-span-1 px-10 py-2.5 mx-auto text-center rounded-lg bg-neutral-900">
                        <div className="text-white text-2xl">1000</div>
                        <div className="mt-1 text-white text-sm">Views</div>
                    </div>

                    <div className="col-end-2 col-span-1 px-10 py-2.5 mx-auto text-center rounded-lg bg-neutral-900">
                        <div className="text-white text-2xl">1000</div>
                        <div className="mt-1 text-white text-sm">Views</div>
                    </div>

                    <div className="col-end-3 col-span-1 px-10 py-2.5 mx-auto text-center rounded-lg bg-neutral-900">
                        <div className="text-white text-2xl">1000</div>
                        <div className="mt-1 text-white text-sm">Views</div>
                    </div>
                     */}

                    <div className="rounded-md col-end-9 col-span-3 mb-3">
                        <div
                        className={`rounded-md px-2 py-1 mx-auto text-center mt-1 mt-2 bg-[#2c2c2c] hover:bg-[#2e2e2e]`}
                        >
                            <h1 className='text-white text-2xl mx-auto ml-9 mt-1 mb-1 flex'>Create New</h1>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
        </>
    )
}