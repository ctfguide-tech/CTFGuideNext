export default function BillingBanner() {
  return (
    <>
      <div className="flex rounded-lg bg-gradient-to-br from-blue-600 to-purple-400 to-70%">
        <img
          className="mb-0 mt-auto w-1/6"
          src={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/DefaultKana.png`}
        />

        <div className="ml-10 grid w-1/2 grid-cols-1 place-items-center max-lg:ml-2">
          <div className="text-lg text-white max-md:hidden">
            Thank you for supporting CTFGuide!
          </div>
          <div className="text-sm text-white max-md:my-2 max-md:text-xs">
            Your
            <span className="bg-gradient-to-r from-amber-600 via-yellow-400 via-65% to-amber-600 bg-clip-text text-lg font-bold text-transparent max-md:text-base">
              {' '}
              Pro
            </span>{' '}
            subscription will renew on
            <span className="font-bold"> 7/21/2024 </span> for
            <span className="font-bold"> $4.99</span>
          </div>
        </div>

        <div className="w-2/6 text-right text-sm text-white max-md:text-xs">
          <button className="m-2">Manage Subscription</button>
        </div>
      </div>
    </>
  );
}
