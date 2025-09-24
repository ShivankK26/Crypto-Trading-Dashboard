import { Cryptocurrency, MarketData, TrendingToken, Trade, SocialSentiment, PriceData } from '@/types/crypto';

// Base cryptocurrency data with realistic values
const baseCryptocurrencies: Omit<Cryptocurrency, 'current_price' | 'price_change_24h' | 'price_change_percentage_24h' | 'price_change_percentage_7d' | 'market_cap' | 'total_volume' | 'high_24h' | 'low_24h' | 'market_cap_change_24h' | 'market_cap_change_percentage_24h' | 'last_updated' | 'sparkline_in_7d'>[] = [
  {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    market_cap_rank: 1,
    fully_diluted_valuation: 2000000000000,
    circulating_supply: 19500000,
    total_supply: 19500000,
    max_supply: 21000000,
    ath: 69045,
    ath_change_percentage: -20.5,
    ath_date: '2021-11-10T14:24:11.849Z',
    atl: 67.81,
    atl_change_percentage: 90000,
    atl_date: '2013-07-06T00:00:00.000Z',
  },
  {
    id: 'ethereum',
    symbol: 'eth',
    name: 'Ethereum',
    image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    market_cap_rank: 2,
    fully_diluted_valuation: 500000000000,
    circulating_supply: 120000000,
    total_supply: 120000000,
    max_supply: null,
    ath: 4878.26,
    ath_change_percentage: -35.2,
    ath_date: '2021-11-10T14:24:19.604Z',
    atl: 0.432979,
    atl_change_percentage: 700000,
    atl_date: '2015-10-20T00:00:00.000Z',
  },
  {
    id: 'binancecoin',
    symbol: 'bnb',
    name: 'BNB',
    image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
    market_cap_rank: 3,
    fully_diluted_valuation: 100000000000,
    circulating_supply: 150000000,
    total_supply: 150000000,
    max_supply: 200000000,
    ath: 686.31,
    ath_change_percentage: -45.8,
    ath_date: '2021-05-10T07:24:17.661Z',
    atl: 0.0398177,
    atl_change_percentage: 1500000,
    atl_date: '2017-10-19T00:00:00.000Z',
  },
  {
    id: 'solana',
    symbol: 'sol',
    name: 'Solana',
    image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
    market_cap_rank: 4,
    fully_diluted_valuation: 80000000000,
    circulating_supply: 450000000,
    total_supply: 500000000,
    max_supply: null,
    ath: 259.96,
    ath_change_percentage: -60.2,
    ath_date: '2021-11-06T21:54:35.825Z',
    atl: 0.500801,
    atl_change_percentage: 50000,
    atl_date: '2020-05-11T19:35:23.449Z',
  },
  {
    id: 'xrp',
    symbol: 'xrp',
    name: 'XRP',
    image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
    market_cap_rank: 5,
    fully_diluted_valuation: 60000000000,
    circulating_supply: 55000000000,
    total_supply: 99987950782,
    max_supply: 100000000000,
    ath: 3.40,
    ath_change_percentage: -70.5,
    ath_date: '2018-01-07T00:00:00.000Z',
    atl: 0.00268621,
    atl_change_percentage: 12000,
    atl_date: '2014-05-22T00:00:00.000Z',
  },
  {
    id: 'cardano',
    symbol: 'ada',
    name: 'Cardano',
    image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
    market_cap_rank: 6,
    fully_diluted_valuation: 25000000000,
    circulating_supply: 35000000000,
    total_supply: 45000000000,
    max_supply: 45000000000,
    ath: 3.09,
    ath_change_percentage: -75.8,
    ath_date: '2021-09-02T06:00:10.474Z',
    atl: 0.01735475,
    atl_change_percentage: 4000,
    atl_date: '2020-03-13T02:22:55.044Z',
  },
  {
    id: 'dogecoin',
    symbol: 'doge',
    name: 'Dogecoin',
    image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png',
    market_cap_rank: 7,
    fully_diluted_valuation: 20000000000,
    circulating_supply: 140000000000,
    total_supply: 140000000000,
    max_supply: null,
    ath: 0.731578,
    ath_change_percentage: -80.2,
    ath_date: '2021-05-08T05:08:23.458Z',
    atl: 0.0000869,
    atl_change_percentage: 180000,
    atl_date: '2015-05-06T00:00:00.000Z',
  },
  {
    id: 'avalanche-2',
    symbol: 'avax',
    name: 'Avalanche',
    image: 'https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png',
    market_cap_rank: 8,
    fully_diluted_valuation: 15000000000,
    circulating_supply: 350000000,
    total_supply: 400000000,
    max_supply: 720000000,
    ath: 144.96,
    ath_change_percentage: -85.3,
    ath_date: '2021-11-21T14:18:56.538Z',
    atl: 2.8,
    atl_change_percentage: 500,
    atl_date: '2020-12-31T13:15:21.540Z',
  },
  {
    id: 'chainlink',
    symbol: 'link',
    name: 'Chainlink',
    image: 'https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png',
    market_cap_rank: 9,
    fully_diluted_valuation: 12000000000,
    circulating_supply: 500000000,
    total_supply: 1000000000,
    max_supply: 1000000000,
    ath: 52.70,
    ath_change_percentage: -70.5,
    ath_date: '2021-05-10T00:13:57.214Z',
    atl: 0.148183,
    atl_change_percentage: 15000,
    atl_date: '2017-11-29T00:00:00.000Z',
  },
  {
    id: 'polkadot',
    symbol: 'dot',
    name: 'Polkadot',
    image: 'https://assets.coingecko.com/coins/images/12171/large/polkadot.png',
    market_cap_rank: 10,
    fully_diluted_valuation: 10000000000,
    circulating_supply: 1200000000,
    total_supply: 1200000000,
    max_supply: null,
    ath: 54.98,
    ath_change_percentage: -80.2,
    ath_date: '2021-11-04T14:10:09.301Z',
    atl: 2.70,
    atl_change_percentage: 200,
    atl_date: '2020-08-20T05:48:11.359Z',
  },
];

