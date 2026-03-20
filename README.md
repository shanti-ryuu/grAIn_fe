# grAIn - IoT Rice Grain Dryer Frontend

A fully functional, interactive React frontend mockup for a smart grain drying system with real-time monitoring and control.

## 🌾 Features

- **Dashboard**: Real-time monitoring of temperature, humidity, drying time, and energy consumption
- **Dryer Control**: Start/stop dryer, adjust temperature and fan speed with interactive sliders
- **Analytics**: View historical data with charts (moisture trends, drying cycles, energy usage)
- **Alerts & Notifications**: System alerts color-coded by severity (info, warning, critical)
- **Settings**: Manage devices, preferences, and API credentials for future backend integration
- **Responsive Design**: Mobile-first, fully responsive across all devices
- **Mock API**: Complete mock API system with simulated data for development

## 🎨 Branding

- **Logo**: grAIn with custom styling (g,r,n in black, A,I in green, golden wheat stalks)
- **Colors**: Green (#4CAF50), Gold (#FFD700), Neutral light gray (#F5F5F5)
- **Style**: Minimalist, flat, professional agri-tech design

## 📁 Project Structure

```
grAIn_fe/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.js          # Root layout with providers
│   │   ├── page.js            # Home page
│   │   ├── App.js             # Main app component
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable components
│   │   ├── Card.js            # Data display cards
│   │   ├── Button.js          # Interactive buttons
│   │   ├── Slider.js          # Range sliders
│   │   ├── LoadingSkeleton.js # Loading state
│   │   ├── Chart.js           # Data visualizations
│   │   ├── NotificationCard.js# Alert display
│   │   ├── Toast.js           # Toast notifications
│   │   ├── Header.js          # App header
│   │   ├── Navigation.js      # Bottom tab navigation
│   │   └── index.js           # Component exports
│   ├── screens/               # Main app screens
│   │   ├── Dashboard.js       # Home screen
│   │   ├── DryerControl.js    # Control interface
│   │   ├── Analytics.js       # Data visualization
│   │   ├── Alerts.js          # Alert management
│   │   ├── Settings.js        # User preferences
│   │   └── index.js           # Screen exports
│   ├── context/               # React Context
│   │   └── AppContext.js      # App state management
│   ├── hooks/                 # Custom React hooks
│   │   └── useFetchData.js    # Data fetching hook
│   ├── utils/                 # Utility functions
│   │   ├── api.js             # Mock API calls
│   │   ├── constants.js       # App constants
│   │   └── validators.js      # Input validation
│   └── api/                   # API route placeholders
│       ├── dryer/
│       │   ├── control.js     # Dryer control endpoint
│       │   └── data.js        # Dryer data endpoint
│       ├── analytics/
│       │   └── history.js     # Analytics data endpoint
│       ├── alerts/
│       │   └── index.js       # Alerts endpoint
│       └── settings/
│           └── update.js      # Settings endpoint
├── public/
│   └── logo/
│       └── grain-logo.svg     # App logo
├── package.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── jsconfig.json
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Production Build

```bash
npm run build
npm start
```

## 🎯 How It Works

### Mock API System

The app uses a fully functional mock API system (`src/utils/api.js`) that simulates backend responses with realistic delays. All API calls return mock data without requiring an actual backend server.

**Mock Data Includes:**
- Real-time sensor readings (temperature, humidity, moisture)
- Historical analytics data
- System alerts and notifications
- Device status information

### State Management

Uses React Context API (`src/context/AppContext.js`) for global state management including:
- Dashboard data
- User settings
- Alert management
- Toast notifications

### Interactive Features

All user interactions are fully functional:
- Start/stop dryer with visual feedback
- Adjust temperature and fan speed with sliders
- Filter analytics by time period
- Dismiss alerts
- Toggle preferences
- Export data (mock)

### Future Backend Integration

API placeholder files in `src/api/` are ready for Next.js backend integration. Each includes TODO comments showing where to connect real API endpoints.

## 🔧 Customization

### Colors

Edit the color scheme in `tailwind.config.js`:

```js
colors: {
  'grain-green': '#4CAF50',
  'grain-gold': '#FFD700',
  'grain-dark': '#000000',
}
```

### Mock Data

Modify mock data in `src/utils/api.js` under `MOCK_DATA` object.

### API Endpoints

Update API calls in `src/utils/api.js` to point to your actual backend:

```js
// Before (mock):
export const fetchDashboardData = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_DATA.dashboard), 500);
  });
};

// After (real API):
export const fetchDashboardData = async () => {
  const response = await fetch('/api/dryer/data');
  return response.json();
};
```

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

All components and screens are fully responsive using Tailwind CSS utilities.

## 🎨 Styling

The app uses **Tailwind CSS** for all styling with:
- Custom color scheme
- Responsive grid layouts
- Smooth transitions and animations
- Mobile-first design approach
- Custom scrollbar styling

## 📊 Available Screens

1. **Dashboard** - Overview of all system metrics
2. **Dryer Control** - Manual control interface with sliders
3. **Analytics** - Historical data visualization with charts
4. **Alerts** - System notifications and alerts
5. **Settings** - Device management and preferences

## 🎮 Navigation

Bottom tab bar with 5 navigation items for easy access between screens. Active screen is highlighted in green.

## 📦 Dependencies

- **Next.js** - React framework
- **React** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Data visualization library
- **React Icons** - Icon library

## 🔐 Security Notes

- Mock API credentials are for demonstration only
- Before deploying, implement proper authentication
- Store real API keys securely in environment variables
- Validate all user inputs on the backend

## 📝 Audit Logging

All user actions are logged to the console for development purposes. Enable proper logging in `src/utils/api.js`:

```js
logAuditAction('action_name', { details });
```

## 🚢 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://your-api.example.com
API_KEY=your_key_here
```

## 🤝 Contributing

For backend integration:

1. Create actual API endpoints matching the placeholder structure
2. Update `src/utils/api.js` to call real endpoints
3. Move authentication logic from mock to real implementation
4. Update environment variables

## 📄 License

This project is ready for commercial use.

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Recharts Documentation](https://recharts.org)

---

**Built with ❤️ for precision grain drying**
