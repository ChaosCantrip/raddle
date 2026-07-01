import { z } from "zod";

export const encounterIdSchema = z.string();

export const encounterSchema = z.object({
    id: encounterIdSchema,
    name: z.string(),
    enemyTypes: z.array(z.string()),
    activityType: z.string(),
    activity: z.string(),
    expansion: z.string(),
    encounters: z.array(z.number()),
    searchTerms: z.array(z.string()),
});

export type Encounter = z.infer<typeof encounterSchema>;
