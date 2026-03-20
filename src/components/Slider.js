'use client';

export default function Slider({
  label,
  value,
  min = 0,
  max = 100,
  onChange,
  unit = '',
  disabled = false,
}) {
  return (
    <div className="w-full mb-6">
      {label && (
        <div className="flex justify-between mb-3">
          <label className="text-base font-semibold text-ios-text">{label}</label>
          <span className="text-base font-bold text-grain-green bg-green-50 px-3 py-1 rounded-full">
            {value}
            {unit && ` ${unit}`}
          </span>
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        disabled={disabled}
        className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-grain-green disabled:opacity-50 transition-opacity"
      />
    </div>
  );
}
