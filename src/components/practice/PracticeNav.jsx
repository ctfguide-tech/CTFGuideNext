import { Logo } from '@/components/Logo';
import { ArrowPathRoundedSquareIcon } from '@heroicons/react/20/solid';

export function PracticeNav() {
  return (
    <>
      <div
        className=" mt-8 flex-none text-neutral-900 w-full   mx-auto rounded-sm shadow-lg"
        style={{ borderColor: '#212121' }}
      >
        <hr className='border-white/10 mb-3'></hr>
        <h2 className="flex text-blue-600 px-4 mb-3 ml-4 mx-auto">NAVIGATION<ArrowPathRoundedSquareIcon className='ml-4 h-6'/></h2>
        <ul className="">
          <li className="py-1 px-2 hover:bg-neutral-800/60 rounded-sm border border-white/10 hover:border-white/30">
            <a
              href="/practice/hub"
              className="py-2 px-2 text-lg font-medium text-white"
            >
              <i class="fas fa-laptop-code mr-2"></i>Hub
            </a>
          </li>
          <li className="mb-1 py-1 px-2 hover:bg-neutral-800/60 border border-white/10 hover:border-white/30">
            <a
              href="../practice"
              className="px-2 py-2 text-lg font-medium text-white"
            >
              <i class="fas fa-list mr-2"></i>All Challenges
            </a>
          </li>
          <li className="hidden mb-1 py-3 px-2 border border-white/10 hover:border-white/50 bg-neutral-800/50 rounded-md mt-8 mx-auto my-auto text-center ">
            <a
              href="https://discord.gg/q3hgRBvgkX"
              className="text-lg font-medium text-white tracking-tight flex"
            >
           Join our community!
           <svg className="ml-2 mr-2 h-16 w-16 fill-current text-[#5865F2]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z"/></svg>
            </a>
          </li>
          <li className="mb-4 py-1 hidden">
            <a
              href="../practice/problems"
              className="px-2 py-1 text-lg font-medium text-white hover:text-gray-400"
            >
              <i class="fas fa-folder-open mr-2"></i>Problem Sets
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}
