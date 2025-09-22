'use client';

import { motion } from 'framer-motion';
import { 
  Coins, 
  TrendingUp, 
  TrendingDown, 
  Star, 
  Plus,
  List,
  BarChart3
} from 'lucide-react';
import { useCryptoStore } from '@/store/cryptoStore';
import { TabType } from '@/types/ui';

const tabs: Array<{
  id: TabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
}> = [
  { id: 'all', label: 'All Cryptocurrencies', icon: Coins },
  { id: 'trending', label: 'Trending', icon: TrendingUp },
  { id: 'gainers', label: 'Top Gainers', icon: TrendingUp },
  { id: 'losers', label: 'Top Losers', icon: TrendingDown },
  { id: 'watchlist', label: 'Watchlist', icon: Star },
  { id: 'recently-added', label: 'Recently Added', icon: Plus },
];

export default function Navigation() {
  const { activeTab, setActiveTab, watchlist } = useCryptoStore();

  return (
    <div className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const count = tab.id === 'watchlist' ? watchlist.length : undefined;

            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center space-x-2 px-4 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {count !== undefined && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    {count}
                  </span>
                )}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
