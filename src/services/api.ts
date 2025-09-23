import { 
  Cryptocurrency, 
  MarketData, 
  TrendingToken, 
  TrendingCoin,
  TrendingData,
  Trade, 
  SocialSentiment, 
  PriceData,
  ChartData 
} from '@/types/crypto';

// Type definitions for CoinGecko API responses
interface CoinGeckoCoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string;
  sparkline_in_7d?: {
    price: number[];
  };
  price_change_percentage_1h_in_currency?: number;
  price_change_percentage_24h_in_currency?: number;
  price_change_percentage_7d_in_currency?: number;
  price_change_percentage_30d_in_currency?: number;
  price_change_percentage_1y_in_currency?: number;
  price_change_percentage_1h?: number;
  price_change_percentage_30d?: number;
  price_change_percentage_1y?: number;
}

interface CoinGeckoTrendingCoin {
  item: {
    id: string;
    symbol: string;
    name: string;
    thumb: string;
    market_cap_rank: number;
    score?: number;
  };
}

interface CoinGeckoSearchCoin {
  id: string;
  symbol: string;
  name: string;
  thumb: string;
}

interface CoinGeckoMarketChartResponse {
  prices: [number, number][];
  total_volumes: [number, number][];
}

interface CoinGeckoGlobalResponse {
  data: {
    total_market_cap: { usd: number };
    total_volume: { usd: number };
    market_cap_percentage: {
      btc: number;
      eth: number;
    };
    market_cap_change_percentage_24h_usd: number;
    active_cryptocurrencies: number;
    markets: number;
  };
}

interface CoinGeckoTrendingResponse {
  coins: CoinGeckoTrendingCoin[];
}

interface CoinGeckoSearchResponse {
  coins: CoinGeckoSearchCoin[];
}

// Union type for all possible callback data types
type CallbackData = Cryptocurrency[] | MarketData | Trade[] | SocialSentiment[];

// Helper function to make API requests through our Next.js API routes
async function fetchFromAPI(endpoint: string, params: Record<string, string | number | boolean | undefined> = {}) {
  console.log('fetchFromAPI: Starting request to:', endpoint, 'with params:', params);
  const url = new URL(endpoint, window.location.origin);
  
  // Add query parameters
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value.toString());
    }
  });
  
  console.log('fetchFromAPI: Full URL:', url.toString());
  
  const response = await fetch(url.toString());
  
  console.log('fetchFromAPI: Response status:', response.status, response.statusText);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('fetchFromAPI: Error response:', errorText);
    throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
  }
  
  const data = await response.json();
  console.log('fetchFromAPI: Response data type:', typeof data, 'isArray:', Array.isArray(data), 'length:', Array.isArray(data) ? data.length : 'N/A');
  return data;
}

// Helper function to transform CoinGecko coin data to our format
function transformCoinGeckoData(coin: CoinGeckoCoin): Cryptocurrency {
  console.log('API: Transforming coin data for:', coin.name, 'sparkline data:', coin.sparkline_in_7d?.price?.length || 0, 'points');
  return {
    id: coin.id,
    symbol: coin.symbol,
    name: coin.name,
    image: coin.image,
    current_price: coin.current_price,
    market_cap: coin.market_cap,
    market_cap_rank: coin.market_cap_rank,
    fully_diluted_valuation: coin.fully_diluted_valuation,
    total_volume: coin.total_volume,
    high_24h: coin.high_24h,
    low_24h: coin.low_24h,
    price_change_24h: coin.price_change_24h,
    price_change_percentage_24h: coin.price_change_percentage_24h,
    price_change_percentage_7d: coin.price_change_percentage_7d,
    market_cap_change_24h: coin.market_cap_change_24h,
    market_cap_change_percentage_24h: coin.market_cap_change_percentage_24h,
    circulating_supply: coin.circulating_supply,
    total_supply: coin.total_supply,
    max_supply: coin.max_supply,
    ath: coin.ath,
    ath_change_percentage: coin.ath_change_percentage,
    ath_date: coin.ath_date,
    atl: coin.atl,
    atl_change_percentage: coin.atl_change_percentage,
    atl_date: coin.atl_date,
    last_updated: coin.last_updated,
    sparkline_in_7d: {
      price: coin.sparkline_in_7d?.price || []
    },
    // Map the price change percentages from the API response
    price_change_percentage_1h_in_currency: coin.price_change_percentage_1h_in_currency || coin.price_change_percentage_1h,
    price_change_percentage_24h_in_currency: coin.price_change_percentage_24h_in_currency || coin.price_change_percentage_24h,
    price_change_percentage_7d_in_currency: coin.price_change_percentage_7d_in_currency || coin.price_change_percentage_7d,
    price_change_percentage_30d_in_currency: coin.price_change_percentage_30d_in_currency || coin.price_change_percentage_30d,
    price_change_percentage_1y_in_currency: coin.price_change_percentage_1y_in_currency || coin.price_change_percentage_1y,
  };
}

