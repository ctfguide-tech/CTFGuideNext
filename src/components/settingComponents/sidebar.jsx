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
          <button className="px-2 py-1 text-lg font-medium text-white hover:text-gray-400 sm:text-base"
            onClick={() => router.push('../settings', null, { shallow: true })}>
            General
          </button>
        </li>
        <li className="py-1">
          <button className="px-2 py-1 text-lg font-medium text-white hover:text-gray-400 sm:text-base"
            onClick={() => router.push('../settings/security', null, { shallow: true })}>
            Security
          </button>
        </li>
        <li className="py-1">
          <button className="px-2 py-1 text-lg font-medium text-white hover:text-gray-400 sm:text-base"
            onClick={() => router.push('../settings/preferences', null, { shallow: true })}>
            Email Preferences
          </button>
        </li>
        <li className="py-1">
          <button className="px-2 py-1 text-lg font-medium text-white hover:text-gray-400 sm:text-base"
            onClick={() => router.push('../settings/billing', null, { shallow: true })}>
            Billing
          </button>
        </li>
      </ul>
    </div>
  );
}