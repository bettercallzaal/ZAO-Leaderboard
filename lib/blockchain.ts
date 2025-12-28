import { ethers } from 'ethers';
import { ERC20_ABI, ERC1155_ABI } from './contracts';

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

export async function getOGRespect(address: string): Promise<number> {
  try {
    const balance = await erc20Contract.balanceOf(address);
    return Number(ethers.formatEther(balance));
  } catch (error) {
    console.error(`Error fetching OG Respect for ${address}:`, error);
    return 0;
  }
}

export async function getZORRespect(address: string): Promise<number> {
  try {
    const balance = await erc1155Contract.balanceOf(address, 0);
    return Number(ethers.formatEther(balance));
  } catch (error) {
    console.error(`Error fetching ZOR Respect for ${address}:`, error);
    return 0;
  }
}

export async function getRespectBalances(address: string): Promise<{
  ogRespect: number;
  zorRespect: number;
  totalRespect: number;
}> {
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
