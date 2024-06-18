import * as React from 'react';

export default function PaidBox() {
  return (
    <div className="flex max-w-[683px] flex-col rounded-xl bg-neutral-800 pb-7 shadow-md">
      <div className="w-full items-start pb-12 pl-24 pr-16 pt-7 text-base font-medium leading-4 text-black bg-blend-lighten mix-blend-plus-lighter max-md:max-w-full max-md:pl-8 max-md:pr-5">
        <span className="text-xl font-bold text-black">Paid</span>
        <br />
        <br />
        <span className="text-3xl font-bold text-black">PRO Account</span>
        <br />
      </div>
      <div className="mt-20 flex w-full flex-col px-12 max-md:mt-10 max-md:max-w-full max-md:px-5">
        <div className="max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col max-md:gap-0">
            <div className="flex w-[35%] flex-col max-md:ml-0 max-md:w-full">
              <div className="flex flex-col text-xl font-medium leading-5 text-white max-md:mt-10">
                <div>Feature 1</div>
                <div className="mt-16 max-md:mt-10">Feature 2</div>
                <div className="mt-16 max-md:mt-10">Feature 3</div>
              </div>
            </div>
            <div className="ml-5 flex w-[65%] flex-col max-md:ml-0 max-md:w-full">
              <div className="mt-36 text-xl font-medium leading-5 text-white max-md:mt-10">
                Payment
                <br />
                <br />
                <span className="text-base">Your next bill is on </span>
                <span className="text-base font-bold">Date </span>
                <span className="text-base ">for </span>
                <span className="text-base font-bold">Price</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 w-[358px] max-w-full items-center justify-center self-end rounded-[45px] bg-stone-500 bg-opacity-30 px-6 py-3.5 text-base font-medium leading-6 text-white shadow-sm max-md:mt-10 max-md:px-5">
          Current Plan
        </div>
      </div>
    </div>
  );
}
