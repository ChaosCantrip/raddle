import GridCellState from "./GridCellState";

interface EncounterComparisonResult {
    name: GridCellState,
    activity_type: GridCellState,
    activity: GridCellState,
    enemy_types: GridCellState,
    encounters: GridCellState,
    expansion: GridCellState
}

export default EncounterComparisonResult;
