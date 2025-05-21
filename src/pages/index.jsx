import Head from 'next/head';
import { Header } from '@/components/Header';
import { Hero } from '@/components/home/Hero';
import { Footer } from '@/components/Footer';
import { FeaturesPanel } from '@/components/home/FeaturePanel';
import { LearningPanel } from '@/components/home/LearningPanel';
import { Enterprise } from '@/components/home/Enterprise';
import { SecondaryFeatures } from '@/components/home/SecondaryFeatures';
import GP  from '@/components/home/GP';
import { useEffect, useRef } from 'react';

export default function Home() {

  return (
    <div className='bg-neutral-900'>
   
      <Head>
        <meta property="og:title" content="CTFGuide" />

        <title>CTFGuide</title>
        <meta property="og:description" content="The data-driven simulation platform for finding and building cybersecurity talent." />
        <meta property="og:image" content="/newSiteBanner.png" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ctfguide.com/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="CTFGuide" />
        <meta name="twitter:description" content="The data-driven simulation platform for finding and building cybersecurity talent." />
        <meta name="twitter:image" content="/newSiteBanner.png" />




        <style>
          @import
          url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
        </style>
      </Head>
    


      <Hero />


     

<div className="hidden">
      <SecondaryFeatures/>
</div>



     
     <Footer isHome={true} />
    </div>
  );
}
