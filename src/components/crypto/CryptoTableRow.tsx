'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Star, MoreHorizontal, TrendingUp, TrendingDown } from 'lucide-react';
import { Cryptocurrency } from '@/types/crypto';
import { 
  formatCurrency, 
  formatPercentage, 
  formatMarketCap, 
  formatVolume 
} from '@/lib/utils';
import SparklineChart from './SparklineChart';

interface CryptoTableRowProps {
  token: Cryptocurrency;
  index: number;
  isHovered: boolean;
  onHover: (id: string | null) => void;
  onClick: (token: Cryptocurrency) => void;
  onWatchlistToggle: (token: Cryptocurrency, e: React.MouseEvent) => void;
  isInWatchlist: (tokenId: string) => boolean;
  columnConfig: {
    rank: boolean;
    name: boolean;
    price: boolean;
    change24h: boolean;
    change7d: boolean;
    marketCap: boolean;
    volume: boolean;
    sparkline: boolean;
  };
}

const CryptoTableRow = memo<CryptoTableRowProps>(({
  token,
  index,
  isHovered,
  onHover,
  onClick,
  onWatchlistToggle,
  isInWatchlist,
  columnConfig,
}) => {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.05 }}
      className={`border-b border-gray-800 hover:bg-gray-800/50 transition-colors cursor-pointer ${
        isHovered ? 'bg-gray-800/30' : ''
      }`}
      onClick={() => onClick(token)}
      onMouseEnter={() => onHover(token.id)}
      onMouseLeave={() => onHover(null)}
    >
      {columnConfig.rank && (
        <td className="px-4 py-4 text-sm text-gray-400">
          {token.market_cap_rank || '-'}
        </td>
      )}
      {columnConfig.name && (
        <td className="px-4 py-4">
          <div className="flex items-center space-x-3">
            <img
              src={token.image}
              alt={token.name}
              className="w-8 h-8 rounded-full"
              loading="lazy"
            />
            <div>
              <p className="font-medium text-white">{token.name}</p>
              <p className="text-sm text-gray-400 uppercase">
                {token.symbol}
              </p>
            </div>
          </div>
        </td>
      )}
      {columnConfig.price && (
        <td className="px-4 py-4 text-right">
          <p className="font-semibold text-white">
            {formatCurrency(token.current_price)}
          </p>
        </td>
      )}
      {columnConfig.change24h && (
        <td className="px-4 py-4 text-right">
          <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-sm font-medium ${
            token.price_change_percentage_24h >= 0
              ? 'text-green-400 bg-green-400/10'
              : 'text-red-400 bg-red-400/10'
          }`}>
            {token.price_change_percentage_24h >= 0 ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span>
              {formatPercentage(token.price_change_percentage_24h)}
            </span>
          </div>
        </td>
      )}
      {columnConfig.change7d && (
        <td className="px-4 py-4 text-right">
          <span className={`text-sm font-medium ${
            token.price_change_percentage_7d >= 0
              ? 'text-green-400'
              : 'text-red-400'
          }`}>
            {formatPercentage(token.price_change_percentage_7d)}
          </span>
        </td>
      )}
      {columnConfig.marketCap && (
        <td className="px-4 py-4 text-right">
          <p className="text-sm text-white">
            {formatMarketCap(token.market_cap)}
          </p>
        </td>
      )}
      {columnConfig.volume && (
        <td className="px-4 py-4 text-right">
          <p className="text-sm text-white">
            {formatVolume(token.total_volume)}
          </p>
        </td>
      )}
      {columnConfig.sparkline && (
        <td className="px-4 py-4 text-center">
          <div className="w-20 h-10 mx-auto">
            <SparklineChart
              data={token.sparkline_in_7d?.price || []}
              isPositive={token.price_change_percentage_7d >= 0}
            />
          </div>
        </td>
      )}
      <td className="px-4 py-4 text-center">
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={(e) => onWatchlistToggle(token, e)}
            className={`p-1 rounded transition-colors ${
              isInWatchlist(token.id)
                ? 'text-yellow-400 hover:text-yellow-300'
                : 'text-gray-400 hover:text-yellow-400'
            }`}
          >
            <Star 
              className={`w-4 h-4 ${
                isInWatchlist(token.id) ? 'fill-current' : ''
              }`} 
            />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Handle more actions
            }}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </td>
    </motion.tr>
  );
});

CryptoTableRow.displayName = 'CryptoTableRow';

export default CryptoTableRow;
