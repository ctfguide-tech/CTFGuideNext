import { DataAsk } from '@/components/onboarding/DataAsk';
import { useState, useEffect } from 'react';
import { DataAskPart2 } from '@/components/onboarding/DataAskPart2';
import { Demo } from '@/components/onboarding/Demo';
import { useRouter } from 'next/router';

export function OnboardingFlow() {
  const router = useRouter();

  var username = '';
  var birthday = '';
  var firstname = '';
  var lastname = '';
  var location = '';

  // Read part from URL query parameter

  return (
    <>
      <DataAsk />
      <DataAskPart2 />
      <Demo />
    </>
  );
}
