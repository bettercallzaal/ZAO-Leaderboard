import fs from 'fs';
import path from 'path';
import { CachedLeaderboard } from '@/types/leaderboard';

const isVercel = process.env.VERCEL === '1';
const CACHE_FILE = isVercel
    ? path.join('/tmp', 'leaderboard-cache.json')
    : path.join(process.cwd(), 'lib/leaderboard-cache.json');

export function saveLeaderboardToCache(data: CachedLeaderboard): void {
    try {
        const dir = path.dirname(CACHE_FILE);
        if (!fs.existsSync(dir)) {
            try {
                fs.mkdirSync(dir, { recursive: true });
            } catch (e) {
                console.warn('[Storage] Could not create cache directory:', e);
            }
        }
        fs.writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2), 'utf-8');
        console.log('[Storage] Saved leaderboard to cache at:', CACHE_FILE);
    } catch (error) {
        console.error('[Storage] Error saving to cache:', error);
    }
}

export function loadLeaderboardFromCache(): CachedLeaderboard | null {
    try {
        if (!fs.existsSync(CACHE_FILE)) {
            console.log('[Storage] Cache file not found at:', CACHE_FILE);
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
