'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import Navigation from './Navigation';
import MobileNavigation from './MobileNavigation';
import SearchBar from './SearchBar';
import Toast from '@/components/ui/Toast';
import FilterModal from '@/components/ui/FilterModal';
import { useCryptoStore } from '@/store/cryptoStore';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { 
    fetchCryptocurrencies, 
    fetchMarketData, 
    fetchTrendingTokens,
    fetchTrendingData,
    fetchTopGainers,
    fetchTopLosers,
    fetchRecentlyAdded,
    startRealTimeUpdates,
    isLoading,
    modalState,
    setModalState
  } = useCryptoStore();

  useEffect(() => {
    console.log('MainLayout: useEffect triggered, starting data fetch...');
    // Initial data fetch
    const loadInitialData = async () => {
      console.log('MainLayout: loadInitialData function called');
      try {
        await Promise.all([
          fetchCryptocurrencies(),
          fetchMarketData(),
          fetchTrendingTokens(),
          fetchTrendingData(),
          fetchTopGainers(),
          fetchTopLosers(),
          fetchRecentlyAdded(),
        ]);
        console.log('MainLayout: All data fetch operations completed');
      } catch (error) {
        console.error('MainLayout: Error in loadInitialData:', error);
      }
    };

    loadInitialData();
    startRealTimeUpdates();

    // Cleanup on unmount
    return () => {
      // Real-time updates cleanup is handled in the store
    };
  }, [
    fetchCryptocurrencies,
    fetchMarketData,
    fetchTrendingTokens,
    fetchTrendingData,
    fetchTopGainers,
    fetchTopLosers,
    fetchRecentlyAdded,
    startRealTimeUpdates,
  ]);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#FFFFFF]">
      <Header />
      
      {/* Desktop Navigation */}
      <div className="hidden lg:block">
        <Navigation />
      </div>
      
      {/* Search Bar */}
      <div className="bg-[#141416] border-b border-[#252528]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <SearchBar />
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20 lg:pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Mobile Navigation */}
      <MobileNavigation />

      {/* Toast Notifications */}
      <Toast />

      {/* Loading Overlay */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-[#0A0A0B]/50 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <div className="bg-[#1C1C1F] rounded-lg p-6 flex items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3B82F6]"></div>
            <span className="text-[#FFFFFF]">Loading market data...</span>
          </div>
        </motion.div>
      )}

      {/* Filter Modal */}
      <FilterModal
        isOpen={modalState.isOpen && modalState.type === 'filters'}
        onClose={() => setModalState({ isOpen: false, type: null, data: null })}
      />
    </div>
  );
}
