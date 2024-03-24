import Head from 'next/head';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';

export default function Onboarding() {
  return (
    <>
      <Head>
        <title>Dashboard - CTFGuide</title>
        <meta
          name="description"
          content="Cybersecurity made easy for everyone"
        />
      </Head>
      <main>
        <div className="h-flex h-screen items-center justify-center">
          <OnboardingFlow></OnboardingFlow>
        </div>
      </main>
    </>
  );
}
