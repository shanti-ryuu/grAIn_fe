import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';

interface ChartProps {
  data: any[];
  type?: 'line' | 'bar';
  title?: string;
  dataKey?: string;
  xKey?: string;
  label?: string;
}

const screenWidth = Dimensions.get('window').width - 32;

const chartConfig = {
  backgroundColor: '#FFFFFF',
  backgroundGradientFrom: '#FFFFFF',
  backgroundGradientTo: '#FFFFFF',
  decimalPlaces: 1,
  color: (opacity: number = 1) => `rgba(34, 197, 94, ${opacity})`,
  labelColor: (opacity: number = 1) => `rgba(107, 114, 128, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '4',
    strokeWidth: '2',
    stroke: '#22C55E',
  },
};

export default function Chart({
  data = [],
  type = 'line',
  title = '',
  dataKey = 'value',
  xKey = 'label',
  label = '',
}: ChartProps) {
  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No data available</Text>
      </View>
    );
  }

  const labels = data.map((d) => d[xKey] || '');
  const values = data.map((d) => d[dataKey] || 0);

  const chartData = {
    labels,
    datasets: [{ data: values }],
  };

  return (
    <View style={styles.container}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {type === 'line' ? (
        <LineChart
          data={chartData}
          width={screenWidth}
          height={200}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      ) : (
        <BarChart
          data={chartData}
          width={screenWidth}
          height={200}
          chartConfig={chartConfig}
          style={styles.chart}
          yAxisLabel=""
          yAxisSuffix={label.includes('%') ? '%' : ''}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 12,
  },
  chart: {
    borderRadius: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 14,
  },
});
