import { StandardNav } from '../StandardNav';
import { Footer } from '../Footer';
import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/20/solid';

const Breadcrumb = ({ bounty }) => {
    return (
        <nav className="flex py-3 px-8 bg-neutral-800/50 border-b border-neutral-700" aria-label="Breadcrumb">
            <ol role="list" className="flex items-center space-x-4">
                <li>
                    <div>
                        <Link href="/bounties" className="text-neutral-400 hover:text-white">
                            Bounties
                        </Link>
                    </div>
                </li>
                {bounty && (
                    <li>
                        <div className="flex items-center">
                            <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-neutral-500" aria-hidden="true" />
                            <Link href={`/bounties/${bounty.id}`} className="ml-4 text-sm font-medium text-neutral-400 hover:text-white">
                                {bounty.title}
                            </Link>
                        </div>
                    </li>
                )}
                <li>
                    <div className="flex items-center">
                        <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-neutral-500" aria-hidden="true" />
                        <span className="ml-4 text-sm font-medium text-white">
                            Submit Report
                        </span>
                    </div>
                </li>
            </ol>
        </nav>
    );
};

export default function BountyLayout({ children, bounty }) {
    return (
        <div className="bg-neutral-900 min-h-screen">
            <StandardNav />
            <main>
                <Breadcrumb bounty={bounty} />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
            <Footer />
        </div>
    );
} 