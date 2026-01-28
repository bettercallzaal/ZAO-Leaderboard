import { NextResponse } from 'next/server';
import { fetchAirtableRecords } from '@/lib/airtable';
import { getBatchBalances } from '@/lib/blockchain';
import { LeaderboardEntry } from '@/types/leaderboard';
import { loadLeaderboardFromCache, saveLeaderboardToCache } from '@/lib/storage';

export const revalidate = 300;

export async function GET() {
  console.log('[API] Starting leaderboard fetch...');
  const cached = loadLeaderboardFromCache();

  try {
    const airtableRecords = await fetchAirtableRecords();
    console.log(`[API] Fetched ${airtableRecords.length} records from Airtable`);

    const addresses = airtableRecords.map(r => r.address);
    // Pass cached data to preserve firstTokenDate
    const balances = await getBatchBalances(addresses, cached?.data);

    const leaderboardData: LeaderboardEntry[] = airtableRecords.map((record) => {
      const balance = balances.find(b => b.address.toLowerCase() === record.address.toLowerCase());
      return {
        name: record.name,
        address: record.address,
        ogRespect: balance?.ogRespect || 0,
        zorRespect: balance?.zorRespect || 0,
        totalRespect: balance?.totalRespect || 0,
        firstTokenDate: balance?.firstTokenDate,
        rank: 0,
      };
    });

    leaderboardData.sort((a, b) => b.totalRespect - a.totalRespect);

    const rankedLeaderboard: LeaderboardEntry[] = leaderboardData.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

    const result = {
      data: rankedLeaderboard,
      lastUpdated: Date.now()
    };

    // Save to cache for future runs/fallbacks
    saveLeaderboardToCache(result);

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('[API] CRITICAL ERROR:', error);
    if (error instanceof Error) {
      console.error('[API] Stack trace:', error.stack);
    }

    if (cached) {
      console.log('[API] Returning cached data due to failure');
      return NextResponse.json(cached, {
        headers: {
          'X-Cache-Fallback': 'true',
          'Cache-Control': 'no-cache'
        }
      });
    }

    return NextResponse.json(
      {
        error: 'Failed to fetch leaderboard data',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
