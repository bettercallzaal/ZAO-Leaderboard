'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import LeaderboardTable from '@/components/LeaderboardTable';
import { LeaderboardEntry } from '@/types/leaderboard';

function EmbedContent() {
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : undefined;
  const showSearch = searchParams.get('search') !== 'false';
  const highlightAddress = searchParams.get('highlight') || undefined;

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/leaderboard');
        if (!res.ok) throw new Error('Failed to fetch');
        const result = await res.json();
        setData(result.data);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      {loading ? (
        <div className="p-12 text-center text-gray-400">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-white/5 rounded-xl w-full"></div>
            <div className="space-y-3">
              <div className="h-16 bg-white/5 rounded-2xl w-full"></div>
              <div className="h-16 bg-white/10 rounded-2xl w-full"></div>
              <div className="h-16 bg-white/5 rounded-2xl w-full"></div>
            </div>
          </div>
          <p className="text-sm font-medium tracking-wide text-gray-500 uppercase mt-8 animate-pulse">
            Syncing Ledger...
          </p>
        </div>
      ) : data.length > 0 ? (
        <LeaderboardTable
          data={data}
          limit={limit}
          showSearch={showSearch}
          highlightAddress={highlightAddress}
        />
      ) : (
        <div className="p-20 text-center">
          <div className="text-4xl mb-4">📭</div>
          <p className="text-xl text-gray-400 font-medium">No active records found</p>
          <p className="text-sm text-gray-600 mt-2">Check the airtable registry or refresh shortly.</p>
        </div>
      )}
    </>
  );
}

export default function EmbedPage() {
  return (
    <main className="min-h-screen bg-[#050505] p-2 sm:p-6 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-6xl mx-auto">
        <Suspense fallback={
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden">
            <div className="p-12 text-center text-gray-400">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-12 bg-white/10 rounded-full mb-4"></div>
                <div className="h-4 w-48 bg-white/10 rounded mb-2"></div>
                <div className="h-3 w-32 bg-white/10 rounded"></div>
              </div>
            </div>
          </div>
        }>
          <div className="relative group">
            {/* Decorative background glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>

            <div className="relative bg-[#0a0a0a] backdrop-blur-md rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden transition-all duration-500">
              <EmbedContent />
            </div>
          </div>
        </Suspense>
      </div>
    </main>
  );
}
