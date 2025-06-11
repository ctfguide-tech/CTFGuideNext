import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { useState, useEffect } from 'react';
import { 
  CodeBracketIcon, 
  ArrowRightIcon,
  ShieldCheckIcon,
  GiftIcon,
  BuildingOffice2Icon,
  ClipboardDocumentCheckIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { mockBounties } from '@/data/bounties';
import { useRouter } from 'next/router';

const logos = mockBounties.map(bounty => bounty.logo);

export default function PostBounty() {
  const router = useRouter();
  const [error, setError] = useState('');

  useEffect(() => {
    // Check for error in URL params
    if (router.query.error) {
      setError('Failed to authenticate with GitHub. Please try again.');
    }
  }, [router.query]);

  const handleGitHubConnect = () => {
    if (!process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || !process.env.NEXT_PUBLIC_API_URL) {
      setError('GitHub configuration is missing. Please check your environment variables.');
      return;
    }

    const githubOAuthUrl = new URL('https://github.com/login/oauth/authorize');
    githubOAuthUrl.searchParams.append('client_id', process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID);
    githubOAuthUrl.searchParams.append('scope', 'repo read:user user:email');
    githubOAuthUrl.searchParams.append('redirect_uri', `${process.env.NEXT_PUBLIC_FRONTEND_URL}/post-bounty/github/callback`);
    
    console.log('Redirecting to GitHub:', githubOAuthUrl.toString());
    window.location.href = githubOAuthUrl.toString();
  };

  return (
    <>
      <Head>
        <title>Post a Bounty | CTFGuide</title>
        <meta name="description" content="Launch your bug bounty program with CTFGuide." />
      </Head>

      <StandardNav />

      <main className="bg-neutral-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Launch Your Bug Bounty Program
                </h1>
                <p className="mt-6 text-xl text-neutral-400">
                Join the top companies in securing your software with our community of elite security researchers.
                </p>
                {error && (
                  <div className="mt-4 p-4 bg-red-900/50 text-red-200 rounded-lg">
                    {error}
                  </div>
                )}
            </div>

            <div 
                className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)] group"
            >
                <div className="flex items-center justify-center space-x-16 animate-infinite-scroll group-hover:[animation-play-state:paused]">
                    {logos.map((logo, index) => (
                        <img key={index} className="h-12 w-auto max-w-none" src={logo} alt={`Logo ${index + 1}`} />
                    ))}
                </div>
                <div className="ml-10 flex items-center justify-center space-x-16 animate-infinite-scroll group-hover:[animation-play-state:paused]" aria-hidden="true">
                    {logos.map((logo, index) => (
                        <img key={index + logos.length} className="h-12 w-auto max-w-none" src={logo} alt={`Logo ${index + 1}`} />
                    ))}
                </div>
                <div className="ml-10 flex items-center justify-center space-x-16 animate-infinite-scroll group-hover:[animation-play-state:paused]" aria-hidden="true">
                    {logos.map((logo, index) => (
                        <img key={index + logos.length} className="h-12 w-auto max-w-none" src={logo} alt={`Logo ${index + 1}`} />
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-16">
                <div className="lg:col-span-3 bg-neutral-800/50 p-8 border border-blue-500/50 shadow-xl rounded-lg relative">
                    <span className="absolute top-0 right-6 -mt-3 bg-blue-600 text-white text-xs font-bold uppercase px-3 py-1 rounded-full">Most Popular</span>
                    <h2 className="text-3xl font-semibold mb-4 text-white">We Host and Manage</h2>
                    <p className="text-neutral-400 mb-6">
                        The easiest way to get started. We handle the infrastructure, triage, and payouts.
                        You just focus on fixing the bugs.
                    </p>
                    <ul className="space-y-4 mb-8 text-neutral-300">
                        <li className="flex items-center"><CodeBracketIcon className="h-6 w-6 mr-3 text-blue-400"/>Seamless GitHub Integration</li>
                        <li className="flex items-center"><ShieldCheckIcon className="h-6 w-6 mr-3 text-blue-400"/>Managed Triage and Reporting</li>
                        <li className="flex items-center"><GiftIcon className="h-6 w-6 mr-3 text-blue-400"/>Stripe for easy payouts</li>
                    </ul>
                    <button 
                        onClick={handleGitHubConnect}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md transition-colors text-lg flex items-center justify-center"
                    >
                        Connect with GitHub <ArrowRightIcon className="h-5 w-5 ml-2" />
                    </button>
                </div>
                <div className="lg:col-span-2 bg-neutral-800/50 p-8 border border-neutral-700/50 rounded-lg flex flex-col">
                    <div className="flex-grow">
                        <h2 className="text-3xl font-semibold mb-4 text-white">Self-Hosted Bounty</h2>
                        <p className="text-neutral-400 mb-6">
                            For teams that want to manage their own bug bounty program. You get access to our platform and researchers.
                        </p>
                        <ul className="space-y-4 mb-8 text-neutral-300">
                            <li className="flex items-center"><BuildingOffice2Icon className="h-6 w-6 mr-3 text-green-400"/>Bring your own infrastructure</li>
                            <li className="flex items-center"><ClipboardDocumentCheckIcon className="h-6 w-6 mr-3 text-green-400"/>Use your own triage workflow</li>
                            <li className="flex items-center"><ChatBubbleLeftRightIcon className="h-6 w-6 mr-3 text-green-400"/>Direct communication with researchers</li>
                        </ul>
                    </div>
                     <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-md transition-colors text-lg flex items-center justify-center">
                        Contact Sales <ArrowRightIcon className="h-5 w-5 ml-2" />
                    </button>
                </div>
            </div>
        </div>
      </main>

      <Footer />
      <style jsx>{`
        @keyframes infinite-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-100%); }
        }
        .animate-infinite-scroll {
          flex-shrink: 0;
          animation: infinite-scroll 40s linear infinite;
        }
      `}</style>
    </>
  );
} 