import { Context } from '@/context';
import { useContext } from 'react';

export default function FreeBox() {
  const { role } = useContext(Context);
  return (
    <>
      <div className="rounded-lg  bg-neutral-800 shadow">
        <div className="w-full rounded-t-lg bg-blue-600 pb-8 text-center">
          <h5 className="pt-8 text-xl font-medium text-white">Standard plan</h5>
          <div className="flex items-baseline text-white">
            <span className="mt-4 w-full pb-2 text-4xl font-extrabold tracking-tight">
              Free
            </span>
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
              Access to challenge catalog
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
              Limited terminal time
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
              Limited ads
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
              Custom banner images
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
              Larger file uploads
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
              PRO badge & Colored Username
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
              Access to upcoming beta features
            </span>
          </li>
        </ul>
        <div className="px-8 pb-8 pt-4">
          {role == 'USER' ? (
            <div className="text-md flex w-full justify-center rounded-lg bg-gray-500  py-2 text-center font-medium text-white ">
              Current plan
            </div>
          ): (
            <div className="text-md flex w-full justify-center rounded-lg bg-gray-500  py-2 text-center font-medium text-white ">
              Free Plan 
            </div>
            )}
        </div>
      </div>{' '}
    </>
  );
}
