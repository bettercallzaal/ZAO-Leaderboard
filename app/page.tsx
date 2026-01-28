'use client';

import { useEffect, useState } from 'react';
import LeaderboardTable from '@/components/LeaderboardTable';
import { LeaderboardEntry } from '@/types/leaderboard';

export default function Home() {
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchData(isRefresh = false) {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const res = await fetch('/api/leaderboard');

      if (!res.ok) {
        let errorMsg = `HTTP error! status: ${res.status}`;
        try {
          const errorData = await res.json();
          if (errorData.details) errorMsg = `${errorData.error}: ${errorData.details}`;
          else if (errorData.error) errorMsg = errorData.error;
        } catch (e) {
          // Fallback to status text
        }
        throw new Error(errorMsg);
      }

      const result = await res.json();
      setData(result.data);
      setLastUpdated(result.lastUpdated);
      setError(null);
    } catch (err) {
      console.error('[Page] Error fetching leaderboard:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <header className="mb-12 text-center relative">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            leaderboard
          </h1>
          <p className="text-gray-400 text-lg">
            ZAO Community Respect Rankings
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Tracking OG ZAO & ZOR Respect on Optimism
          </p>

          <div className="mt-8 flex flex-col items-center gap-4">
            <button
              onClick={() => fetchData(true)}
              disabled={loading || refreshing}
              className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-medium transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <span className={refreshing ? 'animate-spin' : ''}>↻</span>
              {refreshing ? 'Refreshing...' : 'Refresh Data'}
            </button>
            {lastUpdated && (
              <p className="text-gray-500 text-xs">
                Last updated: {new Date(lastUpdated).toLocaleString()}
              </p>
            )}
          </div>
        </header>

        <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl overflow-hidden min-h-[400px]">
          {loading ? (
            <div className="p-12 text-center text-gray-400">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-white/5 rounded w-full"></div>
                <div className="h-12 bg-white/5 rounded w-full"></div>
                <div className="h-12 bg-white/5 rounded w-full"></div>
                <div className="h-12 bg-white/5 rounded w-full"></div>
              </div>
              <p className="text-xl mt-8">Loading leaderboard data...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center text-red-400">
              <p className="text-xl">Error loading leaderboard</p>
              <p className="text-sm mt-2">{error}</p>
              <button
                onClick={() => fetchData()}
                className="mt-6 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : data.length > 0 ? (
            <LeaderboardTable data={data} />
          ) : (
            <div className="p-12 text-center text-gray-400">
              <p className="text-xl">No data available</p>
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
