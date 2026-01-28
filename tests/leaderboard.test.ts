// Basic test for leaderboard logic
// To run: npx tsx tests/leaderboard.test.ts

import { LeaderboardEntry } from '../types/leaderboard';

function rankLeaderboard(data: Omit<LeaderboardEntry, 'rank'>[]): LeaderboardEntry[] {
    const sorted = [...data].sort((a, b) => b.totalRespect - a.totalRespect);
    return sorted.map((entry, index) => ({
        ...entry,
        rank: index + 1,
    }));
}

function testRanking() {
    console.log('Running test: Ranking Logic');

    const mockData = [
        { name: 'Alice', address: '0x1', ogRespect: 100, zorRespect: 50, totalRespect: 150 },
        { name: 'Bob', address: '0x2', ogRespect: 200, zorRespect: 0, totalRespect: 200 },
        { name: 'Charlie', address: '0x3', ogRespect: 50, zorRespect: 50, totalRespect: 100 },
    ];

    const ranked = rankLeaderboard(mockData);

    if (ranked[0].name !== 'Bob') throw new Error('Bob should be rank 1');
    if (ranked[1].name !== 'Alice') throw new Error('Alice should be rank 2');
    if (ranked[2].name !== 'Charlie') throw new Error('Charlie should be rank 3');

    if (ranked[0].rank !== 1) throw new Error('Rank 1 is incorrect');
    if (ranked[1].rank !== 2) throw new Error('Rank 2 is incorrect');
    if (ranked[2].rank !== 3) throw new Error('Rank 3 is incorrect');

    console.log('✅ Ranking Logic test passed!');
}

try {
    testRanking();
    console.log('\nAll tests passed successfully!');
} catch (error) {
    console.error('\n❌ Test failed:');
    console.error(error);
    process.exit(1);
}
