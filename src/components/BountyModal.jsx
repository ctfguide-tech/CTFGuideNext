import { XMarkIcon, LockClosedIcon, CodeBracketIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { Fragment } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    { name: 'Critical', value: bounty.rewards.critical, color: 'text-red-400' },
    { name: 'High', value: bounty.rewards.high, color: 'text-orange-400' },
    { name: 'Medium', value: bounty.rewards.medium, color: 'text-yellow-400' },
    { name: 'Low', value: bounty.rewards.low, color: 'text-blue-400' },
  ];
  
  const colors = bounty.requiredRank ? rankColors[bounty.requiredRank] || rankColors.Gold : {};
  const isLocked = !!bounty.requiredRank;

  const handleStartHacking = () => {
    // This could navigate to a specific URL or trigger an action to create a container
  //  window.open(`https://replit.com`, '_blank');
  toast.error('No available environments yet.');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4 transition-opacity duration-300" onClick={onClose}>
      <div 
        className="bg-neutral-900 border border-neutral-700/50 text-white w-full max-w-7xl max-h-[90vh] overflow-y-auto  shadow-2xl flex"
        onClick={e => e.stopPropagation()}
      >
        {/* Left Side: Main Details */}
        <div className="w-2/3 p-8 border-r border-neutral-800">
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center">
                    <img src={bounty.logo} alt={`${bounty.company} logo`} className="h-16 w-16 mr-5 p-1 bg-white/10 "/>
                    <div>
                        <p className="text-sm font-medium text-blue-400">{bounty.company}</p>
                        <h2 className="text-3xl font-bold text-white">{bounty.title}</h2>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className=" text-neutral-500 hover:text-white transition-colors"
                >
                    <XMarkIcon className="h-7 w-7" />
                </button>
            </div>

            <div className={isLocked ? 'filter blur-sm brightness-50' : ''}>
                {bounty.requiredRank && (
                    <div className={`mb-6 p-4 ${colors.bg} border ${colors.border}  flex items-center`}>
                        <LockClosedIcon className={`h-6 w-6 ${colors.iconText} mr-3 flex-shrink-0`} />
                        <div>
                            <h3 className={`text-lg font-semibold ${colors.titleText}`}>Rank Required</h3>
                            <p className={`${colors.bodyText} text-sm`}>
                                This bounty is exclusive to researchers with the <span className="font-bold">{bounty.requiredRank}</span> rank.
                            </p>
                        </div>
                    </div>
                )}

                <p className="mt-4 text-neutral-300 text-base leading-relaxed">{bounty.description}</p>

                <div className="mt-8">
                    <h3 className="text-xl font-semibold text-white mb-4">Submission History</h3>
                    {bounty.history && bounty.history.length > 0 ? (
                        <div className="flow-root">
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
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-neutral-300 sm:pl-0">{finding.user}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-neutral-400">{finding.vulnerability}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-green-400">${finding.reward.toLocaleString()}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-neutral-500">{new Date(finding.date).toLocaleDateString()}</td>
                                    </tr>
                                    ))}
                                </tbody>
                                </table>
                            </div>
                            </div>
                        </div>
                    ) : (
                    <div className="text-center py-8 px-4 bg-neutral-800/50 ">
                        <p className="text-neutral-400">No public submissions yet.</p>
                        <p className="text-sm text-neutral-500">Be the first to find a vulnerability!</p>
                    </div>
                    )}
                </div>
            </div>
        </div>

        {/* Right Side: Rewards, Scope & Actions */}
        <div className="w-1/3 p-8 bg-neutral-800/30">
            <div className=" top-0">
                {!isLocked ? (
                    <>
                        <h3 className="text-xl font-semibold text-white mb-4">Attack Environment</h3>
                        <button
                            onClick={handleStartHacking}
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4  transition-colors text-lg"
                        >
                            <CodeBracketIcon className="h-6 w-6"/>
                            <span>Start Hacking</span>
                        </button>

                        <button
                            onClick={handleStartHacking}
                            className="mt-4 w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4  transition-colors text-lg"
                        >
                            <SparklesIcon className="h-6 w-6"/>
                            <span>Make a Submission</span>
                        </button>
                    </>
                ) : (
                    <div className={`p-6 text-center ${colors.bg} border ${colors.border}`}>
                        <LockClosedIcon className={`h-12 w-12 ${colors.iconText} mx-auto mb-3`} />
                        <h3 className={`text-2xl font-bold ${colors.titleText}`}>Bounty Locked</h3>
                        <p className={`${colors.bodyText} mt-2`}>
                            This bounty requires <span className="font-bold">{bounty.requiredRank}</span> rank to access.
                        </p>
                        <button 
                            className="mt-6 w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 transition-colors"
                        >
                            Unlock with PRO
                        </button>
                    </div>
                )}

                <div className={isLocked ? 'filter blur-sm' : ''}>
                    <div className="mt-8">
                        <h3 className="text-xl font-semibold text-white mb-4">Rewards</h3>
                        <div className="space-y-2">
                            {rewardTiers.map(tier => (
                            <div key={tier.name} className="flex justify-between items-center bg-neutral-800/50 p-3 ">
                                <span className={`font-medium ${tier.color}`}>{tier.name}</span>
                                <span className="font-semibold text-white">${parseInt(tier.value).toLocaleString()}</span>
                            </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8">
                        <h3 className="text-xl font-semibold text-white mb-2">Scope & Vulnerabilities</h3>
                        <div className="mt-4">
                            <h4 className="text-lg font-medium text-neutral-300 mb-2">Targets</h4>
                            <ul className="space-y-1 list-none">
                            {bounty.targets.map(target => (
                                <li key={target} className="text-sm text-neutral-400 bg-neutral-800/50 p-2 font-mono">{target}</li>
                            ))}
                            </ul>
                        </div>
                        <div className="mt-4">
                            <h4 className="text-lg font-medium text-neutral-300 mb-2">Vulnerability Types</h4>
                            <div className="flex flex-wrap gap-2">
                            {bounty.vuln_types.map(vuln => (
                                <span key={vuln} className="inline-flex items-center bg-neutral-700 px-3 py-1 text-sm font-medium text-neutral-200">
                                {vuln}
                                </span>
                            ))}
                            </div>
                            <ToastContainer position="bottom-right" theme="dark" />

                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
 
    </div>
    
  );
} 