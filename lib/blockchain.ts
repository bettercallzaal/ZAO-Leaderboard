import { ethers } from 'ethers';
import { ERC20_ABI, ERC1155_ABI } from './contracts';

console.log('[Blockchain] Initializing provider and contracts...');
console.log('[Blockchain] RPC URL:', process.env.ALCHEMY_OPTIMISM_RPC);
console.log('[Blockchain] ERC20 Contract:', process.env.ERC20_ZAO_CONTRACT);
console.log('[Blockchain] ERC1155 Contract:', process.env.ERC1155_ZOR_CONTRACT);

const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_OPTIMISM_RPC);

const erc20Contract = new ethers.Contract(
  process.env.ERC20_ZAO_CONTRACT!,
  ERC20_ABI,
  provider
);

const erc1155Contract = new ethers.Contract(
  process.env.ERC1155_ZOR_CONTRACT!,
  ERC1155_ABI,
  provider
);

console.log('[Blockchain] Provider and contracts initialized');

export async function getOGRespect(address: string): Promise<number> {
  console.log(`[Blockchain] Fetching OG Respect for ${address}...`);
  try {
    const balance = await erc20Contract.balanceOf(address);
    const formatted = Number(ethers.formatEther(balance));
    console.log(`[Blockchain] OG Respect for ${address}: ${formatted} (raw: ${balance.toString()})`);
    return formatted;
  } catch (error) {
    console.error(`[Blockchain] ERROR - Failed to fetch OG Respect for ${address}:`, error);
    console.error(`[Blockchain] Error details:`, error instanceof Error ? error.message : 'Unknown error');
    return 0;
  }
}

export async function getZORRespect(address: string): Promise<number> {
  console.log(`[Blockchain] Fetching ZOR Respect for ${address} (tokenId=0)...`);
  try {
    const balance = await erc1155Contract.balanceOf(address, 0);
    const formatted = Number(ethers.formatEther(balance));
    console.log(`[Blockchain] ZOR Respect for ${address}: ${formatted} (raw: ${balance.toString()})`);
    return formatted;
  } catch (error) {
    console.error(`[Blockchain] ERROR - Failed to fetch ZOR Respect for ${address}:`, error);
    console.error(`[Blockchain] Error details:`, error instanceof Error ? error.message : 'Unknown error');
    return 0;
  }
}

export async function getRespectBalances(address: string): Promise<{
  ogRespect: number;
  zorRespect: number;
  totalRespect: number;
}> {
  console.log(`[Blockchain] Getting all balances for ${address}...`);
  const [ogRespect, zorRespect] = await Promise.all([
    getOGRespect(address),
    getZORRespect(address),
  ]);

  const total = ogRespect + zorRespect;
  console.log(`[Blockchain] Total for ${address}: ${total} (OG: ${ogRespect}, ZOR: ${zorRespect})`);

  return {
    ogRespect,
    zorRespect,
    totalRespect: total,
  };
}
