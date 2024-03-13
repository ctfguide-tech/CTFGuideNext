import React from 'react';
import Link from 'next/link';

function SettingsNav() {
  return (
    <nav className="bg-gray-800 text-white p-4 rounded-lg">
      <ul className="flex space-x-4">
        <li>
          <Link href="/settings/account">
            <a className="hover:underline">Account Settings</a>
          </Link>
        </li>
        <li>
          <Link href="/settings/privacy">
            <a className="hover:underline">Privacy Settings</a>
          </Link>
        </li>
        <li>
          <Link href="/settings/notifications">
            <a className="hover:underline">Notification Settings</a>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default SettingsNav;
