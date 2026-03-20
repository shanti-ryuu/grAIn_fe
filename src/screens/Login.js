'use client';
import { useState } from 'react';
import { Button } from '@/components';
import { useAppContext } from '@/context/AppContext';

export default function Login({ onLoginSuccess, onCreateAccountClick }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { showToast } = useAppContext();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Basic validation
    if (!email || !password) {
      setError('Please enter email and password');
      setIsLoading(false);
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email');
      setIsLoading(false);
      return;
    }

    try {
      // Simulate login API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Store login state
      localStorage.setItem('user', JSON.stringify({ email, loginTime: new Date().toISOString() }));
      showToast(`Welcome back, ${email.split('@')[0]}!`, 'success');
      onLoginSuccess({ email });
    } catch (err) {
      setError('Login failed. Please try again.');
      showToast('Login failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail('demo@graindry.com');
    setPassword('demo123');
    handleLogin({ preventDefault: () => {} });
  };

  const handleCreateAccount = () => {
    onCreateAccountClick();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ios-bg via-white to-green-50 flex items-center justify-center px-3 sm:px-4 py-6 sm:py-0">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-20 h-20 sm:w-32 sm:h-32 flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <img src="/logo/grain-logo.png" alt="grAIn Logo" className="w-full h-full object-contain" />
          </div>
          <p className="text-xs sm:text-base text-ios-text-tertiary font-medium">IoT Grain Dryer System</p>
        </div>

        {/* Glassmorphism Card */}
        <div className="backdrop-blur-xl bg-white/30 rounded-3xl shadow-2xl p-5 sm:p-8 border border-white/20 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-ios-text mb-6">Login to Your Account</h2>

          {error && (
            <div className="mb-4 p-3 bg-ios-red/10 border border-ios-red/30 rounded-ios text-ios-red text-xs sm:text-sm font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-xs sm:text-sm text-ios-text-secondary font-semibold mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-white/50 border border-white/30 rounded-ios px-4 py-2.5 sm:py-3 text-sm sm:text-base text-ios-text placeholder-ios-text-tertiary focus:outline-none focus:ring-2 focus:ring-grain-green focus:bg-white transition-all backdrop-blur-sm"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs sm:text-sm text-ios-text-secondary font-semibold mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-white/50 border border-white/30 rounded-ios px-4 py-2.5 sm:py-3 text-sm sm:text-base text-ios-text placeholder-ios-text-tertiary focus:outline-none focus:ring-2 focus:ring-grain-green focus:bg-white transition-all backdrop-blur-sm"
              />
            </div>

            {/* Login Button */}
            <Button
              label="Sign In"
              onClick={handleLogin}
              fullWidth
              loading={isLoading}
              className="rounded-ios py-2.5 sm:py-3 mt-6 text-sm sm:text-base font-bold"
            />
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/20"></div>
            <span className="text-ios-text-tertiary text-xs sm:text-sm">or</span>
            <div className="flex-1 h-px bg-white/20"></div>
          </div>

          {/* Create Account */}
          <Button
            label="Create an Account"
            onClick={handleCreateAccount}
            variant="outline"
            fullWidth
            className="rounded-ios py-2.5 sm:py-3 text-sm sm:text-base font-bold"
          />
        </div>

        {/* Footer */}
        <div className="text-center text-ios-text-tertiary text-xs sm:text-sm">
          <p>try demo account to explore</p>
        </div>
      </div>
    </div>
  );
}
