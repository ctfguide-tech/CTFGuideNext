import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import { PhotoIcon, ArrowRightIcon, CurrencyDollarIcon, TagIcon, PencilIcon, BuildingOfficeIcon, CodeBracketIcon, ShieldExclamationIcon } from '@heroicons/react/24/outline';
import { SignatureModal } from '@/components/SignatureModal';

export default function BountySetup() {
  const router = useRouter();
  const [githubData, setGithubData] = useState(null);
  const [selectedRepo, setSelectedRepo] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [signature, setSignature] = useState(null);
  const [bountyData, setBountyData] = useState({
    company: '',
    title: '',
    description: '',
    logo: '',
    rewards: {
      critical: '',
      high: '',
      medium: '',
      low: ''
    },
    category: 'Web Application',
    vuln_types: []
  });

  useEffect(() => {
    if (router.query.github_data) {
      try {
        const data = JSON.parse(decodeURIComponent(router.query.github_data));
        setGithubData(data);
        // Pre-fill company name with GitHub organization or username
        if (data.user) {
          setBountyData(prev => ({
            ...prev,
            company: data.user.company || data.user.login
          }));
        }
      } catch (error) {
        console.error('Failed to parse GitHub data:', error);
        router.push('/post-bounty?error=invalid_data');
      }
    }
  }, [router.query]);

  const handleLogoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      // Get upload URL from our backend
      const urlResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bounties/upload-logo`, {
        method: 'POST'
      });
      
      const { uploadUrl, id } = await urlResponse.json();

      // Upload to Cloudflare Images
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadResponse = await fetch(uploadUrl, {
        method: 'POST',
        body: formData
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image');
      }

      const imageUrl = `https://imagedelivery.net/${process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH}/${id}/public`;
      setBountyData(prev => ({ ...prev, logo: imageUrl }));
    } catch (error) {
      console.error('Upload failed:', error);
      setError('Failed to upload logo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bounties`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...bountyData,
          repository: selectedRepo,
          githubUsername: githubData?.user?.login,
          company: bountyData.company || selectedRepo.split('/')[0]
        })
      });

      if (response.ok) {
        router.push('/bounties?success=bounty_created');
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create bounty');
      }
    } catch (error) {
      console.error('Failed to create bounty:', error);
      setError(error.message || 'Failed to create bounty');
    }
  };

  if (!githubData) {
    return (
      <>
        <StandardNav />
        <main className="bg-neutral-900 min-h-screen text-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center">
              <div className="animate-spin h-12 w-12 border-b-2 border-blue-500 rounded-full"></div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Setup Your Bounty | CTFGuide</title>
      </Head>

      <StandardNav />

      <main className="bg-neutral-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className=" mb-12">
            <h1 className="text-3xl font-bold tracking-tight">Bounty Setup</h1>
         <p className=" text-xl text-neutral-400">Let's set up your bug bounty program.</p>
            {error && (
              <div className="mt-6 p-4 bg-red-900/50 text-red-200 rounded-lg max-w-2xl mx-auto">
                {error}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="p-8 bg-neutral-800/50 border border-neutral-700/50 rounded-lg">
                <h2 className="text-2xl font-semibold text-white mb-6">Program Details</h2>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2 flex items-center"><BuildingOfficeIcon className="h-5 w-5 mr-2 text-neutral-400"/>Company/Organization Name</label>
                        <input
                            type="text"
                            value={bountyData.company}
                            onChange={(e) => setBountyData({...bountyData, company: e.target.value})}
                            placeholder={selectedRepo ? selectedRepo.split('/')[0] : 'Enter company name'}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="mt-2 text-xs text-neutral-400">
                            Leave blank to use your GitHub username or organization name.
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 flex items-center"><TagIcon className="h-5 w-5 mr-2 text-neutral-400"/>Bounty Title</label>
                        <input
                            type="text"
                            value={bountyData.title}
                            onChange={(e) => setBountyData({...bountyData, title: e.target.value})}
                            placeholder="e.g., 'My Awesome App Bug Bounty'"
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                </div>
            </div>
            
            <div className="p-8 bg-neutral-800/50 border border-neutral-700/50 rounded-lg">
                <h2 className="text-2xl font-semibold text-white mb-6">Branding & Scope</h2>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2 flex items-center"><PhotoIcon className="h-5 w-5 mr-2 text-neutral-400"/>Company Logo</label>
                        <div className="mt-2 flex items-center gap-x-4">
                            {bountyData.logo ? (
                                <img src={bountyData.logo} alt="Company logo" className="h-16 w-16 rounded-md object-cover bg-neutral-700" />
                            ) : (
                                <div className="h-16 w-16 rounded-md bg-neutral-700 flex items-center justify-center">
                                    <PhotoIcon className="h-8 w-8 text-neutral-500" />
                                </div>
                            )}
                            <div>
                                <label
                                htmlFor="logo-upload"
                                className="relative cursor-pointer rounded-md  text-sm font-semibold text-blue-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-neutral-900 focus-within:ring-blue-600 hover:text-blue-500"
                                >
                                <span>{uploading ? 'Uploading...' : (bountyData.logo ? 'Change logo' : 'Upload logo')}</span>
                                <input
                                    id="logo-upload"
                                    name="logo-upload"
                                    type="file"
                                    className="sr-only"
                                    accept="image/*"
                                    onChange={handleLogoUpload}
                                    ref={fileInputRef}
                                    disabled={uploading}
                                />
                                </label>
                                <p className="text-xs mt-1 leading-5 text-neutral-500">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 flex items-center"><PencilIcon className="h-5 w-5 mr-2 text-neutral-400"/>Description</label>
                        <textarea
                            value={bountyData.description}
                            onChange={(e) => setBountyData({...bountyData, description: e.target.value})}
                            placeholder="Describe your bounty program, what you're looking for, and any rules of engagement."
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 h-36 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                </div>
            </div>

            <div className="p-8 bg-neutral-800/50 border border-neutral-700/50 rounded-lg">
                <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                    <CurrencyDollarIcon className="h-7 w-7 mr-3 text-green-400"/>
                    Reward Tiers
                </h2>
                <p className="text-neutral-400 mb-6 -mt-4">Define the rewards for different vulnerability severity levels.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {Object.entries(bountyData.rewards).map(([tier, amount]) => (
                    <div key={tier}>
                        <label className="block text-sm font-medium mb-2 capitalize">{tier}</label>
                        <div className="relative rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="text-neutral-400 sm:text-sm">$</span>
                        </div>
                        <input
                            type="number"
                            min="0"
                            value={amount}
                            onChange={(e) => setBountyData({
                            ...bountyData,
                            rewards: {...bountyData.rewards, [tier]: e.target.value}
                            })}
                            placeholder="0"
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 pl-7 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                        </div>
                    </div>
                    ))}
                </div>
            </div>

            <div className="p-8 bg-neutral-800/50 border border-neutral-700/50 rounded-lg">
                <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                    <ShieldExclamationIcon className="h-7 w-7 mr-3 text-yellow-400"/>
                    Legal Agreement
                </h2>
                <div className="prose prose-invert prose-neutral max-w-none text-neutral-400">
                    <p>
                        By launching this bounty program, you agree to our terms of service and responsible disclosure guidelines. This includes committing to timely communication with researchers and fair compensation for valid vulnerabilities.
                    </p>
                    <p>
                        Please sign below to confirm your agreement. This signature will be stored as a record of your acceptance of these terms.
                    </p>
                </div>
                <div className="mt-6 flex items-center gap-4">
                    <button
                        type="button"
                        onClick={() => setShowSignatureModal(true)}
                        className="inline-flex items-center justify-center bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                        {signature ? 'Update Signature' : 'Sign Agreement'}
                    </button>
                    {signature && (
                        <div className="flex items-center text-green-400">
                            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <span>Agreement Signed</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-end">
                <button
                type="submit"
                disabled={uploading || !signature}
                className={`inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors ${uploading || !signature ? 'opacity-50 cursor-not-allowed' : ''}`}
                title={!signature ? "You must sign the agreement to launch the bounty" : ""}
                >
                <span>{uploading ? 'Finalizing...' : 'Launch Bounty Program'}</span>
                <ArrowRightIcon className="h-5 w-5 ml-2" />
                </button>
            </div>
          </form>
        </div>
      </main>

      <SignatureModal
        isOpen={showSignatureModal}
        onClose={() => setShowSignatureModal(false)}
        onSave={(data) => {
            setSignature(data);
            setShowSignatureModal(false);
        }}
      />

      <Footer />
    </>
  );
} 