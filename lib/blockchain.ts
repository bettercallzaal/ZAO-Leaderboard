import { ethers } from 'ethers';
import { ERC20_ABI, ERC1155_ABI, MULTICALL_ABI, MULTICALL_ADDRESS } from './contracts';

console.log('[Blockchain] Initializing provider and contracts...');
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

const multicallContract = new ethers.Contract(
  MULTICALL_ADDRESS,
  MULTICALL_ABI,
  provider
);

export async function getOGRespect(address: string): Promise<number> {
  try {
    const balance = await erc20Contract.balanceOf(address);
    return Number(ethers.formatEther(balance));
  } catch (error) {
    console.error(`[Blockchain] OG Respect error for ${address}:`, error);
    return 0;
  }
}

export async function getZORRespect(address: string): Promise<number> {
  try {
    const balance = await erc1155Contract.balanceOf(address, 0);
    return Number(balance);
  } catch (error) {
    console.error(`[Blockchain] ZOR Respect error for ${address}:`, error);
    return 0;
  }
}

export async function getRespectBalances(address: string) {
  const [ogRespect, zorRespect] = await Promise.all([
    getOGRespect(address),
    getZORRespect(address),
  ]);

  return {
    ogRespect,
    zorRespect,
    totalRespect: ogRespect + zorRespect,
  };
}

export async function getHistoricFirstDate(address: string): Promise<string | undefined> {
  console.log(`[Blockchain] Looking up historic first date for ${address}...`);
  try {
    const params = {
      fromBlock: "0x0",
      toBlock: "latest",
      toAddress: address,
      contractAddresses: [
        process.env.ERC20_ZAO_CONTRACT!,
        process.env.ERC1155_ZOR_CONTRACT!
      ],
      category: ["erc20", "erc1155"],
      order: "asc",
      withMetadata: true,
      maxCount: "0x1"
    };

    const response = await (provider as any).send("alchemy_getAssetTransfers", [params]);
    const transfers = response.transfers;

    if (transfers && transfers.length > 0) {
      const firstTransfer = transfers[0];
      const timestamp = firstTransfer.metadata?.blockTimestamp;
      if (timestamp) {
        return timestamp.split('T')[0];
      }
    }
    return undefined;
  } catch (error) {
    console.error(`[Blockchain] Historic lookup failed for ${address}:`, error);
    return undefined;
  }
}

import { LeaderboardEntry } from '@/types/leaderboard';

export async function getBatchBalances(addresses: string[], existingData?: LeaderboardEntry[]) {
  console.log(`[Blockchain] Fetching batch balances for ${addresses.length} addresses...`);

  const calls: any[] = [];
  const erc20Interface = new ethers.Interface(ERC20_ABI);
  const erc1155Interface = new ethers.Interface(ERC1155_ABI);

  addresses.forEach(rawAddress => {
    const address = rawAddress.trim();
    // OG Respect (ERC20)
    calls.push({
      target: process.env.ERC20_ZAO_CONTRACT!,
      allowFailure: true,
      callData: erc20Interface.encodeFunctionData('balanceOf', [address])
    });
    // ZOR Respect (ERC1155)
    calls.push({
      target: process.env.ERC1155_ZOR_CONTRACT!,
      allowFailure: true,
      callData: erc1155Interface.encodeFunctionData('balanceOf', [address, 0])
    });
  });

  try {
    const results = await multicallContract.aggregate3.staticCall(calls);
    const balances = [];

    for (let i = 0; i < addresses.length; i++) {
      const address = addresses[i];
      const erc20Result = results[i * 2];
      const erc1155Result = results[i * 2 + 1];

      let ogRespect = 0;
      if (erc20Result.success) {
        const decoded = erc20Interface.decodeFunctionResult('balanceOf', erc20Result.returnData);
        ogRespect = Number(ethers.formatEther(decoded[0]));
      }

      let zorRespect = 0;
      if (erc1155Result.success) {
        const decoded = erc1155Interface.decodeFunctionResult('balanceOf', erc1155Result.returnData);
        zorRespect = Number(decoded[0]);
      }

      // Find if we already have a firstTokenDate for this user
      const existingUser = existingData?.find(u => u.address.toLowerCase() === address.toLowerCase());
      let firstTokenDate = existingUser?.firstTokenDate;

      // FETCH REAL DATE: If no date in cache and user has balance, fetch it from chain history
      if (!firstTokenDate && (ogRespect > 0 || zorRespect > 0)) {
        firstTokenDate = await getHistoricFirstDate(address);
      }

      balances.push({
        address,
        ogRespect,
        zorRespect,
        totalRespect: ogRespect + zorRespect,
        firstTokenDate
      });
    }

    return balances;
  } catch (error) {
    console.error('[Blockchain] Batch fetch error:', error);
    // Fallback to individual calls
    return Promise.all(addresses.map(async (address) => {
      const b = await getRespectBalances(address);
      const existingUser = existingData?.find(u => u.address.toLowerCase() === address.toLowerCase());
      let firstTokenDate = existingUser?.firstTokenDate;

      if (!firstTokenDate && b.totalRespect > 0) {
        firstTokenDate = await getHistoricFirstDate(address);
      }

      return {
        address,
        ...b,
        firstTokenDate
      };
    }));
  }
}