class CryptoAPI {
  private subscribers: Map<string, Set<(data: CallbackData) => void>> = new Map();
  private intervals: Map<string, NodeJS.Timeout> = new Map();

  // Get all cryptocurrencies
  async getCryptocurrencies(): Promise<Cryptocurrency[]> {
    console.log('API: Fetching cryptocurrencies from API...');
    try {
      const data = await fetchFromAPI('/api/coins/markets', {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 250, // Get more coins like CoinGecko
        page: 1,
        sparkline: true,
        price_change_percentage: '1h,24h,7d,30d,1y'
      });
      
      console.log('API: Raw response received:', data.length, 'coins');
      
      // Transform CoinGecko data to our format and return directly (no caching)
      const transformedData = data.map(transformCoinGeckoData);
      console.log('API: Transformed data:', transformedData.length, 'coins');
      return transformedData;
    } catch (error) {
      console.error('API: Error in getCryptocurrencies:', error);
      throw error;
    }
  }

  // Get market data
  async getMarketData(): Promise<MarketData> {
    const data = await fetchFromAPI('/api/global');
    
    // Return market data directly (no caching)
    return {
      total_market_cap: data.data.total_market_cap.usd,
      total_volume: data.data.total_volume.usd,
      market_cap_percentage: {
        btc: data.data.market_cap_percentage.btc,
        eth: data.data.market_cap_percentage.eth,
      },
      market_cap_change_percentage_24h_usd: data.data.market_cap_change_percentage_24h_usd,
      active_cryptocurrencies: data.data.active_cryptocurrencies,
      markets: data.data.markets,
      total_market_cap_usd: data.data.total_market_cap.usd,
      total_volume_usd: data.data.total_volume.usd,
    };
  }

  // Get trending tokens (legacy method for backward compatibility)
  async getTrendingTokens(): Promise<TrendingToken[]> {
    const data = await fetchFromAPI('/api/search/trending');
    
    const trendingTokens: TrendingToken[] = data.coins.map((coin: CoinGeckoTrendingCoin) => ({
      id: coin.item.id,
      symbol: coin.item.symbol,
      name: coin.item.name,
      image: coin.item.thumb,
      current_price: 0, // Not provided in trending endpoint
      price_change_percentage_24h: 0, // Not provided in trending endpoint
      market_cap_rank: coin.item.market_cap_rank,
      score: coin.item.score || 0,
    }));
    
    return trendingTokens;
  }

  // Get trending data (coins, NFTs, categories)
  async getTrendingData(): Promise<TrendingData> {
    const data = await fetchFromAPI('/api/trending');
    return data;
  }

  // Get top gainers
  async getTopGainers(): Promise<Cryptocurrency[]> {
    const data = await fetchFromAPI('/api/coins/markets', {
      vs_currency: 'usd',
      order: 'price_change_percentage_24h_desc',
      per_page: 5,
      page: 1,
      sparkline: true,
      price_change_percentage: '24h'
    });
    
    // Transform data using the same logic as getCryptocurrencies
    return data.map(transformCoinGeckoData);
  }

  // Get top losers
  async getTopLosers(): Promise<Cryptocurrency[]> {
    const data = await fetchFromAPI('/api/coins/markets', {
      vs_currency: 'usd',
      order: 'price_change_percentage_24h_asc',
      per_page: 5,
      page: 1,
      sparkline: true,
      price_change_percentage: '24h'
    });
    
    // Transform data using the same logic as getCryptocurrencies
    return data.map(transformCoinGeckoData);
  }

  // Get recently added tokens
  async getRecentlyAdded(): Promise<Cryptocurrency[]> {
    // Fetch lower-ranked coins as "recently added"
    const data = await fetchFromAPI('/api/coins/markets', {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: 10,
      page: 6, // Get coins ranked 51-60
      sparkline: true,
      price_change_percentage: '1h,24h,7d,30d,1y'
    });
    
    return data.map(transformCoinGeckoData);
  }

  // Get token by ID
  async getTokenById(id: string): Promise<Cryptocurrency | null> {
    // Fetch specific token data
    const data = await fetchFromAPI('/api/coins/markets', {
      vs_currency: 'usd',
      ids: id,
      sparkline: true,
      price_change_percentage: '1h,24h,7d,30d,1y'
    });
    
    if (data.length > 0) {
      return transformCoinGeckoData(data[0]);
    }
    return null;
  }

