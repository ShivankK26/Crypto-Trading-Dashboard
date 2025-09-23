export type TabType = 'all' | 'trending' | 'gainers' | 'losers' | 'watchlist' | 'recently-added';

export type SortField = 
  | 'market_cap_rank'
  | 'name'
  | 'current_price'
  | 'price_change_percentage_1h_in_currency'
  | 'price_change_percentage_24h'
  | 'price_change_percentage_7d'
  | 'market_cap'
  | 'total_volume';

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export interface FilterConfig {
  marketCapRange: {
    min: number | null;
    max: number | null;
  };
  priceChangeThreshold: {
    min: number | null;
    max: number | null;
  };
  volumeThreshold: {
    min: number | null;
  };
  // Predefined market cap filters
  marketCapFilters: {
    largeCap: boolean; // >$10B
    midCap: boolean;   // $1B-$10B
    smallCap: boolean; // <$1B
  };
  // Predefined price change filters
  priceChangeFilters: {
    gainers10: boolean;  // >10%
    gainers25: boolean;  // >25%
    gainers50: boolean;  // >50%
    losers10: boolean;   // <-10%
    losers25: boolean;   // <-25%
    losers50: boolean;   // <-50%
  };
  // Volume filters
  volumeFilters: {
    highVolume: boolean; // >$100M
    mediumVolume: boolean; // $10M-$100M
    lowVolume: boolean;  // <$10M
  };
}

export interface ColumnConfig {
  rank: boolean;
  name: boolean;
  price: boolean;
  change24h: boolean;
  change7d: boolean;
  marketCap: boolean;
  volume: boolean;
  sparkline: boolean;
}

export interface ViewportConfig {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
  height: number;
}

export interface ThemeConfig {
  mode: 'dark' | 'light';
  primaryColor: string;
  accentColor: string;
}

export interface NotificationConfig {
  priceAlerts: boolean;
  marketUpdates: boolean;
  volumeSpikes: boolean;
  newListings: boolean;
}

export interface ChartConfig {
  type: 'line' | 'candlestick';
  timeframe: '1h' | '24h' | '7d' | '30d' | '90d' | '1y';
  showVolume: boolean;
  showCrosshair: boolean;
  showGrid: boolean;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

export interface SearchState {
  query: string;
  suggestions: string[];
  isSearching: boolean;
  results: string[];
}

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

export interface ModalState {
  isOpen: boolean;
  type: 'settings' | 'filters' | 'alerts' | 'token-detail' | null;
  data: Record<string, unknown> | null;
}

export interface ToastState {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
  read?: boolean;
  createdAt?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface AnimationConfig {
  duration: number;
  easing: string;
  stagger: number;
}

export interface AccessibilityConfig {
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
  screenReader: boolean;
}
