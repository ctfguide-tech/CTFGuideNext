import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function GitHubCallback() {
  const router = useRouter();
  const { code } = router.query;

  useEffect(() => {
    async function handleCallback() {
      if (!code) return;

      try {
        // Call our API endpoint
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bounties/github/callback?code=${code}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to authenticate with GitHub');
        }

        const data = await response.json();
        
        // Redirect to setup page with the GitHub data
        router.push({
          pathname: '/post-bounty/setup',
          query: { github_data: JSON.stringify(data) }
        });
      } catch (error) {
        console.error('GitHub callback error:', error);
        router.push('/post-bounty?error=github_auth_failed');
      }
    }

    handleCallback();
  }, [code, router]);

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col items-center justify-center">
      <div className="animate-spin h-12 w-12 border-b-2 border-blue-500 rounded-full mb-4"></div>
      <p className="text-neutral-400">Connecting with GitHub...</p>
    </div>
  );
} 