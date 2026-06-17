export const GridCellState = {
    Empty: "Empty",
    Grey: "Grey",
    Yellow: "Yellow",
    Green: "Green"
} as const;

export type GridCellState = typeof GridCellState[keyof typeof GridCellState];
