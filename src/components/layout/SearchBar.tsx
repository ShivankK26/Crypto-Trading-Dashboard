'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp, TrendingDown, Star, Eye } from 'lucide-react';
import { useCryptoStore } from '@/store/cryptoStore';
import { debounce, formatCurrency, formatPercentage } from '@/lib/utils';
import { Cryptocurrency } from '@/types/crypto';

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Cryptocurrency[]>([]);
  const { 
    searchQuery, 
    setSearchQuery, 
    cryptocurrencies, 
    searchCryptocurrencies,
    setSelectedToken,
    addToWatchlist,
    watchlist
  } = useCryptoStore();

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((...args: unknown[]) => {
      const query = args[0] as string;
      if (query.length > 1) {
        searchCryptocurrencies(query).then(results => {
          setSuggestions(results);
        });
      } else {
        setSuggestions([]);
      }
    }, 300),
    [searchCryptocurrencies]
  );

  useEffect(() => {
    if (searchQuery) {
      debouncedSearch(searchQuery);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, debouncedSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSuggestionClick = (token: Cryptocurrency) => {
    setSelectedToken(token);
    setSearchQuery('');
    setSuggestions([]);
    setIsOpen(false);
  };

  const handleAddToWatchlist = (e: React.MouseEvent, token: Cryptocurrency) => {
    e.stopPropagation();
    addToWatchlist(token);
  };

  const isInWatchlist = (tokenId: string) => {
    return watchlist.some(item => item.id === tokenId);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSuggestions([]);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#E4E4E7]" />
        <input
          type="text"
          placeholder="Search cryptocurrencies..."
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          className="w-full pl-10 pr-10 py-2 bg-[#252528] border border-[#252528] rounded-lg text-[#FFFFFF] placeholder-[#E4E4E7] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#E4E4E7] hover:text-[#FFFFFF]"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-1 bg-[#1C1C1F] border border-[#252528] rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto"
          >
            {suggestions.map((token, index) => (
              <motion.button
                key={token.id}
                onClick={() => handleSuggestionClick(token)}
                className="w-full px-4 py-3 text-left text-[#FFFFFF] hover:bg-[#252528] transition-colors border-b border-[#252528] last:border-b-0"
                whileHover={{ backgroundColor: 'rgba(37, 37, 40, 0.5)' }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={token.image}
                      alt={token.name}
                      className="w-8 h-8 rounded-full"
                      width={32}
                      height={32}
                    />
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-[#FFFFFF]">{token.name}</span>
                        <span className="text-[#E4E4E7] text-sm">{token.symbol.toUpperCase()}</span>
                        {token.market_cap_rank && (
                          <span className="text-[#E4E4E7]/70 text-xs">#{token.market_cap_rank}</span>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-[#FFFFFF] font-medium">
                          {formatCurrency(token.current_price)}
                        </span>
                        <span className={`font-medium ${
                          token.price_change_percentage_24h >= 0 ? 'text-[#00DC82]' : 'text-[#FF3B3B]'
                        }`}>
                          {formatPercentage(token.price_change_percentage_24h)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => handleAddToWatchlist(e, token)}
                      className={`p-1 rounded-full transition-colors ${
                        isInWatchlist(token.id)
                          ? 'text-[#8B5CF6] bg-[#8B5CF6]/20'
                          : 'text-[#E4E4E7] hover:text-[#3B82F6] hover:bg-[#3B82F6]/20'
                      }`}
                      title={isInWatchlist(token.id) ? 'Remove from watchlist' : 'Add to watchlist'}
                    >
                      <Star className={`w-4 h-4 ${isInWatchlist(token.id) ? 'fill-current' : ''}`} />
                    </button>
                    <Eye className="w-4 h-4 text-[#E4E4E7]" />
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Stats */}
      {searchQuery && suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-full left-0 right-0 mt-1 bg-[#1C1C1F] border border-[#252528] rounded-lg p-4"
        >
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#E4E4E7]">
              {suggestions.length} result{suggestions.length !== 1 ? 's' : ''} for &quot;{searchQuery}&quot;
            </span>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-[#00DC82]">
                <TrendingUp className="w-3 h-3" />
                <span>+{suggestions.filter(t => t.price_change_percentage_24h > 0).length}</span>
              </div>
              <div className="flex items-center space-x-1 text-[#FF3B3B]">
                <TrendingDown className="w-3 h-3" />
                <span>-{suggestions.filter(t => t.price_change_percentage_24h < 0).length}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
