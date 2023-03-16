import Link from "next/link";
import { PlusCircleIcon } from '@heroicons/react/20/solid'
import { Card, Title, AreaChart } from "@tremor/react";

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
        <div className="bg-[#212121] hover:bg-[#303030] w-3/4 mx-auto mt-6 mb-6">
            <Link href={"./create/new"} className='pb-10 mt-4 rounded-lg bg-[#212121] hover:bg-[#2c2c2c]'>
                <img className='w-full h-5 rounded-t-lg object-cover' src={"http://jasonlong.github.io/geo_pattern/examples/tessellation.png"}></img>
                <h1 className='text-white text-2xl mx-auto ml-10 mt-4 flex'>
                    <div className="text-3xl font-bold mt-2 mb-4 my-auto">Creator Dashboard</div>
                </h1>
                <div className="ml-6 grid grid-cols-3 mt-3 mb-8 flex items-center my-auto">
                </div>
                    <div className="bottom-0 w-1/4 rounded-lg px-2 py-1 mx-auto text-center border border-gray-300 bg-[#212121] hover:bg-[#313131] shadow-lg flex">
                        <h1 className='text-white text-2xl mx-auto px-6 tracking-wide'>Create New</h1>
                        <PlusCircleIcon className="text-white h-6 mt-1 mr-6"/>
                    </div>
            </Link>
        </div>
        </>
    )
}