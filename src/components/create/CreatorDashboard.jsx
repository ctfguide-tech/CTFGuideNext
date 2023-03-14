import Link from "next/link";

export function CreatorDashboard() {
    return (
        <>
        <div className="bg-[#212121] w-2/3 mx-auto mt-4">
            <Link href={"./create/new"} className='pb-10 mt-4 rounded-lg bg-[#212121] hover:bg-[#2c2c2c]'>
                <img className='w-full h-5 rounded-t-lg object-cover' src={"http://jasonlong.github.io/geo_pattern/examples/tessellation.png"}></img>
                <h1 className='text-white text-2xl mx-auto ml-10 mt-4 flex'>
                    <div className="text-3xl font-bold mt-2 mb-4 my-auto">Creator Dashboard 🛠️</div>
                </h1>
                <div className="grid grid-cols-9 mt-0 flex items-center ml-auto my-auto">
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

                    <div className="rounded-md px-2 py-1 mx-auto text-center ml-10 mt-2 bg-[#2c2c2c] hover:bg-[#313131]">
                            <h1 className='text-white text-2xl mx-auto ml-9 mr-9 flex'>Create New</h1>
                    </div>
                    <h1 className='col-end-1 col-span-2 text-white text-md mx-auto ml-10 mt-4 mb-4 flex'>Create community challenges! See Guidelines for creation policies.
                    </h1>
                </div>
            </Link>
        </div>
        </>
    )
}