'use client';

import { useEffect, useState } from 'react';
import LeaderboardTable from '@/components/LeaderboardTable';
import { LeaderboardEntry } from '@/types/leaderboard';

export default function Home() {
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        console.log('[Page] Fetching leaderboard data...');
        const res = await fetch('/api/leaderboard');
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const leaderboardData = await res.json();
        console.log('[Page] Received data:', leaderboardData.length, 'entries');
        setData(leaderboardData);
        setError(null);
      } catch (err) {
        console.error('[Page] Error fetching leaderboard:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            leaderboard
          </h1>
          <p className="text-gray-400 text-lg">
            ZAO Community Respect Rankings
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Tracking OG ZAO & ZOR Respect on Optimism
          </p>
        </header>

        <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-400">
              <p className="text-xl">Loading leaderboard data...</p>
              <p className="text-sm mt-2">Please check back shortly</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center text-red-400">
              <p className="text-xl">Error loading leaderboard</p>
              <p className="text-sm mt-2">{error}</p>
              <p className="text-xs mt-4 text-gray-500">Check browser console for details</p>
            </div>
          ) : data.length > 0 ? (
            <LeaderboardTable data={data} />
          ) : (
            <div className="p-12 text-center text-gray-400">
              <p className="text-xl">No data available</p>
              <p className="text-sm mt-2">Please check back shortly</p>
            </div>
          )}
        </div>

        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>Data refreshes every 5 minutes</p>
          <p className="mt-2">
            Powered by{' '}
            <a
              href="https://www.optimism.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              Optimism
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
