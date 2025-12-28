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

interface PageProps {
  searchParams: { limit?: string };
}

export default async function EmbedPage({ searchParams }: PageProps) {
  const data = await getLeaderboardData();
  const limit = searchParams.limit ? parseInt(searchParams.limit, 10) : undefined;

  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-gray-900 p-4">
      <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        {data.length > 0 ? (
          <LeaderboardTable data={data} limit={limit} />
        ) : (
          <div className="p-12 text-center text-gray-400">
            <p className="text-xl">Loading leaderboard data...</p>
          </div>
        )}
      </div>
    </main>
  );
}
