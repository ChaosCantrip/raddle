import { z } from "zod";

export const dailyGuessRequestSchema = z.object({
    guess_id: z.string(),
});

export type DailyGuessRequest = z.infer<typeof dailyGuessRequestSchema>;
