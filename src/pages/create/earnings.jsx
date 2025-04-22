import Head from 'next/head';
import { useState, useEffect } from 'react';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import request from "@/utils/request";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Earnings() {
  const [earnings, setEarnings] = useState({
    totalEarnings: 0,
    pendingPayout: 0,
    lastPayout: 0,
    nextPayoutDate: null,
  });

  const [earningsHistory, setEarningsHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const response = await request(`${process.env.NEXT_PUBLIC_API_URL}/account/earnings`, 'GET', null);
        if (response && Object.keys(response).length > 0) {
          setEarnings(response);
        }
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch earnings:', error);
        setLoading(false);
      }
    };

    const fetchEarningsHistory = async () => {
      try {
        const response = await request(`${process.env.NEXT_PUBLIC_API_URL}/account/earnings/history`, 'GET', null);
        setEarningsHistory(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error('Failed to fetch earnings history:', error);
        setEarningsHistory([]);
      }
    };

    fetchEarnings();
    fetchEarningsHistory();
  }, []);

  const updatePaymentDetails = async () => {
    try {
      const response = await request(
        `${process.env.NEXT_PUBLIC_API_URL}/payments/stripe/create-account-link`,
        'POST'
      );
      
      if (response?.url) {
        window.location.href = response.url;
      } else {
        throw new Error('No account link URL received');
      }
    } catch (error) {
      console.error('Failed to update payment details:', error);
      // Add error notification here
    }
  };

  return (
    <>
      <Head>
        <title>Creator Earnings - CTFGuide</title>
      </Head>
      <StandardNav />
      <main className="min-h-screen bg-gradient-to-b from-neutral-900/50 via-neutral-900/30 to-neutral-800/20 backdrop-blur-xl">
        {/* Secondary Navigation */}
        <div className="border-b border-[#232323] bg-[#161616]/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-8 h-16">
              <Link 
                href="/create"
                className="text-sm font-medium border-b-2 h-full flex items-center transition-colors border-transparent text-neutral-400 hover:text-white hover:border-[#333333]"
              >
                Home
              </Link>
              <Link 
                href="/create/compute"
                className={`text-sm font-medium border-b-2 h-full flex items-center transition-colors ${
                  false  // Replace with actual route check
                    ? 'border-blue-500 text-white' 
                    : 'border-transparent text-neutral-400 hover:text-white hover:border-[#333333]'
                }`}
              >
                <i className="fas fa-server mr-2"></i>
                Docker Containers <span className="text-xs text-blue-400 px-1 ml-2  rounded bg-blue-900 text-white ">BETA</span>
              </Link>
              <Link 
                href="/create/earnings"
                className="text-sm font-medium border-b-2 h-full flex items-center transition-colors border-blue-500 text-white"
              >
                <i className="fas fa-wallet mr-2"></i>
                Earnings 
              </Link>
           
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Earnings Overview */}
          <div className="bg-[#161616]/80 backdrop-blur-xl rounded-2xl border border-[#232323] shadow-2xl p-8 mb-8 transition-all duration-300 hover:border-[#2a2a2a]">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <i className="fas fa-chart-line mr-3 text-blue-500"></i>
              Earnings Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#1c1c1c]/90 rounded-xl p-6 border border-[#2a2a2a] hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5">
                <dt className="text-neutral-400 text-sm font-medium flex items-center">
                  <i className="fas fa-wallet mr-2 text-blue-500"></i>
                  Total Earnings
                </dt>
                <dd className="text-3xl font-semibold text-white mt-2">
                  ${(earnings?.totalEarnings || 0).toFixed(2)}
                </dd>
              </div>
              <div className="bg-[#1c1c1c]/90 rounded-xl p-6 border border-[#2a2a2a] hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5">
                <dt className="text-neutral-400 text-sm font-medium flex items-center">
                  <i className="fas fa-wallet mr-2 text-blue-500"></i>
                  Pending Payout
                </dt>
                <dd className="text-3xl font-semibold text-white mt-2">
                  ${(earnings?.pendingPayout || 0).toFixed(2)}
                </dd>
              </div>
              <div className="bg-[#1c1c1c]/90 rounded-xl p-6 border border-[#2a2a2a] hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5">
                <dt className="text-neutral-400 text-sm font-medium flex items-center">
                  <i className="fas fa-wallet mr-2 text-blue-500"></i>
                  Last Payout
                </dt>
                <dd className="text-3xl font-semibold text-white mt-2">
                  ${(earnings?.lastPayout || 0).toFixed(2)}
                </dd>
              </div>
              <div className="bg-[#1c1c1c]/90 rounded-xl p-6 border border-[#2a2a2a] hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5">
                <dt className="text-neutral-400 text-sm font-medium flex items-center">
                  <i className="fas fa-wallet mr-2 text-blue-500"></i>
                  Next Payout Date
                </dt>
                <dd className="text-3xl font-semibold text-white mt-2">
                  {earnings.nextPayoutDate 
                    ? new Date(earnings.nextPayoutDate).toLocaleDateString()
                    : 'N/A'}
                </dd>
              </div>
            </div>
          </div>

          {/* Earnings Chart */}
          <div className="bg-[#161616]/80 backdrop-blur-xl rounded-2xl border border-[#232323] shadow-2xl p-8 mb-8 transition-all duration-300 hover:border-[#2a2a2a]">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <i className="fas fa-chart-area mr-3 text-blue-500"></i>
              Earnings History
            </h2>
            <div className="h-[400px]">
              {earningsHistory.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={earningsHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#666666"
                      style={{ fontSize: '12px' }}
                      tick={{ fill: '#999999' }}
                    />
                    <YAxis 
                      stroke="#666666"
                      style={{ fontSize: '12px' }}
                      tick={{ fill: '#999999' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1c1c1c',
                        border: '1px solid #2a2a2a',
                        borderRadius: '0.5rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      }}
                      labelStyle={{ color: '#999999' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                      activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                  <i className="fas fa-chart-line text-4xl text-neutral-600"></i>
                  <p className="text-neutral-400">No earnings history available yet</p>
                  <p className="text-sm text-neutral-500">Start creating content to earn rewards</p>
                </div>
              )}
            </div>
          </div>

          {/* Payout Information */}
          <div className="bg-[#161616]/80 backdrop-blur-xl rounded-2xl border border-[#232323] shadow-2xl p-8 transition-all duration-300 hover:border-[#2a2a2a]">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <i className="fas fa-money-check-alt mr-3 text-blue-500"></i>
              Payout Information
            </h2>
            <div className="space-y-6">
              <div className="bg-[#1c1c1c]/90 rounded-xl p-6 border border-[#2a2a2a] hover:border-blue-500/30 transition-all duration-300 relative">
                {/* Add overlay message */}
                <div className="absolute inset-0 bg-black/80 rounded-xl flex items-center justify-center">
                  <p className="text-white font-bold text-lg">
                    <i className="fas fa-exclamation-circle mr-2"></i>
                    Not Eligible for Payments
                  </p>
                </div>
                
                <h3 className="text-lg font-medium text-white mb-4 flex items-center opacity-50">
                  <i className="fas fa-credit-card mr-2 text-blue-500"></i>
                  Payment Method
                </h3>
                <p className="text-neutral-400 opacity-50">
                  Payments are processed via Stripe on the 1st of each month for balances over $50.
                </p>
                <button 
                  onClick={updatePaymentDetails}
                  className="disabled mt-4 bg-neutral-600 text-white px-6 py-2 rounded-lg transition-all duration-300 flex items-center opacity-50"
                  disabled={true}
                >
                  <i className="fas fa-edit mr-2"></i>
                  Update Payment Details
                </button>
              </div>
              
              <div className="bg-[#1c1c1c]/90 rounded-xl p-6 border border-[#2a2a2a] hover:border-blue-500/30 transition-all duration-300">
                <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                  <i className="fas fa-history mr-2 text-blue-500"></i>
                  Payout History
                </h3>
                <div className="space-y-4" >
                  {/* Payout history items with hover effects */}
                  <div className="hidden flex justify-between items-center py-3 border-b border-[#2a2a2a] hover:bg-[#232323]/50 px-4 rounded-lg transition-all duration-300">
                    <div>
                      <p className="text-white">March 2024 Payout</p>
                      <p className="text-sm text-neutral-400">Processed on Mar 1, 2024</p>
                    </div>
                    <span className="text-green-400 font-medium">$125.00</span>
                  </div>
                  <div className="hidden flex justify-between items-center py-3 border-b border-[#2a2a2a] hover:bg-[#232323]/50 px-4 rounded-lg transition-all duration-300">
                    <div>
                      <p className="text-white">February 2024 Payout</p>
                      <p className="text-sm text-neutral-400">Processed on Feb 1, 2024</p>
                    </div>
                    <span className="text-green-400 font-medium">$95.50</span>
                  </div>


                </div>
                <p className="text-neutral-400">No payout history available yet</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}