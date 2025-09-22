'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Activity } from 'lucide-react';
import { useCryptoStore } from '@/store/cryptoStore';
import { formatCurrency, formatPercentage, getPriceChangeColor } from '@/lib/utils';
import { CardSkeleton } from '@/components/ui/Skeleton';

export default function MarketOverview() {
  const { marketData, topGainers, topLosers } = useCryptoStore();

  if (!marketData) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Market Cap',
      value: formatCurrency(marketData.total_market_cap),
      change: marketData.market_cap_change_percentage_24h_usd,
      icon: DollarSign,
      color: 'text-blue-400',
    },
    {
      title: '24h Trading Volume',
      value: formatCurrency(marketData.total_volume),
      change: 0, // Volume change not provided in API
      icon: BarChart3,
      color: 'text-green-400',
    },
    {
      title: 'Coins',
      value: marketData.active_cryptocurrencies.toLocaleString(),
      change: 0,
      icon: Activity,
      color: 'text-purple-400',
    },
    {
      title: 'Exchanges',
      value: marketData.markets.toLocaleString(),
      change: 0,
      icon: TrendingUp,
      color: 'text-orange-400',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Market Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-gray-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg bg-gray-800 ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                {stat.change !== 0 && (
                  <div className={`flex items-center space-x-1 text-sm ${
                    stat.change >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {stat.change >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span>{formatPercentage(stat.change)}</span>
                  </div>
                )}
              </div>
              <h3 className="text-sm text-gray-400 mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Market Dominance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-900 rounded-lg p-6 border border-gray-800"
      >
        <h2 className="text-lg font-semibold text-white mb-4">Market Dominance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">₿</span>
              </div>
              <div>
                <p className="text-white font-medium">Bitcoin</p>
                <p className="text-sm text-gray-400">BTC</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white font-semibold">{formatPercentage(marketData.market_cap_percentage.btc)}</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">Ξ</span>
              </div>
              <div>
                <p className="text-white font-medium">Ethereum</p>
                <p className="text-sm text-gray-400">ETH</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white font-semibold">{formatPercentage(marketData.market_cap_percentage.eth)}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Top Movers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Gainers */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900 rounded-lg p-6 border border-gray-800"
        >
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <h2 className="text-lg font-semibold text-white">Top Gainers</h2>
          </div>
          <div className="space-y-3">
            {topGainers.slice(0, 5).map((token, index) => (
              <motion.div
                key={token.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={token.image}
                    alt={token.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-white">{token.symbol.toUpperCase()}</p>
                    <p className="text-sm text-gray-400">{token.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-white">
                    {formatCurrency(token.current_price)}
                  </p>
                  <p className={`text-sm ${getPriceChangeColor(token.price_change_percentage_24h)}`}>
                    +{formatPercentage(token.price_change_percentage_24h)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Top Losers */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900 rounded-lg p-6 border border-gray-800"
        >
          <div className="flex items-center space-x-2 mb-4">
            <TrendingDown className="w-5 h-5 text-red-400" />
            <h2 className="text-lg font-semibold text-white">Top Losers</h2>
          </div>
          <div className="space-y-3">
            {topLosers.slice(0, 5).map((token, index) => (
              <motion.div
                key={token.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={token.image}
                    alt={token.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-white">{token.symbol.toUpperCase()}</p>
                    <p className="text-sm text-gray-400">{token.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-white">
                    {formatCurrency(token.current_price)}
                  </p>
                  <p className={`text-sm ${getPriceChangeColor(token.price_change_percentage_24h)}`}>
                    {formatPercentage(token.price_change_percentage_24h)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
