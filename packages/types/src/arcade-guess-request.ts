import { z } from "zod";

export const arcadeGuessRequestSchema = z.object({
    guess_id: z.string(),
    answer_id: z.string(),
});

export type ArcadeGuessRequest = z.infer<typeof arcadeGuessRequestSchema>;
