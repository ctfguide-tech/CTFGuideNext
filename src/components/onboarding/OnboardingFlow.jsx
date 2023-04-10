import { DataAsk } from '@/components/onboarding/DataAsk';
import { useState, useEffect } from 'react';
import { DataAskPart2 } from '@/components/onboarding/DataAskPart2';
import { Demo } from '@/components/onboarding/Demo';
import { useRouter } from 'next/router';

export function OnboardingFlow() {
  const router = useRouter();

  const [flowState, setFlowState] = useState(router.query.part || '1');

  var username = '';
  var birthday = '';
  var firstname = '';
  var lastname = '';
  var location = '';

  useEffect(() => {
    setFlowState(router.query.part);
  }, [router.query.part]);

  // Read part from URL query parameter

  if (flowState === '1') {
    return <DataAsk />;
  } else if (flowState === '2') {
    return <DataAskPart2 />;
  } else if (flowState === '3') {
    return <Demo />;
  } else {
    return <DataAsk />;
  }
}
