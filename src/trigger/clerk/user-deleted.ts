import { schemaTask } from '@trigger.dev/sdk';
import { eq } from 'drizzle-orm';

import { getDb } from '@/db/client';
import { users } from '@/db/schema';

import { clerkUserDeletedPayload } from './user-payload';

// Foreign keys cascade, so this also removes the user's profile, targets,
// meals, items, weight logs and usage rows.
export const clerkUserDeleted = schemaTask({
  id: 'clerk-user-deleted',
  schema: clerkUserDeletedPayload,
  run: async ({ clerkUserId }) => {
    const db = getDb();
    await db.delete(users).where(eq(users.clerkUserId, clerkUserId));
    return { clerkUserId };
  },
});
