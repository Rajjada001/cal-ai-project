import { verifyWebhook } from '@clerk/backend/webhooks';
import { idempotencyKeys, tasks } from '@trigger.dev/sdk';

import type { clerkUserCreated } from '@/trigger/clerk/user-created';
import type { clerkUserDeleted } from '@/trigger/clerk/user-deleted';
import type { clerkUserUpdated } from '@/trigger/clerk/user-updated';

// Verify the Clerk signature, hand the event to Trigger.dev, and return fast.
// The database write happens in the task, which retries on failure.
export async function POST(request: Request) {
  // Clerk (Svix) sets this on every delivery and reuses it on retries.
  const deliveryId = request.headers.get('svix-id');

  let evt;
  try {
    evt = await verifyWebhook(request, {
      signingSecret: process.env.CLERK_WEBHOOK_SIGNING_SECRET,
    });
  } catch {
    return new Response('Verification failed', { status: 400 });
  }

  // A retried delivery maps to the same run instead of triggering a duplicate.
  const idempotencyKey = deliveryId
    ? await idempotencyKeys.create(deliveryId, { scope: 'global' })
    : undefined;

  switch (evt.type) {
    case 'user.created':
    case 'user.updated': {
      const { id, email_addresses, primary_email_address_id } = evt.data;
      const email =
        email_addresses.find((e) => e.id === primary_email_address_id)?.email_address ??
        email_addresses[0]?.email_address ??
        null;
      const payload = { clerkUserId: id, email };

      if (evt.type === 'user.created') {
        await tasks.trigger<typeof clerkUserCreated>('clerk-user-created', payload, {
          idempotencyKey,
        });
      } else {
        await tasks.trigger<typeof clerkUserUpdated>('clerk-user-updated', payload, {
          idempotencyKey,
        });
      }
      break;
    }
    case 'user.deleted': {
      if (evt.data.id) {
        await tasks.trigger<typeof clerkUserDeleted>(
          'clerk-user-deleted',
          { clerkUserId: evt.data.id },
          { idempotencyKey },
        );
      }
      break;
    }
    default:
      // Other subscribed events are acknowledged and ignored.
      break;
  }

  return new Response('OK', { status: 200 });
}
