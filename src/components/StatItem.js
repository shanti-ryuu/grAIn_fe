'use client';

export default function StatItem({
  label,
  value,
  unit,
  trend, // 'up', 'down', 'stable'
  trendValue, // percentage change
  icon: Icon,
  onClick,
  className = '',
}) {
  const getTrendColor = () => {
    if (trend === 'up') return 'text-status-success';
    if (trend === 'down') return 'text-status-danger';
    return 'text-ios-text-tertiary';
  };

  const getTrendIcon = () => {
    if (trend === 'up') return '↑';
    if (trend === 'down') return '↓';
    return '→';
  };

  return (
    <div
      onClick={onClick}
      className={`p-4 bg-white rounded-md-ios border border-gray-200 hover:shadow-ios-md transition-all ${onClick ? 'cursor-pointer active:scale-95' : ''} ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-ios-text-tertiary uppercase tracking-wider">
          {label}
        </p>
        {Icon && <Icon className="w-4 h-4 text-grain-green" />}
      </div>

      {/* Value row */}
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-ios-text">
          {value}
        </span>
        {unit && (
          <span className="text-sm text-ios-text-tertiary">
            {unit}
          </span>
        )}
      </div>

      {/* Trend indicator */}
      {trend && trendValue !== undefined && (
        <div className={`mt-2 flex items-center gap-1 text-xs font-semibold ${getTrendColor()}`}>
          <span>{getTrendIcon()}</span>
          <span>{trendValue}%</span>
          <span className="text-ios-text-tertiary">vs last session</span>
        </div>
      )}
    </div>
  );
}
