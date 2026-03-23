'use client';
import { useEffect, useState } from 'react';
import {
  Thermometer,
  Droplets,
  Activity,
  Zap,
  RotateCw,
  Wind,
  Clock,
  Hourglass,
} from 'lucide-react';
import { LoadingSkeleton, StatusBadge, ProgressBar, SensorCard, StatItem, DryingSimulation } from '@/components';
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
    const userName = user?.email?.split('@')[0] || 'Farmer';
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

  // Determine status color based on system state
  const getSystemStatus = () => {
    if (data.status === 'Running') return 'active';
    return 'idle';
  };

  // Calculate drying progress (mock - in real app this comes from backend)
  const dryingProgress = 45;
  const timeRemaining = '2h 30m';

  return (
    <div className="w-full pb-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-ios-text mb-2">{greeting}</h1>
          <p className="text-ios-text-tertiary font-medium">Monitor your grain dryer</p>
        </div>
        <StatusBadge status={getSystemStatus()} showLabel={true} />
      </div>

      {isLoading ? (
        <LoadingSkeleton count={4} />
      ) : (
        <>
          {/* Drying Simulation */}
          <div className="mb-6 animate-slide-in-up">
            <DryingSimulation
              moistureLevel={data.moistureLevel}
              isDrying={data.status === 'Running'}
            />
          </div>

          {/* Drying Progress Section */}
          <div className="bg-white rounded-md-ios border border-gray-200 p-6 shadow-ios-sm mb-6 animate-slide-in-up">
            <ProgressBar
              progress={dryingProgress}
              timeRemaining={timeRemaining}
              showLabel={true}
              showTime={true}
            />
          </div>

          {/* Sensor Grid - 2 columns */}
          <div className="grid grid-cols-2 gap-4 mb-6 animate-slide-in-up">
            <SensorCard
              title="Temperature"
              value={data.temperature}
              unit="°C"
              icon={Thermometer}
              status={data.temperature > 60 ? 'warning' : 'normal'}
              onClick={() => onNavigate('control')}
            />
            <SensorCard
              title="Humidity"
              value={data.humidity}
              unit="%"
              icon={Droplets}
              status={data.humidity > 80 ? 'warning' : 'normal'}
              onClick={() => onNavigate('control')}
            />
            <SensorCard
              title="Moisture"
              value={data.moistureLevel}
              unit="%"
              icon={Activity}
              status={data.moistureLevel > 15 ? 'normal' : 'warning'}
              onClick={() => onNavigate('control')}
            />
            <SensorCard
              title="Energy"
              value={data.energyConsumption}
              unit="kWh"
              icon={Zap}
              status="normal"
              onClick={() => onNavigate('control')}
            />
          </div>

          {/* System Status Cards */}
          <div className="grid grid-cols-2 gap-4 mb-6 animate-slide-in-up">
            <StatItem
              label="Status"
              value={data.status}
              icon={RotateCw}
            />
            <StatItem
              label="Fan Speed"
              value={data.fanSpeed}
              unit="%"
              icon={Wind}
            />
            <StatItem
              label="Duration"
              value={data.dryingTime}
              unit="hrs"
              icon={Clock}
            />
            <StatItem
              label="Time Running"
              value="1h 45m"
              icon={Hourglass}
            />
          </div>

          {/* Quick Actions Section */}
          <div className="bg-gradient-to-br from-grain-green/10 to-grain-gold/10 border border-grain-green/20 rounded-md-ios p-6 animate-slide-in-up">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-ios-text mb-1">System Running</h3>
                <p className="text-sm text-ios-text-tertiary">Click below to adjust settings</p>
              </div>
              <button
                onClick={() => onNavigate('control')}
                className="px-6 py-3 bg-grain-green text-white font-semibold rounded-md-ios shadow-ios-md hover:shadow-ios-lg active:scale-95 transition-all"
              >
                Control
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
