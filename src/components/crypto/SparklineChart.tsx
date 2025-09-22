'use client';

import { useMemo } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface SparklineChartProps {
  data: number[];
  isPositive: boolean;
  width?: number;
  height?: number;
}

export default function SparklineChart({ 
  data, 
  isPositive, 
  width = 80, 
  height = 40 
}: SparklineChartProps) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    return data.map((price, index) => ({
      price,
      index,
    }));
  }, [data]);

  if (!chartData.length) {
    return (
      <div 
        className="flex items-center justify-center bg-gray-800 rounded"
        style={{ width, height }}
      >
        <span className="text-xs text-gray-500">No data</span>
      </div>
    );
  }

  const strokeColor = isPositive ? '#10B981' : '#EF4444';

  return (
    <div style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="price"
            stroke={strokeColor}
            strokeWidth={2}
            dot={false}
            activeDot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
