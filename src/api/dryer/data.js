// API: GET /api/dryer/data
// Fetches current dryer status and sensor data
// Future implementation will connect to IoT backend for real-time data

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // TODO: Replace mock response with actual API call to IoT backend
    // const response = await fetch('https://iot-backend.example.com/api/dryer/data', {
    //   headers: { 'Authorization': `Bearer ${API_KEY}` }
    // });

    // Mock response
    return res.status(200).json({
      temperature: 65.5,
      humidity: 42.3,
      dryingTime: 3.5,
      energyConsumption: 2.4,
      status: 'Running',
      fanSpeed: 75,
      moistureLevel: 18.5,
      lastUpdated: new Date().toISOString(),
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
