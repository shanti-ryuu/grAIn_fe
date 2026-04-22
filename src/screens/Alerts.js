'use client';
import { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { AlertCard, LoadingSkeleton, Button } from '@/components';
import { fetchAlerts, logAuditAction } from '@/utils/api';
import { useAppContext } from '@/context/AppContext';

export default function Alerts() {
  const { alerts, dismissAlert, showToast, setLoading } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState('all'); // 'all', 'error', 'warning', 'info', 'success'

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

  // Filter alerts by severity
  const filteredAlerts = filterSeverity === 'all'
    ? alerts
    : alerts.filter((alert) => alert.severity === filterSeverity);

  // Organize alerts by severity
  const alertsByResolve = (alerts) => {
    const errors = alerts.filter(a => a.severity === 'error');
    const warnings = alerts.filter(a => a.severity === 'warning');
    const info = alerts.filter(a => a.severity === 'info');
    const success = alerts.filter(a => a.severity === 'success');
    return [...errors, ...warnings, ...info, ...success];
  };

  const unreadCount = alerts.length;
  const errorCount = alerts.filter(a => a.severity === 'error').length;
  const warningCount = alerts.filter(a => a.severity === 'warning').length;

  return (
    <div className="w-full pb-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-ios-text mb-1">Alerts</h1>
          <div className="flex items-center gap-4 mt-3">
            <p className="text-ios-text-tertiary font-medium">
              {unreadCount} {unreadCount === 1 ? 'alert' : 'alerts'}
            </p>
            {errorCount > 0 && (
              <span className="text-xs font-semibold bg-status-danger/10 text-status-danger px-3 py-1 rounded-full">
                {errorCount} Critical
              </span>
            )}
            {warningCount > 0 && (
              <span className="text-xs font-semibold bg-status-warning/10 text-status-warning px-3 py-1 rounded-full">
                {warningCount} Warning
              </span>
            )}
          </div>
        </div>
        {alerts.length > 0 && (
          <Button
            label="Clear All"
            variant="outline"
            onClick={handleDismissAll}
            className="text-sm"
          />
        )}
      </div>

      {/* Filter Buttons */}
      {alerts.length > 0 && (
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setFilterSeverity('all')}
            className={`px-4 py-2 rounded-md-ios font-semibold text-sm transition-all ${
              filterSeverity === 'all'
                ? 'bg-grain-green text-white shadow-ios-sm'
                : 'bg-gray-100 text-ios-text-secondary hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterSeverity('error')}
            className={`px-4 py-2 rounded-md-ios font-semibold text-sm transition-all ${
              filterSeverity === 'error'
                ? 'bg-status-danger text-white shadow-ios-sm'
                : 'bg-status-danger/10 text-status-danger hover:bg-status-danger/20'
            }`}
          >
            Critical
          </button>
          <button
            onClick={() => setFilterSeverity('warning')}
            className={`px-4 py-2 rounded-md-ios font-semibold text-sm transition-all ${
              filterSeverity === 'warning'
                ? 'bg-status-warning text-white shadow-ios-sm'
                : 'bg-status-warning/10 text-status-warning hover:bg-status-warning/20'
            }`}
          >
            Warnings
          </button>
          <button
            onClick={() => setFilterSeverity('info')}
            className={`px-4 py-2 rounded-md-ios font-semibold text-sm transition-all ${
              filterSeverity === 'info'
                ? 'bg-status-info text-white shadow-ios-sm'
                : 'bg-status-info/10 text-status-info hover:bg-status-info/20'
            }`}
          >
            Info
          </button>
        </div>
      )}

      {/* Alerts List */}
      {isLoading ? (
        <LoadingSkeleton count={3} />
      ) : filteredAlerts.length === 0 ? (
        <div className="bg-white rounded-md-ios border border-gray-200 shadow-ios-sm p-12 text-center animate-slide-in-up">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="w-16 h-16 text-status-success" />
          </div>
          <h2 className="text-xl font-bold text-ios-text mb-2">No Alerts</h2>
          <p className="text-ios-text-tertiary">
            {filterSeverity === 'all'
              ? 'Everything is running smoothly!'
              : `No ${filterSeverity} alerts to display`}
          </p>
        </div>
      ) : (
        <div className="space-y-3 animate-slide-in-up">
          {alertsByResolve(filteredAlerts).map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onDismiss={dismissAlert}
            />
          ))}
        </div>
      )}

      {/* Alert Settings Section */}
      <div className="mt-8 bg-white rounded-md-ios border border-gray-200 shadow-ios-sm p-6 animate-slide-in-up">
        <h2 className="text-2xl font-bold text-ios-text mb-6">Alert Settings</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <div>
              <p className="font-semibold text-ios-text">Critical Alerts</p>
              <p className="text-sm text-ios-text-tertiary">Receive notifications for system errors</p>
            </div>
            <div className="relative inline-flex items-center h-8 w-14 bg-gray-200 rounded-full cursor-pointer transition-colors peer-checked:bg-grain-green">
              <input
                type="checkbox"
                defaultChecked
                className="sr-only peer absolute"
              />
              <div className="absolute inset-0 rounded-full bg-gray-200 peer-checked:bg-grain-green transition-colors" />
              <div className="absolute left-1 w-6 h-6 bg-white rounded-full transition-transform peer-checked:translate-x-6 z-10" />
            </div>
          </div>

          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <div>
              <p className="font-semibold text-ios-text">Warning Alerts</p>
              <p className="text-sm text-ios-text-tertiary">Get notified about system warnings</p>
            </div>
            <div className="relative inline-flex items-center h-8 w-14 bg-gray-200 rounded-full cursor-pointer transition-colors peer-checked:bg-grain-green">
              <input
                type="checkbox"
                defaultChecked
                className="sr-only peer absolute"
              />
              <div className="absolute inset-0 rounded-full bg-gray-200 peer-checked:bg-grain-green transition-colors" />
              <div className="absolute left-1 w-6 h-6 bg-white rounded-full transition-transform peer-checked:translate-x-6 z-10" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-ios-text">Information Updates</p>
              <p className="text-sm text-ios-text-tertiary">Receive informational messages</p>
            </div>
            <div className="relative inline-flex items-center h-8 w-14 bg-gray-200 rounded-full cursor-pointer transition-colors peer-checked:bg-grain-green">
              <input
                type="checkbox"
                defaultChecked
                className="sr-only peer absolute"
              />
              <div className="absolute inset-0 rounded-full bg-gray-200 peer-checked:bg-grain-green transition-colors" />
              <div className="absolute left-1 w-6 h-6 bg-white rounded-full transition-transform peer-checked:translate-x-6 z-10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
