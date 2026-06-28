import { z } from "zod";

export const membershipIdSchema = z.uuid();

export const userSchema = z.object({
    membershipId: membershipIdSchema,
    displayName: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export type User = z.infer<typeof userSchema>;
