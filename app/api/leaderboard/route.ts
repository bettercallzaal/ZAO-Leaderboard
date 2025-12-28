import { NextResponse } from 'next/server';
import { fetchAirtableRecords } from '@/lib/airtable';
import { getRespectBalances } from '@/lib/blockchain';
import { LeaderboardEntry } from '@/types/leaderboard';

export const revalidate = 300;

export async function GET() {
  try {
    const airtableRecords = await fetchAirtableRecords();

    const leaderboardPromises = airtableRecords.map(async (record) => {
      const balances = await getRespectBalances(record.address);
      
      return {
        name: record.name,
        address: record.address,
        ogRespect: balances.ogRespect,
        zorRespect: balances.zorRespect,
        totalRespect: balances.totalRespect,
        rank: 0,
      };
    });

    const leaderboardData = await Promise.all(leaderboardPromises);

    leaderboardData.sort((a, b) => b.totalRespect - a.totalRespect);

    const rankedLeaderboard: LeaderboardEntry[] = leaderboardData.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

    return NextResponse.json(rankedLeaderboard, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Leaderboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard data' },
      { status: 500 }
    );
  }
}
