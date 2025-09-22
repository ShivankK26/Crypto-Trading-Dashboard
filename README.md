# CryptoDash - Professional Cryptocurrency Trading Dashboard

A modern, responsive cryptocurrency trading dashboard built with Next.js 15, React 19, and TypeScript. Features real-time market data, interactive charts, and a professional-grade user interface.

## 🚀 Features

### Core Functionality
- **Real-time Market Data**: Live cryptocurrency prices with WebSocket simulation
- **Interactive Charts**: Multi-timeframe price charts with Recharts
- **Advanced Table**: Sortable, filterable cryptocurrency table with virtual scrolling
- **Token Detail View**: Comprehensive token information with master-detail pattern
- **Watchlist**: Persistent watchlist with localStorage
- **Search**: Real-time search with autocomplete
- **Responsive Design**: Full mobile and desktop support

### Navigation Tabs
- **All Cryptocurrencies**: Complete list of top cryptocurrencies
- **Trending**: Tokens with highest activity
- **Top Gainers**: Best performing tokens
- **Top Losers**: Worst performing tokens
- **Watchlist**: User-saved tokens
- **Recently Added**: Newly listed tokens

### Technical Features
- **Performance Optimized**: Memoized components, virtual scrolling, debounced search
- **Smooth Animations**: Framer Motion for micro-interactions
- **Dark Theme**: Professional dark mode design
- **TypeScript**: Full type safety
- **State Management**: Zustand for efficient state management
- **Mock API**: Realistic data simulation with WebSocket updates

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Icons**: Lucide React
- **UI Components**: Custom components with Radix UI primitives

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd crypto-dashboard
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
├── components/             # React components
│   ├── charts/            # Chart components
│   ├── crypto/            # Cryptocurrency-related components
│   ├── layout/            # Layout components
│   ├── market/            # Market overview components
│   └── ui/                # Reusable UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
├── services/              # API services and mock data
├── store/                 # Zustand store
└── types/                 # TypeScript type definitions
```

## 🎨 Design System

### Color Palette
- **Background**: Deep blacks (#0A0A0B, #141416)
- **Surface**: Dark grays (#1C1C1F, #252528)
- **Success**: Vibrant green (#00DC82)
- **Danger**: Bright red (#FF3B3B)
- **Text**: High contrast whites (#FFFFFF, #E4E4E7)
- **Accents**: Electric blue (#3B82F6)

### Typography
- **Headings**: Bold, high contrast
- **Body**: Regular weight, good readability
- **Numbers**: Monospace for prices and percentages

## 📱 Responsive Design

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### Mobile Features
- Bottom navigation bar
- Swipeable charts
- Collapsible table columns
- Touch-optimized interactions

## ⚡ Performance

- **Virtual Scrolling**: Efficient rendering of large datasets
- **Memoization**: React.memo for expensive components
- **Debounced Search**: 300ms debounce for search inputs
- **Lazy Loading**: Images and components loaded on demand
- **Code Splitting**: Automatic code splitting with Next.js

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

## 🧪 Testing

Run the test suite:
```bash
yarn test
```

Run linting:
```bash
yarn lint
```

## 🚀 Deployment

Build for production:
```bash
yarn build
```

Start production server:
```bash
yarn start
```

Deploy to Vercel:
```bash
vercel
```

## 📊 Data Sources

The application uses the [CoinGecko API](https://docs.coingecko.com/v3.0.1/reference/coins-markets) for real cryptocurrency market data:

### API Endpoints Used
- **Coins List with Market Data**: `/coins/markets` - Real-time cryptocurrency prices, market cap, volume, and market data
- **Historical Chart Data**: `/coins/{id}/market_chart` - Historical price data for interactive charts
- **Global Market Data**: `/global` - Overall market statistics and Bitcoin/Ethereum dominance
- **Trending Coins**: `/search/trending` - Currently trending cryptocurrencies
- **Search**: `/search` - Search functionality for cryptocurrencies

### Features
- Real-time price data with automatic updates
- Historical price data for multiple timeframes (1H, 24H, 7D, 30D, 90D, 1Y)
- Market cap and volume data
- Price change percentages across different time periods
- Sparkline data for 7-day price trends
- Fallback to mock data if API is unavailable

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- CoinGecko API for cryptocurrency data inspiration
- TradingView for chart design inspiration
- Next.js team for the excellent framework
- Tailwind CSS for the utility-first CSS framework