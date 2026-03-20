// API: GET /api/dryer/control
// This endpoint handles dryer start/stop, temperature, and fan speed control
// Future implementation will connect to IoT backend

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { action, temperature, fanSpeed } = req.body;

    // TODO: Replace mock response with actual API call to IoT backend
    // const response = await fetch('https://iot-backend.example.com/api/dryer/control', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
    //   body: JSON.stringify({ action, temperature, fanSpeed })
    // });

    // Mock response
    return res.status(200).json({
      success: true,
      action,
      temperature,
      fanSpeed,
      timestamp: new Date().toISOString(),
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
