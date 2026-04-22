'use client';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-ios-bg via-white to-green-50">
      <div className="flex flex-col items-center gap-6">
        {/* Animated Logo */}
        <div className="relative w-24 h-24 sm:w-32 sm:h-32">
          <div className="absolute inset-0 bg-gradient-to-r from-grain-green to-grain-gold rounded-full animate-pulse opacity-75" />
          <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
            <img 
              src="/logo/grain-logo.png" 
              alt="grAIn Loading" 
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain animate-bounce"
            />
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-ios-text mb-2">
            gr<span className="text-grain-green">AI</span>n
          </h1>
          <p className="text-ios-text-tertiary font-medium text-sm sm:text-base">IoT Grain Dryer System</p>
        </div>

        {/* Loading Animation Dots */}
        <div className="flex gap-2 mt-4">
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-grain-green rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-grain-green rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-grain-green rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>

        <p className="text-ios-text-secondary text-xs sm:text-sm font-medium mt-4">Initializing System...</p>
      </div>
    </div>
  );
}
