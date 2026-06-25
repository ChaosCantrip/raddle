import { z } from "zod";

const gameModes = [
    "daily",
    "arcade"
];

export const gameModeSchema = z.enum(gameModes);

export type GameMode = z.infer<typeof gameModeSchema>;
export const GameMode = gameModeSchema.enum;
