const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const mockData = {
  dashboard: { temperature: 65.5, humidity: 42.3, dryingTime: 3.5, energyConsumption: 2.4, status: 'Running', fanSpeed: 75, moistureLevel: 18.5 }
};

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>grAIn - IoT Grain Dryer</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">
  <div id="app"></div>
  <script>
    const app = document.getElementById('app');
    
    const html = \`
      <div class="min-h-screen flex flex-col">
        <header class="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
          <div class="px-4 py-4 flex items-center">
            <h1 class="text-2xl font-bold text-gray-800">
              gr<span class="text-green-500">AI</span>n
            </h1>
            <p class="text-xs text-gray-600 ml-2">IoT Grain Dryer</p>
          </div>
        </header>

        <main class="flex-1 px-4 py-6 pb-24 max-w-7xl mx-auto w-full">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p class="text-gray-600 mb-6">Monitor your grain dryer in real-time</p>

          <div class="flex flex-wrap">
            <div class="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center w-full sm:w-1/2 lg:w-1/4 m-2">
              <p class="text-gray-600 text-sm font-semibold mb-2">Temperature</p>
              <p class="text-3xl font-bold text-green-500">65.5<span class="text-lg text-gray-500 ml-1">°F</span></p>
            </div>

            <div class="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center w-full sm:w-1/2 lg:w-1/4 m-2">
              <p class="text-gray-600 text-sm font-semibold mb-2">Humidity</p>
              <p class="text-3xl font-bold text-green-500">42.3<span class="text-lg text-gray-500 ml-1">%</span></p>
            </div>

            <div class="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center w-full sm:w-1/2 lg:w-1/4 m-2">
              <p class="text-gray-600 text-sm font-semibold mb-2">Drying Time</p>
              <p class="text-3xl font-bold text-green-500">3.5<span class="text-lg text-gray-500 ml-1">hrs</span></p>
            </div>

            <div class="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center w-full sm:w-1/2 lg:w-1/4 m-2">
              <p class="text-gray-600 text-sm font-semibold mb-2">Energy</p>
              <p class="text-3xl font-bold text-green-500">2.4<span class="text-lg text-gray-500 ml-1">kWh</span></p>
            </div>
          </div>

          <div class="mt-8 bg-white rounded-xl shadow-md p-6">
            <h2 class="text-xl font-bold text-gray-800 mb-4">System Status</h2>
            <div class="grid grid-cols-2 gap-4">
              <div class="flex items-center justify-between pb-3 border-b">
                <span class="text-gray-600">Status</span>
                <span class="font-semibold text-green-500">Running</span>
              </div>
              <div class="flex items-center justify-between pb-3 border-b">
                <span class="text-gray-600">Fan Speed</span>
                <span class="font-semibold text-green-500">75%</span>
              </div>
              <div class="flex items-center justify-between pb-3">
                <span class="text-gray-600">Moisture Level</span>
                <span class="font-semibold text-green-500">18.5%</span>
              </div>
            </div>
          </div>

          <div class="mt-8 bg-green-50 border-l-4 border-green-500 p-6 rounded">
            <h3 class="font-bold text-green-800">✓ App is Running!</h3>
            <p class="text-green-700 mt-2">The full interactive app requires Next.js. This page demonstrates the frontend would work, but npm installation is blocked by OneDrive.</p>
            <p class="text-green-600 text-sm mt-4"><strong>Solution:</strong> Try copying the project folder to C:\\Projects\\grain-fe (outside OneDrive) and running npm install there.</p>
          </div>
        </main>

        <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
          <div class="flex justify-around">
            <button class="flex-1 py-3 text-center transition-colors text-green-500 font-semibold border-t-4 border-green-500">
              <span class="block text-lg mb-1">🏠</span>
              <span class="text-xs">Dashboard</span>
            </button>
            <button class="flex-1 py-3 text-center transition-colors text-gray-600 hover:text-gray-800">
              <span class="block text-lg mb-1">⚙️</span>
              <span class="text-xs">Control</span>
            </button>
            <button class="flex-1 py-3 text-center transition-colors text-gray-600 hover:text-gray-800">
              <span class="block text-lg mb-1">📊</span>
              <span class="text-xs">Analytics</span>
            </button>
            <button class="flex-1 py-3 text-center transition-colors text-gray-600 hover:text-gray-800">
              <span class="block text-lg mb-1">🔔</span>
              <span class="text-xs">Alerts</span>
            </button>
            <button class="flex-1 py-3 text-center transition-colors text-gray-600 hover:text-gray-800">
              <span class="block text-lg mb-1">⚙️</span>
              <span class="text-xs">Settings</span>
            </button>
          </div>
        </nav>
      </div>
    \`;

    app.innerHTML = html;
  </script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
});

server.listen(PORT, () => {
  console.log(`\n✓ grAIn App is running at http://localhost:${PORT}\n`);
  console.log('📝 Note: This is a static preview since npm installation is blocked by OneDrive.');
  console.log('💡 For the full interactive app, move the project outside OneDrive.\n');
});
