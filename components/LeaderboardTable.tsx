'use client';

import { useState, useMemo } from 'react';
import { LeaderboardEntry } from '@/types/leaderboard';

interface LeaderboardTableProps {
  data: LeaderboardEntry[];
  limit?: number;
  showSearch?: boolean;
  highlightAddress?: string;
}

type SortField = 'rank' | 'name' | 'ogRespect' | 'zorRespect' | 'totalRespect';
type SortDirection = 'asc' | 'desc';

export default function LeaderboardTable({ 
  data, 
  limit, 
  showSearch = true,
  highlightAddress 
}: LeaderboardTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection(field === 'rank' ? 'asc' : 'desc');
    }
  };

  const displayData = useMemo(() => {
    let filtered = data;

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = data.filter(
        (entry) =>
          entry.name.toLowerCase().includes(search) ||
          entry.address.toLowerCase().includes(search)
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      let aVal: string | number = a[sortField];
      let bVal: string | number = b[sortField];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = (bVal as string).toLowerCase();
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return limit ? sorted.slice(0, limit) : sorted;
  }, [data, searchTerm, sortField, sortDirection, limit]);

  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const shortenAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getRowClass = (rank: number, address: string): string => {
    if (highlightAddress && address.toLowerCase() === highlightAddress.toLowerCase()) {
      return 'bg-blue-500/20 hover:bg-blue-500/30 ring-2 ring-blue-500/50';
    }
    if (rank === 1) return 'bg-yellow-500/10 hover:bg-yellow-500/20';
    if (rank === 2) return 'bg-gray-400/10 hover:bg-gray-400/20';
    if (rank === 3) return 'bg-orange-600/10 hover:bg-orange-600/20';
    return 'hover:bg-white/5';
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <span className="text-gray-600 ml-1">⇅</span>;
    }
    return (
      <span className="text-white ml-1">
        {sortDirection === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  return (
    <div>
      {showSearch && (
        <div className="p-4 border-b border-white/10">
          <input
            type="text"
            placeholder="Search by name or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
          />
          {searchTerm && (
            <p className="mt-2 text-sm text-gray-400">
              Found {displayData.length} result{displayData.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-black/90 backdrop-blur-sm z-10">
            <tr className="border-b border-white/10">
              <th 
                onClick={() => handleSort('rank')}
                className="px-4 py-4 text-left text-sm font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center">
                  Rank
                  <SortIcon field="rank" />
                </div>
              </th>
              <th 
                onClick={() => handleSort('name')}
                className="px-4 py-4 text-left text-sm font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center">
                  Name
                  <SortIcon field="name" />
                </div>
              </th>
              <th 
                onClick={() => handleSort('ogRespect')}
                className="px-4 py-4 text-right text-sm font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center justify-end">
                  OG ZAO
                  <SortIcon field="ogRespect" />
                </div>
              </th>
              <th 
                onClick={() => handleSort('zorRespect')}
                className="px-4 py-4 text-right text-sm font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center justify-end">
                  ZOR
                  <SortIcon field="zorRespect" />
                </div>
              </th>
              <th 
                onClick={() => handleSort('totalRespect')}
                className="px-4 py-4 text-right text-sm font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center justify-end">
                  Total Respect
                  <SortIcon field="totalRespect" />
                </div>
              </th>
              <th className="px-4 py-4 text-left text-sm font-semibold text-gray-400 uppercase tracking-wider">
                Address
              </th>
            </tr>
          </thead>
          <tbody>
            {displayData.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                  No results found
                </td>
              </tr>
            ) : (
              displayData.map((entry) => (
                <tr
                  key={entry.address}
                  className={`border-b border-white/5 transition-colors ${getRowClass(entry.rank, entry.address)}`}
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
