import { z } from "zod";

import { encounterIdSchema } from "./encounter.js";

const encounterComparisonResultSchema = z.object({
    name: z.enum(["empty", "grey", "yellow", "green"]),
    activity_type: z.enum(["empty", "grey", "yellow", "green"]),
    activity: z.enum(["empty", "grey", "yellow", "green"]),
    enemy_types: z.enum(["empty", "grey", "yellow", "green"]),
    encounters: z.enum(["empty", "grey", "yellow", "green"]),
    expansion: z.enum(["empty", "grey", "yellow", "green"])
});

export const guessSchema = z.object({
    encounterId: encounterIdSchema,
    comparisonResult: encounterComparisonResultSchema,
    createdAt: z.date(),
});

export type Guess = z.infer<typeof guessSchema>;
