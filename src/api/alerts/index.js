// API: GET /api/alerts
// Fetches system alerts and notifications
// Supports filtering by type (info, warning, critical)

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // TODO: Replace mock response with actual API call to alerts service
    // const response = await fetch('https://iot-backend.example.com/api/alerts', {
    //   headers: { 'Authorization': `Bearer ${API_KEY}` }
    // });

    // Mock response
    const mockAlerts = [
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
    ];

    return res.status(200).json({
      alerts: mockAlerts,
      total: mockAlerts.length,
      timestamp: new Date().toISOString(),
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
