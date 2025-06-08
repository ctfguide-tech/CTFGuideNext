import { XMarkIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { Fragment } from 'react';

const rankColors = {
    Gold: {
        bg: 'bg-yellow-900/50',
        border: 'border-yellow-700/50',
        iconText: 'text-yellow-300',
        titleText: 'text-yellow-200',
        bodyText: 'text-yellow-300/80',
    },
    Diamond: {
        bg: 'bg-cyan-900/50',
        border: 'border-cyan-700/50',
        iconText: 'text-cyan-300',
        titleText: 'text-cyan-200',
        bodyText: 'text-cyan-300/80',
    },
};

export function BountyModal({ bounty, onClose }) {
  if (!bounty) return null;

  const rewardTiers = [
    { name: 'Critical', value: bounty.rewards.critical },
    { name: 'High', value: bounty.rewards.high },
    { name: 'Medium', value: bounty.rewards.medium },
    { name: 'Low', value: bounty.rewards.low },
  ];
  
  const colors = bounty.requiredRank ? rankColors[bounty.requiredRank] || rankColors.Gold : {};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-neutral-800 text-white w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-neutral-700 relative" onClick={e => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        <div className="p-8">
          <div className="flex items-center mb-4">
            <img src={bounty.logo} alt={`${bounty.company} logo`} className="h-12 w-12 mr-4"/>
            <div>
              <h2 className="text-3xl font-bold text-white">{bounty.title}</h2>
              <p className="text-sm font-medium text-blue-400 mt-1">{bounty.company}</p>
            </div>
          </div>
          {bounty.requiredRank && (
            <div className={`mt-4 p-4 ${colors.bg} border ${colors.border} rounded-lg flex items-center`}>
                <LockClosedIcon className={`h-6 w-6 ${colors.iconText} mr-3 flex-shrink-0`} />
                <div>
                    <h3 className={`text-lg font-semibold ${colors.titleText}`}>Rank Required</h3>
                    <p className={`${colors.bodyText}`}>
                        This bounty is exclusive to researchers with the <span className="font-bold">{bounty.requiredRank}</span> rank.
                    </p>
                </div>
            </div>
          )}
          <p className="mt-4 text-gray-300">{bounty.description}</p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Rewards</h3>
              <div className="mt-2 space-y-2">
                {rewardTiers.map(tier => (
                  <div key={tier.name} className="flex justify-between items-center bg-neutral-700/50 p-2">
                    <span className="font-medium text-gray-300">{tier.name}</span>
                    <span className="font-semibold text-green-400">${tier.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Scope & Vulnerabilities</h3>
              <div className="mt-2">
                <h4 className="text-md font-medium text-white">Targets</h4>
                <ul className="mt-1 list-disc list-inside text-gray-400 text-sm">
                  {bounty.targets.map(target => <li key={target}>{target}</li>)}
                </ul>
              </div>
              <div className="mt-4">
                <h4 className="text-md font-medium text-white">Vulnerability Types</h4>
                <div className="mt-1 flex flex-wrap gap-2">
                  {bounty.vuln_types.map(vuln => (
                    <span key={vuln} className="inline-flex items-center bg-gray-700 px-2 py-0.5 text-xs font-medium text-gray-300">
                      {vuln}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-white">Submission History</h3>
            {bounty.history && bounty.history.length > 0 ? (
              <div className="mt-4 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <table className="min-w-full divide-y divide-neutral-700">
                      <thead>
                        <tr>
                          <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-0">User</th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Vulnerability</th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Reward</th>
                          <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-800">
                        {bounty.history.map((finding, index) => (
                          <tr key={index}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-300 sm:pl-0">{finding.user}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400">{finding.vulnerability}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400">${finding.reward.toLocaleString()}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400">{finding.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-gray-400">No public submissions yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 