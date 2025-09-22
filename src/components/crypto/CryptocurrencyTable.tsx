'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronUp, 
  ChevronDown, 
  Filter,
  Settings
} from 'lucide-react';
import { useCryptoStore } from '@/store/cryptoStore';
import { SortField } from '@/types/ui';
import CryptoTableRow from './CryptoTableRow';

export default function CryptocurrencyTable() {
  const {
    getCurrentTabData,
    sortConfig,
    setSortConfig,
    setSelectedToken,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    columnConfig,
    setModalState,
  } = useCryptoStore();

  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const data = useMemo(() => getCurrentTabData(), [getCurrentTabData]);

  const handleSort = (field: SortField) => {
    setSortConfig({
      field,
      direction: sortConfig.field === field && sortConfig.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  const handleTokenClick = useCallback((token: any) => {
    setSelectedToken(token);
  }, [setSelectedToken]);

  const handleWatchlistToggle = useCallback((token: any, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInWatchlist(token.id)) {
      removeFromWatchlist(token.id);
    } else {
      addToWatchlist(token);
    }
  }, [isInWatchlist, removeFromWatchlist, addToWatchlist]);

  const handleHover = useCallback((id: string | null) => {
    setHoveredRow(id);
  }, []);

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors"
    >
      <span>{children}</span>
      {sortConfig.field === field && (
        sortConfig.direction === 'asc' ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )
      )}
    </button>
  );

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
      {/* Table Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <h2 className="text-lg font-semibold text-white">Cryptocurrency Market</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setModalState({ isOpen: true, type: 'filters', data: null })}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <Filter className="w-5 h-5" />
          </button>
          <button
            onClick={() => setModalState({ isOpen: true, type: 'settings', data: null })}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              {columnConfig.rank && (
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                  <SortButton field="market_cap_rank">#</SortButton>
                </th>
              )}
              {columnConfig.name && (
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                  <SortButton field="name">Name</SortButton>
                </th>
              )}
              {columnConfig.price && (
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-400">
                  <SortButton field="current_price">Price</SortButton>
                </th>
              )}
              {columnConfig.change24h && (
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-400">
                  <SortButton field="price_change_percentage_24h">24h</SortButton>
                </th>
              )}
              {columnConfig.change7d && (
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-400">
                  <SortButton field="price_change_percentage_7d">7d</SortButton>
                </th>
              )}
              {columnConfig.marketCap && (
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-400">
                  <SortButton field="market_cap">Market Cap</SortButton>
                </th>
              )}
              {columnConfig.volume && (
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-400">
                  <SortButton field="total_volume">Volume</SortButton>
                </th>
              )}
              {columnConfig.sparkline && (
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-400">
                  7d Chart
                </th>
              )}
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {data.map((token, index) => (
                <CryptoTableRow
                  key={token.id}
                  token={token}
                  index={index}
                  isHovered={hoveredRow === token.id}
                  onHover={handleHover}
                  onClick={handleTokenClick}
                  onWatchlistToggle={handleWatchlistToggle}
                  isInWatchlist={isInWatchlist}
                  columnConfig={columnConfig}
                />
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="flex items-center justify-between p-4 border-t border-gray-800">
        <p className="text-sm text-gray-400">
          Showing {data.length} cryptocurrencies
        </p>
        <div className="flex items-center space-x-4">
          <p className="text-sm text-gray-400">
            Last updated: {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
}
