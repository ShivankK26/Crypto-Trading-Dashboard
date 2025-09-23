'use client';

import { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useCryptoStore } from '@/store/cryptoStore';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import { PriceData } from '@/types/crypto';

interface PriceChartProps {
  tokenId: string;
  timeframe: '1h' | '24h' | '7d' | '30d' | '90d' | '1y';
  type?: 'line' | 'area';
}

const timeframes = [
  { value: '1h', label: '1H' },
  { value: '24h', label: '24H' },
  { value: '7d', label: '7D' },
  { value: '30d', label: '30D' },
  { value: '90d', label: '90D' },
  { value: '1y', label: '1Y' },
] as const;

export default function PriceChart({ tokenId, timeframe, type = 'area' }: PriceChartProps) {
  const [chartData, setChartData] = useState<PriceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframe);
  const { cryptoAPI } = useCryptoStore();

  useEffect(() => {
    const fetchChartData = async () => {
      setIsLoading(true);
      try {
        const data = await cryptoAPI.getHistoricalData(tokenId, selectedTimeframe);
        setChartData(data);
      } catch (error) {
        console.error('Failed to fetch chart data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChartData();
  }, [tokenId, selectedTimeframe, cryptoAPI]);

  const chartStats = useMemo(() => {
    if (chartData.length === 0) return null;

    const firstPrice = chartData[0].price;
    const lastPrice = chartData[chartData.length - 1].price;
    const change = lastPrice - firstPrice;
    const changePercent = (change / firstPrice) * 100;
    const high = Math.max(...chartData.map(d => d.price));
    const low = Math.min(...chartData.map(d => d.price));

    return {
      current: lastPrice,
      change,
      changePercent,
      high,
      low,
    };
  }, [chartData]);

  const formatXAxisLabel = (timestamp: number) => {
    const date = new Date(timestamp);
    switch (selectedTimeframe) {
      case '1h':
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      case '24h':
        return date.toLocaleTimeString('en-US', { hour: '2-digit' });
      case '7d':
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      case '30d':
      case '90d':
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      case '1y':
        return date.toLocaleDateString('en-US', { month: 'short' });
      default:
        return date.toLocaleDateString();
    }
  };

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: number }) => {
    if (active && payload && payload.length && label !== undefined) {
      return (
        <div className="bg-[#1C1C1F] border border-[#252528] rounded-lg p-3 shadow-lg">
          <p className="text-sm text-[#E4E4E7] mb-1">
            {formatXAxisLabel(label)}
          </p>
          <p className="text-[#FFFFFF] font-semibold">
            {formatCurrency(payload[0].value)}
          </p>
          {payload[1] && (
            <p className="text-sm text-[#E4E4E7]">
              Volume: {formatCurrency(payload[1].value)}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="bg-[#1C1C1F] rounded-lg p-4 sm:p-6 border border-[#252528]">
        <div className="animate-pulse">
          <div className="h-4 bg-[#252528] rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-[#252528] rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1C1C1F] rounded-lg p-4 sm:p-6 border border-[#252528]">
      {/* Chart Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-[#FFFFFF]">Price Chart</h3>
            {chartStats && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                <span className="text-xl sm:text-2xl font-bold text-[#FFFFFF]">
                  {formatCurrency(chartStats.current)}
                </span>
                <div className={`flex items-center space-x-1 ${
                  chartStats.changePercent >= 0 ? 'text-[#00DC82]' : 'text-[#FF3B3B]'
                }`}>
                  {chartStats.changePercent >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span className="font-medium">
                    {formatPercentage(chartStats.changePercent)}
                  </span>
                </div>
              </div>
            )}
          </div>
          
          {/* Timeframe Selector - Mobile Optimized */}
          <div className="w-full sm:w-auto">
            <div className="grid grid-cols-3 sm:flex sm:space-x-1 bg-[#252528] rounded-lg p-1 gap-1 sm:gap-0">
              {timeframes.map((tf) => (
                <button
                  key={tf.value}
                  onClick={() => setSelectedTimeframe(tf.value as '1h' | '24h' | '7d' | '30d' | '90d' | '1y')}
                  className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded transition-colors ${
                    selectedTimeframe === tf.value
                      ? 'bg-[#3B82F6] text-[#FFFFFF]'
                      : 'text-[#E4E4E7] hover:text-[#FFFFFF] hover:bg-[#252528]/50'
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'area' ? (
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop 
                    offset="5%" 
                    stopColor={(chartStats?.changePercent ?? 0) >= 0 ? '#00DC82' : '#FF3B3B'} 
                    stopOpacity={0.3}
                  />
                  <stop 
                    offset="95%" 
                    stopColor={(chartStats?.changePercent ?? 0) >= 0 ? '#00DC82' : '#FF3B3B'} 
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#252528" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={formatXAxisLabel}
                stroke="#E4E4E7"
                fontSize={12}
              />
              <YAxis
                domain={['dataMin', 'dataMax']}
                tickFormatter={(value) => formatCurrency(value)}
                stroke="#E4E4E7"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="price"
                stroke={(chartStats?.changePercent ?? 0) >= 0 ? '#00DC82' : '#FF3B3B'}
                strokeWidth={2}
                fill="url(#priceGradient)"
              />
            </AreaChart>
          ) : (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#252528" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={formatXAxisLabel}
                stroke="#E4E4E7"
                fontSize={12}
              />
              <YAxis
                domain={['dataMin', 'dataMax']}
                tickFormatter={(value) => formatCurrency(value)}
                stroke="#E4E4E7"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="price"
                stroke={(chartStats?.changePercent ?? 0) >= 0 ? '#00DC82' : '#FF3B3B'}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: (chartStats?.changePercent ?? 0) >= 0 ? '#00DC82' : '#FF3B3B' }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Chart Stats */}
      {chartStats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6">
          <div className="text-center bg-[#252528] rounded-lg p-3">
            <p className="text-xs sm:text-sm text-[#E4E4E7]">24h High</p>
            <p className="text-base sm:text-lg font-semibold text-[#FFFFFF]">
              {formatCurrency(chartStats.high)}
            </p>
          </div>
          <div className="text-center bg-[#252528] rounded-lg p-3">
            <p className="text-xs sm:text-sm text-[#E4E4E7]">24h Low</p>
            <p className="text-base sm:text-lg font-semibold text-[#FFFFFF]">
              {formatCurrency(chartStats.low)}
            </p>
          </div>
          <div className="text-center bg-[#252528] rounded-lg p-3">
            <p className="text-xs sm:text-sm text-[#E4E4E7]">Change</p>
            <p className={`text-base sm:text-lg font-semibold ${
              chartStats.changePercent >= 0 ? 'text-[#00DC82]' : 'text-[#FF3B3B]'
            }`}>
              {formatCurrency(chartStats.change)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
