# CryptoDash - Professional Cryptocurrency Trading Dashboard

A modern, responsive cryptocurrency trading dashboard built with Next.js 15, React 19, and TypeScript. Features real-time market data, interactive charts, advanced filtering, watchlist management, and price alerts with a professional-grade user interface.

## 🚀 Features

### Core Functionality
- **Real-time Market Data**: Live cryptocurrency prices with WebSocket simulation
- **Interactive Charts**: Multi-timeframe price charts with Recharts and TradingView integration
- **Advanced Table**: Sortable, filterable cryptocurrency table with virtual scrolling
- **Token Detail View**: Comprehensive token information with master-detail pattern
- **Watchlist Management**: Drag-and-drop reordering, CSV export, price alerts
- **Smart Search**: Real-time search with autocomplete and token details
- **Responsive Design**: Full mobile and desktop support with optimized layouts

### Navigation Tabs
- **All Cryptocurrencies**: Complete list of top cryptocurrencies with advanced filtering
- **Trending**: Tokens with highest activity and social sentiment
- **Top Gainers**: Best performing tokens with customizable thresholds
- **Top Losers**: Worst performing tokens with loss tracking
- **Watchlist**: User-saved tokens with drag-and-drop reordering
- **Recently Added**: Newly listed tokens

### Advanced Features
- **Price Alerts**: Set custom price targets with above/below thresholds
- **Drag & Drop**: Reorder watchlist items with native HTML5 drag and drop
- **CSV Export**: Export watchlist data for external analysis
- **Advanced Filtering**: Market cap ranges, price change thresholds, volume filters
- **Column Customization**: Show/hide table columns based on preferences
- **Real-time Notifications**: Toast notifications for price alerts and actions
- **Mobile Optimization**: Touch-friendly interface with responsive charts

### Technical Features
- **Performance Optimized**: Memoized components, virtual scrolling, debounced search
- **Smooth Animations**: Framer Motion for micro-interactions and transitions
- **Streamlined UI**: Professional dark theme with consistent color palette
- **TypeScript**: Full type safety with comprehensive interfaces
- **State Management**: Zustand with persistence and state migration
- **API Integration**: CoinGecko API with fallback to mock data

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict type checking
- **Styling**: Tailwind CSS with custom color palette
- **Charts**: Recharts + TradingView Lightweight Charts
- **Animations**: Framer Motion with micro-interactions
- **State Management**: Zustand with persistence middleware
- **Icons**: Lucide React
- **UI Components**: Custom components with accessibility features
- **Drag & Drop**: Native HTML5 Drag and Drop API
- **Data Export**: CSV generation with Blob API
- **Notifications**: Custom toast notification system

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/ShivankK26/Crypto-Trading-Dashboard .
```

2. Install dependencies:
```bash
yarn install
```

3. Run the development server:
```bash
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes (CoinGecko integration)
│   └── globals.css        # Global styles
├── components/             # React components
│   ├── charts/            # Chart components (PriceChart, SparklineChart)
│   ├── crypto/            # Cryptocurrency components (Table, TokenDetail, Watchlist)
│   ├── layout/            # Layout components (Header, Navigation, SearchBar)
│   ├── market/            # Market overview components (Trending, TopMovers)
│   └── ui/                # Reusable UI components (Button, Modal, Toast)
├── hooks/                 # Custom React hooks (useVirtualScroll)
├── lib/                   # Utility functions (formatting, debounce)
├── services/              # API services and mock data
├── store/                 # Zustand store with persistence
└── types/                 # TypeScript type definitions
```

## 🎯 Key Features Deep Dive

### Watchlist Management
- **Drag & Drop Reordering**: Native HTML5 drag and drop for intuitive reordering
- **Price Alerts**: Set custom price targets with above/below conditions
- **CSV Export**: Download watchlist data for external analysis
- **Real-time Updates**: Automatic price monitoring and alert notifications
- **Visual Indicators**: Color-coded alert status (active, triggered, none)

### Advanced Filtering System
- **Market Cap Filters**: Large Cap (>$10B), Mid Cap ($1B-$10B), Small Cap (<$1B)
- **Price Change Filters**: Gainers (10%, 25%, 50%) and Losers (-10%, -25%, -50%)
- **Volume Filters**: High Volume (>$100M), Medium Volume ($10M-$100M), Low Volume (<$10M)
- **Custom Ranges**: Set custom min/max values for precise filtering
- **Filter Persistence**: Filters are saved and restored across sessions

### Smart Search & Discovery
- **Real-time Search**: Instant search with debounced API calls
- **Token Details**: Rich search results with price, market cap, and change data
- **Quick Actions**: Add to watchlist directly from search results
- **Autocomplete**: Intelligent suggestions based on token names and symbols
- **Market Stats**: Quick overview of gainers/losers in search interface

### Responsive Chart System
- **Multiple Timeframes**: 1H, 24H, 7D, 30D, 90D, 1Y with smooth transitions
- **Chart Types**: Line charts and candlestick charts with TradingView integration
- **Mobile Optimization**: Touch-friendly controls and responsive layouts
- **Interactive Tooltips**: Detailed price information on hover/touch
- **Performance**: Optimized rendering for smooth 60fps animations


## 🔧 Configuration

### Environment Variables
Create a `.env.local` file for environment-specific configuration:

```env
COINGECKO_API_KEY=your_coingecko_api_key_here
NEXT_PUBLIC_COINGECKO_API_URL=https://api.coingecko.com/api/v3
```

**Note**: The application includes a demo API key for testing purposes. For production use, you should obtain your own API key from [CoinGecko](https://www.coingecko.com/en/api).

### Customization
- Modify color scheme in `tailwind.config.js`
- Update mock data in `src/services/mockData.ts`
- Customize animations in component files


## 🔔 Notification System

### Price Alerts
- **Custom Thresholds**: Set price targets above or below current price
- **Real-time Monitoring**: Automatic price checking with WebSocket updates
- **Visual Indicators**: Color-coded alert status in watchlist
- **Toast Notifications**: Instant feedback when alerts are triggered
- **Alert Management**: Edit, delete, or create new alerts easily

### Notification Center
- **Unread Counter**: Track unread notifications with badge indicator
- **Alert History**: View all triggered alerts with timestamps
- **Quick Actions**: Dismiss individual notifications or clear all
- **Persistent Storage**: Notifications persist across browser sessions

## 📊 Data Sources

The application uses the [CoinGecko API](https://docs.coingecko.com/v3.0.1/reference/coins-markets) for real cryptocurrency market data:

### API Endpoints Used
- **Coins List with Market Data**: `/coins/markets` - Real-time cryptocurrency prices, market cap, volume, and market data
- **Historical Chart Data**: `/coins/{id}/market_chart` - Historical price data for interactive charts
- **Global Market Data**: `/global` - Overall market statistics and Bitcoin/Ethereum dominance
- **Trending Coins**: `/search/trending` - Currently trending cryptocurrencies
- **Search**: `/search` - Search functionality for cryptocurrencies

### Data Features
- **Real-time Updates**: Live price data with automatic refresh
- **Historical Data**: Multiple timeframes (1H, 24H, 7D, 30D, 90D, 1Y)
- **Market Metrics**: Market cap, volume, price changes, and rankings
- **Sparkline Data**: 7-day price trends for quick visual reference
- **Fallback System**: Mock data when API is unavailable
- **Error Handling**: Graceful degradation with user-friendly messages
