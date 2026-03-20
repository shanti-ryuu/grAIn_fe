'use client';
import { useState, useEffect } from 'react';
import { Chart, Button, LoadingSkeleton } from '@/components';
import { fetchAnalyticsData, exportAnalytics, logAuditAction } from '@/utils/api';
import { useAppContext } from '@/context/AppContext';

export default function Analytics() {
  const { analyticsData, showToast, setLoading } = useAppContext();
  const [data, setData] = useState(analyticsData);
  const [period, setPeriod] = useState('weekly');
  const [isLoading, setIsLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setLoading(true);
      try {
        const result = await fetchAnalyticsData(period);
        setData(result);
        logAuditAction('analytics_viewed', { period });
      } finally {
        setIsLoading(false);
        setLoading(false);
      }
    };
    loadData();
  }, [period, setLoading]);

  const handleExport = async (format) => {
    setExportLoading(true);
    try {
      await exportAnalytics(format);
      showToast(`Exported as ${format.toUpperCase()}`, 'success');
      logAuditAction('analytics_exported', { format });
    } catch (error) {
      showToast('Failed to export', 'error');
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div className="w-full animate-fade-in">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-ios-text">Analytics</h1>
        <p className="text-ios-text-tertiary mt-2 font-medium text-xs sm:text-sm md:text-base">View drying trends and performance metrics</p>
      </div>

      <div className="mb-4 sm:mb-6 flex flex-wrap gap-2">
        <Button
          label="Daily"
          variant={period === 'daily' ? 'primary' : 'secondary'}
          onClick={() => setPeriod('daily')}
          className="text-xs sm:text-sm py-2 px-3 sm:p-2"
        />
        <Button
          label="Weekly"
          variant={period === 'weekly' ? 'primary' : 'secondary'}
          onClick={() => setPeriod('weekly')}
          className="text-xs sm:text-sm py-2 px-3 sm:p-2"
        />
        <Button
          label="Monthly"
          variant={period === 'monthly' ? 'primary' : 'secondary'}
          onClick={() => setPeriod('monthly')}
          className="text-xs sm:text-sm py-2 px-3 sm:p-2"
        />
      </div>

      <div className="mb-4 sm:mb-6 flex flex-wrap gap-2">
        <Button
          label="Export CSV"
          variant="outline"
          onClick={() => handleExport('csv')}
          loading={exportLoading}
          className="text-xs sm:text-sm py-2 px-3 sm:p-2"
        />
        <Button
          label="Export PDF"
          variant="outline"
          onClick={() => handleExport('pdf')}
          loading={exportLoading}
          className="text-xs sm:text-sm py-2 px-3 sm:p-2"
        />
      </div>

      {isLoading ? (
        <LoadingSkeleton count={3} />
      ) : (
        <div className="space-y-4 sm:space-y-6">
          <Chart
            data={data.moistureTrends}
            title="Moisture Levels Over Time"
            dataKey="value"
            xKey="time"
            label="Moisture Level (%)"
          />
          <Chart
            data={data.dryingCycles}
            title="Drying Cycle Duration"
            dataKey="duration"
            xKey="cycle"
            type="bar"
            label="Duration (hours)"
          />
          <Chart
            data={data.energyUsage}
            title="Weekly Energy Consumption"
            dataKey="value"
            xKey="time"
            type="bar"
            label="Energy Usage (kWh)"
          />
        </div>
      )}
    </div>
  );
}
