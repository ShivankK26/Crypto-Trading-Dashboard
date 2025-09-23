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
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getToastColor = (type: ToastState['type']) => {
    switch (type) {
      case 'success':
        return 'border-green-500/20 bg-green-500/5';
      case 'error':
        return 'border-red-500/20 bg-red-500/5';
      case 'warning':
        return 'border-yellow-500/20 bg-yellow-500/5';
      default:
        return 'border-blue-500/20 bg-blue-500/5';
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
        className="relative p-2 text-gray-400 hover:text-white transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
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
            className="absolute right-0 top-full mt-2 w-80 bg-gray-900 border border-gray-800 rounded-lg shadow-xl z-50"
          >
            <div className="p-4 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Notifications</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {priceAlertToasts.length === 0 ? (
                <div className="p-6 text-center text-gray-400">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-800">
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
                          <h4 className="text-sm font-medium text-white">
                            {toast.title}
                          </h4>
                          <p className="text-sm text-gray-400 mt-1">
                            {toast.description}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(toast.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                        <button
                          onClick={() => removeToast(toast.id)}
                          className="p-1 text-gray-400 hover:text-white transition-colors"
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
              <div className="p-3 border-t border-gray-800">
                <button
                  onClick={() => {
                    priceAlertToasts.forEach(toast => removeToast(toast.id));
                  }}
                  className="w-full text-sm text-gray-400 hover:text-white transition-colors"
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
