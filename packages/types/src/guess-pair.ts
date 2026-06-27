import { z } from "zod";

import { encounterSchema } from "./encounter.js";
import { gridCellStateSchema } from "./grid-cell-state.js";

export const guessPairSchema = z.object({
    encounter: encounterSchema,
    cellStates: z.array(gridCellStateSchema),
    id: z.number().optional(),
});

export type GuessPair = z.infer<typeof guessPairSchema>;
