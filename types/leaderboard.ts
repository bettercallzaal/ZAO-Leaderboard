export interface LeaderboardEntry {
  rank: number;
  name: string;
  address: string;
  ogRespect: number;
  zorRespect: number;
  totalRespect: number;
  firstTokenDate?: string; // ISO string or formatted date
}

export interface AirtableRecord {
  name: string;
  address: string;
}

export interface CachedLeaderboard {
  data: LeaderboardEntry[];
  lastUpdated: number;
}
