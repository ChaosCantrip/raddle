import type { Encounter } from "./Encounter.js";
import type { GridCellState } from "./GridCellState.js";

export interface GuessPair {
    encounter: Encounter;
    cellStates: GridCellState[];
    id?: number;
}
