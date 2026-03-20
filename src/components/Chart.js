'use client';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Chart({ data, type = 'line', title, dataKey, xKey = 'time', label = '' }) {
  if (!data || data.length === 0) {
    return <div className="text-center py-8 text-ios-text-tertiary">No data available</div>;
  }

  const ChartComponent = type === 'bar' ? BarChart : LineChart;
  const DataComponent = type === 'bar' ? Bar : Line;
  
  const displayLabel = label || dataKey?.charAt(0).toUpperCase() + dataKey?.slice(1);

  return (
    <div className="w-full h-48 sm:h-80 md:h-96 bg-white rounded-ios shadow-ios-md p-3 sm:p-4 md:p-6 animate-slide-in">
      {title && <h3 className="text-xs sm:text-sm md:text-lg font-bold mb-2 sm:mb-3 md:mb-4 text-ios-text line-clamp-2">{title}</h3>}
      <ResponsiveContainer width="100%" height="100%">
        <ChartComponent data={data} margin={{ bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E5EA" />
          <XAxis dataKey={xKey} stroke="#8E8E93" tick={{ fontSize: 12 }} />
          <YAxis stroke="#8E8E93" tick={{ fontSize: 12 }} />
          <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E5EA', borderRadius: '12px', fontSize: '12px' }} />
          <Legend wrapperStyle={{ fontSize: '14px', paddingTop: '16px' }} />
          <DataComponent type="monotone" dataKey={dataKey} name={displayLabel} stroke="#34C759" fill="#34C759" isAnimationActive={true} />
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
}
