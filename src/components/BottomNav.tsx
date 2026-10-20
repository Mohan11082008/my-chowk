import React from 'react';
import {
  Home,
  Search,
  Briefcase,
  Bookmark,
  User,
  LayoutDashboard,
  PlusCircle,
  Users,
  Store,
} from 'lucide-react';
import { UserRole } from '../types';

export type WorkerTab = 'home' | 'search' | 'applications' | 'saved' | 'profile';
export type BusinessTab = 'dashboard' | 'jobs' | 'post' | 'applicants' | 'profile';

interface BottomNavProps {
  currentRole: UserRole;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  applicationsCount?: number;
  newApplicantsCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentRole,
  activeTab,
  onSelectTab,
  applicationsCount = 0,
  newApplicantsCount = 0,
}) => {
  if (currentRole === 'worker') {
    const tabs: { id: WorkerTab; label: string; icon: React.ElementType }[] = [
      { id: 'home', label: 'Jobs', icon: Home },
      { id: 'search', label: 'Search', icon: Search },
      { id: 'applications', label: 'Applied', icon: Briefcase },
      { id: 'saved', label: 'Saved', icon: Bookmark },
      { id: 'profile', label: 'Profile', icon: User },
    ];

    return (
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg">
        <div className="max-w-md mx-auto grid grid-cols-5 items-center h-16 px-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className="min-h-[44px] min-w-[44px] flex flex-col items-center justify-center relative py-1 transition-colors"
                aria-label={tab.label}
              >
                <div className="relative">
                  <Icon
                    size={20}
                    className={`transition-transform duration-200 ${
                      isActive ? 'text-orange-600 scale-110' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  />
                  {tab.id === 'applications' && applicationsCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 min-w-[15px] h-[15px] px-1 bg-orange-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                      {applicationsCount}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[10px] font-semibold mt-1 tracking-tight leading-none ${
                    isActive ? 'text-orange-600' : 'text-slate-500'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    );
  }

  // Business navigation
  const businessTabs: { id: BusinessTab; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'jobs', label: 'My Jobs', icon: Briefcase },
    { id: 'post', label: 'Post Job', icon: PlusCircle },
    { id: 'applicants', label: 'Applicants', icon: Users },
    { id: 'profile', label: 'Shop', icon: Store },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg">
      <div className="max-w-md mx-auto grid grid-cols-5 items-center h-16 px-1">
        {businessTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isPostTab = tab.id === 'post';

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className="min-h-[44px] min-w-[44px] flex flex-col items-center justify-center relative py-1 transition-colors"
              aria-label={tab.label}
            >
              <div className="relative">
                <Icon
                  size={isPostTab ? 23 : 20}
                  className={`transition-transform duration-200 ${
                    isPostTab
                      ? 'text-orange-600'
                      : isActive
                      ? 'text-blue-900 scale-110'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                />
                {tab.id === 'applicants' && newApplicantsCount > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[15px] h-[15px] px-1 bg-orange-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                    {newApplicantsCount}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] font-semibold mt-1 tracking-tight leading-none ${
                  isPostTab
                    ? 'text-orange-600 font-bold'
                    : isActive
                    ? 'text-blue-900 font-bold'
                    : 'text-slate-500'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
