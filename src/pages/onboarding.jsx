import Head from 'next/head';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import request  from '@/utils/request';




export default function Onboarding() {

  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const response = await request(`${process.env.NEXT_PUBLIC_API_URL}/account`, 'GET', null);


      if (response.username) {
        console.log('User already onboarded');
        router.push('/dashboard');

    }
    };
    checkUser();
  }, []);


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
