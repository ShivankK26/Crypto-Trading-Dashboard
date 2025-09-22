'use client';

import MainLayout from '@/components/layout/MainLayout';
import CryptocurrencyTable from '@/components/crypto/CryptocurrencyTable';
import MarketOverview from '@/components/market/MarketOverview';
import TokenDetail from '@/components/crypto/TokenDetail';
import { useCryptoStore } from '@/store/cryptoStore';

export default function Home() {
  const { selectedToken, setSelectedToken } = useCryptoStore();

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Market Overview */}
        <MarketOverview />
        
        {/* Cryptocurrency Table */}
        <CryptocurrencyTable />
      </div>

      {/* Token Detail Panel */}
      <TokenDetail 
        isOpen={!!selectedToken} 
        onClose={() => setSelectedToken(null)} 
      />
    </MainLayout>
  );
}
