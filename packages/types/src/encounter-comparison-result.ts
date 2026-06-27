import { z } from "zod";

import { gridCellStateSchema } from "./grid-cell-state.js";

export const encounterComparisonResultSchema = z.object({
    name: gridCellStateSchema,
    activity_type: gridCellStateSchema,
    activity: gridCellStateSchema,
    enemy_types: gridCellStateSchema,
    encounters: gridCellStateSchema,
    expansion: gridCellStateSchema,
});

export type EncounterComparisonResult = z.infer<typeof encounterComparisonResultSchema>;
