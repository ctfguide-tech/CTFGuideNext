import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Sidebar() {
  //useState and toggle function
  const [isopen, setOpen] = useState(true);
  const toggleMenu = () => setOpen(!isopen);

  const router = useRouter();
  return (
    <div>
      <button onClick={toggleMenu} className="  p-3 text-white sm:hidden">
        <svg
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>

      {/* Menu */}
      {isopen && (
        <div
          className={`mt-10 block flex-none border-r pl-10 pr-10 text-gray-900 `}
          style={{ borderColor: '#212121' }}
        >
          <ul className="mr-2 py-2">
            <li className="py-1">
              <button
                className="px-2 py-1  text-lg font-medium text-white hover:text-gray-400"
                onClick={() =>
                  router.push('../settings', null, { shallow: true })
                }
              >
                General
              </button>
            </li>
            <li className="py-1 ">
              <button
                className="px-2 py-1  text-lg font-medium text-white hover:text-gray-400"
                onClick={() =>
                  router.push('../settings/security', null, { shallow: true })
                }
              >
                Security
              </button>
            </li>
            <li className="py-1 ">
              <button
                className="px-2 py-1 text-lg font-medium text-white hover:text-gray-400"
                onClick={() =>
                  router.push('../settings/preferences', null, {
                    shallow: true,
                  })
                }
              >
                Preferences
              </button>
            </li>
            <li className="py-1 ">
              <button
                className="px-2 py-1  text-lg font-medium text-white hover:text-gray-400"
                onClick={() =>
                  router.push('../settings/billing', null, { shallow: true })
                }
              >
                Billing
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
