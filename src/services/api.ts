import { 
  Cryptocurrency, 
  MarketData, 
  TrendingToken, 
  Trade, 
  SocialSentiment, 
  PriceData,
  ChartData 
} from '@/types/crypto';

// Helper function to make API requests through our Next.js API routes
async function fetchFromAPI(endpoint: string, params: Record<string, any> = {}) {
  const url = new URL(endpoint, window.location.origin);
  
  // Add query parameters
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value.toString());
    }
  });

  console.log('Making API request to:', url.toString());

  const response = await fetch(url.toString());
  
  console.log('API response status:', response.status, response.statusText);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('API error response:', errorText);
    throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
  }
  
  const data = await response.json();
  console.log('API response data length:', Array.isArray(data) ? data.length : 'not an array');
  return data;
}

// Helper function to transform CoinGecko coin data to our format
function transformCoinGeckoData(coin: any): Cryptocurrency {
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
  private subscribers: Map<string, Set<(data: any) => void>> = new Map();
  private intervals: Map<string, NodeJS.Timeout> = new Map();
  private currentData: Cryptocurrency[] = [];
  private marketData: MarketData | null = null;
  private trades: Trade[] = [];
  private socialSentiment: SocialSentiment[] = [];

  // Get all cryptocurrencies
  async getCryptocurrencies(): Promise<Cryptocurrency[]> {
    console.log('Fetching cryptocurrencies from API...');
    const data = await fetchFromAPI('/api/coins/markets', {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: 250, // Get more coins like CoinGecko
      page: 1,
      sparkline: true,
      price_change_percentage: '1h,24h,7d,30d,1y'
    });
    
    console.log('API response:', data.length, 'coins received');
    
    // Transform CoinGecko data to our format
    const transformedData = data.map(transformCoinGeckoData);
    
    this.currentData = transformedData;
    return transformedData;
  }

  // Get market data
  async getMarketData(): Promise<MarketData> {
    const data = await fetchFromAPI('/api/global');
    
    const marketData: MarketData = {
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
    
    this.marketData = marketData;
    return marketData;
  }

  // Get trending tokens
  async getTrendingTokens(): Promise<TrendingToken[]> {
    const data = await fetchFromAPI('/api/search/trending');
    
    const trendingTokens: TrendingToken[] = data.coins.map((coin: any) => ({
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
    // Use the current data and show some lower-ranked coins as "recently added"
    return this.currentData.slice(50, 60);
  }

  // Get token by ID
  async getTokenById(id: string): Promise<Cryptocurrency | null> {
    return this.currentData.find(token => token.id === id) || null;
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
    return [...this.trades];
  }

  // Get social sentiment
  async getSocialSentiment(): Promise<SocialSentiment[]> {
    return [...this.socialSentiment];
  }

  // Search cryptocurrencies
  async searchCryptocurrencies(query: string): Promise<Cryptocurrency[]> {
    const data = await fetchFromAPI('/api/search', {
      query: query
    });
    
    // Get the coin IDs from search results
    const coinIds = data.coins.slice(0, 10).map((coin: any) => coin.id).join(',');
    
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
    callback: (data: any) => void
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
    }, 5000 + Math.random() * 3000); // 5-8 seconds
    
    this.intervals.set(channel, interval);
  }

  private stopRealTimeUpdates(channel: string) {
    const interval = this.intervals.get(channel);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(channel);
    }
  }

  private updateChannelData(channel: string) {
    const subscribers = this.subscribers.get(channel);
    if (!subscribers || subscribers.size === 0) return;

    switch (channel) {
      case 'prices':
        this.updatePrices();
        subscribers.forEach(callback => callback(this.currentData));
        break;
      case 'trades':
        this.updateTrades();
        subscribers.forEach(callback => callback(this.trades));
        break;
      case 'market':
        this.updateMarketData();
        subscribers.forEach(callback => callback(this.marketData));
        break;
      case 'sentiment':
        this.updateSocialSentiment();
        subscribers.forEach(callback => callback(this.socialSentiment));
        break;
    }
  }

  private updatePrices() {
    this.currentData = this.currentData.map(token => {
      const volatility = token.market_cap_rank <= 10 ? 0.01 : 0.02;
      const change = (Math.random() - 0.5) * volatility * token.current_price;
      const newPrice = Math.max(0.01, token.current_price + change);
      const priceChange24h = newPrice - token.current_price;
      const priceChangePercentage24h = (priceChange24h / token.current_price) * 100;
      
      return {
        ...token,
        current_price: newPrice,
        price_change_24h: priceChange24h,
        price_change_percentage_24h: priceChangePercentage24h,
        market_cap: newPrice * token.circulating_supply,
        market_cap_change_24h: (newPrice - token.current_price) * token.circulating_supply,
        market_cap_change_percentage_24h: priceChangePercentage24h,
        high_24h: Math.max(token.high_24h, newPrice),
        low_24h: Math.min(token.low_24h, newPrice),
        last_updated: new Date().toISOString(),
      };
    });
  }

  private updateTrades() {
    // Add new trades and remove old ones
    const newTrade: Trade = {
      id: `trade-${Date.now()}`,
      token_symbol: ['BTC', 'ETH', 'SOL', 'ADA', 'DOT'][Math.floor(Math.random() * 5)],
      price: Math.random() * 1000,
      amount: Math.random() * 10,
      timestamp: Date.now(),
      type: Math.random() > 0.5 ? 'buy' : 'sell',
    };
    
    this.trades = [newTrade, ...this.trades.slice(0, 49)];
  }

  private updateMarketData() {
    const change = (Math.random() - 0.5) * 0.02 * this.marketData.total_market_cap;
    this.marketData = {
      ...this.marketData,
      total_market_cap: Math.max(0, this.marketData.total_market_cap + change),
      total_volume: this.marketData.total_volume * (0.8 + Math.random() * 0.4),
      market_cap_change_percentage_24h_usd: (change / this.marketData.total_market_cap) * 100,
    };
  }

  private updateSocialSentiment() {
    this.socialSentiment = this.socialSentiment.map(sentiment => ({
      ...sentiment,
      score: Math.max(0, Math.min(100, sentiment.score + (Math.random() - 0.5) * 10)),
      social_volume: sentiment.social_volume * (0.9 + Math.random() * 0.2),
      social_dominance: Math.max(0, sentiment.social_dominance + (Math.random() - 0.5) * 2),
    }));
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
