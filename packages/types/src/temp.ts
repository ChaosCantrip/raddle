import { z } from "zod";

export const encounterSchema = z.object({
    id: z.string(),
    name: z.string(),
    enemyTypes: z.array(z.string()),
    activityType: z.string(),
    activity: z.string(),
    expansion: z.string(),
    encounters: z.array(z.number()),
    searchTerms: z.array(z.string()),
});

export const encounterIdSchema = z.string();

export const gameModeSchema = z.enum(["daily", "arcade"]);

export const gameStateSchema = z.enum(["complete", "incomplete", "abandoned"]);
