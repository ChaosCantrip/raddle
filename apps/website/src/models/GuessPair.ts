import type { Encounter } from "./Encounter";
import type { GridCellState } from "./GridCellState";

export interface GuessPair {
    encounter: Encounter;
    cellStates: GridCellState[];
    id?: number;
}
