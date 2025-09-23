import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Cryptocurrency, MarketData, TrendingToken, TrendingData, Trade, SocialSentiment, WatchlistItem, PriceAlert } from '@/types/crypto';
import { TabType, SortConfig, FilterConfig, ColumnConfig, ModalState, ToastState } from '@/types/ui';
import { cryptoAPI } from '@/services/api';

interface CryptoState {
  // Data
  cryptocurrencies: Cryptocurrency[];
  marketData: MarketData | null;
  trendingTokens: TrendingToken[];
  trendingData: TrendingData | null;
  topGainers: Cryptocurrency[];
  topLosers: Cryptocurrency[];
  recentlyAdded: Cryptocurrency[];
  trades: Trade[];
  socialSentiment: SocialSentiment[];
  
  // UI State
  activeTab: TabType;
  selectedToken: Cryptocurrency | null;
  searchQuery: string;
  sortConfig: SortConfig;
  filterConfig: FilterConfig;
  columnConfig: ColumnConfig;
  modalState: ModalState;
  toasts: ToastState[];
  
  // Watchlist
  watchlist: WatchlistItem[];
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
  
  // Actions
  setActiveTab: (tab: TabType) => void;
  setSelectedToken: (token: Cryptocurrency | null) => void;
  setSearchQuery: (query: string) => void;
  setSortConfig: (config: SortConfig) => void;
  setFilterConfig: (config: FilterConfig) => void;
  setColumnConfig: (config: ColumnConfig) => void;
  setModalState: (state: ModalState) => void;
  addToast: (toast: Omit<ToastState, 'id'>) => void;
  removeToast: (id: string) => void;
  
  // Watchlist actions
  addToWatchlist: (token: Cryptocurrency) => void;
  removeFromWatchlist: (tokenId: string) => void;
  isInWatchlist: (tokenId: string) => boolean;
  reorderWatchlist: (startIndex: number, endIndex: number) => void;
  addPriceAlert: (tokenId: string, targetPrice: number, condition: 'above' | 'below') => void;
  removePriceAlert: (alertId: string) => void;
  updatePriceAlert: (alertId: string, updates: Partial<PriceAlert>) => void;
  exportWatchlistToCSV: () => void;
  
  // Data fetching
  fetchCryptocurrencies: () => Promise<void>;
  fetchMarketData: () => Promise<void>;
  fetchTrendingTokens: () => Promise<void>;
  fetchTrendingData: () => Promise<void>;
  fetchTopGainers: () => Promise<void>;
  fetchTopLosers: () => Promise<void>;
  fetchRecentlyAdded: () => Promise<void>;
  fetchTrades: () => Promise<void>;
  fetchSocialSentiment: () => Promise<void>;
  searchCryptocurrencies: (query: string) => Promise<Cryptocurrency[]>;
  
  // Real-time updates
  startRealTimeUpdates: () => void;
  stopRealTimeUpdates: () => void;
  checkPriceAlerts: () => void;
  
  // Computed values
  getFilteredCryptocurrencies: () => Cryptocurrency[];
  getSortedCryptocurrencies: () => Cryptocurrency[];
  getCurrentTabData: () => Cryptocurrency[];
  
  // API instance
  cryptoAPI: typeof cryptoAPI;
}

// Migration function to handle existing persisted state
const migrateFilterConfig = (config: any) => {
  return {
    marketCapRange: config.marketCapRange || { min: null, max: null },
    priceChangeThreshold: config.priceChangeThreshold || { min: null, max: null },
    volumeThreshold: config.volumeThreshold || { min: null },
    marketCapFilters: config.marketCapFilters || {
      largeCap: false,
      midCap: false,
      smallCap: false,
    },
    priceChangeFilters: config.priceChangeFilters || {
      gainers10: false,
      gainers25: false,
      gainers50: false,
      losers10: false,
      losers25: false,
      losers50: false,
    },
    volumeFilters: config.volumeFilters || {
      highVolume: false,
      mediumVolume: false,
      lowVolume: false,
    },
  };
};

