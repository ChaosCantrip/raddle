import { z } from "zod";

const gridCellStates = [
    "Empty",
    "Grey",
    "Yellow",
    "Green"
];

export const gridCellStateSchema = z.enum(gridCellStates);
export type GridCellState = z.infer<typeof gridCellStateSchema>;
export const GridCellState = gridCellStateSchema.enum;
