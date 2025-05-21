import Head from 'next/head'
import { Header } from '@/components/Header'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useState, useEffect } from 'react'

const ComparisonCard = ({ point, index }) => {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-neutral-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-neutral-700/50"
    >
      <div className="px-6 py-4 bg-neutral-800/30 border-b border-neutral-700/50">
        <div className="flex items-center">
          <span className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center mr-3">
            <span className="text-blue-400 font-medium">{index + 1}</span>
          </span>
          <h2 className="text-lg font-semibold text-white">{point.category}</h2>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 divide-x divide-neutral-700/50">
        {/* CTFGuide Column */}
        <div className="p-6 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <img src="/darkLogocrop.png" alt="CTFGuide" className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-blue-400">{point.ctfguide.title}</h3>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">{point.ctfguide.description}</p>
          <ul className="space-y-2">
            {point.ctfguide.pros.map((pro, i) => (
              <motion.li 
                key={i} 
                initial={{ opacity: 0, x: -10 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                transition={{ duration: 0.3, delay: i * 0.1 + 0.3 }}
                className="flex items-center text-green-400/90 text-sm"
              >
                <svg className="h-5 w-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {pro}
              </motion.li>
            ))}
          </ul>
        </div>

        {/* TryHackMe Column */}
        <div className="p-6 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-neutral-700/30 flex items-center justify-center">
              <img src="https://assets.tryhackme.com/img/THMlogo.png" alt="TryHackMe" className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-400">{point.competitor.title}</h3>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">{point.competitor.description}</p>
          <ul className="space-y-2">
            {point.competitor.cons.map((con, i) => (
              <motion.li 
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 10 }}
                transition={{ duration: 0.3, delay: i * 0.1 + 0.3 }}
                className="flex items-center text-red-400/80 text-sm"
              >
                <svg className="h-5 w-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                {con}
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default function CompareTryHackMe() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = (window.pageYOffset / totalScroll) * 100;
      setScrollProgress(currentProgress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const comparisonPoints = [
    {
      category: "Learning Approach",
      ctfguide: {
        title: "Adaptive Learning Path",
        description: "Personalized learning experience that adapts to your skill level",
        pros: ["AI-powered skill assessment", "Dynamic difficulty adjustment", "Personalized recommendations", "Real-time progress tracking"]
      },
      competitor: {
        title: "Room-Based Learning",
        description: "Structured learning through themed rooms and paths",
        cons: ["Fixed difficulty levels", "Linear progression", "Limited personalization", "Predetermined paths"]
      }
    },
    {
      category: "Community Engagement",
      ctfguide: {
        title: "Active Social Learning",
        description: "Real-time collaboration and community-driven content",
        pros: ["Live collaboration", "Community challenges", "Instant feedback", "Social learning features"]
      },
      competitor: {
        title: "Forum-Based Community",
        description: "Traditional forum-style community interaction",
        cons: ["Delayed responses", "Limited real-time interaction", "Fragmented discussions"]
      }
    },
    {
      category: "Platform Features",
      ctfguide: {
        title: "Modern & Interactive",
        description: "Contemporary platform with real-time features",
        pros: ["Real-time updates", "Modern UI/UX", "Mobile-first design", "Seamless integration"]
      },
      competitor: {
        title: "Traditional Platform",
        description: "Established platform with basic features",
        cons: ["Basic interface", "Limited mobile support", "Older technology stack"]
      }
    },
    {
      category: "Cost & Accessibility",
      ctfguide: {
        title: "Free Core Features",
        description: "All essential features available at no cost",
        pros: ["No paywalls", "Free practice environments", "Unlimited challenges", "Community access"]
      },
      competitor: {
        title: "Subscription Model",
        description: "Premium features behind subscription",
        cons: ["Monthly subscription required", "Limited free tier", "Paywalled content"]
      }
    }
  ]

  return (
    <>
      <Head>
        <title>CTFGuide vs TryHackMe Comparison - Choose Your Cybersecurity Learning Path</title>
        <meta name="description" content="Compare CTFGuide with TryHackMe. See how CTFGuide's adaptive learning approach and modern platform compares to TryHackMe's room-based learning system." />
      </Head>

      <div className="bg-neutral-900 min-h-screen relative">
        <Header />
        
        {/* Progress bar */}
        <div 
          className="fixed top-0 left-0 h-0.5 bg-blue-500 z-50 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
        
        <main className="relative">
          {/* Background gradient */}
          <div className="absolute top-0 z-[-2] h-screen w-full bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(18,35,166,0.3),rgba(255,255,255,0))]"></div>
          
          <div className="relative pt-24 pb-20">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              {/* Hero Section */}
              <div className="relative isolate overflow-hidden">
                <div className="mx-auto max-w-4xl text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="inline-flex items-center rounded-full px-4 py-1 text-sm font-medium bg-blue-900/30 text-blue-300 backdrop-blur-sm ring-1 ring-inset ring-blue-500/20 mb-6">
                      <i className="fa fa-bullseye mr-2" />
                      Platform Comparison
                    </div>
                    <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl mb-6">
                      CTFGuide vs TryHackMe
                    </h1>
                    <p className="text-lg leading-8 text-gray-300 max-w-2xl mx-auto">
                      Compare our modern, adaptive learning platform with TryHackMe's traditional approach to find the best fit for your cybersecurity journey.
                    </p>
                  </motion.div>
                </div>
              </div>

              {/* Featured Stats */}
              <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-16 mb-20"
              >
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="relative overflow-hidden rounded-lg bg-neutral-800/30 px-6 py-5 backdrop-blur-sm">
                    <dt className="truncate text-sm font-medium text-gray-400">Active Users</dt>
                    <dd className="mt-2 text-3xl font-semibold tracking-tight text-white">50,000+</dd>
                  </div>
                  <div className="relative overflow-hidden rounded-lg bg-neutral-800/30 px-6 py-5 backdrop-blur-sm">
                    <dt className="truncate text-sm font-medium text-gray-400">Challenges Completed</dt>
                    <dd className="mt-2 text-3xl font-semibold tracking-tight text-white">1M+</dd>
                  </div>
                  <div className="relative overflow-hidden rounded-lg bg-neutral-800/30 px-6 py-5 backdrop-blur-sm">
                    <dt className="truncate text-sm font-medium text-gray-400">User Satisfaction</dt>
                    <dd className="mt-2 text-3xl font-semibold tracking-tight text-white">98%</dd>
                  </div>
                  <div className="relative overflow-hidden rounded-lg bg-neutral-800/30 px-6 py-5 backdrop-blur-sm">
                    <dt className="truncate text-sm font-medium text-gray-400">Available Challenges</dt>
                    <dd className="mt-2 text-3xl font-semibold tracking-tight text-white">500+</dd>
                  </div>
                </div>
              </motion.div>

              {/* Comparison Points */}
              <div className="space-y-6 mb-20">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <h2 className="text-2xl font-bold text-white mb-4">Detailed Comparison</h2>
                  <p className="text-gray-400">See how CTFGuide's innovative features and modern approach stack up against TryHackMe's traditional platform.</p>
                </div>
                {comparisonPoints.map((point, index) => (
                  <ComparisonCard key={index} point={point} index={index} />
                ))}
              </div>

              {/* CTA Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="relative isolate mt-20 rounded-2xl overflow-hidden bg-neutral-800/30 backdrop-blur-sm"
              >
                <div className="mx-auto max-w-7xl px-6 py-24 sm:py-20 lg:px-8">
                  <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                      Ready to start your journey?
                    </h2>
                    <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
                      Join CTFGuide today and experience the future of cybersecurity learning with our modern, adaptive platform.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                      <Link
                        href="/register"
                        className="rounded-lg bg-blue-600 px-8 py-3 text-lg font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 hover:shadow-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-neutral-900 transition-all duration-300"
                      >
                        Get Started for Free
                      </Link>
                      <Link
                        href="/about"
                        className="text-lg font-semibold leading-6 text-white hover:text-blue-400 transition-colors"
                      >
                        Learn more <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
} 