// Migration function to handle existing watchlist items
const migrateWatchlist = (watchlist: any[]) => {
  if (!Array.isArray(watchlist)) {
    return [];
  }
  
  return watchlist.map((item, index) => ({
    ...item,
    order: item.order !== undefined ? item.order : index,
    price_alerts: item.price_alerts || [],
  }));
};

export const useCryptoStore = create<CryptoState>()(
  persist(
    (set, get) => ({
      // Initial state
      cryptocurrencies: [],
      marketData: null,
      trendingTokens: [],
      trendingData: null,
      topGainers: [],
      topLosers: [],
      recentlyAdded: [],
      trades: [],
      socialSentiment: [],
      
      activeTab: 'all',
      selectedToken: null,
      searchQuery: '',
      sortConfig: { field: 'market_cap_rank', direction: 'asc' },
      filterConfig: {
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
      },
      columnConfig: {
        rank: true,
        name: true,
        price: true,
        change24h: true,
        change7d: true,
        marketCap: true,
        volume: true,
        sparkline: true,
      },
      modalState: { isOpen: false, type: null, data: null },
      toasts: [],
      
      watchlist: [],
      
      isLoading: false,
      error: null,
      lastUpdated: null,
      
      // Actions
      setActiveTab: (tab) => set({ activeTab: tab }),
      
      setSelectedToken: (token) => set({ selectedToken: token }),
      
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      setSortConfig: (config) => set({ sortConfig: config }),
      
      setFilterConfig: (config) => set({ filterConfig: config }),
      
      setColumnConfig: (config) => set({ columnConfig: config }),
      
      setModalState: (state) => set({ modalState: state }),
      
      addToast: (toast) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newToast = { ...toast, id };
        set((state) => ({ toasts: [...state.toasts, newToast] }));
        
        // Auto remove toast after duration
        setTimeout(() => {
          get().removeToast(id);
        }, toast.duration || 5000);
      },
      
      removeToast: (id) => 
        set((state) => ({ 
          toasts: state.toasts.filter(toast => toast.id !== id) 
        })),
      
      // Watchlist actions
      addToWatchlist: (token) => {
        const { watchlist } = get();
        const exists = watchlist.some(item => item.id === token.id);
        
        if (!exists) {
          const watchlistItem: WatchlistItem = {
            id: token.id,
            symbol: token.symbol,
            name: token.name,
            image: token.image,
            current_price: token.current_price,
            price_change_percentage_24h: token.price_change_percentage_24h,
            added_at: new Date().toISOString(),
            order: watchlist.length,
            price_alerts: [],
          };
          
          set((state) => ({ 
            watchlist: [...state.watchlist, watchlistItem] 
          }));
          
          get().addToast({
            type: 'success',
            title: 'Added to Watchlist',
            description: `${token.name} has been added to your watchlist.`,
          });
        }
      },
      
      removeFromWatchlist: (tokenId) => {
        set((state) => ({ 
          watchlist: state.watchlist.filter(item => item.id !== tokenId) 
        }));
        
        get().addToast({
          type: 'info',
          title: 'Removed from Watchlist',
          description: 'Token has been removed from your watchlist.',
        });
      },
      
      isInWatchlist: (tokenId) => {
        const { watchlist } = get();
        return watchlist.some(item => item.id === tokenId);
      },
      
      reorderWatchlist: (startIndex, endIndex) => {
        set((state) => {
          const newWatchlist = Array.from(state.watchlist);
          const [removed] = newWatchlist.splice(startIndex, 1);
          newWatchlist.splice(endIndex, 0, removed);
          
          // Update order values
          const updatedWatchlist = newWatchlist.map((item, index) => ({
            ...item,
            order: index,
          }));
          
          return { watchlist: updatedWatchlist };
        });
      },
      
      addPriceAlert: (tokenId, targetPrice, condition) => {
        const { watchlist } = get();
        const watchlistItem = watchlist.find(item => item.id === tokenId);
        
        if (watchlistItem) {
          const newAlert: PriceAlert = {
            id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            token_id: tokenId,
            token_symbol: watchlistItem.symbol,
            target_price: targetPrice,
            condition,
            is_active: true,
            created_at: new Date().toISOString(),
            is_triggered: false,
          };
          
          set((state) => ({
            watchlist: state.watchlist.map(item =>
              item.id === tokenId
                ? { ...item, price_alerts: [...item.price_alerts, newAlert] }
                : item
            ),
          }));
          
          get().addToast({
            type: 'success',
            title: 'Price Alert Added',
            description: `Alert set for ${watchlistItem.symbol} ${condition} $${targetPrice}`,
          });
        }
      },
      
      removePriceAlert: (alertId) => {
        set((state) => ({
          watchlist: state.watchlist.map(item => ({
            ...item,
            price_alerts: item.price_alerts.filter(alert => alert.id !== alertId),
          })),
        }));
        
        get().addToast({
          type: 'info',
          title: 'Price Alert Removed',
          description: 'Price alert has been removed.',
        });
      },
      
      updatePriceAlert: (alertId, updates) => {
        set((state) => ({
          watchlist: state.watchlist.map(item => ({
            ...item,
            price_alerts: item.price_alerts.map(alert =>
              alert.id === alertId ? { ...alert, ...updates } : alert
            ),
          })),
        }));
      },
      
      exportWatchlistToCSV: () => {
        const { watchlist } = get();
        
        if (watchlist.length === 0) {
          get().addToast({
            type: 'warning',
            title: 'Export Failed',
            description: 'No items in watchlist to export.',
          });
          return;
        }
        
        // Create CSV content
        const headers = ['Symbol', 'Name', 'Current Price', '24h Change %', 'Added Date', 'Price Alerts'];
        const csvContent = [
          headers.join(','),
          ...watchlist.map(item => [
            item.symbol,
            `"${item.name}"`,
            item.current_price,
            item.price_change_percentage_24h,
            new Date(item.added_at).toLocaleDateString(),
            item.price_alerts.length > 0 ? `"${item.price_alerts.map(alert => `${alert.condition} $${alert.target_price}`).join('; ')}"` : 'None'
          ].join(','))
        ].join('\n');
        
        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `watchlist_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        get().addToast({
          type: 'success',
          title: 'Export Successful',
          description: `Watchlist exported as CSV with ${watchlist.length} items.`,
        });
      },
      
      // Data fetching
      fetchCryptocurrencies: async () => {
        console.log('Store: Starting to fetch cryptocurrencies...');
        set({ isLoading: true, error: null });
        try {
          const data = await cryptoAPI.getCryptocurrencies();
          console.log('Store: Successfully fetched cryptocurrencies:', data.length, 'coins');
          console.log('Store: First 3 cryptocurrencies:', data.slice(0, 3)); // Log first 3 items
          set({ 
            cryptocurrencies: data, 
            isLoading: false, 
            lastUpdated: Date.now() 
          });
          console.log('Store: After setting cryptocurrencies, current state:', get().cryptocurrencies.length, 'coins');
        } catch (error) {
          console.error('Store: Error fetching cryptocurrencies:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch cryptocurrencies from CoinGecko API',
            isLoading: false 
          });
        }
      },
      
      fetchMarketData: async () => {
        try {
          const data = await cryptoAPI.getMarketData();
          set({ marketData: data });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch market data from CoinGecko API' 
          });
        }
      },
      
      fetchTrendingTokens: async () => {
        try {
          const data = await cryptoAPI.getTrendingTokens();
          set({ trendingTokens: data });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch trending tokens from CoinGecko API' 
          });
        }
      },

      fetchTrendingData: async () => {
        try {
          const data = await cryptoAPI.getTrendingData();
          set({ trendingData: data });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch trending data from CoinGecko API' 
          });
        }
      },
      
      fetchTopGainers: async () => {
        try {
          const data = await cryptoAPI.getTopGainers();
          set({ topGainers: data });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch top gainers from CoinGecko API' 
          });
        }
      },
      
      fetchTopLosers: async () => {
        try {
          const data = await cryptoAPI.getTopLosers();
          set({ topLosers: data });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch top losers from CoinGecko API' 
          });
        }
      },
      
      fetchRecentlyAdded: async () => {
        try {
          const data = await cryptoAPI.getRecentlyAdded();
          set({ recentlyAdded: data });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch recently added tokens from CoinGecko API' 
          });
        }
      },
      
      fetchTrades: async () => {
        try {
          const data = await cryptoAPI.getRecentTrades();
          set({ trades: data });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch trades' 
          });
        }
      },
      
      fetchSocialSentiment: async () => {
        try {
          const data = await cryptoAPI.getSocialSentiment();
          set({ socialSentiment: data });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch social sentiment' 
          });
        }
      },
      
      searchCryptocurrencies: async (query) => {
        try {
          return await cryptoAPI.searchCryptocurrencies(query);
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to search cryptocurrencies from CoinGecko API' 
          });
          return [];
        }
      },
      
      // Real-time updates
      startRealTimeUpdates: () => {
        // Subscribe to price updates
        cryptoAPI.subscribeToUpdates('prices', (data) => {
          if (Array.isArray(data) && data.length > 0 && 'symbol' in data[0]) {
            set({ cryptocurrencies: data as Cryptocurrency[], lastUpdated: Date.now() });
            
            // Check price alerts after price updates (only if watchlist has items)
            const { watchlist } = get();
            if (watchlist && watchlist.length > 0) {
              setTimeout(() => {
                get().checkPriceAlerts();
              }, 100);
            }
          }
        });
        
        // Subscribe to trade updates
        cryptoAPI.subscribeToUpdates('trades', (data) => {
          if (Array.isArray(data) && data.length > 0 && 'token_symbol' in data[0]) {
            set({ trades: data as Trade[] });
          }
        });
        
        // Subscribe to market data updates
        cryptoAPI.subscribeToUpdates('market', (data) => {
          if (data && typeof data === 'object' && 'total_market_cap' in data) {
            set({ marketData: data as MarketData });
          }
        });
        
        // Subscribe to sentiment updates
        cryptoAPI.subscribeToUpdates('sentiment', (data) => {
          if (Array.isArray(data) && data.length > 0 && 'token_id' in data[0]) {
            set({ socialSentiment: data as SocialSentiment[] });
          }
        });
      },
      
      stopRealTimeUpdates: () => {
        cryptoAPI.destroy();
      },
      
      checkPriceAlerts: () => {
        const { watchlist } = get();
        
        // Check if watchlist exists and is an array
        if (!watchlist || !Array.isArray(watchlist)) {
          console.warn('checkPriceAlerts: watchlist is not available or not an array');
          return;
        }
        
        watchlist.forEach(watchlistItem => {
          // Check if price_alerts exists and is an array
          if (!watchlistItem.price_alerts || !Array.isArray(watchlistItem.price_alerts)) {
            console.warn('checkPriceAlerts: price_alerts is not available for item:', watchlistItem.id);
            return;
          }
          
          watchlistItem.price_alerts.forEach(alert => {
            if (alert.is_active && !alert.is_triggered) {
              const shouldTrigger = 
                (alert.condition === 'above' && watchlistItem.current_price >= alert.target_price) ||
                (alert.condition === 'below' && watchlistItem.current_price <= alert.target_price);
              
              if (shouldTrigger) {
                // Mark alert as triggered
                get().updatePriceAlert(alert.id, {
                  is_triggered: true,
                  triggered_at: new Date().toISOString(),
                });
                
                // Show notification
                get().addToast({
                  type: 'success',
                  title: 'Price Alert Triggered!',
                  description: `${alert.token_symbol} ${alert.condition} $${alert.target_price} (Current: $${watchlistItem.current_price})`,
                  duration: 10000,
                });
              }
            }
          });
        });
      },
      
      // Computed values
      getFilteredCryptocurrencies: () => {
        const { cryptocurrencies, searchQuery, filterConfig } = get();
        console.log('Store: getFilteredCryptocurrencies - input count:', cryptocurrencies.length, 'searchQuery:', searchQuery, 'filterConfig:', filterConfig);
        let filtered = [...cryptocurrencies];
        
        // Apply search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(
            token => 
              token.name.toLowerCase().includes(query) ||
              token.symbol.toLowerCase().includes(query)
          );
          console.log('Store: After search filter:', filtered.length);
        }
        
        // Apply market cap filter
        if (filterConfig.marketCapRange.min !== null) {
          filtered = filtered.filter(
            token => token.market_cap >= filterConfig.marketCapRange.min!
          );
          console.log('Store: After market cap min filter:', filtered.length);
        }
        if (filterConfig.marketCapRange.max !== null) {
          filtered = filtered.filter(
            token => token.market_cap <= filterConfig.marketCapRange.max!
          );
          console.log('Store: After market cap max filter:', filtered.length);
        }
        
        // Apply price change filter
        if (filterConfig.priceChangeThreshold.min !== null) {
          filtered = filtered.filter(
            token => token.price_change_percentage_24h >= filterConfig.priceChangeThreshold.min!
          );
          console.log('Store: After price change min filter:', filtered.length);
        }
        if (filterConfig.priceChangeThreshold.max !== null) {
          filtered = filtered.filter(
            token => token.price_change_percentage_24h <= filterConfig.priceChangeThreshold.max!
          );
          console.log('Store: After price change max filter:', filtered.length);
        }
        
        // Apply volume filter
        if (filterConfig.volumeThreshold.min !== null) {
          filtered = filtered.filter(
            token => token.total_volume >= filterConfig.volumeThreshold.min!
          );
          console.log('Store: After volume filter:', filtered.length);
        }
        
        // Apply predefined market cap filters
        const marketCapFilters = filterConfig.marketCapFilters || { largeCap: false, midCap: false, smallCap: false };
        if (marketCapFilters.largeCap || marketCapFilters.midCap || marketCapFilters.smallCap) {
          filtered = filtered.filter(token => {
            const marketCap = token.market_cap;
            if (marketCapFilters.largeCap && marketCap > 10000000000) return true; // >$10B
            if (marketCapFilters.midCap && marketCap >= 1000000000 && marketCap <= 10000000000) return true; // $1B-$10B
            if (marketCapFilters.smallCap && marketCap < 1000000000) return true; // <$1B
            return false;
          });
          console.log('Store: After predefined market cap filters:', filtered.length);
        }
        
        // Apply predefined price change filters
        const priceChangeFilters = filterConfig.priceChangeFilters || { 
          gainers10: false, gainers25: false, gainers50: false, 
          losers10: false, losers25: false, losers50: false 
        };
        if (priceChangeFilters.gainers10 || priceChangeFilters.gainers25 || priceChangeFilters.gainers50 ||
            priceChangeFilters.losers10 || priceChangeFilters.losers25 || priceChangeFilters.losers50) {
          filtered = filtered.filter(token => {
            const change = token.price_change_percentage_24h;
            if (priceChangeFilters.gainers10 && change > 10) return true;
            if (priceChangeFilters.gainers25 && change > 25) return true;
            if (priceChangeFilters.gainers50 && change > 50) return true;
            if (priceChangeFilters.losers10 && change < -10) return true;
            if (priceChangeFilters.losers25 && change < -25) return true;
            if (priceChangeFilters.losers50 && change < -50) return true;
            return false;
          });
          console.log('Store: After predefined price change filters:', filtered.length);
        }
        
        // Apply predefined volume filters
        const volumeFilters = filterConfig.volumeFilters || { highVolume: false, mediumVolume: false, lowVolume: false };
        if (volumeFilters.highVolume || volumeFilters.mediumVolume || volumeFilters.lowVolume) {
          filtered = filtered.filter(token => {
            const volume = token.total_volume;
            if (volumeFilters.highVolume && volume > 100000000) return true; // >$100M
            if (volumeFilters.mediumVolume && volume >= 10000000 && volume <= 100000000) return true; // $10M-$100M
            if (volumeFilters.lowVolume && volume < 10000000) return true; // <$10M
            return false;
          });
          console.log('Store: After predefined volume filters:', filtered.length);
        }
        
        console.log('Store: getFilteredCryptocurrencies - final count:', filtered.length);
        return filtered;
      },
      
      getSortedCryptocurrencies: () => {
        const filtered = get().getFilteredCryptocurrencies();
        const { sortConfig } = get();
        console.log('Store: getSortedCryptocurrencies - filtered count:', filtered.length, 'sortConfig:', sortConfig);
        
        const sorted = [...filtered].sort((a, b) => {
          let aValue: string | number = a[sortConfig.field] ?? 0;
          let bValue: string | number = b[sortConfig.field] ?? 0;
          
          // Handle string sorting
          if (typeof aValue === 'string' && typeof bValue === 'string') {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
          }
          
          if (sortConfig.direction === 'asc') {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        });
        
        console.log('Store: getSortedCryptocurrencies - sorted count:', sorted.length);
        return sorted;
      },
      
      getCurrentTabData: () => {
        const state = get();
        const { activeTab, topGainers, topLosers, recentlyAdded, watchlist, cryptocurrencies } = state;
        console.log('Store: getCurrentTabData called with activeTab:', activeTab, 'cryptocurrencies count:', cryptocurrencies.length);
        
        switch (activeTab) {
          case 'gainers':
            console.log('Store: Returning topGainers:', topGainers.length);
            return topGainers;
          case 'losers':
            console.log('Store: Returning topLosers:', topLosers.length);
            return topLosers;
          case 'recently-added':
            console.log('Store: Returning recentlyAdded:', recentlyAdded.length);
            return recentlyAdded;
          case 'watchlist':
            // Convert watchlist items to cryptocurrency format, sorted by order
            const watchlistData = watchlist
              .sort((a, b) => a.order - b.order)
              .map(item => ({
                id: item.id,
                symbol: item.symbol,
                name: item.name,
                image: item.image,
                current_price: item.current_price,
                price_change_percentage_24h: item.price_change_percentage_24h,
                market_cap_rank: 0,
                market_cap: 0,
                total_volume: 0,
                price_change_24h: 0,
                price_change_percentage_7d: 0,
                high_24h: 0,
                low_24h: 0,
              market_cap_change_24h: 0,
              market_cap_change_percentage_24h: 0,
              fully_diluted_valuation: 0,
              circulating_supply: 0,
              total_supply: 0,
              max_supply: 0,
              ath: 0,
              ath_change_percentage: 0,
              ath_date: '',
              atl: 0,
              atl_change_percentage: 0,
              atl_date: '',
              last_updated: '',
              sparkline_in_7d: { price: [] },
            } as Cryptocurrency));
            console.log('Store: Returning watchlist data:', watchlistData.length);
            return watchlistData;
          case 'trending':
            // For trending, we'll use the main list but could filter by volume/change
            const trendingData = cryptocurrencies.filter(token => 
              Math.abs(token.price_change_percentage_24h) > 5
            );
            console.log('Store: Returning trending data:', trendingData.length);
            return trendingData;
          default:
            const sortedData = state.getSortedCryptocurrencies();
            console.log('Store: getSortedCryptocurrencies returned:', sortedData.length, 'coins');
            return sortedData;
        }
      },
      
      // Expose cryptoAPI for components to use
      cryptoAPI,
    }),
    {
      name: 'crypto-dashboard-storage',
      partialize: (state) => ({
        watchlist: migrateWatchlist(state.watchlist),
        columnConfig: state.columnConfig,
        filterConfig: migrateFilterConfig(state.filterConfig),
      }),
    }
  )
);
