import * as React from 'react';

export default function FreeBox() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  return (
    <>
      <div className="h-[575px] w-[650px] rounded-xl bg-neutral-800 shadow-md max-md:w-full">
        <div className="flex w-full justify-between rounded-t-xl bg-blue-600 py-8 text-black">
          <p className="mx-4 text-4xl font-bold">Standard Account</p>
          <p className="mx-12 text-right text-4xl font-bold">Free</p>
        </div>

        <div className="flex-col">
          <div className="grid grid-cols-2">
            <div className="w-full pl-4 pt-8 text-lg text-white max-md:pl-5">
              <p className="pt-8">Limited terminal time</p>
              <p className="pt-12">Limited terminal resources</p>
              <p className="pt-12">Limited customization options</p>
            </div>

            <div className="w-full rounded-sm bg-neutral-800 px-4 pb-12 pt-8">
              <div className="ml-auto"></div>
              <h1 className="mt-4 font-semibold text-white">Usage Limits</h1>
              <div className="mt-4 flex justify-between">
                <span className="text-sm font-medium text-white">
                  Terminal Usage
                </span>
                <span className="mt-4 text-sm font-medium text-white">0% </span>
              </div>
              <div className="h-2.5  w-full rounded-full bg-neutral-700">
                <div
                  className="h-2.5 rounded-full bg-blue-600"
                  style={{ width: '0%' }}
                ></div>
              </div>
              <div className="mt-6 flex justify-between">
                <span className="text-sm font-medium text-white">
                  CPU Burst Usage
                </span>
                <span className="mt-4 text-sm font-medium text-white">0%</span>
              </div>
              <div className="h-2.5  w-full rounded-full bg-neutral-700">
                <div
                  className="h-2.5 rounded-full bg-blue-600"
                  style={{ width: '0%' }}
                ></div>
              </div>
              <h1 className="mt-6 text-sm text-white ">
                Container Hardware: Standard Compute
              </h1>
            </div>
          </div>
        </div>
        <div className="flex justify-end pt-[46px]">
          <div className="m-6 w-3/5 max-w-full items-center justify-center rounded-[45px] bg-stone-600 bg-opacity-30 py-3.5 text-center text-white/80 shadow-sm max-md:mr-2.5 max-md:mt-10 max-md:px-5">
            Current Plan
          </div>
        </div>
      </div>
    </>
  );
}
