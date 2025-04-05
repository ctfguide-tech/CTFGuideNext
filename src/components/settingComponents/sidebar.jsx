import Link from 'next/link';
import { useRouter } from 'next/router'

export default function Sidebar() {
  const router = useRouter()
  return (
    <div
      className="mt-10 flex-none border-r pl-10 pr-10 text-gray-900 sm:pl-4 sm:pr-4"
      style={{ borderColor: '#212121' }}
    >
      <ul className="mr-2 py-2">
        <li className="py-1">
          <Link href="../settings" passHref>
            <div className="px-2 py-1 text-lg font-medium text-white hover:text-gray-400 sm:text-base">
              General
            </div>
          </Link>
        </li>
        <li className="py-1">
          <Link href="../settings/security" passHref>
            <div className="px-2 py-1 text-lg font-medium text-white hover:text-gray-400 sm:text-base">
              Security
            </div>
          </Link>
        </li>
        <li className="py-1">
          <Link href="../settings/preferences" passHref>
            <div className="px-2 py-1 text-lg font-medium text-white hover:text-gray-400 sm:text-base">
              Email Preferences
            </div>
          </Link>
        </li>
        <li className="py-1">
          <Link href="../settings/billing" passHref>
            <div className="px-2 py-1 text-lg font-medium text-white hover:text-gray-400 sm:text-base">
              Billing
            </div>
          </Link>
        </li>
      </ul>
    </div>
  );
}