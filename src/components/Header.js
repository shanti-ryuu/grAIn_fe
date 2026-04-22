'use client';
import { useAppContext } from '@/context/AppContext';
import { LogoutIcon } from './Icons';

export default function Header() {
  const { user, handleLogout } = useAppContext();

  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-ios-sep shadow-ios-sm sticky top-0 z-10">
      <div className="px-3 sm:px-4 py-3 sm:py-5 flex items-center justify-between min-h-16">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          {/* Logo */}
          <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 flex items-center justify-center">
            <img src="/logo/grain-logo.png" alt="grAIn Logo" className="w-full h-full object-contain" />
          </div>
          <div className="min-w-0 flex-1">

            <p className="text-xs sm:text-xs text-ios-text-tertiary font-medium truncate">Grain Dryer System</p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <div className="hidden sm:flex flex-col items-end">
            <p className="text-sm font-semibold text-ios-text">{user?.email.split('@')[0]}</p>
            <p className="text-xs text-ios-text-tertiary">Connected</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-gray-100 rounded-ios transition-colors active:scale-90"
            title="Logout"
          >
            <LogoutIcon className="w-5 h-5 text-ios-text-secondary" />
          </button>
        </div>
      </div>
    </header>
  );
}
