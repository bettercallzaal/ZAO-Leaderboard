import { NextResponse } from 'next/server';
import { fetchAirtableRecords } from '@/lib/airtable';
import { getRespectBalances } from '@/lib/blockchain';
import { LeaderboardEntry } from '@/types/leaderboard';

export const revalidate = 300;

export async function GET() {
  console.log('[API] Starting leaderboard fetch...');
  try {
    console.log('[API] Fetching Airtable records...');
    const airtableRecords = await fetchAirtableRecords();
    console.log(`[API] Fetched ${airtableRecords.length} records from Airtable:`, airtableRecords);

    console.log('[API] Fetching blockchain balances for each address...');
    const leaderboardPromises = airtableRecords.map(async (record) => {
      console.log(`[API] Fetching balances for ${record.name} (${record.address})...`);
      const balances = await getRespectBalances(record.address);
      console.log(`[API] Balances for ${record.name}:`, balances);
      
      return {
        name: record.name,
        address: record.address,
        ogRespect: balances.ogRespect,
        zorRespect: balances.zorRespect,
        totalRespect: balances.totalRespect,
        rank: 0,
      };
    });

    console.log('[API] Waiting for all balance queries to complete...');
    const leaderboardData = await Promise.all(leaderboardPromises);
    console.log('[API] All balances fetched. Sorting by total respect...');

    leaderboardData.sort((a, b) => b.totalRespect - a.totalRespect);

    const rankedLeaderboard: LeaderboardEntry[] = leaderboardData.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
    console.log('[API] Leaderboard ranked. Returning data:', rankedLeaderboard);

    return NextResponse.json(rankedLeaderboard, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('[API] ERROR - Leaderboard API failed:', error);
    console.error('[API] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard data' },
      { status: 500 }
    );
  }
}
