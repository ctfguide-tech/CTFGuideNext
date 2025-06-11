import Head from 'next/head';
import Link from 'next/link';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { useState, useEffect } from 'react';
import { GiftIcon, UsersIcon, CodeBracketSquareIcon, ShieldCheckIcon, LockClosedIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { BountyModal } from '@/components/BountyModal';
import { WelcomeModal } from '@/components/WelcomeModal';
import { rankColors, mockBounties } from '@/data/bounties';

function ForStartups() {
    return (
        <div className="bg-neutral-800/50 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Launch your Bug Bounty</h2>
            <p className="text-neutral-400 text-sm mb-4">
                Secure your startup with our global community of security researchers. We offer managed bounties, seamless deployment, and actionable reports.
            </p>
            <Link href="/post-bounty" legacyBehavior>
                <a className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 transition-colors text-md">
                    List Your Bounty
                </a>
            </Link>
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showLockedOnly, setShowLockedOnly] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  useEffect(() => {
    // Check if it's the user's first visit
    const hasVisited = localStorage.getItem('hasViewedBountiesPage');
    if (!hasVisited) {
      setShowWelcomeModal(true);
    }

    const fetchBounties = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bounties`);
        const data = await response.json();
        setBounties(data);
      } catch (error) {
        console.error("Failed to fetch bounties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBounties();
  }, []);

  const handleCloseWelcomeModal = () => {
    setShowWelcomeModal(false);
    localStorage.setItem('hasViewedBountiesPage', 'true');
  };

  const getRewardRange = (rewards) => {
    const rewardValues = Object.values(rewards).map(r => parseInt(r.replace(',', '')));
    const min = Math.min(...rewardValues);
    const max = Math.max(...rewardValues);
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  };

  const categories = ['All', ...new Set(mockBounties.map(b => b.category))];

  const filteredBounties = bounties
    .filter(bounty => {
        if (showLockedOnly && !bounty.requiredRank) {
            return false;
        }
        return true;
    })
    .filter(bounty => {
        const query = searchQuery.toLowerCase();
        if (!query) return true;
        return (
            bounty.title.toLowerCase().includes(query) ||
            bounty.company.toLowerCase().includes(query) ||
            bounty.description.toLowerCase().includes(query)
        );
    })
    .filter(bounty => {
        return selectedCategory === 'All' || bounty.category === selectedCategory;
    });

  return (
    <>
      <Head>
        <title>Bug Bounties | CTFGuide</title>
        <meta name="description" content="Find vulnerabilities in real-world startups and get rewarded for your findings." />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" integrity="sha512-Fo3rlrZj/k7ujTnHg4CGR2D7kSs0v4LLanw2qksYuRlEzO+tcaEPQogQ0KaoGN26/zrn20ImR1DfuLWnOo7aBA==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
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

          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MagnifyingGlassIcon className="h-5 w-5 text-neutral-400" aria-hidden="true" />
                  </div>
                  <input
                      type="text"
                      placeholder="Search by title, company, or description..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-400 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2 pl-10"
                  />
                </div>
              </div>
              <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-neutral-800 border border-neutral-700 text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
              >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="mt-4">
                <label className="flex items-center space-x-2 text-neutral-300">
                    <input
                        type="checkbox"
                        checked={showLockedOnly}
                        onChange={(e) => setShowLockedOnly(e.target.checked)}
                        className="h-4 w-4 rounded border-neutral-600 bg-neutral-800 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Show only locked bounties</span>
                </label>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:flex-1">
              {loading ? (
                <div className="flex justify-center items-center">
                  <div className="animate-spin h-12 w-12 border-b-2 border-blue-500 rounded-full"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredBounties.map((bounty) => {
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
                            
                                    <div className="flex items-center gap-2">
                                
                                        <button 
                                            onClick={() => { /* Handle PRO unlock */ }}
                                            className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors text-sm"
                                        >
                                            <i className="fa-solid fa-crown mr-1"></i> Unlock with PRO
                                        </button>
                                    </div>
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
        <WelcomeModal isOpen={showWelcomeModal} onClose={handleCloseWelcomeModal} />
      </main>

      <Footer />
    </>
  );
}
