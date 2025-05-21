import Head from 'next/head'
import { Header } from '@/components/Header'

export default function CompareHackTheBox() {
  const comparisonPoints = [
    {
      category: "Pricing & Accessibility",
      ctfguide: {
        title: "100% Free Core Features",
        description: "All essential learning features available at no cost",
        pros: ["No paywalls for core content", "Free practice environments", "Unlimited challenges"]
      },
      competitor: {
        title: "Subscription-Based Model",
        description: "Most features require paid subscription",
        cons: ["Limited free tier", "Premium features locked", "Monthly subscription required"]
      }
    },
    {
      category: "Learning Experience",
      ctfguide: {
        title: "Social Learning Focus",
        description: "Interactive community-driven learning environment",
        pros: ["Real-time collaboration", "Peer learning", "Community discussions", "Instant feedback"]
      },
      competitor: {
        title: "Individual Focus",
        description: "More isolated learning experience",
        cons: ["Limited collaboration", "Solo-focused challenges", "Delayed feedback"]
      }
    },
    {
      category: "Beginner Friendliness",
      ctfguide: {
        title: "Structured Learning Path",
        description: "Guided progression with clear learning objectives",
        pros: ["Step-by-step guidance", "Beginner-friendly interface", "Progressive difficulty"]
      },
      competitor: {
        title: "Steep Learning Curve",
        description: "Can be overwhelming for beginners",
        cons: ["Complex initial challenges", "Advanced terminology", "Limited guidance"]
      }
    },
    {
      category: "Platform Features",
      ctfguide: {
        title: "Modern & Intuitive",
        description: "Contemporary interface with real-time features",
        pros: ["Real-time updates", "Modern UI/UX", "Mobile responsive", "Quick loading"]
      },
      competitor: {
        title: "Traditional Interface",
        description: "Classic CTF platform approach",
        cons: ["Dated interface", "Limited mobile support", "Complex navigation"]
      }
    }
  ]

  return (
    <>
      <Head>
        <title>CTFGuide vs HackTheBox Comparison - Choose the Best Cybersecurity Learning Platform</title>
        <meta name="description" content="Compare CTFGuide with HackTheBox. See how CTFGuide offers free, social-focused cybersecurity learning compared to HackTheBox's traditional approach." />
      </Head>

      <div className="bg-neutral-900 min-h-screen">
        <Header />
        
        <main className="pt-24 pb-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                CTFGuide vs HackTheBox
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                See how CTFGuide's modern, social-focused learning approach compares to HackTheBox's traditional platform
              </p>
            </div>

            <div className="mt-16 space-y-8">
              {comparisonPoints.map((point, index) => (
                <div key={index} className="bg-neutral-800/50 backdrop-blur-sm rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 bg-neutral-800">
                    <h2 className="text-xl font-semibold text-white">{point.category}</h2>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6 p-6">
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <img src="/darkLogocrop.png" alt="CTFGuide" className="h-8 w-8 mr-3" />
                        <h3 className="text-lg font-semibold text-blue-400">{point.ctfguide.title}</h3>
                      </div>
                      <p className="text-gray-300">{point.ctfguide.description}</p>
                      <ul className="space-y-2">
                        {point.ctfguide.pros.map((pro, i) => (
                          <li key={i} className="flex items-center text-green-400">
                            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center">
                        <img src="https://www.hackthebox.com/images/logo-htb.svg" alt="HackTheBox" className="h-8 w-8 mr-3" />
                        <h3 className="text-lg font-semibold text-gray-400">{point.competitor.title}</h3>
                      </div>
                      <p className="text-gray-400">{point.competitor.description}</p>
                      <ul className="space-y-2">
                        {point.competitor.cons.map((con, i) => (
                          <li key={i} className="flex items-center text-red-400">
                            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 text-center">
              <a
                href="/register"
                className="rounded-md bg-blue-600 px-8 py-3 text-lg font-semibold text-white shadow hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-neutral-900"
              >
                Get Started with CTFGuide
              </a>
            </div>
          </div>
        </main>
      </div>
    </>
  )
} 