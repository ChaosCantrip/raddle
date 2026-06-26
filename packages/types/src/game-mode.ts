import { z } from "zod";

export const gameModeSchema = z.enum([
    "daily",
    "arcade"
]);

export type GameMode = z.infer<typeof gameModeSchema>;
export const GameMode = gameModeSchema.enum;
