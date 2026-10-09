import { z } from 'zod';

export const clerkUserPayload = z.object({
  clerkUserId: z.string().min(1),
  email: z.string().nullable(),
});

export const clerkUserDeletedPayload = z.object({
  clerkUserId: z.string().min(1),
});
