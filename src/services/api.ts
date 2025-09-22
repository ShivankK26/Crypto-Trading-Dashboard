import { 
  Cryptocurrency, 
  MarketData, 
  TrendingToken, 
  Trade, 
  SocialSentiment, 
  PriceData,
  ChartData 
} from '@/types/crypto';
import { 
  generateCryptocurrencyData, 
  generateMarketData, 
  generateTrendingTokens, 
  generateMockTrades, 
  generateSocialSentiment,
  generateHistoricalData 
} from './mockData';

// Simulate API latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class CryptoAPI {
  private subscribers: Map<string, Set<(data: any) => void>> = new Map();
  private intervals: Map<string, NodeJS.Timeout> = new Map();
  private currentData: Cryptocurrency[] = generateCryptocurrencyData();
  private marketData: MarketData = generateMarketData();
  private trades: Trade[] = generateMockTrades();
  private socialSentiment: SocialSentiment[] = generateSocialSentiment();

  // Get all cryptocurrencies
  async getCryptocurrencies(): Promise<Cryptocurrency[]> {
    await delay(200 + Math.random() * 300);
    return [...this.currentData];
  }

  // Get market data
  async getMarketData(): Promise<MarketData> {
    await delay(150 + Math.random() * 200);
    return { ...this.marketData };
  }

  // Get trending tokens
  async getTrendingTokens(): Promise<TrendingToken[]> {
    await delay(100 + Math.random() * 200);
    return generateTrendingTokens();
  }

  // Get top gainers
  async getTopGainers(): Promise<Cryptocurrency[]> {
    await delay(200 + Math.random() * 300);
    const sorted = [...this.currentData].sort(
      (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h
    );
    return sorted.slice(0, 5);
  }

  // Get top losers
  async getTopLosers(): Promise<Cryptocurrency[]> {
    await delay(200 + Math.random() * 300);
    const sorted = [...this.currentData].sort(
      (a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h
    );
    return sorted.slice(0, 5);
  }

  // Get recently added tokens (mock)
  async getRecentlyAdded(): Promise<Cryptocurrency[]> {
    await delay(200 + Math.random() * 300);
    const recentlyAdded = this.currentData.slice(10, 20).map(token => ({
      ...token,
      market_cap_rank: token.market_cap_rank + 1000,
      name: `New ${token.name}`,
      symbol: `NEW${token.symbol.toUpperCase()}`,
    }));
    return recentlyAdded;
  }

  // Get token by ID
  async getTokenById(id: string): Promise<Cryptocurrency | null> {
    await delay(100 + Math.random() * 200);
    return this.currentData.find(token => token.id === id) || null;
  }

  // Get historical price data
  async getHistoricalData(
    tokenId: string, 
    timeframe: '1h' | '24h' | '7d' | '30d' | '90d' | '1y'
  ): Promise<PriceData[]> {
    await delay(300 + Math.random() * 500);
    const token = this.currentData.find(t => t.id === tokenId);
    if (!token) return [];
    
    return generateHistoricalData(token.current_price, timeframe);
  }

  // Get recent trades
  async getRecentTrades(): Promise<Trade[]> {
    await delay(100 + Math.random() * 200);
    return [...this.trades];
  }

  // Get social sentiment
  async getSocialSentiment(): Promise<SocialSentiment[]> {
    await delay(150 + Math.random() * 250);
    return [...this.socialSentiment];
  }

  // Search cryptocurrencies
  async searchCryptocurrencies(query: string): Promise<Cryptocurrency[]> {
    await delay(100 + Math.random() * 200);
    const lowercaseQuery = query.toLowerCase();
    return this.currentData.filter(
      token => 
        token.name.toLowerCase().includes(lowercaseQuery) ||
        token.symbol.toLowerCase().includes(lowercaseQuery)
    );
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
