'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Settings, Bell, TrendingUp, TrendingDown } from 'lucide-react';
import { useCryptoStore } from '@/store/cryptoStore';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import NotificationCenter from '@/components/ui/NotificationCenter';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { marketData, setModalState } = useCryptoStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#0A0A0B]/80 backdrop-blur-md border-b border-[#252528]' 
          : 'bg-[#0A0A0B]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#FFFFFF]" />
              </div>
              <h1 className="text-xl font-bold text-[#FFFFFF]">CryptoDash</h1>
            </motion.div>
          </div>

          {/* Market Stats */}
          {marketData && (
            <div className="hidden lg:flex items-center space-x-6">
              <div className="text-center">
                <p className="text-xs text-[#E4E4E7]">Market Cap</p>
                <p className="text-sm font-semibold text-[#FFFFFF]">
                  {formatCurrency(marketData.total_market_cap)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-[#E4E4E7]">24h Volume</p>
                <p className="text-sm font-semibold text-[#FFFFFF]">
                  {formatCurrency(marketData.total_volume)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-[#E4E4E7]">24h Change</p>
                <p className={`text-sm font-semibold flex items-center justify-center ${
                  marketData.market_cap_change_percentage_24h_usd >= 0 
                    ? 'text-[#00DC82]' 
                    : 'text-[#FF3B3B]'
                }`}>
                  {marketData.market_cap_change_percentage_24h_usd >= 0 ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {formatPercentage(marketData.market_cap_change_percentage_24h_usd)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-[#E4E4E7]">BTC Dominance</p>
                <p className="text-sm font-semibold text-[#FFFFFF]">
                  {marketData.market_cap_percentage.btc.toFixed(1)}%
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setModalState({ isOpen: true, type: 'settings', data: null })}
              className="p-2 text-[#E4E4E7] hover:text-[#FFFFFF] transition-colors"
            >
              <Settings className="w-5 h-5" />
            </motion.button>
            
            <NotificationCenter />
          </div>
        </div>
      </div>
    </motion.header>
  );
}
