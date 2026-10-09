import { schemaTask } from '@trigger.dev/sdk';

import { getDb } from '@/db/client';
import { users } from '@/db/schema';

import { clerkUserPayload } from './user-payload';

// Also an upsert, so an update for a user we haven't stored yet creates the row.
export const clerkUserUpdated = schemaTask({
  id: 'clerk-user-updated',
  schema: clerkUserPayload,
  run: async ({ clerkUserId, email }) => {
    const db = getDb();
    await db
      .insert(users)
      .values({ clerkUserId, email })
      .onConflictDoUpdate({ target: users.clerkUserId, set: { email } });
    return { clerkUserId };
  },
});
