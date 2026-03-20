'use client';

export default function Button({
  label,
  onClick,
  variant = 'primary',
  disabled = false,
  fullWidth = false,
  loading = false,
  children,
  className = '',
}) {
  const baseClasses =
    'px-6 py-3 rounded-ios font-semibold transition-all focus:outline-none active:scale-95 text-base shadow-ios-sm';
  
  const variantClasses = {
    primary: 'bg-grain-green hover:bg-green-500 active:bg-green-600 text-white disabled:bg-gray-400 disabled:opacity-60',
    secondary: 'bg-gray-300 hover:bg-gray-400 active:bg-gray-500 text-gray-900 disabled:bg-gray-300 disabled:opacity-60',
    danger: 'bg-ios-red hover:bg-red-600 active:bg-red-700 text-white disabled:bg-gray-400 disabled:opacity-60',
    outline: 'border-2 border-grain-green text-grain-green hover:bg-green-50 active:bg-green-100 disabled:opacity-60',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant] || variantClasses.primary} ${widthClass} ${className}`}
    >
      {loading ? (
        <span className="inline-flex items-center">
          <span className="animate-spin mr-2">⟳</span>
          Loading...
        </span>
      ) : (
        label || children
      )}
    </button>
  );
}
