'use client';

export default function ModeToggle({
  mode = 'auto', // 'auto' or 'manual'
  onChange,
  disabled = false,
  className = '',
}) {
  return (
    <div
      className={`flex items-center gap-1 p-1 bg-gray-100 rounded-md-ios border border-gray-200 ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {/* Auto button */}
      <button
        onClick={() => !disabled && onChange('auto')}
        disabled={disabled}
        className={`flex-1 py-2 px-4 rounded-sm-ios font-semibold text-sm transition-all duration-200 ${
          mode === 'auto'
            ? 'bg-grain-green text-white shadow-ios-sm'
            : 'text-ios-text-secondary hover:text-ios-text'
        }`}
      >
        Auto
      </button>

      {/* Manual button */}
      <button
        onClick={() => !disabled && onChange('manual')}
        disabled={disabled}
        className={`flex-1 py-2 px-4 rounded-sm-ios font-semibold text-sm transition-all duration-200 ${
          mode === 'manual'
            ? 'bg-grain-green text-white shadow-ios-sm'
            : 'text-ios-text-secondary hover:text-ios-text'
        }`}
      >
        Manual
      </button>
    </div>
  );
}