// Generate realistic price data with volatility
function generatePriceData(basePrice: number, volatility: number = 0.02): number {
  const change = (Math.random() - 0.5) * volatility * basePrice;
  return Math.max(0.01, basePrice + change);
}

// Generate sparkline data for 7 days
function generateSparklineData(basePrice: number): number[] {
  const data: number[] = [];
  let currentPrice = basePrice;
  
  for (let i = 0; i < 168; i++) { // 7 days * 24 hours
    const change = (Math.random() - 0.5) * 0.05 * currentPrice;
    currentPrice = Math.max(0.01, currentPrice + change);
    data.push(currentPrice);
  }
  
  return data;
}

// Generate current cryptocurrency data with realistic fluctuations
export function generateCryptocurrencyData(): Cryptocurrency[] {
  return baseCryptocurrencies.map((base, index) => {
    const basePrice = [65000, 3200, 580, 95, 0.52, 0.45, 0.08, 35, 14, 6.5][index] || 1;
    const currentPrice = generatePriceData(basePrice);
    const priceChange24h = generatePriceData(0, 0.1);
    const priceChangePercentage24h = (priceChange24h / currentPrice) * 100;
    const priceChangePercentage7d = (Math.random() - 0.5) * 20;
    const marketCap = currentPrice * base.circulating_supply;
    const totalVolume = marketCap * (0.1 + Math.random() * 0.3);
    
    return {
      ...base,
      current_price: currentPrice,
      price_change_24h: priceChange24h,
      price_change_percentage_24h: priceChangePercentage24h,
      price_change_percentage_7d: priceChangePercentage7d,
      market_cap: marketCap,
      total_volume: totalVolume,
      high_24h: currentPrice * (1 + Math.random() * 0.1),
      low_24h: currentPrice * (1 - Math.random() * 0.1),
      market_cap_change_24h: marketCap * (priceChangePercentage24h / 100),
      market_cap_change_percentage_24h: priceChangePercentage24h,
      last_updated: new Date().toISOString(),
      sparkline_in_7d: {
        price: generateSparklineData(currentPrice),
      },
    };
  });
}

// Generate market data
export function generateMarketData(): MarketData {
  const totalMarketCap = 2500000000000; // $2.5T
  const totalVolume = 80000000000; // $80B
  
  return {
    total_market_cap: totalMarketCap,
    total_volume: totalVolume,
    market_cap_percentage: {
      btc: 45.2,
      eth: 18.7,
    },
    market_cap_change_percentage_24h_usd: (Math.random() - 0.5) * 5,
    active_cryptocurrencies: 8500,
    markets: 650,
    total_market_cap_usd: totalMarketCap,
    total_volume_usd: totalVolume,
  };
}

// Generate trending tokens
export function generateTrendingTokens(): TrendingToken[] {
  const trendingSymbols = ['SHIB', 'PEPE', 'DOGE', 'FLOKI', 'BONK', 'WIF', 'BOME', 'MYRO'];
  
  return trendingSymbols.map((symbol, index) => ({
    id: symbol.toLowerCase(),
    symbol,
    name: symbol,
    image: `https://assets.coingecko.com/coins/images/${1000 + index}/large/${symbol.toLowerCase()}.png`,
    current_price: Math.random() * 0.01,
    price_change_percentage_24h: (Math.random() - 0.3) * 100,
    market_cap_rank: 100 + index,
    score: Math.random() * 100,
  }));
}

