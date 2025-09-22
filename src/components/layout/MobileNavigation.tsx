'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Coins, 
  TrendingUp, 
  TrendingDown, 
  Star, 
  Plus,
  Menu,
  X
} from 'lucide-react';
import { useCryptoStore } from '@/store/cryptoStore';
import { TabType } from '@/types/ui';

const tabs: Array<{
  id: TabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
}> = [
  { id: 'all', label: 'All', icon: Coins },
  { id: 'trending', label: 'Trending', icon: TrendingUp },
  { id: 'gainers', label: 'Gainers', icon: TrendingUp },
  { id: 'losers', label: 'Losers', icon: TrendingDown },
  { id: 'watchlist', label: 'Watchlist', icon: Star },
  { id: 'recently-added', label: 'New', icon: Plus },
];

export default function MobileNavigation() {
  const { activeTab, setActiveTab, watchlist } = useCryptoStore();
  const [isOpen, setIsOpen] = useState(false);

  const currentTab = tabs.find(tab => tab.id === activeTab);

  return (
    <>
      {/* Mobile Tab Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-30">
        <div className="flex items-center justify-around py-2">
          {tabs.slice(0, 4).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const count = tab.id === 'watchlist' ? watchlist.length : undefined;

            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
                  isActive ? 'text-blue-400' : 'text-gray-400'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {count !== undefined && count > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                      {count}
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium">{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="mobileActiveTab"
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
          
          {/* More Button */}
          <motion.button
            onClick={() => setIsOpen(true)}
            className="flex flex-col items-center space-y-1 p-2 text-gray-400"
            whileTap={{ scale: 0.95 }}
          >
            <Menu className="w-5 h-5" />
            <span className="text-xs font-medium">More</span>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-50 lg:hidden"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Navigation</h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    const count = tab.id === 'watchlist' ? watchlist.length : undefined;

                    return (
                      <motion.button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setIsOpen(false);
                        }}
                        className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                          isActive 
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                        }`}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Icon className="w-5 h-5" />
                        <div className="flex-1 text-left">
                          <p className="font-medium">{tab.label}</p>
                          {count !== undefined && (
                            <p className="text-sm text-gray-500">
                              {count} items
                            </p>
                          )}
                        </div>
                        {isActive && (
                          <motion.div
                            layoutId="mobileMenuActiveTab"
                            className="w-2 h-2 bg-blue-400 rounded-full"
                            initial={false}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
