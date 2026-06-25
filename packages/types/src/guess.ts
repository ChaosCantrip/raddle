import { z } from "zod";
import type { ObjectId } from "mongodb";

import { encounterComparisonResultSchema } from "./encounter-comparison-result.js";
import { encounterIdSchema } from "./encounter.js";
import { gameIdSchema } from "./game.js";

export const guessSchema = z.object({
    _id: z.custom<ObjectId>(),
    gameId: gameIdSchema,
    encounterId: encounterIdSchema,
    comparisonResult: encounterComparisonResultSchema,
    createdAt: z.date(),
});

export type Guess = z.infer<typeof guessSchema>;
