'use client';

import { useCryptoStore } from '@/store/cryptoStore';

export default function DataDebug() {
  const { 
    cryptocurrencies, 
    isLoading, 
    error, 
    lastUpdated,
    getCurrentTabData,
    activeTab 
  } = useCryptoStore();

  const currentData = getCurrentTabData();

  return (
    <div className="bg-gray-800 p-4 rounded-lg m-4">
      <h3 className="text-white font-bold mb-2">Debug Information</h3>
      <div className="text-sm text-gray-300 space-y-1">
        <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
        <p>Error: {error || 'None'}</p>
        <p>Last Updated: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'Never'}</p>
        <p>Active Tab: {activeTab}</p>
        <p>Cryptocurrencies Count: {cryptocurrencies.length}</p>
        <p>Current Tab Data Count: {currentData.length}</p>
        {cryptocurrencies.length > 0 && (
          <div>
            <p>First Coin: {cryptocurrencies[0].name} (${cryptocurrencies[0].current_price})</p>
          </div>
        )}
        {currentData.length > 0 && (
          <div>
            <p>First Current Data: {currentData[0].name} (${currentData[0].current_price})</p>
          </div>
        )}
      </div>
    </div>
  );
}
