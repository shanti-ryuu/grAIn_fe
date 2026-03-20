'use client';
import { useState, useEffect } from 'react';
import { NotificationCard, LoadingSkeleton, Button } from '@/components';
import { fetchAlerts, logAuditAction } from '@/utils/api';
import { useAppContext } from '@/context/AppContext';

export default function Alerts() {
  const { alerts, dismissAlert, showToast, setLoading } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadAlerts = async () => {
      setIsLoading(true);
      setLoading(true);
      try {
        await fetchAlerts();
        logAuditAction('alerts_viewed', {});
      } finally {
        setIsLoading(false);
        setLoading(false);
      }
    };
    loadAlerts();
  }, [setLoading]);

  const handleDismissAll = () => {
    alerts.forEach((alert) => dismissAlert(alert.id));
    showToast('All alerts dismissed', 'success');
    logAuditAction('all_alerts_dismissed', {});
  };

  return (
    <div className="w-full animate-fade-in">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-ios-text">Alerts</h1>
          <p className="text-ios-text-tertiary mt-2 font-medium">System alerts and important notifications</p>
        </div>
        {alerts.length > 0 && (
          <Button label="Dismiss All" variant="secondary" onClick={handleDismissAll} className="text-sm" />
        )}
      </div>

      {isLoading ? (
        <LoadingSkeleton count={3} />
      ) : alerts.length === 0 ? (
        <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-ios shadow-ios-md p-10 text-center animate-slide-in">
          <div className="text-5xl mb-4">✓</div>
          <p className="text-ios-text text-lg font-semibold">No active alerts</p>
          <p className="text-ios-text-tertiary mt-2">Everything is running smoothly!</p>
        </div>
      ) : (
        <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-ios shadow-ios-md p-6 animate-slide-in">
          {alerts.map((alert) => (
            <NotificationCard key={alert.id} alert={alert} onDismiss={dismissAlert} />
          ))}
        </div>
      )}

      <div className="mt-8 backdrop-blur-xl bg-white/20 border border-white/30 rounded-ios shadow-ios-md p-6 animate-slide-in">
        <h2 className="text-2xl font-bold text-ios-text mb-6">Alert Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-white/20">
            <div>
              <p className="font-semibold text-ios-text">Enable Notifications</p>
              <p className="text-sm text-ios-text-tertiary">Receive alerts on your device</p>
            </div>
            <div className="relative inline-flex items-center h-8 rounded-full w-14 bg-gray-200 cursor-pointer transition-colors peer-checked:bg-grain-green">
              <input type="checkbox" defaultChecked className="sr-only peer absolute" />
              <div className="absolute inset-0 rounded-full bg-gray-200 peer-checked:bg-grain-green transition-colors" />
              <div className="absolute left-1 w-6 h-6 bg-white rounded-full transition-transform peer-checked:translate-x-6 z-10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
