import * as React from 'react';

export default function UpgradeBox() {
  const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;
  return (
    <div className="h-[575px] w-[650px] rounded-xl bg-neutral-800 shadow-md max-md:w-full">
      <div className="w-full justify-between rounded-t-xl bg-gradient-to-r from-amber-500 via-yellow-300 via-60% to-amber-500 py-8 text-black">
        <h3 className="mx-4 text-center text-4xl font-bold">PRO Account</h3>
      </div>

      <div className="w-full text-lg text-white">
        <h4 className="mt-4 bg-gradient-to-r from-amber-600 from-35% via-yellow-400 via-50% to-amber-700 to-75% bg-clip-text text-center text-2xl font-semibold text-transparent ">
          PRO features
        </h4>
        <ul className="ml-12 grid list-inside list-none grid-cols-2">
          <li className="mt-8">
            <i class="fa-solid fa fa-bolt mr-2 text-amber-500"></i>
            More
            <span className="font-black"> powerful</span>, virtualized
            Kubernetes containers
          </li>
          <li className="mt-8">
            <i class="fa-solid fas fa-brush pr-2"></i>
            <span className="text-amber-500">Customized </span>
            images
          </li>
          <li className="mt-12">
            <i class="fa-sharp fa-regular fa fa-clock pr-2"></i>
            Unlimited container time
          </li>
          <li className="mt-8">
            {/* Placeholder */} <i class="fa-solid fa fa-certificate mr-2"></i>A
            cool badge on your profile to show your support!
          </li>
          <li className="mt-8">
            <span className="text-blue-600">
              <i class="fa-regular fa fa-comment pr-2"></i>
              Blue name colors
            </span>{' '}
            across the site
          </li>
        </ul>
      </div>
      <div className="mt-12 flex justify-end">
        <a className="mr-20 mt-10 text-white/70" href={`${baseUrl}/subscribe`}>
          Learn more
        </a>
        <div className="m-6 w-3/5 items-center justify-center rounded-[45px] bg-black py-3.5 text-center text-white shadow-sm max-md:mx-5 max-md:mr-2.5">
          Upgrade • $4.99/month
        </div>
      </div>
    </div>
  );
}
