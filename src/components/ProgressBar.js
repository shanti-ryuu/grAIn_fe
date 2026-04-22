'use client';


export default function ProgressBar({ 
  progress = 45,
  timeRemaining = '2h 30m',
  showLabel = true,
  showTime = true,
  size = 'md'
}) {
  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3',
  };

  const getProgressColor = () => {
    if (progress < 33) return 'from-status-info to-grain-green';
    if (progress < 66) return 'from-status-warning to-grain-gold';
    return 'from-status-warning to-status-danger';
  };

  return (
    <div className="w-full">
      {/* Header with label and percentage */}
      {showLabel && (
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-ios-text">Drying Progress</p>
          <div className="flex items-center gap-1">
            <span className="text-xl font-bold text-grain-green">{progress}%</span>
            {showTime && <span className="text-xs text-ios-text-tertiary">• {timeRemaining}</span>}
          </div>
        </div>
      )}

      {/* Progress bar with gradient */}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`h-full bg-gradient-to-r ${getProgressColor()} transition-all duration-500 rounded-full`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      {/* Time remaining label */}
      {showTime && (
        <p className="text-xs text-ios-text-tertiary mt-2">
          Approximately <span className="font-semibold text-ios-text">{timeRemaining}</span> remaining
        </p>
      )}
    </div>
  );
}
