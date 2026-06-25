import { z } from "zod";
import { encounterComparisonResultSchema } from "./encounter-comparison-result.js";

export const guessResultSchema = z.object({
    guessId: z.string(),
    comparisonResult: encounterComparisonResultSchema,
    timestamp: z.date(),
});

export type GuessResult = z.infer<typeof guessResultSchema>;
