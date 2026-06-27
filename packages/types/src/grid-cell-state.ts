import { z } from "zod";

export const gridCellStateSchema = z.enum([
    "Empty",
    "Grey",
    "Yellow",
    "Green"
]);

export type GridCellState = z.infer<typeof gridCellStateSchema>;
export const GridCellState = gridCellStateSchema.enum;
