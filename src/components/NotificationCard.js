'use client';

export default function NotificationCard({ alert, onDismiss }) {
  const typeColors = {
    info: 'bg-blue-50 border-l-4 border-ios-blue',
    warning: 'bg-yellow-50 border-l-4 border-yellow-500',
    critical: 'bg-red-50 border-l-4 border-ios-red',
  };

  const typeTitles = {
    info: 'ℹ️ Info',
    warning: '⚠️ Warning',
    critical: '🚨 Critical',
  };

  return (
    <div className={`${typeColors[alert.type]} p-5 rounded-ios mb-3 flex justify-between items-start transition-all hover:shadow-ios-sm`}>
      <div className="flex-1">
        <p className="font-bold text-ios-text">{typeTitles[alert.type]} - {alert.title}</p>
        <p className="text-sm text-ios-text-secondary mt-2">{alert.message}</p>
        <p className="text-xs text-ios-text-tertiary mt-3">{alert.timestamp}</p>
      </div>
      {onDismiss && (
        <button
          onClick={() => onDismiss(alert.id)}
          className="ml-4 text-ios-text-tertiary hover:text-ios-text-secondary font-bold text-lg transition-colors active:scale-90"
        >
          ✕
        </button>
      )}
    </div>
  );
}
