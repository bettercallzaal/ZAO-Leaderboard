import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const ERC1155_ABI = [
  'function balanceOf(address account, uint256 id) view returns (uint256)',
];

const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_OPTIMISM_RPC);
const contract = new ethers.Contract(
  process.env.ERC1155_ZOR_CONTRACT,
  ERC1155_ABI,
  provider
);

const testAddress = '0x29F5DeE65E1Fb856B816EaB4f0B702c10e5Eaa34';

console.log('Testing ERC1155 ZOR contract:', process.env.ERC1155_ZOR_CONTRACT);
console.log('Test address:', testAddress);
console.log('\nChecking token IDs 0-5...\n');

for (let tokenId = 0; tokenId <= 5; tokenId++) {
  try {
    const balance = await contract.balanceOf(testAddress, tokenId);
    console.log(`Token ID ${tokenId}:`);
    console.log(`  Raw balance: ${balance.toString()}`);
    console.log(`  As number: ${Number(balance)}`);
    console.log(`  With 18 decimals: ${ethers.formatEther(balance)}`);
    console.log(`  With 0 decimals: ${balance.toString()}`);
    console.log('');
  } catch (error) {
    console.log(`Token ID ${tokenId}: ERROR - ${error.message}\n`);
  }
}
