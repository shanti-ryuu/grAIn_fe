'use client';
import { useState, useCallback, useEffect } from 'react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import Toast from '@/components/Toast';
import { LoadingScreen } from '@/components';
import {
  Login,
  CreateAccount,
  Dashboard,
  DryerControl,
  Analytics,
  Alerts,
  Settings,
} from '@/screens';
import { useAppContext } from '@/context/AppContext';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [isInitializing, setIsInitializing] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const { isLoggedIn, handleLogin, toast } = useAppContext();

  // Initial app loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleNavigate = useCallback((screenId) => {
    setIsNavigating(true);
    setCurrentScreen(screenId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setIsNavigating(false), 300);
  }, []);

  const handleCreateAccountClick = () => {
    setIsCreatingAccount(true);
  };

  const handleBackToLogin = () => {
    setIsCreatingAccount(false);
  };

  const handleAccountCreated = (user) => {
    setIsCreatingAccount(false);
    handleLogin(user);
  };

  if (!isLoggedIn) {
    if (isCreatingAccount) {
      return <CreateAccount onAccountCreated={handleAccountCreated} onBackToLogin={handleBackToLogin} />;
    }
    return <Login onLoginSuccess={handleLogin} onCreateAccountClick={handleCreateAccountClick} />;
  }

  if (isInitializing) {
    return <LoadingScreen />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'control':
        return <DryerControl />;
      case 'analytics':
        return <Analytics />;
      case 'alerts':
        return <Alerts />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-ios-bg flex flex-col">
      <Header />
      
      <main className={`flex-1 px-3 sm:px-4 py-4 sm:py-6 pb-24 sm:pb-28 max-w-7xl mx-auto w-full overflow-y-auto transition-opacity duration-300 ${
        isNavigating ? 'opacity-50' : 'opacity-100'
      }`}>
        {renderScreen()}
      </main>

      <Navigation currentScreen={currentScreen} onNavigate={handleNavigate} />

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
