import Head from 'next/head'
import { Header } from '@/components/Header'
import Link from 'next/link'

export default function CompareCTFlearn() {
  const comparisonPoints = [
    {
      category: "Learning Experience",
      ctfguide: {
        title: "Dynamic & Interactive",
        description: "Engaging, hands-on learning with real-time feedback",
        pros: ["Interactive challenges", "Real-time feedback", "Adaptive difficulty", "Progress tracking"]
      },
      competitor: {
        title: "Static Challenges",
        description: "Basic challenge format with limited interaction",
        cons: ["Fixed difficulty", "Limited feedback", "Basic interface", "No progression system"]
      }
    },
    {
      category: "Platform Technology",
      ctfguide: {
        title: "Modern Architecture",
        description: "Built with latest technology for optimal performance",
        pros: ["Cloud infrastructure", "Real-time updates", "Scalable platform", "Modern security"]
      },
      competitor: {
        title: "Legacy System",
        description: "Traditional platform with basic functionality",
        cons: ["Older technology", "Limited features", "Basic infrastructure", "Occasional downtime"]
      }
    },
    {
      category: "Community & Collaboration",
      ctfguide: {
        title: "Social Learning Hub",
        description: "Rich community features for collaborative learning",
        pros: ["Live collaboration", "Team features", "Community support", "Social interaction"]
      },
      competitor: {
        title: "Basic Community",
        description: "Limited community interaction features",
        cons: ["Basic forums", "Limited collaboration", "No team features", "Minimal interaction"]
      }
    },
    {
      category: "Content Quality",
      ctfguide: {
        title: "Curated Content",
        description: "High-quality, vetted challenges and resources",
        pros: ["Quality assurance", "Regular updates", "Structured content", "Expert reviews"]
      },
      competitor: {
        title: "User-Generated Content",
        description: "Varying quality of user-submitted challenges",
        cons: ["Inconsistent quality", "Outdated content", "Limited curation", "Duplicate challenges"]
      }
    }
  ]

  return (
    <>
      <Head>
        <title>CTFGuide vs CTFlearn Comparison - Modern Learning vs Traditional Platform</title>
        <meta name="description" content="Compare CTFGuide with CTFlearn. See how CTFGuide's modern, interactive platform differs from CTFlearn's traditional approach to cybersecurity learning." />
      </Head>

      <div className="bg-neutral-900 min-h-screen">
        <Header />
        
        <main className="pt-24 pb-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            {/* Hero Section */}
            <div className="mx-auto max-w-4xl text-center mb-16">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
                CTFGuide vs CTFlearn
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                Experience the difference between modern interactive learning and traditional platforms
              </p>
            </div>

            {/* Featured Comparison */}
            <div className="mb-16">
              <div className="relative h-[300px] rounded-2xl overflow-hidden">
                <img 
                  src="/comparison-banner.png" 
                  alt="Platform Comparison" 
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/90 to-neutral-900/50" />
                <div className="absolute inset-0 flex items-center">
                  <div className="max-w-2xl mx-auto text-center px-6">
                    <div className="flex justify-center items-center space-x-8 mb-8">
                      <img src="/darkLogocrop.png" alt="CTFGuide" className="h-16 w-16" />
                      <div className="text-2xl font-bold text-white">vs</div>
                      <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center">
                        <span className="text-xl font-bold text-blue-600">CTFlearn</span>
                      </div>
                    </div>
                    <p className="text-lg text-gray-300">
                      Choose the platform that delivers the best learning experience for you
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison Points */}
            <div className="space-y-8">
              {comparisonPoints.map((point, index) => (
                <div key={index} className="bg-neutral-800/50 backdrop-blur-sm rounded-2xl overflow-hidden transform hover:scale-[1.02] transition-all duration-300">
                  <div className="px-6 py-4 bg-neutral-800/50 border-b border-neutral-700">
                    <h2 className="text-xl font-semibold text-white">{point.category}</h2>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6 p-6">
                    {/* CTFGuide Column */}
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center mr-3">
                          <img src="/darkLogocrop.png" alt="CTFGuide" className="h-6 w-6" />
                        </div>
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

                    {/* CTFlearn Column */}
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-neutral-800 flex items-center justify-center mr-3">
                          <span className="text-sm font-bold text-white">CTFl</span>
                        </div>
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

            {/* CTA Section */}
            <div className="mt-16 text-center">
              <div className="inline-flex flex-col items-center">
                <p className="text-gray-400 mb-6">Ready to experience modern cybersecurity learning?</p>
                <Link
                  href="/register"
                  className="rounded-md bg-blue-600 px-8 py-3 text-lg font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 hover:shadow-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-neutral-900 transition-all duration-300"
                >
                  Get Started with CTFGuide
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
} 