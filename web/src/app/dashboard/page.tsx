'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getUserInfo } from '@/lib/auth/googleAuth';
import OverviewTab from '@/components/dashboard/Overview';
import GamesTab from '@/components/dashboard/Game';
import FriendsTab from '@/components/dashboard/Friend';
import { UserInfo } from '@/types/googleAuthTypes';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  
  useEffect(() => {
    const info = getUserInfo();
    setUserInfo(info);
  }, []);

  const username = userInfo?.email?.split('@')[0] || 'anonymous';
  const isVerified = userInfo?.email_verified || true;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'games':
        return <GamesTab />;
      case 'friends':
        return <FriendsTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="container mx-auto py-4 sm:py-6 md:py-8 px-4 max-w-7xl relative">
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        <Card className="py-0 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-amber-200/50 dark:border-amber-800/30 shadow-md hover:shadow-lg transition-all">
          <div className="p-4 sm:p-6 pt-8 sm:pt-12">
            <div className="flex flex-col md:flex-row md:items-center gap-4 sm:gap-6">
              {/* Profile Picture */}
              <div className="relative flex justify-center md:justify-start">
                <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-amber-600 dark:bg-amber-500 shadow-md dark:shadow-amber-600/20"></div>
              </div>
              
              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row gap-2 md:items-center justify-center md:justify-start">
                  <h1 className="text-2xl sm:text-3xl font-bold text-amber-900 dark:text-amber-100 font-display flex items-center justify-center md:justify-start">
                    {username}
                    {isVerified && (
                      <Badge className="ml-3 bg-green-600 text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                        Verified
                      </Badge>
                    )}
                  </h1>
                </div>
                                
                <div className="flex flex-wrap gap-x-4 sm:gap-x-6 gap-y-2 mt-2 sm:mt-3 text-amber-700 dark:text-amber-300 justify-center md:justify-start">
                  <div className="flex items-center">
                    <span className="text-green-600 font-bold mr-2">•</span>
                    Online now
                  </div>
                  <div>
                    <span className="font-medium">Feb 11, 2023</span> Joined
                  </div>
                  <div>
                    <span className="font-medium">7</span> Friends
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Submenu - Scrollable on mobile */}
          <div className="flex border-t border-amber-200/30 dark:border-slate-700/30 overflow-x-auto scrollbar-hide">
            <button
              className={`py-3 px-4 sm:px-6 font-medium text-base sm:text-lg whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'text-amber-600 dark:text-amber-400 bg-amber-100/60 dark:bg-amber-900/30 rounded-b-lg'
                  : 'text-amber-800 dark:text-amber-200 hover:text-amber-600 dark:hover:text-amber-400'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`py-3 px-4 sm:px-6 font-medium text-base sm:text-lg whitespace-nowrap ${
                activeTab === 'games'
                  ? 'text-amber-600 dark:text-amber-400 bg-amber-100/60 dark:bg-amber-900/30 rounded-b-lg'
                  : 'text-amber-800 dark:text-amber-200 hover:text-amber-600 dark:hover:text-amber-400'
              }`}
              onClick={() => setActiveTab('games')}
            >
              Games
            </button>
            <button
              className={`py-3 px-4 sm:px-6 font-medium text-base sm:text-lg whitespace-nowrap ${
                activeTab === 'friends'
                  ? 'text-amber-600 dark:text-amber-400 bg-amber-100/60 dark:bg-amber-900/30 rounded-b-lg'
                  : 'text-amber-800 dark:text-amber-200 hover:text-amber-600 dark:hover:text-amber-400'
              }`}
              onClick={() => setActiveTab('friends')}
            >
              Friends
            </button>
          </div>
        </Card>

        <div className="w-full">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}