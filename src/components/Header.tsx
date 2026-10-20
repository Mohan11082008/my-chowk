import React from 'react';
import { Bell, MapPin, ArrowRightLeft, Download, ShieldCheck } from 'lucide-react';
import { UserRole } from '../types';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface HeaderProps {
  currentRole: UserRole;
  onOpenRoleSwitcher: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount: number;
  currentLocality: string;
  onSelectLocalityClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onOpenRoleSwitcher,
  onOpenNotifications,
  unreadNotificationsCount,
  currentLocality,
  onSelectLocalityClick,
}) => {
  const { isInstallable, install } = usePWAInstall();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand & Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <img
            src="/assets/aistudio/WhatsApp_Image_2026-10-20_at_3.29.08_PM_8c34b5f8.jpeg"
            alt="MY CHOWK"
            className="w-10 h-10 object-contain rounded-xl"
          />
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight text-slate-900 leading-none">
              MY CHOWK
            </span>
            <span className="text-[10px] font-medium text-orange-600 tracking-wide mt-0.5 hidden sm:inline">
              Local Jobs · Local People
            </span>
          </div>
        </div>

        {/* Zone 2: Location & Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Locality Selector / Indicator */}
          <button
            onClick={onSelectLocalityClick}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-medium transition-colors"
            title="Nagpur Local Market"
          >
            <MapPin size={13} className="text-orange-600 shrink-0" />
            <span className="truncate max-w-[100px] sm:max-w-[130px]">{currentLocality}</span>
          </button>

          {/* Role Switcher Button */}
          <button
            onClick={onOpenRoleSwitcher}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-xs ${
              currentRole === 'worker'
                ? 'bg-orange-50 text-orange-800 border border-orange-200 hover:bg-orange-100'
                : 'bg-blue-50 text-blue-900 border border-blue-200 hover:bg-blue-100'
            }`}
          >
            <ArrowRightLeft size={13} className="shrink-0" />
            <span className="hidden xs:inline">
              {currentRole === 'worker' ? 'Worker Mode' : 'Business Mode'}
            </span>
            <span className="xs:hidden">
              {currentRole === 'worker' ? 'Worker' : 'Owner'}
            </span>
          </button>
        </div>

        {/* Zone 3: Notification Bell & PWA Install */}
        <div className="flex items-center gap-2 shrink-0">
          {/* PWA Install Button (Chromium / Android) */}
          {isInstallable && (
            <button
              onClick={install}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition shadow-xs"
            >
              <Download size={13} />
              Install App
            </button>
          )}

          {/* Notification Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="View notifications"
          >
            <Bell size={20} />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-orange-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center ring-2 ring-white animate-pulse">
                {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
