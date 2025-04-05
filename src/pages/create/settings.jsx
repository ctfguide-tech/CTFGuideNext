import Head from 'next/head';
import { useState, useEffect } from 'react';
import { StandardNav } from '@/components/StandardNav';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import request from "@/utils/request";
import { Switch } from '@headlessui/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CreatorSettings() {
  const [settings, setSettings] = useState({
    automaticPayouts: true,
    emailNotifications: true,
    publicProfile: true,
    displayEarnings: false,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await request(`${process.env.NEXT_PUBLIC_API_URL}/account/creator/settings`, 'GET', null);
        setSettings(response);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch settings:', error);
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const updateSetting = async (key, value) => {
    try {
      await request(
        `${process.env.NEXT_PUBLIC_API_URL}/account/creator/settings`,
        'POST',
        { [key]: value }
      );
      setSettings(prev => ({ ...prev, [key]: value }));
      toast.success('Setting updated successfully');
    } catch (error) {
      console.error('Failed to update setting:', error);
      toast.error('Failed to update setting');
    }
  };

  return (
    <>
      <Head>
        <title>Creator Settings - CTFGuide</title>
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
                href="/create/earnings"
                className="text-sm font-medium border-b-2 h-full flex items-center transition-colors border-transparent text-neutral-400 hover:text-white hover:border-[#333333]"
                legacyBehavior>
                <i className="fas fa-wallet mr-2"></i>
                Earnings
              </Link>
              <Link
                href="/create/settings"
                className="text-sm font-medium border-b-2 h-full flex items-center transition-colors border-blue-500 text-white"
                legacyBehavior>
                <i className="fas fa-cog mr-2"></i>
                Creator Settings
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* General Settings */}
          <div className="bg-[#161616] rounded-2xl border border-[#232323] shadow-2xl p-8 mb-8">
            <h2 className="text-2xl font-semibold text-white mb-6">Creator Settings</h2>
            
            <div className="space-y-6">
              {/* Payment Settings */}
              <div className="bg-[#1c1c1c] rounded-xl p-6 border border-[#2a2a2a]">
                <h3 className="text-lg font-medium text-white mb-4">Payment Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white">Automatic Payouts</p>
                      <p className="text-sm text-neutral-400">Automatically process payments when threshold is met</p>
                    </div>
                    <Switch
                      checked={settings.automaticPayouts}
                      onChange={(value) => updateSetting('automaticPayouts', value)}
                      className={`${
                        settings.automaticPayouts ? 'bg-blue-600' : 'bg-neutral-700'
                      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
                    >
                      <span className="sr-only">Enable automatic payouts</span>
                      <span
                        className={`${
                          settings.automaticPayouts ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                      />
                    </Switch>
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="bg-[#1c1c1c] rounded-xl p-6 border border-[#2a2a2a]">
                <h3 className="text-lg font-medium text-white mb-4">Notification Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white">Email Notifications</p>
                      <p className="text-sm text-neutral-400">Receive updates about your content and earnings</p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onChange={(value) => updateSetting('emailNotifications', value)}
                      className={`${
                        settings.emailNotifications ? 'bg-blue-600' : 'bg-neutral-700'
                      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
                    >
                      <span className="sr-only">Enable email notifications</span>
                      <span
                        className={`${
                          settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                      />
                    </Switch>
                  </div>
                </div>
              </div>

              {/* Profile Settings */}
              <div className="bg-[#1c1c1c] rounded-xl p-6 border border-[#2a2a2a]">
                <h3 className="text-lg font-medium text-white mb-4">Profile Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white">Public Profile</p>
                      <p className="text-sm text-neutral-400">Allow others to view your creator profile</p>
                    </div>
                    <Switch
                      checked={settings.publicProfile}
                      onChange={(value) => updateSetting('publicProfile', value)}
                      className={`${
                        settings.publicProfile ? 'bg-blue-600' : 'bg-neutral-700'
                      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
                    >
                      <span className="sr-only">Enable public profile</span>
                      <span
                        className={`${
                          settings.publicProfile ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                      />
                    </Switch>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white">Display Earnings</p>
                      <p className="text-sm text-neutral-400">Show your earnings on your public profile</p>
                    </div>
                    <Switch
                      checked={settings.displayEarnings}
                      onChange={(value) => updateSetting('displayEarnings', value)}
                      className={`${
                        settings.displayEarnings ? 'bg-blue-600' : 'bg-neutral-700'
                      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
                    >
                      <span className="sr-only">Enable earnings display</span>
                      <span
                        className={`${
                          settings.displayEarnings ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                      />
                    </Switch>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ToastContainer position="bottom-right" theme="dark" />
    </>
  );
}