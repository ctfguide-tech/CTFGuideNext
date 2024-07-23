export default function UpgradeBox() {
  return (
    <>
      <div className="rounded-lg bg-white shadow dark:border-gray-700 dark:bg-neutral-800">
        <div className="w-full rounded-t-lg bg-gradient-to-br from-amber-600 via-yellow-400 via-65% to-amber-600 pb-4 text-center">
          <h5 className="pt-8 text-xl font-medium text-white">Pro plan</h5>
          <div className="text-white">
            <span class="text-3xl font-semibold">$</span>
            <span class="text-5xl font-extrabold tracking-tight">5</span>
            <span class="ms-1 text-xl font-normal">/month</span>
          </div>
          <div className="mx-4 rounded-3xl bg-gray-600/75 py-1 text-sm text-white max-lg:text-xs">
            Yearly subscribers save $5/year
          </div>
        </div>

        <ul className="my-4 space-y-5 px-8">
          <li className="flex items-center">
            <svg
              className="h-4 w-4 flex-shrink-0 text-blue-600"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
            </svg>
            <span className="ms-3 text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
              2 team members
            </span>
          </li>
          <li className="flex">
            <svg
              className="h-4 w-4 flex-shrink-0 text-blue-600"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
            </svg>
            <span className="ms-3 text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
              20GB Cloud storage
            </span>
          </li>
          <li className="flex">
            <svg
              className="h-4 w-4 flex-shrink-0 text-blue-600"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
            </svg>
            <span className="ms-3 text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
              Integration help
            </span>
          </li>
          <li className="flex line-through decoration-gray-500">
            <svg
              className="h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
            </svg>
            <span className="ms-3 text-base font-normal leading-tight text-gray-500">
              Sketch Files
            </span>
          </li>
          <li className="flex line-through decoration-gray-500">
            <svg
              className="h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
            </svg>
            <span className="ms-3 text-base font-normal leading-tight text-gray-500">
              API Access
            </span>
          </li>
          <li className="flex line-through decoration-gray-500">
            <svg
              className="h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
            </svg>
            <span className="ms-3 text-base font-normal leading-tight text-gray-500">
              Complete documentation
            </span>
          </li>
          <li className="flex line-through decoration-gray-500">
            <svg
              className="h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
            </svg>
            <span className="ms-3 text-base font-normal leading-tight text-gray-500">
              24×7 phone & email support
            </span>
          </li>
        </ul>
        <div className="gap-x-2 px-8 pb-8 pt-4">
          <button className="text-md flex w-full justify-center rounded-lg bg-blue-600  py-2 text-center font-medium text-white ">
            Subscribe
          </button>
        </div>
      </div>
    </>
  );
}
