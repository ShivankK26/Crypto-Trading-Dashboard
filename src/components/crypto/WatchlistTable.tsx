'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronUp, 
  ChevronDown, 
  GripVertical,
  Download,
  Bell,
  BellOff,
  Plus,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { useCryptoStore } from '@/store/cryptoStore';
import { SortField } from '@/types/ui';
import { WatchlistItem, PriceAlert, Cryptocurrency } from '@/types/crypto';
import { formatCurrency, formatPercentage } from '@/lib/utils';

interface WatchlistTableProps {
  onTokenClick: (token: WatchlistItem) => void;
}

export default function WatchlistTable({ onTokenClick }: WatchlistTableProps) {
  const {
    watchlist,
    sortConfig,
    setSortConfig,
    reorderWatchlist,
    removeFromWatchlist,
    addPriceAlert,
    removePriceAlert,
    exportWatchlistToCSV,
    setModalState,
    addToast,
  } = useCryptoStore();

  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [showAlertModal, setShowAlertModal] = useState<{ tokenId: string; tokenSymbol: string } | null>(null);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);

  const sortedWatchlist = useMemo(() => {
    if (!sortConfig.field) {
      return watchlist.sort((a, b) => a.order - b.order);
    }

    const sorted = [...watchlist].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortConfig.field) {
        case 'market_cap_rank':
          aValue = 0; // Watchlist items don't have market cap rank
          bValue = 0;
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'current_price':
          aValue = a.current_price;
          bValue = b.current_price;
          break;
        case 'price_change_percentage_24h':
          aValue = a.price_change_percentage_24h;
          bValue = b.price_change_percentage_24h;
          break;
        default:
          aValue = 0;
          bValue = 0;
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [watchlist, sortConfig]);

  const handleSort = (field: SortField) => {
    setSortConfig({
      field,
      direction: sortConfig.field === field && sortConfig.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', itemId);
  };

  const handleDragOver = (e: React.DragEvent, itemId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverItem(itemId);
  };

  const handleDragLeave = () => {
    setDragOverItem(null);
  };

  const handleDrop = (e: React.DragEvent, targetItemId: string) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem === targetItemId) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    const draggedIndex = sortedWatchlist.findIndex(item => item.id === draggedItem);
    const targetIndex = sortedWatchlist.findIndex(item => item.id === targetItemId);

    if (draggedIndex !== -1 && targetIndex !== -1) {
      reorderWatchlist(draggedIndex, targetIndex);
      
      // Show success toast
      addToast({
        type: 'success',
        title: 'Watchlist Reordered',
        description: 'Items have been successfully reordered.',
        duration: 3000,
      });
    }

    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleAddAlert = (tokenId: string, tokenSymbol: string) => {
    setShowAlertModal({ tokenId, tokenSymbol });
  };

  const handleCreateAlert = (targetPrice: number, condition: 'above' | 'below') => {
    if (showAlertModal) {
      addPriceAlert(showAlertModal.tokenId, targetPrice, condition);
      setShowAlertModal(null);
    }
  };

  const getAlertStatus = (alerts: PriceAlert[] | undefined, currentPrice: number) => {
    if (!alerts || !Array.isArray(alerts)) {
      return { type: 'none', count: 0 };
    }
    
    const activeAlerts = alerts.filter(alert => alert.is_active && !alert.is_triggered);
    const triggeredAlerts = alerts.filter(alert => alert.is_triggered);
    
    if (triggeredAlerts.length > 0) {
      return { type: 'triggered', count: triggeredAlerts.length };
    }
    
    if (activeAlerts.length > 0) {
      const hasTriggered = activeAlerts.some(alert => {
        if (alert.condition === 'above' && currentPrice >= alert.target_price) {
          return true;
        }
        if (alert.condition === 'below' && currentPrice <= alert.target_price) {
          return true;
        }
        return false;
      });
      
      if (hasTriggered) {
        return { type: 'triggered', count: activeAlerts.length };
      }
      
      return { type: 'active', count: activeAlerts.length };
    }
    
    return { type: 'none', count: 0 };
  };

  if (watchlist.length === 0) {
    return (
        <div className="bg-[#1C1C1F] rounded-lg border border-[#252528]">
          <div className="p-8 text-center">
            <div className="text-[#E4E4E7] text-lg mb-2">No items in watchlist</div>
            <div className="text-[#E4E4E7]/70 text-sm">Add cryptocurrencies to your watchlist to track their prices</div>
          </div>
        </div>
    );
  }

  return (
    <div className="bg-[#1C1C1F] rounded-lg border border-[#252528]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#252528]">
        <div className="flex items-center space-x-3">
          <h2 className="text-lg font-semibold text-[#FFFFFF]">Watchlist</h2>
          <span className="px-2 py-1 text-xs bg-[#3B82F6] text-[#FFFFFF] rounded-full">
            {watchlist.length} items
          </span>
          <span className="text-xs text-[#E4E4E7]">
            Drag items to reorder
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={exportWatchlistToCSV}
            className="flex items-center space-x-2 px-3 py-2 text-sm bg-[#3B82F6] text-[#FFFFFF] rounded-lg hover:bg-[#2563EB] transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="divide-y divide-[#252528]">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 p-4 text-sm font-medium text-[#E4E4E7] bg-[#252528]/50">
                <div className="col-span-1"></div>
                <div className="col-span-1"></div>
                <div className="col-span-3">
                    <button
                      onClick={() => handleSort('name')}
                      className="flex items-center space-x-1 hover:text-[#FFFFFF] transition-colors"
                    >
                      <span>Name</span>
                      {sortConfig.field === 'name' && (
                        sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <div className="col-span-2">
                    <button
                      onClick={() => handleSort('current_price')}
                      className="flex items-center space-x-1 hover:text-[#FFFFFF] transition-colors"
                    >
                      <span>Price</span>
                      {sortConfig.field === 'current_price' && (
                        sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <div className="col-span-2">
                    <button
                      onClick={() => handleSort('price_change_percentage_24h')}
                      className="flex items-center space-x-1 hover:text-[#FFFFFF] transition-colors"
                    >
                      <span>24h Change</span>
                      {sortConfig.field === 'price_change_percentage_24h' && (
                        sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                </div>
                <div className="col-span-2">Alerts</div>
                <div className="col-span-1">Actions</div>
              </div>

              {/* Table Rows */}
              {sortedWatchlist.map((item, index) => {
                const alertStatus = getAlertStatus(item.price_alerts, item.current_price);
                const isDragging = draggedItem === item.id;
                const isDragOver = dragOverItem === item.id;
                
                return (
                  <motion.div
                    key={item.id}
                    className={`grid grid-cols-12 gap-4 p-4 text-sm transition-all duration-200 cursor-move ${
                      isDragging 
                        ? 'bg-[#252528] opacity-50 scale-105 shadow-lg' 
                        : isDragOver 
                          ? 'bg-[#3B82F6]/20 border-t-2 border-[#3B82F6] transform scale-102' 
                          : 'hover:bg-[#252528]/50'
                    }`}
                    onMouseEnter={() => setHoveredRow(item.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                        {/* Drag Handle */}
                        <div 
                          className="col-span-1 flex items-center justify-center text-[#E4E4E7] hover:text-[#FFFFFF] cursor-grab transition-colors"
                          draggable
                          onDragStart={(e: React.DragEvent<HTMLDivElement>) => handleDragStart(e, item.id)}
                          onDragOver={(e: React.DragEvent<HTMLDivElement>) => handleDragOver(e, item.id)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e: React.DragEvent<HTMLDivElement>) => handleDrop(e, item.id)}
                        >
                          <GripVertical className="w-4 h-4 hover:scale-110 transition-transform" />
                        </div>

                        {/* Alert Indicator */}
                        <div className="col-span-1 flex items-center justify-center">
                          {alertStatus.type === 'triggered' && (
                            <div className="w-2 h-2 bg-[#FF3B3B] rounded-full animate-pulse" title="Alert Triggered" />
                          )}
                          {alertStatus.type === 'active' && (
                            <div className="w-2 h-2 bg-[#8B5CF6] rounded-full" title="Active Alert" />
                          )}
                        </div>

                        {/* Token Info */}
                        <div className="col-span-3 flex items-center space-x-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-8 h-8 rounded-full"
                            width={32}
                            height={32}
                          />
                            <div>
                              <div className="font-medium text-[#FFFFFF]">{item.name}</div>
                              <div className="text-[#E4E4E7] text-xs">{item.symbol.toUpperCase()}</div>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="col-span-2 flex items-center">
                          <span className="text-[#FFFFFF] font-medium">
                            {formatCurrency(item.current_price)}
                          </span>
                        </div>

                        {/* 24h Change */}
                        <div className="col-span-2 flex items-center">
                          <span className={`font-medium ${
                            item.price_change_percentage_24h >= 0 ? 'text-[#00DC82]' : 'text-[#FF3B3B]'
                          }`}>
                            {formatPercentage(item.price_change_percentage_24h)}
                          </span>
                        </div>

                        {/* Alerts */}
                        <div className="col-span-2 flex items-center space-x-2">
                          {alertStatus.count > 0 && (
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              alertStatus.type === 'triggered' 
                                ? 'bg-[#FF3B3B]/20 text-[#FF3B3B]' 
                                : 'bg-[#8B5CF6]/20 text-[#8B5CF6]'
                            }`}>
                              {alertStatus.count} alert{alertStatus.count > 1 ? 's' : ''}
                            </span>
                          )}
                          <button
                            onClick={() => handleAddAlert(item.id, item.symbol)}
                            className="p-1 text-[#E4E4E7] hover:text-[#3B82F6] transition-colors"
                            title="Add Price Alert"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Actions */}
                        <div className="col-span-1 flex items-center space-x-2">
                          <button
                            onClick={() => onTokenClick(item)}
                            className="p-1 text-[#E4E4E7] hover:text-[#FFFFFF] transition-colors"
                            title="View Details"
                          >
                            <AlertTriangle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeFromWatchlist(item.id)}
                            className="p-1 text-[#E4E4E7] hover:text-[#FF3B3B] transition-colors"
                            title="Remove from Watchlist"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                  </motion.div>
                );
              })}
      </div>

      {/* Price Alert Modal */}
      {showAlertModal && (
        <PriceAlertModal
          tokenSymbol={showAlertModal.tokenSymbol}
          onClose={() => setShowAlertModal(null)}
          onCreate={handleCreateAlert}
        />
      )}
    </div>
  );
}

// Price Alert Modal Component
interface PriceAlertModalProps {
  tokenSymbol: string;
  onClose: () => void;
  onCreate: (targetPrice: number, condition: 'above' | 'below') => void;
}

function PriceAlertModal({ tokenSymbol, onClose, onCreate }: PriceAlertModalProps) {
  const [targetPrice, setTargetPrice] = useState('');
  const [condition, setCondition] = useState<'above' | 'below'>('above');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(targetPrice);
    if (price > 0) {
      onCreate(price, condition);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0A0A0B]/50 flex items-center justify-center z-50">
      <div className="bg-[#1C1C1F] rounded-lg p-6 w-96 border border-[#252528]">
        <h3 className="text-lg font-semibold text-[#FFFFFF] mb-4">
          Add Price Alert for {tokenSymbol.toUpperCase()}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#E4E4E7] mb-2">
              Target Price
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              className="w-full px-3 py-2 bg-[#252528] border border-[#252528] rounded-lg text-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              placeholder="Enter target price"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#E4E4E7] mb-2">
              Condition
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="above"
                  checked={condition === 'above'}
                  onChange={(e) => setCondition(e.target.value as 'above' | 'below')}
                  className="mr-2"
                />
                <span className="text-[#FFFFFF]">Above</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="below"
                  checked={condition === 'below'}
                  onChange={(e) => setCondition(e.target.value as 'above' | 'below')}
                  className="mr-2"
                />
                <span className="text-[#FFFFFF]">Below</span>
              </label>
            </div>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[#3B82F6] text-[#FFFFFF] rounded-lg hover:bg-[#2563EB] transition-colors"
            >
              Create Alert
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-[#252528] text-[#FFFFFF] rounded-lg hover:bg-[#1C1C1F] transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
