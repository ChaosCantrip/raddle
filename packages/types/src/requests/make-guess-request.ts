import { z } from "zod";
import { encounterIdSchema } from "../encounter.js";
import { gameIdSchema } from "../game.js";
import { gameModeSchema } from "../game-mode.js";

export const MakeGuessRequestSchema = z.object({
    guessId: encounterIdSchema,
    gameMode: gameModeSchema,
    gameId: gameIdSchema.optional(),
});

export type MakeGuessRequest = z.infer<typeof MakeGuessRequestSchema>;
