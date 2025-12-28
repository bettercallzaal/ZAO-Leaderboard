import Airtable from 'airtable';
import { AirtableRecord } from '@/types/leaderboard';

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_TOKEN,
}).base(process.env.AIRTABLE_BASE_ID!);

export async function fetchAirtableRecords(): Promise<AirtableRecord[]> {
  const tableName = process.env.AIRTABLE_TABLE_NAME!;
  const records: AirtableRecord[] = [];

  try {
    const airtableRecords = await base(tableName)
      .select({
        view: 'Grid view',
      })
      .all();

    for (const record of airtableRecords) {
      const name = record.get('name') as string;
      const address = record.get('address') as string;

      if (name && address) {
        records.push({ name, address });
      }
    }

    return records;
  } catch (error) {
    console.error('Error fetching Airtable records:', error);
    throw new Error('Failed to fetch Airtable data');
  }
}
