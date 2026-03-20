'use client';

export default function Card({ title, value, unit, children, onClick, className = '' }) {
  return (
    <div
      onClick={onClick}
      className={`group relative backdrop-blur-xl bg-gradient-to-br from-white/25 to-white/10 border border-white/40 rounded-ios shadow-ios-xl p-2.5 sm:p-4 md:p-5 lg:p-6 flex flex-col items-center justify-center cursor-pointer hover:shadow-2xl hover:border-white/60 hover:bg-gradient-to-br hover:from-white/35 hover:to-white/15 transition-all active:scale-95 ${className}`}
    >
      {/* Subtle accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-grain-green/0 via-grain-green/20 to-grain-green/0 rounded-t-ios opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {title && <p className="text-ios-text-tertiary text-xs font-semibold uppercase tracking-wider mb-1.5 sm:mb-2 md:mb-3 opacity-80">{title}</p>}
      {value !== undefined && (
        <div className="flex items-baseline justify-center gap-0.5 sm:gap-1 flex-wrap w-full">
          <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-br from-grain-green to-grain-green/80 bg-clip-text text-transparent break-words leading-tight">
            {value}
          </p>
          {unit && <span className="text-xs sm:text-xs md:text-sm lg:text-base text-ios-text-tertiary font-semibold">{unit}</span>}
        </div>
      )}
      {children}
    </div>
  );
}
