'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
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
}

const CryptoTableRow = memo<CryptoTableRowProps>(({
  token,
  index,
  isHovered,
  onHover,
  onClick,
  onWatchlistToggle,
  isInWatchlist,
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
      {/* Rank */}
      <td className="px-4 py-4 text-sm text-gray-400">
        {token.market_cap_rank || '-'}
      </td>
      
      {/* Coin Name and Symbol */}
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
      
      {/* Price */}
      <td className="px-4 py-4 text-right">
        <p className="font-semibold text-white">
          {formatCurrency(token.current_price)}
        </p>
      </td>
      
      {/* 1h Change */}
      <td className="px-4 py-4 text-right">
        <span className={`text-sm font-medium ${
          (token.price_change_percentage_1h_in_currency || 0) >= 0
            ? 'text-green-400'
            : 'text-red-400'
        }`}>
          {(token.price_change_percentage_1h_in_currency || 0) >= 0 ? '▲' : '▼'}
          {formatPercentage(token.price_change_percentage_1h_in_currency || 0)}
        </span>
      </td>
      
      {/* 24h Change */}
      <td className="px-4 py-4 text-right">
        <span className={`text-sm font-medium ${
          token.price_change_percentage_24h >= 0
            ? 'text-green-400'
            : 'text-red-400'
        }`}>
          {token.price_change_percentage_24h >= 0 ? '▲' : '▼'}
          {formatPercentage(token.price_change_percentage_24h)}
        </span>
      </td>
      
      {/* 7d Change */}
      <td className="px-4 py-4 text-right">
        <span className={`text-sm font-medium ${
          (token.price_change_percentage_7d_in_currency || token.price_change_percentage_7d || 0) >= 0
            ? 'text-green-400'
            : 'text-red-400'
        }`}>
          {(token.price_change_percentage_7d_in_currency || token.price_change_percentage_7d || 0) >= 0 ? '▲' : '▼'}
          {formatPercentage(token.price_change_percentage_7d_in_currency || token.price_change_percentage_7d || 0)}
        </span>
      </td>
      
      {/* 24h Volume */}
      <td className="px-4 py-4 text-right">
        <p className="text-sm text-white">
          {formatVolume(token.total_volume)}
        </p>
      </td>
      
      {/* Market Cap */}
      <td className="px-4 py-4 text-right">
        <p className="text-sm text-white">
          {formatMarketCap(token.market_cap)}
        </p>
      </td>
      
      {/* 7d Chart */}
      <td className="px-4 py-4 text-center">
        <div className="w-20 h-10 mx-auto">
          <SparklineChart
            data={token.sparkline_in_7d?.price || []}
            isPositive={(token.price_change_percentage_7d_in_currency || token.price_change_percentage_7d || 0) >= 0}
          />
        </div>
      </td>
    </motion.tr>
  );
});

CryptoTableRow.displayName = 'CryptoTableRow';

export default CryptoTableRow;