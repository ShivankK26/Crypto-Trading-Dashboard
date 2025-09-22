import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Cryptocurrency, MarketData, TrendingToken, Trade, SocialSentiment, WatchlistItem } from '@/types/crypto';
import { TabType, SortConfig, FilterConfig, ColumnConfig, ModalState, ToastState } from '@/types/ui';
import { cryptoAPI } from '@/services/api';

interface CryptoState {
  // Data
  cryptocurrencies: Cryptocurrency[];
  marketData: MarketData | null;
  trendingTokens: TrendingToken[];
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
  
  // Data fetching
  fetchCryptocurrencies: () => Promise<void>;
  fetchMarketData: () => Promise<void>;
  fetchTrendingTokens: () => Promise<void>;
  fetchTopGainers: () => Promise<void>;
  fetchTopLosers: () => Promise<void>;
  fetchRecentlyAdded: () => Promise<void>;
  fetchTrades: () => Promise<void>;
  fetchSocialSentiment: () => Promise<void>;
  searchCryptocurrencies: (query: string) => Promise<Cryptocurrency[]>;
  
  // Real-time updates
  startRealTimeUpdates: () => void;
  stopRealTimeUpdates: () => void;
  
  // Computed values
  getFilteredCryptocurrencies: () => Cryptocurrency[];
  getSortedCryptocurrencies: () => Cryptocurrency[];
  getCurrentTabData: () => Cryptocurrency[];
}

export const useCryptoStore = create<CryptoState>()(
  persist(
    (set, get) => ({
      // Initial state
      cryptocurrencies: [],
      marketData: null,
      trendingTokens: [],
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
      
      // Data fetching
      fetchCryptocurrencies: async () => {
        console.log('Store: Starting to fetch cryptocurrencies...');
        set({ isLoading: true, error: null });
        try {
          const data = await cryptoAPI.getCryptocurrencies();
          console.log('Store: Successfully fetched cryptocurrencies:', data.length, 'coins');
          set({ 
            cryptocurrencies: data, 
            isLoading: false, 
            lastUpdated: Date.now() 
          });
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
          set({ cryptocurrencies: data, lastUpdated: Date.now() });
        });
        
        // Subscribe to trade updates
        cryptoAPI.subscribeToUpdates('trades', (data) => {
          set({ trades: data });
        });
        
        // Subscribe to market data updates
        cryptoAPI.subscribeToUpdates('market', (data) => {
          set({ marketData: data });
        });
        
        // Subscribe to sentiment updates
        cryptoAPI.subscribeToUpdates('sentiment', (data) => {
          set({ socialSentiment: data });
        });
      },
      
      stopRealTimeUpdates: () => {
        cryptoAPI.destroy();
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
        
        console.log('Store: getFilteredCryptocurrencies - final count:', filtered.length);
        return filtered;
      },
      
      getSortedCryptocurrencies: () => {
        const filtered = get().getFilteredCryptocurrencies();
        const { sortConfig } = get();
        console.log('Store: getSortedCryptocurrencies - filtered count:', filtered.length, 'sortConfig:', sortConfig);
        
        const sorted = [...filtered].sort((a, b) => {
          let aValue: any = a[sortConfig.field];
          let bValue: any = b[sortConfig.field];
          
          // Handle string sorting
          if (typeof aValue === 'string') {
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
            // Convert watchlist items to cryptocurrency format
            const watchlistData = watchlist.map(item => ({
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
        watchlist: state.watchlist,
        columnConfig: state.columnConfig,
        filterConfig: state.filterConfig,
      }),
    }
  )
);
