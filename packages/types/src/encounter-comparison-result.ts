import { z } from "zod";

import { GridCellState } from "./grid-cell-state.js";

const gridCellStateSchema = z.enum([
    GridCellState.empty,
    GridCellState.grey,
    GridCellState.yellow,
    GridCellState.green,
]);

export const encounterComparisonResultSchema = z.object({
    name: gridCellStateSchema,
    activity_type: gridCellStateSchema,
    activity: gridCellStateSchema,
    enemy_types: gridCellStateSchema,
    encounters: gridCellStateSchema,
    expansion: gridCellStateSchema,
});

export type EncounterComparisonResult = z.infer<typeof encounterComparisonResultSchema>;
