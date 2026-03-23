'use client';
import { useState, useEffect } from 'react';
import {
  Play,
  Square,
  Thermometer,
  Wind,
  Flame,
  Settings,
  Snowflake,
} from 'lucide-react';
import { Button, Slider, StatusBadge, ModeToggle, StatItem } from '@/components';
import { controlDryer, updateTemperature, updateFanSpeed, logAuditAction } from '@/utils/api';
import { useAppContext } from '@/context/AppContext';

export default function DryerControl() {
  const { dashboardData, updateDashboardData, showToast, setLoading } = useAppContext();
  const [temperature, setTemperature] = useState(dashboardData.temperature);
  const [fanSpeed, setFanSpeed] = useState(dashboardData.fanSpeed);
  const [isRunning, setIsRunning] = useState(dashboardData.status === 'Running');
  const [mode, setMode] = useState('manual'); // 'auto' or 'manual'
  const [submitLoading, setSubmitLoading] = useState(false);

  const handleStartStop = async () => {
    setSubmitLoading(true);
    setLoading(true);
    const action = isRunning ? 'stop' : 'start';
    try {
      await controlDryer(action);
      setIsRunning(!isRunning);
      updateDashboardData({ status: !isRunning ? 'Running' : 'Idle' });
      showToast(`Dryer ${action}ed successfully`, 'success');
      logAuditAction('dryer_control', { action });
    } catch (error) {
      showToast('Failed to control dryer', 'error');
    } finally {
      setSubmitLoading(false);
      setLoading(false);
    }
  };

  const handleTemperatureChange = async (value) => {
    setTemperature(value);
    try {
      await updateTemperature(value);
      updateDashboardData({ temperature: value });
      logAuditAction('temperature_updated', { temperature: value });
    } catch (error) {
      showToast('Failed to update temperature', 'error');
    }
  };

  const handleFanSpeedChange = async (value) => {
    setFanSpeed(value);
    try {
      await updateFanSpeed(value);
      updateDashboardData({ fanSpeed: value });
      logAuditAction('fan_speed_updated', { fanSpeed: value });
    } catch (error) {
      showToast('Failed to update fan speed', 'error');
    }
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    showToast(`Switched to ${newMode === 'auto' ? 'Auto' : 'Manual'} mode`, 'success');
    logAuditAction('mode_changed', { mode: newMode });
  };

  return (
    <div className="w-full animate-fade-in pb-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-ios-text mb-1">Control System</h1>
          <p className="text-ios-text-tertiary font-medium">Manage dryer settings and operation</p>
        </div>
        <StatusBadge status={isRunning ? 'active' : 'idle'} showLabel={true} />
      </div>

      {/* Main Control Card */}
      <div className="bg-white rounded-md-ios border border-gray-200 shadow-ios-md p-8 mb-6 animate-slide-in-up">
        {/* Status Section */}
        <div className="text-center mb-8">
          <p className="text-sm text-ios-text-tertiary font-medium mb-3">SYSTEM STATUS</p>
          <div className={`text-5xl font-bold transition-colors ${isRunning ? 'text-grain-green' : 'text-gray-400'}`}>
            <span
              className={`inline-block w-3 h-3 rounded-full mr-3 ${
                isRunning ? 'bg-grain-green animate-pulse' : 'bg-gray-300'
              }`}
            />
            {isRunning ? 'Running' : 'Idle'}
          </div>
        </div>

        {/* Start/Stop Button - Large and prominent */}
        <button
          onClick={handleStartStop}
          disabled={submitLoading}
          className={`w-full py-6 px-4 rounded-md-ios font-bold text-xl mb-8 transition-all active:scale-95 shadow-ios-md hover:shadow-ios-lg flex items-center justify-center gap-3 ${
            isRunning
              ? 'bg-status-danger text-white hover:bg-red-600'
              : 'bg-grain-green text-white hover:bg-green-600'
          } ${submitLoading ? 'opacity-70' : ''}`}
        >
          {submitLoading ? (
            <>
              <div className="animate-spin">⟳</div>
              <span>Processing...</span>
            </>
          ) : isRunning ? (
            <>
              <Square className="w-6 h-6" />
              <span>Stop Dryer</span>
            </>
          ) : (
            <>
              <Play className="w-6 h-6" />
              <span>Start Dryer</span>
            </>
          )}
        </button>

        {/* Mode Selection */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-ios-text-tertiary mb-3 uppercase tracking-wider">
            Operating Mode
          </p>
          <ModeToggle
            mode={mode}
            onChange={handleModeChange}
            disabled={isRunning}
          />
          <p className="text-xs text-ios-text-tertiary mt-2">
            {mode === 'auto'
              ? 'System automatically adjusts settings based on moisture levels'
              : 'Manually control temperature and fan speed'}
          </p>
        </div>

        {/* Control Sliders - only show when running or in manual mode */}
        <div className="bg-gray-50 rounded-md-ios p-6 mb-6">
          <p className="text-sm font-semibold text-ios-text-tertiary mb-6 uppercase tracking-wider">
            Advanced Settings
          </p>

          <div className="space-y-6">
            <Slider
              label="Temperature"
              value={temperature}
              min={20}
              max={80}
              unit="°C"
              onChange={handleTemperatureChange}
              disabled={!isRunning || mode === 'auto'}
            />
            <Slider
              label="Fan Speed"
              value={fanSpeed}
              min={0}
              max={100}
              unit="%"
              onChange={handleFanSpeedChange}
              disabled={!isRunning || mode === 'auto'}
            />
          </div>
        </div>

        {mode === 'auto' && (
          <div className="bg-status-info/10 border border-status-info/30 rounded-md-ios p-4 mb-6">
            <p className="text-sm text-status-info font-semibold flex items-center gap-2">
              <span>✓</span> Auto mode enabled - System is self-adjusting
            </p>
          </div>
        )}
      </div>

      {/* Quick Presets */}
      <div className="bg-white rounded-md-ios border border-gray-200 shadow-ios-md p-6 mb-6 animate-slide-in-up">
        <h3 className="font-bold text-ios-text mb-4 text-lg">Quick Presets</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleFanSpeedChange(100)}
            disabled={!isRunning || mode === 'auto'}
            className="p-3 rounded-md-ios border border-status-danger/30 bg-status-danger/5 text-status-danger hover:bg-status-danger/10 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
          >
            <Flame className="w-4 h-4" />
            High Speed
          </button>
          <button
            onClick={() => handleFanSpeedChange(50)}
            disabled={!isRunning || mode === 'auto'}
            className="p-3 rounded-md-ios border border-grain-gold/30 bg-grain-gold/10 text-grain-gold hover:bg-grain-gold/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
          >
            <Settings className="w-4 h-4" />
            Medium Speed
          </button>
          <button
            onClick={() => handleFanSpeedChange(25)}
            disabled={!isRunning || mode === 'auto'}
            className="p-3 rounded-md-ios border border-status-info/30 bg-status-info/10 text-status-info hover:bg-status-info/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
          >
            <Snowflake className="w-4 h-4" />
            Low Speed
          </button>
          <button
            onClick={() => handleTemperatureChange(60)}
            disabled={!isRunning || mode === 'auto'}
            className="p-3 rounded-md-ios border border-status-warning/30 bg-status-warning/10 text-status-warning hover:bg-status-warning/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
          >
            <Thermometer className="w-4 h-4" />
            Standard Temp
          </button>
        </div>
      </div>

      {/* System Info */}
      <div className="grid grid-cols-3 gap-4 animate-slide-in-up">
        <StatItem
          label="Current Temp"
          value={temperature}
          unit="°C"
          icon={Thermometer}
        />
        <StatItem
          label="Fan Speed"
          value={fanSpeed}
          unit="%"
          icon={Wind}
        />
        <StatItem
          label="Mode"
          value={mode === 'auto' ? 'Auto' : 'Manual'}
          icon={Settings}
        />
      </div>
    </div>
  );
}
