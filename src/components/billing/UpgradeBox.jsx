import * as React from 'react';

export default function UpgradeBox() {
  const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;
  return (
    <div className="h-[575px] w-[650px] rounded-xl bg-neutral-800 shadow-md max-md:w-full">
      <div className="flex w-full justify-between rounded-t-xl bg-gradient-to-r from-amber-500 via-yellow-300 via-60% to-amber-500 py-8 text-black">
        <p className="mx-4 text-4xl font-bold">PRO Account</p>
        <p className="mx-12 text-right text-4xl font-bold">$4.99/month</p>
      </div>

      <div className="w-full text-lg text-white">
        <div className="grid grid-cols-2">
          <div className="pl-12 pr-4">
            <p className="mt-6">
              More powerful, virtualized Kubernetes containers
            </p>
            <p className="mt-8">Customized images</p>
            <p className="mt-8">Unlimited container time</p>
          </div>
          <div className="mt-6 pl-6">
            <p>A cool badge on your profile to show your support!</p>
            <p className="mt-8">
              <span className="text-blue-600">Blue name colors</span> on
              comments, profile page, etc
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-end pt-40">
        <a className="mr-20 mt-10 text-white" href={`${baseUrl}/subscribe`}>
          Learn more
        </a>
        <div className="m-6 w-3/5 items-center justify-center rounded-[45px] bg-black py-3.5 text-center text-white shadow-sm max-md:mx-5 max-md:mr-2.5">
          Upgrade • $4.99/month
        </div>
      </div>
    </div>
  );
}
