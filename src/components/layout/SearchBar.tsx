'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp, TrendingDown } from 'lucide-react';
import { useCryptoStore } from '@/store/cryptoStore';
import { debounce } from '@/lib/utils';

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { searchQuery, setSearchQuery, cryptocurrencies, searchCryptocurrencies } = useCryptoStore();

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((...args: unknown[]) => {
      const query = args[0] as string;
      if (query.length > 1) {
        searchCryptocurrencies(query).then(results => {
          setSuggestions(results.map(token => `${token.name} (${token.symbol.toUpperCase()})`));
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

  const handleSuggestionClick = (suggestion: string) => {
    const match = suggestion.match(/^(.+?)\s\((.+?)\)$/);
    if (match) {
      const [, name, symbol] = match;
      const token = cryptocurrencies.find(
        t => t.name === name && t.symbol.toUpperCase() === symbol
      );
      if (token) {
        setSearchQuery('');
        setSuggestions([]);
        // You could add logic here to select the token
      }
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSuggestions([]);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search cryptocurrencies..."
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          className="w-full pl-10 pr-10 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
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
            className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
          >
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 transition-colors flex items-center space-x-2"
                whileHover={{ backgroundColor: 'rgba(55, 65, 81, 0.5)' }}
              >
                <Search className="w-4 h-4 text-gray-400" />
                <span>{suggestion}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Stats */}
      {searchQuery && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg p-4"
        >
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">
              {suggestions.length} results for &quot;{searchQuery}&quot;
            </span>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-green-400">
                <TrendingUp className="w-3 h-3" />
                <span>+{Math.floor(Math.random() * 20)}%</span>
              </div>
              <div className="flex items-center space-x-1 text-red-400">
                <TrendingDown className="w-3 h-3" />
                <span>-{Math.floor(Math.random() * 10)}%</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
