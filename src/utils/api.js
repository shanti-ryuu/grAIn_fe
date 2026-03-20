// Mock API responses and constants
export const MOCK_DATA = {
  dashboard: {
    temperature: 65.5,
    humidity: 42.3,
    dryingTime: 3.5,
    energyConsumption: 2.4,
    status: 'Running',
    fanSpeed: 75,
    moistureLevel: 18.5,
  },
  analytics: {
    moistureTrends: [
      { time: '00:00', value: 45 },
      { time: '04:00', value: 40 },
      { time: '08:00', value: 32 },
      { time: '12:00', value: 25 },
      { time: '16:00', value: 20 },
      { time: '20:00', value: 15 },
      { time: '24:00', value: 12 },
    ],
    dryingCycles: [
      { cycle: 'Cycle 1', duration: 4.2 },
      { cycle: 'Cycle 2', duration: 3.8 },
      { cycle: 'Cycle 3', duration: 4.5 },
      { cycle: 'Cycle 4', duration: 3.5 },
      { cycle: 'Cycle 5', duration: 4.1 },
    ],
    energyUsage: [
      { time: 'Mon', value: 145 },
      { time: 'Tue', value: 165 },
      { time: 'Wed', value: 140 },
      { time: 'Thu', value: 170 },
      { time: 'Fri', value: 155 },
      { time: 'Sat', value: 160 },
      { time: 'Sun', value: 135 },
    ],
  },
  alerts: [
    {
      id: 1,
      type: 'info',
      title: 'Routine Maintenance',
      message: 'Filter cleaning recommended',
      timestamp: '2 hours ago',
    },
    {
      id: 2,
      type: 'warning',
      title: 'High Humidity',
      message: 'Humidity levels above 70%',
      timestamp: '1 hour ago',
    },
    {
      id: 3,
      type: 'critical',
      title: 'Temperature Alert',
      message: 'Room temperature below 50°F',
      timestamp: '30 minutes ago',
    },
  ],
  devices: [
    { id: 1, name: 'Main Dryer Unit', status: 'active', lastSeen: 'now' },
    { id: 2, name: 'Secondary Dryer', status: 'idle', lastSeen: '2 hours ago' },
    { id: 3, name: 'Humidity Sensor', status: 'active', lastSeen: 'now' },
    { id: 4, name: 'Temperature Probe', status: 'active', lastSeen: 'now' },
  ],
  auditLog: [],
};

// Simulated API calls
export const fetchDashboardData = async () => {
  console.log('[API] Fetching dashboard data');
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_DATA.dashboard);
    }, 500);
  });
};

export const fetchAnalyticsData = async (period = 'weekly') => {
  console.log(`[API] Fetching analytics data for ${period}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_DATA.analytics);
    }, 500);
  });
};

export const fetchAlerts = async () => {
  console.log('[API] Fetching alerts');
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_DATA.alerts);
    }, 500);
  });
};

export const fetchDevices = async () => {
  console.log('[API] Fetching devices');
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_DATA.devices);
    }, 500);
  });
};

export const controlDryer = async (action) => {
  console.log(`[API] Dryer control: ${action}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, action, timestamp: new Date().toISOString() });
    }, 800);
  });
};

export const updateTemperature = async (temperature) => {
  console.log(`[API] Setting temperature to ${temperature}°F`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, temperature, timestamp: new Date().toISOString() });
    }, 600);
  });
};

export const updateFanSpeed = async (speed) => {
  console.log(`[API] Setting fan speed to ${speed}%`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, speed, timestamp: new Date().toISOString() });
    }, 600);
  });
};

export const exportAnalytics = async (format = 'csv') => {
  console.log(`[API] Exporting analytics as ${format}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, format, filename: `analytics_${Date.now()}.${format}` });
    }, 1000);
  });
};

export const updateSettings = async (settings) => {
  console.log('[API] Updating settings', settings);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, settings, timestamp: new Date().toISOString() });
    }, 800);
  });
};

export const logAuditAction = (action, details) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    action,
    details,
  };
  MOCK_DATA.auditLog.push(logEntry);
  console.log('[Audit]', action, details);
};
