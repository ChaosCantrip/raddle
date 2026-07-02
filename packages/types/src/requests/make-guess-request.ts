import { z } from "zod";

import { encounterIdSchema } from "../temp.js";
import { gameIdSchema } from "../game.js";
import { gameModeSchema } from "../temp.js";

export const MakeGuessRequestSchema = z.object({
    guessId: encounterIdSchema,
    gameMode: gameModeSchema,
    gameId: gameIdSchema.optional(),
});

export type MakeGuessRequest = z.infer<typeof MakeGuessRequestSchema>;
