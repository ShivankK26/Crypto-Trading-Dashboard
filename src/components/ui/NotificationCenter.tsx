'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';
import { useCryptoStore } from '@/store/cryptoStore';
import { ToastState } from '@/types/ui';

export default function NotificationCenter() {
  const { toasts, removeToast } = useCryptoStore();
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Count unread notifications (toasts that are price alerts)
    const priceAlertToasts = toasts.filter(toast => 
      toast.title?.includes('Price Alert') && !toast.read
    );
    setUnreadCount(priceAlertToasts.length);
  }, [toasts]);

  const getToastIcon = (type: ToastState['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-[#00DC82]" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-[#FF3B3B]" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-[#8B5CF6]" />;
      default:
        return <Info className="w-5 h-5 text-[#3B82F6]" />;
    }
  };

  const getToastColor = (type: ToastState['type']) => {
    switch (type) {
      case 'success':
        return 'border-[#00DC82]/20 bg-[#00DC82]/5';
      case 'error':
        return 'border-[#FF3B3B]/20 bg-[#FF3B3B]/5';
      case 'warning':
        return 'border-[#8B5CF6]/20 bg-[#8B5CF6]/5';
      default:
        return 'border-[#3B82F6]/20 bg-[#3B82F6]/5';
    }
  };

  const priceAlertToasts = toasts.filter(toast => 
    toast.title?.includes('Price Alert')
  );

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-[#E4E4E7] hover:text-[#FFFFFF] transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF3B3B] text-[#FFFFFF] text-xs rounded-full flex items-center justify-center"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.div>
        )}
      </button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-80 bg-[#1C1C1F] border border-[#252528] rounded-lg shadow-xl z-50"
          >
            <div className="p-4 border-b border-[#252528]">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#FFFFFF]">Notifications</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-[#E4E4E7] hover:text-[#FFFFFF] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {priceAlertToasts.length === 0 ? (
                <div className="p-6 text-center text-[#E4E4E7]">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-[#252528]">
                  {priceAlertToasts.map((toast) => (
                    <motion.div
                      key={toast.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className={`p-4 border-l-4 ${getToastColor(toast.type)}`}
                    >
                      <div className="flex items-start space-x-3">
                        {getToastIcon(toast.type)}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-[#FFFFFF]">
                            {toast.title}
                          </h4>
                          <p className="text-sm text-[#E4E4E7] mt-1">
                            {toast.description}
                          </p>
                          <p className="text-xs text-[#E4E4E7]/70 mt-2">
                            {toast.createdAt ? new Date(toast.createdAt).toLocaleTimeString() : 'Just now'}
                          </p>
                        </div>
                        <button
                          onClick={() => removeToast(toast.id)}
                          className="p-1 text-[#E4E4E7] hover:text-[#FFFFFF] transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {priceAlertToasts.length > 0 && (
              <div className="p-3 border-t border-[#252528]">
                <button
                  onClick={() => {
                    priceAlertToasts.forEach(toast => removeToast(toast.id));
                  }}
                  className="w-full text-sm text-[#E4E4E7] hover:text-[#FFFFFF] transition-colors"
                >
                  Clear all notifications
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
