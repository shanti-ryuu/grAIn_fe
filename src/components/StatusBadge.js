'use client';

export default function StatusBadge({ status = 'idle', showLabel = true }) {
  const statusConfig = {
    active: {
      bg: 'bg-status-success/10',
      border: 'border-status-success/30',
      text: 'text-status-success',
      label: 'Active',
      dot: 'bg-status-success',
    },
    idle: {
      bg: 'bg-gray-100',
      border: 'border-gray-200',
      text: 'text-gray-600',
      label: 'Idle',
      dot: 'bg-gray-400',
    },
    warning: {
      bg: 'bg-status-warning/10',
      border: 'border-status-warning/30',
      text: 'text-status-warning',
      label: 'Warning',
      dot: 'bg-status-warning',
    },
    error: {
      bg: 'bg-status-danger/10',
      border: 'border-status-danger/30',
      text: 'text-status-danger',
      label: 'Error',
      dot: 'bg-status-danger',
    },
  };

  const config = statusConfig[status] || statusConfig.idle;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-md-ios border ${config.bg} ${config.border} transition-all`}>
      <div className={`w-2 h-2 rounded-full ${config.dot} ${status === 'active' ? 'animate-pulse' : ''}`} />
      {showLabel && <span className={`text-sm font-semibold ${config.text}`}>{config.label}</span>}
    </div>
  );
}
