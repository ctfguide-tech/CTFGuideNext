import { useRouter } from 'next/router';

export default function Dropdown({ tab }) {
  const router = useRouter();

  return (
    <div className="mb-6 lg:mb-0">
      <select
        className="w-full rounded-lg border border-neutral-600 bg-neutral-800 px-4 py-3 text-base font-medium text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
        value={tab}
        onChange={(e) => router.push(e.target.value, null, { shallow: true })}
      >
        <option value="../settings">General</option>
        <option value="../settings/security">Security</option>
        <option value="../settings/preferences">Email Preferences</option>
        <option value="../settings/billing">Billing</option>
        <option value="../settings/account-management">
          Account Management
        </option>
      </select>
    </div>
  );
}
