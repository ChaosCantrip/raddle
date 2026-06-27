import { z } from "zod";

export const encounterIdSchema = z.string();

export const encounterSchema = z.object({
    id: encounterIdSchema,
    name: z.string(),
    enemy_types: z.array(z.string()),
    activity_type: z.string(),
    activity: z.string(),
    expansion: z.string(),
    encounters: z.array(z.number()),
    search_terms: z.array(z.string()),
});

export type Encounter = z.infer<typeof encounterSchema>;
