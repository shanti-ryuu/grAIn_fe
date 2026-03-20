'use client';

export default function Toast({ message, type = 'success' }) {
  const typeColors = {
    success: 'bg-grain-green',
    error: 'bg-ios-red',
    warning: 'bg-yellow-500',
    info: 'bg-ios-blue',
  };

  return (
    <div className={`${typeColors[type]} text-white px-5 py-3 rounded-ios shadow-ios-lg fixed bottom-24 right-4 animate-slide-in text-sm font-semibold`}>
      {message}
    </div>
  );
}