// Generate mock trades
export function generateMockTrades(): Trade[] {
  const symbols = ['BTC', 'ETH', 'SOL', 'ADA', 'DOT', 'BNB', 'XRP', 'AVAX', 'LINK', 'MATIC'];
  const trades: Trade[] = [];
  
  // Define realistic price ranges for each symbol
  const priceRanges: Record<string, { min: number; max: number }> = {
    'BTC': { min: 60000, max: 70000 },
    'ETH': { min: 3000, max: 3500 },
    'SOL': { min: 90, max: 120 },
    'ADA': { min: 0.4, max: 0.6 },
    'DOT': { min: 5, max: 8 },
    'BNB': { min: 550, max: 650 },
    'XRP': { min: 0.5, max: 0.7 },
    'AVAX': { min: 30, max: 45 },
    'LINK': { min: 12, max: 18 },
    'MATIC': { min: 0.6, max: 1.0 },
  };
  
  for (let i = 0; i < 50; i++) {
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    const range = priceRanges[symbol] || { min: 1, max: 100 };
    const price = range.min + Math.random() * (range.max - range.min);
    const amount = Math.random() * 10 + 0.1; // 0.1 to 10.1
    
    trades.push({
      id: `trade-${i}`,
      token_symbol: symbol,
      price: Math.round(price * 100) / 100, // Round to 2 decimal places
      amount: Math.round(amount * 1000) / 1000, // Round to 3 decimal places
      timestamp: Date.now() - Math.random() * 3600000, // Last hour
      type: Math.random() > 0.5 ? 'buy' : 'sell',
    });
  }
  
  return trades.sort((a, b) => b.timestamp - a.timestamp);
}

// Generate token-specific mock trades
export function generateTokenSpecificTrades(tokenSymbol: string): Trade[] {
  const priceRanges: Record<string, { min: number; max: number }> = {
    'BTC': { min: 60000, max: 70000 },
    'ETH': { min: 3000, max: 3500 },
    'SOL': { min: 90, max: 120 },
    'ADA': { min: 0.4, max: 0.6 },
    'DOT': { min: 5, max: 8 },
    'BNB': { min: 550, max: 650 },
    'XRP': { min: 0.5, max: 0.7 },
    'AVAX': { min: 30, max: 45 },
    'LINK': { min: 12, max: 18 },
    'MATIC': { min: 0.6, max: 1.0 },
  };
  
  const range = priceRanges[tokenSymbol.toUpperCase()] || { min: 1, max: 100 };
  const trades: Trade[] = [];
  
  for (let i = 0; i < 20; i++) {
    const price = range.min + Math.random() * (range.max - range.min);
    const amount = Math.random() * 10 + 0.1;
    
    trades.push({
      id: `trade-${tokenSymbol.toLowerCase()}-${i}`,
      token_symbol: tokenSymbol.toUpperCase(),
      price: Math.round(price * 100) / 100,
      amount: Math.round(amount * 1000) / 1000,
      timestamp: Date.now() - Math.random() * 3600000,
      type: Math.random() > 0.5 ? 'buy' : 'sell',
    });
  }
  
  return trades.sort((a, b) => b.timestamp - a.timestamp);
}

// Generate social sentiment data
export function generateSocialSentiment(): SocialSentiment[] {
  const tokens = ['bitcoin', 'ethereum', 'solana', 'cardano', 'polkadot', 'binancecoin', 'xrp', 'avalanche-2', 'chainlink', 'polkadot'];
  
  return tokens.map(tokenId => {
    const sentiment = ['bullish', 'neutral', 'bearish'][Math.floor(Math.random() * 3)] as 'bullish' | 'neutral' | 'bearish';
    const score = Math.random() * 100;
    
    return {
      token_id: tokenId,
      sentiment,
      score: Math.round(score * 10) / 10, // Round to 1 decimal place
      social_volume: Math.round(Math.random() * 10000),
      social_dominance: Math.round(Math.random() * 20 * 10) / 10, // Round to 1 decimal place
    };
  });
}

// Generate token-specific social sentiment
export function generateTokenSpecificSentiment(tokenId: string): SocialSentiment {
  const sentiment = ['bullish', 'neutral', 'bearish'][Math.floor(Math.random() * 3)] as 'bullish' | 'neutral' | 'bearish';
  const score = Math.random() * 100;
  
  return {
    token_id: tokenId,
    sentiment,
    score: Math.round(score * 10) / 10,
    social_volume: Math.round(Math.random() * 10000),
    social_dominance: Math.round(Math.random() * 20 * 10) / 10,
  };
}

// Generate historical price data for charts
export function generateHistoricalData(
  basePrice: number,
  timeframe: '1h' | '24h' | '7d' | '30d' | '90d' | '1y',
  dataPoints: number = 100
): PriceData[] {
  const data: PriceData[] = [];
  let currentPrice = basePrice;
  const now = Date.now();
  
  // Calculate interval based on timeframe
  let interval: number;
  switch (timeframe) {
    case '1h':
      interval = 60000; // 1 minute
      break;
    case '24h':
      interval = 900000; // 15 minutes
      break;
    case '7d':
      interval = 3600000; // 1 hour
      break;
    case '30d':
      interval = 86400000; // 1 day
      break;
    case '90d':
      interval = 86400000; // 1 day
      break;
    case '1y':
      interval = 604800000; // 1 week
      break;
    default:
      interval = 3600000;
  }
  
  for (let i = dataPoints; i >= 0; i--) {
    const timestamp = now - (i * interval);
    const volatility = timeframe === '1h' ? 0.01 : timeframe === '24h' ? 0.02 : 0.05;
    const change = (Math.random() - 0.5) * volatility * currentPrice;
    currentPrice = Math.max(0.01, currentPrice + change);
    
    data.push({
      timestamp,
      price: currentPrice,
      volume: Math.random() * 1000000,
    });
  }
  
  return data;
}
