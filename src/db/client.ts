import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

import * as schema from './schema';

// Shared by API routes and Trigger.dev tasks. Server-side only: never import
// this from app screens, since DATABASE_URL must not reach the client bundle.
export function getDb(url = process.env.DATABASE_URL) {
  if (!url) throw new Error('DATABASE_URL is not set');
  return drizzle({ client: neon(url), schema });
}

export type Db = ReturnType<typeof getDb>;
