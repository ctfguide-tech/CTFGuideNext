import { useRouter } from 'next/router';

export default function Dropdown() {
  const router = useRouter();

  return (
    <div className="mt-10 flex-none pl-4 pr-4 border-none ">
      <select
        className="w-full p-2 text-lg font-medium text-white bg-neutral-800 border-none rounded"
        onChange={(e) => router.push(e.target.value, null, { shallow: true })}
      >
        <option value="../settings">General</option>
        <option value="../settings/security">Security</option>
        <option value="../settings/preferences">Email Preferences</option>
        <option value="../settings/billing">Billing</option>
      </select>
    </div>
  );
}