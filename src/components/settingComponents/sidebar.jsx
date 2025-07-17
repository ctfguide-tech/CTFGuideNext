import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Sidebar() {
  const router = useRouter();
  return (
    <div
      className="mt-10 flex-none border-r pl-10 pr-10 text-gray-900 sm:pl-4 sm:pr-4"
      style={{ borderColor: '#212121' }}
    >
      <ul className="mr-2 list-none py-2">
        <li className="py-1">
          <Link href="../settings" passHref>
            <div className="flex items-center px-2 py-1 text-lg font-medium text-white hover:text-gray-400 sm:text-base">
              <div className="mr-2 h-1.5 w-1.5 rounded-full bg-blue-600"></div>
              General
            </div>
          </Link>
        </li>
        <li className="py-1">
          <Link href="../settings/security" passHref>
            <div className="flex items-center px-2 py-1 text-lg font-medium text-white hover:text-gray-400 sm:text-base">
              <div className="mr-2 h-1.5 w-1.5 rounded-full bg-blue-600"></div>
              Security
            </div>
          </Link>
        </li>
        <li className="py-1">
          <Link href="../settings/preferences" passHref>
            <div className="flex items-center px-2 py-1 text-lg font-medium text-white hover:text-gray-400 sm:text-base">
              <div className="mr-2 h-1.5 w-1.5 rounded-full bg-blue-600"></div>
              Email Preferences
            </div>
          </Link>
        </li>
        <li className="py-1">
          <Link href="../settings/billing" passHref>
            <div className="flex items-center px-2 py-1 text-lg font-medium text-white hover:text-gray-400 sm:text-base">
              <div className="mr-2 h-1.5 w-1.5 rounded-full bg-blue-600"></div>
              Billing
            </div>
          </Link>
        </li>

        {/* Divider */}
        <li className="py-2">
          <div className="h-px bg-neutral-700"></div>
        </li>

        {/* Account Management Section */}
        <li className="py-1">
          <Link href="../settings/account-management" passHref>
            <div className="flex items-center px-2 py-1 text-lg font-medium text-red-400 hover:text-red-300 sm:text-base">
              <div className="mr-2 h-1.5 w-1.5 rounded-full bg-red-500"></div>
              Account Management
            </div>
          </Link>
        </li>
      </ul>
    </div>
  );
}
