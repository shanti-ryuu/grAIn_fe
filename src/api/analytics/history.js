// API: GET /api/analytics/history
// Fetches historical data for analytics charts (moisture, drying cycles, energy)
// Supports filtering by time period (daily, weekly, monthly)

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { period = 'weekly' } = req.query;

    // TODO: Replace mock response with actual API call to analytics backend
    // const response = await fetch(`https://iot-backend.example.com/api/analytics/history?period=${period}`, {
    //   headers: { 'Authorization': `Bearer ${API_KEY}` }
    // });

    // Mock response
    const mockData = {
      period,
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
      timestamp: new Date().toISOString(),
    };

    return res.status(200).json(mockData);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
