import { schemaTask } from '@trigger.dev/sdk';

import { getDb } from '@/db/client';
import { users } from '@/db/schema';

import { clerkUserPayload } from './user-payload';

// Upsert, not insert: Clerk can retry deliveries, and `user.updated` can arrive
// before `user.created`.
export const clerkUserCreated = schemaTask({
  id: 'clerk-user-created',
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
