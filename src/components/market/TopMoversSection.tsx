'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useCryptoStore } from '@/store/cryptoStore';
import { formatCurrency, formatPercentage } from '@/lib/utils';

export default function TopMoversSection() {
  const { topGainers, topLosers, activeTab } = useCryptoStore();

  // Show top gainers for 'gainers' tab
  if (activeTab === 'gainers' && topGainers.length > 0) {
    return (
      <div className="mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 rounded-lg border border-gray-800 p-6"
        >
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Top Gainers</h3>
            <span className="text-sm text-gray-400">(24h)</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topGainers.slice(0, 12).map((coin, index) => (
              <motion.div
                key={coin.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                onClick={() => {
                  // You can add navigation to coin detail here
                  console.log('Navigate to coin:', coin.id);
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400 font-medium">#{index + 1}</span>
                    <img
                      src={coin.image}
                      alt={coin.name}
                      className="w-8 h-8 rounded-full"
                      width={32}
                      height={32}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-white text-sm">{coin.name}</p>
                    <p className="text-xs text-gray-400 uppercase">{coin.symbol}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold text-white text-sm">
                    {formatCurrency(coin.current_price)}
                  </p>
                  <div className="flex items-center space-x-1">
                    <ArrowUp className="w-3 h-3 text-green-400" />
                    <p className="text-xs font-medium text-green-400">
                      {formatPercentage(coin.price_change_percentage_24h)}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400">
                    Vol: {formatCurrency(coin.total_volume)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  // Show top losers for 'losers' tab
  if (activeTab === 'losers' && topLosers.length > 0) {
    return (
      <div className="mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 rounded-lg border border-gray-800 p-6"
        >
          <div className="flex items-center space-x-2 mb-4">
            <TrendingDown className="w-5 h-5 text-red-400" />
            <h3 className="text-lg font-semibold text-white">Top Losers</h3>
            <span className="text-sm text-gray-400">(24h)</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topLosers.slice(0, 12).map((coin, index) => (
              <motion.div
                key={coin.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
                onClick={() => {
                  // You can add navigation to coin detail here
                  console.log('Navigate to coin:', coin.id);
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400 font-medium">#{index + 1}</span>
                    <img
                      src={coin.image}
                      alt={coin.name}
                      className="w-8 h-8 rounded-full"
                      width={32}
                      height={32}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-white text-sm">{coin.name}</p>
                    <p className="text-xs text-gray-400 uppercase">{coin.symbol}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold text-white text-sm">
                    {formatCurrency(coin.current_price)}
                  </p>
                  <div className="flex items-center space-x-1">
                    <ArrowDown className="w-3 h-3 text-red-400" />
                    <p className="text-xs font-medium text-red-400">
                      {formatPercentage(coin.price_change_percentage_24h)}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400">
                    Vol: {formatCurrency(coin.total_volume)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return null;
}
