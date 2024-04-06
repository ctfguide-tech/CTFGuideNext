import Link from "next/link";

export function Suggest() {
  return (
    <>
      <h1
        className="mt-6 mb-2 mt-2 text-xl tracking-tight text-gray-300    "
      >
        {' '}
        RECOMMENDATIONS
      </h1>

      <div className="mb-5 grid grid-cols-2 gap-x-4">
        <div className="">
          <Link href='/challenges/cypher_decoding'>
            <div className="  relative isolate overflow-hidden  rounded-md bg-black/10 bg-neutral-900 pb-4   ">
              <div className="relative mx-auto max-w-7xl  px-5">
                <div className="mx-auto lg:mx-0 lg:max-w-3xl">
                  <div className="mt-4 text-lg leading-8 text-gray-300">
                    <h1 className=" text-xl text-white">Suggested for you </h1>
                    <h1 className="text-2xl font-semibold text-white">Cypher Decoding</h1>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
