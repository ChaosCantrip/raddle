import { z } from "zod";

export const gameStateSchema = z.enum([
    "complete",
    "incomplete",
    "abandoned"
]);

export type GameState = z.infer<typeof gameStateSchema>;
export const GameState = gameStateSchema.enum;
