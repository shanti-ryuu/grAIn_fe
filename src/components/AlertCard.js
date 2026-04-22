'use client';
import { CheckCircle, Info, AlertTriangle, AlertCircle, X } from 'lucide-react';

export default function AlertCard({
  alert = {},
  onDismiss,
  className = '',
}) {
  const getSeverityConfig = (severity = 'info') => {
    const configs = {
      success: {
        bg: 'bg-status-success/10',
        border: 'border-status-success/30',
        text: 'text-status-success',
        icon: CheckCircle,
        label: 'Success',
      },
      info: {
        bg: 'bg-status-info/10',
        border: 'border-status-info/30',
        text: 'text-status-info',
        icon: Info,
        label: 'Info',
      },
      warning: {
        bg: 'bg-status-warning/10',
        border: 'border-status-warning/30',
        text: 'text-status-warning',
        icon: AlertTriangle,
        label: 'Warning',
      },
      error: {
        bg: 'bg-status-danger/10',
        border: 'border-status-danger/30',
        text: 'text-status-danger',
        icon: AlertCircle,
        label: 'Error',
      },
    };
    return configs[severity] || configs.info;
  };

  const config = getSeverityConfig(alert.severity);
  const IconComponent = config.icon;
  const timestamp = alert.timestamp
    ? new Date(alert.timestamp).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      })
    : '';

  return (
    <div
      className={`flex items-start gap-4 p-4 rounded-md-ios border transition-all ${config.bg} ${config.border} ${className}`}
    >
      {/* Icon */}
      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 ${config.text}`}>
        <IconComponent className="w-5 h-5" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className={`font-semibold text-sm ${config.text}`}>
            {alert.title || 'Alert'}
          </h3>
          {timestamp && (
            <span className="text-xs text-ios-text-tertiary flex-shrink-0">
              {timestamp}
            </span>
          )}
        </div>
        {alert.message && (
          <p className="text-sm text-ios-text-secondary leading-relaxed">
            {alert.message}
          </p>
        )}
      </div>

      {/* Dismiss button */}
      {onDismiss && (
        <button
          onClick={() => onDismiss(alert.id)}
          className="flex-shrink-0 p-1 hover:bg-black/5 rounded-xs-ios transition-colors active:scale-90"
        >
          <X className="w-4 h-4 text-ios-text-tertiary" />
        </button>
      )}
    </div>
  );
}
