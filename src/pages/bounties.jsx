import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { useState, useEffect } from 'react';
import { GiftIcon, UsersIcon, CodeBracketSquareIcon, ShieldCheckIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { BountyModal } from '@/components/BountyModal';

const rankColors = {
    Gold: {
        border: 'border-yellow-500',
        text: 'text-yellow-500',
        bg: 'bg-yellow-900/50',
        ring: 'ring-yellow-500/20',
        hoverBorder: 'hover:border-yellow-400',
        focusRing: 'focus:ring-yellow-500',
    },
    Diamond: {
        border: 'border-cyan-500',
        text: 'text-cyan-500',
        bg: 'bg-cyan-900/50',
        ring: 'ring-cyan-500/20',
        hoverBorder: 'hover:border-cyan-400',
        focusRing: 'focus:ring-cyan-500',
    },
};

const mockBounties = [
    {
        id: 5,
        company: 'Synack',
        title: 'Synack - Crowdsourced Security Testing Platform',
        category: 'Security',
        logo: 'https://www.synack.com/wp-content/uploads/2023/04/synack-red-team-svg-2.svg',
        description: 'Exclusive access to our private bug bounty programs. Only for top-ranked researchers.',
        targets: ['platform.synack.com'],
        rewards: { critical: '25000', high: '10000', medium: '5000', low: '1000' },
        vuln_types: ['Web Application', 'Mobile', 'Network', 'Host'],
        history: [],
        requiredRank: 'Diamond'
      },
    {
        id: 4,
        company: 'Cluely',
        title: 'Cluely – Cheat on everything',
        category: 'Desktop AI Assistant',
        logo: 'https://media.licdn.com/dms/image/v2/D560BAQFPDCGXilJm2g/company-logo_200_200/B56ZblmJB2H4AI-/0/1747608705117/cluely_logo?e=2147483647&v=beta&t=JNygewi41TBDr_LIyWVo_smWOhKD2q3GXkos83PZ6ck',
        description: 'Cluely is an AI‑powered desktop assistant that invisibly monitors your screen and audio during meetings, sales calls, coding interviews, or solo workflows—then feeds you context‑aware prompts and answers in real time.',
        targets: ['cluely.com', 'app.cluely.ai'],
        rewards: { critical: '5000', high: '2500', medium: '1000', low: '250' },
        vuln_types: ['Screen/audio privacy', 'Data leakage', 'Access control', 'API security', 'Overlay spoofing'],
        
       
        history: [
            { user: 'hacker_one', vulnerability: 'Critical RCE', reward: 10000, date: '2023-05-15' },
            { user: 'another_user', vulnerability: 'Medium XSS', reward: 2000, date: '2023-04-20' }
          ]
      },
  {
    id: 1,
    company: 'Replit',
    title: 'Replit - The collaborative browser based IDE',
    category: 'Web Application',
    logo: 'https://play-lh.googleusercontent.com/baV9RL2D0iV8JkTtCzSxeLf6XxCJMWQYbyXMqyQfc0OQGtjkCyUenUbLb5tefYfMxfU',
    description: 'Help secure our platform that provides a collaborative, browser-based IDE. We are looking for a wide range of web vulnerabilities.',
    targets: ['replit.com', 'api.replit.com'],
    rewards: { critical: '10000', high: '5000', medium: '2000', low: '500' },
    vuln_types: ['RCE', 'SSRF', 'Container Escape', 'XSS'],
    history: [
      { user: 'hacker_one', vulnerability: 'Critical RCE', reward: 10000, date: '2023-05-15' },
      { user: 'another_user', vulnerability: 'Medium XSS', reward: 2000, date: '2023-04-20' }
    ]
  },
  {
    id: 2,
    company: 'OpenSea',
    title: 'OpenSea - The largest NFT marketplace',
    category: 'Web3',
    logo: 'https://storage.googleapis.com/opensea-static/Logomark/Logomark-Blue.svg',
    description: 'Secure the world\'s largest NFT marketplace. We are offering rewards for vulnerabilities related to smart contracts and our web platform.',
    targets: ['opensea.io', 'api.opensea.io', 'Smart Contracts'],
    rewards: { critical: '100000', high: '25000', medium: '10000', low: '2500' },
    vuln_types: ['Smart Contract Exploit', 'Re-entrancy', 'Transaction Gas Optimization', 'Web3 Injection'],
    history: [
      { user: 'sec_researcher', vulnerability: 'Re-entrancy on listing', reward: 25000, date: '2023-06-01' }
    ],
    requiredRank: 'Gold'
  },
  {
    id: 3,
    company: 'Deel',
    title: 'Deel - The all-in-one HR platform for global teams',
    category: 'Financial',
    logo: 'https://cdn.prod.website-files.com/5f15081919fdf673994ab5fd/66021319743010423fabbff9_Deel-Logo.svg',
    description: 'Help us secure our HR platform for global teams. We are looking for vulnerabilities in our payment systems, and data handling.',
    targets: ['deel.com', 'api.deel.com'],
    rewards: { critical: '15000', high: '7500', medium: '3000', low: '1000' },
    vuln_types: ['Business Logic Errors', 'Payment Flaws', 'Information Disclosure', 'Access Control'],
    history: []
  },
];

function ForStartups() {
    return (
        <div className="bg-neutral-800/50  p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Launch your Bug Bounty</h2>
            <p className="text-neutral-400 text-sm mb-4">
                Secure your startup with our global community of security researchers. We offer managed bounties, seamless deployment, and actionable reports.
            </p>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4  transition-colors text-md">
                List Your Bounty
            </button>
        </div>
    );
}

function TopBounties({ bounties, onBountyClick }) {
  const sortedBounties = [...bounties].sort((a, b) => {
    const maxRewardA = Math.max(...Object.values(a.rewards).map(r => parseInt(r.replace(',', ''))));
    const maxRewardB = Math.max(...Object.values(b.rewards).map(r => parseInt(r.replace(',', ''))));
    return maxRewardB - maxRewardA;
  }).slice(0, 3);

  return (
    <div className="bg-neutral-800/50  p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Top Bounties</h2>
      <ul className="space-y-4">
        {sortedBounties.map(bounty => (
          <li key={bounty.id} onClick={() => onBountyClick(bounty)} className="flex items-center gap-4 cursor-pointer hover:bg-neutral-700/50 p-2  transition-colors">
            <img src={bounty.logo} alt={`${bounty.company} logo`} className="h-10 w-10 flex-shrink-0" />
            <div className="flex-grow">
              <p className="font-semibold text-white">{bounty.company}</p>
              <p className="text-sm text-neutral-400 line-clamp-1">{bounty.title}</p>
            </div>
            <div className="text-lg font-bold text-green-400 flex-shrink-0">
              ${Math.max(...Object.values(bounty.rewards).map(r => parseInt(r.replace(',', '')))).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RecentPayouts({ bounties, onBountyClick }) {
    const allPayouts = bounties.flatMap(bounty =>
        bounty.history.map(payout => ({ ...payout, bounty }))
    ).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

    return (
        <div className="bg-neutral-800/50  p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Recent Payouts</h2>
            <ul className="space-y-4">
                {allPayouts.map((payout, index) => (
                    <li key={index} className="text-sm list-none">
                        <p className="text-neutral-300">
                            <span className="font-bold text-blue-400">{payout.user}</span> was rewarded <span className="font-bold text-green-400">${payout.reward.toLocaleString()}</span> for a {payout.vulnerability} on <button onClick={() => onBountyClick(payout.bounty)} className="font-bold text-yellow-400 hover:underline">{payout.bounty.company}</button>.
                        </p>
                        <p className="text-xs text-neutral-500">{new Date(payout.date).toLocaleDateString()}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function Bounties() {
  const [bounties, setBounties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBounty, setSelectedBounty] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setBounties(mockBounties);
      setLoading(false);
    }, 500);
  }, []);

  const getRewardRange = (rewards) => {
    const rewardValues = Object.values(rewards).map(r => parseInt(r.replace(',', '')));
    const min = Math.min(...rewardValues);
    const max = Math.max(...rewardValues);
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  };

  return (
    <>
      <Head>
        <title>Bug Bounties | CTFGuide</title>
        <meta name="description" content="Find vulnerabilities in real-world startups and get rewarded for your findings." />
      </Head>

      <StandardNav />

      <main className="bg-neutral-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className=" mb-12">
            <h1 className="text-4xl font-bold tracking-tight ">
              Bounties
            </h1>
            <p className=" text-xl text-neutral-400">
              Help secure innovative startups and get rewarded for finding vulnerabilities.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:flex-1">
              {loading ? (
                <div className="flex justify-center items-center">
                  <div className="animate-spin h-12 w-12 border-b-2 border-blue-500 rounded-full"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {bounties.map((bounty) => {
                    const hasRank = !!bounty.requiredRank;
                    const colors = hasRank ? rankColors[bounty.requiredRank] || rankColors.Gold : {};
                    const isLocked = hasRank; // assume user is not high enough rank

                    return (
                        <div key={bounty.id} className="relative">
                             <button
                                onClick={() => !isLocked && setSelectedBounty(bounty)}
                                disabled={isLocked}
                                className={`w-full text-left block overflow-hidden bg-neutral-800 shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-neutral-900 transition-all border-l-4 ${
                                    hasRank
                                    ? `${colors.border} ${colors.hoverBorder} ${colors.focusRing}`
                                    : 'border-transparent hover:border-blue-500 focus:ring-blue-500'
                                } ${isLocked ? 'cursor-not-allowed' : 'hover:bg-neutral-800/80'}`}
                            >
                                <div className={`p-6 ${isLocked ? 'filter blur-sm' : ''}`}>
                                    <div className="flex items-start justify-between">
                                    <div className="flex-grow flex items-center">
                                        <img src={bounty.logo} alt={`${bounty.company} logo`} className="h-10 w-10 mr-4"/>
                                        <div>
                                            <p className="text-sm font-medium text-blue-400">{bounty.company}</p>
                                            <p className="text-xl font-semibold text-white group-hover:text-blue-300 transition-colors">{bounty.title}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2 ml-4 flex-shrink-0">
                                        <span className={`inline-flex items-center bg-neutral-900/50 px-2.5 py-0.5 text-xs font-medium text-neutral-300 ring-1 ring-inset ring-neutral-500/20 rounded-full`}>
                                            {bounty.category}
                                        </span>
                                        {hasRank && (
                                            <span className={`inline-flex items-center ${colors.bg} px-2.5 py-0.5 text-xs font-medium ${colors.text} ring-1 ring-inset ${colors.ring} rounded-full`}>
                                                <LockClosedIcon className="h-3 w-3 mr-1.5" />
                                                Requires {bounty.requiredRank}
                                            </span>
                                        )}
                                    </div>
                                    </div>
                                    <p className="mt-3 text-base text-neutral-400">{bounty.description}</p>
                                    <div className="mt-4 flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <GiftIcon className="h-6 w-6 text-yellow-400" />
                                        <span className="text-lg font-bold text-white">{getRewardRange(bounty.rewards)}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 justify-end">
                                        {bounty.vuln_types.slice(0, 3).map(vuln => (
                                            <span key={vuln} className="inline-flex items-center bg-neutral-700 px-2 py-0.5 text-xs font-medium text-neutral-300 rounded-md">
                                            {vuln}
                                            </span>
                                        ))}
                                        {bounty.vuln_types.length > 3 && (
                                            <span className="inline-flex items-center bg-neutral-700 px-2 py-0.5 text-xs font-medium text-neutral-300 rounded-md">
                                            +{bounty.vuln_types.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                    </div>
                                </div>
                            </button>
                            {isLocked && (
                                <div className="absolute inset-0 flex items-end justify-between p-6 bg-gradient-to-t from-black/80 to-transparent">
                                    <div className="flex items-center">
                                        <LockClosedIcon className={`h-8 w-8 ${colors.text} mr-3`} />
                                        <div>
                                            <h3 className={`text-lg font-bold ${colors.text}`}>Locked</h3>
                                            <p className="text-neutral-300 text-sm">Requires {bounty.requiredRank} Rank</p>
                                        </div>
                                    </div>
                            
                                    <button 
                                        onClick={() => setSelectedBounty(bounty)}
                                        className="bg-gradient-to-r from-yellow-700 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors text-sm"
                                    >
                                        <i className="fa fa-crown"></i> Unlock with PRO
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                  })}
                </div>
              )}
            </div>
            <aside className="lg:w-96 lg:shrink-0">
                <div className="space-y-8">
                    <ForStartups />
                    <TopBounties bounties={bounties} onBountyClick={setSelectedBounty} />
                    <RecentPayouts bounties={bounties} onBountyClick={setSelectedBounty} />
                </div>
            </aside>
          </div>
        </div>
        <BountyModal bounty={selectedBounty} onClose={() => setSelectedBounty(null)} />
      </main>

      <Footer />
    </>
  );
}
