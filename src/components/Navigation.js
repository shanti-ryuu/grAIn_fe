'use client';
import { NAVIGATION } from '@/utils/constants';
import { DashboardIcon, ControlIcon, AnalyticsIcon, AlertsIcon, SettingsIcon } from './Icons';

export default function Navigation({ currentScreen, onNavigate }) {
  const getIcon = (id) => {
    const iconProps = 'w-6 h-6';
    switch (id) {
      case 'dashboard':
        return <DashboardIcon className={iconProps} />;
      case 'control':
        return <ControlIcon className={iconProps} />;
      case 'analytics':
        return <AnalyticsIcon className={iconProps} />;
      case 'alerts':
        return <AlertsIcon className={iconProps} />;
      case 'settings':
        return <SettingsIcon className={iconProps} />;
      default:
        return null;
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-ios-sep shadow-ios-lg">
      <div className="flex justify-around max-w-full pt-2 sm:pt-3 pb-4 sm:pb-5 px-1 sm:px-2 gap-1">
        {NAVIGATION.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center gap-1 py-2 px-2 sm:px-3 rounded-ios transition-all flex-1 ${
              currentScreen === item.id
                ? 'text-grain-green scale-105'
                : 'text-ios-text-tertiary hover:text-ios-text-secondary'
            } active:scale-95 min-w-0`}
          >
            <span className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0">{getIcon(item.id)}</span>
            <span className={`text-xs font-semibold truncate ${currentScreen === item.id ? 'text-grain-green' : ''}`}>{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
