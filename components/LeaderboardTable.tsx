'use client';

import { LeaderboardEntry } from '@/types/leaderboard';

interface LeaderboardTableProps {
  data: LeaderboardEntry[];
  limit?: number;
}

export default function LeaderboardTable({ data, limit }: LeaderboardTableProps) {
  const displayData = limit ? data.slice(0, limit) : data;

  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const shortenAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getRowClass = (rank: number): string => {
    if (rank === 1) return 'bg-yellow-500/10 hover:bg-yellow-500/20';
    if (rank === 2) return 'bg-gray-400/10 hover:bg-gray-400/20';
    if (rank === 3) return 'bg-orange-600/10 hover:bg-orange-600/20';
    return 'hover:bg-white/5';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="sticky top-0 bg-black/90 backdrop-blur-sm z-10">
          <tr className="border-b border-white/10">
            <th className="px-4 py-4 text-left text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Rank
            </th>
            <th className="px-4 py-4 text-left text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Name
            </th>
            <th className="px-4 py-4 text-right text-sm font-semibold text-gray-400 uppercase tracking-wider">
              OG ZAO
            </th>
            <th className="px-4 py-4 text-right text-sm font-semibold text-gray-400 uppercase tracking-wider">
              ZOR
            </th>
            <th className="px-4 py-4 text-right text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Total Respect
            </th>
            <th className="px-4 py-4 text-left text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Address
            </th>
          </tr>
        </thead>
        <tbody>
          {displayData.map((entry) => (
            <tr
              key={entry.address}
              className={`border-b border-white/5 transition-colors ${getRowClass(entry.rank)}`}
            >
              <td className="px-4 py-4 text-sm font-medium">
                <span className={entry.rank <= 3 ? 'text-lg font-bold' : ''}>
                  {entry.rank}
                </span>
              </td>
              <td className="px-4 py-4 text-sm font-medium">{entry.name}</td>
              <td className="px-4 py-4 text-sm text-right text-gray-300">
                {formatNumber(entry.ogRespect)}
              </td>
              <td className="px-4 py-4 text-sm text-right text-gray-300">
                {formatNumber(entry.zorRespect)}
              </td>
              <td className="px-4 py-4 text-sm text-right">
                <span className="font-bold text-lg text-white">
                  {formatNumber(entry.totalRespect)}
                </span>
              </td>
              <td className="px-4 py-4 text-sm">
                <a
                  href={`https://optimistic.etherscan.io/address/${entry.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors font-mono text-xs"
                >
                  {shortenAddress(entry.address)}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
