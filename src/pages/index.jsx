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
  const sectionRef = useRef(null);

  useEffect(() => {
    if (sectionRef.current) {
      sectionRef.current.classList.add('animate-border');
    }
  }, []);

  return (
    <>
   
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


     <GP/>
  

<div className="hidden">
      <SecondaryFeatures/>
</div>



      <div
        ref={sectionRef}
        className="relative mx-auto max-w-7xl px-6 py-24 text-center lg:px-8 overflow-hidden"
        style={{ backgroundColor: '#1a1a1a' }}
      >
        <div className="border-beam"></div>
        <div className="meteor-shower"></div>
        <div className="text-center relative z-10 p-8">
          <h1 className="mx-auto mb-8 text-center text-5xl font-bold text-white leading-tight">
            Ready to embark on your hacking journey?
          </h1>
          <p className="mx-auto mb-12 max-w-2xl text-xl text-gray-300">
            Join our community of cybersecurity enthusiasts and start sharpening your skills today!
          </p>
          <a
            href="./register"
            className="inline-block px-8 py-3.5 text-2xl font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors duration-300"
          >
            Create Your Account
          </a>
        </div>
      </div>
     <Footer />
    </>
  );
}