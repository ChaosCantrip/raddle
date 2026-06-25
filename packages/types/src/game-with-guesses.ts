import { z } from "zod";

import { gameSchema } from "./game.js";
import { guessSchema } from "./guess.js";

export const gameWithGuessesSchema = gameSchema.and(
    z.object({
        guesses: z.array(guessSchema),
    }),
);

export type GameWithGuesses = z.infer<typeof gameWithGuessesSchema>;
