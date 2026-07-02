import { z } from "zod";

import { encounterIdSchema } from "./temp.js";
import { GameMode, gameModeSchema } from "./game-mode.js";
import { GameState, gameStateSchema } from "./game-state.js";
import { guessSchema } from "./guess.js";

export const gameIdSchema = z.uuid();

const dailyExtension = {
    gameMode: z.literal(GameMode.daily),
    dailyDate: z.string(),
};

const arcadeExtension = {
    gameMode: z.literal(GameMode.arcade),
};

export const arcadeCompletionDetailsSchema = z.object({
    numGuesses: z.number().int().nonnegative(),
    completedAt: z.date(),
});

export const dailyCompletionDetailsSchema = arcadeCompletionDetailsSchema.extend({
    position: z.number().int().nonnegative()
});

export const completionDetailsSchema = z.union([dailyCompletionDetailsSchema, arcadeCompletionDetailsSchema]);

const completedDailyExtension = {
    completionDetails: dailyCompletionDetailsSchema,
};

const completedArcadeExtension = {
    completionDetails: arcadeCompletionDetailsSchema,
};

export const baseGameSchema = z.object({
    id: gameIdSchema,
    gameMode: gameModeSchema,
    gameState: gameStateSchema,
    answerId: encounterIdSchema,
    guesses: z.array(guessSchema),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const completedGameSchema = baseGameSchema.extend({
    gameState: z.literal(GameState.complete),
    completionDetails: completionDetailsSchema,
});

export const incompleteGameSchema = baseGameSchema.extend({
    gameState: z.literal(GameState.incomplete),
});

export const abandonedGameSchema = baseGameSchema.extend({
    gameState: z.literal(GameState.abandoned),
    abandonedAt: z.date(),
});

export const dailyGameSchema = baseGameSchema.extend(dailyExtension);
export const arcadeGameSchema = baseGameSchema.extend(arcadeExtension);

export const completedDailyGameSchema = completedGameSchema.extend(dailyExtension).extend(completedDailyExtension);
export const completedArcadeGameSchema = completedGameSchema.extend(arcadeExtension).extend(completedArcadeExtension);
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
export type CompletionDetails = z.infer<typeof completionDetailsSchema>;
export type ArcadeCompletionDetails = z.infer<typeof arcadeCompletionDetailsSchema>;
export type DailyCompletionDetails = z.infer<typeof dailyCompletionDetailsSchema>;
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
