export interface Cryptocurrency {
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
  sparkline_in_7d: {
    price: number[];
  };
  price_change_percentage_1h_in_currency?: number;
  price_change_percentage_24h_in_currency?: number;
  price_change_percentage_7d_in_currency?: number;
  price_change_percentage_30d_in_currency?: number;
  price_change_percentage_1y_in_currency?: number;
}

export interface MarketData {
  total_market_cap: number;
  total_volume: number;
  market_cap_percentage: {
    btc: number;
    eth: number;
  };
  market_cap_change_percentage_24h_usd: number;
  active_cryptocurrencies: number;
  markets: number;
  total_market_cap_usd: number;
  total_volume_usd: number;
}

export interface PriceData {
  timestamp: number;
  price: number;
  volume: number;
}

export interface ChartData {
  timeframe: '1h' | '24h' | '7d' | '30d' | '90d' | '1y';
  data: PriceData[];
}

export interface TrendingToken {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap_rank: number;
  score: number;
}

export interface TrendingCoin {
  item: {
    id: string;
    coin_id: number;
    name: string;
    symbol: string;
    market_cap_rank: number;
    thumb: string;
    small: string;
    large: string;
    slug: string;
    price_btc: number;
    score: number;
    data?: {
      price: number;
      price_btc: string;
      price_change_percentage_24h: Record<string, number>;
      market_cap: string;
      market_cap_btc: string;
      total_volume: string;
      total_volume_btc: string;
      sparkline: string;
      content: any;
    };
  };
}

export interface TrendingCategory {
  id: number;
  name: string;
  market_cap_1h_change: number;
  slug: string;
  coins_count: number;
  data: {
    market_cap: number;
    market_cap_btc: number;
    total_volume: number;
    total_volume_btc: number;
    market_cap_change_percentage_24h: Record<string, number>;
    sparkline: string;
  };
}

export interface TrendingData {
  coins: TrendingCoin[];
  nfts: any[];
  categories: TrendingCategory[];
}

export interface MarketStats {
  total_market_cap: number;
  total_volume_24h: number;
  bitcoin_dominance: number;
  ethereum_dominance: number;
  active_cryptocurrencies: number;
  markets: number;
  market_cap_change_24h: number;
}

export interface WatchlistItem {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  added_at: string;
}

export interface PriceAlert {
  id: string;
  token_id: string;
  token_symbol: string;
  target_price: number;
  condition: 'above' | 'below';
  is_active: boolean;
  created_at: string;
}

export interface Trade {
  id: string;
  token_symbol: string;
  price: number;
  amount: number;
  timestamp: number;
  type: 'buy' | 'sell';
}

export interface SocialSentiment {
  token_id: string;
  sentiment: 'bullish' | 'neutral' | 'bearish';
  score: number;
  social_volume: number;
  social_dominance: number;
}
