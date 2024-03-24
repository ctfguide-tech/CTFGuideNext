import Head from 'next/head';
import { Header } from '@/components/Header';
import { Hero } from '@/components/home/Hero';
import { Footer } from '@/components/Footer';
import { FeaturesPanel } from '@/components/home/FeaturePanel';
import { Stats } from '@/components/home/Stats';
import { LearningPanel } from '@/components/home/LearningPanel';
import { Enterprise } from '@/components/home/Enterprise';
import { SecondaryFeatures } from '@/components/home/SecondaryFeatures';
export default function Home() {
  return (
    <>
   
      <Head>
        <meta property="og:title" content="CTFGuide" />

        <title>CTFGuide</title>
        <meta property="og:description" content="The data-driven simulation platform for finding and building cybersecurity talent." />
        <meta property="og:image" content="https://camo.githubusercontent.com/12668bfbf9035e96e82b3e9cac0a6ad241d9a0a881ac03b66c86d36dce73e254/68747470733a2f2f7062732e7477696d672e636f6d2f70726f66696c655f62616e6e6572732f313431313434343830373030383938303939372f313638303833353137392f3135303078353030" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ctfguide.com/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="CTFGuide" />
        <meta name="twitter:description" content="The data-driven simulation platform for finding and building cybersecurity talent." />
        <meta name="twitter:image" content="https://ctfguide.com/images/ctfguide-image.jpg" />




        <style>
          @import
          url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
        </style>
      </Head>
    


      <Hero />

      <FeaturesPanel />

      <SecondaryFeatures/>

      <Stats></Stats>
      <Enterprise />

      <div
        className="mx-auto mx-auto max-w-7xl px-6 py-20 text-center lg:px-8"
        style={{ backgroundColor: '#212121' }}
      >
        <h1 className="mx-auto mb-8 text-center text-4xl font-semibold text-white">
          What are you waiting for? Start hacking today!
        </h1>
        <a
          href="./register"
          className=" mx-auto rounded-lg bg-blue-600 px-10 py-2 text-center text-2xl text-white"
        >
          Create Account
        </a>
      </div>
     <Footer />
    </>
  );
}
