'use client';
import { useEffect, useState } from 'react';
import { Card, LoadingSkeleton } from '@/components';
import { fetchDashboardData, logAuditAction } from '@/utils/api';
import { useAppContext } from '@/context/AppContext';

export default function Dashboard({ onNavigate }) {
  const { dashboardData, setLoading, user } = useAppContext();
  const [data, setData] = useState(dashboardData);
  const [isLoading, setIsLoading] = useState(false);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    let greetingText = '';
    if (hour < 12) {
      greetingText = 'Good morning';
    } else if (hour < 18) {
      greetingText = 'Good afternoon';
    } else {
      greetingText = 'Good evening';
    }
    const userName = user?.email?.split('@')[0] || 'niggas';
    setGreeting(`${greetingText}, ${userName}`);
  }, [user]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setLoading(true);
      try {
        const result = await fetchDashboardData();
        setData(result);
        logAuditAction('dashboard_viewed', {});
      } finally {
        setIsLoading(false);
        setLoading(false);
      }
    };
    loadData();
  }, [setLoading]);

  return (
    <div className="w-full animate-fade-in pb-8">
      <div className="mb-8 sm:mb-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-ios-text capitalize mb-2">{greeting}</h1>
        <div className="h-1 w-12 sm:w-16 bg-gradient-to-r from-grain-green to-grain-gold rounded-full" />
        <p className="text-ios-text-tertiary mt-2 sm:mt-3 font-medium text-sm sm:text-base md:text-lg">Monitor your grain dryer in real-time</p>
      </div>

      {isLoading ? (
        <LoadingSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:gap-4 mb-6 sm:mb-8">
          <div className="group min-w-0">
            <Card
              title="Temperature"
              value={data.temperature}
              unit="°F"
              onClick={() => onNavigate('control')}
              className="hover:shadow-ios-lg m-0"
            />
            <p className="text-xs text-ios-text-tertiary text-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Click to control</p>
          </div>
          <div className="group min-w-0">
            <Card
              title="Humidity"
              value={data.humidity}
              unit="%"
              onClick={() => onNavigate('control')}
              className="hover:shadow-ios-lg m-0"
            />
            <p className="text-xs text-ios-text-tertiary text-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Click to control</p>
          </div>
          <div className="group min-w-0">
            <Card
              title="Drying Time"
              value={data.dryingTime}
              unit="hrs"
              onClick={() => onNavigate('control')}
              className="hover:shadow-ios-lg m-0"
            />
            <p className="text-xs text-ios-text-tertiary text-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Click to control</p>
          </div>
          <div className="group min-w-0">
            <Card
              title="Energy Consumption"
              value={data.energyConsumption}
              unit="kWh"
              onClick={() => onNavigate('control')}
              className="hover:shadow-ios-lg m-0"
            />
            <p className="text-xs text-ios-text-tertiary text-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Click to control</p>
          </div>
        </div>
      )}

      <div className="backdrop-blur-xl bg-gradient-to-br from-white/20 to-white/10 border border-white/40 rounded-ios shadow-ios-xl p-6 animate-slide-in">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-bold text-ios-text">System Status</h2>
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-grain-green to-grain-gold animate-pulse" />
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center justify-between pb-4 border-b border-white/20 group hover:bg-white/5 px-3 py-2 rounded-ios transition-colors">
            <span className="text-ios-text-secondary font-medium">Status</span>
            <span className="font-bold text-grain-green text-lg group-hover:scale-105 transition-transform">{data.status}</span>
          </div>
          <div className="flex items-center justify-between pb-4 border-b border-white/20 group hover:bg-white/5 px-3 py-2 rounded-ios transition-colors">
            <span className="text-ios-text-secondary font-medium">Fan Speed</span>
            <span className="font-bold text-grain-green text-lg group-hover:scale-105 transition-transform">{data.fanSpeed}%</span>
          </div>
          <div className="flex items-center justify-between group hover:bg-white/5 px-3 py-2 rounded-ios transition-colors">
            <span className="text-ios-text-secondary font-medium">Moisture Level</span>
            <span className="font-bold text-grain-green text-lg group-hover:scale-105 transition-transform">{data.moistureLevel}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
