import Airtable from 'airtable';
import { AirtableRecord } from '@/types/leaderboard';

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_TOKEN,
}).base(process.env.AIRTABLE_BASE_ID!);

export async function fetchAirtableRecords(): Promise<AirtableRecord[]> {
  const tableName = process.env.AIRTABLE_TABLE_NAME!;
  console.log('[Airtable] Starting fetch...');
  console.log('[Airtable] Table name:', tableName);
  console.log('[Airtable] Base ID:', process.env.AIRTABLE_BASE_ID);
  console.log('[Airtable] API Token exists:', !!process.env.AIRTABLE_API_TOKEN);
  const records: AirtableRecord[] = [];

  try {
    console.log('[Airtable] Querying table...');
    const airtableRecords = await base(tableName)
      .select({
        view: 'Grid view',
      })
      .all();
    console.log(`[Airtable] Received ${airtableRecords.length} raw records`);

    for (const record of airtableRecords) {
      const name = record.get('Name') as string;
      const addressField = record.get('ETH WALLET (from Wallet Data 2)') as string[] | string;
      
      // Handle address field - it's an array in Airtable
      const address = Array.isArray(addressField) ? addressField[0] : addressField;
      
      console.log(`[Airtable] Record: name="${name}", address="${address}"`);

      if (name && address) {
        records.push({ name, address });
        console.log(`[Airtable] ✓ Added: ${name}`);
      } else {
        console.log(`[Airtable] ✗ Skipped (missing name or address)`);
      }
    }
    console.log(`[Airtable] Total valid records: ${records.length}`);

    return records;
  } catch (error) {
    console.error('[Airtable] ERROR - Failed to fetch records:', error);
    console.error('[Airtable] Error details:', error instanceof Error ? error.message : 'Unknown error');
    console.error('[Airtable] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    throw new Error('Failed to fetch Airtable data');
  }
}
