import { z } from "zod";

const gameStates = [
    "complete",
    "incomplete",
    "abandoned"
];

export const gameStateSchema = z.enum(gameStates);

export type GameState = z.infer<typeof gameStateSchema>;
export const GameState = gameStateSchema.enum;
