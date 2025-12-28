import LeaderboardTable from '@/components/LeaderboardTable';
import { LeaderboardEntry } from '@/types/leaderboard';

async function getLeaderboardData(): Promise<LeaderboardEntry[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  try {
    const res = await fetch(`${baseUrl}/api/leaderboard`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch leaderboard data');
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
}

export default async function Home() {
  const data = await getLeaderboardData();

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
          {data.length > 0 ? (
            <LeaderboardTable data={data} />
          ) : (
            <div className="p-12 text-center text-gray-400">
              <p className="text-xl">Loading leaderboard data...</p>
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
