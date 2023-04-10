import Head from 'next/head';
import { Header } from '@/components/Header';
import { Hero } from '@/components/home/Hero';
import { Footer } from '@/components/Footer';
import { FeaturesPanel } from '@/components/home/FeaturePanel';
import { Stats } from '@/components/home/Stats';
import { LearningPanel } from '@/components/home/LearningPanel';
import { Enterprise } from '@/components/home/Enterprise';

export default function Home() {
  return (
    <>
      <Head>
        <title>CTFGuide</title>
        <meta name="description" content="Cybersecurity as a service." />
        <style>
          @import
          url(&apos;https://fonts.googleapis.com/css2?family=Poppins&display=swap&apos;);
        </style>
      </Head>

      <Header />

      <Hero />

      <FeaturesPanel />

      <LearningPanel />
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
