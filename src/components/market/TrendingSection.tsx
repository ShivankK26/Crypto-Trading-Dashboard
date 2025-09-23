'use client';

import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { useCryptoStore } from '@/store/cryptoStore';
import { formatCurrency, formatPercentage } from '@/lib/utils';

export default function TrendingSection() {
  const { trendingData } = useCryptoStore();

  if (!trendingData || trendingData.coins.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      {/* Trending Coins */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900 rounded-lg border border-gray-800 p-6"
      >
        <div className="flex items-center space-x-2 mb-4">
          <Flame className="w-5 h-5 text-orange-400" />
          <h3 className="text-lg font-semibold text-white">Trending</h3>
          <span className="text-sm text-gray-400">(Most searched)</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trendingData.coins.slice(0, 6).map((coin, index) => (
            <motion.div
              key={coin.item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
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
                  <p className="font-medium text-white text-sm">{coin.item.name}</p>
                  <p className="text-xs text-gray-400 uppercase">{coin.item.symbol}</p>
                </div>
              </div>
              
              <div className="text-right">
                {coin.item.data ? (
                  <>
                    <p className="font-semibold text-white text-sm">
                      {formatCurrency(coin.item.data.price)}
                    </p>
                    <p className={`text-xs font-medium ${
                      (coin.item.data.price_change_percentage_24h?.usd || 0) >= 0
                        ? 'text-green-400'
                        : 'text-red-400'
                    }`}>
                      {(coin.item.data.price_change_percentage_24h?.usd || 0) >= 0 ? '▲' : '▼'}
                      {formatPercentage(coin.item.data.price_change_percentage_24h?.usd || 0)}
                    </p>
                  </>
                ) : (
                  <p className="text-xs text-gray-400">#{coin.item.market_cap_rank}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        
        
      </motion.div>
    </div>
  );
}
