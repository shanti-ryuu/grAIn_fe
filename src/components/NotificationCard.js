'use client';
import { Info, AlertTriangle, AlertCircle, X } from 'lucide-react';

export default function NotificationCard({ alert, onDismiss }) {
  const typeConfig = {
    info: {
      colors: 'bg-blue-50 border-l-4 border-ios-blue',
      title: 'Info',
      icon: Info,
    },
    warning: {
      colors: 'bg-yellow-50 border-l-4 border-yellow-500',
      title: 'Warning',
      icon: AlertTriangle,
    },
    critical: {
      colors: 'bg-red-50 border-l-4 border-ios-red',
      title: 'Critical',
      icon: AlertCircle,
    },
  };

  const config = typeConfig[alert.type] || typeConfig.info;
  const IconComponent = config.icon;

  return (
    <div className={`${config.colors} p-5 rounded-ios mb-3 flex justify-between items-start transition-all hover:shadow-ios-sm`}>
      <div className="flex-1 flex gap-3">
        <IconComponent className="w-5 h-5 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-bold text-ios-text">{config.title} - {alert.title}</p>
          <p className="text-sm text-ios-text-secondary mt-2">{alert.message}</p>
          <p className="text-xs text-ios-text-tertiary mt-3">{alert.timestamp}</p>
        </div>
      </div>
      {onDismiss && (
        <button
          onClick={() => onDismiss(alert.id)}
          className="ml-4 text-ios-text-tertiary hover:text-ios-text-secondary transition-colors active:scale-90 flex-shrink-0"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
