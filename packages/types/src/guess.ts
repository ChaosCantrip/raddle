import { z } from "zod";

import { encounterComparisonResultSchema } from "./encounter-comparison-result.js";
import { encounterIdSchema } from "./encounter.js";

export const guessSchema = z.object({
    encounterId: encounterIdSchema,
    comparisonResult: encounterComparisonResultSchema,
    createdAt: z.date(),
});

export type Guess = z.infer<typeof guessSchema>;
