import { z } from "zod";
import type { ObjectId } from "mongodb";
import { encounterIdSchema } from "./encounter.js";
import { gameModeSchema } from "./game-mode.js";
import { gameStateSchema } from "./game-state.js";
import { guessSchema } from "./guess.js";

export const gameIdSchema = z.string();

const dailyExtension = {
    gameMode: z.literal("daily"),
    dailyDate: z.string(),
};

const arcadeExtension = {
    gameMode: z.literal("arcade"),
};

export const baseGameSchema = z.object({
    _id: z.custom<ObjectId>(),
    id: gameIdSchema,
    gameMode: gameModeSchema,
    gameState: gameStateSchema,
    answerId: encounterIdSchema,
    guesses: z.array(guessSchema),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const completedGameSchema = baseGameSchema.extend({
    gameState: z.literal("complete"),
    completedAt: z.date(),
});

export const incompleteGameSchema = baseGameSchema.extend({
    gameState: z.literal("incomplete"),
});

export const abandonedGameSchema = baseGameSchema.extend({
    gameState: z.literal("abandoned"),
    abandonedAt: z.date(),
});

export const dailyGameSchema = baseGameSchema.extend(dailyExtension);
export const arcadeGameSchema = baseGameSchema.extend(arcadeExtension);

export const completedDailyGameSchema = completedGameSchema.extend(dailyExtension);
export const completedArcadeGameSchema = completedGameSchema.extend(arcadeExtension);
export const incompleteDailyGameSchema = incompleteGameSchema.extend(dailyExtension);
export const incompleteArcadeGameSchema = incompleteGameSchema.extend(arcadeExtension);
export const abandonedDailyGameSchema = abandonedGameSchema.extend(dailyExtension);
export const abandonedArcadeGameSchema = abandonedGameSchema.extend(arcadeExtension);

export const gameSchema = z.union([
    completedDailyGameSchema,
    completedArcadeGameSchema,
    incompleteDailyGameSchema,
    incompleteArcadeGameSchema,
    abandonedDailyGameSchema,
    abandonedArcadeGameSchema,
]);

export type BaseGame = z.infer<typeof baseGameSchema>;
export type CompletedGame = z.infer<typeof completedGameSchema>;
export type IncompleteGame = z.infer<typeof incompleteGameSchema>;
export type AbandonedGame = z.infer<typeof abandonedGameSchema>;
export type DailyGame = z.infer<typeof dailyGameSchema>;
export type ArcadeGame = z.infer<typeof arcadeGameSchema>;
export type CompletedDailyGame = z.infer<typeof completedDailyGameSchema>;
export type CompletedArcadeGame = z.infer<typeof completedArcadeGameSchema>;
export type IncompleteDailyGame = z.infer<typeof incompleteDailyGameSchema>;
export type IncompleteArcadeGame = z.infer<typeof incompleteArcadeGameSchema>;
export type AbandonedDailyGame = z.infer<typeof abandonedDailyGameSchema>;
export type AbandonedArcadeGame = z.infer<typeof abandonedArcadeGameSchema>;
export type Game = z.infer<typeof gameSchema>;
