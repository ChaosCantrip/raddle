import type { GridCellState } from "./GridCellState";

export interface EncounterComparisonResult {
    name: GridCellState,
    activity_type: GridCellState,
    activity: GridCellState,
    enemy_types: GridCellState,
    encounters: GridCellState,
    expansion: GridCellState
}
