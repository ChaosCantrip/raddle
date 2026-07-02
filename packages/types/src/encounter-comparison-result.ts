import type { GridCellState } from "./grid-cell-state.js";

export type EncounterComparisonResult = {
    name: GridCellState;
    activity_type: GridCellState;
    activity: GridCellState;
    enemy_types: GridCellState;
    encounters: GridCellState;
    expansion: GridCellState;
}
