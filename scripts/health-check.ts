import { ethers } from 'ethers';
import Airtable from 'airtable';
import path from 'path';

// No longer needs dotenv, run with: node --env-file=.env.local scripts/health-check.ts
// Or use: npm run health-check

async function checkAirtable() {
    console.log('--- Checking Airtable ---');
    try {
        const baseId = process.env.AIRTABLE_BASE_ID;
        const apiKey = process.env.AIRTABLE_API_TOKEN;
        const tableName = process.env.AIRTABLE_TABLE_NAME;

        if (!baseId || !apiKey || !tableName) {
            throw new Error('Airtable env variables are missing');
        }

        const base = new Airtable({ apiKey }).base(baseId);
        const records = await base(tableName).select({ maxRecords: 1 }).all();
        console.log(`✅ Airtable connection successful. Found ${records.length} records.`);
    } catch (error) {
        console.error('❌ Airtable check failed:', error instanceof Error ? error.message : error);
    }
}

async function checkBlockchain() {
    console.log('--- Checking Blockchain ---');
    try {
        const rpcUrl = process.env.ALCHEMY_OPTIMISM_RPC;
        const erc20Addr = process.env.ERC20_ZAO_CONTRACT;
        const erc1155Addr = process.env.ERC1155_ZOR_CONTRACT;

        if (!rpcUrl || !erc20Addr || !erc1155Addr) {
            throw new Error('Blockchain env variables are missing');
        }

        const provider = new ethers.JsonRpcProvider(rpcUrl);
        const network = await provider.getNetwork();
        console.log(`✅ RPC connection successful. Connected to network: ${network.name} (chainId: ${network.chainId})`);

        const blockNumber = await provider.getBlockNumber();
        console.log(`✅ Current block height: ${blockNumber}`);

        // Check Multicall
        const multicallAddr = "0xcA11bde05977b3631167028862bE2a173976CA11";
        const code = await provider.getCode(multicallAddr);
        if (code === '0x') {
            console.warn('⚠️ Multicall3 contract not found at address on this network.');
        } else {
            console.log('✅ Multicall3 contract verified at address.');
        }

    } catch (error) {
        console.error('❌ Blockchain check failed:', error instanceof Error ? error.message : error);
    }
}

async function runHealthCheck() {
    console.log('ZAO Leaderboard Health Check');
    console.log('============================');
    await checkAirtable();
    console.log('\n');
    await checkBlockchain();
    console.log('============================');
}

runHealthCheck();
