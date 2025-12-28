const { ethers } = require('ethers');

const ERC1155_ABI = [
  'function balanceOf(address account, uint256 id) view returns (uint256)',
  'function uri(uint256 id) view returns (string)',
];

const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_OPTIMISM_RPC);
const contract = new ethers.Contract(
  process.env.ERC1155_ZOR_CONTRACT,
  ERC1155_ABI,
  provider
);

const testAddress = '0x29F5DeE65E1Fb856B816EaB4f0B702c10e5Eaa34';

async function checkTokenIds() {
  console.log('Testing ERC1155 ZOR contract:', process.env.ERC1155_ZOR_CONTRACT);
  console.log('Test address:', testAddress);
  console.log('\nChecking token IDs 0-10...\n');

  for (let tokenId = 0; tokenId <= 10; tokenId++) {
    try {
      const balance = await contract.balanceOf(testAddress, tokenId);
      console.log(`Token ID ${tokenId}:`);
      console.log(`  Raw balance: ${balance.toString()}`);
      console.log(`  Formatted (18 decimals): ${ethers.formatEther(balance)}`);
      console.log(`  Formatted (0 decimals): ${balance.toString()}`);
      
      if (balance > 0) {
        try {
          const uri = await contract.uri(tokenId);
          console.log(`  URI: ${uri}`);
        } catch (e) {
          console.log(`  URI: (not available)`);
        }
      }
      console.log('');
    } catch (error) {
      console.log(`Token ID ${tokenId}: ERROR - ${error.message}\n`);
    }
  }
}

checkTokenIds().catch(console.error);
