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

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/leaderboard');
        if (!res.ok) throw new Error('Failed to fetch');
        const leaderboardData = await res.json();
        setData(leaderboardData);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
      {data.length > 0 ? (
        <LeaderboardTable data={data} limit={limit} />
      ) : (
        <div className="p-12 text-center text-gray-400">
          <p className="text-xl">Loading leaderboard data...</p>
        </div>
      )}
    </div>
  );
}

export default function EmbedPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-gray-900 p-4">
      <Suspense fallback={
        <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
          <div className="p-12 text-center text-gray-400">
            <p className="text-xl">Loading...</p>
          </div>
        </div>
      }>
        <EmbedContent />
      </Suspense>
    </main>
  );
}
