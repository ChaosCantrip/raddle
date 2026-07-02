import { z } from "zod";

const encounterComparisonResultSchema = z.object({
    name: z.enum(["empty", "grey", "yellow", "green"]),
    activity_type: z.enum(["empty", "grey", "yellow", "green"]),
    activity: z.enum(["empty", "grey", "yellow", "green"]),
    enemy_types: z.enum(["empty", "grey", "yellow", "green"]),
    encounters: z.enum(["empty", "grey", "yellow", "green"]),
    expansion: z.enum(["empty", "grey", "yellow", "green"])
});

export const correctResultSchema = z.object({
    result: z.literal("correct"),
    place: z.number().optional(),
});

export const incorrectResultSchema = z.object({
    result: z.literal("incorrect"),
    comparisons: encounterComparisonResultSchema,
});

export const errorResultSchema = z.object({
    error: z.string(),
});

export const nonErrorResultSchema = z.discriminatedUnion("result", [
    correctResultSchema,
    incorrectResultSchema,
]);

export const guessResponseSchema = z.union([
    correctResultSchema,
    incorrectResultSchema,
    errorResultSchema,
]);

export type CorrectResult = z.infer<typeof correctResultSchema>;
export type IncorrectResult = z.infer<typeof incorrectResultSchema>;
export type ErrorResult = z.infer<typeof errorResultSchema>;
export type NonErrorResult = z.infer<typeof nonErrorResultSchema>;
export type GuessResponse = z.infer<typeof guessResponseSchema>;
