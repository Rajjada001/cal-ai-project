import 'dotenv/config';
import { sql } from 'drizzle-orm';

import { getDb } from '../src/db/client';

async function main() {
  const db = getDb();
  const res = await db.execute(
    sql`select table_name from information_schema.tables where table_schema = 'public' order by table_name`,
  );
  console.log(res.rows.map((r) => r.table_name).join('\n'));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
