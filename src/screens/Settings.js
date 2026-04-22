'use client';
import { useState } from 'react';
import { Button, LoadingSkeleton } from '@/components';
import { fetchDevices, updateSettings, logAuditAction } from '@/utils/api';
import { useAppContext } from '@/context/AppContext';
import { useFetchData } from '@/hooks/useFetchData';

export default function Settings() {
  const { settings: contextSettings, updateSettings: updateContextSettings, showToast } = useAppContext();
  const [apiKey, setApiKey] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  const { data: devices, loading } = useFetchData(fetchDevices);

  const handleToggle = (key) => {
    const newSettings = { ...contextSettings, [key]: !contextSettings[key] };
    updateContextSettings(newSettings);
    logAuditAction('setting_updated', { [key]: !contextSettings[key] });
  };

  const handleSaveCredentials = async () => {
    if (!apiKey) {
      showToast('Please enter an API key', 'warning');
      return;
    }
    setSubmitLoading(true);
    try {
      await updateSettings({ apiKey });
      updateContextSettings({ apiKey });
      setApiKey('');
      showToast('Credentials saved successfully', 'success');
      logAuditAction('credentials_saved', {});
    } catch (error) {
      showToast('Failed to save credentials', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-ios-text">Settings</h1>
        <p className="text-ios-text-tertiary mt-2 font-medium">Configure your grAIn application preferences</p>
      </div>

      {/* Device Status Section */}
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-ios shadow-ios-md p-6 mb-6 animate-slide-in">
        <h2 className="text-2xl font-bold text-ios-text mb-6">Connected Devices</h2>
        {loading ? (
          <LoadingSkeleton count={2} />
        ) : devices && devices.length > 0 ? (
          <div className="space-y-1">
            {devices.map((device) => (
              <div key={device.id} className="flex items-center justify-between py-4 border-b border-ios-sep last:border-b-0">
                <div>
                  <p className="font-semibold text-ios-text">{device.name}</p>
                  <p className="text-sm text-ios-text-tertiary">Last seen: {device.lastSeen}</p>
                </div>
                <span className={`px-3 py-2 rounded-ios text-xs font-bold ${device.status === 'active' ? 'bg-green-100 text-grain-green' : 'bg-gray-100 text-ios-text-tertiary'}`}>
                  {device.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-ios-text-tertiary">No devices connected</p>
        )}
      </div>

      {/* Preferences Section */}
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-ios shadow-ios-md p-6 mb-6 animate-slide-in">
        <h2 className="text-2xl font-bold text-ios-text mb-6">Preferences</h2>
        <div className="space-y-4">
          <div className="flex items-start justify-between py-4 border-b border-ios-sep gap-4">
            <div className="flex-1">
              <p className="font-semibold text-ios-text">Notifications</p>
              <p className="text-sm text-ios-text-tertiary">Receive system alerts</p>
            </div>
            <button
              onClick={() => handleToggle('notifications')}
              className={`relative flex-shrink-0 inline-flex items-center h-8 rounded-full w-14 transition-colors ${
                contextSettings.notifications ? 'bg-grain-green' : 'bg-gray-300'
              }`}
            >
              <div className={`absolute w-6 h-6 bg-white rounded-full transition-transform ${
                contextSettings.notifications ? 'translate-x-7' : 'translate-x-1'
              }`} />
            </button>
          </div>
          <div className="flex items-start justify-between py-4 border-b border-ios-sep gap-4">
            <div className="flex-1">
              <p className="font-semibold text-ios-text">Auto Start</p>
              <p className="text-sm text-ios-text-tertiary">Start dryer on schedule</p>
            </div>
            <button
              onClick={() => handleToggle('autoStart')}
              className={`relative flex-shrink-0 inline-flex items-center h-8 rounded-full w-14 transition-colors ${
                contextSettings.autoStart ? 'bg-grain-green' : 'bg-gray-300'
              }`}
            >
              <div className={`absolute w-6 h-6 bg-white rounded-full transition-transform ${
                contextSettings.autoStart ? 'translate-x-7' : 'translate-x-1'
              }`} />
            </button>
          </div>
          <div className="flex items-start justify-between py-4 gap-4">
            <div className="flex-1">
              <p className="font-semibold text-ios-text">Maintenance Reminder</p>
              <p className="text-sm text-ios-text-tertiary">Remind about system maintenance</p>
            </div>
            <button
              onClick={() => handleToggle('maintenanceReminder')}
              className={`relative flex-shrink-0 inline-flex items-center h-8 rounded-full w-14 transition-colors ${
                contextSettings.maintenanceReminder ? 'bg-grain-green' : 'bg-gray-300'
              }`}
            >
              <div className={`absolute w-6 h-6 bg-white rounded-full transition-transform ${
                contextSettings.maintenanceReminder ? 'translate-x-7' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* API Credentials Section */}
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-ios shadow-ios-md p-6 animate-slide-in">
        <h2 className="text-2xl font-bold text-ios-text mb-2">API Credentials</h2>
        <p className="text-sm text-ios-text-tertiary mb-6">Enter your API key for backend integration</p>
        <input
          type="password"
          placeholder="Enter API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="w-full backdrop-blur-sm bg-white/30 border border-white/20 rounded-ios p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-grain-green text-ios-text placeholder-ios-text-tertiary"
        />
        <Button
          label="Save Credentials"
          onClick={handleSaveCredentials}
          fullWidth
          loading={submitLoading}
          className="rounded-ios py-4"
        />
      </div>
    </div>
  );
}