  // Get historical price data
  async getHistoricalData(
    tokenId: string, 
    timeframe: '1h' | '24h' | '7d' | '30d' | '90d' | '1y'
  ): Promise<PriceData[]> {
    // Map our timeframes to CoinGecko days parameter
    const daysMap: Record<string, number> = {
      '1h': 1,
      '24h': 1,
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '1y': 365
    };

    const days = daysMap[timeframe] || 7;
    
    const data = await fetchFromAPI(`/api/coins/${tokenId}/market-chart`, {
      vs_currency: 'usd',
      days: days,
      interval: timeframe === '1h' ? undefined : 'daily'
    });

    // Transform CoinGecko data to our format
    const priceData: PriceData[] = data.prices.map((pricePoint: [number, number]) => ({
      timestamp: pricePoint[0],
      price: pricePoint[1],
      volume: 0 // Volume data is separate in CoinGecko response
    }));

    // Add volume data if available
    if (data.total_volumes && data.total_volumes.length === priceData.length) {
      data.total_volumes.forEach((volumePoint: [number, number], index: number) => {
        if (priceData[index]) {
          priceData[index].volume = volumePoint[1];
        }
      });
    }

    return priceData;
  }

  // Get recent trades
  async getRecentTrades(): Promise<Trade[]> {
    // Return empty array since we don't have real trade data
    return [];
  }

  // Get social sentiment
  async getSocialSentiment(): Promise<SocialSentiment[]> {
    // Return empty array since we don't have real sentiment data
    return [];
  }

  // Search cryptocurrencies
  async searchCryptocurrencies(query: string): Promise<Cryptocurrency[]> {
    const data = await fetchFromAPI('/api/search', {
      query: query
    });
    
    // Get the coin IDs from search results
    const coinIds = data.coins.slice(0, 10).map((coin: CoinGeckoSearchCoin) => coin.id).join(',');
    
    if (!coinIds) {
      return [];
    }
    
    // Fetch detailed data for the searched coins
    const detailedData = await fetchFromAPI('/api/coins/markets', {
      vs_currency: 'usd',
      ids: coinIds,
      order: 'market_cap_desc',
      per_page: 10,
      page: 1,
      sparkline: true,
      price_change_percentage: '1h,24h,7d,30d,1y'
    });
    
    // Transform data using the same logic as getCryptocurrencies
    return detailedData.map(transformCoinGeckoData);
  }

  // Subscribe to real-time updates
  subscribeToUpdates(
    channel: 'prices' | 'trades' | 'market' | 'sentiment',
    callback: (data: CallbackData) => void
  ): () => void {
    if (!this.subscribers.has(channel)) {
      this.subscribers.set(channel, new Set());
    }
    
    this.subscribers.get(channel)!.add(callback);
    
    // Start real-time updates if not already running
    if (!this.intervals.has(channel)) {
      this.startRealTimeUpdates(channel);
    }
    
    // Return unsubscribe function
    return () => {
      const channelSubscribers = this.subscribers.get(channel);
      if (channelSubscribers) {
        channelSubscribers.delete(callback);
        if (channelSubscribers.size === 0) {
          this.stopRealTimeUpdates(channel);
        }
      }
    };
  }

  private startRealTimeUpdates(channel: string) {
    const interval = setInterval(() => {
      this.updateChannelData(channel);
    }, 30000); // 30 seconds for real-time updates (respecting API rate limits)
    
    this.intervals.set(channel, interval);
  }

  private stopRealTimeUpdates(channel: string) {
    const interval = this.intervals.get(channel);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(channel);
    }
  }

  private async updateChannelData(channel: string) {
    const subscribers = this.subscribers.get(channel);
    if (!subscribers || subscribers.size === 0) return;

    switch (channel) {
      case 'prices':
        const freshPrices = await this.getCryptocurrencies();
        subscribers.forEach(callback => callback(freshPrices));
        break;
      case 'trades':
        // Skip trades for now since we don't have real trade data
        break;
      case 'market':
        const freshMarketData = await this.getMarketData();
        subscribers.forEach(callback => callback(freshMarketData));
        break;
      case 'sentiment':
        // Skip sentiment for now since we don't have real sentiment data
        break;
    }
  }



  // Cleanup method
  destroy() {
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals.clear();
    this.subscribers.clear();
  }
}

// Create singleton instance
export const cryptoAPI = new CryptoAPI();

// Export types for convenience
export type { Cryptocurrency, MarketData, TrendingToken, Trade, SocialSentiment, PriceData };
