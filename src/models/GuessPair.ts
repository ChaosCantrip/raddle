import Encounter from "./Encounter";
import GridCellState from "./GridCellState";

interface GuessPair {
    encounter: Encounter;
    cellStates: GridCellState[];
    id?: number;
}

export default GuessPair;
