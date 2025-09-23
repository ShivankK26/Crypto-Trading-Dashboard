'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Flame, Rocket } from 'lucide-react';
import { useCryptoStore } from '@/store/cryptoStore';
import { formatCurrency, formatPercentage } from '@/lib/utils';

export default function TrendingSection() {
  const { trendingData, topGainers } = useCryptoStore();

  if (!trendingData && topGainers.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Trending Coins */}
      {trendingData && trendingData.coins.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 rounded-lg border border-gray-800 p-6"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Flame className="w-5 h-5 text-orange-400" />
            <h3 className="text-lg font-semibold text-white">Trending</h3>
          </div>
          
          <div className="space-y-3">
            {trendingData.coins.slice(0, 3).map((coin, index) => (
              <motion.div
                key={coin.item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={coin.item.thumb}
                    alt={coin.item.name}
                    className="w-8 h-8 rounded-full"
                    width={32}
                    height={32}
                  />
                  <div>
                    <p className="font-medium text-white">{coin.item.name}</p>
                    <p className="text-sm text-gray-400 uppercase">{coin.item.symbol}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  {coin.item.data ? (
                    <>
                      <p className="font-semibold text-white">
                        {formatCurrency(coin.item.data.price)}
                      </p>
                      <p className={`text-sm font-medium ${
                        (coin.item.data.price_change_percentage_24h?.usd || 0) >= 0
                          ? 'text-green-400'
                          : 'text-red-400'
                      }`}>
                        {(coin.item.data.price_change_percentage_24h?.usd || 0) >= 0 ? '▲' : '▼'}
                        {formatPercentage(coin.item.data.price_change_percentage_24h?.usd || 0)}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-gray-400">#{coin.item.market_cap_rank}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Top Gainers */}
      {topGainers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900 rounded-lg border border-gray-800 p-6"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Rocket className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Top Gainers</h3>
          </div>
          
          <div className="space-y-3">
            {topGainers.slice(0, 3).map((coin, index) => (
              <motion.div
                key={coin.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={coin.image}
                    alt={coin.name}
                    className="w-8 h-8 rounded-full"
                    width={32}
                    height={32}
                  />
                  <div>
                    <p className="font-medium text-white">{coin.name}</p>
                    <p className="text-sm text-gray-400 uppercase">{coin.symbol}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold text-white">
                    {formatCurrency(coin.current_price)}
                  </p>
                  <p className="text-sm font-medium text-green-400">
                    ▲{formatPercentage(coin.price_change_percentage_24h)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
