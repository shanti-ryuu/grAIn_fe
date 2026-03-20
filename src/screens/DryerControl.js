'use client';
import { useState, useEffect } from 'react';
import { Button, Slider } from '@/components';
import { controlDryer, updateTemperature, updateFanSpeed, logAuditAction } from '@/utils/api';
import { useAppContext } from '@/context/AppContext';

export default function DryerControl() {
  const { dashboardData, updateDashboardData, showToast, setLoading } = useAppContext();
  const [temperature, setTemperature] = useState(dashboardData.temperature);
  const [fanSpeed, setFanSpeed] = useState(dashboardData.fanSpeed);
  const [isRunning, setIsRunning] = useState(dashboardData.status === 'Running');
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

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-ios-text">Dryer Control</h1>
        <p className="text-ios-text-tertiary mt-2 font-medium">Adjust settings and manage your grain dryer</p>
      </div>

      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-ios shadow-ios-md p-8 mb-6 animate-slide-in">
        <div className="text-center mb-8">
          <p className="text-sm text-ios-text-tertiary mb-3 font-medium">Current Status</p>
          <div className={`text-4xl font-bold ${isRunning ? 'text-grain-green' : 'text-ios-text-tertiary'}`}>
            <span className={`inline-block w-4 h-4 rounded-full mr-2 ${isRunning ? 'bg-grain-green' : 'bg-gray-400'} animate-pulse`}></span>
            {isRunning ? 'Running' : 'Idle'}
          </div>
        </div>

        <Button
          label={isRunning ? 'Stop Dryer' : 'Start Dryer'}
          onClick={handleStartStop}
          variant={isRunning ? 'danger' : 'primary'}
          loading={submitLoading}
          fullWidth
          className="mb-8 rounded-ios py-5 text-lg font-bold"
        />

        <div className="space-y-6 mb-8">
          <Slider
            label="Temperature"
            value={temperature}
            min={20}
            max={80}
            unit="°C"
            onChange={handleTemperatureChange}
            disabled={!isRunning}
          />

          <Slider
            label="Fan Speed"
            value={fanSpeed}
            min={0}
            max={100}
            unit="%"
            onChange={handleFanSpeedChange}
            disabled={!isRunning}
          />
        </div>

        <div className="pt-6 border-t border-white/20">
          <h3 className="font-bold text-ios-text mb-4 text-lg">Quick Settings</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button
              label="High Speed"
              variant="outline"
              onClick={() => handleFanSpeedChange(100)}
              disabled={!isRunning}
              className="text-sm py-3"
            />
            <Button
              label="Medium Speed"
              variant="outline"
              onClick={() => handleFanSpeedChange(50)}
              disabled={!isRunning}
              className="text-sm py-3"
            />
            <Button
              label="Low Speed"
              variant="outline"
              onClick={() => handleFanSpeedChange(25)}
              disabled={!isRunning}
              className="text-sm py-3"
            />
            <Button
              label="Standard Temp"
              variant="outline"
              onClick={() => handleTemperatureChange(140)}
              disabled={!isRunning}
              className="text-sm py-3"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
