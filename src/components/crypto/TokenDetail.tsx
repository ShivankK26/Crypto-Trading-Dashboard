'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Star, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  DollarSign,
  Activity,
  Globe,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useCryptoStore } from '@/store/cryptoStore';
import { 
  formatCurrency, 
  formatPercentage, 
  formatMarketCap, 
  formatVolume
} from '@/lib/utils';
import PriceChart from '@/components/charts/PriceChart';
import { SocialSentiment } from '@/types/crypto';

interface TokenDetailProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TokenDetail({ isOpen, onClose }: TokenDetailProps) {
  const { selectedToken, addToWatchlist, removeFromWatchlist, isInWatchlist, trades, socialSentiment } = useCryptoStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'chart' | 'trades'>('overview');
  const [tokenSentiment, setTokenSentiment] = useState<SocialSentiment | null>(null);

  useEffect(() => {
    if (selectedToken && socialSentiment.length > 0) {
      const sentiment = socialSentiment.find(s => s.token_id === selectedToken.id);
      setTokenSentiment(sentiment || null);
    }
  }, [selectedToken, socialSentiment]);

  if (!selectedToken) return null;

  const handleWatchlistToggle = () => {
    if (isInWatchlist(selectedToken.id)) {
      removeFromWatchlist(selectedToken.id);
    } else {
      addToWatchlist(selectedToken);
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return 'text-green-400 bg-green-400/10';
      case 'bearish': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return <TrendingUp className="w-4 h-4" />;
      case 'bearish': return <TrendingDown className="w-4 h-4" />;
      default: return <BarChart3 className="w-4 h-4" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Detail Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-2xl bg-gray-900 border-l border-gray-800 z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={selectedToken.image}
                    alt={selectedToken.name}
                    className="w-12 h-12 rounded-full"
                    width={48}
                    height={48}
                  />
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedToken.name}</h2>
                    <p className="text-gray-400 uppercase">{selectedToken.symbol}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleWatchlistToggle}
                    className={`p-2 rounded-lg transition-colors ${
                      isInWatchlist(selectedToken.id)
                        ? 'text-yellow-400 bg-yellow-400/10'
                        : 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10'
                    }`}
                  >
                    <Star className={`w-5 h-5 ${isInWatchlist(selectedToken.id) ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Price Info */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-white">
                    {formatCurrency(selectedToken.current_price)}
                  </p>
                  <div className={`flex items-center space-x-2 mt-1 ${
                    selectedToken.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {selectedToken.price_change_percentage_24h >= 0 ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    <span className="font-medium">
                      {formatPercentage(selectedToken.price_change_percentage_24h)}
                    </span>
                    <span className="text-gray-400">
                      ({formatCurrency(selectedToken.price_change_24h)})
                    </span>
                  </div>
                </div>
                
                {/* Social Sentiment */}
                {tokenSentiment && (
                  <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${getSentimentColor(tokenSentiment.sentiment)}`}>
                    {getSentimentIcon(tokenSentiment.sentiment)}
                    <span className="text-sm font-medium capitalize">
                      {tokenSentiment.sentiment}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-800">
              <div className="flex space-x-8 px-6">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'chart', label: 'Chart' },
                  { id: 'trades', label: 'Trades' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'overview' | 'chart' | 'trades')}
                    className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-400'
                        : 'border-transparent text-gray-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {activeTab === 'overview' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <DollarSign className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-gray-400">Market Cap</span>
                      </div>
                      <p className="text-lg font-semibold text-white">
                        {formatMarketCap(selectedToken.market_cap)}
                      </p>
                    </div>
                    
                    <div className="bg-gray-800 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <BarChart3 className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-gray-400">Volume</span>
                      </div>
                      <p className="text-lg font-semibold text-white">
                        {formatVolume(selectedToken.total_volume)}
                      </p>
                    </div>
                    
                    <div className="bg-gray-800 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Activity className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-gray-400">Circulating Supply</span>
                      </div>
                      <p className="text-lg font-semibold text-white">
                        {selectedToken.circulating_supply.toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="bg-gray-800 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Globe className="w-4 h-4 text-orange-400" />
                        <span className="text-sm text-gray-400">Max Supply</span>
                      </div>
                      <p className="text-lg font-semibold text-white">
                        {selectedToken.max_supply ? selectedToken.max_supply.toLocaleString() : '∞'}
                      </p>
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-4">24h Price Range</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">High</span>
                        <span className="text-white font-medium">
                          {formatCurrency(selectedToken.high_24h)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Low</span>
                        <span className="text-white font-medium">
                          {formatCurrency(selectedToken.low_24h)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{
                            width: `${((selectedToken.current_price - selectedToken.low_24h) / (selectedToken.high_24h - selectedToken.low_24h)) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* All Time High/Low */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-gray-400">All Time High</span>
                      </div>
                      <p className="text-lg font-semibold text-white">
                        {formatCurrency(selectedToken.ath)}
                      </p>
                      <p className="text-sm text-gray-400">
                        {new Date(selectedToken.ath_date).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="bg-gray-800 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <TrendingDown className="w-4 h-4 text-red-400" />
                        <span className="text-sm text-gray-400">All Time Low</span>
                      </div>
                      <p className="text-lg font-semibold text-white">
                        {formatCurrency(selectedToken.atl)}
                      </p>
                      <p className="text-sm text-gray-400">
                        {new Date(selectedToken.atl_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'chart' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <PriceChart tokenId={selectedToken.id} timeframe="7d" />
                </motion.div>
              )}

              {activeTab === 'trades' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-white">Recent Trades</h3>
                  <div className="space-y-2">
                    {trades.slice(0, 10).map((trade) => (
                      <div
                        key={trade.id}
                        className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${
                            trade.type === 'buy' ? 'bg-green-400' : 'bg-red-400'
                          }`} />
                          <span className="text-white font-medium">
                            {trade.token_symbol}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-medium">
                            {formatCurrency(trade.price)}
                          </p>
                          <p className="text-sm text-gray-400">
                            {trade.amount.toFixed(4)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
