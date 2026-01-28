import fs from 'fs';
import path from 'path';
import { CachedLeaderboard } from '@/types/leaderboard';

const CACHE_FILE = path.join(process.cwd(), 'lib/leaderboard-cache.json');

export function saveLeaderboardToCache(data: CachedLeaderboard): void {
    try {
        const dir = path.dirname(CACHE_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2), 'utf-8');
        console.log('[Storage] Saved leaderboard to cache');
    } catch (error) {
        console.error('[Storage] Error saving to cache:', error);
    }
}

export function loadLeaderboardFromCache(): CachedLeaderboard | null {
    try {
        if (!fs.existsSync(CACHE_FILE)) {
            console.log('[Storage] Cache file not found');
            return null;
        }
        const content = fs.readFileSync(CACHE_FILE, 'utf-8');
        const data = JSON.parse(content) as CachedLeaderboard;
        console.log('[Storage] Loaded leaderboard from cache');
        return data;
    } catch (error) {
        console.error('[Storage] Error loading from cache:', error);
        return null;
    }
}
