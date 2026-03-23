import './globals.css';
import { AppProvider } from '@/context/AppContext';

export const metadata = {
  title: 'grAIn - IoT Grain Dryer',
  description: 'Smart grain drying system with real-time monitoring and control',
};

export const viewport = 'width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
