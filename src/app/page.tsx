'use client';

import MainLayout from '@/components/layout/MainLayout';
import CryptocurrencyTable from '@/components/crypto/CryptocurrencyTable';
import MarketOverview from '@/components/market/MarketOverview';
import TrendingSection from '@/components/market/TrendingSection';
import TopMoversSection from '@/components/market/TopMoversSection';
import TokenDetail from '@/components/crypto/TokenDetail';
import DataDebug from '@/components/debug/DataDebug';
import { useCryptoStore } from '@/store/cryptoStore';

export default function Home() {
  const { selectedToken, setSelectedToken, activeTab } = useCryptoStore();

  return (
      <MainLayout>
        <div className="space-y-6">
          {/* Debug Information */}
          {/* <DataDebug /> */}

          {/* Market Overview - Always visible */}
          <MarketOverview />

          {/* Trending Section - Only show for trending tab */}
          {activeTab === 'trending' && <TrendingSection />}

          {/* Top Movers Section - Show for gainers and losers tabs */}
          {(activeTab === 'gainers' || activeTab === 'losers') && <TopMoversSection />}

          {/* Cryptocurrency Table - Always visible */}
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
