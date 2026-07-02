import { z } from "zod";

import { encounterSchema } from "./temp.js";
import { GridCellState } from "./grid-cell-state.js";

const gridCellStateSchema = z.enum([
    GridCellState.empty,
    GridCellState.grey,
    GridCellState.yellow,
    GridCellState.green,
]);

export const guessPairSchema = z.object({
    encounter: encounterSchema,
    cellStates: z.array(gridCellStateSchema),
    id: z.number().optional(),
});

export type GuessPair = z.infer<typeof guessPairSchema>;
