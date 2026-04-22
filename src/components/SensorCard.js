'use client';

export default function SensorCard({
  title,
  value,
  unit,
  icon: Icon,
  status = 'normal', // 'normal', 'warning', 'alert'
  onClick,
  className = '',
}) {
  const statusColors = {
    normal: 'border-gray-200 hover:border-grain-green/50',
    warning: 'border-status-warning/50 hover:border-status-warning',
    alert: 'border-status-danger/50 hover:border-status-danger',
  };

  const valueColors = {
    normal: 'text-grain-green',
    warning: 'text-status-warning',
    alert: 'text-status-danger',
  };

  const formatValue = (val) => {
    if (typeof val === 'number') {
      return val.toFixed(1);
    }
    return val;
  };

  return (
    <button
      onClick={onClick}
      className={`group w-full p-4 bg-white border rounded-md-ios shadow-ios-sm hover:shadow-ios-md transition-all duration-200 active:scale-95 ${statusColors[status]} ${className}`}
    >
      {/* Icon and title row */}
      <div className="flex items-start justify-between mb-3">
        {Icon && (
          <div className={`p-2 rounded-sm-ios transition-colors ${status === 'normal' ? 'bg-grain-green/10' : status === 'warning' ? 'bg-status-warning/10' : 'bg-status-danger/10'}`}>
            <Icon className={`w-5 h-5 ${status === 'normal' ? 'text-grain-green' : status === 'warning' ? 'text-status-warning' : 'text-status-danger'}`} />
          </div>
        )}
        {!Icon && (
          <div className="w-4 h-4" /> /* spacing */
        )}
        <p className="text-xs font-semibold text-ios-text-tertiary uppercase tracking-wider">{title}</p>
      </div>

      {/* Value and unit */}
      <div className="flex items-baseline gap-1">
        <span className={`text-3xl font-bold transition-colors ${valueColors[status]}`}>
          {formatValue(value)}
        </span>
        {unit && (
          <span className="text-xs font-medium text-ios-text-tertiary">
            {unit}
          </span>
        )}
      </div>

      {/* Hover indicator */}
      <div className="mt-2 h-0.5 w-0 group-hover:w-full bg-grain-green/30 rounded-full transition-all duration-300" />
    </button>
  );
}
