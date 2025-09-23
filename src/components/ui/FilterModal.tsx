'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react';
import { useCryptoStore } from '@/store/cryptoStore';
import { FilterConfig } from '@/types/ui';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FilterModal({ isOpen, onClose }: FilterModalProps) {
  const { filterConfig, setFilterConfig } = useCryptoStore();
  
  // Ensure filterConfig has all required properties with defaults
  const safeFilterConfig: FilterConfig = {
    marketCapRange: filterConfig?.marketCapRange || { min: null, max: null },
    priceChangeThreshold: filterConfig?.priceChangeThreshold || { min: null, max: null },
    volumeThreshold: filterConfig?.volumeThreshold || { min: null },
    marketCapFilters: filterConfig?.marketCapFilters || {
      largeCap: false,
      midCap: false,
      smallCap: false,
    },
    priceChangeFilters: filterConfig?.priceChangeFilters || {
      gainers10: false,
      gainers25: false,
      gainers50: false,
      losers10: false,
      losers25: false,
      losers50: false,
    },
    volumeFilters: filterConfig?.volumeFilters || {
      highVolume: false,
      mediumVolume: false,
      lowVolume: false,
    },
  };
  
  const [localFilters, setLocalFilters] = useState<FilterConfig>(safeFilterConfig);

  // Update localFilters when filterConfig changes
  React.useEffect(() => {
    setLocalFilters(safeFilterConfig);
  }, [filterConfig]);

  const handleSave = () => {
    setFilterConfig(localFilters);
    onClose();
  };

  const handleReset = () => {
    const defaultFilters: FilterConfig = {
      marketCapRange: { min: null, max: null },
      priceChangeThreshold: { min: null, max: null },
      volumeThreshold: { min: null },
      marketCapFilters: {
        largeCap: false,
        midCap: false,
        smallCap: false,
      },
      priceChangeFilters: {
        gainers10: false,
        gainers25: false,
        gainers50: false,
        losers10: false,
        losers25: false,
        losers50: false,
      },
      volumeFilters: {
        highVolume: false,
        mediumVolume: false,
        lowVolume: false,
      },
    };
    setLocalFilters(defaultFilters);
  };

  const updateMarketCapFilter = (key: keyof FilterConfig['marketCapFilters'], value: boolean) => {
    setLocalFilters(prev => ({
      ...prev,
      marketCapFilters: {
        ...prev.marketCapFilters,
        [key]: value,
      },
    }));
  };

  const updatePriceChangeFilter = (key: keyof FilterConfig['priceChangeFilters'], value: boolean) => {
    setLocalFilters(prev => ({
      ...prev,
      priceChangeFilters: {
        ...prev.priceChangeFilters,
        [key]: value,
      },
    }));
  };

  const updateVolumeFilter = (key: keyof FilterConfig['volumeFilters'], value: boolean) => {
    setLocalFilters(prev => ({
      ...prev,
      volumeFilters: {
        ...prev.volumeFilters,
        [key]: value,
      },
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gray-900 rounded-lg border border-gray-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h2 className="text-xl font-semibold text-white">Filter Cryptocurrencies</h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-8">
              {/* Market Cap Filters */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <DollarSign className="w-5 h-5 text-blue-400" />
                  <h3 className="text-lg font-medium text-white">Market Cap</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localFilters.marketCapFilters.largeCap}
                      onChange={(e) => updateMarketCapFilter('largeCap', e.target.checked)}
                      className="w-4 h-4 text-blue-400 bg-gray-700 border-gray-600 rounded focus:ring-blue-400"
                    />
                    <div>
                      <p className="text-white font-medium">Large Cap</p>
                      <p className="text-sm text-gray-400">&gt;$10B</p>
                    </div>
                  </label>
                  <label className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localFilters.marketCapFilters.midCap}
                      onChange={(e) => updateMarketCapFilter('midCap', e.target.checked)}
                      className="w-4 h-4 text-blue-400 bg-gray-700 border-gray-600 rounded focus:ring-blue-400"
                    />
                    <div>
                      <p className="text-white font-medium">Mid Cap</p>
                      <p className="text-sm text-gray-400">$1B - $10B</p>
                    </div>
                  </label>
                  <label className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localFilters.marketCapFilters.smallCap}
                      onChange={(e) => updateMarketCapFilter('smallCap', e.target.checked)}
                      className="w-4 h-4 text-blue-400 bg-gray-700 border-gray-600 rounded focus:ring-blue-400"
                    />
                    <div>
                      <p className="text-white font-medium">Small Cap</p>
                      <p className="text-sm text-gray-400">&lt;$1B</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Price Change Filters */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <h3 className="text-lg font-medium text-white">Price Change (24h)</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Gainers */}
                  <div>
                    <h4 className="text-sm font-medium text-green-400 mb-3">Gainers</h4>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-3 p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={localFilters.priceChangeFilters.gainers10}
                          onChange={(e) => updatePriceChangeFilter('gainers10', e.target.checked)}
                          className="w-4 h-4 text-green-400 bg-gray-700 border-gray-600 rounded focus:ring-green-400"
                        />
                        <span className="text-white">&gt;10%</span>
                      </label>
                      <label className="flex items-center space-x-3 p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={localFilters.priceChangeFilters.gainers25}
                          onChange={(e) => updatePriceChangeFilter('gainers25', e.target.checked)}
                          className="w-4 h-4 text-green-400 bg-gray-700 border-gray-600 rounded focus:ring-green-400"
                        />
                        <span className="text-white">&gt;25%</span>
                      </label>
                      <label className="flex items-center space-x-3 p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={localFilters.priceChangeFilters.gainers50}
                          onChange={(e) => updatePriceChangeFilter('gainers50', e.target.checked)}
                          className="w-4 h-4 text-green-400 bg-gray-700 border-gray-600 rounded focus:ring-green-400"
                        />
                        <span className="text-white">&gt;50%</span>
                      </label>
                    </div>
                  </div>
                  
                  {/* Losers */}
                  <div>
                    <h4 className="text-sm font-medium text-red-400 mb-3">Losers</h4>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-3 p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={localFilters.priceChangeFilters.losers10}
                          onChange={(e) => updatePriceChangeFilter('losers10', e.target.checked)}
                          className="w-4 h-4 text-red-400 bg-gray-700 border-gray-600 rounded focus:ring-red-400"
                        />
                        <span className="text-white">&lt;-10%</span>
                      </label>
                      <label className="flex items-center space-x-3 p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={localFilters.priceChangeFilters.losers25}
                          onChange={(e) => updatePriceChangeFilter('losers25', e.target.checked)}
                          className="w-4 h-4 text-red-400 bg-gray-700 border-gray-600 rounded focus:ring-red-400"
                        />
                        <span className="text-white">&lt;-25%</span>
                      </label>
                      <label className="flex items-center space-x-3 p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          checked={localFilters.priceChangeFilters.losers50}
                          onChange={(e) => updatePriceChangeFilter('losers50', e.target.checked)}
                          className="w-4 h-4 text-red-400 bg-gray-700 border-gray-600 rounded focus:ring-red-400"
                        />
                        <span className="text-white">&lt;-50%</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Volume Filters */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                  <h3 className="text-lg font-medium text-white">Trading Volume (24h)</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localFilters.volumeFilters.highVolume}
                      onChange={(e) => updateVolumeFilter('highVolume', e.target.checked)}
                      className="w-4 h-4 text-purple-400 bg-gray-700 border-gray-600 rounded focus:ring-purple-400"
                    />
                    <div>
                      <p className="text-white font-medium">High Volume</p>
                      <p className="text-sm text-gray-400">&gt;$100M</p>
                    </div>
                  </label>
                  <label className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localFilters.volumeFilters.mediumVolume}
                      onChange={(e) => updateVolumeFilter('mediumVolume', e.target.checked)}
                      className="w-4 h-4 text-purple-400 bg-gray-700 border-gray-600 rounded focus:ring-purple-400"
                    />
                    <div>
                      <p className="text-white font-medium">Medium Volume</p>
                      <p className="text-sm text-gray-400">$10M - $100M</p>
                    </div>
                  </label>
                  <label className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localFilters.volumeFilters.lowVolume}
                      onChange={(e) => updateVolumeFilter('lowVolume', e.target.checked)}
                      className="w-4 h-4 text-purple-400 bg-gray-700 border-gray-600 rounded focus:ring-purple-400"
                    />
                    <div>
                      <p className="text-white font-medium">Low Volume</p>
                      <p className="text-sm text-gray-400">&lt;$10M</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-800">
              <button
                onClick={handleReset}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Reset All
              </button>
              <div className="flex items-center space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
