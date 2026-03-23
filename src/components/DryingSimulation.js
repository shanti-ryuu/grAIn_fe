'use client';
import { useEffect, useState } from 'react';

export default function DryingSimulation({
  moistureLevel = 15, // 0-100%
  isDrying = true,
  className = '',
}) {
  const [displayMoisture, setDisplayMoisture] = useState(moistureLevel);

  useEffect(() => {
    setDisplayMoisture(moistureLevel);
  }, [moistureLevel]);

  // Determine color based on moisture level
  const getGrainColor = () => {
    if (displayMoisture > 60) return 'bg-yellow-700';      // Very wet
    if (displayMoisture > 40) return 'bg-yellow-600';      // Wet
    if (displayMoisture > 25) return 'bg-yellow-500';      // Medium
    if (displayMoisture > 15) return 'bg-yellow-400';      // Dry
    return 'bg-yellow-200';                                // Very dry
  };

  // Determine background color based on moisture
  const getBackgroundColor = () => {
    if (displayMoisture > 60) return 'from-yellow-100 to-yellow-50';
    if (displayMoisture > 40) return 'from-yellow-50 to-orange-50';
    return 'from-orange-50 to-amber-50';
  };

  // Generate grain positions (pseudo-random but consistent)
  const grains = Array.from({ length: 48 }, (_, i) => ({
    id: i,
    top: `${(i % 6) * 16}%`,
    left: `${(i % 8) * 12}%`,
    size: i % 3 === 0 ? 8 : i % 3 === 1 ? 10 : 12,
  }));

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br ${getBackgroundColor()} rounded-md-ios border border-amber-200 shadow-ios-sm ${className}`}
    >
      {/* Container */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-ios-text">Drying Progress</h3>
          <span className="text-sm font-bold text-grain-green bg-grain-green/10 px-3 py-1 rounded-full">
            {displayMoisture}% Moisture
          </span>
        </div>

        {/* Grain Visualization */}
        <div className="relative w-full h-40 bg-white/60 rounded-sm-ios border border-amber-100 overflow-hidden mb-4">
          {/* Grain particles */}
          {grains.map((grain) => (
            <div
              key={grain.id}
              className={`absolute rounded-full ${getGrainColor()} transition-all duration-700 ${
                isDrying && displayMoisture > 10 ? 'animate-pulse' : ''
              }`}
              style={{
                width: `${grain.size}px`,
                height: `${grain.size}px`,
                top: grain.top,
                left: grain.left,
                opacity: 0.7 + (displayMoisture / 100) * 0.3,
              }}
            />
          ))}

          {/* Overlay gradient for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
        </div>

        {/* Status Bar */}
        <div className="flex items-center gap-3">
          {/* Progress indicator line */}
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                displayMoisture > 60
                  ? 'bg-status-warning'
                  : displayMoisture > 25
                    ? 'bg-status-info'
                    : 'bg-grain-green'
              }`}
              style={{ width: `${100 - displayMoisture}%` }}
            />
          </div>
          {/* Status text */}
          <span className="text-xs font-semibold text-ios-text-tertiary whitespace-nowrap">
            {displayMoisture > 40 ? 'Drying...' : displayMoisture > 15 ? 'Nearly Done' : 'Complete'}
          </span>
        </div>
      </div>
    </div>
  );
}
